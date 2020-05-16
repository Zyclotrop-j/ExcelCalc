import parse from "./parser";



/*

let xcontext = {
    getCell: ({ row, col }, { calledBy }) => _context[row] && _context[row][col],
    getRow: (row, { calledBy }) => ({ getCol: (col, { calledBy }) => _context[row] && _context[row][col], all: ({ calledBy }, { calledBy: cb2 } = {}) => _context[row] }),
    getCol: (col, { calledBy }) => ({ getRow: (row, { calledBy }) => _context[row] && _context[row][col], all: ({ calledBy }, { calledBy: cb2 } = {}) => _context.map(i => i[col]) })
};

const meta = {
    _context: xcontext,
    _currentcell: { row: 0, col: 0 }, // cell this formula is in
    _calledBy: [] // 
};

const expression => parse(expression, {
    ...meta,
    _self: (exp, ctx) => parse(exp, {
        ...meta,
        ...ctx
    }),
});

*/

export default parse;

