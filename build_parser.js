const fs = require("fs");
const peg = require("pegjs");

const grammar = fs.readFileSync('./grammar.peg', 'utf8');

const typedefs = `{
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
    OPERATION,
    R1C1PARTIAL,
    FUNCTIONCALL,
    RANGE,
    CC2Currency
}`; 

const parserSource = peg.generate(grammar, {
    dependencies: {
        [typedefs]: "./types",
        "functionDefinitions": "./functions"
    },
    format: "es",
    output: "source"
});

fs.writeFileSync('./parser.js', parserSource);
