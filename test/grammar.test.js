import parser, { parse } from "../index";
import functions from "../functions"

jest.mock('../functions');

describe('Test number parsing', () => {
  test("parses '1'", () => {
    const result = parse('1');
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
  [0,1,10,100,1000,123456,1234567890].forEach(i => {
    test(`parses '${i}'`, () => {
      const result = parse(`${i}`);
      expect(result.type).toBe(parser.NUMBER);
      expect(result.value).toBe(i);
    });
  });
  [-1,-10,-100,-1000,-123456,-1234567890].forEach(i => {
    test(`parses '${i}'`, () => {
      const result = parse(`${i}`);
      expect(result.type).toBe(parser.NUMBER);
      expect(result.value).toBe(i);
    });
  });
  test(`parses '-0'`, () => {
    const result = parse(`-0`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(-0);
  });
  test(`parses ' 1'`, () => {
    const result = parse(` 1`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });

  [0.123,1.1,0.10,2.100,-2.1,2.123456,2.123456789, 123456789.123456789].forEach(i => {
    test(`parses '${i}'`, () => {
      const result = parse(`${i}`);
      expect(result.type).toBe(parser.NUMBER);
      expect(result.value).toBe(i);
    });
  });

  test(`parses '+1'`, () => {
    const result = parse(`+1`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
  test(`parses ' +1'`, () => {
    const result = parse(` +1`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
});

describe('Test string parsing', () => {
  test("parses 'Hello'", () => {
    const result = parse('Hello');
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("Hello");
  });
  ["Hello World", " ", "  ", '""', "$", "_1", "a1", "!", `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Bibendum arcu vitae elementum curabitur vitae. Purus in massa tempor nec feugiat nisl pretium fusce. Netus et malesuada fames ac turpis egestas. Et ligula ullamcorper malesuada proin libero nunc consequat interdum. Id venenatis a condimentum vitae sapien pellentesque habitant morbi. Ut enim blandit volutpat maecenas volutpat blandit. Laoreet non curabitur gravida arcu. Morbi tempus iaculis urna id volutpat lacus. Nunc mattis enim ut tellus elementum sagittis vitae. Purus viverra accumsan in nisl. Ut pharetra sit amet aliquam id diam maecenas ultricies.

  Magna eget est lorem ipsum dolor sit amet. Nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus. Pellentesque sit amet porttitor eget dolor morbi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. In massa tempor nec feugiat nisl pretium. Id leo in vitae turpis massa sed elementum. Ultricies tristique nulla aliquet enim tortor at auctor urna. Eu lobortis elementum nibh tellus molestie. Tincidunt lobortis feugiat vivamus at augue eget. Aliquet lectus proin nibh nisl condimentum id venenatis. Tellus in hac habitasse platea dictumst. Posuere urna nec tincidunt praesent semper feugiat nibh. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Venenatis cras sed felis eget. Dignissim enim sit amet venenatis. Mattis enim ut tellus elementum sagittis vitae et. Ornare massa eget egestas purus viverra accumsan in nisl. Quis ipsum suspendisse ultrices gravida dictum fusce ut placerat. Rhoncus est pellentesque elit ullamcorper.`].forEach(i => {
    test(`parses '${i}'`, () => {
      const result = parse(`${i}`);
      expect(result.type).toBe(parser.STRING);
      expect(result.value).toBe(i);
    });
  });
  [`'`, `*1`, `/1`].forEach(i => {
    test(`parses '${i}'`, () => {
      const result = () => parse(`${i}`);
      expect(result).toThrow();
    });
  });
  test("parses ''='", () => {
    const result = parse(`'=`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("=");
  });
  test("parses ''*1'", () => {
    const result = parse(`'*1`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("*1");
  });
  test("parses ''/1'", () => {
    const result = parse(`'/1`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("/1");
  });
  test("parses ''foo'", () => {
    const result = parse(`'foo`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("foo");
  });
  test("parses ''''", () => {
    const result = parse(`''`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("'");
  });
  
});

describe("Boolean parsing", () => {
  test("parses 'TRUE'", () => {
    const result = parse(`TRUE`);
    expect(result.type).toBe(parser.BOOLEAN);
    expect(result.value).toBe(true);
  });
  test(`parses 'FALSE'`, () => {
    const result = parse(`FALSE`);
    expect(result.type).toBe(parser.BOOLEAN);
    expect(result.value).toBe(false);
  });
});

describe("Null parsing", () => {
  test("parses ''", () => {
    const result = parse(``);
    expect(result.type).toBe(parser.NULL);
    expect(result.value).toBe(null);
  });
});

describe("Formula parsing", () => {
  

  beforeAll(() => {
    functions.SUM.mockImplementation(() => {
      return { value: 1, type: parser.NUMBER };
    });
  });

  test("parses '=1'", () => {
    const result = parse(`=1`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
  test(`parses '="1"'`, () => {
    const result = parse(`="1"`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("1");
  });
  test(`parses '="Hello"'`, () => {
    const result = parse(`="Hello"`);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("Hello");
  });
  test(`parses '=SUM()'`, () => {
    jest.clearAllMocks();
    const result = parse(`=SUM()`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
    expect(functions.SUM).toHaveBeenCalled();
    expect(functions.SUM).toHaveBeenCalledTimes(1);

  });
  test(`Passes on arguments to function calls`, () => {
    jest.clearAllMocks();
    const result = parse(`=SUM(1, 2, "Hello", TRUE)`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
    expect(functions.SUM).toHaveBeenCalled();
    expect(functions.SUM).toHaveBeenCalledTimes(1);
    const callArgs = functions.SUM.mock.calls[0][0];
    expect(callArgs).toHaveLength(4);
    const [arg1, arg2, arg3, arg4] = callArgs;
    expect(arg1.value).toBe(1);
    expect(arg2.value).toBe(2);
    expect(arg3.value).toBe("Hello");
    expect(arg4.value).toBe(true);
  });
  test(`Passes on arguments to function calls`, () => {
    jest.clearAllMocks();
    const result = parse(`=SUM(SUM(SUM(1)))+SUM(1)`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(2);
    expect(functions.SUM).toHaveBeenCalledTimes(4);
  });
  test(`parses Lists`, () => {
    const result = parse(`={1,2,3}`);
    expect(result.type).toBe(parser.LIST);
    expect(result.value).toBeInstanceOf(Array);
    expect(result.value[0].value).toBe(1);
    expect(result.value[1].value).toBe(2);
    expect(result.value[2].value).toBe(3);
  });
  test(`parses Arrays`, () => {
    const result = parse(`={1,2,3;4,5,6}`);
    expect(result.type).toBe(parser.MATRIX);
    expect(result.value).toBeInstanceOf(Array);
    expect(result.value[0][0].value).toBe(1);
    expect(result.value[0][1].value).toBe(2);
    expect(result.value[0][2].value).toBe(3);
    expect(result.value[1][0].value).toBe(4);
    expect(result.value[1][1].value).toBe(5);
    expect(result.value[1][2].value).toBe(6);
  });
});

describe(`ignores whitespace`, () => {
  test("parses '=  1 '", () => {
    const result = parse(`=  1 `);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
  test(`parses '=  " 1"  '`, () => {
    const result = parse(`=  " 1"  `);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe(" 1");
  });
  test(`parses '=     "Hello"    '`, () => {
    const result = parse(`=    "Hello"    `);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe("Hello");
  });
  test(`parses '= SUM(    )'`, () => {
    jest.clearAllMocks();
    const result = parse(`= SUM(    )`);
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
    expect(functions.SUM).toHaveBeenCalled();
    expect(functions.SUM).toHaveBeenCalledTimes(1);
  });
  test(`parses Lists`, () => {
    const result = parse(`= { 1 ,2   ,   3   }`);
    expect(result.type).toBe(parser.LIST);
    expect(result.value).toBeInstanceOf(Array);
    expect(result.value[0].value).toBe(1);
    expect(result.value[1].value).toBe(2);
    expect(result.value[2].value).toBe(3);
  });
  test(`parses Arrays`, () => {
    const result = parse(`={1 ,2  ,3 ; 4  , 5,   6}   `);
    expect(result.type).toBe(parser.MATRIX);
    expect(result.value).toBeInstanceOf(Array);
    expect(result.value[0][0].value).toBe(1);
    expect(result.value[0][1].value).toBe(2);
    expect(result.value[0][2].value).toBe(3);
    expect(result.value[1][0].value).toBe(4);
    expect(result.value[1][1].value).toBe(5);
    expect(result.value[1][2].value).toBe(6);
  });
  test(`parses '  TRUE  '`, () => {
    // While unintuative, excel actually parses it like that!
    const result = parse(`   TRUE   `);
    expect(result.type).toBe(parser.STRING);
    expect(result.value).toBe(`   TRUE   `);
  });
});

describe(`parses operations`, () => {
  

  const testcases = [
    {
      "desc": "Addition",
      "result": 2,
      "formula": "=1+1"
    },
    {
      "desc": "String of Number + Int",
      "result": 2,
      "formula": "=\"1\"+1"
    },
    {
      "desc": "Int + String of Number",
      "result": 2,
      "formula": "=1+\"1\""
    },
    {
      "desc": "String + Int",
      "result": parser.VVALUE,
      "formula": "=\"Hello\"+1"
    },
    {
      "desc": "String with number + Int",
      "result": parser.VVALUE,
      "formula": "=\"1H\"+1"
    },
    {
      "desc": "Addition",
      "result": 6,
      "formula": "=3+3"
    },
    {
      "desc": "Subtraction",
      "result": 2,
      "formula": "=3-1"
    },
    {
      "desc": "Negation",
      "result": -1,
      "formula": "=-1"
    },
    {
      "desc": "Multiplication",
      "result": 9,
      "formula": "=3*3"
    },
    {
      "desc": "Division",
      "result": 1,
      "formula": "=3/3"
    },
    {
      "desc": "Percent",
      "result": 0.2,
      "formula": "=20%"
    },
    {
      "desc": "Exponentiation",
      "result": 27,
      "formula": "=3^3"
    },
    {
      "desc": "Equal to",
      "result": false,
      "formula": "=1=2"
    },
    {
      "desc": "Greater than",
      "result": false,
      "formula": "=1>2"
    },
    {
      "desc": "Less than",
      "result": true,
      "formula": "=1<2"
    },
    {
      "desc": "Greater than or equal to",
      "result": false,
      "formula": "=1>=2"
    },
    {
      "desc": "Less than or equal to",
      "result": true,
      "formula": "=1<=2"
    },
    {
      "desc": "Not equal to",
      "result": true,
      "formula": "=1<>2"
    },
    {
      "desc": "Connects, or concatenates, two values to produce one continuous text value.",
      "result": "Northwind",
      "formula": `="North"&"wind"`
    },
    {
      "desc": "–",
      "result": -1,
      "formula": "=2*-1 + 1"
    },
    {
      "desc": "",
      "result": 3,
      "formula": "=1--1*2"
    },
    {
      "desc": "",
      "result": -6,
      "formula": "=-3+-3"
    },
    {
      "desc": "%",
      "result": 2.2,
      "formula": "=1+20%+1"
    },
    {
      "desc": "%",
      "result": 1.21,
      "formula": "=(1+20)%+1"
    },
    {
      "desc": "^",
      "result": 48,
      "formula": "=3*4^2"
    },
    {
      "desc": "^",
      "result": 144,
      "formula": "=(3*4)^2"
    },
    {
      "desc": "* and /",
      "result": 12,
      "formula": "=3+3*3"
    },
    {
      "desc": "* and /",
      "result": 7,
      "formula": "=12-10/2"
    },
    {
      "desc": "* and /",
      "result": 18,
      "formula": "=(3+3)*3"
    },
    {
      "desc": "* and /",
      "result": 1,
      "formula": "=(12-10)/2"
    },
    {
      "desc": "+ and –",
      "result": "125",
      "formula": "=7+5&5"
    },
    {
      "desc": "+ and –",
      "result": 62,
      "formula": "=7+(5&5)"
    },
    {
      "desc": "+ and –",
      "result": "25",
      "formula": "=7-5&5"
    },
    {
      "desc": "+ and –",
      "result": -48,
      "formula": "=7-(5&5)"
    },
    {
      "desc": "&",
      "result": false,
      "formula": "=1=1&5"
    },
    {
      "desc": "",
      "result": "TRUE5",
      "formula": "=(1=1)&5"
    },
    {
      "desc": "=",
      "result": true,
      "formula": "=1=1<>FALSE"
    },
    {
      "desc": "=",
      "result": false,
      "formula": "=1=(1<>FALSE)"
    },
    {
      "desc": ">",
      "result": true,
      "formula": "=5>1<>FALSE"
    },
    {
      "desc": ">",
      "result": false,
      "formula": "=5>(1<>FALSE)"
    },
    {
      "desc": "<",
      "result": false,
      "formula": "=FALSE<>1+1<5"
    },
    {
      "desc": "<",
      "result": true,
      "formula": "=(FALSE<>1)+1<5"
    },
    {
      "desc": "<=",
      "result": false,
      "formula": "=FALSE<>1+1<=5"
    },
    {
      "desc": "<=",
      "result": true,
      "formula": "=(FALSE<>1)+1<=5"
    },
    {
      "desc": ">=",
      "result": true,
      "formula": "=5>=1<>FALSE"
    },
    {
      "desc": ">=",
      "result": false,
      "formula": "=5>=(1<>FALSE)"
    },
    {
      "desc": "<>",
      "result": false,
      "formula": "=1<>0<=5"
    },
    {
      "desc": "<>",
      "result": true,
      "formula": "=1<>(0<=5)"
    },
    {
      "desc": "<>",
      "result": -1,
      "formula": "=-(1<>2)"
    },
    {
      "desc": "<>",
      "result": true,
      "formula": "=-1<>2"
    }
  ];
  testcases.forEach(({ desc, result: r, formula }) => {
    test(`${desc} ('${formula}' = ${String(r)})`, () => {
      const result = parse(formula);
      expect(result.value).toBe(r);
    });
  });

});





