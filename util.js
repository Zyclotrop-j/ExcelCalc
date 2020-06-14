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
  constructor({ parser = defaultParser } = { parser: defaultParser }) {
    super();
    this._cells = {
      [this.DEFAULTWORKBOOK]: {
        [this.DEFAULTSHEET]: {
          byRow: [],
          byCol: [],
        }
      },
    };
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
        return that._cellSet.delete(cell);;
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


  addRowBefore(rrow, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    const row = parseInt(rrow);
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ row: row - 1, workbook, sheet });
    byRow.splice(row, 0, []);
    for(const col of byCol) {
      col.splice(row, 0, null);
    }
    // todo: walk through and mark cells as dirty
    byRow.slice(row+1).forEach((cell, idx) => {
      cell.update({
        row: idx + row + 1 // should be cell.row+1
      });
    });
  }

  addRowAfter(rrow, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    const row = parseInt(rrow);
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ row, workbook, sheet });
    byRow.splice(row+1, 0, []);
    for(const col of byCol) {
      col.splice(row+1, 0, null);
    }
    byRow.slice(row).forEach((cell, idx) => {
      cell.update({
        row: idx + row // should be cell.row+1
      });
    });
  }

  addColBefore(rcol, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    const col = parseInt(rcol);
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ col: col - 1, workbook, sheet });
    byCol.splice(col, 0, []);
    for(const row of byRow) {
      row.splice(col, 0, null);
    }
    byCol.slice(col+1).forEach((cell, idx) => {
      cell.update({
        col: idx + col + 1 // should be cell.row+1
      });
    });
  }

  addColAfter(rcol, { workbook = this.DEFAULTWORKBOOK, sheet = this.DEFAULTSHEET } = {}) {
    const col = parseInt(rcol);
    const { byRow, byCol } = this._cells[workbook][sheet];
    this.resize({ col, workbook, sheet });
    byCol.splice(col+1, 0, []);
    for(const row of byRow) {
      row.splice(col+1, 0, null);
    }
    byCol.slice(col).forEach((cell, idx) => {
      cell.update({
        col: idx + col // should be cell.row+1
      });
    });
  }

  // todo: delete col
  //todo: delete row


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
    this.allowUnsafe = allowUnsafe;
    this.subscribedCounter = 0;
    this.dirty = false;

    this.table.register(this);
    this.onDestroy = this.table.addEventListener(CELL_ACTION, this.onTableChange);
  }

  destroy() {
    this.onDestroy();
    this.table.cells.delete(this); // delete me from table
    this.dispatchEvent({ type: "destroy" })
      
  }

  markDrity() {
    this.dirty = true;
  }

  refresh(obj) {
    this._update(undefined, obj);
  }

  update({
    table,
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
    if(table && table !== this.table) {
      this.onDestroy(); // de-register table event listener
      this.table.cells.delete(this); // delete me from table
      const cellsReferencingThisCell = this.table.cells.filter(findCell(this));
      cellsReferencingThisCell.forEach(cell => cell.refresh());
      this.table = table;
      this.table.register(this);
      this.onDestroy = this.table.addEventListener(CELL_ACTION, this.onTableChange);
      doUpdate = true;
    }
    
    const rewriteProperties = Object.entries({
      workbook,
      sheet,
      row,
      col
    }).filter((([name, value]) => value && value !== this[name]));
    if(rewriteProperties.length) {
      // todo: instead of this, trace through the parser-reference and find actual references and replace them
      // in that, write the reverse: tree-to-formula!
      const cellsReferencingThisCell = this.table.cells.filter(cell => 
        cell.references.some(({ workbook = this.workbook, sheet = this.sheet, row, col }) => 
          this.workbook === workbook &&
          this.sheet === sheet &&
          (row === "*" || this.row === row) &&
          (col === "*" || this.col === col)
        )  
      );
      for(const cell of cellsReferencingThisCell) {
        for(const [name, newValue] of rewriteProperties) {
          cell.references.filter(({ workbook = this.workbook, sheet = this.sheet, row, col }) => 
            this.workbook === workbook &&
            this.sheet === sheet &&
            (row === "*" || this.row === row) &&
            (col === "*" || this.col === col)
          ).forEach(ref => { // re-write references to this cell
            ref[name] = ref[name] === "*" ? ref[name] : newValue;
          });
        }
        const before = cell.formula;
        cell.formula = this.reverse(cell, (cellReferenceExpression) => {
          if(findCell(this)(cellReferenceExpression)) { // said cell might have multiple cell-references; only if this cell-referecne is the one we're looking at
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
              sheet: sheet || sh,
              row: row || v2,
              col: col || v1,
            };
          }
          return cellReferenceExpression;
        });
        updates.push({ before, after: cell.formula, cell });
      }
      doUpdate = true;
    }
    this.workbook = workbook || this.workbook;
    this.sheet = sheet || this.sheet;
    this.row = row || this.row;
    this.col = col || this.col;
    const workbookname = this.workbook === DEFAULTWORKBOOK ? "" : `[${String(this.workbook)}]`;
    const sheetname = this.sheet === DEFAULTSHEET ? "" : `'${String(this.sheet)}'!`;
    this.name = name || `${workbookname}${sheetname}${String.fromCharCode(65+this.col)}${this.row+1}`; // eg A1

    if(doUpdate) {
      this._update();
      return [updates, () => this._update()];
    }
    
    return [updates, () => updates];
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
    const cellFinder = {
      getWorkbook: wb => {
          return {
              getSheet: sh => cellFinder.getSheet(sh, wb),
          };
      },
      getSheet: (sh, mayBeWorkbook) => {
            return {
                getRow: (r, op) => {
                  const x = cellFinder.getRow(r, op, mayBeWorkbook, sh);
                  return x;
                },
                getCol: (c, op) => {
                  const x = cellFinder.getCol(c, op, mayBeWorkbook, sh);
                  return x;
                },
            };
      },
      getCell: ({ row, col }, { calledBy }, workbook = this.workbook, sheet = this.sheet) =>
        this.table.cells.find(findCell({ row, col, workbook, sheet })).value,
      getRow: (row, { calledBy }, workbook = this.workbook, sheet = this.sheet) => ({
        getCol: (col, { calledBy }) =>
          this.table.cells.find(findCell({ row, col, workbook, sheet })).value,
        all: ({ calledBy }, { calledBy: cb2 } = {}) =>
          this.table
            .filter(({ row: r, workbook: wb, sheet: sh }) => row === r && wb === workbook && sheet === sheet)
            .map(({ value }) => value),
      }),
      getCol: (col, { calledBy }, workbook = this.workbook, sheet = this.sheet) => ({
        getRow: (row, { calledBy }) =>
          this.table.cells.find(findCell({ row, col, workbook, sheet })).value,
        all: ({ calledBy }, { calledBy: cb2 } = {}) =>
          this.table.cells
            .filter(({ col: c, workbook: wb, sheet: sh }) => col === c && wb === workbook && sheet === sheet)
            .map(({ value }) => value),
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
    console.log("R", r);
    this.formula = e;
    this.references = (r && r[this.table.parser.CELL_TRACE] || []);
    this.dirty = false;

    const evtData = { value: this.value, formula: this.formula, meta: { workbook: this.workbook, sheet: this.sheet, row: this.row, col: this.col, cell: this, calledBy: this.references } };
    this.table.dispatchEvent({ type: CELL_ACTION, ...evtData });
    this.table.dispatchEvent({ type: "change", ...evtData });
    const update = { value: this.value, formula: this.formula };
    this._onUpdate.call(this, update, this);
    this.dispatchEvent({ type: "change", ...evtData });
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
                this.value = evt.value;
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
  CHANGE: Symbol("SUBSCRIPTION_TYPE_CELL_CHANGE"),
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
  tableConfig = { parser: defaultParser, allowUnsafe: false } // global configuration options for the table
}, overwritetable) => {
  const table = overwritetable || new Table(tableConfig);
  let destroyOnUnregisterInternal = destroyOnUnregister;
  let batchRunning = false;
  let tmpCalls = [];

  if(debug) {
    table.addEventListener("change", ({ value, formula, meta }) => {
      debug({ value, formula, meta, type: "change" });
    });
  }

  const registerCell = (cellName, subscriber, { workbook: wb = DEFAULTWORKBOOK, sheet: sh = DEFAULTSHEET } = {}) => {
    const { row, col, sheet, workbook } = parseCellName(cellName, { workbook: wb, sheet: sh });
    const cell = new Cell({ table, row, col, allowUnsafe: tableConfig.allowUnsafe, workbook, sheet }); // auto-cached
    cell.subscribedCounter++;
    const unsub = cell.table.addEventListener("change", ({ value, formula, meta }) => {
      if(row === meta.row && col === meta.col && sheet === meta.sheet && workbook === meta.workbook) {
        const evt = {
          type: "change",
          value,
          formula,
          meta
        };
        if(batchRunning) {
          return tmpCalls.push(() => subscriber(evt));
        }
        subscriber(evt);
      }
    });
    return () => {
      unsub();
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

  const getRegisteredFields = () => table.cells.values().map(({ workbook, sheet, row, col, value, formula }) => ({ workbook, sheet, row, col, value, formula }));
  const getState = () => {
    // todo: scan all table cells for errors
    return {
      width: table.width,
      height: table.height,
      error: null,
      errors: [],
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
    console.log(cell, table, name, { row, col, sheet, workbook })
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
    resize: table.resize,
    addRowAfter: table.addRowAfter,
    addRowBefore: table.addRowBefore,
    addColAfter: table.addColAfter,
    addColBefore: table.addColBefore
  };



};

export const createTable = arg => _createTable(arg);
export const defaultTableAPI = _createTable({}, globalTable);

// todo: expert a proxy to cell (or table?) instead of the whole thing
// todo: expose differnt table interface
// todo: Add auto-create option for lazy init
// todo: Add implicit recycle for unused cells
// export Table, globalTable, formulaFromTree, Cell, parseCellName, 
export default { createTable, defaultTableAPI };

