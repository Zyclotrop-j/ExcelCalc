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
  
});





