var rowIndex = 0;
var colIndex = 0;
var numOfCols = 0;
var numOfRows = 0;
var tblId = 'dynamic_table';

listenToDOMEvents();

function listenToDOMEvents() {
    document.getElementById('btn_get_data').addEventListener('click', () => {
        const content = document.getElementById('editable_content').innerHTML;
        document.getElementById('content').innerHTML = content;
        document.getElementById('html_view').innerText = content;
    });

    document.getElementById('table').addEventListener('click', () => {
        const dimensions = prompt('rows/cols', '');
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
    const colWidth = Math.round(100/numOfCols);

    let table = '<table id="dynamic_table">'
    let thead = '<thead>';
    let tbody = '<tbody>';

    let theadRow = '<tr onclick="getRowIndex(this)">';

    for (let c=0; c<numOfCols; c++) {
        theadRow += `<th style="width: ${colWidth}%;">Heading ${c+1}</th>`;
    }

    theadRow += '</tr>';
    thead += theadRow;

    for (let r=1; r<numOfRows; r++) {
        let tr = '<tr onclick="getRowIndex(this)">';

        for (let c=0; c<numOfCols; c++) {
            tr += `<td style="width: ${colWidth}%;" onclick="getColIndex(this)">Cell ${c+1}</td>`;
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
            cell = row.insertCell(i);

            cell.onclick = () => {
                colIndex = cell.cellIndex;
            }
        }

        row.onclick = () => {
            rowIndex = row.rowIndex;
        };
    }
}

function addColumn(pos) {
    if (pos == 'right') this.colIndex += 1;

    if (colIndex < 0) colIndex = 0;

    var tblHeadObj = document.getElementById(tblId).tHead;

    for (var h=0; h<tblHeadObj.rows.length; h++) {
        document.createElement('th');
        tblHeadObj.rows[h].insertCell(colIndex);
    }

    var tblBodyObj = document.getElementById(tblId).tBodies[0];
    for (var i=0; i<tblBodyObj.rows.length; i++) {
       const cell = tblBodyObj.rows[i].insertCell(colIndex);

       cell.onclick = () => {
        colIndex = cell.cellIndex;
       }
    }
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