import defaultParser from "./index.js";
import { CELL } from "./types.js";

const CELL_ACTION = Symbol("CELL_ACTION");
const DEFAULTWORKBOOK = Symbol("DEFAULTWORKBOOK");
const DEFAULTSHEET = Symbol("DEFAULTSHEET");

class EventTarget {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, callback, useCaptureOptions) {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push([callback, useCaptureOptions]);
    return this.removeEventListener.bind(
      this,
      type,
      callback,
      useCaptureOptions
    );
  }

  removeEventListener(type, callback, useCaptureOptions) {
    if (!(type in this.listeners)) {
      return;
    }
    var stack = this.listeners[type];
    for (let i = 0; i < stack.length; i++) {
      const cbsarr = stack[i];
      const [cb, uco] = cbsarr;
      if (cb === callback) {
        if (
          useCaptureOptions === uco ||
          // Shallow equality
         (typeof uco === typeof useCaptureOptions &&
          typeof useCaptureOptions === 'object' && useCaptureOptions !== null &&
          Object.keys(useCaptureOptions).length === Object.keys(uco).length &&
          Object.keys(useCaptureOptions).every(
            (k) => useCaptureOptions[k] === uco[k]
          ))
        ) {
          stack.splice(i, 1);
          return;
        }
      }
    }
  }

  dispatchEvent(event) {
    if (!(event.type in this.listeners)) {
      return true;
    }
    const stack = this.listeners[event.type].slice();

    for (let [cb, useCaptureOptions = {}] of stack) {
      const {
        capture = useCaptureOptions === true,
        once = false,
        passive = false,
      } = useCaptureOptions;
      // todo: make this delayed
      cb.call(this, event, {
        capture,
        once,
        passive,
      });
      if (once) {
        this.removeEventListener(event.type, cb, useCaptureOptions);
      }
    }
    return !event.defaultPrevented;
  }
}

export class Table extends EventTarget {
  constructor({ parser = defaultParser, spillEnabled = true } = { parser: defaultParser, spillEnabled: true }) {
    super();
    this._cells = {
      [this.DEFAULTWORKBOOK]: {
        [this.DEFAULTSHEET]: {
          byRow: [],
          byCol: [],
        }
      },
    };
    this.spillEnabled = spillEnabled;
    this._cellSet = new Set();
    const that = this;
    this.cells = {
      filter(fnOrCell) {
        if((fnOrCell && fnOrCell.constructor && fnOrCell.call && fnOrCell.apply)) {
          const result = [];
          for(const i of that._cellSet.values()) {
            if(fnOrCell(i)) {
              result.push(i);
            }
          }
          return result;
        }
        const { workbook = that.DEFAULTWORKBOOK, sheet = that.DEFAULTSHEET, row, col } = fnOrCell;
        const { byRow, byCol } = that._cells[workbook][sheet];
        if(row && col) {
          return byRow[row][col];
        }
        if(row) {
          return Object.values(byRow[row]);
        }
        if(col) {
          return Object.values(byCol[col]);
        }
        return byRow.map(Object.values).flat();
      },
      find(fnOrCell) {
        if((fnOrCell && fnOrCell.constructor && fnOrCell.call && fnOrCell.apply)) {
          for(const i of that._cellSet.values()) {
            const result = fnOrCell(i);
            if(result) {
              return i;
            }
          }
          return null;
        }
        if(that._cellSet.has(fnOrCell)) {
          return that._cellSet.has(fnOrCell);
        }
        const { workbook = that.DEFAULTWORKBOOK, sheet = that.DEFAULTSHEET, row, col } = fnOrCell;
        return that._cells[workbook]?.[sheet]?.byRow[row]?.[col];
      },
      push(...cells) {
        return cells.map(c => that.cells.add(c));
      },
      add(cell) {
        if(that._cellSet.has(cell)) {
          throw new Error(`Cell ${cell.name} already exists on table!`);
        }
        const { workbook = that.DEFAULTWORKBOOK, sheet = that.DEFAULTSHEET, row, col } = cell;
        if(!that._cells[workbook]) {
          that._cells[workbook] = {};
        }
        const wb = that._cells[workbook];
        if(!wb[sheet]) {
          wb[sheet] = {
            byRow: [],
            byCol: [],
          };
        }
        const { byRow, byCol } = wb[sheet];
        if(!byRow[row]) {
          byRow[row] = [];
        }
        if(!byCol[col]) {
          byCol[col] = [];
        }
        byRow[row][col] = byCol[col][row] = cell;
        that._cellSet.add(cell);
      },
      delete(cell) {
        const { workbook = that.DEFAULTWORKBOOK, sheet = that.DEFAULTSHEET, row, col } = cell;
        const { byRow, byCol } = that._cells[workbook][sheet];
        delete byRow[row][col];
        delete byCol[col][row];
        return that._cellSet.delete(cell);
      },
      entries() {
        return that._cellSet.entries();
      },
      forEach(iter, thisArg) {
        return that._cellSet.forEach(iter, thisArg);
      },
      has(key) {
        return that._cellSet.has(key);
      },
      keys() {
        return that._cellSet.keys();
      },
      values() {
        return that._cellSet.values();
      },
      *[Symbol.iterator] () {
        yield* that._cellSet[Symbol.iterator];
      },
      get size() {
        return that._cellSet.size;
      }
    };
    this.parser = parser;
  }
  
