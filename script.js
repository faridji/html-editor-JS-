var rowIndex = 0;
var colIndex = 0;
var numOfCols = 0;
var numOfRows = 0;
var numOfTables = 0;
var containerId = 'editable_content';
currentElement = null;

listenToDOMEvents();

function makeTable() {
    [numOfRows, numOfCols] = [6,4];
    addHTMLAtCaretPos('table');
}

function listenToDOMEvents() 
{
    currentElement = null;
    hideTableActions();
    
    document.getElementById(containerId).addEventListener('paste', (e) => {
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

            if (newHTML)  document.getElementById('editable_content').innerHTML = newHTML;
        }, 100);
    });

    document.getElementById('btn_preview').addEventListener('click', () => {
        document.querySelectorAll('.resizer').forEach(e => e.remove());
        const content = document.getElementById('editable_content').innerHTML;
        document.getElementById('content').innerHTML = content;
        document.getElementById('html_view').innerText = content;
        initResizing();
    });

    document.getElementById(containerId).addEventListener('click', (ev) => {
        this.currentElement = null;
        hideTableActions();
        makeContentEditable(containerId, 'Main Container Clicked.');
    });

    document.getElementById('table').addEventListener('click', () => {
        const dimensions = prompt('rows/cols', '2/3');
        if (dimensions && dimensions != '') 
        {
            if (this.currentElement === 'table') return;

            [numOfRows, numOfCols] = dimensions.split('/');
            addHTMLAtCaretPos('table');
            removeContentEditable(containerId);
            // newResizer();
            initResizing(`dynamic_table_${numOfTables}`);
        }
    });

    document.getElementById('row_above').addEventListener('click', () => {
        addRow('above');
        reInitializeResizing();
    });

    document.getElementById('row_below').addEventListener('click', () => {
        addRow('below');
        reInitializeResizing();
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

    document.getElementById('merge_cells').addEventListener('click', () => {
        makeContentEditable(containerId, 'Merge Cells')
        mergeCells();
        removeContentEditable(containerId, 'Merge Cells');
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

function getTableId() {
    let selection = window.getSelection().getRangeAt(0);
    let startingElement = selection.startContainer;

    while(startingElement.tagName != 'TABLE') {
        startingElement = startingElement.parentElement;
    }

    return startingElement.getAttribute('id');
}

function onMainContainerClick() {
    this.currentElement = null;
    hideTableActions();
}

function hideTableActions() {
    let tableActions = document.getElementsByClassName('table-actions')[0];

    if (this.currentElement == null) {
        tableActions.style.display = 'none';
    }
    else {
        tableActions.style.display = 'flex';
    }
}

function makeContentEditable(el, from) {
    document.getElementById(el).setAttribute('contenteditable', 'true');
}

function removeContentEditable(el, from) {
    document.getElementById(el).removeAttribute('contenteditable');
}

function getTableHTML() {
    numOfTables += 1;
    // const colWidth = (100/numOfCols).toFixed(2);
    const containerPadding = 20;
    const container = document.getElementById(containerId);
    const styles = window.getComputedStyle(container);
    const containerWidth = parseInt(styles.width, 10) - containerPadding;
    let width = (containerWidth / numOfCols).toFixed(2);
    console.log("width", width, numOfCols)
    //  width = 100;

    let table = document.createElement('table');
    table.setAttribute('id', `dynamic_table_${numOfTables}`);
    
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let theadRow = document.createElement('tr');
    theadRow.addEventListener('click', () => {
        getRowIndex(theadRow)
    });

    for (let c=0; c<numOfCols; c++) {
        let th = document.createElement('th');
        th.setAttribute('contenteditable', 'true');
        th.innerHTML = `Heading ${c+1}`;
        th.style.width = width + 'px';

        th.addEventListener('click', () => {
            getCellIndex(th);
        });

        th.addEventListener('focus', () => {
            onCellFocus(th);
        });

        theadRow.appendChild(th);
    }

    thead.appendChild(theadRow);

    for (let r=1; r<numOfRows; r++) {
        let tr = document.createElement('tr');
        tr.addEventListener('click', () => {
            getRowIndex(tr);
        });

        for (let c=0; c<numOfCols; c++) {
            let td = document.createElement('td');
            td.setAttribute('contenteditable', 'true');
            td.innerHTML = `Cell ${c+1}`;
            //td.style.width = width + 'px';

            td.addEventListener('click', () => {
                getCellIndex(td);
            });

            td.addEventListener('focus', () => {
                onCellFocus(td);
            });

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
   
    return table;
}

function reInitializeResizing() {
    const id = getTableId();
    const table = document.getElementById(id);
    table.querySelectorAll('.resizer').forEach(e => e.remove());
    this.initResizing(id);
}

function initResizing(id) {
    const table = document.getElementById(id);

    // Query all headers
    const cols = table.querySelectorAll('th');

    // Loop over them
    [].forEach.call(cols, function(col) {
        addResizerDiv(col, table);
    });
}

function addResizerDiv(c, tbl) {
    // Create a resizer element
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');

    // Set the height
    resizer.style.height = `${tbl.offsetHeight}px`;

    // Add a resizer element to the column
    c.appendChild(resizer);

    // Will be implemented in the next section
    createResizableColumn(c, resizer);
}

const createResizableColumn = function(col, resizer) {
    // Track the current position of mouse
    let x = 0;
    let w = 0;

    const mouseDownHandler = function(e) {
        // Get the current mouse position
        x = e.clientX;

        // Calculate the current width of column
        const styles = window.getComputedStyle(col);
        w = parseInt(styles.width, 10);
        resizer.classList.add('resizing');

        // Attach listeners for document's events
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function(e) {
        // Determine how far the mouse has been moved
        const dx = e.clientX - x;

        // Update the width of column
        col.style.width = `${w + dx}px`;

        resizer.classList.remove('resizing');
    };

    // When user releases the mouse, remove the existing event listeners
    const mouseUpHandler = function() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
};

function addRow(pos) {
    const table = document.getElementById(getTableId());
    let colsToAdd = 0;
        
    if (table) {
        colsToAdd = table.rows[rowIndex].cells.length;

        if (pos == 'below') rowIndex += 1;
        if (rowIndex == 0) rowIndex = 1;

        const row = table.insertRow(rowIndex);

        for (let i=0; i<colsToAdd; i++) {
            let cell = row.insertCell(i);
            cell.setAttribute('contenteditable', true);
            cell.innerHTML = `Cell ${i+1}`;
            cell.style.width = '70px';
            cell.onclick = () => {
                colIndex = cell.cellIndex;
                console.log('Cell Index =', colIndex);
            }
        }

        row.onclick = () => {
            getRowIndex(row);
            console.log('Row Index =', rowIndex);
        };

        reInitializeResizing();
    }
}

function addColumn(pos) {
    if (pos == 'right') this.colIndex += 1;

    if (colIndex < 0) colIndex = 0;

    const table = document.getElementById(getTableId());

    if (table) {
        var tblHeadObj = table.tHead;

        for (var h=0; h<tblHeadObj.rows.length; h++) {
            tblHeadObj.rows[h].insertCell(colIndex).outerHTML = "<th>Heading</th>";
            th = tblHeadObj.rows[h].cells[colIndex];
            th.setAttribute('contenteditable', true);
            th.style.width = '70px';

            th.onclick = () => {
                getCellIndex(th);
            }

            th.onfocus = () => {
                onCellFocus(th);
            };

            addResizerDiv(th, table);
        }
    
        var tblBodyObj = table.tBodies[0];
        for (var i=0; i<tblBodyObj.rows.length; i++) {
            const cell = tblBodyObj.rows[i].insertCell(colIndex);
            cell.innerHTML = `Cell ${i+1}`;
            cell.setAttribute('contenteditable', true);
            cell.style.width = '70px';

            cell.onclick = () => {
                getCellIndex(cell);
            }

            cell.onfocus = () => {
                onCellFocus(cell);
            };
        }
    
        reInitializeResizing();

        // This give equal width to all table columns;
        
        // numOfCols = parseInt(numOfCols) + 1;
        // // const colWidth = (100 / numOfCols).toFixed(2);
    
        // const rowInds = Object.keys(table.rows);
    
        // setTimeout(() => {
        //     for (const rIdx of rowInds) {
        //         const row = table.rows[+rIdx];
        //         const cellIdx = Object.keys(row.cells);
        //         for (const cIdx of cellIdx) {
        //             const col = row.cells[+cIdx];
        //             col.style.width = 'fit-content';
        //         }
        //     }
        // }, 0);
    }
}

function addInputToCell(cell) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    cell.appendChild(input);
}

function onRemove(type) {
    const table = document.getElementById(getTableId());
    if (table) {
        if (type == 'row') {
            table.deleteRow(rowIndex);
        }
        else {
            var allRows = table.rows;
            for (var i=0; i<allRows.length; i++) {
                if (allRows[i].cells.length > 1) {
                    allRows[i].deleteCell(colIndex);
                }
            }
        }
    }
}

function mergeCells() {
    
    let selection = window.getSelection().getRangeAt(0);
    let startingElementIdx = 0;

    const startingElement = selection.startContainer.parentElement;
    startingElementIdx = startingElement.cellIndex;
    const row = selection.startContainer.parentElement.parentElement;
    const endingElementIdx = startingElementIdx + 1;
    const endingElement = row.cells[endingElementIdx];

    const cells = row.cells;

    if (cells) {
        for (let cell of cells) {
            if (cell.cellIndex <= startingElementIdx) continue;
            if (cell.cellIndex > endingElementIdx) continue;
        
            setTimeout(() => {
                row.removeChild(cell);
            }, 100);
        }
    
        if (startingElement.getAttribute('colSpan')) 
        {
            if (endingElement.getAttribute('colSpan')) {
                startingElement.colSpan += endingElement.colSpan;
            } else {
                startingElement.colSpan += 1;
            }
        }
        else {
            startingElement.colSpan = endingElementIdx - startingElementIdx + 1;
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
                el.appendChild(getTableHTML());
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
    this.currentElement = 'table';
    rowIndex = row.rowIndex;
    removeContentEditable(containerId, 'Row Clicked');
    event.stopPropagation();
    hideTableActions();
}

function getCellIndex(col) {
    colIndex = col.cellIndex;
    this.currentElement = 'table';

    if (this.currentElement == 'table') {
        let tableActions = document.getElementsByClassName('table-actions')[0];
        tableActions.style.display = 'flex';
    }
    
    console.log('Col Index =', colIndex);
}

function onCellFocus(cell) {
    // setTimeout(() => {
    //     document.execCommand('selectAll', false, null);
    // }, 10);
}

function onSelectionChange() {
    console.log('Selection Changed');
    if (document.getElementById(containerId).getAttribute('contenteditable') == null) {
        makeContentEditable(containerId, 'Selection Changed');
    }
}

function mouseMoveWhileDown(target, whileMove) {
    var endMove = function () {
        window.removeEventListener('mousemove', whileMove);
        window.removeEventListener('mouseup', endMove);

        let selection = window.getSelection().getRangeAt(0);
        if (selection.startOffset === selection.endOffset) {
            event.stopPropagation();
        }
    };

    target.addEventListener('mousedown', function (event) {
        window.addEventListener('mousemove', whileMove);
        window.addEventListener('mouseup', endMove);   
    });
}

function newResizer() {
    var thElm;
    var startOffset;

    Array.prototype.forEach.call(
      document.querySelectorAll("table th, td"),
      function (th) {
        th.style.position = 'relative';

        var grip = document.createElement('div');
        grip.innerHTML = "&nbsp;";
        grip.style.top = 0;
        grip.style.right = 0;
        grip.style.bottom = 0;
        grip.style.width = '5px';
        grip.style.position = 'absolute';
        grip.style.cursor = 'col-resize';
        grip.addEventListener('mousedown', function (e) {
            thElm = th;
            startOffset = th.offsetWidth - e.pageX;
        });

        th.appendChild(grip);
      });

    document.addEventListener('mousemove', function (e) {
      if (thElm) {
        thElm.style.width = startOffset + e.pageX + 'px';
      }
    });

    document.addEventListener('mouseup', function () {
        thElm = undefined;
    });
}