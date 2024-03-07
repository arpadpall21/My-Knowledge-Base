const colorMap = {
  preElement: {
    background: {
      primary: '#f2f2f0',
      secondary: '#e8e8e8',
    },
    comment: {
      info: '#707070',
      warning: '#e19a00',
      error: 'orangered',
      return: 'cornflowerblue',
    },
  },
  preSyntaxElement: {
    background: {
      primary: '#4b4b4b',
      secondary: '#454545',
    },
    comment: {
      info: '#56b053',
      warning: '#e19a00',
      error: 'orangered',
      return: 'cornflowerblue',
    },
  }
}

const extraSpaceAfterLatestCharacter = 3;
const extraSpaceAfterLatestCharacterSecondary = 3;
const ignoreCommentFormatingUpToCharacter = 20;
const recognizedEntities = ['&lt;', '&gt;', '&amp;'];

/**
 * @param {string} line
 * @returns {number}
 */
function getLineLengthWithoutComment(line) {
  if (line.startsWith('//')) {
    return 0;
  }

  let currentLine = line;
  const commentIndex = line.indexOf('//');

  if (commentIndex > 0) {
    currentLine = line.substring(0, commentIndex).trimEnd();
  }

  const numberOfOpenableTags = currentLine.match(/class="openable"/g) ? currentLine.match(/class="openable"/g) : [];
  const noEntities = currentLine.replace(new RegExp(`${recognizedEntities.join('|')}`, 'g'), '*')
  const noDiv = noEntities.replace(/<div\b[^>]*>(.*?)<\/div>/gi, '');
  const noHtmlTag = noDiv.replace(/<[^>]+>/g, '');

  return noHtmlTag.length + numberOfOpenableTags.length;
}

/**
 * @param {string} line
 * @returns {string} clearedLine
 */
function removeWrapingTagsIfLineHasStartTag(line) {
  if (line.startsWith('<')) {
    return line.replace(/^<[^>]+>\s*|\s*<\/[^>]+>$/g, '');
  }

  return line;
}

/**
 * @param {string[]} lines
 * @returns {number}
 */
function getFarthestCharacterForEachLine(lines) {
  const result = {
    lines: [],
    farthestCharacter: 0,
  }

  for (let line of lines) {
    const realLineLengthWithoutComment = getLineLengthWithoutComment(line);
    const tagWrapedlessLine = removeWrapingTagsIfLineHasStartTag(line);

    result.lines.push({ line: tagWrapedlessLine, realLineLengthWithoutComment })
    result.farthestCharacter = realLineLengthWithoutComment > result.farthestCharacter 
      ? realLineLengthWithoutComment 
      : result.farthestCharacter;
  }

  result.farthestCharacter += extraSpaceAfterLatestCharacter;

  return result;
}

/**
 * @param {string} line
 * @returns {string} nonClosedOpenable
 */
function getNonClosedOpenable(line) {
  const openerOpenables = line.match(/(?<=<)[a-z|A-Z]*(?= class="openable")/g);

  if (openerOpenables === null) {
    return '';
  }

  const openerOpenableOpenCounted = openerOpenables.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  for (let openerOpenable in openerOpenableOpenCounted) {
    const allOpenerTags = line.match(new RegExp(`</${openerOpenable}>|<${openerOpenable}( |>)`, 'g'));

    if (allOpenerTags && allOpenerTags.length % 2 !== 0) {
      return openerOpenable
    }
  }

  return '';
}

/**
 * @param {string} line
 * @param {string} nonClosedOpenable
 * @returns {boolean}
 */
function isNonClosedOpenableClosed(line, nonClosedOpenable) {
  return new RegExp(`</${nonClosedOpenable}>`).test(line);
}

/**
 * @param {HTMLElement} preElement
 * @returns {string[]}
 */
function getLines(preElement) {
  const result = [];
  const multilineOpenableCollector = { nonClosedOpenable: '', lineCollection: '' };

  for (const line of preElement.innerHTML.split('\n')) {
    if (multilineOpenableCollector.nonClosedOpenable) {
      if (isNonClosedOpenableClosed(line, multilineOpenableCollector.nonClosedOpenable)) {
        const nonClosedOpenable = getNonClosedOpenable(line);

        if (nonClosedOpenable) {
          multilineOpenableCollector.nonClosedOpenable = nonClosedOpenable;
          multilineOpenableCollector.lineCollection += line;
          continue;
        } else {
          result.push(multilineOpenableCollector.lineCollection += line);
          multilineOpenableCollector.nonClosedOpenable = '';
          multilineOpenableCollector.lineCollection = '';
          continue;
        }

      } else {
        multilineOpenableCollector.lineCollection += line;
        continue;
      }
    }

    const nonClosedOpenable = getNonClosedOpenable(line);

    if (nonClosedOpenable) {
      multilineOpenableCollector.nonClosedOpenable = nonClosedOpenable;
      multilineOpenableCollector.lineCollection += line;
      continue;
    }

    result.push(line);
  }

  console.log(result);

  return result;
}

