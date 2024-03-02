const preCommentInfoColor = '#00b3b3';
const preCommentWarningColor = '#e19a00';
const preCommentErrorColor = 'orangered';
const preCommentReturnColor = 'cornflowerblue';

const preBackgroundColor = '#f2f2f0';
const preBackgroundColor2 = '#e8e8e8';
const preSyntaxBackgroundColor = '#4b4b4b';
const preSyntaxBackgroundColor2 = '#454545';

/**
 * @param {string} line 
 * @returns {?Object}
 */
function getOpenableElements(line) {
  const openerElements = line.match(/(?<=<)[a-z|A-Z]*(?=( class="openable"| class='openable'))/g);

  if (openerElements === null) {
    return false;
  }

  return openerElements.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

/**
 * @param {string} line
 * @param {object} openerElements
 * @returns {string?} line
 */
function getNonClosedOpener(line, openerElements, nonClosedOpener) {
  if (!openerElements) {
    return false;
  }

  if (nonClosedOpener) {
    if (!openerElements[nonClosedOpener]) {
      openerElements[nonClosedOpener] = 1;
    } else {
      openerElements[nonClosedOpener] += 1;
    }
  }

  for (let openerElement in openerElements) {
    const closersElements = line.match(new RegExp(`</${openerElement}>`, 'g')) ? line.match(new RegExp(`</${openerElement}>`, 'g')) : [];

    if (closersElements.length !== openerElements[openerElement]) {
      return openerElement;
    }
  }

  return false;
}

function getLines(preElement) {
  const result = [];
  let multilineOpener = ['', 0, ''];

  lineLoop: for (let line of preElement.innerHTML.split('\n')) {
    const openerElements = getOpenableElements(line);
    if (openerElements && multilineOpener[1] === 0) {
      const nonClosedOpener = getNonClosedOpener(line, openerElements);

      if (nonClosedOpener) {
        multilineOpener[0] = nonClosedOpener;
        multilineOpener[1] += 1;
        multilineOpener[2] += line;
        continue;
      } else {
        result.push(line);
        continue;
      }

      } else if (multilineOpener[1] > 0) {
        if (new RegExp(`</${multilineOpener[0]}>`).test(line)) {
          const openerElements = getOpenableElements(line);
          const nonClosedOpener = getNonClosedOpener(line, openerElements, multilineOpener[0])

          if (nonClosedOpener) {
            multilineOpener[0] = nonClosedOpener;
            multilineOpener[1] += 1;
            multilineOpener[2] += line;
            continue;
          } else {
            multilineOpener[2] += line;
            result.push(multilineOpener[2]);
            multilineOpener = ['', 0, ''];
            continue;
          }
        }

        multilineOpener[2] += line;
        continue;
      }

    result.push(line);
  }

  return result;
}

function colorComments(line) {
  return line.replace(/\/\/.*/, (match) => {
      if (match.startsWith('// -!')) {
        return `<span style="color:${preCommentWarningColor}">${match}</span>`;
      } else if (match.startsWith('// !!')) {
        return `<span style="color:${preCommentErrorColor}">${match}</span>`;
      } else if (match.startsWith('// -&gt;')) {
        return `<span style="color:${preCommentReturnColor}">${match}</span>`;
      } else {
        return `<span style="color:${preCommentInfoColor}">${match}</span>`;
      }
  })

}

$(document).ready(function () {
// format pre elements
// -------------------------------------------------------------------------------------
  for (let preElement of $('pre')) {
    let result = '';
    let evenOdd = true;

    for (line of getLines(preElement)) {
      const coloredLine = colorComments(line);

      if (preElement.classList.contains('syntax')) {
        result += `<div style="background-color:${evenOdd ? preSyntaxBackgroundColor: preSyntaxBackgroundColor2};">${coloredLine}</div>`;
      } else {
        result += `<div style="background-color:${evenOdd ? preBackgroundColor: preBackgroundColor2};">${coloredLine}</div>`;
      }

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

