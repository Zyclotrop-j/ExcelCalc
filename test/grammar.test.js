import parser, { parse } from "../index";

describe('Test number parsing', () => {
  test("parses '1'", () => {
    const result = parse('1');
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(1);
  });
  test("parses '2'", () => {
    const result = parse('2');
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(2);
  });
  test("parses '3'", () => {
    const result = parse('3');
    expect(result.type).toBe(parser.NUMBER);
    expect(result.value).toBe(2);
  });
});