/**
 * @param {string} line
 * @returns {string}
 */
function colorComments(line, commentColors) {
  return line.replace(/\/\/.*/, (match) => {
      if (match.startsWith('// -!')) {
        return `<span style="color:${commentColors.warning}">${match}</span>`;
      } else if (match.startsWith('// !!')) {
        return `<span style="color:${commentColors.error}">${match}</span>`;
      } else if (match.startsWith('// -&gt;')) {
        return `<span style="color:${commentColors.return}">${match}</span>`;
      } else {
        return `<span style="color:${commentColors.info}">${match}</span>`;
      }
  })
}

/**
 * @param {object} farthestCharacterForEachLine
 * @returns {string[]}
 */
function formatLines(farthestCharacterForEachLine) {
  const result = [];

  for (let lineObj of farthestCharacterForEachLine.lines) {
    if (lineObj.line.substring(1, ignoreCommentFormatingUpToCharacter).indexOf('//') > -1) {
      result.push(lineObj.line);
      continue;
    } else if (lineObj.line.startsWith('//')) {
      let entitiesLength = 0;

      if (/<[^>]+>/.test(lineObj.line)) {
        entitiesLength = lineObj.line.match(/<[^>]+>/g).join('').length;
      }

      const paddedLine = lineObj.line.padEnd(farthestCharacterForEachLine.farthestCharacter + entitiesLength, '-');
      const shortenedLine = paddedLine.substring(0, farthestCharacterForEachLine.farthestCharacter + entitiesLength);

      result.push(shortenedLine);
      continue;
    } else if (lineObj.line.indexOf('//') > -1) {
      const commentIndex = lineObj.line.indexOf('//');
      const comment = lineObj.line.substring(commentIndex);
      const beforeComment = lineObj.line.substring(0, lineObj.line.indexOf('//')).trimEnd();
      let padDistance = farthestCharacterForEachLine.farthestCharacter - getLineLengthWithoutComment(lineObj.line);

      if (lineObj.line.indexOf('///') > 0) {
        padDistance += extraSpaceAfterLatestCharacterSecondary;
      }

      const paddedLine = beforeComment.padEnd(beforeComment.length + padDistance, ' ') + comment;
      result.push(paddedLine);
      continue;
    }

    result.push(lineObj.line);
  }

  return result;
}

