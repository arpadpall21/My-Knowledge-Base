// pre formating config
const colorMap = {
  ignoreBgElement: {
    background: {
      primary: 'unset',
      secondary: 'unset',
    },
    comment: {
      info: '#707070',
      warning: '#e19a00',
      error: 'orangered',
      return: 'cornflowerblue',
    },
  },
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
      info: '#a2b0a3',
      warning: '#e19a00',
      error: 'orangered',
      return: 'cornflowerblue',
    },
  },
  preCmdElement: {
    background: {
      primary: '#202644',
      secondary: '#202333',
    },
    comment: {
      info: '#a2b0a3',
      warning: '#e19a00',
      error: 'orangered',
      return: 'cornflowerblue',
    },
  }
}

const extraSpaceAfterLatestCharacter = 3;
const extraSpaceAfterLatestCharacterSecondary = 3;
const ignoreCommentFormatingUpToCharacter = 34;
const recognizedEntities = ['&lt;', '&gt;', '&amp;'];

// table formating config
const tableRowSeparatorElements = ['|', '/'];
const tableBackgroundColor = '#4b4b4b';
const tableGroupingSeparatorBackgroundColor = '#3b3a3a';

/**
 * @param {string} line
 * @returns {number}
 */
function getLineLengthWithoutComment(line) {
  if (line.trim().length === 0 || line.indexOf('<span id="browserSupport"') > -1) {
    return 0;
  }

  if (line.startsWith('//')) {
    return line.replace(/[ -]+$/g, "").length
  }

  let currentLine = line;
  const commentIndex = line.indexOf('// ');

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
    if (lineObj.line.substring(1, ignoreCommentFormatingUpToCharacter).indexOf('// ') > -1) {
      result.push(lineObj.line);
      continue;
    } else if (lineObj.line.startsWith('// ')) {
      let entitiesLength = 0;

      if (/<[^>]+>/.test(lineObj.line)) {
        entitiesLength = lineObj.line.match(/<[^>]+>/g).join('').length;
      }

      lineObj.line = lineObj.line.trimEnd();
      const paddedLine = lineObj.line.padEnd(farthestCharacterForEachLine.farthestCharacter + entitiesLength, '-');
      const shortenedLine = paddedLine.substring(0, farthestCharacterForEachLine.farthestCharacter + entitiesLength);

      result.push(shortenedLine);
      continue;
    } else if (lineObj.line.indexOf('// ') > -1) {
      const commentIndex = lineObj.line.indexOf('// ');
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
    } else if (preElement.classList.contains('cmd') || preElement.classList.contains('cmd')) {
      color = colorMap.preCmdElement;
    } else if (preElement.classList.contains('ignoreBg')) {
      color = colorMap.ignoreBgElement;
    }

    const lines = getLines(preElement);
    const farthestCharacterForEachLine = getFarthestCharacterForEachLine(lines);
    const formatedLines = formatLines(farthestCharacterForEachLine);

    for (let line of formatedLines) {
      const coloredLine = colorComments(line, color.comment);
      result += `<div style="background-color:${evenOdd ? color.background.primary : color.background.secondary};">${coloredLine}</div>`;
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
  // table styling (auto orders in order to be backward compatible) ----------------------
  for (const table of document.querySelectorAll('.table')) {
    let rows = table.querySelectorAll('tbody tr[class]');
    let rowsObj = {}
    let rowNames = [];
    let loopItCounter = 0;

    rows.forEach(function (node) {
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
            table.querySelector('tbody').appendChild(rowsObj[rowNames[i]])
          } else {
            table.querySelector('tbody').appendChild(rowsObj[rowNames[i]]);

            let emptyRow = document.createElement('tr')
            let emptyRow2 = document.createElement('tr')
            table.querySelector('tbody').append(emptyRow);
            table.querySelector('tbody').append(emptyRow2);

            let children = ''
            let cellNumbers = table.querySelectorAll('tbody tr th').length
            for (k = 0; k < cellNumbers; k++) {
              children += `<td style="background-color: ${tableGroupingSeparatorBackgroundColor}"> &nbsp; </td>`;
            }
            emptyRow.outerHTML = "<tr>" + children + "</tr>";
            emptyRow2.outerHTML = "<tr>" + children + "</tr>";
          }
        }
      }
    })

    table.querySelectorAll('td').forEach(function (node) {
      let td = node.style;
      td.fontFamily = 'monospace';
      td.fontSize = '1em';
      td.textIndent = '-25px';
      td.paddingLeft = '30px';
    });

    table.querySelectorAll('tr').forEach((tr) => {
      if (tableRowSeparatorElements.includes($(tr).children(":eq(0)").text())) {
        tr.style.backgroundColor = tableGroupingSeparatorBackgroundColor;
        tr.style.color = 'transparent';
        tr.style.fontSize = '2em';
        return
      }

      tr.style.backgroundColor = tableBackgroundColor;
      tr.style.color = 'white';
    });

    table.querySelectorAll('.openable').forEach((node) => {
      node.addEventListener('mouseup', function openableToggle() {
        if (window.getComputedStyle(this.querySelector('div')).display !== 'block') {
          this.querySelector('div').style.display = 'none';
          this.querySelector('div').style.position = 'static';
          return;
        }

        this.querySelector('div').style.display = 'block';
        this.querySelector('div').style.position = 'absolute';
      });

    });
  }
});

// for personal fasting code (code does not handle overlapping days (ex: cannot specify hours from 23:00 to 03:00))
const fastingConfig = {
  statusColors: {
    green: '#7CFC00',
    yellow: '#FFD700',
    red: '#CD5C5C',
  },
  colorSwitch: {      // outside green or yellow periods the default period is red
    greenPeriodBetweenHours: [[13, 17]],
    yellowPeriodBetweenHours: [[11, 13], [17, 19]],
  }
}
const displayedMessage = "[Keep Going Tough]"

function getPeriodColor() {
  const currentHour = new Date().getHours();

  for (let periodColor in fastingConfig.colorSwitch) {
    for (let period of fastingConfig.colorSwitch[periodColor]) {
      if (currentHour >= period[0] && currentHour < period[1]) {
        if (periodColor === 'greenPeriodBetweenHours') {
          return fastingConfig.statusColors.green
        } else {
          return fastingConfig.statusColors.yellow
        }
      }
    }
  }

  return fastingConfig.statusColors.red
}

$(document).ready(function(){
  const fastingPeriodIndicator = document.createElement('div');
  fastingPeriodIndicator.style.display = 'inline-block';
  fastingPeriodIndicator.style.backgroundColor = getPeriodColor()
  fastingPeriodIndicator.style.padding = '15px';
  fastingPeriodIndicator.style.margin = '0 5px';
  fastingPeriodIndicator.style.border = '#666666 solid 2px';
  fastingPeriodIndicator.style.borderRadius = '30px';
  fastingPeriodIndicator.style.verticalAlign = 'bottom';

  const fixedContainer = document.createElement('div');
  fixedContainer.innerHTML = displayedMessage;
  fixedContainer.style.padding = '0 0 1px 3px';
  fixedContainer.style.backgroundColor = 'darkgray';
  fixedContainer.style.fontSize = '20px';
  fixedContainer.style.position = 'fixed';
  fixedContainer.style.top = '0';
  fixedContainer.style.right = '0';
  fixedContainer.appendChild(fastingPeriodIndicator);
  

  document.body.appendChild(fixedContainer);
});