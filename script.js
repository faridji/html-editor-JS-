var rowIndex = 0;
var colIndex = 0;
var numOfCols = 0;
var numOfRows = 0;
var tblId = 'dynamic_table';

listenToDOMEvents();

function listenToDOMEvents() {
    document.getElementById('editable_content').addEventListener('paste', (e) => {
        setTimeout(() => {
            const targetHTML = document.getElementById('editable_content').innerHTML;
            let newHTML = null;

            if (targetHTML.includes('<div> </div>'))
            {
                newHTML = targetHTML.replaceAll('<div> </div>', '<br>');
            }
            if (targetHTML.includes('<div></div>'))
            {
                newHTML = targetHTML.replaceAll('<div> </div>', '<br>');
            }

            if (newHTML) document.getElementById('editable_content').innerHTML = newHTML;
        }, 100);
    });

    document.getElementById('btn_preview').addEventListener('click', () => {
        const content = document.getElementById('editable_content').innerHTML;
        document.getElementById('content').innerHTML = content;
        document.getElementById('html_view').innerText = content;
    });

    document.getElementById('table').addEventListener('click', () => {
        const dimensions = prompt('rows/cols', '2/3');
        if (dimensions && dimensions != '') {
            [numOfRows, numOfCols] = dimensions.split('/');
            addHTMLAtCaretPos('table');
        }
    });

    document.getElementById('row_above').addEventListener('click', () => {
        addRow('above');
    });

    document.getElementById('row_below').addEventListener('click', () => {
        addRow('below');
    });

    document.getElementById('column_left').addEventListener('click', () => {
        addColumn('left');
    });

    document.getElementById('column_right').addEventListener('click', () => {
        addColumn('right');
    });

    document.getElementById('remove_row').addEventListener('click', () => {
        onRemove('row');
    });

    document.getElementById('remove_column').addEventListener('click', () => {
        onRemove('column');
    });

    document.getElementById('list').addEventListener('click', () => {
        document.execCommand('insertUnorderedList');
    });

    document.getElementById('link').addEventListener('click', () => {
        const url = prompt('Enter a URL:', 'http://');
        document.getSelection();
        document.execCommand('createLink', true, url);
    });

    document.getElementById('background').addEventListener('click', () => {
        const backgroundColor = prompt('Background color:', '');
        document.execCommand('backColor', true, backgroundColor);
    });
    
    document.getElementById('strike').addEventListener('click', () => {
        document.execCommand('strikeThrough');
    });

    document.getElementById('image').addEventListener('click', () => {
        const url = prompt('Enter a URL:', 'http://');
        document.getSelection();
        document.execCommand('insertImage', true, url);
    });

    document.getElementById('bold').addEventListener('click', () => {
        document.execCommand('bold');
    });

    document.getElementById('italic').addEventListener('click', () => {
        document.execCommand('italic');
    });

    document.getElementById('underline').addEventListener('click', () => {
        document.execCommand('underline');
    });

    document.getElementById('select_all').addEventListener('click', () => {
        document.execCommand('selectAll');
    });
}

function getTableHTML() {
    const colWidth = (100/numOfCols).toFixed(2);

    let table = '<table id="dynamic_table">'
    let thead = '<thead>';
    let tbody = '<tbody>';

    let theadRow = '<tr onclick="getRowIndex(this)">';

    for (let c=0; c<numOfCols; c++) {
        theadRow += `<th  onclick="getColIndex(this)" style="width: ${colWidth}%;">Heading ${c+1}</th>`;
    }

    theadRow += '</tr>';
    thead += theadRow;

    for (let r=1; r<numOfRows; r++) {
        let tr = '<tr onclick="getRowIndex(this)">';

        for (let c=0; c<numOfCols; c++) {
            // tr += `<td style="width: ${colWidth}%;"
            //         onclick="getColIndex(this)" contenteditable>Cell ${c+1}
            //     </td>`;

            tr += `<td style="width: ${colWidth}%;"
                    onclick="getColIndex(this)">
                    <input type="text" value="Cell ${c+1}"/>
                </td>`;
        }

        tr += '</tr>';
        tbody += tr;
    }

    table += thead + tbody + '</table>';
    return table;
}

function addRow(pos) {
    const table = document.getElementById(tblId);
    let colsToAdd = 0;
        
    if (table) {
        colsToAdd = table.rows[rowIndex].cells.length;

        if (pos == 'below') rowIndex += 1;
        if (rowIndex == 0) rowIndex = 1;

        const row = table.insertRow(rowIndex);

        for (let i=0; i<colsToAdd; i++) {
            let cell = row.insertCell(i);
            addInputToCell(cell);
            cell.onclick = () => {
                colIndex = cell.cellIndex;
                console.log('Cell Index =', colIndex);
            }
        }

        row.onclick = () => {
            rowIndex = row.rowIndex;
            console.log('Row Index =', rowIndex);
        };
    }
}

function addColumn(pos) {
    if (pos == 'right') this.colIndex += 1;

    if (colIndex < 0) colIndex = 0;

    const table = document.getElementById('dynamic_table');

    if (table) {
        var tblHeadObj = table.tHead;

        for (var h=0; h<tblHeadObj.rows.length; h++) {
            document.createElement('th').set;
            tblHeadObj.rows[h].insertCell(colIndex);
        }
    
        var tblBodyObj = document.getElementById(tblId).tBodies[0];
        for (var i=0; i<tblBodyObj.rows.length; i++) {
           const cell = tblBodyObj.rows[i].insertCell(colIndex);
           addInputToCell(cell);
           cell.onclick = () => {
            colIndex = cell.cellIndex;
           }
        }
    
        numOfCols = parseInt(numOfCols) + 1;
        const colWidth = (100 / numOfCols).toFixed(2);
    
        const rowInds = Object.keys(table.rows);
    
        setTimeout(() => {
            for (const rIdx of rowInds) {
                const row = table.rows[+rIdx];
                const cellIdx = Object.keys(row.cells);
                for (const cIdx of cellIdx) {
                    const col = row.cells[+cIdx];
                    col.style.width = colWidth + '%';
                }
            }
        }, 0);
    }
}

function addInputToCell(cell) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    cell.appendChild(input);
}

function onRemove(type) {
    const table = document.getElementById(tblId);
    if (table) {
        if (type == 'row') {
            table.deleteRow(rowIndex);
        }
        else {
            var allRows = document.getElementById(tblId).rows;
            for (var i=0; i<allRows.length; i++) {
                if (allRows[i].cells.length > 1) {
                    allRows[i].deleteCell(colIndex);
                }
            }
        }
    }
}

function addHTMLAtCaretPos(type) {
    var sel, range;
    if (window.getSelection) 
    {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) 
        {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            
            if (type == 'table') {
                var el = document.createElement("div");
                el.innerHTML = getTableHTML();
            }
            
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}

function getRowIndex(row) {
    rowIndex = row.rowIndex;
    console.log('Row Index =', rowIndex);
}

function getColIndex(col) {
    colIndex = col.cellIndex;
    console.log('Column Index =', colIndex);
}

function onCellFocus() {
    console.log('On Cell Focus =');
}