$(document).ready(function () {
// format pre elements
// -------------------------------------------------------------------------------------
  for (let preElement of $('pre')) {
    let result = '';
    let evenOdd = true;
    let color = colorMap.preElement;

    if (preElement.classList.contains('syntax')) {
      color = colorMap.preSyntaxElement;
    }

    const lines = getLines(preElement);
    const farthestCharacterForEachLine = getFarthestCharacterForEachLine(lines);
    const formatedLines = formatLines(farthestCharacterForEachLine);

    for (let line of formatedLines) {
      const coloredLine = colorComments(line, color.comment);
      result += `<div style="background-color:${evenOdd ? color.background.primary: color.background.secondary};">${coloredLine}</div>`;
      evenOdd = !evenOdd;
    }

    preElement.innerHTML = result;
  }

  $('.openable').mouseup(function () {
    if (window.getComputedStyle(this.querySelector('div')).display === 'block') {
      this.querySelector('.openable > div').style.display = 'none';
      this.querySelector('.openable > div').style.position = 'static';
    } else {
      this.querySelector('.openable > div').style.display = 'block';
      this.querySelector('.openable > div').style.position = 'absolute';
    }
  });








// format notes section
// -------------------------------------------------------------------------------------
  if (!document.getElementById("notes")) {
  } else {
    if (!document.getElementById("notes").querySelector("p")) {
      $("#notes summary").append(" (empty)");
    }
  }



  // -------------------------------------------------------------------------------------
  // table order (alphabetically / grouped) ----------------------------------------------
  if (document.querySelector('.table caption span[class=changeListOrder]')) {          // run this code only if the page has v4.0.0 table 
    let tables = document.querySelectorAll('.table');

    function openableToggle() {
      if (window.getComputedStyle(this.querySelector('div')).display === 'block') {
        this.querySelector('div').style.display = 'none';
        this.querySelector('div').style.position = 'static';
      } else {
        this.querySelector('div').style.display = 'block';
        this.querySelector('div').style.position = 'absolute';
      }
    }

    for (a = 0; a < tables.length; a++) {
      let curTable = tables[a];
      let orgTable = curTable.cloneNode(true);                                    // copy made to keep the original layout        
      let curOrdSpan = curTable.firstElementChild.lastElementChild;               // the span element that when clicked changes the table state   
      let clickSpan = curOrdSpan.firstElementChild;

      let nthTable = a;
      let tblStGrouped = sessionStorage.getItem(`tb_${nthTable}_lStGrouped`);

      function tableHandler(ev) {
        if (tblStGrouped === 'yes') {
          clickSpan.innerHTML = 'Grouped';

          tblStGrouped = 'no';
          sessionStorage.setItem(`tb_${nthTable}_lStGrouped`, 'yes');

          let rows = curTable.querySelectorAll('tbody tr[class]');
          let rowsObj = {}
          let rowNames = [];
          let loopItCounter = 0;

          rows.forEach(function (node, key, nodeList) {
            rowsObj[node.className] = node;
            rowNames.push(node.className);
            node.remove();

            loopItCounter++;
            if (loopItCounter == rows.length) {                              // once all rows are removed runs this code 
              rowNames.sort();

              for (i = 0; i < rows.length; i++) {
                let currentRowName = Number.parseInt(rowNames[i]);
                let nextRowName = Number.parseInt(rowNames[i + 1]);

                if (currentRowName == nextRowName) {
                  curTable.querySelector('tbody').appendChild(rowsObj[rowNames[i]])
                } else {
                  curTable.querySelector('tbody').appendChild(rowsObj[rowNames[i]]);

                  let emptyRow = document.createElement('tr')
                  let emptyRow2 = document.createElement('tr')
                  curTable.querySelector('tbody').append(emptyRow);
                  curTable.querySelector('tbody').append(emptyRow2);

                  let children = ''
                  let cellNumbers = curTable.querySelectorAll('tbody tr th').length
                  for (k = 0; k < cellNumbers; k++) {
                    children += '<td> &nbsp; </td>';
                  }
                  emptyRow.outerHTML = "<tr style='background-color:initial'>" + children + "</tr>";
                  emptyRow2.outerHTML = "<tr style='background-color:initial'>" + children + "</tr>";
                }
              }
            }
          })

          curTable.querySelectorAll('td').forEach(function (node) {
            let td = node.style;
            td.fontFamily = 'monospace';
            td.fontSize = '1em';
            td.textIndent = '-25px';
            td.paddingLeft = '30px';

          })
          curTable.querySelectorAll('tr').forEach(function (node) {
            let td = node.style;
            td.backgroundColor = '#4b4b4b';
            td.color = 'white';
          })

          curTable.querySelectorAll('.openable').forEach(function (node) {
            node.addEventListener('mouseup', openableToggle)
          })

        } else {
          clickSpan.innerHTML = 'Alphabetically';

          tblStGrouped = 'yes';
          sessionStorage.setItem(`tb_${nthTable}_lStGrouped`, 'no');

          curTable.querySelector('tbody').remove();
          let orgTable_copy = orgTable.cloneNode(true);                   // clone a new copy in order to keep the original table
          curTable.append(orgTable_copy.querySelector('tbody'));

          curTable.querySelectorAll('.openable').forEach(function (node) {
            node.addEventListener('mouseup', openableToggle)
          })
        }
      }
      tableHandler();

      curOrdSpan.addEventListener('mouseup', tableHandler)
    }
  }

  // toggle ver.4.0.0 table statuses  
  const tableSwitchCol = document.getElementsByClassName('changeListOrder');
  let ctrKeyPressed = false;
  let oKeyPressed = false;
  var mouseUpEv = new Event('mouseup', { bubbles: true })

  document.documentElement.addEventListener('keydown', function (ev) {
    if (ev.key === 'Control') ctrKeyPressed = true;
    if (ev.key === 'o') oKeyPressed = true;
    if (ctrKeyPressed && oKeyPressed) {
      for (switchElement of tableSwitchCol) {
        switchElement.dispatchEvent(mouseUpEv)
      }
    }
  })

  document.documentElement.addEventListener('keyup', function (ev) {
    if (ev.key === 'Alt') ctrKeyPressed = false;
    if (ev.key === 'o') oKeyPressed = false;
  })
});

