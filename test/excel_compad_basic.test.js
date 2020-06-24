import parser, { parse } from "../index";

const testCases = [
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "&",
      "Formula": "=\"Hello\" &\"Hello\" ",
      "Result": "HelloHello",
      "Type": "STRING"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "&",
      "Formula": "=1&\"Hello\" ",
      "Result": "1Hello",
      "Type": "STRING"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "&",
      "Formula": "=TRUE&\"Hello\" ",
      "Result": "TRUEHello",
      "Type": "STRING"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "&",
      "Formula": "=\"Hello\" &1",
      "Result": "Hello1",
      "Type": "STRING"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "&",
      "Formula": "=1&1",
      "Result": "11",
      "Type": "STRING"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "&",
      "Formula": "=TRUE&1",
      "Result": "TRUE1",
      "Type": "STRING"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "&",
      "Formula": "=\"Hello\" &TRUE",
      "Result": "HelloTRUE",
      "Type": "STRING"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "&",
      "Formula": "=1&TRUE",
      "Result": "1TRUE",
      "Type": "STRING"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "&",
      "Formula": "=TRUE&TRUE",
      "Result": "TRUETRUE",
      "Type": "STRING"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "+",
      "Formula": "=\"Hello\" +\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "+",
      "Formula": "=1+\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "+",
      "Formula": "=TRUE+\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "+",
      "Formula": "=\"Hello\" +1",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "+",
      "Formula": "=1+1",
      "Result": 2,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "+",
      "Formula": "=TRUE+1",
      "Result": 2,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "+",
      "Formula": "=\"Hello\" +TRUE",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "+",
      "Formula": "=1+TRUE",
      "Result": 2,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "+",
      "Formula": "=TRUE+TRUE",
      "Result": 2,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "-",
      "Formula": "=\"Hello\" -\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "-",
      "Formula": "=1-\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "-",
      "Formula": "=TRUE-\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "-",
      "Formula": "=\"Hello\" -1",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "-",
      "Formula": "=1-1",
      "Result": 0,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "-",
      "Formula": "=TRUE-1",
      "Result": 0,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "-",
      "Formula": "=\"Hello\" -TRUE",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "-",
      "Formula": "=1-TRUE",
      "Result": 0,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "-",
      "Formula": "=TRUE-TRUE",
      "Result": 0,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "*",
      "Formula": "=\"Hello\" *\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "*",
      "Formula": "=1*\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "*",
      "Formula": "=TRUE*\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "*",
      "Formula": "=\"Hello\" *1",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "*",
      "Formula": "=1*1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "*",
      "Formula": "=TRUE*1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "*",
      "Formula": "=\"Hello\" *TRUE",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "*",
      "Formula": "=1*TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "*",
      "Formula": "=TRUE*TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "/",
      "Formula": "=\"Hello\" /\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "/",
      "Formula": "=1/\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "/",
      "Formula": "=TRUE/\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "/",
      "Formula": "=\"Hello\" /1",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "/",
      "Formula": "=1/1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "/",
      "Formula": "=TRUE/1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "/",
      "Formula": "=\"Hello\" /TRUE",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "/",
      "Formula": "=1/TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "/",
      "Formula": "=TRUE/TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "^",
      "Formula": "=\"Hello\" ^\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "^",
      "Formula": "=1^\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "^",
      "Formula": "=TRUE^\"Hello\" ",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "^",
      "Formula": "=\"Hello\" ^1",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "^",
      "Formula": "=1^1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "^",
      "Formula": "=TRUE^1",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "^",
      "Formula": "=\"Hello\" ^TRUE",
      "Result": parser.VVALUE,
      "Type": "ERROR"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "^",
      "Formula": "=1^TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "^",
      "Formula": "=TRUE^TRUE",
      "Result": 1,
      "Type": "NUMBER"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "=",
      "Formula": "=\"Hello\" =\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "=",
      "Formula": "=1=\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "=",
      "Formula": "=TRUE=\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "=",
      "Formula": "=\"Hello\" =1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "=",
      "Formula": "=1=1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "=",
      "Formula": "=TRUE=1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "=",
      "Formula": "=\"Hello\" =TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "=",
      "Formula": "=1=TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "=",
      "Formula": "=TRUE=TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "<>",
      "Formula": "=\"Hello\" <>\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "<>",
      "Formula": "=1<>\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "<>",
      "Formula": "=TRUE<>\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "<>",
      "Formula": "=\"Hello\" <>1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "<>",
      "Formula": "=1<>1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "<>",
      "Formula": "=TRUE<>1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "<>",
      "Formula": "=\"Hello\" <>TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "<>",
      "Formula": "=1<>TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "<>",
      "Formula": "=TRUE<>TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": ">",
      "Formula": "=\"Hello\" >\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": ">",
      "Formula": "=1>\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": ">",
      "Formula": "=TRUE>\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": ">",
      "Formula": "=\"Hello\" >1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": ">",
      "Formula": "=1>1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": ">",
      "Formula": "=TRUE>1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": ">",
      "Formula": "=\"Hello\" >TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": ">",
      "Formula": "=1>TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": ">",
      "Formula": "=TRUE>TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "<",
      "Formula": "=\"Hello\" <\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "<",
      "Formula": "=1<\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "<",
      "Formula": "=TRUE<\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "<",
      "Formula": "=\"Hello\" <1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "<",
      "Formula": "=1<1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "<",
      "Formula": "=TRUE<1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "<",
      "Formula": "=\"Hello\" <TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "<",
      "Formula": "=1<TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "<",
      "Formula": "=TRUE<TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": ">=",
      "Formula": "=\"Hello\" >=\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": ">=",
      "Formula": "=1>=\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": ">=",
      "Formula": "=TRUE>=\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": ">=",
      "Formula": "=\"Hello\" >=1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": ">=",
      "Formula": "=1>=1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": ">=",
      "Formula": "=TRUE>=1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": ">=",
      "Formula": "=\"Hello\" >=TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": ">=",
      "Formula": "=1>=TRUE",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": ">=",
      "Formula": "=TRUE>=TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "\"Hello\" ",
      "OP": "<=",
      "Formula": "=\"Hello\" <=\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "\"Hello\" ",
      "OP": "<=",
      "Formula": "=1<=\"Hello\" ",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "\"Hello\" ",
      "OP": "<=",
      "Formula": "=TRUE<=\"Hello\" ",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "1",
      "OP": "<=",
      "Formula": "=\"Hello\" <=1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "1",
      "OP": "<=",
      "Formula": "=1<=1",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "1",
      "OP": "<=",
      "Formula": "=TRUE<=1",
      "Result": false,
      "Type": "BOOLEAN"
    },
    {
      "A": "\"Hello\" ",
      "B": "TRUE",
      "OP": "<=",
      "Formula": "=\"Hello\" <=TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "1",
      "B": "TRUE",
      "OP": "<=",
      "Formula": "=1<=TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    },
    {
      "A": "TRUE",
      "B": "TRUE",
      "OP": "<=",
      "Formula": "=TRUE<=TRUE",
      "Result": true,
      "Type": "BOOLEAN"
    }
  ];

  describe("parses basic excel operations", () => {
    testCases.forEach(({ OP, Type, Result: r, Formula }) => {
        test(`${OP} ('${Formula}' = ${String(r)})`, () => {
          const result = parse(Formula);
          expect(result.value).toBe(r);
          expect(result.type).toBe(parser[Type]);
        });
      });
  });
