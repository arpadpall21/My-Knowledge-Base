$(document).ready(function () {
  // color fonts after the "//" and "// ->" in "<pre>" elements
  var preCollection = $("pre[class!='syntax']");                  // collect pre elements without "syntax" class
  for (let i = 0; i < preCollection.length; i++) {
    let pre = preCollection[i].innerHTML;                       // content of the current "pre" element 
    var currentLine = new RegExp(".{1,}", "g");                 // select one line ("." selects all element except new line!)
    var newPre = "", store = "", lineCount = 0;

    while (currentLine.exec(pre) != null) {                      // counting the number of lines in the current "pre" element
      lineCount++;
    }
    for (; lineCount > 0; lineCount--) {
      let testLine = currentLine.exec(pre)[0];                // returns the current line each time it is called 

      testLine = testLine.replace(/\/\/ -&gt;.{1,}/, "$&".fontcolor("cornflowerblue"));   // color the line if starts by the specified regExp 
      testLine = testLine.replace(/\/\/ [^-].{1,}/, "$&".fontcolor("grey"));
      testLine = testLine.replace(/\/\/ --.{1,}/, "$&".fontcolor("grey"));
      testLine = testLine.replace(/# [^-].{1,}/, "$&".fontcolor("grey"));
      testLine = testLine.replace(/# --.{1,}/, "$&".fontcolor("grey"));
      testLine = testLine.replace(/\/\/ -! .{1,}/, "$&".fontcolor("#e19a00"));
      testLine = testLine.replace(/\/\/ !! .{1,}/, "$&".fontcolor("orangered"));

      newPre += store.concat(testLine + "\n");                // the "\n" adds a new line character at the end of every line
    }
    preCollection[i].innerHTML = newPre;                            // override the old content with the new one 
  }

  // print an "empty" message if the "<details>" element does not have any "<p>" children in the "Note" section
  if (!document.getElementById("notes")) { }                      // if the "notes" element does not exist nothing happens (we must set this code otherwise it will cause an error!)
  else {
    if (!document.getElementById("notes").querySelector("p")) {
      $("#notes summary").append(" (empty)");
    }
  }

  // -------------------------------------------------------------------------------------
  // program openable element ------------------------------------------------------------
  if (!document.querySelector('.table caption span[class=changeListOrder]')) {         // keep backward compatibility for non v4.0.0 pages
    $('.openable').click(function () {
      $(this).children('div').slideToggle('fast');
    });
  } else {
    $('.openable').mouseup(function () {
      if (window.getComputedStyle(this.querySelector('div')).display === 'block') {
        this.querySelector('div').style.display = 'none';
        this.querySelector('div').style.position = 'static';
      } else {
        this.querySelector('div').style.display = 'block';
        this.querySelector('div').style.position = 'absolute';
      }
    })
  }

  // -------------------------------------------------------------------------------------
  // table order (alphabetically / grouped) ----------------------------------------------
  if (document.querySelector('.table caption span[class=changeListOrder]')) {          // run this code only if the page has v4.0.0 table 
    let tables = document.querySelectorAll('.table');

    function openableToggle(ev) {                                                    // openable element handler 
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

    console.log(ctrKeyPressed, oKeyPressed)

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

