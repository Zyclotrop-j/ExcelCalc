
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const CELL = Symbol("CELL");
    const STR_ESCAPED = Symbol("STR_ESCAPED");
    const STR_PLAIN = Symbol("STR_PLAIN");
    const AGGREGATE = Symbol("AGGREGATE");
    const SUBTOTAL = Symbol("SUBTOTAL");
    const NUMBER = Symbol("NUMBER");
    const COMPLEX_NUMBER = Symbol("COMPLEX_NUMBER");
    const LIST = Symbol("LIST");
    const MATRIX = Symbol("MATRIX");
    const STRING = Symbol("STRING");
    const ANY = Symbol("ANY");
    const BOOLEAN = Symbol("BOOLEAN");
    const FUNCTION = Symbol("FUNCTION");
    const ARGUMENTS = Symbol("ARGUMENTS");
    const NULL = Symbol("NULL"); // Blank cell
    const ARRAY = Symbol("ARRAY"); // return value of a array formula aka multiple return values
    const ERROR = Symbol("ERROR");
    const DATE = Symbol("DATE");
    const TIME = Symbol("TIME");
    const DATETIME = Symbol("DATETIME");
    const TRACE = Symbol("_TRACE");
    const CELL_TRACE = Symbol("_CELL_TRACE");
    const HYPERLINK = Symbol("HYPERLINK");
    const NAVALUE = Symbol("#N/A");
    const VVALUE = Symbol("#VALUE!");
    const REFVALUE = Symbol("#REF!");
    const NUMVALUE = Symbol("#NUM");
    const DIV0 = Symbol("#DIV/0!");
    const NULLE= Symbol("#NULL!");
    const NAMEE = Symbol("#NAME?");
    const GETTINGDATA= Symbol("#GETTING_DATA");
    const INLINE = Symbol("INLINE");
    const HIDDEN = Symbol("HIDDEN"); // cell visibility, set meta:{visibility:HIDDEN} when cell is hidden; effects some functions
    const NATURALREF = Symbol("NATURAL_REFERENCE");
    const CIRCULAR = Symbol("CIRCULAR_REFERENCE");

    const BESSEL = {
        /* todo: get from https://github.com/SheetJS/bessel */
        /* or maybe require( '@stdlib/math/base/special/besselj0' );? */
    };

      const romannumeral_classic = {
        "I": 1,
        "IV": 4,
        "V": 5,
        "IX": 9,
        "X": 10,
        "XL": 40,
        "L": 50,
        "XC": 90,
        "C": 100,
        "CD": 400,
        "D": 500,
        "CM": 900,
        "M": 1000,
    };
    const romannumeral_baseSet = romannumeral_classic;
    const romannumeral_mode1 = {
        ...romannumeral_classic,
        "LD": 500-50,
        "VL": 50-5,   
    };
    const romannumeral_mode2 = {
        ...romannumeral_mode1,
        "IX": 10-1,
        "XD": 500-10,
    };
    const romannumeral_mode3 = {
        ...romannumeral_mode2,
        "VD": 500-5,
    };
    const romannumeral_simplified = {
        ...romannumeral_baseSet,
        "ID": 500-1,
    };
    const romannumeral_extended = {
        "Mↁ": 4000,
        "ↁ": 5000,
        "Mↂ": 9000, 
        "ↂ": 10000,
        "ↂↇ": 40000,
        "ↇ": 50000,
        "ↂↈ" : 90000,
        "ↈ": 100000
    };
    const romannumeral_romanSymbols = {
        "Ⅰ": 1,
        "Ⅱ": 2,
        "Ⅲ": 3,
        "Ⅳ": 4,
        "Ⅴ": 5,
        "Ⅵ": 6,
        "Ⅶ": 7, 
        "Ⅷ": 8,
        "Ⅸ": 9,
        "Ⅹ": 10,
        "Ⅺ": 11,
        "Ⅻ": 12,
        "ⅩⅬ": 40,
        "Ⅼ": 50,
        "ⅩⅭ": 90,
        "Ⅽ": 100,
        "ⅭⅮ": 400,
        "Ⅾ": 500,
        "ⅭⅯ": 900,
        "Ⅿ": 1000,      
        ...romannumeral_extended
    };
    const romannumeralmodes = new Map([
        [ 0, romannumeral_classic ],
        [ 1, romannumeral_mode1 ],
        [ 2, romannumeral_mode2 ],
        [ 3, romannumeral_mode3 ],
        [ 4, romannumeral_simplified ],
        [ true, romannumeral_baseSet ],
        [ false, romannumeral_simplified ],
        [ "R", romannumeral_romanSymbols ],
        [ "0E", { ...romannumeral_classic, ...romannumeral_extended } ],
        [ "1E", { ...romannumeral_mode1, ...romannumeral_extended, "Dↁ": 5000-500 } ],
        [ "2E", { ...romannumeral_mode2, ...romannumeral_extended,
            "Dↁ": 5000-500, 
            "Cↂ": 10000-100,
            "Cↁ": 5000-100,
            "ↁↇ": 50000-5000, 
            "ↂↈ": 100000-1000,
            "Mↇ": 50000-1000,
            
        } ],
        [ "3E", { ...romannumeral_mode3, ...romannumeral_extended,
            "Dↁ": 5000-500, 
            "Cↂ": 10000-100,
            "Cↁ": 5000-100,
            "Lↁ": 5000-50,
            "ↁↇ": 50000-5000, 
            "ↂↈ": 100000-1000,
            "Mↇ": 50000-1000,
            "Dↇ": 50000-500,
        } ],
        [ "4E", { ...romannumeral_simplified, ...romannumeral_extended,
            "Dↁ": 5000-500, 
            "Cↂ": 10000-100,
            "Cↁ": 5000-100,
            "Lↁ": 5000-50,
            "Xↁ": 5000-10,
            "ↁↇ": 50000-5000, 
            "ↂↈ": 100000-1000,
            "Mↇ": 50000-1000,
            "Dↇ": 50000-500,
            "Cↇ": 50000-100,
        } ],
        [ "EE", { ...romannumeral_simplified, ...romannumeral_extended,
            "Dↁ": 5000-500, 
            "Cↂ": 10000-100,
            "Cↁ": 5000-100,
            "Lↁ": 5000-50,
            "Xↁ": 5000-10,
            "Lↁ": 5000-50, 
            "Xↂ": 10000-10,
            "Xↁ": 5000-10,
            "Vↁ": 5000-5,
            "Iↁ": 5000-1,
            "Iↂ": 10000-1,
            "Vↂ": 10000-5,
            "ↁↇ": 50000-5000, 
            "ↂↈ": 100000-1000,
            "Mↇ": 50000-1000,
            "Dↇ": 50000-500,
            "Cↇ": 50000-100,
            "Lↇ": 50000-50,
            "Xↇ": 50000-10,
            "Xↈ": 100000-10,
            "Lↈ": 100000-50,
            "Vↇ": 50000-5,
            "Iↇ": 50000-1,
            "Iↈ": 100000-1,
            "Vↈ": 100000-5,
            "IM": 1000 - 1,
            "VM": 1000 - 5,
        } ],
        [ "R", romannumeral_romanSymbols ],
        [ "RE", {
            ...romannumeral_romanSymbols,
            "Ⅾↁ": 5000-500, 
            "Ⅽↂ": 10000-100,
            "Ⅽↁ": 5000-100,
            "Ⅼↁ": 5000-50,
            "Ⅹↁ": 5000-10,
            "Ⅼↁ": 5000-50, 
            "Ⅹↂ": 10000-10,
            "Ⅹↁ": 5000-10,
            "Ⅴↁ": 5000-5,
            "Ⅰↁ": 5000-1,
            "Ⅰↂ": 10000-1,
            "Ⅴↂ": 10000-5,
            "ↁↇ": 50000-5000, 
            "ↂↈ": 100000-1000,
            "Ⅿↇ": 50000-1000,
            "Ⅾↇ": 50000-500,
            "Ⅽↇ": 50000-100,
            "Ⅼↇ": 50000-50,
            "Ⅹↇ": 50000-10,
            "Ⅹↈ": 100000-10,
            "Ⅼↈ": 100000-50,
            "Ⅴↇ": 50000-5,
            "Ⅰↇ": 50000-1,
            "Ⅰↈ": 100000-1,
            "Ⅴↈ": 100000-5,
            "ⅠⅯ": 1000 - 1,
            "ⅤⅯ": 1000 - 5,
        } ],
        
    ]);

      const weight = {
        "g": 1,
        "sg": 6.85217658567918E-05,
        "lbm": 0.00220462262184878,
        "u": 6.02214179421676E+23,
        "ozm": 0.0352739619495804,
        "grain": 15.4323583529414,
        "cwt": 2.20462262184878E-05,
        "shweight": 2.20462262184878E-05,
        "uk_cwt": 1.96841305522212E-05,
        "lcwt": 1.96841305522212E-05,
        "hweight": 1.96841305522212E-05,
        "stone": 0.00015747304441777,
        "ton": 1.10231131092439E-06,
        "uk_ton": 9.84206527611061E-07,
        "LTON": 9.84206527611061E-07,
        "brton": 9.84206527611061E-07,
    };
    const length = {
        "m": 1,
        "mi": 0.000621371192237334,
        "Nmi": 0.000539956803455724,
        "in": 39.3700787401575,
        "ft": 3.28083989501312,
        "yd": 1.09361329833771,
        "ang": 10000000000,
        "ell": 0.874890638670166,
        "ly": 1.05700083402462E-16,
        "parsec": 3.24077928966473E-17,
        "pc": 3.24077928966473E-17,
        "Picapt": 2834.64566929134,
        "Pica": 2834.64566929134,
        "pica": 236.220472440945,
        "survey_mi": 0.00062136994949495,
    };
    const time = {
        "yr": 0.0027378507871321,
        "day": 1,
        "d": 1,
        "hr": 24,
        "mn": 1440,
        "min": 1440,
        "sec": 86400,
        "s": 86400,
    };
    const press = {
        "Pa": 1,
        "p": 1,
        "atm": 9.86923266716013E-06,
        "at": 9.86923266716013E-06,
        "mmHg": 0.00750063755419211,
        "psi": 0.000145037737730209,
        "Torr": 0.0075006168270417,
    };
    const force = {
        "N": 1,
        "dyn": 100000,
        "dy": 100000,
        "lbf": 0.22480894309971,
        "pond": 101.971621297793,
    };
    const energy = {
        "J": 1,
        "e": 10000000,
        "c": 0.239005736137667,
        "cal": 0.238845896627496,
        "eV": 6241509647120420000,
        "ev": 6241509647120420000,
        "HPh": 3.72506135998619E-07,
        "hh": 3.72506135998619E-07,
        "Wh": 0.000277777777777778,
        "wh": 0.000277777777777778,
        "flb": 0.737562149277265,
        "BTU": 0.000947817120313317,
        "btu": 0.000947817120313317,
    };
    const power = {
        "HP": 0.00134102208959503,
        "h": 0.00134102208959503,
        "PS": 0.0013596216173039,
        "W": 1,
        "w": 1,
    };
    const magn = {
        "T": 1,
        "ga": 10000,
    };
    const temperature = {
        "C": 1,
        "cel": 1,
        "F": 33.8,
        "fah": 33.8,
        "K": 274.15,
        "kel": 274.15,
        "Rank": 493.47,
        "Reau": 0.8,
    };
    const space$1 = {
        "tsp": 202884.136211058,
        "tspm": 200000,
        "tbs": 67628.045403686,
        "oz": 33814.022701843,
        "cup": 4226.75283773038,
        "pt": 2113.37641886519,
        "us_pt": 2113.37641886519,
        "uk_pt": 1759.7539863927,
        "qt": 1056.68820943259,
        "uk_qt": 879.876993196351,
        "gal": 264.172052358148,
        "uk_gal": 219.969248299088,
        "l": 1000,
        "L": 1000,
        "lt": 1000,
        "ang3": 1E+30,
        "ang^3": 1E+30,
        "barrel": 6.2898107704321,
        "bushel": 28.3775932584017,
        "ft3": 35.3146667214886,
        "ft^3": 35.3146667214886,
        "in3": 61023.7440947323,
        "in^3": 61023.7440947323,
        "ly3": 1.18093498844171E-48,
        "ly^3": 1.18093498844171E-48,
        "m3": 1,
        "m^3": 1,
        "mi3": 2.39912758578928E-10,
        "mi^3": 2.39912758578928E-10,
        "yd3": 1.30795061931439,
        "yd^3": 1.30795061931439,
        "Nmi3": 1.57426214685811E-10,
        "Nmi^3": 1.57426214685811E-10,
        "Picapt3": 22776990435.8706,
        "Picapt^3": 22776990435.8706,
        "Pica3": 22776990435.8706,
        "Pica^3": 22776990435.8706,
        "GRT": 0.353146667214886,
        "regton": 0.353146667214886,
        "MTON": 0.882866668037215,
    };
    const area = {
        "uk_acre": 0.000247105381467165,
        "us_acre": 0.000247104393046628,
        "ang2": 1E+20,
        "ar": 0.01,
        "ft2": 10.7639104167097,
        "ft^2": 10.7639104167097,
        "ha": 0.0001,
        "in2": 1550.0031000062,
        "in^2": 1550.0031000062,
        "ly2": 1.11725076312873E-32,
        "ly^2": 1.11725076312873E-32,
        "m2": 1,
        "m^2": 1,
        "Morgen": 0.0004,
        "mi2": 3.86102158542446E-07,
        "mi^2": 3.86102158542446E-07,
        "Nmi2": 2.91553349598123E-07,
        "Nmi^2": 2.91553349598123E-07,
        "Picapt2": 8035216.07043214,
        "Pica2": 8035216.07043214,
        "Pica^2": 8035216.07043214,
        "Picapt^2": 8035216.07043214,
        "yd2": 1.19599004630108,
        "yd^2": 1.19599004630108,
    };
    const computer = {
        "bit": 1,
        "byte": 0.125,
    };
    const speed = {
        "admkn": 0.000539611824837685,
        "kn": 0.000539956803455723,
        "m/h": 1,
        "m/hr": 1,
        "m/s": 0.000277777777777778,
        "m/sec": 0.000277777777777778,
        "mph": 0.000621371192237334,

    };

    const prefixes = {
      "Yi": 1.2089258196146292e+24,
      "Zi": 1.1805916207174113e+21,
      "Ei": 1152921504606847000,
      "Pi": 1125899906842624,
      "Ti": 1099511627776,
      "Gi": 1073741824,
      "Mi": 1048576,
      "ki": 1024,
      "Y": 1e+24,
      "Z": 1e+21,
      "E": 1000000000000000000,
      "P": 1000000000000000,
      "T": 1000000000000,
      "G": 1000000000,
      "M": 1000000,
      "k": 1000,
      "h": 100,
      "da": 10,
      "e": 10,
      "d": 0.1,
      "c": 0.01,
      "m": 0.001,
      "u": 0.000001,
      "n": 1e-9,
      "p": 1e-12,
      "f": 1e-15,
      "a": 1e-18,
      "z": 1.0000000000000001e-21,
      "y": 1.0000000000000001e-24,
    };

    const functions = {
        _TOSEARCHSTRING: ([string, start=true, end=true, casesensitive=false], context) => new RegExp((start?"^":"")+
            string.replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape characters with special meaning to js regex
                    .replace(/([^~](~~))*\*/g,"$1.*") // match non-escaped *
                    .replace(/([^~](~~))*\?/g,"$1.") // match non-escaped ?
                    .replace(/~([?*])/g,"\\$1") // match escaped ? and *
                    .replace(/~~/g, "~") + // convert ~~ as per excel spec
                 (end?"$":""), casesensitive?"":'i'),
        _GREATER: ([a,b], context) => a>b,
        _SMALLER: ([a,b], context) => a<b,
        _EQUAL: ([a,b], context) => a==b,
        _GREATER_OR_EQUAL: ([a,b], context) => context.functions._GREATER([a,b], context) || context.functions._EQUAL([a,b], context),
        _SMALLER_OR_EQUAL: ([a,b], context) => context.functions._SMALLER([a,b], context) || context.functions._EQUAL([a,b], context),
        SUM: (allargs, context) => {
          const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                    return sum;
                case NUMBER:
                  return sum + value;
                case LIST:
                  const {value:s} = context.functions.SUM(value, context);
                  return sum+s;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in SUM");
              }
          }, 0);
          return { type: NUMBER, value: result };
        },
        AVERAGE: (allargs, context) => {
          const [result,ccount] = allargs.reduce(([sum,count], { value, type }) => {
              switch(type) {
                  case NULL:
                    return [sum,count];
                case NUMBER:
                  return [sum + value,count+1];
                case LIST:
                  const { result, ccount } = context.functions.AVERAGE(value).meta;
                  return [sum+result, count+ccount ];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in AVERAGE");
              }
          }, [0,0]);
          return { type: NUMBER, value: result/ccount, meta: { result, ccount } };
        },
        _CELL_COUNT: (allargs, _context) => {
          const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                case ERROR:
                case BOOLEAN:
                    return sum;
                case NUMBER:
                case DATE:
                  return sum + 1;
                case LIST:
                    const {value:count} = _context.functions._CELL_COUNT(value, _context);
                      return sum + count;
                case STRING:
                    return Number.isNaN(parseFloat(value)) ? sum : sum + 1; 
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in SUM");
              }
          }, 0);
          return { type: NUMBER, value: result };
        },
        _CELL_COUNTA: (allargs, _context) => {
          const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                    return sum;
                case NUMBER:
                case DATE:
                case STRING:
                case ERROR:
                case BOOLEAN:
                  return sum + 1;
                case LIST:
                    const {value:count} = _context.functions._CELL_COUNTA(value, _context);
                      return sum + count;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in SUM");
              }
          }, 0);
          return { type: NUMBER, value: result };
        },
        COUNT: (args, _context) => {
          return _context.functions._CELL_COUNT(args, _context);
        },
        COUNTA: (args, _context) => {
          return _context.functions._CELL_COUNTA(args, _context);
        },
        COUNTBLANK: ([range], context) => {
          if(range.type !== LIST) {
              throw new Error("COUNTA must be supplied a LIST, found value "+String(range.value)+" of type "+String(range.type));
          }
          return { type: NUMBER, value: range.value.filter(({ value, type }) => type === NULL || value === "").length };
        },
        IF: ([iff, thenn, elsee], context) => {
          if(iff.type !== BOOLEAN) {
              throw new Error("iff must be supplied a BOOLEAN as first argument, found value "+String(iff.value)+" of type "+String(iff.type));
          }
          return iff.value ? thenn : elsee;
        },
        TRIM: ([v], context) => {
          if(v.type !== STRING) {
              throw new Error("TRIM must be supplied a STRING, found value "+String(v.value)+" of type "+String(v.type));
          }
          const result = v.value.trim().replace(/[ ][ ]+/g, " ");
          return { type: STRING, value: result };
        },
        MAX: (allargs, context) => {
          const result = allargs.reduce((max, { value, type }) => {
              switch(type) {
                case STRING:
                case NULL:
        return max;
                case NUMBER:
                  return max < value ? value : max;
                case LIST:
                  const {value:v} = context.functions.MAX(value,context);
                  return max < v? v: max;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MAX");
              }
          }, -Infinity);
          return { type: NUMBER, value: result };
        },
        MIN: (allargs, context) => {
          const result = allargs.reduce((max, { value, type }) => {
              switch(type) {
                case STRING:
                case NULL:
        return max;
                case NUMBER:
                  return max > value ? value : max;
                case LIST:
                  const {value:v} = context.functions.MIN(value,context);
                  return max > v? v: max;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MIN");
              }
          }, Infinity);
          return { type: NUMBER, value: result };
        },
        CONCATENATE: (allargs, context) => ({ type: STRING, value: allargs.map(i => i.value||"").join("") }),
        SUBSTITUTE: ([{ value: text }, { value: oldText }, { value: newText }, { value: nthAppearance  }={}], context) => {
            let i = 0;
            return ({ type: STRING, value: text.replace(new RegExp(oldText, "g"), nthAppearance ? (match, pos, original) => {
              i++;
              return (i == nthAppearance) ? newText : match;
              } : newText)
            });
        },
        VALUE: ([arg], context) => ({ type: NUMBER, value: parseFloat(arg.value) }),
        EXACT: ([a, b], context) => ({ type: BOOLEAN, value: a.value === b.value && a.type === b.type }),
        UPPER: ([arg], context) => ({ type: STRING, value: arg.value.toUpperCase() }),
        LOWER: ([arg], context) => ({ type: STRING, value: arg.value.toLowerCase() }),
        PROPER: ([arg], context) => ({ type: STRING, value: arg.value.toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ') }),
        LEFT: ([{ value: text }, { value: numChars = 1 } = { numChars: 1 }], context) =>
            ({ type: STRING, value: text.slice(0, numChars) }),
        RIGHT: ([{ value: text }, { value: numChars = 1 } = { numChars: 1 }], context) =>
            ({ type: STRING, value: text.slice(text.length - numChars) }),
        MID: ([{ value: text }, { value: startNum}, { value: numChars}], context) =>
            ({ type: STRING, value: text.slice(startNum, startNum+numChars) }),
        AND: (allargs, context) => ({ type: BOOLEAN, value: allargs.reduce((p, i) => i.value && p, true) }),
        OR: (allargs, context) => ({ type: BOOLEAN, value: allargs.reduce((p, i) => i.value || p, true) }),
        XOR: (allargs, context) => ({ type: BOOLEAN, value: allargs.reduce((p, i) => (i.value && !p) || (!i.value && p), false) }),
        NOT: ([arg], context) => ({ type: BOOLEAN, value: !arg.value }),
        IFERROR: ([iserror, valueiferror], context) => iserror.type === ERROR ? valueiferror : iserror,
        IFNA: ([iserror, valueiferror], context) => iserror.type === ERROR && iserror.value === NAVALUE ? valueiferror : iserror,
        // sumif, sumifs
        SUMPRODUCT: ([{ value: arg0 }, ...args], context) => args.every(i => i.value.length === arg0.length) ?
            { type: NUMBER, value: arg0.reduce((p, { value }, idx) => p + args.reduce((p, { value: arg }) => arg[idx].value * p, value), 0) }:
            { type: ERROR, value: VVALUE },
        RAND: () => ({ type: NUMBER, value: Math.random() }),
        RANDBETWEEN: ([{value:min}, {value:max}], context) => ({ type: NUMBER, value: Math.floor(Math.random() * (max - min + 1) + min) }),
        ROUND: ([{value:num}, {value: dec}], context) => ({ type: NUMBER, value: 
            dec < 0 ?
            Math.round(num * Math.pow(10, dec)) * Math.pow(10, -dec) : // Avoid rounding errors
            Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec) // Avoid rounding errors
        }),
        ROUNDUP: ([{value:num}, {value: dec}], context) => ({ type: NUMBER, value: Math.ceil(num * Math.pow(10, dec)) / Math.pow(10, dec) }),
        ROUNDDOWN: ([{value:num}, {value: dec}], context) => ({ type: NUMBER, value: Math.floor(num * Math.pow(10, dec)) / Math.pow(10, dec) }),
        
        MROUND: ([{value}, {value: dec}], context) => ({ type: NUMBER, value: dec*Math.round(value/dec) }),
        FLOOR: ([{value}, {value: dec}], context) => ({ type: NUMBER, value: dec*Math.floor(value/dec) }),
        CEILING: ([{value}, {value: dec}], context) => ({ type: NUMBER, value: dec*Math.ceil(value/dec) }),
        INT: ([{value}, {value: dec}], context) => ({ type: NUMBER, value: Math.floor(value) }),
        TRUNC: ([{value}, {value: dec}], context) => {
          const m = (value+"").match(new RegExp("(\\d+\\.\\d{" + dec + "})(\\d)"));
          return { type: NUMBER, value: m ? parseFloat(m[1]) : value };
        },
        EVEN: ([{value}], context) => ({ type: NUMBER, value: 2*Math.round(value/2) }),
        ODD: ([{value}], context) => ({ type: NUMBER, value: value<0 ? 2*Math.ceil(value/2)-1 : 2*Math.floor(value/2)+1 }),
        MOD: ([{value:n}, {value:d}], context) => ({ type: NUMBER, value: n - d*Math.floor(n/d) }),
        SMALL: ([{value}, {value:k}], context) => ({ type: NUMBER, value: value.sort(({value:a},{value:b}) => a-b)[k-1] }),
        LARGE: ([{value}, {value:k}], context) => ({ type: NUMBER, value: value.sort(({value:a},{value:b}) => b-a)[k-1] }),
        COUNTIF: ([{value:range,type:t1},{value:criteria,type}], context) => {
            if(t1 !== LIST) {
              throw new Error("COUNTIF must be supplied a LIST, found value "+String(value)+" of type "+String(t1));
            }
            const f = context.functions._CRITMATCHER([{value:criteria,type}], context);
            return { type: NUMBER, value: range.filter(f).length };
        },
        _CRITMATCHER: ([{value:criterium,type}], context) => {
            if(type!==STRING) {
                const f = ({value}) => value == criterium;
                f.criterium = criterium;
                return f;
            }
            const cf = {
              ">=": u => u >= parseFloat(criterium.substring(2)),
              "<=": u => u <= parseFloat(criterium.substring(2)),
              "<>": u => u != parseFloat(criterium.substring(2))
            }[criterium.substring(0,2)] ||
            {
              ">": u => u > parseFloat(criterium.substring(1)),
              "<": u => u < parseFloat(criterium.substring(1)),
              "=": u => u == parseFloat(criterium.substring(1)) || (""+u) === criterium.substring(1),
            }[criterium.substring(0,1)];
            
            if(cf) {
                const f = ({value}) => cf(value);
                f.criterium = criterium;
                return f;
            }
            
            const matcher = context.functions._TOSEARCHSTRING([criterium]);
            // new RegExp("^"+criterium.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g,".*").replace(/\?/g,".")+"$");
            const f = ({value}) => matcher.test(value);
            f.criterium = criterium;
            return f;
        },
        COUNTIFS: (args, context) => {
            if(args.length < 2) {
                throw new Error("Excepted 'criteria_range1, criteria1', but found "+(args.length?"'criteria_range1'":"no arguments"));
            }
            if(args.length % 2) { // if 1
                throw new Error("Wrong number of arguments, excepted 'criteria_range1, criteria1, [criteria_range2, criteria2]...', but found "+
                args.map((i, idx) => idx%2?"criteria"+Math.ceil((idx+1)/2):"criteria_range"+Math.ceil((idx+1)/2)).join(", "));
            }
            const [ranges, criteria] = args.reduce(([l1,l2],arg,idx) => 
                idx%2?[l1,[...l2, arg]]:[[...l1, arg], l2], // sort into 2 lists, so that [a,1,b,2,c,3]->[[a,b,c],[1,2,3]]
            [[],[]]);
            if(!ranges.every((i,idx,arr) => i.length === arr[0].length)) {
                throw new Error("All defined ranges need to have the same length");
            }
            
            const cfunctions = criteria.map(({value:criterium,type}) => {
              return context.functions._CRITMATCHER([{value:criterium,type}], context);
            });
            return {
                type: NUMBER,
                value: ranges[0].value.reduce((count, _, idx) => // pick any range, they're all same length
                 // if in every range at current index (idx) the function for the current 'row' (jdx), add 1
                    count+ranges.every(({value:r},jdx) => cfunctions[jdx](r[idx])),
                0)
            };
        },
        VLOOKUP: ([lookup_value,table_array,col_index_num,range_lookup={ type: BOOLEAN, value: true }], context) => {
            if(table_array.type === LIST) {
                table_array = { type: MATRIX, value: [table_array.value] };
            }
            if(table_array.type !== MATRIX) {
                throw new Error("Expected table_array to be a MATRIX but found "+String(table_array.value)+" ("+String(table_array.type)+")");
            }
            
            const idx = table_array.value[0].findIndex(i => lookup_value.value == i.value ||
                (lookup_value.type === STRING && i.type === STRING && lookup_value.value.toLowerCase() === i.value.toLowerCase())
            );
            if(idx > -1) {
                // Exact match
                return table_array.value[col_index_num.value-1][idx];
            }
            if(!range_lookup.value) {
                return { type: ERROR, value: NAVALUE };
            }
            // Range lookup: Return last values of values that are smaller than criteria
            const searchr = [].concat(table_array.value[0]);
            const { _GREATER } = context.functions;
            let item = { type: ERROR, value: NAVALUE };
            while(searchr.length) {
                if(_GREATER(searchr[0].value, lookup_value.value)) {
                    return item;
                }
                const idx = table_array.value[0].length - searchr.length;// 0, 1, 2, 3, ....
                item = table_array.value[col_index_num.value-1][idx];
                searchr.shift();
            }
            return item;
        },
        INDEX: ([array,{value:row_num},{value:column_num}={value:1}], context) => {
            if(array.type === LIST) {
                array = { type: MATRIX, value: [array.value] };
            }
            if(array.type !== MATRIX) {
                throw new Error("Expected table_array to be a MATRIX but found "+String(array.value)+" ("+String(array.type)+")");
            }
            return array.value[row_num-1][column_num-1];
        },
        MATCH: ([lookup_value, lookup_array, {value:match_type}={type:NUMBER, value:1}], context) => {
            if(table_array.type !== LIST) {
                throw new Error("Expected table_array to be a LIST but found "+String(table_array.value)+" ("+String(table_array.type)+")");
            }
            if([-1,0,1,"-1","0","1"].indexOf(match_type) === -1) {
                throw new Error("Expected match_type to be one of [-1,0,1] but found "+String(match_type.value)+" ("+String(match_type.type)+")");
            }
            const idx = table_array.value.findIndex(i => lookup_value.value == i.value ||
                (lookup_value.type === STRING && i.type === STRING && lookup_value.value.toLowerCase() === i.value.toLowerCase())
            );
            if(idx > -1) {
                return table_array.value[idx];
            }
            if(match_type === 0 || match_type === "0") {
                return { type: ERROR, value: NAVALUE };
            }
            // Range lookup: Return last values of values that are smaller than criteria
            const searchr = [].concat(table_array.value[0]);
            let item = { type: ERROR, value: NAVALUE };
            const { _GREATER, _SMALLER } = context.functions;
            while(searchr.length) {
                if((match_type === 1 || match_type === "1") && _GREATER(searchr[0].value, lookup_value.value)) {
                    return item;
                }
                if((match_type === -1 || match_type === "-1") && _SMALLER(searchr[0].value, lookup_value.value)) {
                    return item;
                }
                const idx = table_array.value[0].length - searchr.length;// 0, 1, 2, 3, ....
                item = table_array.value[col_index_num.value-1][idx];
                searchr.shift();
            }
            return item;
        },
        INDIRECT: ([ref_text, a1={value:true, type:BOOLEAN}], context) => {
            const parsed = context.parser(ref_text.value, context);
            if(!parsed) {
                return { type: ERROR, value: REFVALUE };
            }
            // todo: validate with parsed.meta.type !== CELL
            return parsed;
        },
        OFFSET: ([reference, {value:offsetrows}, {value:offsetcols}, height={}, width={}], functioncontext) => {
            let topleft = reference;
            if(reference.type === MATRIX) {
                topleft = reference.value[0][0];
            }
            if(reference.type === LIST) {
                topleft = reference.value[0];
            }
            if(topleft.meta.type !== CELL) {
                throw new Error("Expected CELL, LIST<CELL> or MATRIX<CELL> as first argument of OFFSET, found "+String(reference.value)+" ("+String(reference.type)+") /"+String(topleft.value)+" ("+String(topleft.meta.type)+")");
            }
            const top = topleft.meta.row + offsetrows;
            const left = topleft.meta.col + offsetcols;
            const heightvalue = height.value || reference.rowspan || 1;
            const widthvalue = width.value || reference.colspan || 1;
            const results = [];
            let errorflag = false;
            for(let row = top; row <= top+heightvalue-1; row++) {
              const t = [];
              for(let col = left; col <= left+widthvalue-1; col++) {
                  const v = context.getRow(row-1).getCol(col-1) || { value: REFVALUE, type: ERROR };
                  if(!v) { errorflag=true; }
                  t.push({ ...v, meta: { type: CELL, row, col } });
              }
              results.push(t);
            }
            if(errorflag) {
                return { type: ERROR, value: REFVALUE, meta: { partial_results: results } };
            }
            if(results.length === 1 && results.every(r => r.length === 1)) {
                return results[0][0]; // Single cell
            }
            if(results.length === 1) {
                return { type: LIST, value: results[0], rowspan: 1, colspan: results[0].length }
            }
            if(results.every(r => r.length === 1)) {
                return { type: LIST, value: results.map(i => i[0]), rowspan: results.length, colspan: 1 }
            }
            return {
                type: MATRIX,
                value: results,
                get rowspan() { return results.length }, 
                get colspan() { return results[0].length },
           };
        },
        TRANSPOSE: ([array], _context) => {
            const { col: ccol, row: crow } = _context.currentcell;
            if(array.type === LIST) {
                return {
                    values: array.value.map((value, idx) => ({
                        row: crow+(array.colspan>1 ? idx : 0)+1,
                        col: ccol+(array.rowspan>1 ? idx : 0)+1,
                        value
                    })),
                    type: ARRAY
                };
            }
            if(array.type === MATRIX) {
                const results = array.value[0].map((__, idx) => array.value.map((row, jdx) => ({
                    row: crow+idx+1,
                    col: ccol+jdx+1,
                    value: row[idx]
                })));
                return {
                  type: ARRAY,
                  value: results,
                  get rowspan() { return results.length }, 
                  get colspan() { return results[0].length }, // always square selection
                };
            }
            throw new Error("Expected LIST or MATRIX as first argument to TRANSPOSE, found "+String(array.value)+" ("+String(array.type)+")");
        },
        HYPERLINK: ([{value:link_location}, {value:friendly_name}], _context) => ({
            type: HYPERLINK,
            meta: { href: link_location },
            value: friendly_name || link_location
        }),
        FV: ([{value:rate}, {value:nper}, {value:pmt}={value:0}, {value:pv}={value:0}, {value:type}={value:0}], _context) => {
            // pv *   (1+rate)^nper   +   pmt*(1+rate*type) * ( (1+rate)^nper -1 ) / rate) + FV = 0
            // If rate =0 then (Pmt * Nper)+PV+FV=0
            if(rate === 0) {
                return { type: NUMBER, value: 0-pv-pmt*nper };
            }
            return { type: NUMBER, value: 0-(
                pv *   Math.pow((1+rate), nper) +
                pmt * (1+rate*type)  * ( Math.pow((1+rate), nper) - 1 ) / rate
            ) };
        },
        DATE: ([{value:YEAR}, {value:MONTH}, {value:DAY}], _context) => ({
            type: DATE,
            meta: { YEAR, MONTH, DAY },
            value: new Date(YEAR, MONTH-1, DAY)
        }),
        DATEVALUE: ([{value:TEXT}], _context) => ({
            type: DATE,
            value: new Date(TEXT)
        }),
        TODAY: ([], _context) => ({
            type: DATE,
            value: new Date()
        }),
        NOW: (__, _context) => ({
            type: DATETIME,
            value: new Date()
        }),
        DAY: ([{value: date}], _context) => ({
            type: NUMBER,
            value: date.getDate()
        }),
        MONTH: ([{value: date}], _context) => ({
            type: NUMBER,
            value: date.getMonth()
        }), 
        YEAR: ([{value: date}], _context) => ({
            type: NUMBER,
            value: date.getFullYear()
        }), 
        EOMONTH: ([{value: date}, {value: monthsdiff}={value: 0}], _context) => ({
            type: NUMBER,
            value: (new Date(date.getFullYear(), date.getMonth() + 1 + monthsdiff, 0)).getDate()
        }), 
        WEEKDAY: ([{value: date,type}, {value: return_type}={value:1}], _context) => {
          const modes = {
              "1": v => v+1,
              "2": v => (v+7-1)%7+1,
              "3": v=>(v+7-1)%7,
              "11": v => (v+7-1)%7+1,
              "12": v => (v+6-1)%7+1,
              "13": v => (v+5-1)%7+1,
              "14": v => (v+4-1)%7+1,
              "15": v => (v+3-1)%7+1,
              "16": v => (v+2-1)%7+1,
              "17": v => v+1,
          };
          if(type === NUMBER) {
              // weird things, where excel parses the number in mode 1 and returns whatever mode is set
             return {
                type: NUMBER,
                meta: { return_type: return_type+"" },
                value: modes[return_type+""](date-1)
            }
          }
          return {
              type: NUMBER,
              meta: { return_type: return_type+"" },
              value: modes[return_type+""](date.getDay())
          }
        }, 
        WEEKNUM: ([{value: date},{value:return_type}={value:1}], _context) => {
            if(return_type===21) {
              const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
              const dayNum = d.getUTCDay() || 7;
              d.setUTCDate(d.getUTCDate() + 4 - dayNum);
              const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
              return {
                  type: NUMBER,
                  value: Math.ceil((((d - yearStart) / 86400000) + 1)/7)
              }
            }
            const modemap = {
              "1": 0,
              "2": 1,
              "11": 1,
              "12": 2,
              "13": 3,
              "14": 4,
              "15": 5,
              "16": 6,
              "17": 0
            };
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            const dayNum = d.getUTCDay() || 7;
            d.setUTCDate(d.getUTCDate() + modemap[return_type] - dayNum);
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            const dayNum2 = d.getUTCDay() || 7;
            yearStart.setUTCDate(yearStart.getUTCDate() + modemap[return_type] - dayNum2);
              return {
              type: NUMBER,
              value: Math.ceil((((d - yearStart) / 86400000) + 1)/7)
            };
        },
        DATEDIF: ([{value: start_date}, {value: end_date}, {value: unit}], _context) => end_date<start_date ? {
            type: ERROR,
            value: NUMVALUE
        } : {
            type: NUMBER,
            value: {
                "Y": (s,e) => Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24 * 365.2425)),
                "M": (s,e) => Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24 * 30.436875)),
                "D": (s,e) => Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)),
                "MD": (s,e) => e.getDate() - s.getDate(),
                "YM": (s,e) => e.getMonth() - s.getMonth(),
                "YD": (s,e) => {
                    e.setUTCDate(2019); // ignore Year
                    s.setUTCDate(2019); // set to year without leap
                    return Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
                }
            }[unit](new Date(start_date.valueOf()), new Date(end_date.valueOf()))
        },
        EDATE: ([{value: d}, {value: months}], _context) =>
            { const t = new Date(d.valueOf()); t.setMonth(d.getMonth() + months); return { type:DATE, value: t }; },
        YEARFRAC: ([{value: s}, {value: e}, {value: base}={value:0}], _context) => {
            // ISO/IEC 29500-1:2008
          const m = {
            "0": (s,e) => {
              // see https://en.wikipedia.org/wiki/Day_count_convention#30/360_US
              const sFeb = (new Date(s.getFullYear(), s.getMonth() + 1, 0)).valueOf() === s.valueOf();
              const eFeb = (new Date(e.getFullYear(), e.getMonth() + 1, 0)).valueOf() === e.valueOf();
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              if(sFeb && eFeb) { D2 = 30; }
              if(sFeb) { D1 = 30; }
              if(D2 === 31 && D1 >= 30) { D2 = 30; }
              if(D1 === 31) { D1 = 30; }
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "1": (s,e) => {
              let startYear = Math.min(s.getFullYear(), e.getFullYear());
              const endYear = Math.max(s.getFullYear(), e.getFullYear());
              let div = 365;
              while(startYear <= endYear) {
                  if(startYear % 400 === 0 || (startYear % 100 !== 0 && startYear % 4 === 0)) {
                    div = 366;
                    break;
                }
                startYear++;
              }
              return {
                  type: NUMBER, value: (Math.abs(e - s) / (1000 * 60 * 60 * 24)) / div
              }
            },
            "Actual/actual": (s,e) => m["1"](s,e),
            "2": (s,e) => ({ type: NUMBER, value: (Math.abs(e - s) / (1000 * 60 * 60 * 24)) / 360 }),
            "Actual/360": (s,e) => m["2"](s,e),
            "3": (s,e) => ({ type: NUMBER, value: (Math.abs(e - s) / (1000 * 60 * 60 * 24)) / 365 }),
            "Actual/365": (s,e) => m["3"](s,e),
            "4": (s,e) => {
              // see https://en.wikipedia.org/wiki/Day_count_convention#30E/360
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              if(D2 === 31) { D2 = 30; }
              if(D1 === 31) { D1 = 30; }
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "European 30/360": (s,e) => m["4"](s,e),
            "30/360": (s,e) => {
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "30/360 Bond Basis": (s,e) => {
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              D1 = Math.min(D1, 30);
              if(D1 >= 30) { D2 = Math.min(D2, 30); }
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "30A/360": (s,e) => m["30/360 Bond Basis"](s,e),
            "30/360 US": (s,e) => m["0"](s,e),
            "30U/360": (s,e) => m["0"](s,e),
            "30/360": (s,e) => {
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "30E/360": (s,e) => m["4"](s,e),
            "30/360 ICMA": (s,e) => m["4"](s,e),
            "30S/360": (s,e) => m["4"](s,e),
            "Eurobond basis (ISDA 2006)": (s,e) => m["4"](s,e),
            "Special German": (s,e) => m["4"](s,e),
            "30E/360 ISDA": (s,e) => {
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              if(D1 === (new Date(e.getFullYear(), e.getMonth() + 1, 0)).getDate()) { D1 = 30; }
              if(D2 === (new Date(s.getFullYear(), s.getMonth() + 1, 0)).getDate()) { D2 = 30; }
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/360 };
            },
            "Eurobond basis (ISDA 2000)": (s,e) => m["30E/360 ISDA"](s,e),
            "Actual/Actual ISDA": (s,e) => {
              let currentYear = Math.min(s.getFullYear(), e.getFullYear());
              const endYear = Math.max(s.getFullYear(), e.getFullYear());
              let leapDays = 0;
              let regularDays = 0;
              while(currentYear <= endYear) {
                  const s0 = Math.max(new Date(currentYear, 1, 1), s);
                 const e0 = Math.min(new Date(currentYear+1, 1, 0), e);
                 const days = Math.ceil(Math.abs(e0 - s0) / (1000 * 60 * 60 * 24));
                  if(currentYear % 400 === 0 || (currentYear % 100 !== 0 && currentYear % 4 === 0)) {
                    // Leap
                    leapDays += days;
                } else {
                    regularDays += days;
                }
                currentYear++;
              }
              return {
                  type: NUMBER, value: leapDays/366 + regularDays/365
              }
            },
            "Actual/Actual": (s,e) => m["Actual/Actual ISDA"](s,e),
            "Act/Act": (s,e) => m["Actual/Actual ISDA"](s,e),
            "Actual/365": (s,e) => m["Actual/Actual ISDA"](s,e),
            "Act/365": (s,e) => m["Actual/Actual ISDA"](s,e),
            "Act/365 Fixed": (s,e) => m["Actual/365"](s,e),
            "A/365 Fixed": (s,e) => m["Actual/365"](s,e),
            "A/365F": (s,e) => m["Actual/365"](s,e),
            "English": (s,e) => m["Actual/365"](s,e),
            "Act/360": (s,e) => m["Actual/360"](s,e),
            "A/360": (s,e) => m["Actual/360"](s,e),
            "French": (s,e) => m["Actual/360"](s,e),
            "Actual/364": (s,e) => ({ type: NUMBER, value: (Math.abs(e - s) / (1000 * 60 * 60 * 24)) / 364 }),
            "Actual/Actual AFB": (s,e) => {
              const start = new Date(s.valueOf());
              const sy = start.getFullYear();
              const end = new Date(e.valueOf());
              let fullYears = 0;
              while(end.getFullYear() > start.getFullYear()) {
                  fullYears++;
                  end.setFullYear(end.getFullYear() - 1);
              }
              end.setFullYear(end.getFullYear() + 1);
              const div = sy % 400 === 0 || (sy % 100 !== 0 && sy % 4 === 0) ? 366 : 365;
              return {
                  type: NUMBER, value: fullYears - 1 + (Math.abs(end - start) / (1000 * 60 * 60 * 24)) / div,
                  meta: { years: fullYears - 1, days: (Math.abs(end - start) / (1000 * 60 * 60 * 24)) }
              }
            },
            "1/1": (s,e) => {
              let Y1 = s.getFullYear(), Y2 = e.getFullYear(), M1 = s.getMonth(), M2 = e.getMonth(), D1 = s.getDate(), D2 = e.getDate();
              return { type: NUMBER, value: (360*(Y2-Y1)+30*(M2-M1)+(D2-D1))/365.25 };
            },
          };
          return m[base+""](s,e);
        },
        WORKDAY: ([{value:start},{value:days},holidays]) => {
            let count = 0;
            const d = new Date(start.valueOf());
            const hollidaylist = holidays && holidays.type === LIST ? holidays.value.map(i => i.value) : [];
            while(count < days) {
                d.setDate(d.getDate()+1);
                const day = d.getDay();
                if(day === 0 || day === 6) {
                    continue;
                }
                if(hollidaylist.some(dt => dt.valueOf() === d.valueOf())) {
                    continue;
                }
                count++;
            }
            return ({
              type: DATE,
              value: d
          })
        },
        "WORKDAY.INTL": ([{value:start},{value:days},weekend={value:1},holidays={value:[]}]) => {
            let count = 0;
            const d = new Date(start.valueOf());
            let weekenddays = [6,0];
            const weekendmap = {
              "1": [6,0],
              "2": [0,1],
              "3": [1,2],
              "4": [2,3],
              "5": [3,4],
              "6": [4,5],
              "7": [5,6],
              "11": [0],
              "12": [1],
              "13": [2],
              "14": [3],
              "15": [4],
              "16": [5],
              "17": [6],
            };
            if(weekend.type === LIST) {
                weekenddays = weekend.value.map(({value}) => value).filter(i => i < 7);
            }
            if((weekend.value+"").length === "7") {
                weekenddays = weekend.value.split("").map((i, idx) => i === "1" ? (idx+1)%7 : -1).filter(i => i!== -1);
            }
            if(weekendmap[weekend.value+""]) {
                weekenddays = weekendmap[weekend.value+""];
            }
            if(weekendmap.length >= 7) {
                return { type: ERROR, value: VVALUE, meta: { message: "Invalid value for 'weekend' "+String(weekend)+": Can't exclude all weekdays!" } }
            }
            const hollidaylist = holidays && holidays.type === LIST ? holidays.value.map(i => i.value) : [];
            while(count < days) {
                d.setDate(d.getDate()+1);
                const day = d.getDay();
                if(weekenddays.indexOf(day) > -1) {
                    continue;
                }
                if(hollidaylist.some(dt => dt.valueOf() === d.valueOf())) {
                    continue;
                }
                count++;
            }
            return ({
              type: DATE,
              value: d
              });
        },
        NETWORKDAYS: ([{value:start},{value:end},holidays]) => {
            let count = 0;
            const d = new Date(start.valueOf());
            const hollidaylist = holidays && holidays.type === LIST ? holidays.value.map(i => i.value) : [];
            while(d < end) {
                d.setDate(d.getDate()+1);
                const day = d.getDay();
                if(day === 0 || day === 6) {
                    continue;
                }
                if(hollidaylist.some(dt => dt.valueOf() === d.valueOf())) {
                    continue;
                }
                count++;
            }
            return ({
              type: NUMBER,
              value: count
          })
        },
        "NETWORKDAYS.INTL": ([{value:start},{value:end},weekend={value:1},holidays={value:[]}]) => {
            let count = 0;
            const d = new Date(start.valueOf());
            let weekenddays = [6,0];
            const weekendmap = {
              "1": [6,0],
              "2": [0,1],
              "3": [1,2],
              "4": [2,3],
              "5": [3,4],
              "6": [4,5],
              "7": [5,6],
              "11": [0],
              "12": [1],
              "13": [2],
              "14": [3],
              "15": [4],
              "16": [5],
              "17": [6],
            };
            if(weekend.type === LIST) {
                weekenddays = weekend.value.map(({value}) => value).filter(i => i < 7);
            }
            if((weekend.value+"").length === "7") {
                weekenddays = weekend.value.split("").map((i, idx) => i === "1" ? (idx+1)%7 : -1).filter(i => i!== -1);
            }
            if(weekendmap[weekend.value+""]) {
                weekenddays = weekendmap[weekend.value+""];
            }
            if(weekendmap.length === "1111111") {
                return { type: NUMBER, value: 0, meta: { message: "Shortcut for trivial value '1111111'" } }
            }
            const hollidaylist = holidays && holidays.type === LIST ? holidays.value.map(i => i.value) : [];
            while(d < end) {
                d.setDate(d.getDate()+1);
                const day = d.getDay();
                if(weekenddays.indexOf(day) > -1) {
                    continue;
                }
                if(hollidaylist.some(dt => dt.valueOf() === d.valueOf())) {
                    continue;
                }
                count++;
            }
            return ({
              type: NUMBER,
              value: count
              });
        },
        TIME: ([{value:hours},{value:minutes},{value:seconds}]) => ({ type: TIME, value: new Date(1970, 1, 1, hours, minutes, seconds, 0) }),
        TIMEVALUE: ([{value:time_text}]) => ({ type: TIME, value: new Date(time_text) }),
        NOW: () => ({ type: TIME, value: new Date() }),
        HOUR: ([{value:date}]) => ({ type: NUMBER, value: date.getHours() }),
        MINUTE: ([{value:date}]) => ({ type: NUMBER, value: date.getMinutes() }),
        SECOND: ([{value:date}]) => ({ type: NUMBER, value: date.getSeconds() }),
        
        ABS: ([{value}]) => ({ type: NUMBER, value: Math.abs(value) }),
        ACCRINT: ([{value:issue},{value:first_interest},{value:settlement},{value:rate},{value:par}={value:1000},{value:frequency},{value:basis}={value:0},{value:calc_method}={value: true}], _context) => {
            issue = Math.floor(issue), first_interest = Math.floor(first_interest), settlement = Math.floor(settlement),
            frequency = Math.floor(frequency), basis = Math.floor(basis);
            if(rate <= 0) {
                return {type: ERROR, value: NUMVALUE, meta: { message: "'rate' must be >=0, but is "+ String(rate)}};
            }
            if(par <= 0) {
                return {type: ERROR, value: NUMVALUE, meta: { message: "'par' must be >=0, but is "+ String(par)}};
            }
            if(frequency !== 1 && frequency !== 2 && frequency !== 4) {
                return {type: ERROR, value: NUMVALUE, meta: { message: "'frequency' must be 1,2 or 4, but is "+ String(par)}};
            }
            if(basis < 0 || basis > 4) {
                return {type: ERROR, value: NUMVALUE, meta: { message: "'basis' must be >0 and <4, but is "+ String(basis)}};
            }
            if(issue > settlement) {
                return {type: ERROR, value: NUMVALUE, meta: { message: "'issue' must be >= 'settlement', but is "+ String(issue)+"<"+String(settlement)}};
            }
            // todo: cross-compile (https://fable.io/) and use https://github.com/fsprojects/ExcelFinancialFunctions/blob/master/src/ExcelFinancialFunctions/bonds.fs
            return { type: ERROR, value: "NOT IMPLEMENTED" };
        },
        ACCRINTM: ([{value}]) => ({ type: ERROR, value: "NOT IMPLEMENTED" }),
        ACOS: ([{value}]) => ({ type: NUMBER, value: Math.acos(value) }),
        ACOSH: ([{value}]) => ({ type: NUMBER, value: Math.acosh(value) }),
        ACOT: ([{value}], _context) => _context.functions.ATAN(1 / value),
        ACOTH: ([{value}]) => _context.functions.ATANH(1 / value),
        AGGREGATE: ([{value:function_num},{value:options=0}={value:0}, ...args], _context) => {
            const m = {
              "1": "AVERAGE",
              "2": "COUNT",
              "3": "COUNTA",
              "4": "MAX",
              "5": "MIN",
              "6": "PRODUCT",
              "7": "STDEV.S",
              "8": "STDEV.P",
              "9": "SUM",
              "10": "VAR.S",
              "11": "VAR.P",
              "12": "MEDIAN",
              "13": "MODE.SNGL",
              "14": "LARGE",
              "15": "SMALL",
              "16": "PERCENTILE.INC",
              "17": "QUARTILE.INC",
              "18": "PERCENTILE.EXC",
              "19": "QUARTILE.EXC"
            };
            const ufunction = _context.functions[m[function_num+""]];
            const uarguments = args.filter(({type,value, meta={}}) => {
                switch(options+"") {
                    case "1": // "Ignore hidden rows, nested SUBTOTAL and AGGREGATE functions"
                        return !meta.hidden && meta.type!==AGGREGATE && meta.type!==SUBTOTAL;
                    case "2": // "Ignore error values, nested SUBTOTAL and AGGREGATE functions"
                        return type!==ERROR && meta.type!==AGGREGATE && meta.type!==SUBTOTAL;
                    case "3": // "Ignore hidden rows, error values, nested SUBTOTAL and AGGREGATE functions"
                        return !meta.hidden && type!==ERROR && meta.type!==AGGREGATE && meta.type!==SUBTOTAL;
                    case "4": // "Ignore nothing"
                        return true;
                    case "5": // "Ignore hidden rows"
                        return !meta.hidden;
                    case "6": // "Ignore error values"
                        return type!==ERROR;
                    case "7": // "Ignore hidden rows and error values"
                        return !meta.hidden && type!==ERROR;
                    case "0": // "Ignore nested SUBTOTAL and AGGREGATE functions"
                        return meta.type!==AGGREGATE && meta.type!==SUBTOTAL
                    default:
                        throw new Error("'AGGREGATE's 'options' must be between 0 and 7, but found "+String(options));
                }
            });
            try {
                const result = ufunction(uarguments, _context);
                return { ...result, meta: { type: AGGREGATE } }
            } catch(e) {
                const initialError = uarguments.find((e) => e && (e.type === ERROR));
                return {
                    type: ERROR,
                    value: (initialError && initialError.value) || e.name+' in '+m[function_num+""]+': "'+e.message+'"',
                    meta: {  error_value: initialError, internal_error: e }
               };
            }
        },
        ADDRESS: ([{value:row_num},{value:column_num},{value:abs_num}={value:1},{value:a1}={value:true},{value:sheet_text}={}], _context) =>
            _context.parser(
                (sheet_text?"'"+sheet_text+"'!":"")+
                (a1?
                    ((abs_num===1||abs_num===3)?"$":"")+String.fromCharCode(column_num+64)+((abs_num===1||abs_num===2)?"$":"")+row_num:
                    "R"+((abs_num===1||abs_num===2)?"["+row_num+"]":row_num)+"C"+((abs_num===1||abs_num===3)?"["+column_num+"]":column_num)
                )
           ),
        AMORDEGRC: ([{value}]) => ({ type: NULL, value }),
        AMORLINC: ([{value}]) => ({ type: NULL, value }),
        ARABIC: ([{value}]) => {
            // https://stackoverflow.com/questions/48946083/convert-roman-number-to-arabic-using-javascript
            function romanToArabic(roman){
              if(roman == null)
                  return -1;
              var totalValue = 0, 
                  value = 0, // Initialise!
                  prev = 0;

              for(var i=0;i<roman.length;i++){
                  var current = {
                    "I":1,
                    "V":5,
                    "X":10,
                    "L":50,
                    "C":100,
                    "D":500,
                    "M":1000,
                    ...romannumeral_extended,
                    ...romannumeral_romanSymbols
                  }[roman.charAt(i)];
                  if (current > prev) {
                      // Undo the addition that was done, turn it into subtraction
                      totalValue -= 2 * value;
                  }
                  if (current !== prev) { // Different symbol?
                      value = 0; // reset the sum for the new symbol
                  }
                  value += current; // keep adding same symbols
                  totalValue += current;
                  prev = current;
              }
              return totalValue;
          }
          return { type: NUMBER, value: romanToArabic(value) }
        },
        AREAS: ([{value,type}]) => ({ type: NUMBER, value: type===ARGUMENTS?value.length:(
            [LIST, ARRAY].includes(type)?1:0
        ) }),
        ASC: ([{value}]) => ({ type: STRING, value: value.split("").map(i =>
            i.charCodeAt(0) >= 65248 ? String.fromCharCode(i.charCodeAt(0) - 65248) : i
        ).join("") }),
        ASIN: ([{value}]) => ({ type: NUMBER, value: Math.asin(value) }),
        ASINH: ([{value}]) => ({ type: NUMBER, value: Math.asinh(value) }),
        ATAN: ([{value}]) => ({ type: NUMBER, value: Math.atan(value) }),
        ATAN2: ([{value:a},{value:b}]) => ({ type: NUMBER, value: Math.atan2(a,b) }),
        ATANH: ([{value}]) => ({ type: NUMBER, value: Math.atanh(value) }),
        AVEDEV: (_args, _context) => {
            let args = _args;
            const [{type,value}] = args;
            if(type === LIST) {
                args = value;
            }
            const find = args.some(({type}) => type !== NUMBER);
            if(find) {
                return { type: ERROR, value: "AVEDEV exspects either numbers or a list of numbers as arguments, but found "+String(find.value)+" ("+String(find.type)+")" };
            }
            const {value:avg} = _context.functions.AVERAGE(args);
            const derivations = args.map(({value}) => Math.abs(avg - value));
            return { type: NUMBER, value: derivations.reduce((p,i) => p+i, 0)/derivations.length, meta: { avg, length: derivations.length, deviations: derivations } };
        },
        AVERAGEA: (allargs) => {
            const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                    return sum;
                case NUMBER:
                  return sum + value;
                case LIST:
                  return value.reduce((p, s) => {
                      if(s.type !== NUMBER) {
                          throw new Error("Disallowed value "+String(s.value)+" of type "+String(s.type)+" found in LIST supplied to SUM");
                      }
                      return p+s.value;
                  }, sum);
                case BOOLEAN:
                    return sum + (+value);
                case STRING:
                    return sum;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in AVERAGEA");
              }
          }, 0);
          return { type: NUMBER, value: result/allargs.length };
        },
        AVERAGEIF: (args, _context) => ({
            type: NUMBER, value: _context.function.SUMIF(args).value/_context.functions.COUNTIF(args).value
        }),
        AVERAGEIFS: ([arg,...args],_context) => ({
            type: NUMBER, value: _context.function.SUMIFS([arg,...args]).value/_context.functions.COUNTIFS(args).value
        }),
        BAHTTEXT: ([{value}]) => ({ type: STRING, value: new Intl.NumberFormat('th-TH-u-nu-thai', { numberingSystem: "thai", style: 'currency', currency: 'THB' }).format(value) }), // https://github.com/antronic/thai-baht-text-js ?
        BASE: ([{value:decimal},{value:base},{value:minlength}={value:0}]) => ({ type: STRING, value: decimal.toString(base).padStart(minlength, "0").toUpperCase() }),
        _BESSEL: ([{value:X,type:XT},{value:N,typeNT},{value:bessel}],_context,f) => {
            if(NT !== NUMBER || XT != NUMBER) {
                return { TYPE: ERROR, VALUE: VVALUE }
            }
            if(N < 0) {
                return { TYPE: ERROR, VALUE: NAVALUE }
            }
            const func = BESSEL[f] || BESSEL[bessel] || BESSEL["bessel"+bessel];
            if(!func) {
                throw new Error("ILLEGAL INVOCATION, expected bessel to be i, j, k or y but found "+String(f || bessel));
            }
            return { TYPE: NUMBER, value: func(X, Math.floor(N)) };
        },
        BESSEL: (args,_context) => _context.functions._BESSEL(args,_context),
        BESSELI: (args,_context) => _context.functions._BESSEL(args,_context,"besseli"),
        BESSELJ: (args,_context) => _context.functions._BESSEL(args,_context,"besselj"),
        BESSELK: (args,_context) => _context.functions._BESSEL(args,_context,"besselk"),
        BESSELY: (args,_context) => _context.functions._BESSEL(args,_context,"bessely"),
        BETADIST: ([{value:x},{valye:alpha},{value:beta},{value:a}={value:0},{value:b}={value:1}]) => {
            // const Beta = require( '@stdlib/stats/base/dists/beta/ctor' );
            // const beta = new Beta(a,b);
            // const value = beta.cdf(x,alpha,beta);
            return { type: NUMBER, value: "NOT IMPLEMENTED" };
        },
        "BETA.DIST": ([{value:x},{valye:alpha},{value:beta},{value:cumulative},{value:a}={value:0},{value:b}={value:1}]) => {
            // const Beta = require( '@stdlib/stats/base/dists/beta/ctor' );
            // const beta = new Beta(a,b);
            // const value = cumulative ? beta.cdf(x,alpha,beta) : beta.pdf(x,alpha,beta);
            // or maybe from var { jStat } = require('jstat') ?
            return { type: NUMBER, value: "NOT IMPLEMENTED"};
        },
        BETAINV: ([{value:x},{valye:alpha},{value:beta},{value:a}={value:0},{value:b}={value:1}]) => {
            // const { jStat } = require('jstat')
            // const beta = jStat.beta(a,b);
            // const value = beta.inv(x,alpha,beta);
            return { type: NUMBER, value: "NOT IMPLEMENTED" };
        },
        "BETA.INV": (args, _context) => _context.functions.BETAINV(args, _context),
        BIN2DEC: ([{value}]) => ({ type: NUMBER, value: parseInt(value, 2).toString(10) }),
        BIN2HEX: ([{value},{value:minlength}]) => ({ type: STRING, value: parseInt(value, 2).toString(16).padStart(minlength, "0") }),
        BIN2OCT: ([{value},{value:minlength}]) => ({ type: STRING, value: parseInt(value, 2).toString(8).padStart(minlength, "0") }),
        BINOMDIST: ([{value:x},{value:n},{value:p},{value:cumulative}]) => {
            // const cdf = require( '@stdlib/stats/base/dists/binomial/cdf' );
            // const pmf = require( '@stdlib/stats/base/dists/binomial/pmf' );
            // const value = cumulative ? cdf( x, n, p ) : pmf( x, n, p );
            // or maybe from var { jStat } = require('jstat') ?
            return { type: NUMBER, value: "NOT IMPLEMENTED" };
        },
        "BINOM.DIST": (args,_context) => _context.functions.BINOMDIST(args,_context),
        "BINOM.DIST.RANGE": ([{value:n},{value:p},{value:x1},{value:x2}], _context) => {
            let chance = 0;
            for(let i = x1; i <= x2; i++) {
                chance += _context.BINOMDIST([{value:i},{value:n},{value:p},{value:false}], _context).value;
            }
            return { type: NUMBER, value: chance };
        },
        "BINOM.INV": ([{value:n},{value:p},{value:a}], _context) => {
            for(let i = 0; i < 10e6; i++) {
                if(_context.BINOMDIST([{value:i},{value:n},{value:p},{value:false}], _context).value >= a) {
                    return { type: NUMBER, value: i };
                }
            }
            return { type: ERROR, value: "No value found" };
        },
        BITAND: ([{value:a},{value:b}]) => ({ type: NUMBER, value: a & b }),
        BITLSHIFT: ([{value:a},{value:b}]) => ({ type: NUMBER, value: a << b  }),
        BITOR: ([{value:a},{value:b}]) => ({ type: NUMBER, value: a | b  }),
        BITRSHIFT: ([{value:a},{value:b}]) => ({ type: NUMBER, value: a >> b  }),
        BITXOR: ([{value:a},{value:b}]) => ({ type: NUMBER, value: a ^ b  }),
        CALL: ([{value:f,type}, ...args], _context) => {
            if(!_context.allowUnsafe) {
                throw new Error("[SECURITY VIOLATION] Attempted to call 'call', but 'allowUnsafe'-option is not true");
            }
            if(type === FUNCTION) {
                const v = f(args.map(({value}) => value));
                return ({ type: (v && v.type) || ANY, value: v });
            }
            const [ff,xtype] = [
                [_context.functions[f], "_context.functions"],
                [_context[f], "_context"],
                [(self || global || window)[f], "global"]
            ].find(([i]) => !!i) || [];
            if(ff) {
                if(typeof ff !== "function") {
                    return ({ type: NULL || ANY, value: ff, meta: { type: xtype } });
                }
                const v = ff(args);
                const cellTrace = v[CELL_TRACE] || [];
                return ({ type: (v && v.type) || ANY, value: v && v.value || v, [CELL_TRACE]: cellTrace });
            }
            try {
                const argnames = args.map((__, idx) => String.fromCharCode(97+idx));
                const argvalues = args.map((i) => i.value||i);
                const v = new Function(...argnames, f); // NOT SAFE!!
                return ({ type: (v && v.type) || ANY, value: v(...argvalues), meta: { "exec": v } });
            } catch(e) {
                return ({ type: ERROR, value: "Failed to call function "+f, meta: { f, args, error: e } });
            }
        },
        "CEILING.MATH": ([{value:n},{value:dec},{value:m}], _context) => {
            if(m === 1 && n < 0) {
                return { type: NUMBER, value: dec*Math.floor(n/dec) };
            }
            return { type: NUMBER, value: dec*Math.ceil(n/dec) };
        },
        "CEILING.PRECISE": ([{value:n},{value:dec}]) => ({ type: NUMBER, value: !n||!dec ? 0 : dec*Math.floor(n/dec) }),
        CELL: ([{value:info_type},o], context) => {
            const {value:reference,type,meta} = o || {meta:{type:CELL,row:context.currentcell.row,col:context.currentcell.col}};
            if(reference && meta.type !== CELL) {
                return { type: ERROR, value: "CELL function's second argument must be a cell if provided. Found "+meta.type+" instead" }
            }
            const { row, col } = meta;
            switch(info_type.toLowerCase()) {
                case "address":
                    return { type: STRING, value: "$"+String.fromCharCode(64+row+1)+"$"+(col+1), meta: { CELL_FUNCTION: "address" } };
                case "col":
                  return { type: NUMBER, value: col+1, meta: { CELL_FUNCTION: "col" } };
                case "color":
                    // The value 1 if the cell is formatted in color for negative values; otherwise returns 0 (zero).
                    return { type: NUMBER, value: 0, meta: { error: "CELL(color) not supported", CELL_FUNCTION: "color" } };
                case  "contents":
                    return { type: type, value: reference, meta: { ...meta, CELL_FUNCTION: "contents" } }
                case "filename":
                      return { type: STRING, value: ""+window.location, meta: { CELL_FUNCTION: "filename" } };
                case "format":
                    // returns cell formatting
                    return { type: STRING, value: "G", meta: { error: "CELL(format) not supported", CELL_FUNCTION: "format" } };
                case "parentheses":
                       // The value 1 if the cell is formatted with parentheses for positive or all values; otherwise returns 0.
                    return { type: NUMBER, value: 0, meta: { error: "CELL(parentheses) not supported", CELL_FUNCTION: "parentheses" } };
                case "prefix":
                    // cell alignment
                    return { type: STRING, value: "", meta: { error: "CELL(prefix) not supported", CELL_FUNCTION: "prefix" } };
                case "protect":
                    // cell alignment
                    return { type: NUMBER, value: 0, meta: { error: "CELL(protect) not supported", CELL_FUNCTION: "protect" } };
                case "row":
                    return { type: NUMBER, value: row+1, meta: { CELL_FUNCTION: "row" } };
                case "type":
                    if(type === null) {
                        return { type: STRING, value: "b", meta: { CELL_FUNCTION: "type" } };
                    }
                    if(type === STRING) {
                        return { type: STRING, value: "l", meta: { CELL_FUNCTION: "type" } };
                    }
                    return { type: STRING, value: "v", meta: { CELL_FUNCTION: "type" } };
                case "width":
                    // cell width
                    return { type: NUMBER, value: 0, meta: { error: "CELL(width) not supported", CELL_FUNCTION: "width" } };
                default:
                    return { type: ERROR, value: "Unknown info_type "+info_type+" supplied to CELL" }
            }
        },
        CHAR: ([{value}]) => ({ type: STRING, value: String.fromCharCode(value) }),
        CHIDIST: ([{value}]) => ({ type: NULL, value }), // todo from lib
        CHIINV: ([{value}]) => ({ type: NULL, value }), // todo from lib
        CHITEST: ([{value}]) => ({ type: NULL, value }), // todo from lib
        "CHISQ.DIST": ([{value}]) => ({ type: NULL, value }), // todo from lib
        "CHISQ.DIST.RT": ([{value}]) => ({ type: NULL, value }), // todo from lib
        "CHISQ.INV": ([{value}]) => ({ type: NULL, value }), // todo from lib
        "CHISQ.INV.RT": ([{value}]) => ({ type: NULL, value }), // todo from lib
        "CHISQ.TEST": ([{value}]) => ({ type: NULL, value }), // todo from lib
        CHOOSE: ([{value}, ...args]) => ({ ...args[value-1] }), // NOTE: Must copy, otherwise referes to itself via _trace arguments
        CLEAN: ([{value}]) => ({ type: STRING, value: value.replace(/[\x00-\x1F]/g,"") }), // values 0 through 31
        CODE: ([{value}]) => ({ type: NUMBER, value: value.charCodeAt(0) }),
        COLUMN: ([{value,type,meta={}}={}], ctx) => {
            if(!value) {
                return { type: NUMBER, value: ctx.currentcell.col+1 };
            }
            if(meta.type === CELL) {
                return { type: NUMBER, value: meta.col };
            }
            throw new Error("COLUMN's first argumnet must be a cell-reference (meta.type=CELL)! Found "+String(value)+" ("+String(type)+"/"+String(meta.type)+")"); // excel actually throws
        },
        COLUMNS: ([{value,type}]) => {
            if(type === LIST) {
                const {meta: {type:st,col:sc}={}} = value[0];
                const {meta: {type:lt,col:lc}={}} = value[value.length-1];
                if(st === CELL && lt === CELL) {
                    return { type: NUMBER, value: lc-sc+1 }
                }
                // case of inline list via {...}-Syntax
                return { type: NUMBER, value: value.length };
            }
            if(type === MATRIX) {
                return { type: NUMBER, value: value[0].length };
            }
            throw new Error("COLUMNS must be called with LIST or MATRIX. Found "+String(value)+" ("+String(type)+")");
        },
        _FACTORIAL_CACHE: [1,1],
        _FACTORIAL_i: 2,
        _FACTORIAL: ([{value:n}], _context) => {
          if (typeof _context.functions._FACTORIAL_CACHE[n] != 'undefined') {
               return _context.functions._FACTORIAL_CACHE[n];
          }
          let result = _context.functions._FACTORIAL_CACHE[Number(_context.functions._FACTORIAL_i-1)];
          for (; _context.functions._FACTORIAL_i <= n; _context.functions._FACTORIAL_i++) {
              _context.functions._FACTORIAL_CACHE[_context.functions._FACTORIAL_i] = result = result * _context.functions._FACTORIAL_i;
          }
          return result;
        },
        COMBIN: ([n,k],_context) => ({ type: NUMBER, value: 
            _context.functions._FACTORIAL([n],_context)
                / _context.functions._FACTORIAL([k],_context)
                / _context.functions._FACTORIAL([{type: NUMBER, value: n.value-k.value}],_context)
        }),
        COMBINA: ([{value:n},{value:m}],_context) => _context.functions.COMBIN([{value:n+m-1,type:NUMBER},{value:n-1,type:NUMBER}],_context),
        COMPLEX: ([{value:r,type:t1},{value:i,type:t2},{value:suffix}={value:"i"}]) => {
            if(suffix !== "i" && suffix !== "j") {
                return { type: ERROR, value: VVALUE, meta: { error: "Suffix supplied to COMPLEX must be either 'i' or 'j', but found "+String(suffix) } };
            }
            if(t1 !== NUMBER) {
                return { type: ERROR, value: VVALUE, meta: { error: "n supplied to COMPLEX must be a number but found "+String(n)+" ("+String(t1)+")" } };
            }
            if(t2 !== NUMBER) {
                return { type: ERROR, value: VVALUE, meta: { error: "i supplied to COMPLEX must be a number but found "+String(i)+" ("+String(t2)+")" } };
            }
            if(i === 0) {
                return { type: NUMBER, value: r, meta: { type: COMPLEX_NUMBER, r, i, suffix } };
            }
            if(r === 0) {
                return { type: STRING, value: i+suffix, meta: { type: COMPLEX_NUMBER, r, i, suffix } };
            }
            return { type: STRING, value: r+"+"+i+suffix, meta: { type: COMPLEX_NUMBER, r, i, suffix } }
        },
        CONCAT: (args) => {
            const rv = args.reduce((p, {value,type}) => {
                if(type === STRING) {
                    return p+value;
                }
                if(type === LIST) {
                    return p+value.map(i=>i.value).join("");
                }
                if(type === MATRIX) {
                    return value.reduce((p0, arr) => p0+arr.map(i=>i.value).join(""),p);	
                }
                return p+value;
            },"");
            return { type: STRING, rv };
        },
        CONFIDENCE: ([{value:a},{value:sd},{value:n}]) => ({ type: NUMBER, value: jstat.normalci( 0, a, sd, n ).pop() }),
        "CONFIDENCE.NORM": (args, _context) => _context.functions.CONFIDENCE(args, _context),
        "CONFIDENCE.T": ([{value}]) => ({ type: NUMBER, value: jstat.tci( 0, a, sd, n ).pop() }),
        CONVERT: ([{value:n},{value:from},{value:to}]) => {
            
            const matchWithPrefix = (unit, fromto) => Object.keys(prefixes).find(pf => pf+unit === fromto);
            const matchCat = cat => {
                const [[xfrom, xp, xp2], [yfrom, yp, yp2]] = [from, to].map(ft => {
                  let ip = "";
                  const r = Object.keys(cat).find(i => {
                      if(ft === i) {
                          return true;
                      }
                      const o = matchWithPrefix(i, ft);
                      if(o) {
                          ip = o;
                          return true;
                      }
                      return false;
                  });
                  return [r, prefixes[ip] || 1, ip || ""]
                });
                if(xfrom && yfrom) {
                    // return n * cat[xfrom] * xp / cat[yfrom] / yp;
                    return [cat[xfrom] / cat[yfrom] * xp / yp * n, xp, yp, xp2, yp2];
                }
                return [false];
            };
            
            // todo: rather do a loop...
            let result = null;
            const [catname] = Object.entries({
                Speed: speed, 
                Information: computer, 
                Area: area, 
                Volume: space$1, 
                Temperature: temperature, 
                Magnetism: magn, 
                Power: power,
                Energy: energy,
                Force: force, 
                Pressure: press, 
                Time: time, 
                Distance: length, 
                "Weight and mass": weight
            }).find(([__, cat]) => {
                const r = matchCat(cat);
                const [u] = r;
                if(u) {
                    result = r; // save the value
                    return true;
                }
                return false;
            }) || [];
            
            if(result !== null) {
                return { type: NUMBER, value: result[0], meta: {
                    cat: catname,
                    multiplicatorFrom: result[1],
                    multiplicatorTo: result[2],
                    fromUnit: result[3],
                    toUnit: result[4],
                } };
            }
            return ({ type: ERROR, value: "No match found for types '"+from+"' - '"+to+"'" });
        },
        CORREL: ([{value:x,type:t1},{value:y,type:t2}], _context) => {
            if(t1 !== LIST || t2 !== LIST) {
                return { type: ERROR, value: "Both arguments of CORREL must be LIST, but found "+t1+"/"+t2 }
            }
            const [xf,yf] = [x,y].map(i => i.filter(({type}) => type == NUMBER));
            if(xf.length !== yf.length) {
                return { type: ERROR, value: NAVALUE, meta: { error: "Expected in CORREL(x,y) that x.length===y.length, but found "+ xf.length + "!==" + yf.length } };
            }
            const {value:xbar} = _context.functions.AVERAGE([{type:LIST,value:xf}]);
            const {value:ybar} = _context.functions.AVERAGE([{type:LIST,value:yf}]);
            const a = xf.map(({value:x}) => x-xbar);
            const b = yf.map(({value:y}) => y-ybar);
            const ab = a.map((i, idx) => i*b[idx]);
            const a2 = a.map(i => i*i);
            const b2 = b.map(i => i*i);
            const absum = ab.reduce((a, b) => a + b, 0);
            const a2sum = a2.reduce((a, b) => a + b, 0);
            const b2sum = b2.reduce((a, b) => a + b, 0);
            if(a2sum === 0 || b2sum === 0) {
                return { type: ERROR, value: DIV0, meta: { error: "Expected CORREL's s to be != 0, but found "+a2sum+"/"+b2sum } };
            }
            return { type: NUMBER, value: absum / Math.sqrt(a2sum*b2sum) };
        },
        COS: ([{value}]) => ({ type: NUMBER, value: Math.cos(value) }),
        COSH: ([{value}]) => ({ type: NUMBER, value: Math.cosh(value) }),
        COT: ([{value}]) => ({ type: NUMBER, value: 1/Math.tan(value) }),
        COTH: ([{value}]) => ({ type: NUMBER, value: 1/Math.tanh(value) }),
        COUPDAYBS: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        COUPDAYS: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        COUPDAYSNC: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        COUPNCD: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        COUPNUM: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        COUPPCD: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        _COVAR: ([{value:x,type:t1},{value:y,type:t2}], _context, sp) => {
            if(t1 !== LIST || t2 !== LIST) {
                return { type: ERROR, value: "Both arguments of CORREL must be LIST, but found "+t1+"/"+t2 }
            }
            const [xf,yf] = [x,y].map(i => i.filter(({type}) => type == NUMBER));
            if(xf.length !== yf.length) {
                return { type: ERROR, value: NAVALUE, meta: { error: "Expected in COVAR(x,y) that x.length===y.length, but found "+ xf.length + "!==" + yf.length } };
            }
            if(xf.length === 0 || yf.length === 0) {
                return { type: ERROR, value: DIV0, meta: { error: "Expected COVAR's x and y to be != 0, but found "+xf.length+"/"+yf.length } };
            }
            const {value:xbar} = _context.functions.AVERAGE([{type:LIST,value:xf}]);
            const {value:ybar} = _context.functions.AVERAGE([{type:LIST,value:yf}]);
            const a = xf.map(({value:x}) => x-xbar);
            const b = yf.map(({value:y}) => y-ybar);
            const ab = a.map((i, idx) => i*b[idx]);
            const absum = ab.reduce((a, b) => a + b, 0);
            return { type: NUMBER, value: absum / (xf.length + sp) };
        },
        COVAR: (args, _context) => _context.functions._COVAR(args, _context, 0),
        "COVARIANCE.P": (args, _context) => _context.functions._COVAR(args, _context, 0),
        "COVARIANCE.S": (args, _context) => _context.functions._COVAR(args, _context, -1),
        CRITBINOM: (args, _context) => _context.functinos["BINOM.INV"](args, _context),
        CSC: ([{value}]) => ({ type: NUMBER, value: 1/Math.sin(value) }),
        CSCH: ([{value}]) => ({ type: NUMBER, value: 1/Math.sinh(value) }),
        CUBEKPIMEMBER: ([{value}]) => ({ type: NULL, value }), // database query
        CUBEMEMBER: ([{value}]) => ({ type: NULL, value }), // database query
        CUBEMEMBERPROPERTY: ([{value}]) => ({ type: NULL, value }), // database query
        CUBERANKEDMEMBER: ([{value}]) => ({ type: NULL, value }), // database query
        CUBESET: ([{value}]) => ({ type: NULL, value }), // database query
        CUBESETCOUNT: ([{value}]) => ({ type: NULL, value }), // database query
        CUBEVALUE: ([{value}]) => ({ type: NULL, value }), // database query
        CUMIPMT: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        CUMPRINC: ([{value}]) => ({ type: NULL, value: "todo: from finacial function" }),
        _DATABASE: ([{value:database},{value:criteria}],_context) => {
            const [headersv, ...data] = database;
            const headers = headersv.map(({ value }) => value);
            const db = data.map(j => j.reduce((p, {value,type}, idx) => ({ ...p, [headers[idx]]: {value,type} }), {}));
            
            const [cheadersv, ...crit] = criteria;
            const cheaders = cheadersv.map(({ value }) => value);
            const critas = crit.map(j => 
                j.reduce((p, {value,type}, idx) => ({ ...p, [idx]: {value,type,key:cheaders[idx]} }),
                {})
            );
            
            const op = (value, crit) => {
                const f = _context.functions._CRITMATCHER([crit], _context);
                return f({value});
            };
            const filterf = x => critas.some(cri => Object.entries(cri).every(([k,v]) => op(x[v.key].value, v)));
            return { type: LIST, value: db.filter(filterf), meta: { criteria: critas.map(i => Object.values(i).map(({key,value}) => ({field:key,matches:value}))) } };
        },
        DAVERAGE: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            if(selected.length===0) {
                return { type: ERROR, value: DIV0, meta: { error: "No entires matched the search" } };
            }
            const avg = _context.functions.AVERAGE(selected.map(i => i[fieldname]));
            return { type: NUMBER, value: avg, meta: { matches: selected } };
        },
        DAYS: ([{value:d1,type:t1},{value:d2,type:t2}]) => {
            const date1 = t1 === DATE ? d1 : new Date(d1);
            const date2 = t2 === DATE ? d2 : new Date(d2);
            return { type: NUMBER, value: (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24) }; 
        },
        DAYS360: ([{value:d1,type:t1},{value:d2,type:t2},{value:method}={value:false}]) => {
            let d1d = d1.getDate(), d2d = d2.getDate();
            let d1m = d1.getMonth(), d2m = d2.getMonth();
            const lastDayOfD1Month = (new Date(2008, d1m + 1, 0)).getDate(), lastDayOfD2Month = (new Date(2008, d2m + 1, 0)).getDate();
            if(method === false) {
              /*
              U.S. (NASD) method. 
              If the starting date is the last day of a month, it becomes equal to the 30th day of the same month. 
              If the ending date is the last day of a month and 
                  the starting date is earlier than the 30th day of a month, 
                  the ending date becomes equal to the 1st day of the next month;
              otherwise the ending date becomes equal to the 30th day of the same month.
              */
              if(d1d === lastDayOfD1Month) {
                  d1d = 30;
              }
              if(d2d === lastDayOfD2Month && d1d < 30) {
                  d2d = 1;
                  d2m = d2m + 1;
              } else if(d2d === lastDayOfD2Month) {
                  d2d = 30;
              }
            } else if(method === true) {
                /*
                European method. 
                Starting dates and ending dates that occur on the 31st day of a month 
                become equal to the 30th day of the same month.
                */
                if(d2d === 31) {
                    d2d = 30;
                }
                if(d1d === 31) {
                    d1d = 30;
                }
            } else {
                return { type: ERROR, value: "DAYS360's method must be either true or false, but found "+method };
            }
            return { type: NUMBER, value: (d2m - d1m) * 30 + d2d - d1d, meta: { d1d,d2d,d1m,d2m } };
        },
        DB: ([{value:cost},{value:salvage},{value:life},{value:period},{value:month}={value:12}], _context) => {
            const urate = 1 - ((salvage / cost) ** (1 / life));
            const rate = Math.round(urate*1000)/1000; // excel rounds to 3 places
            if(period === 1) {
                return { type: NUMBER, value: cost * rate * month / 12 };
            }
            else if(period === life) { // last
                const {value:totaldepprior} = _context.functions.DB([{value:cost},{value:salvage},{value:life},{value:period-1},{value:month}], _context);
                return { type: NUMBER, value: ((cost - totaldepprior) * rate * (12 - month)) / 12 };
            } 
            const {value:totaldepprior} = _context.functions.DB([{value:cost},{value:salvage},{value:life},{value:period-1},{value:month}], _context);
            return { type: NUMBER, value: (cost - totaldepprior) * rate };
        },
        DBCS: ([{value}]) => ({ type: STRING, value: value.split("").map(i =>
            i.charCodeAt(0) < 65248 ? String.fromCharCode(i.charCodeAt(0) + 65248) : i
        ).join("") }),
        DCOUNT: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.COUNT(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DCOUNTA: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.COUNTA(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DDB: ([{value:cost},{value:salvage},{value:life},{value:period},{value:factor}={value:2}], _context) => {
            if(period <= 0) {
                return { type:NUMBER,value:0 }
            }
            const {value:totaldepprior} = _context.functions.DDB([{value:cost},{value:salvage},{value:life},{value:period-1},{value:factor}], _context);
            return { type: NUMBER, value: Math.min(
                (cost - totaldepprior) * (factor/life),
                (cost - salvage - totaldepprior)
            )};
        },
        _DEC2X: ([{value:a1,type},a2,{value:excel}={value:true}],_context, base) => {
            const r =  _context.functions.BASE([{
                value: (excel && a1 < 0) ? base**10+a1 : a1, // excel has funny counting
                type
            },{type:NUMBER,value:base},a2],_context);
            if(a2 && a2.value > 0 && r.value.length > a2.value) {
                return { type: ERROR, value: NUMVALUE, meta: { result: r } }
            }
            return r;
        },
        DEC2BIN: (args,_context) => _context.functions._DEC2X(args,_context,2),
        DEC2HEX: (args,_context) => _context.functions._DEC2X(args,_context,16),
        DEC2OCT: (args,_context) => _context.functions._DEC2X(args,_context,8),
        DECIMAL: ([{value},{value:base}]) => ({ type: NUMBER, value: parseInt(value,base) }),
        DEGREES: ([{value:r}]) => ({ type: NUMBER, value: r*(180/Math.PI) }),
        DELTA: ([{value:n1,type:t1},{value:n2,type:t2}={value:0,type:NUMBER,meta:{error:"Expected DELTA n1 and n2 to be both of type NUMBER, but found "+String(t1)+"/"+String(t2)}}]) => (t1 !== NUMBER || t2 !== NUMBER) ? { type: ERROR, value: VVALUE  } : { type: NUMBER, value: +(n1===n2) },
        DEVSQ: (args, _context) => {
            const {value:avg} = _context.functions.AVERAGE(args,_context);
            // const {value:xbar} = _context.functions.AVERAGE([{type:LIST,value:xf}]);
            // const a2 = a.map(i => i*i);
            const result = args.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                case STRING:
                    return sum;
                case NUMBER:
                  return sum + (value-avg)*(value-avg);
                case LIST:
                  return sum + _context.functions.DEVSQ(value,_context).value;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in AVERAGE");
              }
          }, 0);
          return { type: NUMBER, value: result, meta: { avg } };
        },
        DGET: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            if(!selected.length) {
                return {type:ERROR,value:VVALUE};
            }
            if(selected.length>1) {
                return {type:ERROR,value:NUMVALUE};
            }
            return { ...selected[0][fieldname], meta: { ...dbmeta, matches: selected } };
        },
        DISC: ([{value}]) => ({ type: NULL, value }), // todo: financial
        DMAX: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            if(!selected.length) {
                return {type:ERROR,value:VVALUE};
            }
            const r = _context.functions.MAX(selected.map(i => i[fieldname]),_context);
            return { ...r, meta: { ...dbmeta, matches: selected } };
        },
        DMIN: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            if(!selected.length) {
                return {type:ERROR,value:VVALUE};
            }
            const r = _context.functions.MIN(selected.map(i => i[fieldname]),_context);
            return { ...r, meta: { ...dbmeta, matches: selected } };
        },
        DOLLAR: ([{value,type},dec={value:2,type:NUMBER}],_context) => {
            const {value:ammount} = _context.functions.ROUND([{value,type},dec],_context);
            const display = "$"+ammount;
            
            // use for text maybe?
            /*
            const defaultOptions = (new Intl.NumberFormat()).resolvedOptions();
            const currencycode =
                CC2Currency[defaultOptions.locale] ||
                CC2Currency[defaultOptions.locale.split("-").pop()];
            const r = new Intl.NumberFormat(defaultOptions.locale, {
                style: "currency",
                currency: currencycode,
                // currencyDisplay: "code",
                //maximumSignificantDigits: 3,
                //minimumSignificantDigits: 3,
                //minimumIntegerDigits: 1,
                minimumFractionDigits: dec.value > 0 ? dec.value : 0,
                useGrouping: true
            }).format(ammount);
            */
            
            if(ammount < 0) {
                return { type:STRING, value: "("+display+")" };
            }
            return { type:STRING, value: display };
        },
        DOLLARDE: ([{value},{value:frac}]) => {
            const [intp,fracp] = value.toFixed(2).split(".");
            const dec = parseInt(fracp)/frac;
            return { type: NUMBER, value: parseInt(intp)+dec, meta: { intp,fracp } };
        },
        DOLLARFR: ([{value},{value:frac}]) => {
            const [intp] = value.toFixed(0).split(".");
            const dec = (value-intp)*frac/100;
            return { type: NUMBER, value: parseInt(intp)+dec, meta: { intp,fracp: value-intp } };
        },
        DPRODUCT: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.PRODUCT(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DSTDEV: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions["STDEV.S"](selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DSTDEVP: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions["STDEV.P"](selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DSUM: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.SUM(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DURATION: ([{value}]) => ({ type: NULL, value }), // financial
        DVAR: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.VAR(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        DVARP: ([{value:database},{value:field,type:ft},{value:criteria}],_context) => {
            const {value:selected,meta:dbmeta} = _context.functions._DATABASE([{value:database},{value:criteria}],_context);
            const [headersv] = database;
            const headers = headersv.map(({ value }) => value);
            const fieldname = ft === NUMBER ? headers[field-1] : field;
            const {value:count} = _context.functions.VARP(selected.map(i => i[fieldname]),_context);
            return { type: NUMBER, value: count, meta: { ...dbmeta, matches: selected } };
        },
        EFFECT: ([{value:nominal_rate,type:t1},{value:npery,type:t2}]) => {
            if(t1 !== NUMBER || t2 !== NUMBER) {
                return { type:ERROR, value:VVALUE, meta: {error:"Espected EFFECT's arguments nominal_rate and npery to be NUMBER, but found "+String(t1)+"/"+String(t2)} };
            }
            if(nominal_rate <= 0) {
                return { type:ERROR, value:NUMVALUE, meta: {error:"Expected EFFECT's nominal_rate to be <= 0, but found "+String(nominal_rate)+" ("+String(t1)+")"} };
            }
            if(npery < 1) {
                return { type:ERROR, value:NUMVALUE, meta: {error:"Expected EFFECT's npery to be < 1, but found "+String(npery)+" ("+String(t2)+")"} };
            }
            return { type: NUMBER, value: (1 + nominal_rate/npery)**npery - 1 };
        },
        ENCODEURL: ([{value}]) => ({ type: STRING, value: window.encodeURIComponent(value) }),
        ERF: ([{value}]) => {
            // var erf = require( '@stdlib/math/base/special/erf' );
            // var y = erf( value );
            return {type:NUMBER, value:"NOT IMPLEMETNED"}
        },
        "ERF.PRECISE": ([{value}]) => {
            // var erf = require( '@stdlib/math/base/special/erf' );
            // var y = erf( value );
            return {type:NUMBER, value:"NOT IMPLEMETNED"}
        },
        ERFC: ([{value}]) => {
            // var erfc = require( '@stdlib/math/base/special/erfc' );
            // var y = erf( value );
            return {type:NUMBER, value:"NOT IMPLEMETNED"}
        },
        "ERFC.PRECISE": ([{value}]) => {
            // var erfc = require( '@stdlib/math/base/special/erfc' );
            // var y = erf( value );
            return {type:NUMBER, value:"NOT IMPLEMETNED"}
        },
        "ERROR.TYPE": ([{value,type}]) => {
            const m = {
              NULLE : 1,
              DIV0: 2,
              VVALUE: 3,
              REFVALUE: 4,
              NAMEE: 5,
              NUMVALUE: 6,
              NAVALUE: 7,
              GETTINGDATA: 8,
          };
          const r = m[value] || NAVALUE;
          return { type: (type !== ERROR || r === NAVALUE) ? ERROR : NUMBER, value: r }
        },
        EUROCONVERT: ([{value}]) => ({ type: NULL, value }), //  add-in: todo
        EXP: ([{value}]) => ({ type: NUMBER, value: Math.E**value }),
        "EXPON.DIST": ([{value:x},{value:lambda},{value:cumulative}]) => {
            //var cdf = require( '@stdlib/stats/base/dists/exponential/cdf' ); // true
            //var pdf = require( '@stdlib/stats/base/dists/exponential/pdf' ); // false
            // const f = cumulative ? cdf : pdf;
            // f(x,lambda);
            return { type: NUMBER, value: "NOT implemented" };
        },
        EXPONDIST: (args,context) => context.functions["EXPON.DIST"](args,context),
        _FACT: (counter,pro=1,neg=1,context) => counter <= 1 ? pro : context.functions._FACT(counter-neg,pro*counter,neg,context), // tail recurisve
        FACT: ([{value}],context) => {
            if(value < 0) {
                return { type: ERROR, value: NUMVALUE };
            }
            return { type: NUMBER, value: context.functions._FACT(value,1,1,context) };
        },
        FACTDOUBLE: ([{value}],context) => {
            if(value < 0) {
                return { type: ERROR, value: NUMVALUE };
            }
            return { type: NUMBER, value: context.functions._FACT(value,1,2,context) };
        },
        FACTN: ([{value},{value:neg}={value:1}],context) => {
            if(value < 0) {
                return { type: ERROR, value: NUMVALUE };
            }
            return { type: NUMBER, value: context.functions._FACT(value,1,neg,context) };
        },
        FALSE: () => ({ type: BOOLEAN, value: false }),
        "F.DIST": ([{value}]) => { // todo
            // var cdf = require( '@stdlib/stats/base/dists/f/cdf' ); var y = cdf( 2.0, 1.0, 1.0 ); // true
            // var pdf = require( '@stdlib/stats/base/dists/f/pdf' ); // false
        },
        FDIST: ([{value}]) => ({ type: NULL, value }), // cdf // todo
        "F.DIST.RT": ([{value}]) => ({ type: NULL, value }), // 1 - "F.DIST" // todo
        FILTER: ([{value:_data,type},{value:boollist,type:bttype},defaultt={type:ERROR}]) => {
            // ({ type: NULL, value }), // requires array functions in formulas
            let data = _data;
            if(type === LIST) {
                data = [data];
            }
            if(type !== MATRIX && type !== LIST) {
                return { type: ERROR, value: "FILTER expects a LIST or MATRIX as the first argument, but found "+String(type) };
            }
            if(bttype !== LIST) {
                return { type: ERROR, value: "FILTER expects a LIST as the second argument, but found "+String(bttype) };
            }
            const filtereddata = data.filter((__,idx) => boollist[idx].value);
            if(!filtereddata.length) {
                return {...defaultt};
            }
            return {
                type: ARGUMENTS,
                value: filtereddata
            }
        },
        FILTERXML: ([{value:xml},{value:xpath}]) => {
            // todo: insert as dependency to make code worker compadable
            const oParser = new DOMParser();
            const oDOM = oParser.parseFromString(xml, "application/xml");
            const evaluator = new XPathEvaluator();
            const attempt = (xpathtype, field, type) => {
                try {
                    const expression = evaluator.createExpression(xpath);
                    const result = expression.evaluate(oDOM, xpathtype);
                    return { type: type, value: result[field],  /*meta: { result }*/ }
                } catch(e) {
                    return { type: ERROR, result: VVALUE, meta: { error: e } };
                }
            };
            const x  = attempt(XPathResult.STRING_TYPE, "stringValue", STRING);
            if(x.type !== ERROR) {
                return x;
            }
            const y  = attempt(XPathResult.NUMBER_TYPE, "numberValue", NUMBER);
            if(y.type !== ERROR) {
                return y;
            }
            const z  = attempt(XPathResult.BOOLEAN_TYPE, "booleanValue", BOOLEAN);
            if(z.type !== ERROR) {
                return z;
            }
               return { type: ERROR, result: VVALUE, meta: { x, y, z } };
        },
        FIND: ([{value:find_text},{value:within_text},{value:start_num}={}]) => {
             // indexOf in strings
            return { type: NUMBER, value: within_text.indexOf(find_text,start_num)+1 };
        },
        FINDB: ([{value:find_text},{value:within_text},{value:start_num}={}]) => {
            const idx = within_text.indexOf(find_text,start_num);
            const r = (new TextEncoder().encode(within_text.substring(0,idx))).length;
            return { type: NUMBER, value: r };
        },
        "F.INV": ([{value:p},{value:n},{value:m}]) => {
            // var betaincinv = require( '@stdlib/math/base/special/betaincinv' );
            // B = (Beta(n/2,m/2)**-1)
            // f(m,n)**-1 = n/m * (1/B(1-p) - 1)
            // see https://stats.stackexchange.com/questions/18843/how-to-obtain-the-inverse-of-the-f-cumulative-distribution-based-on-the-f-cumula
            // betaincinv(p, n,m)
            // const result = (1/betaincinv(1-p, n/2, m/2) - 1) / m * n
            // return { type: NUMBER, value: result };
            return { type: ERROR, value: "NOT IMPLEMENTED" };
        },
        "F.INV.RT": ([{value:p},{value:n},{value:m}]) => {
            // var betaincinv = require( '@stdlib/math/base/special/betaincinv' );
            // B = (Beta(n/2,m/2)**-1)
            // f(m,n)**-1 = n/m * (1/B(1-p) - 1)
            // see https://stats.stackexchange.com/questions/18843/how-to-obtain-the-inverse-of-the-f-cumulative-distribution-based-on-the-f-cumula
            // betaincinv(p, n,m)
            // const result = (1/betaincinv(1-p, n/2, m/2, true) - 1) / m * n
            // return { type: NUMBER, value: result };
            return { type: ERROR, value: "NOT IMPLEMENTED" };
        },
        FINV: (args,context) => context.FUNCTIONS["F.INV"](args, context),
        FISHER: ([{value:x}]) => ({ type: NUMBER, value: 0.5*Math.log( (1+x)/(1-x) ) }),
        FISHERINV: ([{value:y}]) => ({ type: NUMBER, value: (Math.E**(2*y)-1) / (Math.E**(2*y)+1) }),
        FIXED: ([number,dec={value:2},{value:nocomma}={value:false}],context) => {
            const defaultOptions = (new Intl.NumberFormat()).resolvedOptions();
            const r = new Intl.NumberFormat(defaultOptions.locale, {
                style: "decimal",
              useGrouping: !nocomma
            }).format(context.functions.ROUNDDOWN([number,dec],context).value);
            return { type: STRING, value: r };
        },
        "FLOOR.MATH": ([{value:n},{value:dec},{value:m}], _context) => {
            if(m === 1 && n < 0) {
                return { type: NUMBER, value: dec*Math.ceil(n/dec) };
            }
            return { type: NUMBER, value: dec*Math.floor(n/dec) };
        },
        "FLOOR.PRECISE": ([{value:n},{value:dec}]) => ({ type: NUMBER, value: !n||!dec ? 0 : dec*Math.ceil(n/dec) }),
        FORECAST: (args,context) => context.functions["FORECAST.LINEAR"](args,context),
        
        "FORECAST.ETS": ([{value}]) => ({ type: NULL, value }), // todo
        "FORECAST.ETS.CONFINT": ([{value}]) => ({ type: NULL, value }),
        "FORECAST.ETS.SEASONALITY": ([{value}]) => ({ type: NULL, value }),
        "FORECAST.ETS.STAT": ([{value}]) => ({ type: NULL, value }),
        
        "FORECAST.LINEAR": ([{value:t,type},{type:t1,value:x},{type:t2,value:y}]) => {
            if(t1 !== LIST || t2 !== LIST) {
                return { type: ERROR, value: "Expected x and y of FORECAST.LINEAR to be LIST, but found "+t1+"/"+t2 }
            }
            if(type !== NUMBER) {
                return { type: ERROR, value: "Expected FORECAST.LINEAR's first param to be NUMBER, found "+t+"("+type+")" }
            }
            const kx = x.map(({value}) => value);
            const ky = y.map(({value}) => value);
            const avg = ar => {
                const [sum,count] = ar.reduce(([sum,count],v) => [sum+v,count+1],[0,0]);
                return sum/count;
            };
            const ax = avg(kx);
            const ay = avg(ky);
            const [nr,dr] = kx.reduce(([nr,dr],x,idx) => [
                nr + ((x-ax) * (ky[idx]-ay)),
                dr + ((x-ax)*(kx[idx]-ax))
            ],[0,0]);
            const b = nr/dr;
            const a = ay-b*ax;
            return { type: NUMBER, value: a+b*t, meta: { m:b, b:a } };
        }, 
        FORMULATEXT: ([{type:t1,meta:{type},formula,value}]) => {
            if(type === CELL) {
                return { type: (formula ? STRING : ERROR), value: (formula || NAVALUE)  };
            }
            if(t1 === LIST && value[0].meta.type === CELL) {
                const { formula } = value[0];
                return { type: (formula ? STRING : ERROR), value: (formula || NAVALUE)  };
            }
            if(t1 === MATRIX && value[0][0].meta.type === CELL) {
                const { formula } = value[0][0];
                return { type: (formula ? STRING : ERROR), value: (formula || NAVALUE)  };
            }
            return { type: ERROR, value: VVALUE  }
        },
        FREQUENCY: ([{type:t1,value:data_array},{type:t2,value:bins_array}]) => {
            if(t1 !== LIST || t2 !== LIST) {
                return { type: ERROR, value: "Expected both arguments of FREQUENCY to be LIST but found "+t1+"/"+t2 }
            }
            if(bins_array.length === 0) {
                return { type: NUMBER, value: data_array.length };
            }
            const rev = bins_array.sort().reverse(); // reverse for findLast
            const [results,cats] = data_array
              .filter(({type}) => type !== NULL)
              .reduce(([p,cats], {value:o}, idxn) => {
                  const idxx = rev.findIndex(({value:u}) => o > u);
                const idx = idxx === -1 ? 0 : rev.length - idxx;
                p[idx] += 1;
                cats[idx] = [...cats[idx], o];
                return [p,cats];
              },
            [
              Array.from({length:bins_array.length+1}).fill(0), // counter
              Array.from({length:bins_array.length+1}).fill([]), // values by cat
            ]);
            return { type: ARGUMENTS, value: results.map(value => ({
                value, type: NUMBER
            })), meta: { results, cats } }
        },
        "F.TEST": (args, context) => context.functions.FTEST(args, context),
        FTEST: ([{value:n},{value:m}]) => {
            // var anova1 = require( '@stdlib/stats/anova1' );
            // const stats = [...n,...m].map(({value}) => value)
            // anova1( stats, [...[...n].fill("A"), [...m].fill("B")] );
            // return { value: anova1.statistic, type: NUMBER };
            return { type: ERROR, value: "NOT IMPLEMENTED" };
        },
        FVSCHEDULE: ([{value:principal},{value:schedule,type}]) => type !== LIST ? {
            type: ERROR,
            value: VVALUE,
            meta: { error: "Expected FVSCHEDULE's schedule to be of type LIST, found "+type }
        } : { 
            type: schedule.some(({type:t}) => t !== NUMBER && t !== NULL) ? ERROR : NUMBER,
            value: schedule.reduce((p, {value,type:t}) => t !== NUMBER && t !== NULL ? VVALUE : p * (1+(value || 0)), principal)
        },
        GAMMA: ([{value}]) => ({ type: NULL, value }),
        "GAMMA.DIST": ([{value}]) => ({ type: NULL, value }),
        GAMMADIST: ([{value}]) => ({ type: NULL, value }),
        "GAMMA.INV": ([{value}]) => ({ type: NULL, value }),
        GAMMAINV: ([{value}]) => ({ type: NULL, value }),
        GAMMALN: ([{value}]) => ({ type: NULL, value }),
        "GAMMALN.PRECISE": ([{value}]) => ({ type: NULL, value }),
        
        GAUSS: ([{value}]) => ({ type: NULL, value }), // standard normal cumulative distribution - 0.5
        _GCD2: ([{value:xx},{value:yy},...args]) => {
            // todo: Use more efficient alg for lib
            let x = Math.abs(xx);
            let y = Math.abs(yy);
            while(y) {
              var t = y;
              y = x % y;
              x = t;
            }
            return { type: NUMBER, value: x };
        },
        GCD: (args,context) => {
            return args.reduce((p,i) => context.functions._GCD2([p,i],context));
        },
        GEOMEAN: (allargs,context) => {
              const [prod, count] = allargs.reduce(([prod,count], { value, type }) => {
                switch(type) {
                  case NULL:
                      return [prod,count];
                  case NUMBER:
                    return [prod*value,count+1];
                  case LIST:
                    const {meta:{count:c,prod:p}} = context.functions.GEOMEAN(value,context);
                    return [prod*p,count+c];
                  default:
                    throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in GEOMEAN");
                }
            }, [1,0]);
            return { type: NUMBER, value: Math.pow(prod, 1/count), meta: { prod, count }};
        },
        GESTEP: ([{value},{value:step}={value:0}]) => ({ type: NUMBER, value: +(value > step) }),
        GETPIVOTDATA: ([{value}]) => ({ type: NULL, value }), // ?? we don't have pivot table currently
        GROWTH: ([{value}]) => ({ type: NULL, value }),//  maybe https://github.com/Tom-Alexander/regression-js or https://www.npmjs.com/package/exponential-regression
        HARMEAN: (allargs,context) => {
              const [sum, count] = allargs.reduce(([sum,count], { value, type }) => {
                switch(type) {
                  case NULL:
                      return [sum,count];
                  case NUMBER:
                    return [sum+1/value,count+1];
                  case LIST:
                    const {meta:{count:c,sum:p}} = context.functions.HARMEAN(value,context);
                    return [sum+p,count+c];
                  default:
                    throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in HARMEAN");
                }
            }, [0,0]);
            return { type: NUMBER, value: count/sum, meta: { sum, count }};
        },
        HEX2BIN: ([{value},{value:dec}={value:0}]) => ({ type: STRING, value: parseInt(value,16).toString(2).padStart(dec,"0") }),
        HEX2DEC: ([{value}]) => ({ type: NUMBER, value: parseInt(value,16) }),
        HEX2OCT: ([{value},{value:dec}={value:0}]) => ({ type: STRING, value: parseInt(value,16).toString(8).padStart(dec,"0") }),
        HLOOKUP: ([lookup_value,table_array,row_index_num,range_lookup={ type: BOOLEAN, value: true }], context) => {
            if(table_array.type === LIST) {
                table_array = { type: MATRIX, value: [table_array.value] };
            }
            if(table_array.type !== MATRIX) {
                throw new Error("Expected table_array to be a MATRIX but found "+table_array.value+" ("+table_array.type+")");
            }
            
            const idx = table_array.value.findIndex(([i]) => lookup_value.value == i.value ||
                (lookup_value.type === STRING && i.type === STRING && lookup_value.value.toLowerCase() === i.value.toLowerCase())
            );
            if(idx > -1) {
                // Exact match
                return table_array.value[idx][row_index_num.value-1];
            }
            if(!range_lookup.value) {
                return { type: ERROR, value: NAVALUE };
            }
            // Range lookup: Return last values of values that are smaller than criteria
            const searchr = [].concat(table_array.value.map(([i]) => i));
            const { _GREATER } = context.functions;
            let item = { type: ERROR, value: NAVALUE };
            while(searchr.length) {
                if(_GREATER(searchr[0].value, lookup_value.value)) {
                    return item;
                }
                const idx = table_array.value[0][0].length - searchr.length;// 0, 1, 2, 3, ....
                item = table_array.value[idx][row_index_num.value-1];
                searchr.shift();
            }
            return item;
        },

        "HYPGEOM.DIST": ([{value}]) => ({ type: NULL, value }), // todo
        HYPGEOMDIST: ([{value}]) => ({ type: NULL, value }), // todo
        IFS: (args, context) => {
            for(let idx = 0;idx < args.length; idx+=2) {
                const {value} = args[idx];
                if(value) {
                    return {...args[idx+1]};
                }
            }
            return { type: ERROR, value: NAVALUE };
        },
        _PARSECOMPLEXSTRING: ({value},context) => {
            if(value === "i" || value === "j") {
                return {i:1, r:0, suffix: value};
            }
            if(value === "-i" || value === "-j") {
                return {i:-1, r:0, suffix: value[value.length-1]};
            }
            let [r,i] = value.split("+").map(u => u.trim());
            if(r && i && (i.endsWith("j") || i.endsWith("i"))) {
              const fi = i === "i" || i === "j" ? 1 : parseFloat(i);
              const fr = parseFloat(r);
              return {i:fi, r:fr, suffix: i[i.length-1]};
            }
            [r,i] = value.split("-").map(u => u.trim());
            if(r && i && (i.endsWith("j") || i.endsWith("i"))) {
              const fi = i === "i" || i === "j" ? -1 : parseFloat(i || "1") * -1;
              const fr = parseFloat(r);
              return {i:fi, r:fr, suffix: i[i.length-1]};
            }
            if(value.endsWith("j") || value.endsWith("i")) {
                return {i:parseFloat(value), r:0, suffix: value[value.length-1]};
            }
            const rr = parseFloat(value);
            if(!isNaN(rr)) {
                return {i:0, r:rr, suffix: "i"};
            }
            return { type: ERROR, value: "_PARSECOMPLEX requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(value)}
        },
        _PARSECOMPLEX: ({value,type,meta},context) => {
            if(type === NUMBER) {
                return { i: 0, r: value, suffix: "i" };
            }
            const { type: mt, r:r0, i:i0, suffix:s } = meta || {};
            if(mt === COMPLEX_NUMBER) {
                return { i: i0, r: r0, suffix: s };
            }
            return context.functions._PARSECOMPLEXSTRING({value},context)
        },
        IMABS: ([arg],context) => {
            const {r,i,type} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMABS requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            return { type: NUMBER, value: Math.sqrt(r*r + i*i) };
        },
        IMAGINARY: ([arg],context) => {
            const {i,type} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMAGINARY requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            return { type: NUMBER, value: i };
        },
        IMARGUMENT: ([arg],context) => {
            const {i,r,type} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMARGUMENT requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            return { type: NUMBER, value: Math.atan(i/r) };
        },
        IMCONJUGATE: ([arg],context) => {
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCONJUGATE requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const ic = i * -1;
            return { type: STRING, value: r+"+"+ic+suffix, meta: { type: COMPLEX_NUMBER, r, i:ic, suffix } };
        },
        IMCOS: ([arg],context) => {
            // cosh(-y) cos(x) + i sinh(-y) sin(x)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOS requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const real = Math.cos(r)*Math.cosh(-i);
            const img = Math.sin(r)*Math.sinh(-i);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMCOSH: ([arg],context) => {
            // cosh(x) cos(y) + i sinh(x) sin(y)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOSH requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const real = Math.cosh(r)*Math.cos(i);
            const img = Math.sinh(r)*Math.sin(i);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMCOT: ([arg],context) => {
            // (sin(2r) - j sinh(2i)) / (cosh(2i)-cos(2r))
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOT requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const q = Math.cosh(2*i)-Math.cos(2*r);
            const real = Math.sin(2*r)/q;
            const img = Math.sinh(2*i)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMCSC: ([arg],context) => {
            // r =  - 2cosh(i)sin(r) / (cos(2r)-cosh(2i))
            // i = 2cos(r)sinh(i) / (cos(2r)-cosh(2i))
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCSC requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const q = Math.cos(2*r)-Math.cosh(2*i);
            const real = -2*Math.cosh(i)*Math.sin(r)/q;
            const img = 2*Math.cos(r)*Math.sinh(i)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMCSCH: ([arg],context) => {
            // r =  - 2sinh(r)cos(i) / (cos(2i)-cosh(2r))
            // i = 2cosh(r)sin(i) / (cos(2r)-cosh(2i))
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCSCH requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const q = Math.cos(2*i)-Math.cosh(2*r);
            const real = -2*Math.sinh(r)*Math.cos(i)/q;
            const img = 2*Math.cosh(r)*Math.sin(i)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMDIV: ([x,y],context) => {
            const {i:b,r:a,type:t1,suffix} = context.functions._PARSECOMPLEX(x,context);
            const {i:d,r:c,type:t2} = context.functions._PARSECOMPLEX(y,context);
            if(t1 === ERROR) {
                return { type: ERROR, value: "IMDIV requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(x.value)}
            }
            if(t2 === ERROR) {
                return { type: ERROR, value: "IMDIV requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(y.value)}
            }
            //(ac+bd)+(bc-ad)j    /   (c*c+d*d)
            const q = c*c+d*d;
            const real = (a*c+b*d)/q;
            const img = (b*c-a*d)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMEXP: ([arg],context) => {
            // w = e^x(cos(y) + i sin(y))
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMEXP requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const real = Math.exp(r)*Math.cos(i);
            const img = Math.exp(r)*Math.sin(i);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMLN: ([arg],context) => {
            // r = ln(√(x² + y²))
            // i = atan(x/y)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMLN requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const real = Math.log(Math.sqrt(r*r+i*i));
            const img = Math.atan(i/r);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMLOG10: (arg,context) => {
            // log10(e)*ln(arg)
            const t = context.functions.IMLN(arg,context);
            if(t.type === ERROR) {
                return t;
            }
            const {r, i, suffix} = t.meta;
            const q = Math.log10(Math.E);
            const real = r*q;
            const img = i*q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMLOG2: (arg,context) => {
            // log10(e)*ln(arg)
            const t = context.functions.IMLN(arg,context);
            if(t.type === ERROR) {
                return t;
            }
            const {r, i, suffix} = t.meta;
            const q = Math.log2(Math.E);
            const real = r*q;
            const img = i*q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        _IMPOWER2: ([x,y],context) => {
            const {i:b,r:a,type:t1,suffix} = context.functions._PARSECOMPLEX(x,context);
            const {i:d,r:c,type:t2} = context.functions._PARSECOMPLEX(y,context);
            if(t1 === ERROR) {
                return { type: ERROR, value: "IMPOWER requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(x.value)}
            }
            if(t2 === ERROR) {
                return { type: ERROR, value: "IMPOWER requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(y.value)}
            }
            //(ac-bd)+(ad+bc)j
            const real = (a*c-b*d);
            const img = (b*c+a*d);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } }; 
        },
        IMPOWER: ([arg0,{value:exp}],context) => {
            // e**(x*log(z))
            const t = context.functions.IMLN([arg0],context);
            if(t.type === ERROR) {
                return t;
            }
            const {r, i, suffix} = t.meta;
            return context.functions.IMEXP([{
                type: STRING, value: (r*exp)+"+"+(i*exp)+suffix,
                meta: { type: COMPLEX_NUMBER, r:r*exp, i:i*exp, suffix }
            }],context);
        },
        IMPRODUCT: (args,context) => {
            return args.reduce((p,n) => {
                if(p.type === ERROR) {
                    return p;
                }
                return context.functions._IMPOWER2([p,n],context);
            });
        },
        IMREAL: ([arg],context) => {
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMREAL requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            return { type: NUMBER, value: r, meta: { type: COMPLEX_NUMBER, r, i:0, suffix } };
        },
        IMSEC: ([arg],context) => {
            // r = 2 cos(r)cosh(i) / cos(2r)+cosh(2i)
            // i = 2 sin(r)sinh(i) / cos(2r)+cosh(2i)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMSEC requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const q = Math.cos(2*r)+Math.cosh(2*i);
            const real = 2*Math.cos(r)*Math.cosh(i)/q;
            const img = 2*Math.sin(r)*Math.sinh(i)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMSECH: ([arg],context) => {
            // r = 2 cos(i)cosh(r) / cos(2y)+cosh(2r)
            // i = -2 sin(i)sinh(r) / cos(2y)+cosh(r)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX(arg,context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMSECH: requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(arg.value)}
            }
            const q = Math.cos(2*i)+Math.cosh(2*r);
            const real = 2*Math.cos(i)*Math.cosh(r)/q;
            const img = -2*Math.sin(i)*Math.sinh(r)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMSIN: ([{value}],context) => {
            // cosh(-y) sin(x) - i sinh(-y) cos(x)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX({value},context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOS requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(value)}
            }
            const real = Math.cos(r)*Math.cosh(-i);
            const img = Math.cos(r)*Math.sinh(-i);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMSINH: ([{value}],context) => {
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX({value},context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOS requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(value)}
            }
            const real = Math.cos(i)*Math.sinh(r);
            const img = Math.cosh(r)*Math.sin(i);
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMSQRT: ([arg0],context) => context.functions.IMPOWER([arg0,{value:0.5}],context),
        IMSUB: ([x,y],context) => {
            const {i:b,r:a,type:t1,suffix} = context.functions._PARSECOMPLEX(x,context);
            const {i:d,r:c,type:t2} = context.functions._PARSECOMPLEX(y,context);
            if(t1 === ERROR) {
                return { type: ERROR, value: "IMSUB requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(x.value)}
            }
            if(t2 === ERROR) {
                return { type: ERROR, value: "IMSUB requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(y.value)}
            }
            const real = a-c;
            const img = b-d;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        _IMSUM2: ([x,y],context) => {
            const {i:b,r:a,type:t1,suffix} = context.functions._PARSECOMPLEX(x,context);
            const {i:d,r:c,type:t2} = context.functions._PARSECOMPLEX(y,context);
            if(t1 === ERROR) {
                return { type: ERROR, value: "IMSUM requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(x.value)}
            }
            if(t2 === ERROR) {
                return { type: ERROR, value: "IMSUM requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(y.value)}
            }
            const real = a+c;
            const img = b+d;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        IMSUM: (args,context) => {
            return args.reduce((p,i) => context.functions._IMSUM2([p,i],context));
        },
        IMTAN: ([{value}],context) => {
            // r = sin(2r) / cos(2r)+cosh(2i)
            // i = sinh(2i) / cos(2r)+cosh(2i)
            const {i,r,type,suffix} = context.functions._PARSECOMPLEX({value},context);
            if(type === ERROR) {
                return { type: ERROR, value: "IMCOS requires the complex number to be entered in the format 'R+I[ij]' where R and I are numbers, found "+ String(value)}
            }
            const q = Math.cos(2*r)+Math.cosh(2*i);
            const real = Math.sin(2*r)/q;
            const img = Math.sinh(2*i)/q;
            return { type: STRING, value: real+"+"+img+suffix, meta: { type: COMPLEX_NUMBER, r:real, i:img, suffix } };
        },
        INFO: ([{value}]) => {
            /*
            "directory": Path of the current directory or folder.
            "numfile": Number of active worksheets in the open workbooks.

            "origin": Returns the absolute cell reference of the top and leftmost cell visible in the window, based on the current scrolling position, as text prepended with "$A:". This value is intended for for Lotus 1-2-3 release 3.x compatibility. The actual value returned depends on the current reference style setting. Using D9 as an example, the return value would be:
            A1 reference style     "$A:$D$9".
            R1C1 reference style    "$A:R9C4"

            "osversion": Current operating system version, as text.

            "recalc": Current recalculation mode; returns "Automatic" or "Manual".

            "release": Version of Microsoft Excel, as text.

            "system": Name of the operating environment:
            Macintosh = "mac"
            Windows = "pcdos"
            */
            switch(value) {
                case "directory":
                    return { type: STRING, value: window.location+"" };
                case "numfile":
                    return { type: STRING, value: "To be implemented todo" };
                case "origin":
                    return { type: STRING, value: "$A: todo" };
                case "osversion":
                    return { type: STRING, value: navigator.oscpu };
                case "recalc":
                    return { type: STRING, value: "todo" };
                case "system":
                    return { type: STRING, value: navigator.platform };
                default:
                    return navigator[value] ? { type: STRING, value: navigator[value] } : { type: ERROR, value: "INFO expected a valid kind, but found "+String(value) };
            }
        },
        INTERCEPT: ([ys,xs],context) => context.functions["FORECAST.LINEAR"]([{value: 0, type: NUMBER},xs,ys],context),
        INTRATE: ([{value}]) => ({ type: NULL, value }), // todo, use fin lib
        IPMT: ([{value}]) => ({ type: NULL, value }), // todo, use fin lib
        IRR: ([{value}]) => ({ type: NULL, value }), // todo, use fin lib
        ISBLANK: ([{value,type}]) => ({ type: BOOLEAN, value: type === NULL && !value }),
        ISERR: ([{value,type}]) => ({ type: BOOLEAN, value: type === ERROR && value !== NAVALUE }), 
        ISERROR: ([{value,type}]) => ({ type: BOOLEAN, value: type === ERROR }), 
        ISEVEN: ([{value,type}]) => {
            if(type !== NUMBER) {
                return { type: ERROR, value:VVALUE };
            }
            return { type: BOOLEAN, value: Math.floor(value)%2===0 }
        },
        ISFORMULA: ([{formula}]) => ({ type: BOOLEAN, value: formula && formula[0] === "=" }),
        ISLOGICAL: ([{type}]) => ({ type: BOOLEAN, value: type === BOOLEAN }),
        ISNA: ([{value}]) => ({ type: BOOLEAN, value: value === NAVALUE }),
        ISNONTEXT: ([{type}]) => ({ type: BOOLEAN, value: type !== STRING }),
        ISNUMBER: ([{type}]) => ({ type: NUBOOLEANLL, value: type === NUMBER }),
        ISODD: ([{value,type}]) => {
            if(type !== NUMBER) {
                return { type: ERROR, value:VVALUE };
            }
            return { type: BOOLEAN, value: Math.floor(value)%2===1 }
        },
        ISREF: ([{type,meta}]) => ({ type: BOOLEAN, value: type !== ERROR && meta && meta.type === CELL }),
        ISTEXT: ([{type}]) => ({ type: BOOLEAN, value: type === STRING }),
        "ISO.CEILING": (args,context) => context.functions.CEILING(args,context),
        ISOWEEKNUM: ([a],context) => context.functions.WEEKNUM([a,{value:21,type:NUMBER}],context),
        ISPMT: ([{value:rate},{value:per},{value:nper},{value:pv}]) => {
            const vdecperperiod = pv/nper;
            const remaining = pv-per*vdecperperiod;
            return { type: NUMBER, value: remaining*rate, meta: { reduction_per_period: vdecperperiod, remaining_value: remaining } };
        },
        JIS: ([{value}]) => ({ type: STRING, value: value.split("").map(i =>
            i.charCodeAt(0) < 65248 ? String.fromCharCode(i.charCodeAt(0) + 65248) : i
        ).join("") }),
        KURT: (args,context,start={}) => {
            // algo from https://github.com/compute-io/kurtosis/blob/master/lib/index.js
            const [mean,M2,M3,M4,N] = args.reduce((p, v) => {
              if(p.type === ERROR) {
                  return p;
              }
              if(v.type === ERROR) {
                  return v;
              }
              const {value,type} = v;
              let [mean,M2,M3,M4,N] = p;
              if(type === LIST) {
                  const { meta,type:t,...rest } = context.functions.KURT(value,context,{mean,M2,M3,M4,N});
                if(t === ERROR) {
                    return { meta,type,...rest };
                }
                return [meta.mean,meta.M2,meta.M3,meta.M4,meta.N];
              }
              if(type === NUMBER) {
                N += 1;
                const delta = value - mean;
                const delta_n = delta / N;
                const delta_n2 = delta_n * delta_n;
                const term1 = delta * delta_n * (N-1);
                M4 += term1*delta_n2*(N*N - 3*N + 3) + 6*delta_n2*M2 - 4*delta_n*M3;
                M3 += term1*delta_n*(N-2) - 3*delta_n*M2;
                M2 += term1;
                mean += delta_n;
                return [mean,M2,M3,M4,N];
              }
              return [mean,M2,M3,M4,N];
          }, [start.mean||0,start.M2||0,start.M3||0,start.M4||0,start.N||0]);
          // Calculate the population excess kurtosis:
          const g = N*M4 / ( M2*M2 ) - 3;
          // Return the corrected sample excess kurtosis:
          const kurt = (N-1) / ( (N-2)*(N-3) ) * ( (N+1)*g + 6 );
          return { type: NUMBER, value: kurt, meta: { mean,M2,M3,M4,N } };
        },
        _LCM2: ([{value:x,type:t1},{value:y,type:t2}],context) => {
            if(t1 !== NUMBER || t2 !== NUMBER) {
                return { type: ERROR, value: VVALUE, meta: { error: "Both parameters of _LCM2 need to be numeric, found "+String(t1)+"/"+String(t2) } };
            }
            if(x < 0 || y < 0) {
                return { type: ERROR, value: NUMVALUE, meta: { error: "Both parameters of _LCM2 need to be >0, found "+String(x)+"/"+String(y) } };
            }
             return {
                 type: NUMBER,
                value: (!x || !y) ? 0 : Math.abs((x * y) / context.functions.GCD([{value:x},{value:y}], context).value)
             };
        },
        LCM: (args,context) => {
            return args.reduce((p,i) => context.functions._LCM2([p,i],context));
        },
        LEFT: ([{value:text},{value:num_chars}={value:1}]) => ({ type: STRING, value: text.substring(0,num_chars) }),
        LEFTB: ([{value:str},{value:lengthInBytes}={value:1}]) => {
            // idea from https://stackoverflow.com/questions/11200451/extract-substring-by-utf-8-byte-positions
            const encode_utf8 = s => unescape(encodeURIComponent(s));
            let resultStr = '', end = lengthInBytes - 1;
            for (let n = 0; 0 <= end; n++) {
              const ch = str.charCodeAt(n);
              end -= (ch < 128) ? 1 : encode_utf8(str[n]).length;
              resultStr += str[n];
            }
            return { type: STRING, value: resultStr };
        },
        LEN: ([{value}]) => ({ type: NUMBER, value: value.length }),
        LENB: ([{value}]) => ({ type: NUMBER, value: (new TextEncoder().encode(value)).length }),
        LINEST: ([{value}]) => ({ type: NULL, value }), // todo
        LN: ([{value}]) => ({ type: NUMBER, value: Math.log(value) }),
        LOG: ([{value},{value:base}={value:10}]) => ({ type: NUMBER, value: Math.log(value) / Math.log(base) }),
        LOG10: ([{value}]) => ({ type: NUMBER, value: Math.log10(value) }),
        LOGEST: ([{value}]) => ({ type: NULL, value }), // todo
        LOGINV: ([{value}]) => ({ type: NULL, value }), // todo
        "LOGNORM.DIST": ([{value}]) => ({ type: NULL, value }), // todo
        LOGNORMDIST: ([{value}]) => ({ type: NULL, value }), // todo
        "LOGNORM.INV": ([{value}]) => ({ type: NULL, value }), // todo
        LOOKUP: ([{value:lookup_value,type:t1},{value:lookup_vector,type},{value:result_vector}={}],context) =>  {
            if(type === LIST) {
                // VECTOR FORM
                const idx = lookup_vector.findIndex(({value,type:t2}) =>  lookup_value == value ||
                    (t1 === STRING && t2 === STRING && lookup_value.toLowerCase() === value.toLowerCase())
                );
                if(idx) {
                    return result_vector ? result_vector[idx] : lookup_vector[idx];
                }
                // Range lookup: Return last values of values that are smaller than criteria
                const searchr = [].concat(lookup_vector);
                const { _GREATER } = context.functions;
                let item = { type: ERROR, value: NAVALUE };
                while(searchr.length) {
                    if(_GREATER(searchr[0].value, lookup_value)) {
                        return item;
                    }
                    const idx = lookup_vector.length - searchr.length;// 0, 1, 2, 3, ....
                    item = (result_vector||lookup_vector)[idx];
                    searchr.shift();
                }
                return item;
            }
            if(type === MATRIX) {
                // ARRAY FORM
                // If array covers an area that is wider than it is tall -> HLOOKUP
                // If an array is square or is taller than it is wide ->  VLOOKUP
                const f = lookup_vector.length < lookup_vector[0].length ? context.functions.HLOOKUP : context.functions.VLOOKUP;
                const n = lookup_vector.length < lookup_vector[0].length ? lookup_vector.length-1 : lookup_vector[0].length-1;
                return f([{value:lookup_value,type:t1},{value:lookup_vector,type},{value:n,type:NUMBER}],context);
            }
            return { type: ERROR, value: "Expected LOOKUP's lookup_vector to be LIST or MATRIX, but found "+String(type) };
        },
        MAXA: (allargs,context) => {
            if(allargs.length === 0) {
                return { type: NUMBER, value: 0 };
            }
            const result = allargs.reduce((max, { value, type }) => {
              switch(type) {
                case STRING:
                case NULL:
                case ERROR:
                  return max;
                case DATE:
                case BOOLEAN:
                case NUMBER:
                  return max < (+value) ? (+value) : max;
                case LIST:
                  const {value:v} = context.functions.MAXA(value,context);
                  return max < v? v: max;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MAXA");
             }
           }, -Infinity);
           return { type: NUMBER, value: result };
        },
        _MULTI_IFS: (args, context) => {
            if(args.length < 2) {
                throw new Error("Excepted 'criteria_range1, criteria1', but found "+(args.length?"'criteria_range1'":"no arguments"));
            }
            if(args.length % 2) { // if 1
                throw new Error("Wrong number of arguments, excepted 'criteria_range1, criteria1, [criteria_range2, criteria2]...', but found "+
                args.map((i, idx) => idx%2?"criteria"+Math.ceil((idx+1)/2):"criteria_range"+Math.ceil((idx+1)/2)).join(", "));
            }
            const [ranges, criteria] = args.reduce(([l1,l2],arg,idx) => 
                idx%2?[l1,[...l2, arg]]:[[...l1, arg], l2], // sort into 2 lists, so that [a,1,b,2,c,3]->[[a,b,c],[1,2,3]]
            [[],[]]);
            if(!ranges.every((i,idx,arr) => i.length === arr[0].length)) {
                throw new Error("All defined ranges need to have the same length");
            }
            
            const cfunctions = criteria.map(({value:criterium,type}) => {
              return context.functions._CRITMATCHER([{value:criterium,type}], context);
            });
            return { type: LIST, value: ranges[0].value.map((_, idx) => // pick any range, they're all same length
               ranges.every(({value:r},jdx) => cfunctions[jdx](r[idx]))
            ) }; // returns LIST of [true,false,true,true,...] to filter with
            // todo: re-visit countifs and use this there
        },
        MAXIFS: ([{value:resultv},...args], context) => {
            const {value:bl} = context.functions._MULTI_IFS(args,context);
            const filtered = resultv.filter((__,idx) => bl[idx]);
            return context.functions.MAX(filtered,context);
        },
        MDETERM: ([{value,type}]) => {
            if(type !== MATRIX) {
                return { type: ERROR, value: "MDETERM expectes its first argument to be a MATRIX, but found "+String(type) }
            }
            const globalLength = value.length;
            if(value.some(i => i.length !== globalLength)) {
                return { type: ERROR, value: VVALUE, meta: { error: "MDETERM expectes its first argument to be a square MATRIX of size NxN, but found the matrix not to be squared" } }
            }
            let nonNumber;
            const hasNonNumber = value.some(i => {
                nonNumber = i.find(({type}) => type !== NUMBER);
                return nonNumber;
            });
            if(hasNonNumber) {
                return { type: ERROR, value: VVALUE, meta: { error: "MDETERM expectes all elements of the MATRIX to be of type NUMBER, but found "+String(nonNumber.value)+" ("+String(nonNumber.type)+")" } }
            }
            // todo: Use more efficient algo from lib
            const det = M => {
                if (M.length==2) {
                    return (M[0][0].value*M[1][1].value)-(M[0][1].value*M[1][0].value);
                }
                return M.reduce((p, __, idx) => {
                    const sum = Math.pow(-1,idx)*M[0][idx].value*det(deleteRowAndColumn(M,idx));                return p + sum;
                }, 0);
            };
            const deleteRowAndColumn = (M,index) =>  {
                const temp = M.map(i => i.slice(0));
                temp.splice(0,1); 
                temp.forEach(i => i.splice(index,1));
                return temp;
            };
            return {type:NUMBER, value:det(value)};
        },
        MDURATION: ([{value}]) => ({ type: NULL, value }), // todo from fin lib
        MEDIAN: (args,context,w1=1,w2=1) => {
            const { value:count } = context.functions._CELL_COUNTA(args, context);
            const list = args.reduce((p, a) => {
                switch(a.type) {
                  case NUMBER:
                      return [...p,a];
                  case NULL:
                  case DATE:
                  case STRING:
                  case ERROR:
                  case BOOLEAN:
                    return p;
                  case LIST:
                      const {meta: {list}} = context.functions.MEDIAN(a.value,context);
                      return p.concat(list);
                  default:
                    throw new Error("Disallowed value "+String(a.value)+" of type "+String(a.type)+" found in MEDIAN");
               }
            }, []);
            const sorted = list.sort(({value:a},{value:b}) => a-b);
            const middle = count / 2;
            const result = count%2 ? sorted[Math.floor(middle)] : {
                ...sorted[Math.floor(middle)],
                value: (sorted[middle].value*w1 + sorted[middle-1].value*w2)/2
            };
            return { ...result, meta: { list, even: !(count%2), odd: !!(count%2), middle: count%2 ? Math.floor(middle) : middle+.5 } };
        },
        MID: ([{value:text},{value:startnum},{value:num_chars}={value:1}]) => ({ type: STRING, value: text.substring(startnum-1,startnum+num_chars-1) }),
        MIDB: ([{value:text},{value:startnum},{value:lengthInBytes}={value:1}]) => {
            const str = text.substring(startnum-1);
            // idea from https://stackoverflow.com/questions/11200451/extract-substring-by-utf-8-byte-positions
            const encode_utf8 = s => unescape(encodeURIComponent(s));
            let resultStr = '', end = lengthInBytes - 1;
            for (let n = 0; 0 <= end; n++) {
              const ch = str.charCodeAt(n);
              end -= (ch < 128) ? 1 : encode_utf8(str[n]).length;
              resultStr += str[n];
            }
            return { type: STRING, value: resultStr };
        },
        MINIFS: ([{value:resultv},...args], context) => {
            const {value:bl} = context.functions._MULTI_IFS(args,context);
            const filtered = resultv.filter((__,idx) => bl[idx]);
            return context.functions.MIN(filtered,context);
        },
        MINA: (allargs,context) => {
            if(allargs.length === 0) {
                return { type: NUMBER, value: 0 };
            }
            const result = allargs.reduce((min, { value, type }) => {
              switch(type) {
                case STRING:
                case NULL:
                case ERROR:
                  return min;
                case DATE:
                case BOOLEAN:
                case NUMBER:
                  return min > (+value) ? (+value) : min;
                case LIST:
                  const {value:v} = context.functions.MINA(value,context);
                  return min > v? v: min;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MINA");
             }
           }, Infinity);
           return { type: NUMBER, value: result };
        },
        MINVERSE: ([{value:M,type}]) => {
            // todo: use more efficient algo from lib
            if(type !== MATRIX) {
                return {
                  type: ERROR,
                  value: VVALUE,
                  meta:{error:"MINVERSE must be called with one argument of type MATRIX, but found "+String(M)+" ("+String(type)+")"}
                };
            }
            if(M.some(i => i.length !== M.length)) {
                return {
                  type: ERROR,
                  value: VVALUE,
                  meta:{error:"MINVERSE must be called with a sqare MATRIX, but found non-sqare MATRIX"}
                };
            }
            // from http://blog.acipo.com/matrix-inversion-in-javascript/
            let i = 0,
                ii = 0,
                j = 0,
                dim = M.length,
                e = 0;
            let I = [],
                C = [];
            // Init, including identity
            for (i = 0; i < dim; i += 1) {
                I[I.length] = [];
                C[C.length] = [];
                for (j = 0; j < dim; j += 1) {
                    if (i === j) {
                        I[i][j] = 1;
                    } else {
                        I[i][j] = 0;
                    }
                    if (M[i][j].type !== NUMBER) {
                        return {
                            type: ERROR,
                            value: VVALUE,
                            meta: {error:"MINVERSE's value at " + String(i) + "/" + String(j) + " is expected to be of type NUMBER, but found " + String(M[i][j].value) + " (" + String(M[i][j].type) + ")"}
                        }
                    }
                    C[i][j] = M[i][j].value;
                }
            }
            // do the thing
            for (i = 0; i < dim; i += 1) {
                e = C[i][i];
                if (e === 0) {
                    for (ii = i + 1; ii < dim; ii += 1) {
                        if (C[ii][i] !== 0) {
                            for (j = 0; j < dim; j++) {
                                e = C[i][j];
                                C[i][j] = C[ii][j];
                                C[ii][j] = e;
                                e = I[i][j];
                                I[i][j] = I[ii][j];
                                I[ii][j] = e;
                            }
                            break;
                        }
                    }
                    e = C[i][i];
                    if (e === 0) {
                        return {
                            type: ERROR,
                            value: NUMVALUE,
                            meta: {
                                error: "No inverse found!"
                            }
                        };
                    }
                }
                for (j = 0; j < dim; j++) {
                    C[i][j] = C[i][j] / e;
                    I[i][j] = I[i][j] / e;
                }
                for (ii = 0; ii < dim; ii++) {
                    if (ii === i) {
                        continue;
                    }
                    e = C[ii][i];
                    for (j = 0; j < dim; j++) {
                        C[ii][j] -= e * C[i][j];
                        I[ii][j] -= e * I[i][j];
                    }
                }
            }
            const IO = I.map(u => u.map(value => ({
                type: NUMBER,
                value
            })));
            return {
                type: MATRIX,
                value: IO
            };
        },
        MIRR: ([{value}]) => ({ type: NULL, value }),// todo use fin lib
        MMULT: ([{value:b,type:t1},{value:c,type:t2}]) => {
            // todo: use more efficient algo from lib
            if(t1 !== MATRIX) {
                return {
                  type: ERROR,
                  value: VVALUE,
                  meta:{error:"MMULT must be called with one argument of type MATRIX, but found "+String(b)+" ("+String(t1)+")"}
                };
            }
            if(t2 !== MATRIX) {
                return {
                  type: ERROR,
                  value: VVALUE,
                  meta:{error:"MMULT must be called with one argument of type MATRIX, but found "+String(c)+" ("+String(t2)+")"}
                };
            }
            if(b.some(i => i.length !== c.length)) {
                const l1 = c[0].length + "x" + c.length;
                const l2 = b[0].length + "x" + b.length;
                return {
                  type: ERROR,
                  value: VVALUE,
                  meta:{error:"MMULT must be called with two MATRIXs of NxK and KxM, but found "+String(l1)+" and "+String(l2)}
                };
            }
            // a[i,j] = sum[0..k..n](b[i,k]*c[k,j])
            const a = [];
            const k = c.length;
            for(let i = 0; i < b[0].length; i++) {
              a[i] = [];
              for(let j = 0; j < c.length; j++) {
                  let sum = 0;
                for(let t = 0; t < k; t++) {
                    const {value:x,type:xt} = b[i][t];
                    if(xt !== NUMBER) {
                        return {
                          type: ERROR,
                          value: VVALUE,
                          meta:{error:"MATRIX b supplied to MMULT expected to contain only numeric arguments, but found "+String(x)+" ("+String(xt)+") at "+String(i)+"/"+String(t)}
                        };
                    }
                    const {value:y,type:yt} = c[t][j];
                    if(yt !== NUMBER) {
                        return {
                          type: ERROR,
                          value: VVALUE,
                          meta:{error:"MATRIX c supplied to MMULT expected to contain only numeric arguments, but found "+String(y)+" ("+String(yt)+") at "+String(t)+"/"+String(j)}
                        };
                    }
                    sum += x*y;
                  }
                a[i][j] = { type: NUMBER, value: sum };
              }
            }
            return { type: MATRIX, value: a };
        },
        _MODE_INTERNAL_COUNT: Symbol("_MODE_INTERNAL_COUNT"),
        MODE: (args,context) => {
            const s = context.functions._MODE_INTERNAL_COUNT;
            const counts = args.reduce((p, a) => {
                const {type,value} = a;
                switch(type) {
                  case NUMBER:
                      return { ...p, [value]: [(p[value] ? p[value][0] : 0) + 1, a] };
                  case NULL:
                  case DATE:
                  case STRING:
                  case ERROR:
                  case BOOLEAN:
                    return p;
                  case LIST:
                      const {meta} = context.functions.MEDIAN(value,context);
                      const counts = meta[s];
                      const c = Object.assign({}, p);
                      Object.keys(counts).forEach(k => {
                          const [sum, obj] = counts[k];
                        const esum = c[k] && c[k][0];
                          c[k] = [(esum || 0) + sum, obj];
                      });
                      return c;
                  default:
                    throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MEDIAN");
               }
            }, []);
            const sorted = Object.entries(counts).sort(([__,[a]],[___,[b]]) => b-a);
            const [[key, [sum, obj]]] = sorted;
            const m = new Map(Object.values(counts).map(([v,k]) => [k,v]));
            return { ...obj, meta: { [s]: counts, counts: m, max: sum } };
        },
        "MODE.MULT": (args,context) => {
            const {meta} = context.functions.MODE(args,context);
            const {counts,max} = meta;
            const rr = Array.from(counts).filter(([__,c]) => c===max).map(([v]) => v);
            return { type: ARGUMENTS, value: rr, meta };
        }, 
        "MODE.SNGL": (args,context) => {
            const a = context.functions.MODE(args,context);
            const {meta:{max}} = a;
            if(max < 2) {
                return { type: ERROR, value: NAVALUE, meta: { result: a, error: "MODE.SNGL expected duplicate values to exists, but found a max-count of "+String(max) } };
            }
            return a;
        },
        MULTINOMIAL: (allargs,_context) => {
            const [sum,product] = allargs.reduce(([sum,product], { value, type }) => {
              switch(type) {
                  case NULL:
                case ERROR:
                case BOOLEAN:
                case STRING:
                    return [sum,product];
                case NUMBER:
                case DATE:
                  const fac = _context.functions._FACTORIAL([{value}],_context);
                  return [sum+value,product*fac];
                case LIST:
                    const {meta:{sum:s,product:p}} = _context.functions.MULTINOMIAL(value, _context);
                      return [sum+s,product*p];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MULTINOMIAL");
              }
          }, [0,1]);
          const fact = _context.functions._FACTORIAL([{value:sum}],_context);
          return { type: NUMBER, value: fact/product, meta: { sum,product } };
        },
        MUNIT: ([{type,value}]) => {
            // matrix identity
            if(type !== NUMBER) {
                return {type: ERROR, value: VVALUE, meta: {error: "MUNIT expected its argument to be NUMBER, but found "+String(value)+" ("+String(type)+")"}}
            }
            const t = Math.floor(value);
            const a = [];
            for(let i = 0; i < t; i++) {
                a[i]=[];
              for(let j = 0; j < t; j++) {
                a[i][j] = { type: NUMBER, value: +(j===i) };
              }
            }
            return { type: MATRIX, value: a, meta: { dimension: t } };
        },
        N: ([a]) => {
            const {type,value} = a;
            switch(type) {
                case NUMBER:
                case ERROR:
                    return a;
                case BOOLEAN:
                    return { type: NUMBER, value: +value };
                case DATE:
                    return { type: NUMBER, value: value.getTime() };
                default:
                  return { type: NUMBER, value: 0 };
              }
        
        },
        NA: () => ({ type: ERROR, value: NAVALUE  }),
        "NEGBINOM.DIST": ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NEGBINOMDIST: ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NOMINAL: ([{value:eff},{value:npery}]) => {
            // eff = (1+Nom_rate/npery)**npery - 1
            // (eff + 1)**(1/npery) = 1+Nom_rate/npery
            // ((eff + 1)**(1/npery) - 1) * npery = nom_rate
            const nom_rate = ((eff + 1)**(1/npery) - 1) * npery;
            return { type: NUMBER, value: nom_rate };
        },
        "NORM.DIST": ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NORMDIST: ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NORMINV: ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        "NORM.INV": ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        "NORM.S.DIST": ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NORMSDIST: ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        "NORM.S.INV": ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NORMSINV: ([{value}]) => ({ type: NULL, value }), // todo: use math lib
        NPER: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        NPV: ([{value:rate},...args],context,startIdx = 1) => {
            // sum(value[i] / (1+rate)**i)
            const [sum,sidx] = args.reduce(([sum,sidx],{type,value}) => {
                switch(type) {
                  case NUMBER:
                      return [sum + ( value / (1+rate)**sidx ), sidx + 1];
                  case NULL:
                  case DATE:
                  case STRING:
                  case ERROR:
                  case BOOLEAN:
                    return [sum,sidx];
                  case LIST:
                      const {meta:{sum:s,sidx:si}} = context.functions.NPV([{value:rate},...value],context,sidx);
                      return [sum + s, si];
                  default:
                    throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in MEDIAN");
               }
            }, [0,startIdx]);
            
            return { type: NUMBER, value: sum, meta: { sum,sidx } };
        },
        NUMBERVALUE: ([{value:text},{value:decimal}={},{value:group}={}]) => {
            const ctext = text.replace(/[ %\t\n\r]/g,"");
            if(ctext === "") {
                return { type: NUMBER, value: 0 };
            }
            const [dec] = decimal || Intl.NumberFormat()
                    .formatToParts(1.1)
                    .find(part => part.type === 'decimal')
                    .value;
            const [gr] = group || Intl.NumberFormat()
                    .formatToParts(10000000)
                    .find(part => part.type === 'group')
                    .value;
            const [percents] = text.match(/(%)*$/);
            const [inte,deci="",e] = ctext.split(dec);
            if(e) {
                return { type: ERROR, value: VVALUE, meta: {error: "decimal seperator used more than once in NUMBERVALUE's text-argument; only one usage of "+String(dec)+" is allowed"} };
            }
            if(deci.indexOf(gr) > -1) {
                return { type: ERROR, value: VVALUE, meta: {error: "group seperator must not be used in NUMBERVALUE's text-argument's *decimal*-part; usage of "+String(gr)+" is only allowed in its integer part"} };
            }
            const cinte = inte.split(gr).join(""); // avoids constructing regex
            const reg = /[^0-9+-]/;
            if(reg.test(cinte) || reg.test(deci)) {
                const ch = cinte.match(reg) || deci.match(reg);
                return { type: ERROR, value: VVALUE, meta: {error: "NUMBERVALUE's text-argument must not include any other signs but 0-9, +, -, "+String(dec)+", "+String(gr)+", % and ' ' (space), but found "+String(ch[0])} };
            }
            const number = parseFloat(cinte+"."+deci) / Math.pow(100, percents.length);
            return { type: NUMBER, value: number, meta: { percents: percents.length, decimal: dec, group: gr } };
        },
        OCT2BIN: ([{value},{value:dec}={value:0}]) =>
            ({ type: STRING, value: parseInt(value,8).toString(2).padStart(dec,"0") }),
        OCT2DEC: ([{value},{value:dec}={value:0}]) =>
            ({ type: NUMBER, value: parseInt(value,8) }),
        OCT2HEX: ([{value},{value:dec}={value:0}]) =>
            ({ type: STRING, value: parseInt(value,8).toString(16).padStart(dec,"0") }),
        ODDFPRICE: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        ODDFYIELD: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        ODDLPRICE: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        ODDLYIELD: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        PDURATION: ([{value:rate},{value:pv},{value:fv}]) => {
            // (log(fv) - log(pv)) / log(1+rate)
            const r = (Math.log(fv) - Math.log(pv)) / Math.log(1+rate);
            return { type: NUMBER, value: r };
        },
        PEARSON: ([{value:a,type:t1},{value:b,type:t2}],_context) => {
            if(t1 !== LIST || t2 !== LIST) {
                return {type:ERROR, value: "PEARSON's arguments must be LISTs, but found "+String(a)+" ("+String(t1)+") / "+String(b)+" ("+String(t2)+")"};
            }
            if(a.length !== b.length) {
                return {type:ERROR, value: "PEARSON's arguments must have the same length"};
            }
            // r = sum((x-xbar)*(y-ybar)) / sqrt(sum((x-xbar)**2) * sum((y-ybar)**2))
            // r = u / sqrt( u, k )
            const {value:avga} = _context.functions.AVERAGE(a,_context);
            const {value:avgb} = _context.functions.AVERAGE(b,_context);
            const [u,h,k] = a.reduce(([s1,s2,s3], {value:x},idx) => {
                const {value:y} = b[idx];
                return [
                    s1+(x-avga)*(y-avgb),
                    s2+(x-avga)*(x-avga),
                    s3+(y-avgb)*(y-avgb)
                ];
            }, [0,0,0]);
            return { value: u / Math.sqrt(h * k), type: NUMBER };
        },
        "PERCENTILE.EXC": ([{value:arr},{value:k}]) => {
            const sortedarr = arr.sort(({value:a},{value:b}) => a-b);
            const idx = k * (arr.length + 1);
            const idxx = Math.floor(idx);
            if(idxx <= 0 || idxx >= arr.length) {
                return { type: ERROR, value: NAVALUE, meta: { error: "percentile out of range", idxx }  };
            }
            const r = idx % 1 !== 0 ? // not whole number
              sortedarr[Math.ceil(idx)-1].value :
              (sortedarr[idx-1].value + sortedarr[idx].value) / 2;
            return { type: NUMBER, value: idx, meta: { idxx, idx, sorted: sortedarr, percentile: r } };
        },
        "PERCENTILE.INC": ([{value:arr},{value:k}]) => {
            const sortedarr = arr.sort(({value:a},{value:b}) => a-b);
            const idx = k*(arr.length-1)+1;
            const idxx = Math.floor(idx);
            if(idxx <= 0 || idxx > arr.length) {
                return { type: ERROR, value: NAVALUE, meta: { error: "percentile out of range", idxx }  };
            }
            return { type: NUMBER, value: idx, meta: { idxx, idx, sorted: sortedarr } };
        },
        PERCENTILE: (args,context) => context.functions["PERCENTILE.INC"](args,context),
        "PERCENTRANK.EXC": ([{value:arr},{value:x},{value:sig}={value:3}],context) => {
            const sortedarr = arr.sort(({value:a},{value:b}) => a-b);//.slice(1,-1)
            if(sortedarr.some(({value:i}) => i === x)) {
                // inclusive -->> '<=' and '>='
                const lt = sortedarr.filter(({value:i}) => i<=x).length;
                const gt = sortedarr.filter(({value:i}) => i>=x).length;
                return { type: NUMBER, value: lt / (lt + gt), meta: { lt,gt,sorted: sortedarr } };
            }
            const ii = sortedarr.findIndex(({value:i}) => i>x);
            const P1 = (ii + 1) / (sortedarr.length + 1);
            const V1 = sortedarr[ii].value;
            const P2 = (ii) / (sortedarr.length + 1);
            const V2 = sortedarr[(ii - 1)].value;
            const P = (x-V2)/(V1-V2);
            
            const r0 = context.functions.ROUND([{value:sig},{value:sig}],context);
            return { type: NUMBER, value: r0, meta: { /*sorted: sortedarr,*/ P1, P2, V1, V2, P } };
        },
        "PERCENTRANK.INC": (args,context) => context.functions.PERCENTRANK(args,context),
        PERCENTRANK: ([{value:arr},{value:x},{value:sig}={value:3}],context) => {
            const sortedarr = arr.sort(({value:a},{value:b}) => a-b); //.slice(0,-1)
            /*
            Value present
            Count1 = count of values in Array below than a Value
            Count2 = count of values in Array above than a Value
            PercentRank = Count1 / (Count1 + Count2)

            Value not present
            PercentRank1 = PercentRank of the minimal value Value1 in Array not less than a Value
            PercentRank2 = PercentRank of the maximal value Value2 in Array not greater than a Value
            PercentRank = (PercentRank1 * (Value1 - Value) + PercentRank2 * (Value - Value2)) / (Value1 - Value2)           
            */
            if(sortedarr.some(({value:i}) => i === x)) {
                const lt = sortedarr.filter(({value:i}) => i<x).length;
                const gt = sortedarr.filter(({value:i}) => i>x).length;
                return { type: NUMBER, value: lt / (lt + gt), meta: { lt,gt,sorted: sortedarr } };
            }
            const ii = sortedarr.findIndex(({value:i}) => i>x);
            const P1 = ii / (sortedarr.length - 1);
            const V1 = sortedarr[ii].value;
            const P2 = (ii - 1) / (sortedarr.length - 1);
            const V2 = sortedarr[(ii - 1)].value;
            const P = (x-V2)/(V1-V2);
            
            const r0 = context.functions.ROUND([{value:sig},{value:sig}],context);
            return { type: NUMBER, value: r0, meta: { sorted: sortedarr, P1, P2, V1, V2, P } };
        },
        PERMUT: ([{value:n},{value:k}],context) => {
            // n!/(n-k)!
            const o = context.functions._FACTORIAL([{value:n}],context);
            const u = context.functions._FACTORIAL([{value:(n-k)}],context);
            return { type: NUMBER, value: o/u }
        },
        PERMUTATIONA: ([{value:t},{value:c}]) => ({ type: NUMBER, value: Math.pow(t,c) }),
        PHI: ([{value}]) => ({ type: NULL, value }), // todo: use stats lib
        PHONETIC: ([{value}]) => ({ type: NULL, value }), //  ah, no, this will require huge dictionaries
        PI: () => ({ type: NUMBER, value: Math.PI }),
        PMT: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        "POISSON.DIST": ([{value}]) => ({ type: NULL, value }), // todo: use stats lib
        POISSON: ([{value}]) => ({ type: NULL, value }), // todo: use stats lib
        POWER: ([{value:n},{value:p}]) => ({ type: NUMBER, value: Math.pow(n,p) }),
        PPMT: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        PRICE: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        PRICEDISC: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        PRICEMAT: ([{value}]) => ({ type: NULL, value }), // todo: use fin lib
        PROB: ([{value:x_range,type:t1}, {value:prob_range,type:t2}, {value:lower_limit}, {value:upper_limit}={}]) => {
            if(t1 !== LIST || t2 !== LIST) {
                return { type: ERROR, value: "Expected PROB's first two arguments to be LISTs, but found "+String(t1)+"/"+String(t2) };
            }
            /*
            If any value in prob_range ≤ 0 or if any value in prob_range > 1, PROB returns the #NUM! error value.
            If the sum of the values in prob_range is not equal to 1, PROB returns the #NUM! error value.
            If upper_limit is omitted, PROB returns the probability of being equal to lower_limit.
            If x_range and prob_range contain a different number of data points, PROB returns the #N/A error value.
            */
            const outofrangeprob = prob_range.find(({value:v}) => v<=0 || v>1);
            if(outofrangeprob) {
                return { type: ERROR, value: NUMVALUE, meta: { error: "PROB's probabilities must be >0 and <= 1, but found "+String(outofrangeprob.value)+" ("+String(outofrangeprob.type)+")" } }
            }
            const probsum = prob_range.reduce((s,{value:v}) => s+v,0);
            if(probsum !== 1) {
                return { type: ERROR, value: NUMVALUE, meta: { error: "PROB's probabilities must add up to 1, but only add up to "+String(probsum) } }
            }
            if(x_range.length !== prob_range.length) {
                return { type: ERROR, value: NAVALUE, meta: { error: "PROB's x-list and probabilities must have the same length, but found "+String(x_range.length)+"/"+String(prob_range.length) } }
            }
            
            if(upper_limit != null) {
                const pmap = x_range.map(({value},idx) => ({value,p:prob_range[idx]}));
                const valuesInRange = pmap.filter(({value:v}) => v>=lower_limit&&v<=upper_limit);
                const r = valuesInRange.reduce((p,{p:{value:v}}) => p+v, 0);
                return { type: NUMBER, value: r, meta: { valuesInRange, mode: "RANGE" } };
            }
            // find lower_limit
            const idx = x_range.findIndex(({value}) => value===lower_limit);
            return { ...prob_range[idx], meta: { idx, mode: "MATCH" } };
        },
        PRODUCT: (allargs, _context) => {
          const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                case BOOLEAN:
                    return sum;
                case NUMBER:
                case DATE:
                  return sum * value;
                case LIST:
                    const {value:product} = _context.functions.PRODUCT(value, _context);
                      return sum * product;
                case STRING:
                    const v2 =parseFloat(value);
                    return Number.isNaN(v2) ? sum : sum * v2; 
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in SUM");
              }
          }, 0);
          return { type: NUMBER, value: result };
        },
        PV: ([{value}]) => ({ type: NULL, value }), // todo: use fin-lib
        QUARTILE: (args,context) => context.functions["QUARTILE.INC"](args,context),
        "QUARTILE.EXC": ([{value:arr},{value:qrt}],context) => {
            switch(qrt) {
                case 0:
                    return context.functions.MIN(arr,context);
                case 2:
                    return context.functions.MEDIAN(arr,context);
                case 4:
                    return context.functions.MAX(arr,context);
                case 1:
                    return context.functions.MEDIAN(arr.slice(0,Math.floor(arr.length/2)),context,1.5,0.5);
                case 3:
                    return context.functions.MEDIAN(arr.slice(Math.ceil(arr.length/2)),context,0.5,1.5);
                default:
                    return { type: ERROR, value: NUMVALUE, meta: { error: "Invalid quartile "+String(qrt)+" in QUARTILE.EXC, must be <=0 and >=4" } }
            }
        },
        "QUARTILE.INC": ([{value:arr},{value:qrt}],context) => {
            switch(qrt) {
                case 0:
                    return context.functions.MIN(arr,context);
                case 2:
                    return context.functions.MEDIAN(arr,context);
                case 4:
                    return context.functions.MAX(arr,context);
                case 1:
                    return context.functions.MEDIAN(arr.slice(0,Math.ceil(arr.length/2)),context,1.5,0.5);
                case 3:
                    return context.functions.MEDIAN(arr.slice(Math.floor(arr.length/2)),context,0.5,1.5);
                default:
                    return { type: ERROR, value: NUMVALUE, meta: { error: "Invalid quartile "+String(qrt)+" in QUARTILE.INC, must be <=0 and >=4" } }
            }
        },
        QUOTIENT: ([{value:n},{value:q}]) => ({ type: NUMBER, value: n < 0 ? Math.ceil(n/q) : Math.floor(n/q) }),
        RADIANS: ([{value:d}]) => ({ type: NUMBER, value: d / 180 * Math.PI }),
        RANDARRAY: ([
            {value:rows}={value:1},
            {value:columns}={value:1},
            min={value:0},
            max={value:1},
            {value:whole_number}={value:false}
        ],context) => {
            if(min.value >= max.value) {
                return { type: ERROR, value: VVALUE, meta: { error: "RANDARRAY's min must be >= max, but found min "+String(min.value)+" >= max "+String(max.value) } }
            }
            const f = whole_number ? 
                () => context.functions.RANDBETWEEN([min,max],context) :
                () => ({ type: NUMBER, value: Math.random() * (max.value - min.value) + min.value });
            
            if(rows===1 && columns===1) {
                return f();
            }
            if(rows===1 || columns===1) {
                return { type: LIST, value: Array.from({ length: Math.max(rows,columns) }).map(f), rowspan: rows, colspan: columns };
            }
            return { type: MATRIX, value: Array.from({ length: rows })
                .map(() => Array.from({ length: columns }).map(f)), rowspan: rows, colspan: columns };
        },
        _RANKG: ([{value:search},{value:arr},{value:order}={value:0}],context) => {
            const ref = arr.sort(({value:a},{value:b}) => order ? a-b : b-a);
            const vs = ref
                .map((i,idx,arr) => ({...i, idx: idx+1 }))
                .filter(({value:v}) => v===search)
                .map(({idx})=> ({value:idx,type:NUMBER}));
            return { type: LIST, value: vs };
        },
        "RANK.AVG": (args,context) => {
            const {value:vs} = context.functions._RANKG(args,context);
            if(!vs.length) {
                return {type: ERROR, value: NAVALUE , meta: {error: "RANK.AVG search value was not found in ref"}}
            }
            return context.functions.AVERAGE(vs,context);
        },
        "RANK.EQ": (args,context) => {
            const {value:[r]} = context.functions._RANKG(args,context);
            if(!r) {
                return {type: ERROR, value: NAVALUE , meta: {error: "RANK.AVG search value was not found in ref"}}
            }
            return r;
        },
        RANK: (args,context) => context.functions["RANK.EQ"](args,context),
        RATE: ([{value}]) => ({ type: NULL, value }), // todo: use fin-lib
        RECEIVED: ([{value}]) => ({ type: NULL, value }), // todo: use fin-lib
        "REGISTER.ID": ([{value}]) => ({ type: NULL, value }), // todo allow dynamic loading of functions into scope
        REPLACE: ([{value:text},{value:startn},{value:numch},{value:newtext}]) => {
            const r = text.substring(0,startn-1) + newtext + text.substring(startn+numch-1);
            return { type: STRING, value: r };
        },
        REPLACEB: ([text,startnum,bytes,{value:newtext}],context) => {
            const {value:search} = context.functions.LEFTB([text,bytes],context);
            const r = text.value.replace(search,newtext);
            return { type: STRING, value: r, meta: { search } };
        },
        REPT: ([{value:t},{value:n}]) => ({ type: STRING, value: Array.from({length:n}).fill(t).join("") }),
        RIGHT: ([{value:text},{value:num_chars}={value:1}]) =>
            ({ type: STRING, value: text.slice(-num_chars) }),
        RIGHTB: ([{value:str},{value:lengthInBytes}={value:1}]) => {
            // idea from https://stackoverflow.com/questions/11200451/extract-substring-by-utf-8-byte-positions
            const encode_utf8 = s => unescape(encodeURIComponent(s));
            let resultStr = '', end = lengthInBytes - 1;
            for (let n = 0; 0 <= end; n++) {
              const ch = str.charCodeAt(str.length-n-1);
              end -= (ch < 128) ? 1 : encode_utf8(str[str.length-n-1]).length;
              resultStr = str[str.length-n-1] + resultStr;
            }
            return { type: STRING, value: resultStr };
        },
        ROMAN: ([{value:arabic},{value:mode}={value:0}]) => {
            
            const modes = romannumeralmodes;
            // algo idea from https://www.baeldung.com/java-convert-roman-arabic
            const romanNumerals = Object.entries(modes.get(mode)).sort(([__,a],[___,b]) => b-a); // get a sorted version
            let i = 0;
            let sb = "";
            while ((arabic > 0) && (i < romanNumerals.length)) {
                const [roman,value] = romanNumerals[i];
                if (value <= arabic) {
                    sb += roman;
                    arabic -= value;
                } else {
                    i++;
                }
            }
            return { type: STRING, value: sb };
        },
        ROW: ([{value,type,meta={}}={}], ctx) => {
            if(!value) {
                return { type: NUMBER, value: ctx.currentcell.row+1 };
            }
            if(meta.type === CELL) {
                return { type: NUMBER, value: meta.row };
            }
            throw new Error("ROW's first argumnet must be a cell-reference (meta.type=CELL)! Found "+String(value)+" ("+String(type)+"/"+String(meta.type)+")"); // excel actually throws
        },
        ROWS: ([{value,type}]) => {
            if(type === LIST) {
                const {meta: {type:st,row:sc}={}} = value[0];
                const {meta: {type:lt,row:lc}={}} = value[value.length-1];
                if(st === CELL && lt === CELL) {
                    return { type: NUMBER, value: lc-sc+1 }
                }
                // case of inline list via {...}-Syntax
                return { type: NUMBER, value: value.length };
            }
            if(type === MATRIX) {
                return { type: NUMBER, value: value.length };
            }
            throw new Error("ROWS must be called with LIST or MATRIX. Found "+String(value)+" ("+String(type)+")");
        },
        RRI: ([{value:nper},{value:pv},{value:fv}]) => {
            const r = (fv/pv) ** (1/nper) - 1;
            return { type: NUMBER, value: r };
        },
        RSQ: (args,context) => {
            const a = context.functions.PEARSON(args,context);
            const {value,type,...rest} = a;
            return type === NUMBER ? {...a, value: value*value} : a;
        },
        RTD: ([{value:progID},{value:server},...topics]) => ({ type: NULL, value: "Not implemented" }),
        SEARCH: ([{value:find_text},{value:within_text},{value:start_num}={value:0}],context) => {
            const reg = context.functions._TOSEARCHSTRING([find_text,false,false],context);
            const idx = within_text.substring(start_num).search(reg);
            return { type: NUMBER, value: idx+1+start_num, meta: { reg } };
        },
        SEARCHB: ([{value:find_text},{value:within_text},{value:start_num}={}],context) => {
            const reg = context.functions._TOSEARCHSTRING([find_text,false,false],context);
            const idx = within_text.substring(start_num).search(reg) + 1;
            const r = (new TextEncoder().encode(within_text.substring(0,idx))).length;
            return { type: NUMBER, value: r };
        },
        SEC: ([{value}]) => ({ type: NUMBER, value: 1/ Math.cos(value) }),
        SECH: ([{value}]) => ({ type: NUMBER, value: 1/ Math.cosh(value) }),
        // rows,[columns],[start],[step]
        SEQUENCE: ([{value:rows},{value:columns}={value:1},{value:start}={value:1},{value:step}={value:1}]) => {
            const f = n => ({ type: NUMBER, value: start+n*step });
            if(rows===1 && columns===1) {
                return f(0);
            }
            if(rows===1 || columns===1) {
                return { type: LIST, value: Array.from({ length: Math.max(rows,columns) }).map((__,idx) => f(idx)), rowspan: rows, colspan: columns };
            }
            return { type: MATRIX, value: Array.from({ length: rows })
                .map((___,jdx) => Array.from({ length: columns }).map((__,idx) => f(idx*jdx))), rowspan: rows, colspan: columns };
        },
        SERIESSUM: ([{value:x},{value:n},{value:m},{value:a}],context) => {
            // i = 0..a.length
            // SUM( a[i] * x**(n+(i-1)*m) )
            const r = a.map(({value:v},idx) => v*x**(n+idx*m)).reduce((p,i) => p+i,0);
            return { type: NUMBER, value: r };
        },
        SHEET: () => ({ type: NUMBER, value: -1, meta: { error: "Sheets are not numbered" } }),
        SHEETS: () => ({ type: NUMBER, value: -1, meta: { error: "Sheets are not enumerable and can only be discovered" } }),
        SIGN: ([{value}]) => ({ type: NUMBER, value: Math.sign(value) }),
        SIN: ([{value}]) => ({ type: NUMBER, value: Math.sin(value) }),
        SINH: ([{value}]) => ({ type: NUMBER, value: Math.sinh(value) }),
        _SKEW: (allargs,context,xbar,s) => {
            // n / ((n-1)*(n-2)) * SUM(  ( (x[i]-xbar)/s )**3  )
            const [sum,count] = allargs.reduce(([sum,count], { value, type }) => {
              switch(type) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return [sum,count];
                case NUMBER:
                    const t = ((value-xbar)/s)**3;
                    return [sum+t,count+1];
                case LIST:
                    const { sum: ms, count: mc } = context.functions._SKEW(value, context, xbar, s).meta;
                    return [sum+ms, count + mc];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in _SKEW");
              }
          }, [0,0]);
          if(count < 3) {
              return { type: ERROR, value: DIV0, meta: { sum, count } };
          }
          const ft = count/(count-1)/(count-2);
          return { type: NUMBER, value: ft * sum, meta: { sum, count } };
        },
        _SKEWP: (allargs,context,xbar,s) => {
            // (1/n) * sum(  (x[i]-(xbar**3))/s  )
            const [sum,count] = allargs.reduce(([sum,count], { value, type }) => {
              switch(type) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return [sum,count];
                case NUMBER:
                    const t = ((value-xbar)/s)**3;
                    return [sum+t,count+1];
                case LIST:
                    const { sum: ms, count: mc } = context.functions._SKEWP(value, context, xbar, s).meta;
                    return [sum+ms, count + mc];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in _SKEW");
              }
          }, [0,0]);
          return { type: NUMBER, value: sum / count, meta: { sum, count } };
        },
        SKEW: (allargs,context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            const s = Math.sqrt(result/(ccount-1));
            return context.functions._SKEW(allargs, context,xbar,s);    },
        "SKEW.P": (allargs,context) => {
            // // (1/n) * sum(  (x[i]-xbar)**3/s  )
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            const s = Math.sqrt(result/ccount);
            return context.functions._SKEWP(allargs, context,xbar,s);
        },
        SLN: ([{value:cost},{value:salvage},{value:life}]) => ({ type: NUMBER, value: (cost-salvage)/life }),
        _SLOPE: ([{value:y},{value:x}],context,xbar,ybar) => {
            // sum( (x-xbar)*(y-ybar) ) / sum( (x-xbar)**2 )
            const [s1,s2] = x.reduce(([s1,s2], __, idx) => {
                const { value:xv, type:xt } = x[idx];
                const { value:yv, type:yt } = y[idx];
              switch(xt === yt ? xt : false) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return [sum,count];
                case NUMBER:
                    const a0 = (xv-xbar)*(yv-ybar);
                    const b0 = (xv-xbar)*(xv-xbar);
                    return [s1+a0,s2+b0];
                case LIST:
                    const { s1:a,s2:b } = context.functions._SLOPE([xv,yv], context, xbar,ybar).meta;
                    return [s1+a,s2+b];
                default:
                  throw new Error("Disallowed value "+String(xv)+" of type "+String(xt)+" found in SLOPE");
              }
              }, [0,0]);
            return { type: NUMBER, value: s1/s2, meta: { s1,s2 } };
        },
        SLOPE: (args,context) => {
            // sum( (x-xbar)*(y-ybar) ) / sum( (x-xbar)**2 )
            const [{value:y},{value:x}] = args;
            const {value:ybar} = context.functions.AVERAGE(y, context);
            const {value:xbar} = context.functions.AVERAGE(x, context);
            return context.functions._SLOPE(args,context,xbar,ybar);
        },
        SORT: ([{value:arr,type,...rest},{value:sortidx}={value:1},{value:order}={value:1},{value:bycol}={value:false}],context) => {
            // array -> type === LIST|MATRIX
            // [sortidx] -> row or col to sort by
            // [order] -> 1=default=asc | -1=des
            // [bycol] -> false=default=by row=top2bottom
            // ....
            if(type === LIST) {
                arr = [arr];
            }
            if(!bycol) {
                const sortby = arr[sortidx-1];
                if(sortidx>arr.length) {
                    return { type: ERROR, value: "Invalid sort_index encountered in SORT - the given MATRIX does not have such column" };
                }
                const sorted = arr.map(i => i
                    .map((i,idx) => ({...i,meta: Object.assign(i.meta||{},{oidx:idx})}))
                    .sort(({meta:{oidx:a}},{meta:{oidx:b}}) => {
                        return order * (sortby[a].value - sortby[b].value);
                    })
                );
                if(type === LIST) {
                    return Object.assign(rest,{type,value:sorted[0]})
                }
                return Object.assign(rest,{type,value:sorted});
            } 
            if(arr.some(i => i.length < sortidx)) {
              return { type: ERROR, value: "Invalid sort_index encountered in SORT - the given MATRIX does not have such column" };
            }
            const transposed = arr[0].map((col, idx) => arr.map(row => row[idx]));
            const sortby = transposed[sortidx-1];

            const sorted = transposed.map(i => i
            .map((i,idx) => ({...i,meta: Object.assign(i.meta||{},{oidx:idx})}))
            .sort(({meta:{oidx:a}},{meta:{oidx:b}}) => {
            return order * (sortby[a].value - sortby[b].value);
            })
            );
            const back = sorted[0].map((col, idx) => sorted.map(row => row[idx]));
            if(type === LIST) {
                return Object.assign(rest,{type,value:back.map(i => i[0])});
            }
            return Object.assign(rest,{type,value:back});
        },
        SORTBY: ([{value:arr,type,...rest},...criteria]) => {
            const sortby = criteria.map(({value:v}) => v).filter((__,idx) => !(idx%2));
            if(type !== LIST) {
                return {type: ERROR, value: "SORTBY expected a LIST, but found "+String(arr)+" ("+String(type)+")"};
            }
            if(sortby.length < 1) {
                return { type: ERROR, value: "SORTBY requires at least 1 criterium" };
            }
            const sorted = arr
            .map((i,idx) => ({...i,meta: Object.assign(i.meta||{},{oidx:idx})}))
            .sort(({meta:{oidx:a}},{meta:{oidx:b}}) => {
                for(let idx = 0; idx < sortby.length; idx++) {
                    const criterium = sortby[idx];
                    const order = criteria[idx*2+1] ? criteria[idx+1].value : 1;
                    const xy = order * (criterium[a].value - criterium[b].value);
                    if(xy) { // if not a tie (xy=0)
                        return xy; // return order
                    }
                    // else go to next criterium
                }
                return 0;
            });
             return Object.assign(rest,{type,value:sorted});
        },
        SQRT: ([{value}]) => value >=0 ? { type: NUMBER, value: Math.sqrt(value) } : { type: ERROR, value: NUMVALUE  },
        SQRTPI: ([{value}]) => value >=0 ? { type: NUMBER, value: Math.sqrt(value*Math.PI) } : { type: ERROR, value: NUMVALUE  },
        STANDARDIZE: ([{value:x},{value:mean},{value:s}]) => s >=0 ? { type: NUMBER, value: (x-mean)/s } : { type: ERROR, value: NUMVALUE, meta: { error: "STANDARDIZE's Standard_dev must be >= 0" } },
        _STDEV: (allargs, context, xbar) => {
            // todo: unclear when values are ignored vs when they throw vs when they count
          const [result,ccount] = allargs.reduce(([sum,count], { value, type }) => {
              switch(type) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return [sum, count];
                case NUMBER:
                    return [sum + (value-xbar)*(value-xbar),count+1];
                case LIST:
                    const { result, ccount } = context.functions._STDEV(value, context, xbar).meta;
                    return [sum+result, count+ccount ];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in AVERAGE");
              }
          }, [0,0]);
          return { type: NUMBER, value: result/ccount, meta: { result, ccount } };
        },
        _STDEVA: (allargs, context, xbar) => {
            // todo: unclear when values are ignored vs when they throw vs when they count
          const [result,ccount] = allargs.reduce(([sum,count], { value, type }) => {
              switch(type) {
                  case NULL:
                case ERROR:
                    return [sum, count];
                case BOOLEAN:
                    return [sum+(+value), count+1]
                case STRING:
                    const v2 = parseFloat(value);
                    if(Number.isNaN(v2)) {
                        throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in _STDEVA");
                    }
                    return [sum + v2, count+1]; 
                case NUMBER:
                    return [sum + (value-xbar)*(value-xbar),count+1];
                case LIST:
                    const { result, ccount } = context.functions._STDEVA(value, context, xbar).meta;
                    return [sum+result, count+ccount ];
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in _STDEVA");
              }
          }, [0,0]);
          return { type: NUMBER, value: result/ccount, meta: { result, ccount } };
        },
        STDEV: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            return { type: NUMBER, value: Math.sqrt(result/(ccount-1)), meta: { result, ccount } };
        },
        "STDEV.P": (allargs, context) => context.functions.STDEVP(allargs, context),
        "STDEV.S": (allargs, context) => context.functions.STDEV(allargs, context),
        STDEVA: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEVA(allargs, context, xbar).meta;
            return { type: NUMBER, value: Math.sqrt(result/(ccount-1)), meta: { result, ccount } };
        },
        STDEVP: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            return { type: NUMBER, value: Math.sqrt(result/ccount), meta: { result, ccount } };
        },
        STDEVPA: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEVA(allargs, context, xbar).meta;
            return { type: NUMBER, value: Math.sqrt(result/ccount), meta: { result, ccount } };
        },
        _STEYX: ([{value:y},{value:x}],context,xbar,ybar) => {
            // sum( (x-xbar)*(y-ybar) ) / sum( (x-xbar)**2 )
            const [s1,s2,s3,count] = x.reduce(([s1,s2,s3,count], __, idx) => {
                const { value:xv, type:xt } = x[idx];
                const { value:yv, type:yt } = y[idx];
              switch(xt === yt ? xt : false) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return [s1,s2,s3,count];
                case NUMBER:
                    const a0 = (xv-xbar)*(yv-ybar);
                    const b0 = (xv-xbar)*(xv-xbar);
                    const c0 = (yv-ybar)*(yv-ybar);
                    return [s1+a0,s2+b0,s3+c0,count+1];
                case LIST:
                    const { s1:a,s2:b, s3: c, count:u } = context.functions._STEYX([xv,yv], context, xbar,ybar).meta;
                    return [s1+a,s2+b,s3+c,count+u];
                default:
                  throw new Error("Disallowed value "+String(xv)+" of type "+String(xt)+" found in _STEYX");
              }
              }, [0,0,0,0]);
            const value = Math.sqrt(  1/(count-2) * (  s3 - s1*s1/s2  )  );
            return { type: NUMBER, value, meta: { s1,s2, s3, count } };
        },
        STEYX: (args,context) => {
            // sum( (x-xbar)*(y-ybar) ) / sum( (x-xbar)**2 )
            const [{value:y},{value:x}] = args;
            const {value:ybar} = context.functions.AVERAGE(y, context);
            const {value:xbar} = context.functions.AVERAGE(x, context);
           return context.functions._STEYX(args,context,xbar,ybar);
        },
        _FILTERTYPE: (allargs, context, ...types) => {
            const [{ key, recurse = [LIST], ignore = [], error = [], allow = [], subelement = (({value:v}) => v), subelementreverse = ((value,t) => ({...t,value})) }, ...ttypes] = types;
            const result = allargs.filter(t => {
                const type = key(t);
                if(allow.indexOf(type) > -1) return true;
                if(ignore.indexOf(type) > -1) return false;

                if(error.indexOf(type) > -1) {
                  const e = new Error("Disallowed type "+String(type)+" found in _FILTERTYPE");
                  e.object = t;
                }

                if(recurse.indexOf(type) > -1) {
                    return true; // we filter these by stuff inside the value
                }
                return allow.length === 0; // if there is a whitelist, all other values are disallowed by default
            }).map(t => {
                const type = key(t);
                if(recurse.indexOf(type) > -1) {
                    return subelementreverse(context.functions._FILTERTYPE(subelement(t), context, ...types),t);
                }
                return t;
            });
            if(ttypes.length > 0) {
                return context.functions._FILTERTYPE(result, context, ...ttypes);
            }
              return result;
        },
        SUBTOTAL: ([{value:mode},...args],context) => {
            const xmode = ""+mode;
            const mapping = {
              "1": context.functions.AVERAGE,
              "2": context.functions.COUNT,
              "3": context.functions.COUNTA,
              "4": context.functions.MAX,
              "5": context.functions.MIN,
              "6": context.functions.PRODUCT,
              "7": context.functions.STDEV,
              "8": context.functions.STDEVP,
              "9": context.functions.SUM,
              "10": context.functions.VAR,
              "11": context.functions.VARP,
              "101": context.functions.AVERAGE,
              "102": context.functions.COUNT,
              "103": context.functions.COUNTA,
              "104": context.functions.MAX,
              "105": context.functions.MIN,
              "106": context.functions.PRODUCT,
              "107": context.functions.STDEV,
              "108": context.functions.STDEVP,
              "109": context.functions.SUM,
              "110": context.functions.VAR,
              "111": context.functions.VARP
            };
            if(!mapping[xmode]) {
                return { type: ERROR, value: "UNexpected value for mode '"+String(xmode)+"' found in SUBTOTAL" };
            }
            const filters = [{
                key: ({type}) => type,
                ignore: [NULL]
            }, {
                key: ({meta:{type}={}}) => type,
                ignore: [SUBTOTAL]
            }];
            if(xmode.startsWith("10")) {
                // ignore hidden
                filters.push({
                  key: ({meta:{visibility:type}={}}) => type,
                  ignore: [HIDDEN]
              });
            }
            const filtered = context.functions._FILTERTYPE(args, context, ...filters);
            const {meta={},...rest} = mapping[xmode](filtered,context);
            return Object.assign(rest,{meta:{...meta,type:SUBTOTAL}});
        },
        SUMIF: ([{value:range,type:t1},{value:criteria,type},{value:xsumrange}={}], context) => {
            if(t1 !== LIST) {
              throw new Error("SUMIF must be supplied a LIST, found value "+value+" of type "+t1);
            }
            const f = context.functions._CRITMATCHER([{value:criteria,type}], context);
            const sumrange = xsumrange || range;
            const filterd = sumrange.filter((__,idx) => f(range[idx]));
            const {meta={},...rest} = context.functions.SUM(filterd,context);
            return Object.assign(rest,{meta:{...meta,matches:filterd}});
        },
        SUMIFS: ([{value:sumrange},...args], context) => {
            if(args.length < 2) {
                throw new Error("Excepted 'criteria_range1, criteria1', but found "+(args.length?"'criteria_range1'":"no arguments"));
            }
            if(args.length % 2) { // if 1
                throw new Error("Wrong number of arguments, excepted 'criteria_range1, criteria1, [criteria_range2, criteria2]...', but found "+
                args.map((i, idx) => idx%2?"criteria"+Math.ceil((idx+1)/2):"criteria_range"+Math.ceil((idx+1)/2)).join(", "));
            }
            const [ranges, criteria] = args.reduce(([l1,l2],arg,idx) => 
                idx%2?[l1,[...l2, arg]]:[[...l1, arg], l2], // sort into 2 lists, so that [a,1,b,2,c,3]->[[a,b,c],[1,2,3]]
            [[],[]]);
            if(ranges.some(({value:i}) => i.length !== sumrange.length)) {
                throw new Error("All defined ranges must have the same length ("+ranges[0].value.length+") as it's sumrange ("+sumrange.length+")");
            }
            
            const cfunctions = criteria.map(({value:criterium,type}) => {
              return context.functions._CRITMATCHER([{value:criterium,type}], context);
            });
            const filtered = sumrange
                .filter((s, idx) => 
                    ranges
                    .every(({value:v},jdx) => cfunctions[jdx](v[idx]))
                );
            const {meta={},...rest} = context.functions.SUM(filtered,context);
            return Object.assign(rest,{meta:{...meta,matches:filtered}});
        },
        SUMSQ: (allargs, context) => {
          const result = allargs.reduce((sum, { value, type }) => {
              switch(type) {
                  case NULL:
                    return sum;
                case NUMBER:
                  return sum + value*value;
                case LIST:
                  const {value:s} = context.functions.SUM(value, context);
                  return sum+s;
                default:
                  throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in SUM");
              }
          }, 0);
          return { type: NUMBER, value: result };
        },
        SUMX2MY2: ([{value:x},{value:y}],context) => {
            const r = x.reduce((p, __, idx) => {
                const { value:xv, type:xt } = x[idx];
                const { value:yv, type:yt } = y[idx];
              switch(xt === yt ? xt : false) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return p;
                case NUMBER:
                    return p + (xv*xv-yv*yv);
                case LIST:
                    const { value } = context.functions.SUMX2MY2([xv,yv], context);
                    return p+value;
                default:
                  throw new Error("Disallowed value "+xv+" of type "+xt+" found in SUMX2MY2");
              }
              }, 0);
            return { type: NUMBER, value: r };
        },
        SUMX2PY2: ([{value:x},{value:y}],context) => {
            const r = x.reduce((p, __, idx) => {
                const { value:xv, type:xt } = x[idx];
                const { value:yv, type:yt } = y[idx];
              switch(xt === yt ? xt : false) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return p;
                case NUMBER:
                    return p + (xv*xv+yv*yv);
                case LIST:
                    const { value } = context.functions.SUMX2PY2([xv,yv], context);
                    return p+value;
                default:
                  throw new Error("Disallowed value "+xv+" of type "+xt+" found in SUMX2PY2");
              }
              }, 0);
            return { type: NUMBER, value: r };
        },
        SUMXMY2: ([{value:x},{value:y}],context) => {
            const r = x.reduce((p, __, idx) => {
                const { value:xv, type:xt } = x[idx];
                const { value:yv, type:yt } = y[idx];
              switch(xt === yt ? xt : false) {
                  case NULL:
                case BOOLEAN:
                case STRING:
                case ERROR:
                    return p;
                case NUMBER:
                    return p + (xv-yv)*(xv-yv);
                case LIST:
                    const { value } = context.functions.SUMX2PY2([xv,yv], context);
                    return p+value;
                default:
                  throw new Error("Disallowed value "+xv+" of type "+xt+" found in SUMX2PY2");
              }
              }, 0);
            return { type: NUMBER, value: r };
        },
        SWITCH: ([{value:sswitch},...args]) => {
            let elsev = undefined;
            if(args.length % 2) {
                elsev = {...args.pop()};
            }
            const [ranges, criteria] = args.reduce(([l1,l2],arg,idx) => 
                idx%2?[l1,[...l2, arg]]:[[...l1, arg], l2], // sort into 2 lists, so that [a,1,b,2,c,3]->[[a,b,c],[1,2,3]]
            [[],[]]);
            const idx = ranges.findIndex(({value:v}) => sswitch === v || sswitch.valueOf() === v.valueOf());
            return criteria[idx] ? {...criteria[idx]} : (elsev || { type: ERROR, value: NAVALUE });
        },
        // cost, salvage, life, per
        SYD: ([{value:cost},{value:salvage},{value:life},{value:per}]) => {
            // (cost-salvage)*(life-per+1)*2   /   life*(life+1)
            return { type: NUMBER, value: (cost-salvage)*(life-per+1)*2 / (life*(life+1)) }
        },
        T: ([{value,type}]) => ({ type: STRING, value: type === STRING ? value : "" }),
        TAN: ([{value}]) => ({ type: NUMBER, value: Math.tan(value) }),
        TANH: ([{value}]) => ({ type: NUMBER, value: Math.tanh(value) }),
        TBILLEQ: ([{value}]) => ({ type: NULL, value }), // todo either figure out or use fin lib
        TBILLPRICE: ([{value}]) => ({ type: NULL, value }), // see above - need to figure out / re-use 360 year calc
        TBILLYIELD: ([{value}]) => ({ type: NULL, value }), // see above
        "T.DIST": ([{value}]) => ({ type: NULL, value }), // todo use math lib
        "T.DIST.2T": ([{value}]) => ({ type: NULL, value }), // todo use math lib
        "T.DIST.RT": ([{value}]) => ({ type: NULL, value }), // todo use math lib
        TDIST: ([{value}]) => ({ type: NULL, value }), // todo use math lib
        TEXT: ([{value},{value:format}]) => {
            // well.... we might just need another parser to parse all the format options
            // positive;negative;zero;text
            // Strings need to be in quotes
            // Characters not in quotes:
            // ["$", "+", "-", "/", "(", ")", ":", "!", "^", "&", "'", "~", "{", "}", "<", ">", "=", " "]
            // # = N || ""
            // 0 = N || "0"
            // ? = N || " "
            // @ = Text
            // color: [Black] [Blue] [Cyan] [Green] [Magenta] [Red] [White] [Yellow]
            // conditions: [Blue][<=100]
            // % = N*100%
            // / = fraction
            // (E– | E+ | e– | e+) (0 | #) = scientific notation
            // date and time -> https://support.office.com/en-us/article/number-format-codes-5026bbd6-04bc-48cd-bf33-80f18b4eae68
            // 0#,0# = 1000 seperator
            // 0#,$ = N / 1000
            // todo
        },
        TEXTJOIN: ([{value:delimiter},{value:ignore_empty},...allargs],context) => {
            //delimiter, ignore_empty, text1, [text2]
            const result = allargs.reduce((sum, { value, type }) => {
              if(ignore_empty && (value === "" || value == null)) {
                  return sum;
              }
              switch(type) {
                case NULL:
                case NUMBER:
                case STRING:
                case BOOLEAN:
                    return [...sum,value];
                case LIST:
                    const {list:s} = context.functions.TEXTJOIN([{value:delimiter},{value:ignore_empty},...value], context).meta;
                    return [...sum,...s];
                default:
                    throw new Error("Disallowed value "+String(value)+" of type "+String(type)+" found in TEXTJOIN");
             }
            }, []);
          return { type: STRING, value: result.join(delimiter), meta: { list: result } };
        },
        "T.INV": ([{value}]) => ({ type: NULL, value }), // todo: Use math lib
        "T.INV.2T": ([{value}]) => ({ type: NULL, value }), // todo: Use math lib
        TINV: ([{value}]) => ({ type: NULL, value }), // todo: Use math lib
        TREND: ([{value:y},{value:x},{value:new_x},{value:bis0}={value:false}],context) => {
            // sum( (x-xbar)*(y-ybar) ) / sum( (x-xbar)**2 )
            if(!x) {
                x = y.map((__,idx) => ({type:NUMBER,value:idx+1}));
            }
            if(!new_x) {
                new_x = x;
            }
            const {value:ybar} = context.functions.AVERAGE(y, context);
            const {value:xbar} = context.functions.AVERAGE(x, context);
            const { value: m } = context.functions._SLOPE([{value:y},{value:x}],context,xbar,ybar);
            const b = bis0 ? 0 : ybar - m * xbar;
            const result = new_x.map(({value,...r}) => ({
                ...r,
                value: value*m + b
            }));
            return { type: new_x.type, value: result, meta: { m, b } };
        },
        TRIMMEAN: ([{value:arr},{value:perc}],context) => {
            const excludes = Math.round(arr.length * perc / 2);
            const narr = arr.sort(({value:a},{value:b}) => b-a).slice(excludes, -excludes);
            return context.functions.AVERAGE(narr,context);
        },
        TRUE: () => ({ type: BOOLEAN, value: true }),
        "T.TEST": ([{value}]) => ({ type: NULL, value }),// todo: USe math-lib
        TTEST: ([{value}]) => ({ type: NULL, value }),// todo: USe math-lib
        TYPE: ([{type}]) => {
            const mapping = {
              NUMBER: 1,
              DATE: 1,
              NULL: 1, // Apperently empty cells are type number....
              STRING: 2,
              BOOLEAN: 4,
              ERROR: 16,
              LIST: 64,
              MATRIX: 64,
              ARGUMENTS: 64
            };
            return {type:NUMBER, value:mapping[type]};
        },
        UNICHAR: ([{value}]) => ({ type: STRING, value: String.fromCharCode(value) }),
        UNICODE: ([{value}]) => ({ type: NUMBER, value: value.charCodeAt(0) }),
        _FILTERUNIQUE: ([arr,exactly_once]) => {
            const rootMap = new Map();
            // filter duplicates
            let filtered = arr.filter(line => {
              let map = rootMap;
              let found = true;
              for(const {value:item} of line) {
                if(!map.has(item)) {
                  found = false;
                  map2 = new Map();
                  map.set(item, map2);
                  map = map2;
                } else {
                    map = map.get(item);
                }
              }
              if(exactly_once) {
                if(map.has("line")) {
                  map.get("line").duplicate = true;	
                }
                else {
                  map.set("line",line);
                }
              }
              return !found;
            });
            if(exactly_once) {
                filtered = filtered.filter(i => !i.duplicate);
            }
            return filtered;
        },
        UNIQUE: ([{value:arr,type,...rest},{value:bycol}={value:false},{value:exactly_once}={value:false}],context) => {
            if(type === LIST) {
                arr = [arr];
            }
            // Note: LIST type hasn't got a reliable way of checking direction
            // Code hence assumes, list is {1,2,3}, even when it actually was {1;2;3}
            if(bycol) {
                const filtered = context.functions._FILTERUNIQUE([arr,exactly_once]);
                if(type === LIST) {
                    return Object.assign(rest,{type,value:filtered[0]})
                }
                return Object.assign(rest,{type,value:filtered});
            }
            const transposed = arr[0].map((col, idx) => arr.map(row => row[idx]));
            const filtered = context.functions._FILTERUNIQUE([transposed,exactly_once]);
            const back = filtered[0].map((col, idx) => filtered.map(row => row[idx]));
            if(type === LIST) {
                return Object.assign(rest,{type,value:back[0]});
            }
            return Object.assign(rest,{type,value:back});
        },
        VAR: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            return { type: NUMBER, value: result/(ccount-1), meta: { result, ccount } };
        },
        "VAR.P": (allargs, context) => context.functions.VARP(allargs, context),
        "VAR.S": (allargs, context) => context.functions.VAR(allargs, context),
        VARA: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEVA(allargs, context, xbar).meta;
            return { type: NUMBER, value: result/(ccount-1), meta: { result, ccount } };
        },
        VARP: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEV(allargs, context, xbar).meta;
            return { type: NUMBER, value: result/ccount, meta: { result, ccount } };
        },
        VARPA: (allargs, context) => {
            const {value:xbar} = context.functions.AVERAGE(allargs, context);
            const { result, ccount } = context.functions._STDEVA(allargs, context, xbar).meta;
            return { type: NUMBER, value: result/ccount, meta: { result, ccount } };
        },
        VDB: ([{value}]) => ({ type: NULL, value }), // todo: Clarify using DDB
        WEBSERVICE: ([{value}]) => {
            // warning: Can all any address!!
            return fetch(value).then(i => i.text()).then(value => ({type:STRING,value}));
        },
        WEIBULL: ([{value}]) => ({ type: NULL, value }), // todo understand / use math lib
        "WEIBULL.DIST": ([{value}]) => ({ type: NULL, value }), // todo understand / use math lib
        XIRR: ([{value}]) => ({ type: NULL, value }), // todo, iterative technique, maybe using https://en.wikipedia.org/wiki/Non-linear_least_squares / gauss-newton?
        XLOOKUP: ([lookup,arr,{value:retrunarr},
                    ifnotfound={type:ERROR,value:NAVALUE},
                    match_mode,
                    search_mode], context) => {
            const a = context.functions.XMATCH([lookup,arr,match_mode,search_mode],context);
            const {value:idx,type} = a;
            if(type === ERROR) {
                return ifnotfound;
            }
            let r = retrunarr[idx];
            if(!r || r.length === 0) {
                return ifnotfound;
            }
            return Array.isArray(r) ? { value: r, type: LIST } : r;
               
        },
        XMATCH: ([{value:lookup},{value:arr},
                    {value:match_mode}={value:0},
                    {value:search_mode}={value:1}], context) => {
            // todo: Implement search modes 2 and -2 (binary serach)
            const searchMethods = {
                "0": (arr,lookup) => {
                    const xarr = search_mode > 0 ? arr : arr.reverse();
                    // .sort(({value:a},{value:b}) => {
                    //    return (a-b)*search_mode
                    //});
                    return xarr.findIndex(({value}) => value===lookup);
                },
                // -1 - Exact match. If none found, return the next smaller item.
                "-1": (xarr,lookup) => {
                    // for now, we ignore search_mode as it actually doesn't do anything
                    const { _GREATER, _SMALLER } = context.functions;
                    if(search_mode > 0) {
                      for(let i = 0; i < xarr.length; i++) {
                          if(searchr[i].value === lookup) {
                              return i;
                          }
                          if(_GREATER(searchr[i].value, lookup)) {
                              return i-1;
                          }
                      }
                      return -1;
                    }
                    for(let i = xarr.length-1; i >= 0; i--) {
                        if(searchr[i].value === lookup) {
                            return i;
                        }
                        if(_SMALLER(searchr[i].value, lookup)) {
                            return i;
                        }
                    }
                    return -1;
                },
                "1": (xarr,lookup) => {
                    const { _GREATER, _SMALLER } = context.functions;
                    if(search_mode > 0) {
                      for(let i = 0; i < xarr.length; i++) {
                          if(searchr[i].value === lookup) {
                              return i;
                          }
                          if(_GREATER(searchr[i].value, lookup)) {
                              return i;
                          }
                      }
                      return -1;
                    }
                    for(let i = xarr.length-1; i >= 0; i--) {
                        if(searchr[i].value === lookup) {
                            return i;
                        }
                        if(_SMALLER(searchr[i].value, lookup)) {
                            return i-1;
                        }
                    }
                    return -1;
                },
                "2": (arr,lookup) => {
                    const xarr = search_mode > 0 ? arr : arr.reverse();
                    const reg = context.functions._TOSEARCHSTRING([
                        lookup
                    ], context);
                    return xarr.findIndex(({value}) => reg.test(value))
                }
            };
            const idx = searchMethods[match_mode+""](arr,lookup);
            return idx < 0 ? {type:ERROR,value:NAVALUE} : {type:NUMBER, value:idx};
        },
        XNPV: ([{value}]) => ({ type: NULL, value }), // todo use fin lib
        YIELD: ([{value}]) => ({ type: NULL, value }), // todo use fin lib
        YIELDDISC: ([{value}]) => ({ type: NULL, value }), // todo use fin lib
        YIELDMAT: ([{value}]) => ({ type: NULL, value }), // todo use fin lib
        "Z.TEST": ([{value}]) => ({ type: NULL, value }), // todo use math lib
        ZTEST: ([{value}]) => ({ type: NULL, value }), // todo use math lib
        
        
        // CUSTOM
        JSON: ([{value}]) => ({ type: ANY, value: JSON.parse(value) }),
        JSONPATH: ([{value,type},{value:path}]) => {
            if(type === STRING) {
                value = JSON.parse(value);
            }
            const pathx = path.replace(/\[([0-9]*)\]/g,".$1").split(".");
            const r = pathx.reduce((p,i) => p[i],value);
            return { type: ANY, value: r, meta: { path: pathx, value } };
        },
    };

    var parse = /*
     * Generated by PEG.js 0.10.0.
     *
     * http://pegjs.org/
     */
    (function() {

      function peg$subclass(child, parent) {
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
      }

      function peg$SyntaxError(message, expected, found, location) {
        this.message  = message;
        this.expected = expected;
        this.found    = found;
        this.location = location;
        this.name     = "SyntaxError";

        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, peg$SyntaxError);
        }
      }

      peg$subclass(peg$SyntaxError, Error);

      peg$SyntaxError.buildMessage = function(expected, found) {
        var DESCRIBE_EXPECTATION_FNS = {
              literal: function(expectation) {
                return "\"" + literalEscape(expectation.text) + "\"";
              },

              "class": function(expectation) {
                var escapedParts = "",
                    i;

                for (i = 0; i < expectation.parts.length; i++) {
                  escapedParts += expectation.parts[i] instanceof Array
                    ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                    : classEscape(expectation.parts[i]);
                }

                return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
              },

              any: function(expectation) {
                return "any character";
              },

              end: function(expectation) {
                return "end of input";
              },

              other: function(expectation) {
                return expectation.description;
              }
            };

        function hex(ch) {
          return ch.charCodeAt(0).toString(16).toUpperCase();
        }

        function literalEscape(s) {
          return s
            .replace(/\\/g, '\\\\')
            .replace(/"/g,  '\\"')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
        }

        function classEscape(s) {
          return s
            .replace(/\\/g, '\\\\')
            .replace(/\]/g, '\\]')
            .replace(/\^/g, '\\^')
            .replace(/-/g,  '\\-')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
        }

        function describeExpectation(expectation) {
          return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
        }

        function describeExpected(expected) {
          var descriptions = new Array(expected.length),
              i, j;

          for (i = 0; i < expected.length; i++) {
            descriptions[i] = describeExpectation(expected[i]);
          }

          descriptions.sort();

          if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
              if (descriptions[i - 1] !== descriptions[i]) {
                descriptions[j] = descriptions[i];
                j++;
              }
            }
            descriptions.length = j;
          }

          switch (descriptions.length) {
            case 1:
              return descriptions[0];

            case 2:
              return descriptions[0] + " or " + descriptions[1];

            default:
              return descriptions.slice(0, -1).join(", ")
                + ", or "
                + descriptions[descriptions.length - 1];
          }
        }

        function describeFound(found) {
          return found ? "\"" + literalEscape(found) + "\"" : "end of input";
        }

        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
      };

      function peg$parse(input, options) {
        options = options !== void 0 ? options : {};

        var peg$FAILED = {},

            peg$startRuleFunctions = { Start: peg$parseStart },
            peg$startRuleFunction  = peg$parseStart,

            peg$c0 = "",
            peg$c1 = function() { return { type: NULL, value: null } },
            peg$c2 = "=",
            peg$c3 = peg$literalExpectation("=", false),
            peg$c4 = function(exp) { return exp; },
            peg$c5 = "'",
            peg$c6 = peg$literalExpectation("'", false),
            peg$c7 = function(str) { return { type: STRING, value: text().substring(1), meta: { type: STR_ESCAPED } }; },
            peg$c8 = /^[^'=+\-*\/&<>\^]/,
            peg$c9 = peg$classExpectation(["'", "=", "+", "-", "*", "/", "&", "<", ">", "^"], true, false),
            peg$c10 = function() { return { type: STRING, value: text(), meta: { type: STR_PLAIN } } },
            peg$c11 = peg$anyExpectation(),
            peg$c12 = "<>",
            peg$c13 = peg$literalExpectation("<>", false),
            peg$c14 = "<=",
            peg$c15 = peg$literalExpectation("<=", false),
            peg$c16 = ">=",
            peg$c17 = peg$literalExpectation(">=", false),
            peg$c18 = "<",
            peg$c19 = peg$literalExpectation("<", false),
            peg$c20 = ">",
            peg$c21 = peg$literalExpectation(">", false),
            peg$c22 = function(head, tail) {
                  return tail.reduce(function(result, element) {
                    if (element[1] === "=") { return stdop(result, element[3], (x,y)=>x==y, BOOLEAN, "==") }
                    if (element[1] === "<") { return stdop(result, element[3], (x,y)=>x<y, BOOLEAN, "<") }
                    if (element[1] === ">") { return stdop(result, element[3], (x,y)=>x>y, BOOLEAN, ">") }
                    if (element[1] === "<=") { return stdop(result, element[3], (x,y)=>x<=y, BOOLEAN, "<=") }
                    if (element[1] === ">=") { return stdop(result, element[3], (x,y)=>x>=y, BOOLEAN, ">=") }
                    if (element[1] === "<>") { return stdop(result, element[3], (x,y)=>x!=y, BOOLEAN, "<>") }
                  }, head);
                },
            peg$c23 = "&",
            peg$c24 = peg$literalExpectation("&", false),
            peg$c25 = function(head, tail) {
                  return tail.reduce(function(result, element) {
                    if (element[1] === "&") { return stdop(result, element[3], (x,y)=>""+x+y, STRING, "&") }
                  }, head);
                },
            peg$c26 = "+",
            peg$c27 = peg$literalExpectation("+", false),
            peg$c28 = "-",
            peg$c29 = peg$literalExpectation("-", false),
            peg$c30 = function(head, tail) {
                  return tail.reduce(function(result, element) {
                    if (element[1] === "+") { return stdop(result, element[3], (x,y)=>x+y, NUMBER, "+") }
                    if (element[1] === "-") { return stdop(result, element[3], (x,y)=>x-y, NUMBER, "-") }
                  }, head);
                },
            peg$c31 = "*",
            peg$c32 = peg$literalExpectation("*", false),
            peg$c33 = "/",
            peg$c34 = peg$literalExpectation("/", false),
            peg$c35 = function(head, tail) {
                  return tail.reduce(function(result, element) {
                    if (element[1] === "*") { return stdop(result, element[3], (x,y)=>x*y, NUMBER, "*") }
                    if (element[1] === "/") { return stdop(result, element[3], (x,y)=>x/y, NUMBER, "/") }
                  }, head);
                },
            peg$c36 = "^",
            peg$c37 = peg$literalExpectation("^", false),
            peg$c38 = function(head, tail) {
                  return tail.reduce(function(result, element) {
                    if (element[1] === "^") {
                    	return stdop(result, element[3], (x,y)=>Math.pow(x,y), NUMBER, "^");
                    }
                  }, head);
                },
            peg$c39 = "{",
            peg$c40 = peg$literalExpectation("{", false),
            peg$c41 = ";",
            peg$c42 = peg$literalExpectation(";", false),
            peg$c43 = function(inner, x) { return x; },
            peg$c44 = "}",
            peg$c45 = peg$literalExpectation("}", false),
            peg$c46 = function(inner, rows) {
                const Cell_Trace = inner.map(i => i[CELL_TRACE] || []);
                if(!rows.length) {
                	return { type: LIST, value: inner, meta: { type: INLINE }, [CELL_TRACE]: [].concat(...Cell_Trace) };
                }
            	return { type: MATRIX, value: [inner, ...rows], meta: { type: INLINE }, [CELL_TRACE]: [].concat(...Cell_Trace) };
            },
            peg$c47 = ",",
            peg$c48 = peg$literalExpectation(",", false),
            peg$c49 = function(member, x) {return x;},
            peg$c50 = function(member, members) { return [member || { type: NULL }, ...members]; },
            peg$c51 = "(",
            peg$c52 = peg$literalExpectation("(", false),
            peg$c53 = ")",
            peg$c54 = peg$literalExpectation(")", false),
            peg$c55 = function(expr) { return expr; },
            peg$c56 = "TRUE",
            peg$c57 = peg$literalExpectation("TRUE", false),
            peg$c58 = function() { return { type: BOOLEAN, value: true, [CELL_TRACE]: [] } },
            peg$c59 = "FALSE",
            peg$c60 = peg$literalExpectation("FALSE", false),
            peg$c61 = function() { return { type: BOOLEAN, value: false, [CELL_TRACE]: [] } },
            peg$c62 = /^[a-zA-Z]/,
            peg$c63 = peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
            peg$c64 = /^[a-zA-Z0-9_]/,
            peg$c65 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
            peg$c66 = function() { return text(); },
            peg$c67 = "!",
            peg$c68 = peg$literalExpectation("!", false),
            peg$c69 = function(t) { return { sheet: t }; },
            peg$c70 = "[",
            peg$c71 = peg$literalExpectation("[", false),
            peg$c72 = /^[a-zA-Z0-9_.]/,
            peg$c73 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "."], false, false),
            peg$c74 = "]",
            peg$c75 = peg$literalExpectation("]", false),
            peg$c76 = function(t, s) { return { ...s, workbook: t } },
            peg$c77 = "\\'",
            peg$c78 = peg$literalExpectation("\\'", false),
            peg$c79 = /^[^']/,
            peg$c80 = peg$classExpectation(["'"], true, false),
            peg$c81 = function() { return text().replace(/\\'/g, "'"); },
            peg$c82 = function(t) { return { sheet: t }  },
            peg$c83 = "\\]",
            peg$c84 = peg$literalExpectation("\\]", false),
            peg$c85 = /^[^\]]/,
            peg$c86 = peg$classExpectation(["]"], true, false),
            peg$c87 = function() { return text().replace(/\\\]/g, "]"); },
            peg$c88 = function(t1) { return text().replace(/\\'/g, "'"); },
            peg$c89 = function(t1, t2) { return { sheet: t2, workbook: t1 }  },
            peg$c90 = "$",
            peg$c91 = peg$literalExpectation("$", false),
            peg$c92 = /^[A-Z]/,
            peg$c93 = peg$classExpectation([["A", "Z"]], false, false),
            peg$c94 = /^[1-9]/,
            peg$c95 = peg$classExpectation([["1", "9"]], false, false),
            peg$c96 = /^[0-9]/,
            peg$c97 = peg$classExpectation([["0", "9"]], false, false),
            peg$c98 = function(loc, abscol, col, absrow) { return parseInt(text(), 10); },
            peg$c99 = function(loc, abscol, col, absrow, row) {
                const c = col.reduce((sum, char) => sum*26+char.charCodeAt(0)-64, 0);
                // loc:(CellSheetWorkbook)?
                const locx = loc || {};
                let contextu = context;
                if(locx.workbook) {
                	contextu = contextu.getWorkbook(locx.workbook);
                }
                if(locx.sheet) {
                	contextu = contextu.getWorkbook(locx.sheet);
                }
                const carg = { ...locx, row: row-1, col: c-1, type: NATURALREF };
                const v = contextu.getRow(row-1, carg).getCol(c-1, carg) || { value: null, type: "ERROR" };
                const inheritedCellTrace = v[CELL_TRACE] || [];
                const result = {
                	...v,
                	type: v.type,
                    meta: { ...locx, type: CELL, row: row, col: c, absrow: absrow === "$", abscol: abscol === "$" },
                    value: v.value,
                    [CELL_TRACE]: inheritedCellTrace.concat([{row: row, col: c}]),
                };
                return result;
            },
            peg$c100 = "R",
            peg$c101 = peg$literalExpectation("R", false),
            peg$c102 = "C",
            peg$c103 = peg$literalExpectation("C", false),
            peg$c104 = function(loc, row, col) {
                const { row: crow, col: ccol } = currentcell;
                let r = row.absolute ? row.cell : crow + row.cell;
                let c = col.absolute ? col.cell : ccol + col.cell;
                
                // loc:(CellSheetWorkbook)?
                const locx = loc || {};
                let contextu = context;
                if(locx.workbook) {
                	contextu = contextu.getWorkbook(locx.workbook);
                }
                if(locx.sheet) {
                	contextu = contextu.getWorkbook(locx.sheet);
                }
                const carg = { ...locx, row: r-1, col: c-1, type: NATURALREF };
                const v = contextu.getRow(r-1, carg).getCol(c-1, carg) || { value: null, type: "ERROR" };
                const inheritedCellTrace = v[CELL_TRACE] || [];
                return {
                	...v,
                	type: v.type,
                    meta: { ...locx, type: CELL, row: r, col: c, absrow: row.absolute, abscol: col.absolute, notation: "R1C1" },
                    value: v.value,
                    [CELL_TRACE]: inheritedCellTrace.concat([{row: row, col: c}]),
                };
            },
            peg$c105 = function() { return parseInt(text(), 10); },
            peg$c106 = function(cell) {
            				return { cell, absolute: true };
            			},
            peg$c107 = function(cell) {
            				return { cell, absolute: false };
            			},
            peg$c108 = ":",
            peg$c109 = peg$literalExpectation(":", false),
            peg$c110 = function(loc, start, end) {
                
                	// loc:(CellSheetWorkbook)?
                    const locx = loc || {};
                    let contextu = context;
                    if(locx.workbook) {
                        contextu = contextu.getWorkbook(locx.workbook);
                    }
                    if(locx.sheet) {
                        contextu = contextu.getWorkbook(locx.sheet);
                    }
                    const meta = { ...locx, type: NATURALREF };
                  const results = [];
                  const cellTrace = [];
                	for(var row = start.meta.row; row <= end.meta.row; row++) {
                      const t = [];
                      for(var col = start.meta.col; col <= end.meta.col; col++) {
                          const v = contextu.getRow(row-1,{...meta, row: row-1, col: col-1}).getCol(col-1,{...meta, row: row-1, col: col-1}) || { value: null, type: "ERROR" };
                          cellTrace.push(...(v[CELL_TRACE] || []));
                          t.push({ ...v, meta: { ...locx, type: CELL, row, col } });
                      }
                      results.push(t);
                    }
                    
                    if(results.length === 1) {
                    	return { type: LIST, value: results[0], meta, [CELL_TRACE]: cellTrace }
                    }
                    if(results.every(r => r.length === 1)) {
                    	return { type: LIST, value: results.map(i => i[0]), meta, [CELL_TRACE]: cellTrace }
                    }
                    return { type: MATRIX, value: results, meta, [CELL_TRACE]: cellTrace }
                },
            peg$c111 = function(arg0, y) { return y; },
            peg$c112 = function(arg0) { return { type: NULL, value: undefined } },
            peg$c113 = function(arg0, t) { return t; },
            peg$c114 = function(arg0, args) { return { type: ARGUMENTS, value: [arg0, ...args] } },
            peg$c115 = /^[a-zA-Z0-9.]/,
            peg$c116 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "."], false, false),
            peg$c117 = function() { return text() },
            peg$c118 = function(name, arg0, y) { return y; },
            peg$c119 = function(name, arg0) { return { type: NULL, value: undefined } },
            peg$c120 = function(name, arg0, t) { return t; },
            peg$c121 = function(name, arg0, args) {
            	if(functions$1[name]) {
                	const allargs = [arg0, ...args].map(i => i || { type: NULL, [CELL_TRACE]: [] });
                    const cellTrace = allargs.reduce((p, i) => p.concat(i[CELL_TRACE] || []), []);
                    try {
                    	const func = functions$1[name];
                        
                    	const v = func(allargs, { ...ctx, currentcell, name, raw: text(), allowUnsafe, functions: functions$1, table: context, parser: parser, [CELL_TRACE]: cellTrace });
                        if(!v) {
                        	throw new Error("Function '"+name+"' did not return a result! Check the implementation!");
                        }
                        v[TRACE] = {
                            function: name,
                        	arguments: allargs
                        };
                        v[CELL_TRACE] = cellTrace.concat(v[CELL_TRACE] || []);
                        return v;
                    } catch(e) {
                    	const initialError = allargs.find((e) => e && (e.type === ERROR));
                        const r = { type: ERROR, value: (initialError && initialError.value) || e.name+' in '+name+': "'+e.message+'"', meta: {  error_value: initialError, internal_error: e } };
                        r[CELL_TRACE] = cellTrace;
                        return r;
                    }
                }
                if(functions$1[name.toUpperCase()]) {
                	return { type: ERROR, value: NAMEE, meta: { error: "Unknown function "+name+". Did you mean "+name.toUpperCase()+"?" } };
                }
                const simiar = Object.keys(functions$1).find(fnc => fnc.toUpperCase() === name.toUpperCase());
                if(simiar) {
                	return { type: ERROR, value: NAMEE, meta: { error: "Unknown function "+name+". Did you mean "+simiar+"?" } };
                }
                // todo find close names
                return { type: ERROR, value: NAMEE, meta: { error: "Unknown function "+name } };
            },
            peg$c122 = " ",
            peg$c123 = peg$literalExpectation(" ", false),
            peg$c124 = function(a, b) {
                if(a.type !== LIST || b.type !== LIST) {
                	throw new Error("An intersection between anything else but LISTs is currently not supported. Expected LIST, LIST, found "+a.type+", "+b.type); 
                }
                const v = a.value.filter(i => b.value.some(j => j.meta.row === i.meta.row && j.meta.col === i.meta.col));
                const cellTrace = [].concat(...v.map(i => i[CELL_TRACE] || []));
                return {
                	type: LIST,
                  value: v,
                  meta: { type: NATURALREF },
                  [CELL_TRACE]: cellTrace
                }
            },
            peg$c125 = function(loc) { return text(); },
            peg$c126 = function(loc, start) { return text(); },
            peg$c127 = function(loc, start, end) {
                	if(start !== end) {
                    	throw new Error("Infinite row-ranges can't span multiple columns \""+start+":"+end+"\"")
                    }
                    // loc:(CellSheetWorkbook)?
                    const locx = loc || {};
                    let contextu = context;
                    if(locx.workbook) {
                        contextu = contextu.getWorkbook(locx.workbook);
                    }
                    if(locx.sheet) {
                        contextu = contextu.getWorkbook(locx.sheet);
                    }
                    const c = start.split("").reduce((sum, char) => sum*26+char.charCodeAt(0)-64, 0);
                    const meta = { ...locx, type: NATURALREF };
                    const v = contextu.getCol(c-1,meta).all({ col: c-1 }, meta);
                    const cellTrace = [{ col: c, row: "*" }].concat(...v.map(i => i[CELL_TRACE] || []));
                    return { type: LIST, value: v, meta, [CELL_TRACE]: cellTrace };
                },
            peg$c128 = function(loc, start, end) {
                	if(start !== end) {
                    	throw new Error("Infinite row-ranges can't span multiple columns \""+start+":"+end+"\"")
                    }
                    // loc:(CellSheetWorkbook)?
                    const locx = loc || {};
                    let contextu = context;
                    if(locx.workbook) {
                        contextu = contextu.getWorkbook(locx.workbook);
                    }
                    if(locx.sheet) {
                        contextu = contextu.getWorkbook(locx.sheet);
                    }
                    const r = parseInt(start, 10);
                    const meta = { ...contextu, type: NATURALREF };
                    const v = contextu.getRow(r-1,meta).all({ row: r-1 },meta);
                    const cellTrace = [{ row: r, col: "*" }].concat(...v.map(i => i[CELL_TRACE] || []));
                    return { type: LIST, value: v, meta, [CELL_TRACE]: cellTrace };
                },
            peg$c129 = function(x) { return x; },
            peg$c130 = function(unsafestart, unsafeend) {
                	const results = [];
                    let start = unsafestart;
                    if(unsafestart.type === ERROR && unsafestart.value === CIRCULAR) {
                    	start = {...unsafestart.meta, meta: unsafestart.meta};
                    }
                    let end = unsafeend;
                    if(unsafeend.type === ERROR && unsafeend.value === CIRCULAR) {
                    	end = {...unsafeend.meta, meta: unsafeend.meta};
                    }
                    let contextu = context;
                    const loc = {};
                    if(start.meta.workbook) {
                        contextu = contextu.getWorkbook(start.meta.workbook);
                        loc.workbook = start.meta.workbook; // Avoid keys with undefined values
                    }
                    if(start.meta.sheet) {
                        contextu = contextu.getWorkbook(start.meta.sheet);
                        loc.sheet = start.meta.sheet; // Avoid keys with undefined values
                    }
                    const cellTrace = [];
             		  let circularFlag = false;
                	for(let row = start.meta.row; row <= end.meta.row; row++) {
                      const t = [];
                      for(let col = start.meta.col; col <= end.meta.col; col++) {
                          const v = contextu.getRow(row-1, {...loc,type: NATURALREF}).getCol(col-1, {...loc,type: NATURALREF}) || { value: null, type: "ERROR" };
                          cellTrace.push(...(v[CELL_TRACE] || []));
                          cellTrace.push({ row, col });
                          if(v.type === ERROR && v.value === CIRCULAR) {
                          	circularFlag = true;
                          }
                          t.push({ ...v, meta: { ...start.meta, type: CELL, row, col } });
                          
                      }
                      results.push(t);
                    }
                    
                    if(results.length === 1) {
                      const result = { type: LIST, value: results[0], rowspan: 1, colspan: results[0].length, meta: { ...loc, type: NATURALREF }, [CELL_TRACE]: cellTrace };
                      if(circularFlag) {
                            return { type: ERROR, value: CIRCULAR, meta: result, [CELL_TRACE]: cellTrace };
                        }
                      return result;
                    }
                    if(results.every(r => r.length === 1)) {
                      const result = { type: LIST, value: results.map(i => i[0]), rowspan: results.length, colspan: 1, meta: { ...loc, type: NATURALREF }, [CELL_TRACE]: cellTrace };
                      if(circularFlag) {
                            return { type: ERROR, value: CIRCULAR, meta: result, [CELL_TRACE]: cellTrace };
                        }
                      return result;
                    }
                    const result = {
                      type: MATRIX,
                        value: results,
                        get rowspan() { return results.length }, 
                        get colspan() { return results[0].length },
                        meta: { ...loc, type: NATURALREF },
                        [CELL_TRACE]: cellTrace
                   };
                   if(unsafestart.type === ERROR && unsafestart.value === CIRCULAR) {
                      return { ...unsafestart, type: ERROR, value: CIRCULAR, meta: result, [CELL_TRACE]: cellTrace };
                    }
                   if(circularFlag) {
                     return { type: ERROR, value: CIRCULAR, meta: result, [CELL_TRACE]: cellTrace };
                   }
                   
                    if(unsafeend.type === ERROR && unsafeend.value === CIRCULAR) {
                      return { ...unsafeend, type: ERROR, value: CIRCULAR, meta: result, [CELL_TRACE]: cellTrace };
                    }
                    return result;
                },
            peg$c131 = "\"\"",
            peg$c132 = peg$literalExpectation("\"\"", false),
            peg$c133 = function() {return { type: STRING, value: "", meta: { empty: true } }},
            peg$c134 = "\"",
            peg$c135 = peg$literalExpectation("\"", false),
            peg$c136 = "\\\"",
            peg$c137 = peg$literalExpectation("\\\"", false),
            peg$c138 = /^[^"]/,
            peg$c139 = peg$classExpectation(["\""], true, false),
            peg$c140 = function() { return text().replace(/\\\"/g, "\""); },
            peg$c141 = function(t) {return { type: STRING, value: t } },
            peg$c142 = peg$otherExpectation("number"),
            peg$c143 = function(num) { return num; },
            peg$c144 = ".",
            peg$c145 = peg$literalExpectation(".", false),
            peg$c146 = "%",
            peg$c147 = peg$literalExpectation("%", false),
            peg$c148 = function(percent) { return { type: NUMBER, value: (percent === "%" ? 0.01 : 1) * parseFloat(text(), 10) }; },
            peg$c149 = peg$otherExpectation("whitespace"),
            peg$c150 = /^[ \t\n\r]/,
            peg$c151 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),

            peg$currPos          = 0,
            peg$savedPos         = 0,
            peg$posDetailsCache  = [{ line: 1, column: 1 }],
            peg$maxFailPos       = 0,
            peg$maxFailExpected  = [],
            peg$silentFails      = 0,

            peg$result;

        if ("startRule" in options) {
          if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
          }

          peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
        }

        function text() {
          return input.substring(peg$savedPos, peg$currPos);
        }

        function peg$literalExpectation(text, ignoreCase) {
          return { type: "literal", text: text, ignoreCase: ignoreCase };
        }

        function peg$classExpectation(parts, inverted, ignoreCase) {
          return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
        }

        function peg$anyExpectation() {
          return { type: "any" };
        }

        function peg$endExpectation() {
          return { type: "end" };
        }

        function peg$otherExpectation(description) {
          return { type: "other", description: description };
        }

        function peg$computePosDetails(pos) {
          var details = peg$posDetailsCache[pos], p;

          if (details) {
            return details;
          } else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
              p--;
            }

            details = peg$posDetailsCache[p];
            details = {
              line:   details.line,
              column: details.column
            };

            while (p < pos) {
              if (input.charCodeAt(p) === 10) {
                details.line++;
                details.column = 1;
              } else {
                details.column++;
              }

              p++;
            }

            peg$posDetailsCache[pos] = details;
            return details;
          }
        }

        function peg$computeLocation(startPos, endPos) {
          var startPosDetails = peg$computePosDetails(startPos),
              endPosDetails   = peg$computePosDetails(endPos);

          return {
            start: {
              offset: startPos,
              line:   startPosDetails.line,
              column: startPosDetails.column
            },
            end: {
              offset: endPos,
              line:   endPosDetails.line,
              column: endPosDetails.column
            }
          };
        }

        function peg$fail(expected) {
          if (peg$currPos < peg$maxFailPos) { return; }

          if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
          }

          peg$maxFailExpected.push(expected);
        }

        function peg$buildStructuredError(expected, found, location) {
          return new peg$SyntaxError(
            peg$SyntaxError.buildMessage(expected, found),
            expected,
            found,
            location
          );
        }

        function peg$parseStart() {
          var s0;

          s0 = peg$parseEquasion();
          if (s0 === peg$FAILED) {
            s0 = peg$parseEscaped();
            if (s0 === peg$FAILED) {
              s0 = peg$parseNum();
              if (s0 === peg$FAILED) {
                s0 = peg$parseStatic();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseEmpty();
                }
              }
            }
          }

          return s0;
        }

        function peg$parseEmpty() {
          var s0, s1;

          s0 = peg$currPos;
          s1 = peg$c0;
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1();
          }
          s0 = s1;

          return s0;
        }

        function peg$parseEquasion() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 61) {
            s1 = peg$c2;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c3); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseExpression();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c4(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseEscaped() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c5;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseString();
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseStatic() {
          var s0, s1, s2;

          s0 = peg$currPos;
          if (peg$c8.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseString();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c10();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseString() {
          var s0, s1;

          s0 = [];
          if (input.length > peg$currPos) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c11); }
          }
          if (s1 !== peg$FAILED) {
            while (s1 !== peg$FAILED) {
              s0.push(s1);
              if (input.length > peg$currPos) {
                s1 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c11); }
              }
            }
          } else {
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseExpression() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseYExpression();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 61) {
                s5 = peg$c2;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c3); }
              }
              if (s5 === peg$FAILED) {
                if (input.substr(peg$currPos, 2) === peg$c12) {
                  s5 = peg$c12;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c13); }
                }
                if (s5 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c14) {
                    s5 = peg$c14;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c15); }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c16) {
                      s5 = peg$c16;
                      peg$currPos += 2;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c17); }
                    }
                    if (s5 === peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 60) {
                        s5 = peg$c18;
                        peg$currPos++;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c19); }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 62) {
                          s5 = peg$c20;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c21); }
                        }
                      }
                    }
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseYExpression();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 61) {
                  s5 = peg$c2;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c3); }
                }
                if (s5 === peg$FAILED) {
                  if (input.substr(peg$currPos, 2) === peg$c12) {
                    s5 = peg$c12;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c13); }
                  }
                  if (s5 === peg$FAILED) {
                    if (input.substr(peg$currPos, 2) === peg$c14) {
                      s5 = peg$c14;
                      peg$currPos += 2;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c15); }
                    }
                    if (s5 === peg$FAILED) {
                      if (input.substr(peg$currPos, 2) === peg$c16) {
                        s5 = peg$c16;
                        peg$currPos += 2;
                      } else {
                        s5 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c17); }
                      }
                      if (s5 === peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 60) {
                          s5 = peg$c18;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c19); }
                        }
                        if (s5 === peg$FAILED) {
                          if (input.charCodeAt(peg$currPos) === 62) {
                            s5 = peg$c20;
                            peg$currPos++;
                          } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c21); }
                          }
                        }
                      }
                    }
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseYExpression();
                    if (s7 !== peg$FAILED) {
                      s4 = [s4, s5, s6, s7];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c22(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseYExpression() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseXExpression();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 38) {
                s5 = peg$c23;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c24); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseXExpression();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 38) {
                  s5 = peg$c23;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c24); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseXExpression();
                    if (s7 !== peg$FAILED) {
                      s4 = [s4, s5, s6, s7];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c25(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseXExpression() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseXTerm();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 43) {
                s5 = peg$c26;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c27); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 45) {
                  s5 = peg$c28;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c29); }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseXTerm();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 43) {
                  s5 = peg$c26;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c27); }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 45) {
                    s5 = peg$c28;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c29); }
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseXTerm();
                    if (s7 !== peg$FAILED) {
                      s4 = [s4, s5, s6, s7];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c30(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseXTerm() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseTerm();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 42) {
                s5 = peg$c31;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c32); }
              }
              if (s5 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 47) {
                  s5 = peg$c33;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c34); }
                }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseTerm();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 42) {
                  s5 = peg$c31;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c32); }
                }
                if (s5 === peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 47) {
                    s5 = peg$c33;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c34); }
                  }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseTerm();
                    if (s7 !== peg$FAILED) {
                      s4 = [s4, s5, s6, s7];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c35(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseTerm() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parseFactor();
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 94) {
                s5 = peg$c36;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c37); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parseFactor();
                  if (s7 !== peg$FAILED) {
                    s4 = [s4, s5, s6, s7];
                    s3 = s4;
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              s4 = peg$parse_();
              if (s4 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 94) {
                  s5 = peg$c36;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c37); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    s7 = peg$parseFactor();
                    if (s7 !== peg$FAILED) {
                      s4 = [s4, s5, s6, s7];
                      s3 = s4;
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c38(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseList() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 123) {
            s1 = peg$c39;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parseInnerList();
            if (s2 !== peg$FAILED) {
              s3 = [];
              s4 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 59) {
                s5 = peg$c41;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c42); }
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parseInnerList();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s4;
                  s5 = peg$c43(s2, s6);
                  s4 = s5;
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              } else {
                peg$currPos = s4;
                s4 = peg$FAILED;
              }
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                s4 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 59) {
                  s5 = peg$c41;
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c42); }
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parseInnerList();
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s4;
                    s5 = peg$c43(s2, s6);
                    s4 = s5;
                  } else {
                    peg$currPos = s4;
                    s4 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s4;
                  s4 = peg$FAILED;
                }
              }
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 125) {
                  s4 = peg$c44;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c45); }
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c46(s2, s3);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseInnerList() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parseTrue();
          if (s1 === peg$FAILED) {
            s1 = peg$parseFalse();
            if (s1 === peg$FAILED) {
              s1 = peg$parseStr();
              if (s1 === peg$FAILED) {
                s1 = peg$parseNum();
              }
            }
          }
          if (s1 === peg$FAILED) {
            s1 = null;
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 44) {
              s4 = peg$c47;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c48); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parseTrue();
              if (s5 === peg$FAILED) {
                s5 = peg$parseFalse();
                if (s5 === peg$FAILED) {
                  s5 = peg$parseStr();
                  if (s5 === peg$FAILED) {
                    s5 = peg$parseNum();
                  }
                }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c49(s1, s5);
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
              s2.push(s3);
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s4 = peg$c47;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c48); }
              }
              if (s4 !== peg$FAILED) {
                s5 = peg$parseTrue();
                if (s5 === peg$FAILED) {
                  s5 = peg$parseFalse();
                  if (s5 === peg$FAILED) {
                    s5 = peg$parseStr();
                    if (s5 === peg$FAILED) {
                      s5 = peg$parseNum();
                    }
                  }
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c49(s1, s5);
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c50(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseFactor() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c51;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              s3 = peg$parseExpression();
              if (s3 !== peg$FAILED) {
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s5 = peg$c53;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c54); }
                  }
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c55(s3);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$parseList();
            if (s0 === peg$FAILED) {
              s0 = peg$parseFunction();
              if (s0 === peg$FAILED) {
                s0 = peg$parseIdentifyFunction();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseIntersection();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseTrue();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseFalse();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseFiniteRangeR1C1();
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseR1C1Cell();
                          if (s0 === peg$FAILED) {
                            s0 = peg$parseInfiniteRangeAZ();
                            if (s0 === peg$FAILED) {
                              s0 = peg$parseInfiniteRange09();
                              if (s0 === peg$FAILED) {
                                s0 = peg$parseFiniteRange();
                                if (s0 === peg$FAILED) {
                                  s0 = peg$parseCell();
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$parseStr();
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$parseNum();
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          return s0;
        }

        function peg$parseTrue() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c56) {
              s2 = peg$c56;
              peg$currPos += 4;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c57); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c58();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseFalse() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 5) === peg$c59) {
              s2 = peg$c59;
              peg$currPos += 5;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c60); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseCellSheetWorkbook() {
          var s0;

          s0 = peg$parseWorkbooksheetquote();
          if (s0 === peg$FAILED) {
            s0 = peg$parseSheetquote();
            if (s0 === peg$FAILED) {
              s0 = peg$parseWorkbooksheet();
              if (s0 === peg$FAILED) {
                s0 = peg$parseSheet();
              }
            }
          }

          return s0;
        }

        function peg$parseSheet() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          s1 = peg$currPos;
          if (peg$c62.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c63); }
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c64.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c65); }
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c64.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c65); }
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c66();
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 33) {
              s2 = peg$c67;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c68); }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c69(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseWorkbooksheet() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c70;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c71); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (peg$c62.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              if (peg$c72.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c73); }
              }
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                if (peg$c72.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c73); }
                }
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c66();
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c74;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseSheet();
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c76(s2, s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseSheetquote() {
          var s0, s1, s2, s3, s4;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c5;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            s3 = [];
            if (input.substr(peg$currPos, 2) === peg$c77) {
              s4 = peg$c77;
              peg$currPos += 2;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c78); }
            }
            if (s4 === peg$FAILED) {
              if (peg$c79.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c80); }
              }
            }
            if (s4 !== peg$FAILED) {
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (input.substr(peg$currPos, 2) === peg$c77) {
                  s4 = peg$c77;
                  peg$currPos += 2;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c78); }
                }
                if (s4 === peg$FAILED) {
                  if (peg$c79.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c80); }
                  }
                }
              }
            } else {
              s3 = peg$FAILED;
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s2;
              s3 = peg$c81();
            }
            s2 = s3;
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 39) {
                s3 = peg$c5;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c6); }
              }
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 33) {
                  s4 = peg$c67;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c68); }
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c82(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseWorkbooksheetquote() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 39) {
            s1 = peg$c5;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c6); }
          }
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 91) {
              s2 = peg$c70;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c71); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              s4 = [];
              if (input.substr(peg$currPos, 2) === peg$c83) {
                s5 = peg$c83;
                peg$currPos += 2;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c84); }
              }
              if (s5 === peg$FAILED) {
                if (peg$c85.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c86); }
                }
              }
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  if (input.substr(peg$currPos, 2) === peg$c83) {
                    s5 = peg$c83;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c84); }
                  }
                  if (s5 === peg$FAILED) {
                    if (peg$c85.test(input.charAt(peg$currPos))) {
                      s5 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c86); }
                    }
                  }
                }
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c87();
              }
              s3 = s4;
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 93) {
                  s4 = peg$c74;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c75); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$currPos;
                  s6 = [];
                  if (input.substr(peg$currPos, 2) === peg$c77) {
                    s7 = peg$c77;
                    peg$currPos += 2;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c78); }
                  }
                  if (s7 === peg$FAILED) {
                    if (peg$c79.test(input.charAt(peg$currPos))) {
                      s7 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c80); }
                    }
                  }
                  if (s7 !== peg$FAILED) {
                    while (s7 !== peg$FAILED) {
                      s6.push(s7);
                      if (input.substr(peg$currPos, 2) === peg$c77) {
                        s7 = peg$c77;
                        peg$currPos += 2;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c78); }
                      }
                      if (s7 === peg$FAILED) {
                        if (peg$c79.test(input.charAt(peg$currPos))) {
                          s7 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s7 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c80); }
                        }
                      }
                    }
                  } else {
                    s6 = peg$FAILED;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s5;
                    s6 = peg$c88();
                  }
                  s5 = s6;
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 39) {
                      s6 = peg$c5;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c6); }
                    }
                    if (s6 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 33) {
                        s7 = peg$c67;
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c68); }
                      }
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c89(s3, s5);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseCell() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseCellSheetWorkbook();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 36) {
                s3 = peg$c90;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c91); }
              }
              if (s3 === peg$FAILED) {
                s3 = null;
              }
              if (s3 !== peg$FAILED) {
                s4 = [];
                if (peg$c92.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c93); }
                }
                if (s5 !== peg$FAILED) {
                  while (s5 !== peg$FAILED) {
                    s4.push(s5);
                    if (peg$c92.test(input.charAt(peg$currPos))) {
                      s5 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c93); }
                    }
                  }
                } else {
                  s4 = peg$FAILED;
                }
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 36) {
                    s5 = peg$c90;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c91); }
                  }
                  if (s5 === peg$FAILED) {
                    s5 = null;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$currPos;
                    if (peg$c94.test(input.charAt(peg$currPos))) {
                      s7 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c95); }
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = [];
                      if (peg$c96.test(input.charAt(peg$currPos))) {
                        s9 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s9 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c97); }
                      }
                      while (s9 !== peg$FAILED) {
                        s8.push(s9);
                        if (peg$c96.test(input.charAt(peg$currPos))) {
                          s9 = input.charAt(peg$currPos);
                          peg$currPos++;
                        } else {
                          s9 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c97); }
                        }
                      }
                      if (s8 !== peg$FAILED) {
                        peg$savedPos = s6;
                        s7 = peg$c98();
                        s6 = s7;
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c99(s2, s3, s4, s5, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseR1C1Cell() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseCellSheetWorkbook();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 82) {
                s3 = peg$c100;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c101); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseR1C1CellAbs();
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 67) {
                    s5 = peg$c102;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c103); }
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parseR1C1CellAbs();
                    if (s6 !== peg$FAILED) {
                      s7 = peg$parse_();
                      if (s7 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c104(s2, s4, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseR1C1CellAbs() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c70;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c71); }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$currPos;
            if (peg$c94.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c95); }
            }
            if (s3 !== peg$FAILED) {
              s4 = [];
              if (peg$c96.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c97); }
              }
              while (s5 !== peg$FAILED) {
                s4.push(s5);
                if (peg$c96.test(input.charAt(peg$currPos))) {
                  s5 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c97); }
                }
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s2;
                s3 = peg$c105();
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s3 = peg$c74;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c75); }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c106(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$currPos;
            if (peg$c94.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c95); }
            }
            if (s2 !== peg$FAILED) {
              s3 = [];
              if (peg$c96.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c97); }
              }
              while (s4 !== peg$FAILED) {
                s3.push(s4);
                if (peg$c96.test(input.charAt(peg$currPos))) {
                  s4 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c97); }
                }
              }
              if (s3 !== peg$FAILED) {
                peg$savedPos = s1;
                s2 = peg$c105();
                s1 = s2;
              } else {
                peg$currPos = s1;
                s1 = peg$FAILED;
              }
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c107(s1);
            }
            s0 = s1;
          }

          return s0;
        }

        function peg$parseFiniteRangeR1C1() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseCellSheetWorkbook();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseR1C1Cell();
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s4 = peg$c108;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c109); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$parseR1C1Cell();
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c110(s2, s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseIdentifyFunction() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 40) {
              s2 = peg$c51;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c52); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseExpression();
              if (s3 !== peg$FAILED) {
                s4 = [];
                s5 = peg$currPos;
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 44) {
                    s7 = peg$c47;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c48); }
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parse_();
                    if (s8 !== peg$FAILED) {
                      s9 = peg$currPos;
                      s10 = peg$parseExpression();
                      if (s10 !== peg$FAILED) {
                        peg$savedPos = s9;
                        s10 = peg$c111(s3, s10);
                      }
                      s9 = s10;
                      if (s9 === peg$FAILED) {
                        s9 = peg$currPos;
                        s10 = peg$c0;
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s9;
                          s10 = peg$c112();
                        }
                        s9 = s10;
                      }
                      if (s9 !== peg$FAILED) {
                        s10 = peg$parse_();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s5;
                          s6 = peg$c113(s3, s9);
                          s5 = s6;
                        } else {
                          peg$currPos = s5;
                          s5 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  s5 = peg$currPos;
                  s6 = peg$parse_();
                  if (s6 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s7 = peg$c47;
                      peg$currPos++;
                    } else {
                      s7 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c48); }
                    }
                    if (s7 !== peg$FAILED) {
                      s8 = peg$parse_();
                      if (s8 !== peg$FAILED) {
                        s9 = peg$currPos;
                        s10 = peg$parseExpression();
                        if (s10 !== peg$FAILED) {
                          peg$savedPos = s9;
                          s10 = peg$c111(s3, s10);
                        }
                        s9 = s10;
                        if (s9 === peg$FAILED) {
                          s9 = peg$currPos;
                          s10 = peg$c0;
                          if (s10 !== peg$FAILED) {
                            peg$savedPos = s9;
                            s10 = peg$c112();
                          }
                          s9 = s10;
                        }
                        if (s9 !== peg$FAILED) {
                          s10 = peg$parse_();
                          if (s10 !== peg$FAILED) {
                            peg$savedPos = s5;
                            s6 = peg$c113(s3, s9);
                            s5 = s6;
                          } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s5;
                          s5 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                }
                if (s4 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 41) {
                    s5 = peg$c53;
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c54); }
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c114(s3, s4);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseFunction() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11;

          s0 = peg$currPos;
          s1 = peg$currPos;
          if (peg$c62.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c63); }
          }
          if (s2 !== peg$FAILED) {
            s3 = [];
            if (peg$c115.test(input.charAt(peg$currPos))) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c116); }
            }
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              if (peg$c115.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c116); }
              }
            }
            if (s3 !== peg$FAILED) {
              peg$savedPos = s1;
              s2 = peg$c117();
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 40) {
                s3 = peg$c51;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c52); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseExpression();
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  s5 = [];
                  s6 = peg$currPos;
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 44) {
                      s8 = peg$c47;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c48); }
                    }
                    if (s8 !== peg$FAILED) {
                      s9 = peg$parse_();
                      if (s9 !== peg$FAILED) {
                        s10 = peg$currPos;
                        s11 = peg$parseExpression();
                        if (s11 !== peg$FAILED) {
                          peg$savedPos = s10;
                          s11 = peg$c118(s1, s4, s11);
                        }
                        s10 = s11;
                        if (s10 === peg$FAILED) {
                          s10 = peg$currPos;
                          s11 = peg$c0;
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s10;
                            s11 = peg$c119();
                          }
                          s10 = s11;
                        }
                        if (s10 !== peg$FAILED) {
                          s11 = peg$parse_();
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s6;
                            s7 = peg$c120(s1, s4, s10);
                            s6 = s7;
                          } else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s6;
                    s6 = peg$FAILED;
                  }
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    s6 = peg$currPos;
                    s7 = peg$parse_();
                    if (s7 !== peg$FAILED) {
                      if (input.charCodeAt(peg$currPos) === 44) {
                        s8 = peg$c47;
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c48); }
                      }
                      if (s8 !== peg$FAILED) {
                        s9 = peg$parse_();
                        if (s9 !== peg$FAILED) {
                          s10 = peg$currPos;
                          s11 = peg$parseExpression();
                          if (s11 !== peg$FAILED) {
                            peg$savedPos = s10;
                            s11 = peg$c118(s1, s4, s11);
                          }
                          s10 = s11;
                          if (s10 === peg$FAILED) {
                            s10 = peg$currPos;
                            s11 = peg$c0;
                            if (s11 !== peg$FAILED) {
                              peg$savedPos = s10;
                              s11 = peg$c119();
                            }
                            s10 = s11;
                          }
                          if (s10 !== peg$FAILED) {
                            s11 = peg$parse_();
                            if (s11 !== peg$FAILED) {
                              peg$savedPos = s6;
                              s7 = peg$c120(s1, s4, s10);
                              s6 = s7;
                            } else {
                              peg$currPos = s6;
                              s6 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s6;
                            s6 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s6;
                          s6 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s6;
                        s6 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s6;
                      s6 = peg$FAILED;
                    }
                  }
                  if (s5 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 41) {
                      s6 = peg$c53;
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c54); }
                    }
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c121(s1, s4, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseIntersection() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseXFiniteRange();
            if (s2 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 32) {
                s3 = peg$c122;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c123); }
              }
              if (s3 !== peg$FAILED) {
                s4 = peg$parseXFiniteRange();
                if (s4 !== peg$FAILED) {
                  s5 = peg$parse_();
                  if (s5 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c124(s2, s4);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseInfiniteRangeAZ() {
          var s0, s1, s2, s3, s4, s5, s6, s7;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseCellSheetWorkbook();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              s4 = [];
              if (peg$c92.test(input.charAt(peg$currPos))) {
                s5 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c93); }
              }
              if (s5 !== peg$FAILED) {
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  if (peg$c92.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c93); }
                  }
                }
              } else {
                s4 = peg$FAILED;
              }
              if (s4 !== peg$FAILED) {
                peg$savedPos = s3;
                s4 = peg$c125();
              }
              s3 = s4;
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s4 = peg$c108;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c109); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$currPos;
                  s6 = [];
                  if (peg$c92.test(input.charAt(peg$currPos))) {
                    s7 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c93); }
                  }
                  if (s7 !== peg$FAILED) {
                    while (s7 !== peg$FAILED) {
                      s6.push(s7);
                      if (peg$c92.test(input.charAt(peg$currPos))) {
                        s7 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s7 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c93); }
                      }
                    }
                  } else {
                    s6 = peg$FAILED;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s5;
                    s6 = peg$c126();
                  }
                  s5 = s6;
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c127(s2, s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseInfiniteRange09() {
          var s0, s1, s2, s3, s4, s5, s6, s7, s8;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseCellSheetWorkbook();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              if (peg$c94.test(input.charAt(peg$currPos))) {
                s4 = input.charAt(peg$currPos);
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c95); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                if (peg$c96.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c97); }
                }
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  if (peg$c96.test(input.charAt(peg$currPos))) {
                    s6 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c97); }
                  }
                }
                if (s5 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c125();
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 58) {
                  s4 = peg$c108;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c109); }
                }
                if (s4 !== peg$FAILED) {
                  s5 = peg$currPos;
                  if (peg$c94.test(input.charAt(peg$currPos))) {
                    s6 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s6 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c95); }
                  }
                  if (s6 !== peg$FAILED) {
                    s7 = [];
                    if (peg$c96.test(input.charAt(peg$currPos))) {
                      s8 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c97); }
                    }
                    while (s8 !== peg$FAILED) {
                      s7.push(s8);
                      if (peg$c96.test(input.charAt(peg$currPos))) {
                        s8 = input.charAt(peg$currPos);
                        peg$currPos++;
                      } else {
                        s8 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c97); }
                      }
                    }
                    if (s7 !== peg$FAILED) {
                      peg$savedPos = s5;
                      s6 = peg$c126();
                      s5 = s6;
                    } else {
                      peg$currPos = s5;
                      s5 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                  if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c128(s2, s3, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseFiniteRange() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseXFiniteRange();
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c129(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseXFiniteRange() {
          var s0, s1, s2, s3;

          s0 = peg$currPos;
          s1 = peg$parseCell();
          if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
              s2 = peg$c108;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c109); }
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$parseCell();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c130(s1, s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parseStr() {
          var s0, s1, s2, s3, s4, s5;

          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c131) {
            s1 = peg$c131;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c132); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c133();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parse_();
            if (s1 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 34) {
                s2 = peg$c134;
                peg$currPos++;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c135); }
              }
              if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                s4 = [];
                if (input.substr(peg$currPos, 2) === peg$c136) {
                  s5 = peg$c136;
                  peg$currPos += 2;
                } else {
                  s5 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c137); }
                }
                if (s5 === peg$FAILED) {
                  if (peg$c138.test(input.charAt(peg$currPos))) {
                    s5 = input.charAt(peg$currPos);
                    peg$currPos++;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c139); }
                  }
                }
                while (s5 !== peg$FAILED) {
                  s4.push(s5);
                  if (input.substr(peg$currPos, 2) === peg$c136) {
                    s5 = peg$c136;
                    peg$currPos += 2;
                  } else {
                    s5 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c137); }
                  }
                  if (s5 === peg$FAILED) {
                    if (peg$c138.test(input.charAt(peg$currPos))) {
                      s5 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s5 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c139); }
                    }
                  }
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s3;
                  s4 = peg$c140();
                }
                s3 = s4;
                if (s3 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 34) {
                    s4 = peg$c134;
                    peg$currPos++;
                  } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c135); }
                  }
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parse_();
                    if (s5 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c141(s3);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }

          return s0;
        }

        function peg$parseNum() {
          var s0, s1, s2, s3;

          peg$silentFails++;
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseNumber();
            if (s2 !== peg$FAILED) {
              s3 = peg$parse_();
              if (s3 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c143(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c142); }
          }

          return s0;
        }

        function peg$parseNumber() {
          var s0, s1, s2, s3, s4, s5, s6;

          s0 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 43) {
            s1 = peg$c26;
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c27); }
          }
          if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
              s1 = peg$c28;
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c29); }
            }
            if (s1 === peg$FAILED) {
              s1 = peg$c0;
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c96.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c97); }
            }
            if (s3 !== peg$FAILED) {
              while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c96.test(input.charAt(peg$currPos))) {
                  s3 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c97); }
                }
              }
            } else {
              s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
              s3 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 46) {
                s4 = peg$c144;
                peg$currPos++;
              } else {
                s4 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c145); }
              }
              if (s4 !== peg$FAILED) {
                s5 = [];
                if (peg$c96.test(input.charAt(peg$currPos))) {
                  s6 = input.charAt(peg$currPos);
                  peg$currPos++;
                } else {
                  s6 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c97); }
                }
                if (s6 !== peg$FAILED) {
                  while (s6 !== peg$FAILED) {
                    s5.push(s6);
                    if (peg$c96.test(input.charAt(peg$currPos))) {
                      s6 = input.charAt(peg$currPos);
                      peg$currPos++;
                    } else {
                      s6 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c97); }
                    }
                  }
                } else {
                  s5 = peg$FAILED;
                }
                if (s5 !== peg$FAILED) {
                  s4 = [s4, s5];
                  s3 = s4;
                } else {
                  peg$currPos = s3;
                  s3 = peg$FAILED;
                }
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
              if (s3 === peg$FAILED) {
                s3 = null;
              }
              if (s3 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 37) {
                  s4 = peg$c146;
                  peg$currPos++;
                } else {
                  s4 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c147); }
                }
                if (s4 === peg$FAILED) {
                  s4 = null;
                }
                if (s4 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c148(s4);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          return s0;
        }

        function peg$parse_() {
          var s0, s1;

          peg$silentFails++;
          s0 = [];
          if (peg$c150.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c151); }
          }
          while (s1 !== peg$FAILED) {
            s0.push(s1);
            if (peg$c150.test(input.charAt(peg$currPos))) {
              s1 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c151); }
            }
          }
          peg$silentFails--;
          if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c149); }
          }

          return s0;
        }
            
            const stdop = (a,b,op,returntype,operation) => {
            	const {value:left,type:tleft,meta:{type:lstype}={}} = a;
                const {value:right,type:tright,meta:{type:rstype}={}} = b;
                if(tleft === ERROR) {
                    const e = new Error(left.description);
                    e.value = a;
                    throw e;
                }
                if(tright === ERROR) {
                    const e = new Error(right.description);
                    e.value = b;
                    throw e;
                }
                const Cell_Trace = [...(a[CELL_TRACE] || []),...(b[CELL_TRACE] || [])];
                const meta = {
                	left: a.meta||{},
                    right: b.meta||{},
                    operation
                };
                    if(tleft === LIST && tright === NUMBER) {
                    	return { type: LIST, value: left.map(({
                        	value,
                            meta:m = {},
                            ...rest
                        }, idx) => ({
                        	...rest,
                            type: returntype,
                            value: op(value,right),
                            meta: Object.assign(meta,{item: m,idx}),
                            [CELL_TRACE]: Cell_Trace
                        })) }
                    }
                    if(tleft === NUMBER && tright === LIST) {
                    	return { type: LIST, value: right.map(({
                        	value,
                            meta:m = {},
                            ...rest
                        },idx) => ({
                        	...rest,
                            type: returntype,
                            value: op(left,value),
                            meta: Object.assign(meta,{item: m,idx}),
                            [CELL_TRACE]: Cell_Trace
                        })) }
                    }
                    if(tleft === LIST && tright === LIST) {
                    	return {
                        	type: LIST,
                            value: left.map(({value,...rest},idx) => ({
                            	...rest,
                                ...right[idx],
                                meta: {
                                	...meta,
                                    item: {
                                    	left: rest.meta||{},
                                        right: right[idx].meta
                                    },
                                    idx,
                                },
                                type: returntype,
                                value: op(value,right[idx].value),
                                [CELL_TRACE]: Cell_Trace
                            }))
                        }
                        // todo: Maybe distiguish by natural vs inline list?
                    }
                	return { ...a, ...b, type: returntype, value: op(left,right), meta, [CELL_TRACE]: Cell_Trace };
            };
            
            const functions$1 = functions;
            
            // dynamic, from the outside
        	let xcontext = options._context;
            let currentcell = options._currentcell;
            let calledBy = options._calledBy || [];
            let parser = options._self;
            const allowUnsafe = options.allowUnsafe || false;
            
        	// static, internal
            const ccd= calledBy.concat([currentcell]);
            const ctx = { calledBy: ccd };
            const context = {
            	getWorkbook: (workbookName) => context,
            	getSheet: (sheetName) => context,
            	getRow: (row) => 
                  ({ 
                    getCol: (col) => {
                    	
                      if(ccd.some(({ row: r, col: c }) => row === r && col === c)) {
                       return { type: ERROR, value: CIRCULAR, chain: [{col, row}].concat(ccd), meta: {} };
                      } 
                      return xcontext.getRow(row, ctx).getCol(col, ctx)
                    }, 
                    all: () => {
                      const find = ccd.find(({ row: r }) => row === r);
                      if(find) {
                       return { type: ERROR, value: CIRCULAR, chain: [find].concat(ccd), meta: {} };
                      } 
                      return xcontext.getRow(row, ctx).all(ctx);
                    }
                  }),
                getCol: (col) => 
                  ({ 
                    getRow: (row) => {
                      if(ccd.some(({ row: r, col: c }) => row === r && col === c)) {
                       return { type: ERROR, value: CIRCULAR, chain: [{col, row}].concat(ccd), meta: {} };
                      } 
                      return xcontext.getCol(col, ctx).getRow(row, ctx);
                    }, 
                    all: () => {
                      const find = ccd.find(({ col: c }) => col === c);
                      if(find) {
                       return { type: ERROR, value: CIRCULAR, chain: [find].concat(ccd), meta: {} };
                      } 
                      return xcontext.getCol(col, ctx).all(ctx);
                    } 
                  })
            };
            


        peg$result = peg$startRuleFunction();

        if (peg$result !== peg$FAILED && peg$currPos === input.length) {
          return peg$result;
        } else {
          if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
          }

          throw peg$buildStructuredError(
            peg$maxFailExpected,
            peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
            peg$maxFailPos < input.length
              ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
              : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
          );
        }
      }

      return {
        CELL,
        STR_ESCAPED,
        STR_PLAIN,
        AGGREGATE,
        SUBTOTAL,
        NUMBER,
        COMPLEX_NUMBER,
        LIST,
        MATRIX,
        STRING,
        ANY,
        BOOLEAN,
        FUNCTION,
        ARGUMENTS,
        NULL,
        ARRAY,
        ERROR,
        DATE,
        TIME,
        DATETIME,
        TRACE,
        CELL_TRACE,
        HYPERLINK,
        NAVALUE,
        VVALUE,
        REFVALUE,
        NUMVALUE,
        DIV0,
        NULLE,
        NAMEE,
        GETTINGDATA,
        INLINE,
        HIDDEN,
        NATURALREF,
        CIRCULAR,
        SyntaxError: peg$SyntaxError,
        parse:       peg$parse
      };
    })();

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

    class Table extends EventTarget {
      constructor({ parser = parse } = { parser: parse }) {
        super();
        this.cells = [];
        this.parser = parser;
      }

      register(cell) {
          this.cells.push(cell);
      }
    }
    const globalTable = new Table();

    const findCell = ({ row: r, col: c }) => ({ row, col }) => row === r && col === c;
    const noop$1 = () => undefined;

    class Cell extends EventTarget {
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
          this.dispatchEvent({ type: "destroy" });
          this.onDestroy();
      }

      refresh(obj) {
        this._update(undefined, obj);
      }

      update(e) {
        this._update(e.target.value);
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
        const onError = observer.error|| maybeOnError || noop$1;
        const onComplete = observer.complete|| maybeOnComplete || noop$1;
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

    /* src\Cell.svelte generated by Svelte v3.22.2 */

    const { console: console_1 } = globals;
    const file = "src\\Cell.svelte";

    function create_fragment(ctx) {
    	let div;
    	let input0;
    	let input0_value_value;
    	let t;
    	let input1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input0 = element("input");
    			t = space();
    			input1 = element("input");
    			attr_dev(input0, "class", "formula svelte-ow3m57");
    			attr_dev(input0, "data-row", /*row*/ ctx[1]);
    			attr_dev(input0, "data-col", /*col*/ ctx[0]);
    			input0.value = input0_value_value = /*cell*/ ctx[2].formula || "";
    			add_location(input0, file, 25, 4, 731);
    			attr_dev(input1, "class", "value svelte-ow3m57");
    			attr_dev(input1, "tabindex", "-1");
    			input1.readOnly = true;
    			attr_dev(input1, "data-row", /*row*/ ctx[1]);
    			attr_dev(input1, "data-col", /*col*/ ctx[0]);
    			input1.value = /*displayValue*/ ctx[3];
    			add_location(input1, file, 26, 4, 841);
    			attr_dev(div, "class", "cell svelte-ow3m57");
    			add_location(div, file, 24, 0, 707);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input0);
    			append_dev(div, t);
    			append_dev(div, input1);
    			if (remount) dispose();

    			dispose = listen_dev(
    				input0,
    				"change",
    				function () {
    					if (is_function(/*cell*/ ctx[2].update)) /*cell*/ ctx[2].update.apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*row*/ 2) {
    				attr_dev(input0, "data-row", /*row*/ ctx[1]);
    			}

    			if (dirty & /*col*/ 1) {
    				attr_dev(input0, "data-col", /*col*/ ctx[0]);
    			}

    			if (dirty & /*cell*/ 4 && input0_value_value !== (input0_value_value = /*cell*/ ctx[2].formula || "") && input0.value !== input0_value_value) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*row*/ 2) {
    				attr_dev(input1, "data-row", /*row*/ ctx[1]);
    			}

    			if (dirty & /*col*/ 1) {
    				attr_dev(input1, "data-col", /*col*/ ctx[0]);
    			}

    			if (dirty & /*displayValue*/ 8 && input1.value !== /*displayValue*/ ctx[3]) {
    				prop_dev(input1, "value", /*displayValue*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { col } = $$props;
    	let { row } = $$props;

    	let cell = new Cell({
    			onUpdate: (__, c) => {
    				$$invalidate(2, cell = c);

    				// cell.table.parser -> has all the constants to customize errors
    				const logv = typeof cell.value.value === "symbol"
    				? cell.value.value.toString()
    				: cell.value.value;

    				console.log(`Cell ${row},${col} updated; ${logv}`);
    			},
    			row,
    			col,
    			allowUnsafe: true
    		});

    	let displayValue = "";
    	onDestroy(cell.destroy);
    	const writable_props = ["col", "row"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Cell", $$slots, []);

    	$$self.$set = $$props => {
    		if ("col" in $$props) $$invalidate(0, col = $$props.col);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		Cell,
    		col,
    		row,
    		cell,
    		displayValue
    	});

    	$$self.$inject_state = $$props => {
    		if ("col" in $$props) $$invalidate(0, col = $$props.col);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    		if ("cell" in $$props) $$invalidate(2, cell = $$props.cell);
    		if ("displayValue" in $$props) $$invalidate(3, displayValue = $$props.displayValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*cell*/ 4) {
    			 {
    				$$invalidate(3, displayValue = typeof cell.value.value === "symbol"
    				? cell.value.value.toString()
    				: cell.value.value);
    			}
    		}
    	};

    	return [col, row, cell, displayValue];
    }

    class Cell_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { col: 0, row: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell_1",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*col*/ ctx[0] === undefined && !("col" in props)) {
    			console_1.warn("<Cell> was created without expected prop 'col'");
    		}

    		if (/*row*/ ctx[1] === undefined && !("row" in props)) {
    			console_1.warn("<Cell> was created without expected prop 'row'");
    		}
    	}

    	get col() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set col(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.22.2 */
    const file$1 = "src\\App.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[3] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (14:4) {#each { length: tableSize.width } as _, a}
    function create_each_block_2(ctx) {
    	let th;
    	let t_value = String.fromCharCode(/*a*/ ctx[5] + 65) + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-retk54");
    			add_location(th, file$1, 14, 5, 227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(14:4) {#each { length: tableSize.width } as _, a}",
    		ctx
    	});

    	return block;
    }

    // (23:5) {#each { length: tableSize.width } as _, a}
    function create_each_block_1(ctx) {
    	let td;
    	let current;

    	const cell = new Cell_1({
    			props: { col: /*a*/ ctx[5], row: /*b*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			td = element("td");
    			create_component(cell.$$.fragment);
    			attr_dev(td, "class", "svelte-retk54");
    			add_location(td, file$1, 23, 6, 438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			mount_component(cell, td, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_component(cell);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(23:5) {#each { length: tableSize.width } as _, a}",
    		ctx
    	});

    	return block;
    }

    // (20:3) {#each { length: tableSize.height } as _, b}
    function create_each_block(ctx) {
    	let tr;
    	let th;
    	let t0_value = /*b*/ ctx[3] + 1 + "";
    	let t0;
    	let t1;
    	let t2;
    	let current;
    	let each_value_1 = { length: /*tableSize*/ ctx[0].width };
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(th, "class", "svelte-retk54");
    			add_location(th, file$1, 21, 5, 368);
    			add_location(tr, file$1, 20, 4, 358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th);
    			append_dev(th, t0);
    			append_dev(tr, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(20:3) {#each { length: tableSize.height } as _, b}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th;
    	let t2;
    	let t3;
    	let tbody;
    	let current;
    	let each_value_2 = { length: /*tableSize*/ ctx[0].width };
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = { length: /*tableSize*/ ctx[0].height };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Table demo";
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th = element("th");
    			t2 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-retk54");
    			add_location(h1, file$1, 8, 1, 113);
    			attr_dev(th, "class", "svelte-retk54");
    			add_location(th, file$1, 12, 4, 164);
    			add_location(tr, file$1, 11, 3, 155);
    			add_location(thead, file$1, 10, 2, 144);
    			add_location(tbody, file$1, 18, 2, 298);
    			attr_dev(table, "class", "svelte-retk54");
    			add_location(table, file$1, 9, 1, 134);
    			attr_dev(main, "class", "svelte-retk54");
    			add_location(main, file$1, 7, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th);
    			append_dev(tr, t2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*String*/ 0) {
    				each_value_2 = { length: /*tableSize*/ ctx[0].width };
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*tableSize*/ 1) {
    				each_value = { length: /*tableSize*/ ctx[0].height };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const tableSize = { width: 24, height: 100 };
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Cell: Cell_1, tableSize });
    	return [tableSize];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
