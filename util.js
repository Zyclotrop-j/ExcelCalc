import defaultParser from "./index.js";

const CELL_ACTION = Symbol("CELL_ACTION");

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
    for (let cbsarr of stack) {
      const [cb, uco] = cbsarr;
      if (cb === callback) {
        const useCaptureOptionsKeys = Object.keys(useCaptureOptions);
        const ucoKeys = Object.keys(uco);
        if (
          useCaptureOptionsKeys.length === ucoKeys.length &&
          useCaptureOptionsKeys.every(
            (k) => useCaptureOptionsKeys[k] === ucoKeys[k]
          )
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
    this.cells = [];
    this.parser = parser;
  }

  register(cell) {
      this.cells.push(cell);
  }
}
export const globalTable = new Table();

const findCell = ({ row: r, col: c }) => ({ row, col }) => row === r && col === c;
const noop = () => undefined;

export class Cell extends EventTarget {
  // *one per Input*
  constructor({ name, onUpdate = () => null, table = globalTable, row, col, _value = "", formula = "", allowUnsafe = false }) {
    super();
    this.references = [];
    this.lastRun = null;
    this.expression = "";
    this.name = name || `${String.fromCharCode(65+col)}${row+1}`; // eg A1 // todo: parse for sheet etc
    this.onUpdate = onUpdate;
    this.table = table;
    this.table.register(this);
    this.row = row;
    this.col = col;
    this.value = { value: _value, type: this.table.parser.NULL };
    this.formula = formula;
    this.onTableChange = this.onTableChange.bind(this);
    this.refresh = this.refresh.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.allowUnsafe = allowUnsafe;

    this.onDestroy = this.table.addEventListener(CELL_ACTION, this.onTableChange);
  }

  destroy() {
      this.dispatchEvent({ type: "destroy" })
      this.onDestroy();
  }

  refresh(obj) {
    this._update(undefined, obj);
  }

  update(e) {
    this._update(e.target.value)
  }

  _update(e = this.formula, { calledBy: cldby } = {}) {
    const cellFinder = {
      getCell: ({ row, col }, { calledBy }) =>
        this.table.cells.find(findCell({ row, col })).value,
      getRow: (row, { calledBy }) => ({
        getCol: (col, { calledBy }) =>
          this.table.cells.find(findCell({ row, col })).value,
        all: ({ calledBy }, { calledBy: cb2 } = {}) =>
          this.table
            .filter(({ row: r }) => row === r)
            .map(({ value }) => value),
      }),
      getCol: (col, { calledBy }) => ({
        getRow: (row, { calledBy }) =>
          this.table.cells.find(findCell({ row, col })).value,
        all: ({ calledBy }, { calledBy: cb2 } = {}) =>
          this.table.cells
            .filter(({ col: c }) => col === c)
            .map(({ value }) => value),
      }),
    };
    console.log(`Updating cell ${this.name} value with `, cldby)
    const meta = {
      _context: cellFinder,
      _currentcell: { row: this.row, col: this.col }, // cell this formula is in
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
    this.formula = e;
    this.references = r && r[this.table.parser.CELL_TRACE] || [];
    const evtData = { value: this.value, formula: this.formula, meta: { row: this.row, col: this.col, cell: this, calledBy: this.references } };
    this.table.dispatchEvent({ type: CELL_ACTION, ...evtData });
    this.table.dispatchEvent({ type: "change", ...evtData });
    const update = { value: this.value, formula: this.formula };
    this.onUpdate.call(this, update, this);
    this.dispatchEvent({ type: "change", ...evtData });
    return update;
  }

  subscribe(observer, maybeOnError, maybeOnComplete) {
    const onNext = observer.next || observer;
    const onError = observer.error|| maybeOnError || noop;
    const onComplete = observer.complete|| maybeOnComplete || noop;
    const unsub1 = this.addEventListener("change", (evt) => {
        onNext(evt);
    });
    const unsub2 = this.addEventListener("destroy", (evt) => {
        onComplete();
    });

    let closed = false;
    const subscription = {
        unsubscribe: () => {
            unsub1();
            unsub2();
            closed = true;
        },
        get closed() { return closed; }
    };
    if(observer.start) {
        observer.start(subscription);
    }

    return subscription;
  }

  onTableChange(evt) {
    if(evt.type === CELL_ACTION) {
        if(evt.meta.row === this.row && evt.meta.col === this.col) { // self
            return;
        }
        console.log(this.name, this.references)
        // if the changed cell is something that is referenced from this cell
        if(this.references.some(({ row, col }) => (row === "*" || evt.meta.row === (row-1)) && (col === "*" || (col-1) === evt.meta.col))) { // Warning: references is in 1-based format!! // todo trace in parser and correct
            if(evt.value.value === this.table.parser.CIRCULAR) {
                this.value = evt.value;
                return;
            }
            this.refresh({ calledBy: evt.meta.calledBy || [] });
        }
    }
  }

  
}

export default { Table, globalTable, Cell };