  get DEFAULTWORKBOOK() {
    return DEFAULTWORKBOOK;
  }
  get DEFAULTSHEET() {
    return DEFAULTSHEET;
  }

  width({ workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    return this._cells[workbook]?.[sheet]?.byRow.length;
  }

  height({ workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    return this._cells[workbook]?.[sheet]?.byCol.length;
  }

  size({ workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    return this.width({ workbook, sheet }) * this.height({ workbook, sheet });
  }

  resize({ col, row, workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET }) {
    if(!this._cells[workbook]) {
      this._cells[workbook] = {};
    }
    const wb = this._cells[workbook];
    if(!wb[sheet]) {
      wb[sheet] ={
        byRow: [],
        byCol: [],
      };
    }
    if(col && !this._cells[workbook][sheet].byCol[col]) {
      this._cells[workbook][sheet].byCol[col] = null;
    }
    if(row && !this._cells[workbook][sheet].byRow[col]) {
      this._cells[workbook][sheet].byCol[col] = null;
    }
  }

  _addCells(rowOrCol, addAfter) {
    return (rawrowcol, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) => {
      const rowcol = parseInt(rawrowcol) + (addAfter ? 1 : 0);
      const { byRow, byCol } = this._cells[workbook][sheet];
      let byX, byY, kind;
      switch (rowOrCol) {
        case "ROW":
          kind = "row";
          byX = byRow;
          byY = byCol;
          break;
        case "COL":
          kind = "col";
          byX = byCol;
          byY = byRow;
          break;
        default:
          throw new Error(`rowOrCol must be either 'ROW' or 'COL'`);
      }
      this.resize({ [kind]: rowcol, workbook, sheet });
      byX.splice(rowcol, 0, []);
      for(const col of byY) {
        col.splice(rowcol, 0, null);
      }
      for(const mvcell of byX[rowcol+1]) {
        if(!mvcell) { // sparse - there might be a cell in there if it was previously created, or might just not
          continue;
        }
        const celldata = { table: mvcell.table, row: mvcell.row, col: mvcell.col, allowUnsafe: mvcell.allowUnsafe, workbook: mvcell.workbook, sheet: mvcell.sheet };
        const cell = new Cell(celldata); // auto-cached
        this.dispatchEvent({ type: "init", value: "", formula: "", meta: celldata });
      }
      byX.slice(rowcol+1).flat().map((cell, idx) => {
        cell.markDirty();
        return [cell.update({
          [kind]: cell[kind]+1
        }), cell];
      }).forEach(([fn, cll]) => {
        if(cll.dirty) { // if this has been run already, don't run it again. This can happen if the cells had dependencies towards each other
          fn();
        }
      });
    };
  }


  addRowBefore(raw, maybeWorkbookAndSheet) {
    this._addCells("ROW", false)(raw, maybeWorkbookAndSheet);
    /*
    const row = parseInt(rrow); // difference to addRowAfter is here - todo: refactor
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ row, workbook, sheet });
    byRow.splice(row, 0, []);
    for(const col of byCol) {
      col.splice(row, 0, null);
    }
    for(const mvcell of byRow[row+1]) {
      if(!mvcell) { // sparse - there might be a cell in there if it was previously created, or might just not
        continue;
      }
      const celldata = { table: mvcell.table, row: mvcell.row, col: mvcell.col, allowUnsafe: mvcell.allowUnsafe, workbook: mvcell.workbook, sheet: mvcell.sheet };
      const cell = new Cell(celldata); // auto-cached
      this.dispatchEvent({ type: "init", value: "", formula: "", meta: celldata });
    }
    byRow.slice(row+1).flat().map((cell, idx) => {
      cell.markDirty();
      return [cell.update({
        row: cell.row+1
      }), cell];
    }).forEach(([fn, cll]) => {
      if(cll.dirty) { // if this has been run, don't run it again
        fn();
      }
    });
    */
  }

  addRowAfter(raw, maybeWorkbookAndSheet) {
    this._addCells("ROW", true)(raw, maybeWorkbookAndSheet);

    /*
    const row = parseInt(rrow)+1;
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ row, workbook, sheet });
    byRow.splice(row, 0, []);
    for(const col of byCol) {
      col.splice(row, 0, null);
    }
    for(const mvcell of byRow[row+1]) {
      if(!mvcell) { // sparse - there might be a cell in there if it was previously created, or might just not
        continue;
      }
      const celldata = { table: mvcell.table, row: mvcell.row, col: mvcell.col, allowUnsafe: mvcell.allowUnsafe, workbook: mvcell.workbook, sheet: mvcell.sheet };
      const cell = new Cell(celldata); // auto-cached
      this.dispatchEvent({ type: "init", value: "", formula: "", meta: celldata });
    }
    byRow.slice(row+1).flat().map((cell, idx) => {
      cell.markDirty();
      return [cell.update({
        row: cell.row+1
      }), cell];
    }).forEach(([fn, cll]) => {
      if(cll.dirty) { // if this has been run, don't run it again
        fn();
      }
    });
    */
  }

  addColBefore(raw, maybeWorkbookAndSheet) {
    this._addCells("COL", false)(raw, maybeWorkbookAndSheet);
  }

  addColAfter(raw, maybeWorkbookAndSheet) {
    this._addCells("COL", true)(raw, maybeWorkbookAndSheet);
  }

  _delete(rowOrCol) {
    return (rawrowcol, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) => {
      const rowcol = parseInt(rawrowcol);
      if(Number.isNaN(rowcol) || !Number.isSafeInteger(rowcol) || !Number.isFinite(rowcol) || rowcol < 0) {
        return false;
      }
      const { byRow, byCol } = this._cells[workbook][sheet];
      let byX, byY, kind;
      switch (rowOrCol) {
        case "ROW":
          kind = "row";
          byX = byRow;
          byY = byCol;
          break;
        case "COL":
          kind = "col";
          byX = byCol;
          byY = byRow;
          break;
        default:
          throw new Error(`rowOrCol must be either 'ROW' or 'COL'`);
      }
      const deleted = byX.splice(rowcol, 1);
      for(const col of byY) {
        col.splice(rowcol, 1);
      }
      for(const mvcell of deleted) {
        if(!mvcell) { // sparse
          continue;
        }
        const celldata = { table: mvcell.table, row: mvcell.row, col: mvcell.col, allowUnsafe: mvcell.allowUnsafe, workbook: mvcell.workbook, sheet: mvcell.sheet };
        const cell = new Cell(celldata); // auto-cached
        this._cellSet.delete(cell);
        cell.onDestroy();
        this.dispatchEvent({ type: "destroy", meta: celldata });
      }
      byX.slice(rowcol).flat().map((cell, idx) => {
        cell.markDirty();
        return [cell.update({
          [kind]: cell[kind]-1
        }), cell];
      }).forEach(([fn, cll]) => {
        if(cll.dirty) { // if this has been run already, don't run it again. This can happen if the cells had dependencies towards each other
          fn();
        }
      });
    }
  }

  deleteRow(raw, maybeWorkbookAndSheet) {
    this._delete("ROW")(raw, maybeWorkbookAndSheet);
  }

  deleteCol(raw, maybeWorkbookAndSheet) {
    this._delete("COL")(raw, maybeWorkbookAndSheet);
  }

  renameSheet(newSheet, { workbook = this.DEFAULTWORKBOOK, sheet} = {}) {
    if(!newSheet) {
      return false;
    }
    if(!sheet) {
      return false;
    }
    if(newSheet === sheet) {
      return false;
    }
    if(!this._cells[workbook].hasOwnProperty(sheet)) {
      return false;
    }
    this._cells[workbook][newSheet] = this._cells[workbook][sheet];
    this._cells[workbook][newSheet].byRow.flat().map((cell, idx) => {
      if(!cell) {
        return [null, { dirty: false }]; // non-existing cells are never dirty
      }
      cell.markDirty();
      return [cell.update({
        sheet: newSheet
      }), cell];
    }).forEach(([fn, cll]) => {
      if(cll.dirty) { // if this has been run already, don't run it again. This can happen if the cells had dependencies towards each other
        fn();
      }
    });
    delete this._cells[workbook][sheet];
  }

  renameWorkbook(newWorkbook, { workbook } = {}) {
    if(!newWorkbook) {
      return false;
    }
    if(!workbook) {
      return false;
    }
    if(newWorkbook === workbook) {
      return false;
    }
    if(!this._cells.hasOwnProperty(workbook)) {
      return false;
    }
    this._cells[newWorkbook] = this._cells[workbook];
    this._cells[newWorkbook].map(sheet => sheet.byRow.flat().map((cell, idx) => {
      if(!cell) {
        return [null, { dirty: false }]; // non-existing cells are never dirty
      }
      cell.markDirty();
      return [cell.update({
        sheet: newSheet
      }), cell];
    })).forEach(ssheet => ssheet.forEach(([fn, cll]) => {
      if(cll.dirty) { // if this has been run already, don't run it again. This can happen if the cells had dependencies towards each other
        fn();
      }
    }));
    delete this._cells[workbook];
  }

  deleteSheet({ workbook = this.DEFAULTWORKBOOK, sheet} = {}) {
    if(!sheet) {
      return false;
    }
    if(!this._cells[workbook].hasOwnProperty(sheet)) {
      return false;
    }
    this._cells[workbook][sheet].byRow.flat().map((cell, idx) => {
      if(!cell) { return; } // sparse
      const celldata = { table: cell.table, row: cell.row, col: cell.col, allowUnsafe: cell.allowUnsafe, workbook: cell.workbook, sheet: cell.sheet };
      this._cellSet.delete(cell);
      cell.onDestroy();
      this.dispatchEvent({ type: "destroy", meta: celldata });
    });
    delete this._cells[workbook][sheet];
  }
  
  deleteWorkbook({ workbook } = {}) {
    if(!workbook) {
      return false;
    }
    if(!this._cells.hasOwnProperty(workbook)) {
      return false;
    }
    this._cells[workbook].forEach(sh => sh.byRow.flat().map((cell, idx) => {
      if(!cell) { return; } // sparse
      const celldata = { table: cell.table, row: cell.row, col: cell.col, allowUnsafe: cell.allowUnsafe, workbook: cell.workbook, sheet: cell.sheet };
      this._cellSet.delete(cell);
      cell.onDestroy();
      this.dispatchEvent({ type: "destroy", meta: celldata });
    }));
    delete this._cells[workbook];
  }


  // todo:
  // add insertRowAbove and insertRowBelow and insertColumnAbove and insertColumnBelow here
  // needs to (a) pause and collect events
  // (b) update all cells incl. dependend cells
  // (c) run all events

  register(cell) {
      this.cells.add(cell);
  }
}

const findCell = ({ row: r, col: c, workbook: wb, sheet: sh }) => ({ row, col, workbook, sheet }) => row === r && col === c && workbook === wb && sheet === sh;
const noop = () => undefined;

export class Cell extends EventTarget {
  // *one per Input*
  constructor({ name, onUpdate = () => null, table = globalTable, row: rrow, col: rcol, _value = "", formula = "", allowUnsafe = false, workbook = table.DEFAULTWORKBOOK, sheet = table.DEFAULTSHEET }) {
    const row = parseInt(rrow), col = parseInt(rcol);
    const existingCell = table.cells.find({ row, col, workbook, sheet });
    if(existingCell) {
      return existingCell;
    }
    super();
    this.references = [];
    this.lastRun = null;
    this.expression = "";
    const workbookname = workbook === DEFAULTWORKBOOK ? "" : `[${String(workbook)}]`;
    const sheetname = sheet === DEFAULTSHEET ? "" : `'${String(sheet)}'!`;
    this.name = name || `${workbookname}${sheetname}${String.fromCharCode(65+col)}${row+1}`; // eg A1
    this._onUpdate = onUpdate;
    this.table = table;
    this.workbook = workbook;
    this.sheet = sheet;
    this.row = row;
    this.col = col;
    this.value = { value: _value, type: this.table.parser.NULL };
    this.formula = formula;
    this.onTableChange = this.onTableChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.destroy = this.destroy.bind(this);
    this.markDirty = this.markDirty.bind(this);
    this.allowUnsafe = allowUnsafe;
    this.subscribedCounter = 0;
    this.dirty = false;

    // todo: Implement
    this.spilledValue = "";
    this.spilledFormula = "";
    this.spilledIndex = -1;

    this.table.register(this);
    this.onDestroy = this.table.addEventListener(CELL_ACTION, this.onTableChange);
  }

  isSplillable(byCell) {
    // can spill into this cell, if there's no formula in here
    return !this.formula;
  }

  destroy() {
    this.onDestroy();
    this.table.cells.delete(this); // delete me from table
    this.dispatchEvent({ type: "destroy" })
      
  }

  markDirty() {
    this.dirty = true;
  }

  refresh(obj) {
    this._update(undefined, obj);
  }

  update({
    row,
    col,
    allowUnsafe,
    workbook,
    sheet
  }) {
    const updates = [];
    let doUpdate = false;
    if((allowUnsafe === true || allowUnsafe === false) && allowUnsafe !== this.allowUnsafe) {
      this.allowUnsafe = allowUnsafe;
      doUpdate = true;
    }
    
    const rewriteProperties = Object.entries({
      workbook,
      sheet,
      row,
      col
    }).filter((([name, value]) => value && value !== this[name]));
    if(rewriteProperties.length) {
      const cellsReferencingThisCell = this.table.cells.filter(cell => 
        cell.references.some(({ workbook = this.workbook, sheet = this.sheet, row, col }) => 
          // Note: References are in 1-index-based, cells are 0-index-based -> "row-1" and "col-1"
          this.workbook === workbook &&
          this.sheet === sheet &&
          (row === "*" || this.row === row - 1) &&
          (col === "*" || this.col === col - 1)
        )  
      );
      for(const cell of cellsReferencingThisCell) {
        // cell references this and this is being updated
        for(const [name, newValue] of rewriteProperties) {
          cell.references.filter(({ workbook = this.workbook, sheet = this.sheet, row, col }) => 
            this.workbook === workbook &&
            this.sheet === sheet &&
            (row === "*" || this.row === row - 1) &&
            (col === "*" || this.col === col - 1)
          ).forEach(ref => { // re-write references to this cell
            ref[name] = ref[name] === "*" ? ref[name] : newValue;
          });
        }
        const before = cell.formula;
        cell.formula = this.reverse(cell, (cellReferenceExpression) => {
          const calcSheet = cellReferenceExpression.sheet || cell.sheet;
          const calcWorkbook = cellReferenceExpression.workbook || cell.workbook;
          const zeroBasedCol = cellReferenceExpression.col.split("").reduce((sum, char) => sum*26+char.charCodeAt(0)-64, 0) - 1;
          const zeroBasedRow = cellReferenceExpression.row - 1;
          if(calcWorkbook === this.workbook &&
            calcSheet === this.sheet &&
            zeroBasedCol === this.col &&
            zeroBasedRow === this.row) { // said cell might have multiple cell-references; only if this cell-referecne is the one we're looking at
            const escapeSheet = shh => {
              // todo: move all these escapes into the actual update function 'Cell.reverse'
              if(shh.indexOf(' ') > -1) {
                return `'${shh}'`;
              }
              return shh;
            };
            const {
              col: v1,
              row: v2,
              // absCol: abs1, // on cell shift, abs values are also re-written, so ignore this setting
              // absRow: abs2, // on cell shift, abs values are also re-written, so ignore this setting
              workbook: wb,
              sheet: sh
            } = cellReferenceExpression;
            return { // update or keep original if no update
              workbook: workbook || wb,
              sheet: sheet != null ? escapeSheet(sheet) : sh,
              row: row != null ? (row + 1) : v2,
              // todo: use the following convert algorithm in the functions as well!
              col: col != null ? Number(col).toString(26).split("").map((i, idx, arr) => String.fromCharCode(parseInt(i, 26)+64+(idx===arr.length-1))).join("") : v1,
            };
          }
          return cellReferenceExpression;
        });
        console.log("Changed", before, "to", cell.formula);
        updates.push({ before, after: cell.formula, cell });
      }
      doUpdate = true;
    }
    this.workbook = workbook || this.workbook;
    this.sheet = sheet || this.sheet;
    const oldRow = this.row, oldCol = this.col, oldWorkbook = this.workbook, oldSheet = this.sheet;
    this.row = row || this.row;
    this.col = col || this.col;
    const workbookname = this.workbook === DEFAULTWORKBOOK ? "" : `[${String(this.workbook)}]`;
    const sheetname = this.sheet === DEFAULTSHEET ? "" : `'${String(this.sheet)}'!`;
    this.name = name || `${workbookname}${sheetname}${String.fromCharCode(65+this.col)}${this.row+1}`; // eg A1
    this.subscribedCounter = this.table.cells.find(this)?.subscribedCounter; // if there is an original cell, copy over it's subscription counter

    if(doUpdate) {
      return this._update.bind(this);
    }
    
    return null;
  }

  onUpdate(e) {
    const targetValue = e.target && e.target.value;
    const evtValue = e.value;
    const otherValue = e;
    const v = targetValue === undefined ? evtValue === undefined ? otherValue : evtValue : targetValue;
    if(!v) {
      return;
    }
    this._update(v);
  }

  _update(e = this.formula, { calledBy: cldby } = {}) {

    const getCell = ({ row, col, workbook, sheet }) => {
      const x = this.table.cells.find({ row, col, workbook, sheet });
      if(x.dirty) {
        const { value } = x._update();
        return x.formula ? value : x.spilledValue;
      }
      return x.formula ? x.value : x.spilledValue;
    };
    const getCol = ({ col, workbook, sheet }) => {
      this.table.cells
      .filter(({ col: c, workbook: wb, sheet: sh }) => col === c && wb === workbook && sheet === sheet)
      .map(({ dirty, value }) => {
        if( dirty) {
          const { value } = x._update();
          return x.formula ? value : x.spilledValue;
        }
        return x.formula ? x.value : x.spilledValue;
      });
    };
    const getRow = ({ row, workbook, sheet }) => {
      this.table.cells
      .filter(({ row: r, workbook: wb, sheet: sh }) => row === r && wb === workbook && sheet === sheet)
      .map(({ dirty, value }) => {
        if( dirty) {
          const { value } = x._update();
          return x.formula ? value : x.spilledValue;
        }
        return x.formula ? x.value : x.spilledValue;
      });
    };

    const cellFinder = {
      getWorkbook: wb => ({ getSheet: sh => cellFinder.getSheet(sh, wb) }),
      getSheet: (sh, mayBeWorkbook) => ({
        getRow: (r, op) => cellFinder.getRow(r, op, mayBeWorkbook, sh),
        getCol: (c, op) => cellFinder.getCol(c, op, mayBeWorkbook, sh),
      }),
      getCell: ({ row, col }, { calledBy }, workbook = this.workbook, sheet = this.sheet) => getCell({ row, col, workbook, sheet }, [calledBy]),
      getRow: (row, { calledBy: cb1 }, workbook = this.workbook, sheet = this.sheet) => ({
        getCol: (col, { calledBy }) => getCell({ row, col, workbook, sheet }, [calledBy, cb1]),
        all: ({ calledBy }, { calledBy: cb2 } = {}) => getCol({ col, workbook, sheet }, [calledBy, cb2, cb1]),
      }),
      getCol: (col, { calledBy: cb1 }, workbook = this.workbook, sheet = this.sheet) => ({
        getRow: (row, { calledBy }) => getCell({ row, col, workbook, sheet }, [calledBy, cb1]),
        all: ({ calledBy }, { calledBy: cb2 } = {}) => getRow({ row, workbook, sheet }, [calledBy, cb2, cb1]),
      }),
    };
    const meta = {
      _context: cellFinder,
      _currentcell: { row: this.row, col: this.col, workbook: this.workbook, sheet: this.sheet }, // cell this formula is in
      _calledBy: cldby || [],
      allowUnsafe: this.allowUnsafe
    };

    let r;
    try {
        r = this.table.parser.parse(e, {
            ...meta,
            _self: (exp, ctx) =>  this.table.parser.parse(exp, {
                ...meta,
                //...ctx,
            }),
        });
    } catch(e) {
        r = e.value || e;
    }
    if(r instanceof Error) {
        // real Error;
        console.error(`Formula ${e} returned unexpected error`, r);
        r = { type: "Runtime Error", value: `${r.name}: ${r.message}` };
        // todo: All dispatches
    }
    this.value = r;
    console.log("R", this.name, r, this);
    this.formula = e;
    this.references = (r && r[this.table.parser.CELL_TRACE] || []);
    this.dirty = false;

    const evtData = { value: this.value, formula: this.formula, meta: { workbook: this.workbook, sheet: this.sheet, row: this.row, col: this.col, cell: this, calledBy: this.references } };
    this.table.dispatchEvent({ type: CELL_ACTION, ...evtData });
    this.table.dispatchEvent({ type: "change", ...evtData });
    const update = { value: this.value, formula: this.formula };
    this._onUpdate.call(this, update, this);
    this.dispatchEvent({ type: "change", ...evtData });

    // todo: Spill
    /*
    if(this.table.spillEnabled && (r.type === LIST || t.type === MATRIX)) {
      try {
        
          const { width, height } = t.value.xy;
          // todo: if LIST, detect direction
          const cells = [];
          for(let n = 1; n <= width; n++) {
            for(let m = 1; m <= height; m++) {
              const celldata = { row: this.row + n, col: this.col + m, sheet: this.sheet, workbook: this.workbook };
              const circularRef = this.references.find(ref => {
                this.table.cells.find({
                  row: ref.row - 1,
                  col: ref.col - 1,
                  sheet: ref.sheet,
                  workbook: ref.workbook
                })?.references.some(({
                  col, row, sheet, workbook
                } = {}) => celldata.row === row-1 && celldata.col === col-1 && celldata.workbook === workbook && celldata.sheet === sheet);
              });
              if(circularRef) {
                throw new SpillError(`Circular reference to spilled to cell at ${celldata.row} | ${celldata.col}`);
              }
              const cell = this.table.find(celldata);
              if(!cell) {
                cells.push(new Cell(celldata));
                continue; // spillable
              }
              if(!cell.isSplillable()) {
                throw new SpillError(`Cell ${cell.name} not spillable!`);
              }
              cells.push(cell);
            }
          }
          while(cells) {
            const cell = cells.pop(); // iterate over all cells
            const value = r.value[cell.row - this.row][cell.col = this.col]; // todo: depending on List or Matrix this might be one or two-dim
            const references = this.references;
            cell.spilledValue = value;
            cell.spilledFormula = this.formula;
            cell.spilledIndex = [cell.row - this.row, cell.col = this.col];
            cell.spilledToBy = this;
            cell.references = this.references;
            const evtData = { value, formula: `SPILL!${this.formula}[${cell.row - this.row}][${cell.col = this.col}]`,
              meta: { workbook: cell.workbook, sheet: cell.sheet, row: cell.row, col: cell.col, cell: cell, calledBy: this.references } };
            this.table.dispatchEvent({ type: CELL_ACTION, ...evtData });
            this.table.dispatchEvent({ type: "change", ...evtData });
          }
      } catch(e) {
        if(e instanceOf SpillError) {
          // update own value to SpillError #SPILL
        }
      }
    }
    */

    return update;
  }

  subscribe(observer, maybeOnError, maybeOnComplete) {
    const onNext = observer.next || observer;
    const onError = observer.error|| maybeOnError || noop;
    const onComplete = observer.complete|| maybeOnComplete || noop;
    const unsub1 = this.addEventListener("change", (evt) => {
        onNext(evt, this);
    });
    const unsub2 = this.addEventListener("destroy", (evt) => {
        onComplete();
    });

    let closed = false;
    const unsubscribe = () => {
        unsub1();
        unsub2();
        closed = true;
    };
    const subscription = function() {
      unsubscribe();
    };
    subscription.unsubscribe = unsubscribe;
    Object.defineProperty(subscription, 'closed', {
      get() { return closed; }
    })
    if(observer.start) {
        observer.start(subscription);
    }

    return subscription;
  }

  onTableChange(evt) {
    if(evt.type === CELL_ACTION) {
        // todo: if evt.calledBy includes this cell, don't update
        if(evt.meta.workbook === this.workbook && evt.meta.sheet === this.sheet && evt.meta.row === this.row && evt.meta.col === this.col) { // self
            return; // it is this cell, it changed alread, don't trigger the change again (otherwise infinite loop)
        }
        // if the changed cell is something that is referenced from this cell
        if(this.references.some(({ workbook = this.workbook, sheet = this.sheet, row, col }) => 
          evt.meta.workbook === workbook &&
          evt.meta.sheet === sheet &&
          (row === "*" || evt.meta.row === (row-1)) &&
          (col === "*" || (col-1) === evt.meta.col)
        )) { // Warning: references is in 1-based format!! // todo trace in parser and correct
            if(evt.value.value === this.table.parser.CIRCULAR) {
                this.value = evt.value; // todo: we can't just make this circular, we actually need to calculate the value taking into account that one of the cell-values this formula uses is CIRCULAR-ERROR
                return;
            }
            this.refresh({ calledBy: evt.meta.calledBy || [] });
        }
    }
  }

  reverse(tree, mod) {
    return Cell.reverse(tree, mod, this);
  }

  static reverse(tree, mod, parser) {
    return formulaFromTree(tree, mod, parser);
  }

  
}

export function formulaFromTree(xtree, mod = null, xparser = globalTable, oroot = xtree) {
  const tree = xtree instanceof Cell ? xtree.value : xtree;
  const parser = xparser instanceof Cell ? xparser.table.parser : xparser instanceof Table ? xparser.parser : xparser;
  const root = tree.tree || tree;
  if(typeof root === "string" || typeof root === "number") { //  if we are already atomic
    return root;
  }
  if(root.value === "") {
    return "";
  }
  if(Array.isArray(root)) {
    return root.join("");
  }
  switch (root.type) {
    case parser.FUNCTIONCALL:
      const [name, open, ...args] = root.value;
      const close = args.pop();
      const xargs = args.map(arg => formulaFromTree(arg, mod, parser, oroot));
      return `${name}${open}${xargs.join("")}${close}`;
    case parser.CELL:
      const [a, wb, b, sh, c, abs1, v1, abs2, v2] = root.value;
      const {
        col, row, workbook, sheet
      } = mod ? mod({
        col: v1,
        row: v2,
        absCol: abs1,
        absRow: abs2,
        workbook: wb,
        sheet: sh
      }) : {};
      // todo: add all the escaping and converting here
      // convert from numbers to letters for row/col
      // escape sheet
      // escape workbook
      // escape workbook-sheet-combo
      // todo: v1 and v2 could be R1C1PARTIAL
      return `${a}${workbook || wb}${b}${sheet || sh}${c}${abs1}${col || v1}${abs2}${row || v2}`;
    case parser.RANGE:
    case parser.LIST:
    case parser.OPERATION:
      const ops = root.value.map(arg => formulaFromTree(arg, mod, parser, oroot));
      return ops.join("");
    case parser.STR_PLAIN:
    case parser.STR_ESCAPED: 
    case parser.BOOLEAN:
    case parser.STRING:
    case parser.NUMBER:
      return root.value.join("");
    case parser.NULL:
      return root.value.join("");
    default:
      console.error(root, tree)
      throw new Error(`Unknown type ${String(root.type)}`);
  }
}

const globalTable = new Table();

/*   TAGET INTERFACE   */
export const subscriptionTypes = {
  CHANGE_EVT: "change",
  INIT_EVT: "init",
};

class CellNameError extends Error {
  constructor(params) {
    super(params)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError)
    }
    this.name = 'CellNameError';
  }
}


export const parseCellName = (name, { workbook: wb, sheet: sh }) => {
  if(!name) {
    throw new CellNameError(`CellName is not defined`);
  }
  if(Array.isArray(name)) {
    switch (name.length) {
      case 4: {
        const [workbook, sheet, row, col] = name;
        return { workbook: workbook ?? wb, sheet: sheet ?? sh, row, col };
      }
      case 3: {
        const [sheet, row, col] = name;
        return { workbook: wb, sheet: sheet ?? sh, row, col };
      }
      case 2: {
        const [row, col] = name;
        return { workbook: wb, sheet: sh, row, col };
      }
      default:
        throw new CellNameError(`CellName [${name.join(", ")}] must have a length between 4 and 2, but found ${name.length}`);
    }
  }
  if(typeof name === 'String') {
    const zeroBased = /([0-9]+)[^0-9]([0-9]+)/.exec(name);
    if(zeroBased) {
      return { row: zeroBased[1], col: zeroBased[2] };
    }
    const a1format = /([A-Z]+)[^A-Z0-9]*([1-9][0-9]*)/.exec(name);
    if(a1format) {
      return { row: a1format[2], col: a1format[1] };
    }
    throw new CellNameError(`CellName '${name}' must adhere to either coordinate format (eg '0 0') or A1-Format (eg 'A1')`);
  }
  const { workbook, sheet, row: r, col: c, column, x, y } = name;
  const col = c || column || y;
  const row = r || x;
  if(col == null || row == null) { // null or undefined
    let str = name;
    try {
      str = JSON.stringify(name)
    } catch(e) {/* Ignore if we couldn't strinigy it, we only need it for the error message */}
    throw new CellNameError(`CellName <Object> ${str} must be a valid CellName eg { row: 0, col: 0 }`);
  }
  return { workbook: wb, sheet: sh, row, col };
}

const _createTable = ({
  debug,
  destroyOnUnregister = false, // if true, destroy cell  value on unregister 
  initialValues, // type T
  tableConfig = { parser: defaultParser, allowUnsafe: false, spillEnabled: true } // global configuration options for the table
}, overwritetable) => {
  const table = overwritetable || new Table(tableConfig);
  let destroyOnUnregisterInternal = destroyOnUnregister;
  let batchRunning = false;
  let tmpCalls = [];

  if(debug) {
    table.addEventListener("change", ({ value, formula, meta }) => {
      debug({ value, formula, meta, type: "change" });
    });
    table.addEventListener("init", ({ value, formula, meta }) => {
      debug({ value, formula, meta, type: "init" });
    });
  }

  const registerCell = (cellName, subscriber, { workbook: wb = DEFAULTWORKBOOK, sheet: sh = DEFAULTSHEET } = {}) => {
    const { row, col, sheet, workbook } = parseCellName(cellName, { workbook: wb, sheet: sh });
    // create cell if it doesn't exist
    const cell = new Cell({ table, row, col, allowUnsafe: tableConfig.allowUnsafe, workbook, sheet }); // auto-cached
    cell.subscribedCounter++;
    const evt = {
      type: "init",
      value: cell.value,
      formula: cell.formula,
      meta: { row, col, workbook, sheet }
    };
    if(batchRunning) {
      tmpCalls.push(() => subscriber(evt));
    } else {
      subscriber(evt);
    }
    const onEvt = t => ({ value, formula, meta }) => {
      if(row === meta.row && col === meta.col && sheet === meta.sheet && workbook === meta.workbook) {
        const evt = {
          type: t,
          value,
          formula,
          meta
        };
        if(batchRunning) {
          return tmpCalls.push(() => subscriber(evt));
        }
        subscriber(evt);
      }
    };
    const unsub1 = cell.table.addEventListener("change", onEvt("change"));
    const unsub2 = cell.table.addEventListener("init", onEvt("init"));
    return () => {
      unsub1();
      unsub2();
      cell.subscribedCounter--;
      if(destroyOnUnregisterInternal && cell.subscribedCounter === 0) {
        cell.destroy();
      }
    }
  };

  const batch = fn => {
    if(batchRunning) {
      throw new Error("Batch already running");
    }
    let e = null;
    batchRunning = true;
    tmpCalls = [];
    try {
      fn();
    } catch(err) {
      e = err;
    } finally {
      batchRunning = false;
      while(tmpCalls.length) {
        tmpCalls.shift()();
      }
    }
    if(e) {
      throw e;
    }
  };

  const getFieldState = (name, { workbook: wb = DEFAULTWORKBOOK, sheet: sh = DEFAULTSHEET } = {}) => {
    const { row, col, sheet, workbook } = parseCellName(cellName, { workbook: wb, sheet: sh });
    const cell = table.cells.find({ row, col, sheet, workbook });
    return cell && { value: cell.value, formula: cell.formula };
  }

  const getRegisteredFields = () => table.cells.values().map(({ workbook, sheet, row, col, value, formula } = {}) => ({ workbook, sheet, row, col, value, formula }));
  const getState = () => {
    // todo: scan all table cells for errors
    return {
      width: table.width,
      height: table.height,
      error: null,
      errors: [],
      spillEnabled: table.spillEnabled
    };
  };
  const subscribe = (subscriber) => {
    table.addEventListener("change", ({ value, formula, meta }) => {
      subscriber({ value, formula, meta, type: "change" });
    });
  };

  const change = (name, value, { workbook: wb = DEFAULTWORKBOOK, sheet: sh = DEFAULTSHEET } = {}) => {
    const { row, col, sheet, workbook } = parseCellName(name, { workbook: wb, sheet: sh });
    const cell = table.cells.find({ row, col, sheet, workbook });
    console.log(cell, table.cells, table)
    cell.onUpdate(value);
  }

  // debug: (state: FormState,nfieldStates: { [string]: CellState }) => void
  // CellState { change: (value) => null, error, initial /* was never changed */, pristine, /* initial === now */ invalid, valid, name, formula, value, ast }
  // CellName = { workbook?, sheet?, row: 0, col: 1, column: 1, x: 0, y: 1 } | [workbook?, sheet?, row=0, col=0] | /[0-9]+[^0-9][0-9]+/ | /[A-Z]+[^A-Z0-9][1-9][0-9]*/ | cellName(row, col)
  // TableState= { error /* global table error */, errors:  }

  return {
    batch, // fn(fn) -> void stops notifications from being fired while function runs
    change, // fn(CellName, value, { sheet?, workbook? }) -> void
    get destroyOnUnregister() {
      return destroyOnUnregisterInternal;
    }, // bool. - readWrite
    set destroyOnUnregister(val) {
      destroyOnUnregisterInternal = val;
    },
    getFieldState, // fn(name) -> CellState
    getRegisteredFields, // fn() -> [String]
    getState, // fn() -> TableState
    registerCell, // fn(CellName, subscriber: CellState => void, { workbook?, sheet? }?) => Unsubscribe
    subscribe, // (subscriber: FormState => void) => Unsubscribe
    resize: table.resize.bind(table),
    addRowAfter: table.addRowAfter.bind(table),
    addRowBefore: table.addRowBefore.bind(table),
    addColAfter: table.addColAfter.bind(table),
    addColBefore: table.addColBefore.bind(table),
    deleteCol: table.deleteCol.bind(table),
    deleteRow: table.deleteRow.bind(table),
    renameSheet: table.renameSheet.bind(table),
    renameWorkbook: table.renameWorkbook.bind(table),
    deleteSheet: table.deleteSheet.bind(table),
    deleteWorkbook: table.deleteWorkbook.bind(table),
  };



};

export const createTable = arg => _createTable(arg);
export const defaultTableAPI = _createTable({ debug: console.log.bind(console) }, globalTable);

// todo: expert a proxy to cell (or table?) instead of the whole thing
// todo: expose differnt table interface
// todo: Add auto-create option for lazy init
// todo: Add implicit recycle for unused cells
// export Table, globalTable, formulaFromTree, Cell, parseCellName, 
export default { createTable, defaultTableAPI };

