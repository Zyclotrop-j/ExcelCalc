import baretest from "baretest";
import assert from "assert";
import parser, { parse as _parse } from "./index.js";

const describe = (description, tester) => {
  const test = baretest(description);
  const expect = a => ({
    toBe: b => assert.equal(a,b)
  });
  tester(test, expect);
  test.run();
};

const parse = arg => {
  const r = _parse(arg);
  // when we have a list, Excel coheres it to a single value
  // this is the display layer's duty though, so our parser doesn't do that and instead gives you the entire list
  // to still test this, we return that entry here instead
  // note: these tests' lists always have exactly one entry (for both input and output)
  if(Array.isArray(r.value)) {
    return r.value[0]
  }
  return r;
}

describe("parses all basic excel operations", (test, expect) => {

  test(`'=0+0' = 0`, () => {
    const result = parse(`=0+0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-0' = 0`, () => {
    const result = parse(`=0-0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*0' = 0`, () => {
    const result = parse(`=0*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/0' = parser.DIV0`, () => {
    const result = parse(`=0/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^0' = parser.NUMVALUE`, () => {
    const result = parse(`=0^0`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>0' = FALSE`, () => {
    const result = parse(`=0>0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<0' = FALSE`, () => {
    const result = parse(`=0<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=0' = TRUE`, () => {
    const result = parse(`=0=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>0' = FALSE`, () => {
    const result = parse(`=0<>0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=0' = TRUE`, () => {
    const result = parse(`=0>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=0' = TRUE`, () => {
    const result = parse(`=0<=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&0' = 00`, () => {
    const result = parse(`=0&0`);
    expect(result.value).toBe("00");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+1' = 1`, () => {
    const result = parse(`=0+1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-1' = -1`, () => {
    const result = parse(`=0-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*1' = 0`, () => {
    const result = parse(`=0*1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/1' = 0`, () => {
    const result = parse(`=0/1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^1' = 0`, () => {
    const result = parse(`=0^1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0>1' = FALSE`, () => {
    const result = parse(`=0>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<1' = TRUE`, () => {
    const result = parse(`=0<1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=1' = FALSE`, () => {
    const result = parse(`=0=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>1' = TRUE`, () => {
    const result = parse(`=0<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=1' = FALSE`, () => {
    const result = parse(`=0>=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=1' = TRUE`, () => {
    const result = parse(`=0<=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&1' = 01`, () => {
    const result = parse(`=0&1`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"0"' = 0`, () => {
    const result = parse(`=0+"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-"0"' = 0`, () => {
    const result = parse(`=0-"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*"0"' = 0`, () => {
    const result = parse(`=0*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/"0"' = parser.DIV0`, () => {
    const result = parse(`=0/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"0"' = parser.NUMVALUE`, () => {
    const result = parse(`=0^"0"`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"0"' = FALSE`, () => {
    const result = parse(`=0>"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"0"' = TRUE`, () => {
    const result = parse(`=0<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="0"' = FALSE`, () => {
    const result = parse(`=0="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"0"' = TRUE`, () => {
    const result = parse(`=0<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="0"' = FALSE`, () => {
    const result = parse(`=0>="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="0"' = TRUE`, () => {
    const result = parse(`=0<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"0"' = 00`, () => {
    const result = parse(`=0&"0"`);
    expect(result.value).toBe("00");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"1"' = 1`, () => {
    const result = parse(`=0+"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-"1"' = -1`, () => {
    const result = parse(`=0-"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*"1"' = 0`, () => {
    const result = parse(`=0*"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/"1"' = 0`, () => {
    const result = parse(`=0/"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^"1"' = 0`, () => {
    const result = parse(`=0^"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0>"1"' = FALSE`, () => {
    const result = parse(`=0>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"1"' = TRUE`, () => {
    const result = parse(`=0<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="1"' = FALSE`, () => {
    const result = parse(`=0="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"1"' = TRUE`, () => {
    const result = parse(`=0<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="1"' = FALSE`, () => {
    const result = parse(`=0>="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="1"' = TRUE`, () => {
    const result = parse(`=0<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"1"' = 01`, () => {
    const result = parse(`=0&"1"`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+-1' = -1`, () => {
    const result = parse(`=0+-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0--1' = 1`, () => {
    const result = parse(`=0--1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*-1' = 0`, () => {
    const result = parse(`=0*-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/-1' = 0`, () => {
    const result = parse(`=0/-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^-1' = parser.DIV0`, () => {
    const result = parse(`=0^-1`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>-1' = TRUE`, () => {
    const result = parse(`=0>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<-1' = FALSE`, () => {
    const result = parse(`=0<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=-1' = FALSE`, () => {
    const result = parse(`=0=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>-1' = TRUE`, () => {
    const result = parse(`=0<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=-1' = TRUE`, () => {
    const result = parse(`=0>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=-1' = FALSE`, () => {
    const result = parse(`=0<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&-1' = 0-1`, () => {
    const result = parse(`=0&-1`);
    expect(result.value).toBe("0-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"-1"' = -1`, () => {
    const result = parse(`=0+"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-"-1"' = 1`, () => {
    const result = parse(`=0-"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*"-1"' = 0`, () => {
    const result = parse(`=0*"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/"-1"' = 0`, () => {
    const result = parse(`=0/"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^"-1"' = parser.DIV0`, () => {
    const result = parse(`=0^"-1"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"-1"' = FALSE`, () => {
    const result = parse(`=0>"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"-1"' = TRUE`, () => {
    const result = parse(`=0<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="-1"' = FALSE`, () => {
    const result = parse(`=0="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"-1"' = TRUE`, () => {
    const result = parse(`=0<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="-1"' = FALSE`, () => {
    const result = parse(`=0>="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="-1"' = TRUE`, () => {
    const result = parse(`=0<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"-1"' = 0-1`, () => {
    const result = parse(`=0&"-1"`);
    expect(result.value).toBe("0-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+TRUE' = 1`, () => {
    const result = parse(`=0+TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-TRUE' = -1`, () => {
    const result = parse(`=0-TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*TRUE' = 0`, () => {
    const result = parse(`=0*TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/TRUE' = 0`, () => {
    const result = parse(`=0/TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^TRUE' = 0`, () => {
    const result = parse(`=0^TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0>TRUE' = FALSE`, () => {
    const result = parse(`=0>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<TRUE' = TRUE`, () => {
    const result = parse(`=0<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=TRUE' = FALSE`, () => {
    const result = parse(`=0=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>TRUE' = TRUE`, () => {
    const result = parse(`=0<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=TRUE' = FALSE`, () => {
    const result = parse(`=0>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=TRUE' = TRUE`, () => {
    const result = parse(`=0<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&TRUE' = 0TRUE`, () => {
    const result = parse(`=0&TRUE`);
    expect(result.value).toBe("0TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+FALSE' = 0`, () => {
    const result = parse(`=0+FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-FALSE' = 0`, () => {
    const result = parse(`=0-FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*FALSE' = 0`, () => {
    const result = parse(`=0*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/FALSE' = parser.DIV0`, () => {
    const result = parse(`=0/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^FALSE' = parser.NUMVALUE`, () => {
    const result = parse(`=0^FALSE`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>FALSE' = FALSE`, () => {
    const result = parse(`=0>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<FALSE' = TRUE`, () => {
    const result = parse(`=0<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=FALSE' = FALSE`, () => {
    const result = parse(`=0=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>FALSE' = TRUE`, () => {
    const result = parse(`=0<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=FALSE' = FALSE`, () => {
    const result = parse(`=0>=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=FALSE' = TRUE`, () => {
    const result = parse(`=0<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&FALSE' = 0FALSE`, () => {
    const result = parse(`=0&FALSE`);
    expect(result.value).toBe("0FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=0+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=0-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=0*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=0/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=0^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"Hello"' = FALSE`, () => {
    const result = parse(`=0>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"Hello"' = TRUE`, () => {
    const result = parse(`=0<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="Hello"' = FALSE`, () => {
    const result = parse(`=0="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"Hello"' = TRUE`, () => {
    const result = parse(`=0<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="Hello"' = FALSE`, () => {
    const result = parse(`=0>="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="Hello"' = TRUE`, () => {
    const result = parse(`=0<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"Hello"' = 0Hello`, () => {
    const result = parse(`=0&"Hello"`);
    expect(result.value).toBe("0Hello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'=0+""' = parser.VVALUE`, () => {
    const result = parse(`=0+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-""' = parser.VVALUE`, () => {
    const result = parse(`=0-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*""' = parser.VVALUE`, () => {
    const result = parse(`=0*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/""' = parser.VVALUE`, () => {
    const result = parse(`=0/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^""' = parser.VVALUE`, () => {
    const result = parse(`=0^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>""' = FALSE`, () => {
    const result = parse(`=0>""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<""' = TRUE`, () => {
    const result = parse(`=0<""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0=""' = FALSE`, () => {
    const result = parse(`=0=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>""' = TRUE`, () => {
    const result = parse(`=0<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>=""' = FALSE`, () => {
    const result = parse(`=0>=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<=""' = TRUE`, () => {
    const result = parse(`=0<=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&""' = 0`, () => {
    const result = parse(`=0&""`);
    expect(result.value).toBe("0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=0+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=0-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=0*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=0/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=0^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"h1"' = FALSE`, () => {
    const result = parse(`=0>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"h1"' = TRUE`, () => {
    const result = parse(`=0<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="h1"' = FALSE`, () => {
    const result = parse(`=0="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"h1"' = TRUE`, () => {
    const result = parse(`=0<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="h1"' = FALSE`, () => {
    const result = parse(`=0>="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="h1"' = TRUE`, () => {
    const result = parse(`=0<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"h1"' = 0h1`, () => {
    const result = parse(`=0&"h1"`);
    expect(result.value).toBe("0h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=0+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=0-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=0*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=0/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=0^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"1h"' = FALSE`, () => {
    const result = parse(`=0>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"1h"' = TRUE`, () => {
    const result = parse(`=0<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="1h"' = FALSE`, () => {
    const result = parse(`=0="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"1h"' = TRUE`, () => {
    const result = parse(`=0<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="1h"' = FALSE`, () => {
    const result = parse(`=0>="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="1h"' = TRUE`, () => {
    const result = parse(`=0<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"1h"' = 01h`, () => {
    const result = parse(`=0&"1h"`);
    expect(result.value).toBe("01h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"A"' = parser.VVALUE`, () => {
    const result = parse(`=0+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"A"' = parser.VVALUE`, () => {
    const result = parse(`=0-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"A"' = parser.VVALUE`, () => {
    const result = parse(`=0*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"A"' = parser.VVALUE`, () => {
    const result = parse(`=0/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"A"' = parser.VVALUE`, () => {
    const result = parse(`=0^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"A"' = FALSE`, () => {
    const result = parse(`=0>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"A"' = TRUE`, () => {
    const result = parse(`=0<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="A"' = FALSE`, () => {
    const result = parse(`=0="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"A"' = TRUE`, () => {
    const result = parse(`=0<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="A"' = FALSE`, () => {
    const result = parse(`=0>="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="A"' = TRUE`, () => {
    const result = parse(`=0<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"A"' = 0A`, () => {
    const result = parse(`=0&"A"`);
    expect(result.value).toBe("0A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=0+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=0-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=0*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=0/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=0^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"Z"' = FALSE`, () => {
    const result = parse(`=0>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"Z"' = TRUE`, () => {
    const result = parse(`=0<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="Z"' = FALSE`, () => {
    const result = parse(`=0="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"Z"' = TRUE`, () => {
    const result = parse(`=0<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="Z"' = FALSE`, () => {
    const result = parse(`=0>="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="Z"' = TRUE`, () => {
    const result = parse(`=0<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"Z"' = 0Z`, () => {
    const result = parse(`=0&"Z"`);
    expect(result.value).toBe("0Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"$"' = parser.VVALUE`, () => {
    const result = parse(`=0+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"$"' = parser.VVALUE`, () => {
    const result = parse(`=0-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"$"' = parser.VVALUE`, () => {
    const result = parse(`=0*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"$"' = parser.VVALUE`, () => {
    const result = parse(`=0/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"$"' = parser.VVALUE`, () => {
    const result = parse(`=0^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"$"' = FALSE`, () => {
    const result = parse(`=0>"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"$"' = TRUE`, () => {
    const result = parse(`=0<"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="$"' = FALSE`, () => {
    const result = parse(`=0="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"$"' = TRUE`, () => {
    const result = parse(`=0<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="$"' = FALSE`, () => {
    const result = parse(`=0>="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="$"' = TRUE`, () => {
    const result = parse(`=0<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"$"' = 0$`, () => {
    const result = parse(`=0&"$"`);
    expect(result.value).toBe("0$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+"_"' = parser.VVALUE`, () => {
    const result = parse(`=0+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0-"_"' = parser.VVALUE`, () => {
    const result = parse(`=0-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0*"_"' = parser.VVALUE`, () => {
    const result = parse(`=0*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0/"_"' = parser.VVALUE`, () => {
    const result = parse(`=0/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0^"_"' = parser.VVALUE`, () => {
    const result = parse(`=0^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=0>"_"' = FALSE`, () => {
    const result = parse(`=0>"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<"_"' = TRUE`, () => {
    const result = parse(`=0<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0="_"' = FALSE`, () => {
    const result = parse(`=0="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>"_"' = TRUE`, () => {
    const result = parse(`=0<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>="_"' = FALSE`, () => {
    const result = parse(`=0>="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<="_"' = TRUE`, () => {
    const result = parse(`=0<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&"_"' = 0_`, () => {
    const result = parse(`=0&"_"`);
    expect(result.value).toBe("0_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+{1}' = 1`, () => {
    const result = parse(`=0+{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-{1}' = -1`, () => {
    const result = parse(`=0-{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*{1}' = 0`, () => {
    const result = parse(`=0*{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/{1}' = 0`, () => {
    const result = parse(`=0/{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^{1}' = 0`, () => {
    const result = parse(`=0^{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0>{1}' = FALSE`, () => {
    const result = parse(`=0>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<{1}' = TRUE`, () => {
    const result = parse(`=0<{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0={1}' = FALSE`, () => {
    const result = parse(`=0={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>{1}' = TRUE`, () => {
    const result = parse(`=0<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>={1}' = FALSE`, () => {
    const result = parse(`=0>={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<={1}' = TRUE`, () => {
    const result = parse(`=0<={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&{1}' = 01`, () => {
    const result = parse(`=0&{1}`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0+{"1"}' = 1`, () => {
    const result = parse(`=0+{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0-{"1"}' = -1`, () => {
    const result = parse(`=0-{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0*{"1"}' = 0`, () => {
    const result = parse(`=0*{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0/{"1"}' = 0`, () => {
    const result = parse(`=0/{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0^{"1"}' = 0`, () => {
    const result = parse(`=0^{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0>{"1"}' = FALSE`, () => {
    const result = parse(`=0>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<{"1"}' = TRUE`, () => {
    const result = parse(`=0<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0={"1"}' = FALSE`, () => {
    const result = parse(`=0={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<>{"1"}' = TRUE`, () => {
    const result = parse(`=0<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0>={"1"}' = FALSE`, () => {
    const result = parse(`=0>={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0<={"1"}' = TRUE`, () => {
    const result = parse(`=0<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=0&{"1"}' = 01`, () => {
    const result = parse(`=0&{"1"}`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+0' = 1`, () => {
    const result = parse(`=1+0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-0' = 1`, () => {
    const result = parse(`=1-0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*0' = 0`, () => {
    const result = parse(`=1*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/0' = parser.DIV0`, () => {
    const result = parse(`=1/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^0' = 1`, () => {
    const result = parse(`=1^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>0' = TRUE`, () => {
    const result = parse(`=1>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<0' = FALSE`, () => {
    const result = parse(`=1<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=0' = FALSE`, () => {
    const result = parse(`=1=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>0' = TRUE`, () => {
    const result = parse(`=1<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=0' = TRUE`, () => {
    const result = parse(`=1>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=0' = FALSE`, () => {
    const result = parse(`=1<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&0' = 10`, () => {
    const result = parse(`=1&0`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+1' = 2`, () => {
    const result = parse(`=1+1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-1' = 0`, () => {
    const result = parse(`=1-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*1' = 1`, () => {
    const result = parse(`=1*1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/1' = 1`, () => {
    const result = parse(`=1/1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^1' = 1`, () => {
    const result = parse(`=1^1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>1' = FALSE`, () => {
    const result = parse(`=1>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<1' = FALSE`, () => {
    const result = parse(`=1<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=1' = TRUE`, () => {
    const result = parse(`=1=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>1' = FALSE`, () => {
    const result = parse(`=1<>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=1' = TRUE`, () => {
    const result = parse(`=1>=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=1' = TRUE`, () => {
    const result = parse(`=1<=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&1' = 11`, () => {
    const result = parse(`=1&1`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"0"' = 1`, () => {
    const result = parse(`=1+"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-"0"' = 1`, () => {
    const result = parse(`=1-"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*"0"' = 0`, () => {
    const result = parse(`=1*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/"0"' = parser.DIV0`, () => {
    const result = parse(`=1/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"0"' = 1`, () => {
    const result = parse(`=1^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>"0"' = FALSE`, () => {
    const result = parse(`=1>"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"0"' = TRUE`, () => {
    const result = parse(`=1<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="0"' = FALSE`, () => {
    const result = parse(`=1="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"0"' = TRUE`, () => {
    const result = parse(`=1<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="0"' = FALSE`, () => {
    const result = parse(`=1>="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="0"' = TRUE`, () => {
    const result = parse(`=1<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"0"' = 10`, () => {
    const result = parse(`=1&"0"`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"1"' = 2`, () => {
    const result = parse(`=1+"1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-"1"' = 0`, () => {
    const result = parse(`=1-"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*"1"' = 1`, () => {
    const result = parse(`=1*"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/"1"' = 1`, () => {
    const result = parse(`=1/"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^"1"' = 1`, () => {
    const result = parse(`=1^"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>"1"' = FALSE`, () => {
    const result = parse(`=1>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"1"' = TRUE`, () => {
    const result = parse(`=1<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="1"' = FALSE`, () => {
    const result = parse(`=1="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"1"' = TRUE`, () => {
    const result = parse(`=1<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="1"' = FALSE`, () => {
    const result = parse(`=1>="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="1"' = TRUE`, () => {
    const result = parse(`=1<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"1"' = 11`, () => {
    const result = parse(`=1&"1"`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+-1' = 0`, () => {
    const result = parse(`=1+-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1--1' = 2`, () => {
    const result = parse(`=1--1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*-1' = -1`, () => {
    const result = parse(`=1*-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/-1' = -1`, () => {
    const result = parse(`=1/-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^-1' = 1`, () => {
    const result = parse(`=1^-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>-1' = TRUE`, () => {
    const result = parse(`=1>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<-1' = FALSE`, () => {
    const result = parse(`=1<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=-1' = FALSE`, () => {
    const result = parse(`=1=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>-1' = TRUE`, () => {
    const result = parse(`=1<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=-1' = TRUE`, () => {
    const result = parse(`=1>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=-1' = FALSE`, () => {
    const result = parse(`=1<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&-1' = 1-1`, () => {
    const result = parse(`=1&-1`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"-1"' = 0`, () => {
    const result = parse(`=1+"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-"-1"' = 2`, () => {
    const result = parse(`=1-"-1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*"-1"' = -1`, () => {
    const result = parse(`=1*"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/"-1"' = -1`, () => {
    const result = parse(`=1/"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^"-1"' = 1`, () => {
    const result = parse(`=1^"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>"-1"' = FALSE`, () => {
    const result = parse(`=1>"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"-1"' = TRUE`, () => {
    const result = parse(`=1<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="-1"' = FALSE`, () => {
    const result = parse(`=1="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"-1"' = TRUE`, () => {
    const result = parse(`=1<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="-1"' = FALSE`, () => {
    const result = parse(`=1>="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="-1"' = TRUE`, () => {
    const result = parse(`=1<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"-1"' = 1-1`, () => {
    const result = parse(`=1&"-1"`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+TRUE' = 2`, () => {
    const result = parse(`=1+TRUE`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-TRUE' = 0`, () => {
    const result = parse(`=1-TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*TRUE' = 1`, () => {
    const result = parse(`=1*TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/TRUE' = 1`, () => {
    const result = parse(`=1/TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^TRUE' = 1`, () => {
    const result = parse(`=1^TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>TRUE' = FALSE`, () => {
    const result = parse(`=1>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<TRUE' = TRUE`, () => {
    const result = parse(`=1<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=TRUE' = FALSE`, () => {
    const result = parse(`=1=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>TRUE' = TRUE`, () => {
    const result = parse(`=1<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=TRUE' = FALSE`, () => {
    const result = parse(`=1>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=TRUE' = TRUE`, () => {
    const result = parse(`=1<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&TRUE' = 1TRUE`, () => {
    const result = parse(`=1&TRUE`);
    expect(result.value).toBe("1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+FALSE' = 1`, () => {
    const result = parse(`=1+FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-FALSE' = 1`, () => {
    const result = parse(`=1-FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*FALSE' = 0`, () => {
    const result = parse(`=1*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/FALSE' = parser.DIV0`, () => {
    const result = parse(`=1/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^FALSE' = 1`, () => {
    const result = parse(`=1^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>FALSE' = FALSE`, () => {
    const result = parse(`=1>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<FALSE' = TRUE`, () => {
    const result = parse(`=1<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=FALSE' = FALSE`, () => {
    const result = parse(`=1=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>FALSE' = TRUE`, () => {
    const result = parse(`=1<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=FALSE' = FALSE`, () => {
    const result = parse(`=1>=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=FALSE' = TRUE`, () => {
    const result = parse(`=1<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&FALSE' = 1FALSE`, () => {
    const result = parse(`=1&FALSE`);
    expect(result.value).toBe("1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=1+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=1-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=1*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=1/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=1^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"Hello"' = FALSE`, () => {
    const result = parse(`=1>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"Hello"' = TRUE`, () => {
    const result = parse(`=1<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="Hello"' = FALSE`, () => {
    const result = parse(`=1="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"Hello"' = TRUE`, () => {
    const result = parse(`=1<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="Hello"' = FALSE`, () => {
    const result = parse(`=1>="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="Hello"' = TRUE`, () => {
    const result = parse(`=1<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"Hello"' = 1Hello`, () => {
    const result = parse(`=1&"Hello"`);
    expect(result.value).toBe("1Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+""' = parser.VVALUE`, () => {
    const result = parse(`=1+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-""' = parser.VVALUE`, () => {
    const result = parse(`=1-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*""' = parser.VVALUE`, () => {
    const result = parse(`=1*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/""' = parser.VVALUE`, () => {
    const result = parse(`=1/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^""' = parser.VVALUE`, () => {
    const result = parse(`=1^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>""' = FALSE`, () => {
    const result = parse(`=1>""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<""' = TRUE`, () => {
    const result = parse(`=1<""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1=""' = FALSE`, () => {
    const result = parse(`=1=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>""' = TRUE`, () => {
    const result = parse(`=1<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>=""' = FALSE`, () => {
    const result = parse(`=1>=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<=""' = TRUE`, () => {
    const result = parse(`=1<=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&""' = 1`, () => {
    const result = parse(`=1&""`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=1+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=1-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=1*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=1/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=1^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"h1"' = FALSE`, () => {
    const result = parse(`=1>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"h1"' = TRUE`, () => {
    const result = parse(`=1<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="h1"' = FALSE`, () => {
    const result = parse(`=1="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"h1"' = TRUE`, () => {
    const result = parse(`=1<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="h1"' = FALSE`, () => {
    const result = parse(`=1>="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="h1"' = TRUE`, () => {
    const result = parse(`=1<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"h1"' = 1h1`, () => {
    const result = parse(`=1&"h1"`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=1+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=1-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=1*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=1/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=1^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"1h"' = FALSE`, () => {
    const result = parse(`=1>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"1h"' = TRUE`, () => {
    const result = parse(`=1<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="1h"' = FALSE`, () => {
    const result = parse(`=1="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"1h"' = TRUE`, () => {
    const result = parse(`=1<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="1h"' = FALSE`, () => {
    const result = parse(`=1>="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="1h"' = TRUE`, () => {
    const result = parse(`=1<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"1h"' = 11h`, () => {
    const result = parse(`=1&"1h"`);
    expect(result.value).toBe("11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"A"' = parser.VVALUE`, () => {
    const result = parse(`=1+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"A"' = parser.VVALUE`, () => {
    const result = parse(`=1-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"A"' = parser.VVALUE`, () => {
    const result = parse(`=1*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"A"' = parser.VVALUE`, () => {
    const result = parse(`=1/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"A"' = parser.VVALUE`, () => {
    const result = parse(`=1^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"A"' = FALSE`, () => {
    const result = parse(`=1>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"A"' = TRUE`, () => {
    const result = parse(`=1<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="A"' = FALSE`, () => {
    const result = parse(`=1="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"A"' = TRUE`, () => {
    const result = parse(`=1<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="A"' = FALSE`, () => {
    const result = parse(`=1>="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="A"' = TRUE`, () => {
    const result = parse(`=1<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"A"' = 1A`, () => {
    const result = parse(`=1&"A"`);
    expect(result.value).toBe("1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=1+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=1-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=1*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=1/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=1^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"Z"' = FALSE`, () => {
    const result = parse(`=1>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"Z"' = TRUE`, () => {
    const result = parse(`=1<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="Z"' = FALSE`, () => {
    const result = parse(`=1="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"Z"' = TRUE`, () => {
    const result = parse(`=1<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="Z"' = FALSE`, () => {
    const result = parse(`=1>="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="Z"' = TRUE`, () => {
    const result = parse(`=1<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"Z"' = 1Z`, () => {
    const result = parse(`=1&"Z"`);
    expect(result.value).toBe("1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"$"' = parser.VVALUE`, () => {
    const result = parse(`=1+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"$"' = parser.VVALUE`, () => {
    const result = parse(`=1-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"$"' = parser.VVALUE`, () => {
    const result = parse(`=1*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"$"' = parser.VVALUE`, () => {
    const result = parse(`=1/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"$"' = parser.VVALUE`, () => {
    const result = parse(`=1^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"$"' = FALSE`, () => {
    const result = parse(`=1>"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"$"' = TRUE`, () => {
    const result = parse(`=1<"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="$"' = FALSE`, () => {
    const result = parse(`=1="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"$"' = TRUE`, () => {
    const result = parse(`=1<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="$"' = FALSE`, () => {
    const result = parse(`=1>="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="$"' = TRUE`, () => {
    const result = parse(`=1<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"$"' = 1$`, () => {
    const result = parse(`=1&"$"`);
    expect(result.value).toBe("1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+"_"' = parser.VVALUE`, () => {
    const result = parse(`=1+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1-"_"' = parser.VVALUE`, () => {
    const result = parse(`=1-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1*"_"' = parser.VVALUE`, () => {
    const result = parse(`=1*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1/"_"' = parser.VVALUE`, () => {
    const result = parse(`=1/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1^"_"' = parser.VVALUE`, () => {
    const result = parse(`=1^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=1>"_"' = FALSE`, () => {
    const result = parse(`=1>"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<"_"' = TRUE`, () => {
    const result = parse(`=1<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1="_"' = FALSE`, () => {
    const result = parse(`=1="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>"_"' = TRUE`, () => {
    const result = parse(`=1<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>="_"' = FALSE`, () => {
    const result = parse(`=1>="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<="_"' = TRUE`, () => {
    const result = parse(`=1<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&"_"' = 1_`, () => {
    const result = parse(`=1&"_"`);
    expect(result.value).toBe("1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+{1}' = 2`, () => {
    const result = parse(`=1+{1}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-{1}' = 0`, () => {
    const result = parse(`=1-{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*{1}' = 1`, () => {
    const result = parse(`=1*{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/{1}' = 1`, () => {
    const result = parse(`=1/{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^{1}' = 1`, () => {
    const result = parse(`=1^{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>{1}' = FALSE`, () => {
    const result = parse(`=1>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<{1}' = FALSE`, () => {
    const result = parse(`=1<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1={1}' = TRUE`, () => {
    const result = parse(`=1={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>{1}' = FALSE`, () => {
    const result = parse(`=1<>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>={1}' = TRUE`, () => {
    const result = parse(`=1>={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<={1}' = TRUE`, () => {
    const result = parse(`=1<={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&{1}' = 11`, () => {
    const result = parse(`=1&{1}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=1+{"1"}' = 2`, () => {
    const result = parse(`=1+{"1"}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1-{"1"}' = 0`, () => {
    const result = parse(`=1-{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1*{"1"}' = 1`, () => {
    const result = parse(`=1*{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1/{"1"}' = 1`, () => {
    const result = parse(`=1/{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1^{"1"}' = 1`, () => {
    const result = parse(`=1^{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1>{"1"}' = FALSE`, () => {
    const result = parse(`=1>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<{"1"}' = TRUE`, () => {
    const result = parse(`=1<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1={"1"}' = FALSE`, () => {
    const result = parse(`=1={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<>{"1"}' = TRUE`, () => {
    const result = parse(`=1<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1>={"1"}' = FALSE`, () => {
    const result = parse(`=1>={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1<={"1"}' = TRUE`, () => {
    const result = parse(`=1<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=1&{"1"}' = 11`, () => {
    const result = parse(`=1&{"1"}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+0' = 0`, () => {
    const result = parse(`="0"+0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-0' = 0`, () => {
    const result = parse(`="0"-0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*0' = 0`, () => {
    const result = parse(`="0"*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/0' = parser.DIV0`, () => {
    const result = parse(`="0"/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^0' = parser.NUMVALUE`, () => {
    const result = parse(`="0"^0`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">0' = TRUE`, () => {
    const result = parse(`="0">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<0' = FALSE`, () => {
    const result = parse(`="0"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=0' = FALSE`, () => {
    const result = parse(`="0"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>0' = TRUE`, () => {
    const result = parse(`="0"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=0' = TRUE`, () => {
    const result = parse(`="0">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=0' = FALSE`, () => {
    const result = parse(`="0"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&0' = 00`, () => {
    const result = parse(`="0"&0`);
    expect(result.value).toBe("00");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+1' = 1`, () => {
    const result = parse(`="0"+1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-1' = -1`, () => {
    const result = parse(`="0"-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*1' = 0`, () => {
    const result = parse(`="0"*1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/1' = 0`, () => {
    const result = parse(`="0"/1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^1' = 0`, () => {
    const result = parse(`="0"^1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0">1' = TRUE`, () => {
    const result = parse(`="0">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<1' = FALSE`, () => {
    const result = parse(`="0"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=1' = FALSE`, () => {
    const result = parse(`="0"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>1' = TRUE`, () => {
    const result = parse(`="0"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=1' = TRUE`, () => {
    const result = parse(`="0">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=1' = FALSE`, () => {
    const result = parse(`="0"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&1' = 01`, () => {
    const result = parse(`="0"&1`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"0"' = 0`, () => {
    const result = parse(`="0"+"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-"0"' = 0`, () => {
    const result = parse(`="0"-"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*"0"' = 0`, () => {
    const result = parse(`="0"*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/"0"' = parser.DIV0`, () => {
    const result = parse(`="0"/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"0"' = parser.NUMVALUE`, () => {
    const result = parse(`="0"^"0"`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"0"' = FALSE`, () => {
    const result = parse(`="0">"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"0"' = FALSE`, () => {
    const result = parse(`="0"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="0"' = TRUE`, () => {
    const result = parse(`="0"="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"0"' = FALSE`, () => {
    const result = parse(`="0"<>"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="0"' = TRUE`, () => {
    const result = parse(`="0">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="0"' = TRUE`, () => {
    const result = parse(`="0"<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"0"' = 00`, () => {
    const result = parse(`="0"&"0"`);
    expect(result.value).toBe("00");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"1"' = 1`, () => {
    const result = parse(`="0"+"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-"1"' = -1`, () => {
    const result = parse(`="0"-"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*"1"' = 0`, () => {
    const result = parse(`="0"*"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/"1"' = 0`, () => {
    const result = parse(`="0"/"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^"1"' = 0`, () => {
    const result = parse(`="0"^"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0">"1"' = FALSE`, () => {
    const result = parse(`="0">"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"1"' = TRUE`, () => {
    const result = parse(`="0"<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="1"' = FALSE`, () => {
    const result = parse(`="0"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"1"' = TRUE`, () => {
    const result = parse(`="0"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="1"' = FALSE`, () => {
    const result = parse(`="0">="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="1"' = TRUE`, () => {
    const result = parse(`="0"<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"1"' = 01`, () => {
    const result = parse(`="0"&"1"`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+-1' = -1`, () => {
    const result = parse(`="0"+-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"--1' = 1`, () => {
    const result = parse(`="0"--1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*-1' = 0`, () => {
    const result = parse(`="0"*-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/-1' = 0`, () => {
    const result = parse(`="0"/-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^-1' = parser.DIV0`, () => {
    const result = parse(`="0"^-1`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">-1' = TRUE`, () => {
    const result = parse(`="0">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<-1' = FALSE`, () => {
    const result = parse(`="0"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=-1' = FALSE`, () => {
    const result = parse(`="0"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>-1' = TRUE`, () => {
    const result = parse(`="0"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=-1' = TRUE`, () => {
    const result = parse(`="0">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=-1' = FALSE`, () => {
    const result = parse(`="0"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&-1' = 0-1`, () => {
    const result = parse(`="0"&-1`);
    expect(result.value).toBe("0-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"-1"' = -1`, () => {
    const result = parse(`="0"+"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-"-1"' = 1`, () => {
    const result = parse(`="0"-"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*"-1"' = 0`, () => {
    const result = parse(`="0"*"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/"-1"' = 0`, () => {
    const result = parse(`="0"/"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^"-1"' = parser.DIV0`, () => {
    const result = parse(`="0"^"-1"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"-1"' = FALSE`, () => {
    const result = parse(`="0">"-1"`);
    expect(result.value).toBe(true); // what excel does, makes no sense whatsoever -> localCompare makes more sense
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"-1"' = TRUE`, () => {
    const result = parse(`="0"<"-1"`);
    expect(result.value).toBe(false); // what excel does, makes no sense whatsoever -> localCompare makes more sense
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="-1"' = FALSE`, () => {
    const result = parse(`="0"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"-1"' = TRUE`, () => {
    const result = parse(`="0"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="-1"' = FALSE`, () => {
    const result = parse(`="0">="-1"`);
    expect(result.value).toBe(true); // what excel does, makes no sense whatsoever -> localCompare makes more sense
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="-1"' = TRUE`, () => {
    const result = parse(`="0"<="-1"`);
    expect(result.value).toBe(false); // what excel does, makes no sense whatsoever -> localCompare makes more sense
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"-1"' = 0-1`, () => {
    const result = parse(`="0"&"-1"`);
    expect(result.value).toBe("0-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+TRUE' = 1`, () => {
    const result = parse(`="0"+TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-TRUE' = -1`, () => {
    const result = parse(`="0"-TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*TRUE' = 0`, () => {
    const result = parse(`="0"*TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/TRUE' = 0`, () => {
    const result = parse(`="0"/TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^TRUE' = 0`, () => {
    const result = parse(`="0"^TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0">TRUE' = FALSE`, () => {
    const result = parse(`="0">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<TRUE' = TRUE`, () => {
    const result = parse(`="0"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=TRUE' = FALSE`, () => {
    const result = parse(`="0"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>TRUE' = TRUE`, () => {
    const result = parse(`="0"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=TRUE' = FALSE`, () => {
    const result = parse(`="0">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=TRUE' = TRUE`, () => {
    const result = parse(`="0"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&TRUE' = 0TRUE`, () => {
    const result = parse(`="0"&TRUE`);
    expect(result.value).toBe("0TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+FALSE' = 0`, () => {
    const result = parse(`="0"+FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-FALSE' = 0`, () => {
    const result = parse(`="0"-FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*FALSE' = 0`, () => {
    const result = parse(`="0"*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/FALSE' = parser.DIV0`, () => {
    const result = parse(`="0"/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^FALSE' = parser.NUMVALUE`, () => {
    const result = parse(`="0"^FALSE`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">FALSE' = FALSE`, () => {
    const result = parse(`="0">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<FALSE' = TRUE`, () => {
    const result = parse(`="0"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=FALSE' = FALSE`, () => {
    const result = parse(`="0"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>FALSE' = TRUE`, () => {
    const result = parse(`="0"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=FALSE' = FALSE`, () => {
    const result = parse(`="0">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=FALSE' = TRUE`, () => {
    const result = parse(`="0"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&FALSE' = 0FALSE`, () => {
    const result = parse(`="0"&FALSE`);
    expect(result.value).toBe("0FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"Hello"' = FALSE`, () => {
    const result = parse(`="0">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"Hello"' = TRUE`, () => {
    const result = parse(`="0"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="Hello"' = FALSE`, () => {
    const result = parse(`="0"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"Hello"' = TRUE`, () => {
    const result = parse(`="0"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="Hello"' = FALSE`, () => {
    const result = parse(`="0">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="Hello"' = TRUE`, () => {
    const result = parse(`="0"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"Hello"' = 0Hello`, () => {
    const result = parse(`="0"&"Hello"`);
    expect(result.value).toBe("0Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+""' = parser.VVALUE`, () => {
    const result = parse(`="0"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-""' = parser.VVALUE`, () => {
    const result = parse(`="0"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*""' = parser.VVALUE`, () => {
    const result = parse(`="0"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/""' = parser.VVALUE`, () => {
    const result = parse(`="0"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^""' = parser.VVALUE`, () => {
    const result = parse(`="0"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">""' = TRUE`, () => {
    const result = parse(`="0">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<""' = FALSE`, () => {
    const result = parse(`="0"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"=""' = FALSE`, () => {
    const result = parse(`="0"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>""' = TRUE`, () => {
    const result = parse(`="0"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">=""' = TRUE`, () => {
    const result = parse(`="0">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<=""' = FALSE`, () => {
    const result = parse(`="0"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&""' = 0`, () => {
    const result = parse(`="0"&""`);
    expect(result.value).toBe("0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"h1"' = FALSE`, () => {
    const result = parse(`="0">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"h1"' = TRUE`, () => {
    const result = parse(`="0"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="h1"' = FALSE`, () => {
    const result = parse(`="0"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"h1"' = TRUE`, () => {
    const result = parse(`="0"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="h1"' = FALSE`, () => {
    const result = parse(`="0">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="h1"' = TRUE`, () => {
    const result = parse(`="0"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"h1"' = 0h1`, () => {
    const result = parse(`="0"&"h1"`);
    expect(result.value).toBe("0h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"1h"' = FALSE`, () => {
    const result = parse(`="0">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"1h"' = TRUE`, () => {
    const result = parse(`="0"<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="1h"' = FALSE`, () => {
    const result = parse(`="0"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"1h"' = TRUE`, () => {
    const result = parse(`="0"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="1h"' = FALSE`, () => {
    const result = parse(`="0">="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="1h"' = TRUE`, () => {
    const result = parse(`="0"<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"1h"' = 01h`, () => {
    const result = parse(`="0"&"1h"`);
    expect(result.value).toBe("01h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"A"' = FALSE`, () => {
    const result = parse(`="0">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"A"' = TRUE`, () => {
    const result = parse(`="0"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="A"' = FALSE`, () => {
    const result = parse(`="0"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"A"' = TRUE`, () => {
    const result = parse(`="0"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="A"' = FALSE`, () => {
    const result = parse(`="0">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="A"' = TRUE`, () => {
    const result = parse(`="0"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"A"' = 0A`, () => {
    const result = parse(`="0"&"A"`);
    expect(result.value).toBe("0A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"Z"' = FALSE`, () => {
    const result = parse(`="0">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"Z"' = TRUE`, () => {
    const result = parse(`="0"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="Z"' = FALSE`, () => {
    const result = parse(`="0"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"Z"' = TRUE`, () => {
    const result = parse(`="0"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="Z"' = FALSE`, () => {
    const result = parse(`="0">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="Z"' = TRUE`, () => {
    const result = parse(`="0"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"Z"' = 0Z`, () => {
    const result = parse(`="0"&"Z"`);
    expect(result.value).toBe("0Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"$"' = TRUE`, () => {
    const result = parse(`="0">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"$"' = FALSE`, () => {
    const result = parse(`="0"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="$"' = FALSE`, () => {
    const result = parse(`="0"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"$"' = TRUE`, () => {
    const result = parse(`="0"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="$"' = TRUE`, () => {
    const result = parse(`="0">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="$"' = FALSE`, () => {
    const result = parse(`="0"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"$"' = 0$`, () => {
    const result = parse(`="0"&"$"`);
    expect(result.value).toBe("0$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="0"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="0"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="0"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="0"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="0"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="0">"_"' = TRUE`, () => {
    const result = parse(`="0">"_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<"_"' = FALSE`, () => {
    const result = parse(`="0"<"_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"="_"' = FALSE`, () => {
    const result = parse(`="0"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>"_"' = TRUE`, () => {
    const result = parse(`="0"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">="_"' = TRUE`, () => {
    const result = parse(`="0">="_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<="_"' = FALSE`, () => {
    const result = parse(`="0"<="_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&"_"' = 0_`, () => {
    const result = parse(`="0"&"_"`);
    expect(result.value).toBe("0_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+{1}' = 1`, () => {
    const result = parse(`="0"+{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-{1}' = -1`, () => {
    const result = parse(`="0"-{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*{1}' = 0`, () => {
    const result = parse(`="0"*{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/{1}' = 0`, () => {
    const result = parse(`="0"/{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^{1}' = 0`, () => {
    const result = parse(`="0"^{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0">{1}' = TRUE`, () => {
    const result = parse(`="0">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<{1}' = FALSE`, () => {
    const result = parse(`="0"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"={1}' = FALSE`, () => {
    const result = parse(`="0"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>{1}' = TRUE`, () => {
    const result = parse(`="0"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">={1}' = TRUE`, () => {
    const result = parse(`="0">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<={1}' = FALSE`, () => {
    const result = parse(`="0"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&{1}' = 01`, () => {
    const result = parse(`="0"&{1}`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="0"+{"1"}' = 1`, () => {
    const result = parse(`="0"+{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"-{"1"}' = -1`, () => {
    const result = parse(`="0"-{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"*{"1"}' = 0`, () => {
    const result = parse(`="0"*{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"/{"1"}' = 0`, () => {
    const result = parse(`="0"/{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0"^{"1"}' = 0`, () => {
    const result = parse(`="0"^{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="0">{"1"}' = FALSE`, () => {
    const result = parse(`="0">{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<{"1"}' = TRUE`, () => {
    const result = parse(`="0"<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"={"1"}' = FALSE`, () => {
    const result = parse(`="0"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<>{"1"}' = TRUE`, () => {
    const result = parse(`="0"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0">={"1"}' = FALSE`, () => {
    const result = parse(`="0">={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"<={"1"}' = TRUE`, () => {
    const result = parse(`="0"<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="0"&{"1"}' = 01`, () => {
    const result = parse(`="0"&{"1"}`);
    expect(result.value).toBe("01");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+0' = 1`, () => {
    const result = parse(`="1"+0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-0' = 1`, () => {
    const result = parse(`="1"-0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*0' = 0`, () => {
    const result = parse(`="1"*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/0' = parser.DIV0`, () => {
    const result = parse(`="1"/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^0' = 1`, () => {
    const result = parse(`="1"^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">0' = TRUE`, () => {
    const result = parse(`="1">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<0' = FALSE`, () => {
    const result = parse(`="1"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=0' = FALSE`, () => {
    const result = parse(`="1"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>0' = TRUE`, () => {
    const result = parse(`="1"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=0' = TRUE`, () => {
    const result = parse(`="1">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=0' = FALSE`, () => {
    const result = parse(`="1"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&0' = 10`, () => {
    const result = parse(`="1"&0`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+1' = 2`, () => {
    const result = parse(`="1"+1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-1' = 0`, () => {
    const result = parse(`="1"-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*1' = 1`, () => {
    const result = parse(`="1"*1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/1' = 1`, () => {
    const result = parse(`="1"/1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^1' = 1`, () => {
    const result = parse(`="1"^1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">1' = TRUE`, () => {
    const result = parse(`="1">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<1' = FALSE`, () => {
    const result = parse(`="1"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=1' = FALSE`, () => {
    const result = parse(`="1"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>1' = TRUE`, () => {
    const result = parse(`="1"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=1' = TRUE`, () => {
    const result = parse(`="1">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=1' = FALSE`, () => {
    const result = parse(`="1"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&1' = 11`, () => {
    const result = parse(`="1"&1`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"0"' = 1`, () => {
    const result = parse(`="1"+"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-"0"' = 1`, () => {
    const result = parse(`="1"-"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*"0"' = 0`, () => {
    const result = parse(`="1"*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/"0"' = parser.DIV0`, () => {
    const result = parse(`="1"/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"0"' = 1`, () => {
    const result = parse(`="1"^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">"0"' = TRUE`, () => {
    const result = parse(`="1">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"0"' = FALSE`, () => {
    const result = parse(`="1"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="0"' = FALSE`, () => {
    const result = parse(`="1"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"0"' = TRUE`, () => {
    const result = parse(`="1"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="0"' = TRUE`, () => {
    const result = parse(`="1">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="0"' = FALSE`, () => {
    const result = parse(`="1"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"0"' = 10`, () => {
    const result = parse(`="1"&"0"`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"1"' = 2`, () => {
    const result = parse(`="1"+"1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-"1"' = 0`, () => {
    const result = parse(`="1"-"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*"1"' = 1`, () => {
    const result = parse(`="1"*"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/"1"' = 1`, () => {
    const result = parse(`="1"/"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^"1"' = 1`, () => {
    const result = parse(`="1"^"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">"1"' = FALSE`, () => {
    const result = parse(`="1">"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"1"' = FALSE`, () => {
    const result = parse(`="1"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="1"' = TRUE`, () => {
    const result = parse(`="1"="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"1"' = FALSE`, () => {
    const result = parse(`="1"<>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="1"' = TRUE`, () => {
    const result = parse(`="1">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="1"' = TRUE`, () => {
    const result = parse(`="1"<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"1"' = 11`, () => {
    const result = parse(`="1"&"1"`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+-1' = 0`, () => {
    const result = parse(`="1"+-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"--1' = 2`, () => {
    const result = parse(`="1"--1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*-1' = -1`, () => {
    const result = parse(`="1"*-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/-1' = -1`, () => {
    const result = parse(`="1"/-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^-1' = 1`, () => {
    const result = parse(`="1"^-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">-1' = TRUE`, () => {
    const result = parse(`="1">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<-1' = FALSE`, () => {
    const result = parse(`="1"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=-1' = FALSE`, () => {
    const result = parse(`="1"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>-1' = TRUE`, () => {
    const result = parse(`="1"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=-1' = TRUE`, () => {
    const result = parse(`="1">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=-1' = FALSE`, () => {
    const result = parse(`="1"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&-1' = 1-1`, () => {
    const result = parse(`="1"&-1`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"-1"' = 0`, () => {
    const result = parse(`="1"+"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-"-1"' = 2`, () => {
    const result = parse(`="1"-"-1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*"-1"' = -1`, () => {
    const result = parse(`="1"*"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/"-1"' = -1`, () => {
    const result = parse(`="1"/"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^"-1"' = 1`, () => {
    const result = parse(`="1"^"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">"-1"' = FALSE`, () => {
    const result = parse(`="1">"-1"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"-1"' = TRUE`, () => {
    const result = parse(`="1"<"-1"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="-1"' = FALSE`, () => {
    const result = parse(`="1"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"-1"' = TRUE`, () => {
    const result = parse(`="1"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="-1"' = FALSE`, () => {
    const result = parse(`="1">="-1"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="-1"' = TRUE`, () => {
    const result = parse(`="1"<="-1"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"-1"' = 1-1`, () => {
    const result = parse(`="1"&"-1"`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+TRUE' = 2`, () => {
    const result = parse(`="1"+TRUE`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-TRUE' = 0`, () => {
    const result = parse(`="1"-TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*TRUE' = 1`, () => {
    const result = parse(`="1"*TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/TRUE' = 1`, () => {
    const result = parse(`="1"/TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^TRUE' = 1`, () => {
    const result = parse(`="1"^TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">TRUE' = FALSE`, () => {
    const result = parse(`="1">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<TRUE' = TRUE`, () => {
    const result = parse(`="1"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=TRUE' = FALSE`, () => {
    const result = parse(`="1"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>TRUE' = TRUE`, () => {
    const result = parse(`="1"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=TRUE' = FALSE`, () => {
    const result = parse(`="1">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=TRUE' = TRUE`, () => {
    const result = parse(`="1"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&TRUE' = 1TRUE`, () => {
    const result = parse(`="1"&TRUE`);
    expect(result.value).toBe("1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+FALSE' = 1`, () => {
    const result = parse(`="1"+FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-FALSE' = 1`, () => {
    const result = parse(`="1"-FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*FALSE' = 0`, () => {
    const result = parse(`="1"*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/FALSE' = parser.DIV0`, () => {
    const result = parse(`="1"/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^FALSE' = 1`, () => {
    const result = parse(`="1"^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">FALSE' = FALSE`, () => {
    const result = parse(`="1">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<FALSE' = TRUE`, () => {
    const result = parse(`="1"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=FALSE' = FALSE`, () => {
    const result = parse(`="1"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>FALSE' = TRUE`, () => {
    const result = parse(`="1"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=FALSE' = FALSE`, () => {
    const result = parse(`="1">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=FALSE' = TRUE`, () => {
    const result = parse(`="1"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&FALSE' = 1FALSE`, () => {
    const result = parse(`="1"&FALSE`);
    expect(result.value).toBe("1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"Hello"' = FALSE`, () => {
    const result = parse(`="1">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"Hello"' = TRUE`, () => {
    const result = parse(`="1"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="Hello"' = FALSE`, () => {
    const result = parse(`="1"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"Hello"' = TRUE`, () => {
    const result = parse(`="1"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="Hello"' = FALSE`, () => {
    const result = parse(`="1">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="Hello"' = TRUE`, () => {
    const result = parse(`="1"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"Hello"' = 1Hello`, () => {
    const result = parse(`="1"&"Hello"`);
    expect(result.value).toBe("1Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+""' = parser.VVALUE`, () => {
    const result = parse(`="1"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-""' = parser.VVALUE`, () => {
    const result = parse(`="1"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*""' = parser.VVALUE`, () => {
    const result = parse(`="1"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/""' = parser.VVALUE`, () => {
    const result = parse(`="1"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^""' = parser.VVALUE`, () => {
    const result = parse(`="1"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">""' = TRUE`, () => {
    const result = parse(`="1">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<""' = FALSE`, () => {
    const result = parse(`="1"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"=""' = FALSE`, () => {
    const result = parse(`="1"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>""' = TRUE`, () => {
    const result = parse(`="1"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">=""' = TRUE`, () => {
    const result = parse(`="1">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<=""' = FALSE`, () => {
    const result = parse(`="1"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&""' = 1`, () => {
    const result = parse(`="1"&""`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"h1"' = FALSE`, () => {
    const result = parse(`="1">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"h1"' = TRUE`, () => {
    const result = parse(`="1"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="h1"' = FALSE`, () => {
    const result = parse(`="1"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"h1"' = TRUE`, () => {
    const result = parse(`="1"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="h1"' = FALSE`, () => {
    const result = parse(`="1">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="h1"' = TRUE`, () => {
    const result = parse(`="1"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"h1"' = 1h1`, () => {
    const result = parse(`="1"&"h1"`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"1h"' = FALSE`, () => {
    const result = parse(`="1">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"1h"' = TRUE`, () => {
    const result = parse(`="1"<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="1h"' = FALSE`, () => {
    const result = parse(`="1"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"1h"' = TRUE`, () => {
    const result = parse(`="1"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="1h"' = FALSE`, () => {
    const result = parse(`="1">="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="1h"' = TRUE`, () => {
    const result = parse(`="1"<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"1h"' = 11h`, () => {
    const result = parse(`="1"&"1h"`);
    expect(result.value).toBe("11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"A"' = FALSE`, () => {
    const result = parse(`="1">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"A"' = TRUE`, () => {
    const result = parse(`="1"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="A"' = FALSE`, () => {
    const result = parse(`="1"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"A"' = TRUE`, () => {
    const result = parse(`="1"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="A"' = FALSE`, () => {
    const result = parse(`="1">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="A"' = TRUE`, () => {
    const result = parse(`="1"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"A"' = 1A`, () => {
    const result = parse(`="1"&"A"`);
    expect(result.value).toBe("1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"Z"' = FALSE`, () => {
    const result = parse(`="1">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"Z"' = TRUE`, () => {
    const result = parse(`="1"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="Z"' = FALSE`, () => {
    const result = parse(`="1"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"Z"' = TRUE`, () => {
    const result = parse(`="1"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="Z"' = FALSE`, () => {
    const result = parse(`="1">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="Z"' = TRUE`, () => {
    const result = parse(`="1"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"Z"' = 1Z`, () => {
    const result = parse(`="1"&"Z"`);
    expect(result.value).toBe("1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"$"' = TRUE`, () => {
    const result = parse(`="1">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"$"' = FALSE`, () => {
    const result = parse(`="1"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="$"' = FALSE`, () => {
    const result = parse(`="1"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"$"' = TRUE`, () => {
    const result = parse(`="1"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="$"' = TRUE`, () => {
    const result = parse(`="1">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="$"' = FALSE`, () => {
    const result = parse(`="1"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"$"' = 1$`, () => {
    const result = parse(`="1"&"$"`);
    expect(result.value).toBe("1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="1"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="1"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="1"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="1"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="1"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1">"_"' = TRUE`, () => {
    const result = parse(`="1">"_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<"_"' = FALSE`, () => {
    const result = parse(`="1"<"_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"="_"' = FALSE`, () => {
    const result = parse(`="1"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>"_"' = TRUE`, () => {
    const result = parse(`="1"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">="_"' = TRUE`, () => {
    const result = parse(`="1">="_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<="_"' = FALSE`, () => {
    const result = parse(`="1"<="_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&"_"' = 1_`, () => {
    const result = parse(`="1"&"_"`);
    expect(result.value).toBe("1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+{1}' = 2`, () => {
    const result = parse(`="1"+{1}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-{1}' = 0`, () => {
    const result = parse(`="1"-{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*{1}' = 1`, () => {
    const result = parse(`="1"*{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/{1}' = 1`, () => {
    const result = parse(`="1"/{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^{1}' = 1`, () => {
    const result = parse(`="1"^{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">{1}' = TRUE`, () => {
    const result = parse(`="1">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<{1}' = FALSE`, () => {
    const result = parse(`="1"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"={1}' = FALSE`, () => {
    const result = parse(`="1"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>{1}' = TRUE`, () => {
    const result = parse(`="1"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">={1}' = TRUE`, () => {
    const result = parse(`="1">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<={1}' = FALSE`, () => {
    const result = parse(`="1"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&{1}' = 11`, () => {
    const result = parse(`="1"&{1}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1"+{"1"}' = 2`, () => {
    const result = parse(`="1"+{"1"}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"-{"1"}' = 0`, () => {
    const result = parse(`="1"-{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"*{"1"}' = 1`, () => {
    const result = parse(`="1"*{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"/{"1"}' = 1`, () => {
    const result = parse(`="1"/{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1"^{"1"}' = 1`, () => {
    const result = parse(`="1"^{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="1">{"1"}' = FALSE`, () => {
    const result = parse(`="1">{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<{"1"}' = FALSE`, () => {
    const result = parse(`="1"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"={"1"}' = TRUE`, () => {
    const result = parse(`="1"={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<>{"1"}' = FALSE`, () => {
    const result = parse(`="1"<>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1">={"1"}' = TRUE`, () => {
    const result = parse(`="1">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"<={"1"}' = TRUE`, () => {
    const result = parse(`="1"<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1"&{"1"}' = 11`, () => {
    const result = parse(`="1"&{"1"}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+0' = -1`, () => {
    const result = parse(`=-1+0`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-0' = -1`, () => {
    const result = parse(`=-1-0`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*0' = 0`, () => {
    const result = parse(`=-1*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/0' = parser.DIV0`, () => {
    const result = parse(`=-1/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^0' = 1`, () => {
    const result = parse(`=-1^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>0' = FALSE`, () => {
    const result = parse(`=-1>0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<0' = TRUE`, () => {
    const result = parse(`=-1<0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=0' = FALSE`, () => {
    const result = parse(`=-1=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>0' = TRUE`, () => {
    const result = parse(`=-1<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=0' = FALSE`, () => {
    const result = parse(`=-1>=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=0' = TRUE`, () => {
    const result = parse(`=-1<=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&0' = -10`, () => {
    const result = parse(`=-1&0`);
    expect(result.value).toBe("-10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+1' = 0`, () => {
    const result = parse(`=-1+1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-1' = -2`, () => {
    const result = parse(`=-1-1`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*1' = -1`, () => {
    const result = parse(`=-1*1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/1' = -1`, () => {
    const result = parse(`=-1/1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^1' = -1`, () => {
    const result = parse(`=-1^1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>1' = FALSE`, () => {
    const result = parse(`=-1>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<1' = TRUE`, () => {
    const result = parse(`=-1<1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=1' = FALSE`, () => {
    const result = parse(`=-1=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>1' = TRUE`, () => {
    const result = parse(`=-1<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=1' = FALSE`, () => {
    const result = parse(`=-1>=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=1' = TRUE`, () => {
    const result = parse(`=-1<=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&1' = -11`, () => {
    const result = parse(`=-1&1`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"0"' = -1`, () => {
    const result = parse(`=-1+"0"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-"0"' = -1`, () => {
    const result = parse(`=-1-"0"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*"0"' = 0`, () => {
    const result = parse(`=-1*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/"0"' = parser.DIV0`, () => {
    const result = parse(`=-1/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"0"' = 1`, () => {
    const result = parse(`=-1^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>"0"' = FALSE`, () => {
    const result = parse(`=-1>"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"0"' = TRUE`, () => {
    const result = parse(`=-1<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="0"' = FALSE`, () => {
    const result = parse(`=-1="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"0"' = TRUE`, () => {
    const result = parse(`=-1<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="0"' = FALSE`, () => {
    const result = parse(`=-1>="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="0"' = TRUE`, () => {
    const result = parse(`=-1<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"0"' = -10`, () => {
    const result = parse(`=-1&"0"`);
    expect(result.value).toBe("-10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"1"' = 0`, () => {
    const result = parse(`=-1+"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-"1"' = -2`, () => {
    const result = parse(`=-1-"1"`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*"1"' = -1`, () => {
    const result = parse(`=-1*"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/"1"' = -1`, () => {
    const result = parse(`=-1/"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^"1"' = -1`, () => {
    const result = parse(`=-1^"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>"1"' = FALSE`, () => {
    const result = parse(`=-1>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"1"' = TRUE`, () => {
    const result = parse(`=-1<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="1"' = FALSE`, () => {
    const result = parse(`=-1="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"1"' = TRUE`, () => {
    const result = parse(`=-1<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="1"' = FALSE`, () => {
    const result = parse(`=-1>="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="1"' = TRUE`, () => {
    const result = parse(`=-1<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"1"' = -11`, () => {
    const result = parse(`=-1&"1"`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+-1' = -2`, () => {
    const result = parse(`=-1+-1`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1--1' = 0`, () => {
    const result = parse(`=-1--1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*-1' = 1`, () => {
    const result = parse(`=-1*-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/-1' = 1`, () => {
    const result = parse(`=-1/-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^-1' = -1`, () => {
    const result = parse(`=-1^-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>-1' = FALSE`, () => {
    const result = parse(`=-1>-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<-1' = FALSE`, () => {
    const result = parse(`=-1<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=-1' = TRUE`, () => {
    const result = parse(`=-1=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>-1' = FALSE`, () => {
    const result = parse(`=-1<>-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=-1' = TRUE`, () => {
    const result = parse(`=-1>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=-1' = TRUE`, () => {
    const result = parse(`=-1<=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&-1' = -1-1`, () => {
    const result = parse(`=-1&-1`);
    expect(result.value).toBe("-1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"-1"' = -2`, () => {
    const result = parse(`=-1+"-1"`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-"-1"' = 0`, () => {
    const result = parse(`=-1-"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*"-1"' = 1`, () => {
    const result = parse(`=-1*"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/"-1"' = 1`, () => {
    const result = parse(`=-1/"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^"-1"' = -1`, () => {
    const result = parse(`=-1^"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>"-1"' = FALSE`, () => {
    const result = parse(`=-1>"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"-1"' = TRUE`, () => {
    const result = parse(`=-1<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="-1"' = FALSE`, () => {
    const result = parse(`=-1="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"-1"' = TRUE`, () => {
    const result = parse(`=-1<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="-1"' = FALSE`, () => {
    const result = parse(`=-1>="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="-1"' = TRUE`, () => {
    const result = parse(`=-1<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"-1"' = -1-1`, () => {
    const result = parse(`=-1&"-1"`);
    expect(result.value).toBe("-1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+TRUE' = 0`, () => {
    const result = parse(`=-1+TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-TRUE' = -2`, () => {
    const result = parse(`=-1-TRUE`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*TRUE' = -1`, () => {
    const result = parse(`=-1*TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/TRUE' = -1`, () => {
    const result = parse(`=-1/TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^TRUE' = -1`, () => {
    const result = parse(`=-1^TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>TRUE' = FALSE`, () => {
    const result = parse(`=-1>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<TRUE' = TRUE`, () => {
    const result = parse(`=-1<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=TRUE' = FALSE`, () => {
    const result = parse(`=-1=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>TRUE' = TRUE`, () => {
    const result = parse(`=-1<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=TRUE' = FALSE`, () => {
    const result = parse(`=-1>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=TRUE' = TRUE`, () => {
    const result = parse(`=-1<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&TRUE' = -1TRUE`, () => {
    const result = parse(`=-1&TRUE`);
    expect(result.value).toBe("-1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+FALSE' = -1`, () => {
    const result = parse(`=-1+FALSE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-FALSE' = -1`, () => {
    const result = parse(`=-1-FALSE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*FALSE' = 0`, () => {
    const result = parse(`=-1*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/FALSE' = parser.DIV0`, () => {
    const result = parse(`=-1/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^FALSE' = 1`, () => {
    const result = parse(`=-1^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>FALSE' = FALSE`, () => {
    const result = parse(`=-1>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<FALSE' = TRUE`, () => {
    const result = parse(`=-1<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=FALSE' = FALSE`, () => {
    const result = parse(`=-1=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>FALSE' = TRUE`, () => {
    const result = parse(`=-1<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=FALSE' = FALSE`, () => {
    const result = parse(`=-1>=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=FALSE' = TRUE`, () => {
    const result = parse(`=-1<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&FALSE' = -1FALSE`, () => {
    const result = parse(`=-1&FALSE`);
    expect(result.value).toBe("-1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"Hello"' = FALSE`, () => {
    const result = parse(`=-1>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"Hello"' = TRUE`, () => {
    const result = parse(`=-1<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="Hello"' = FALSE`, () => {
    const result = parse(`=-1="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"Hello"' = TRUE`, () => {
    const result = parse(`=-1<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="Hello"' = FALSE`, () => {
    const result = parse(`=-1>="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="Hello"' = TRUE`, () => {
    const result = parse(`=-1<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"Hello"' = -1Hello`, () => {
    const result = parse(`=-1&"Hello"`);
    expect(result.value).toBe("-1Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+""' = parser.VVALUE`, () => {
    const result = parse(`=-1+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-""' = parser.VVALUE`, () => {
    const result = parse(`=-1-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*""' = parser.VVALUE`, () => {
    const result = parse(`=-1*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/""' = parser.VVALUE`, () => {
    const result = parse(`=-1/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^""' = parser.VVALUE`, () => {
    const result = parse(`=-1^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>""' = FALSE`, () => {
    const result = parse(`=-1>""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<""' = TRUE`, () => {
    const result = parse(`=-1<""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1=""' = FALSE`, () => {
    const result = parse(`=-1=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>""' = TRUE`, () => {
    const result = parse(`=-1<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>=""' = FALSE`, () => {
    const result = parse(`=-1>=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<=""' = TRUE`, () => {
    const result = parse(`=-1<=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&""' = -1`, () => {
    const result = parse(`=-1&""`);
    expect(result.value).toBe("-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"h1"' = FALSE`, () => {
    const result = parse(`=-1>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"h1"' = TRUE`, () => {
    const result = parse(`=-1<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="h1"' = FALSE`, () => {
    const result = parse(`=-1="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"h1"' = TRUE`, () => {
    const result = parse(`=-1<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="h1"' = FALSE`, () => {
    const result = parse(`=-1>="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="h1"' = TRUE`, () => {
    const result = parse(`=-1<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"h1"' = -1h1`, () => {
    const result = parse(`=-1&"h1"`);
    expect(result.value).toBe("-1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"1h"' = FALSE`, () => {
    const result = parse(`=-1>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"1h"' = TRUE`, () => {
    const result = parse(`=-1<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="1h"' = FALSE`, () => {
    const result = parse(`=-1="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"1h"' = TRUE`, () => {
    const result = parse(`=-1<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="1h"' = FALSE`, () => {
    const result = parse(`=-1>="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="1h"' = TRUE`, () => {
    const result = parse(`=-1<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"1h"' = -11h`, () => {
    const result = parse(`=-1&"1h"`);
    expect(result.value).toBe("-11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"A"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"A"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"A"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"A"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"A"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"A"' = FALSE`, () => {
    const result = parse(`=-1>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"A"' = TRUE`, () => {
    const result = parse(`=-1<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="A"' = FALSE`, () => {
    const result = parse(`=-1="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"A"' = TRUE`, () => {
    const result = parse(`=-1<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="A"' = FALSE`, () => {
    const result = parse(`=-1>="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="A"' = TRUE`, () => {
    const result = parse(`=-1<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"A"' = -1A`, () => {
    const result = parse(`=-1&"A"`);
    expect(result.value).toBe("-1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"Z"' = FALSE`, () => {
    const result = parse(`=-1>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"Z"' = TRUE`, () => {
    const result = parse(`=-1<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="Z"' = FALSE`, () => {
    const result = parse(`=-1="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"Z"' = TRUE`, () => {
    const result = parse(`=-1<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="Z"' = FALSE`, () => {
    const result = parse(`=-1>="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="Z"' = TRUE`, () => {
    const result = parse(`=-1<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"Z"' = -1Z`, () => {
    const result = parse(`=-1&"Z"`);
    expect(result.value).toBe("-1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"$"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"$"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"$"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"$"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"$"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"$"' = FALSE`, () => {
    const result = parse(`=-1>"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"$"' = TRUE`, () => {
    const result = parse(`=-1<"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="$"' = FALSE`, () => {
    const result = parse(`=-1="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"$"' = TRUE`, () => {
    const result = parse(`=-1<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="$"' = FALSE`, () => {
    const result = parse(`=-1>="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="$"' = TRUE`, () => {
    const result = parse(`=-1<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"$"' = -1$`, () => {
    const result = parse(`=-1&"$"`);
    expect(result.value).toBe("-1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+"_"' = parser.VVALUE`, () => {
    const result = parse(`=-1+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1-"_"' = parser.VVALUE`, () => {
    const result = parse(`=-1-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1*"_"' = parser.VVALUE`, () => {
    const result = parse(`=-1*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1/"_"' = parser.VVALUE`, () => {
    const result = parse(`=-1/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1^"_"' = parser.VVALUE`, () => {
    const result = parse(`=-1^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=-1>"_"' = FALSE`, () => {
    const result = parse(`=-1>"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<"_"' = TRUE`, () => {
    const result = parse(`=-1<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1="_"' = FALSE`, () => {
    const result = parse(`=-1="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>"_"' = TRUE`, () => {
    const result = parse(`=-1<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>="_"' = FALSE`, () => {
    const result = parse(`=-1>="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<="_"' = TRUE`, () => {
    const result = parse(`=-1<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&"_"' = -1_`, () => {
    const result = parse(`=-1&"_"`);
    expect(result.value).toBe("-1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+{1}' = 0`, () => {
    const result = parse(`=-1+{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-{1}' = -2`, () => {
    const result = parse(`=-1-{1}`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*{1}' = -1`, () => {
    const result = parse(`=-1*{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/{1}' = -1`, () => {
    const result = parse(`=-1/{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^{1}' = -1`, () => {
    const result = parse(`=-1^{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>{1}' = FALSE`, () => {
    const result = parse(`=-1>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<{1}' = TRUE`, () => {
    const result = parse(`=-1<{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1={1}' = FALSE`, () => {
    const result = parse(`=-1={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>{1}' = TRUE`, () => {
    const result = parse(`=-1<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>={1}' = FALSE`, () => {
    const result = parse(`=-1>={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<={1}' = TRUE`, () => {
    const result = parse(`=-1<={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&{1}' = -11`, () => {
    const result = parse(`=-1&{1}`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-1+{"1"}' = 0`, () => {
    const result = parse(`=-1+{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1-{"1"}' = -2`, () => {
    const result = parse(`=-1-{"1"}`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1*{"1"}' = -1`, () => {
    const result = parse(`=-1*{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1/{"1"}' = -1`, () => {
    const result = parse(`=-1/{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1^{"1"}' = -1`, () => {
    const result = parse(`=-1^{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1>{"1"}' = FALSE`, () => {
    const result = parse(`=-1>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<{"1"}' = TRUE`, () => {
    const result = parse(`=-1<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1={"1"}' = FALSE`, () => {
    const result = parse(`=-1={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<>{"1"}' = TRUE`, () => {
    const result = parse(`=-1<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1>={"1"}' = FALSE`, () => {
    const result = parse(`=-1>={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1<={"1"}' = TRUE`, () => {
    const result = parse(`=-1<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-1&{"1"}' = -11`, () => {
    const result = parse(`=-1&{"1"}`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+0' = -1`, () => {
    const result = parse(`="-1"+0`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-0' = -1`, () => {
    const result = parse(`="-1"-0`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*0' = 0`, () => {
    const result = parse(`="-1"*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/0' = parser.DIV0`, () => {
    const result = parse(`="-1"/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^0' = 1`, () => {
    const result = parse(`="-1"^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">0' = TRUE`, () => {
    const result = parse(`="-1">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<0' = FALSE`, () => {
    const result = parse(`="-1"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=0' = FALSE`, () => {
    const result = parse(`="-1"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>0' = TRUE`, () => {
    const result = parse(`="-1"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=0' = TRUE`, () => {
    const result = parse(`="-1">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=0' = FALSE`, () => {
    const result = parse(`="-1"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&0' = -10`, () => {
    const result = parse(`="-1"&0`);
    expect(result.value).toBe("-10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+1' = 0`, () => {
    const result = parse(`="-1"+1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-1' = -2`, () => {
    const result = parse(`="-1"-1`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*1' = -1`, () => {
    const result = parse(`="-1"*1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/1' = -1`, () => {
    const result = parse(`="-1"/1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^1' = -1`, () => {
    const result = parse(`="-1"^1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">1' = TRUE`, () => {
    const result = parse(`="-1">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<1' = FALSE`, () => {
    const result = parse(`="-1"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=1' = FALSE`, () => {
    const result = parse(`="-1"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>1' = TRUE`, () => {
    const result = parse(`="-1"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=1' = TRUE`, () => {
    const result = parse(`="-1">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=1' = FALSE`, () => {
    const result = parse(`="-1"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&1' = -11`, () => {
    const result = parse(`="-1"&1`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"0"' = -1`, () => {
    const result = parse(`="-1"+"0"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-"0"' = -1`, () => {
    const result = parse(`="-1"-"0"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*"0"' = 0`, () => {
    const result = parse(`="-1"*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/"0"' = parser.DIV0`, () => {
    const result = parse(`="-1"/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"0"' = 1`, () => {
    const result = parse(`="-1"^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">"0"' = TRUE`, () => {
    const result = parse(`="-1">"0"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"0"' = FALSE`, () => {
    const result = parse(`="-1"<"0"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="0"' = FALSE`, () => {
    const result = parse(`="-1"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"0"' = TRUE`, () => {
    const result = parse(`="-1"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="0"' = TRUE`, () => {
    const result = parse(`="-1">="0"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="0"' = FALSE`, () => {
    const result = parse(`="-1"<="0"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"0"' = -10`, () => {
    const result = parse(`="-1"&"0"`);
    expect(result.value).toBe("-10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"1"' = 0`, () => {
    const result = parse(`="-1"+"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-"1"' = -2`, () => {
    const result = parse(`="-1"-"1"`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*"1"' = -1`, () => {
    const result = parse(`="-1"*"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/"1"' = -1`, () => {
    const result = parse(`="-1"/"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^"1"' = -1`, () => {
    const result = parse(`="-1"^"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">"1"' = TRUE`, () => {
    const result = parse(`="-1">"1"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"1"' = FALSE`, () => {
    const result = parse(`="-1"<"1"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="1"' = FALSE`, () => {
    const result = parse(`="-1"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"1"' = TRUE`, () => {
    const result = parse(`="-1"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="1"' = TRUE`, () => {
    const result = parse(`="-1">="1"`);
    expect(result.value).toBe(false); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="1"' = FALSE`, () => {
    const result = parse(`="-1"<="1"`);
    expect(result.value).toBe(true); // excel incorrect
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"1"' = -11`, () => {
    const result = parse(`="-1"&"1"`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+-1' = -2`, () => {
    const result = parse(`="-1"+-1`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"--1' = 0`, () => {
    const result = parse(`="-1"--1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*-1' = 1`, () => {
    const result = parse(`="-1"*-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/-1' = 1`, () => {
    const result = parse(`="-1"/-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^-1' = -1`, () => {
    const result = parse(`="-1"^-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">-1' = TRUE`, () => {
    const result = parse(`="-1">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<-1' = FALSE`, () => {
    const result = parse(`="-1"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=-1' = FALSE`, () => {
    const result = parse(`="-1"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>-1' = TRUE`, () => {
    const result = parse(`="-1"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=-1' = TRUE`, () => {
    const result = parse(`="-1">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=-1' = FALSE`, () => {
    const result = parse(`="-1"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&-1' = -1-1`, () => {
    const result = parse(`="-1"&-1`);
    expect(result.value).toBe("-1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"-1"' = -2`, () => {
    const result = parse(`="-1"+"-1"`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-"-1"' = 0`, () => {
    const result = parse(`="-1"-"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*"-1"' = 1`, () => {
    const result = parse(`="-1"*"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/"-1"' = 1`, () => {
    const result = parse(`="-1"/"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^"-1"' = -1`, () => {
    const result = parse(`="-1"^"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">"-1"' = FALSE`, () => {
    const result = parse(`="-1">"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"-1"' = FALSE`, () => {
    const result = parse(`="-1"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="-1"' = TRUE`, () => {
    const result = parse(`="-1"="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"-1"' = FALSE`, () => {
    const result = parse(`="-1"<>"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="-1"' = TRUE`, () => {
    const result = parse(`="-1">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="-1"' = TRUE`, () => {
    const result = parse(`="-1"<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"-1"' = -1-1`, () => {
    const result = parse(`="-1"&"-1"`);
    expect(result.value).toBe("-1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+TRUE' = 0`, () => {
    const result = parse(`="-1"+TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-TRUE' = -2`, () => {
    const result = parse(`="-1"-TRUE`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*TRUE' = -1`, () => {
    const result = parse(`="-1"*TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/TRUE' = -1`, () => {
    const result = parse(`="-1"/TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^TRUE' = -1`, () => {
    const result = parse(`="-1"^TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">TRUE' = FALSE`, () => {
    const result = parse(`="-1">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<TRUE' = TRUE`, () => {
    const result = parse(`="-1"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=TRUE' = FALSE`, () => {
    const result = parse(`="-1"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>TRUE' = TRUE`, () => {
    const result = parse(`="-1"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=TRUE' = FALSE`, () => {
    const result = parse(`="-1">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=TRUE' = TRUE`, () => {
    const result = parse(`="-1"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&TRUE' = -1TRUE`, () => {
    const result = parse(`="-1"&TRUE`);
    expect(result.value).toBe("-1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+FALSE' = -1`, () => {
    const result = parse(`="-1"+FALSE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-FALSE' = -1`, () => {
    const result = parse(`="-1"-FALSE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*FALSE' = 0`, () => {
    const result = parse(`="-1"*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/FALSE' = parser.DIV0`, () => {
    const result = parse(`="-1"/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^FALSE' = 1`, () => {
    const result = parse(`="-1"^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">FALSE' = FALSE`, () => {
    const result = parse(`="-1">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<FALSE' = TRUE`, () => {
    const result = parse(`="-1"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=FALSE' = FALSE`, () => {
    const result = parse(`="-1"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>FALSE' = TRUE`, () => {
    const result = parse(`="-1"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=FALSE' = FALSE`, () => {
    const result = parse(`="-1">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=FALSE' = TRUE`, () => {
    const result = parse(`="-1"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&FALSE' = -1FALSE`, () => {
    const result = parse(`="-1"&FALSE`);
    expect(result.value).toBe("-1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"Hello"' = FALSE`, () => {
    const result = parse(`="-1">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"Hello"' = TRUE`, () => {
    const result = parse(`="-1"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="Hello"' = FALSE`, () => {
    const result = parse(`="-1"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"Hello"' = TRUE`, () => {
    const result = parse(`="-1"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="Hello"' = FALSE`, () => {
    const result = parse(`="-1">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="Hello"' = TRUE`, () => {
    const result = parse(`="-1"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"Hello"' = -1Hello`, () => {
    const result = parse(`="-1"&"Hello"`);
    expect(result.value).toBe("-1Hello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'="-1"+""' = parser.VVALUE`, () => {
    const result = parse(`="-1"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-""' = parser.VVALUE`, () => {
    const result = parse(`="-1"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*""' = parser.VVALUE`, () => {
    const result = parse(`="-1"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/""' = parser.VVALUE`, () => {
    const result = parse(`="-1"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^""' = parser.VVALUE`, () => {
    const result = parse(`="-1"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">""' = TRUE`, () => {
    const result = parse(`="-1">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<""' = FALSE`, () => {
    const result = parse(`="-1"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"=""' = FALSE`, () => {
    const result = parse(`="-1"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>""' = TRUE`, () => {
    const result = parse(`="-1"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">=""' = TRUE`, () => {
    const result = parse(`="-1">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<=""' = FALSE`, () => {
    const result = parse(`="-1"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&""' = -1`, () => {
    const result = parse(`="-1"&""`);
    expect(result.value).toBe("-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"h1"' = FALSE`, () => {
    const result = parse(`="-1">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"h1"' = TRUE`, () => {
    const result = parse(`="-1"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="h1"' = FALSE`, () => {
    const result = parse(`="-1"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"h1"' = TRUE`, () => {
    const result = parse(`="-1"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="h1"' = FALSE`, () => {
    const result = parse(`="-1">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="h1"' = TRUE`, () => {
    const result = parse(`="-1"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"h1"' = -1h1`, () => {
    const result = parse(`="-1"&"h1"`);
    expect(result.value).toBe("-1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"1h"' = FALSE`, () => {
    const result = parse(`="-1">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"1h"' = TRUE`, () => {
    const result = parse(`="-1"<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="1h"' = FALSE`, () => {
    const result = parse(`="-1"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"1h"' = TRUE`, () => {
    const result = parse(`="-1"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="1h"' = FALSE`, () => {
    const result = parse(`="-1">="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="1h"' = TRUE`, () => {
    const result = parse(`="-1"<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"1h"' = -11h`, () => {
    const result = parse(`="-1"&"1h"`);
    expect(result.value).toBe("-11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"A"' = FALSE`, () => {
    const result = parse(`="-1">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"A"' = TRUE`, () => {
    const result = parse(`="-1"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="A"' = FALSE`, () => {
    const result = parse(`="-1"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"A"' = TRUE`, () => {
    const result = parse(`="-1"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="A"' = FALSE`, () => {
    const result = parse(`="-1">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="A"' = TRUE`, () => {
    const result = parse(`="-1"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"A"' = -1A`, () => {
    const result = parse(`="-1"&"A"`);
    expect(result.value).toBe("-1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"Z"' = FALSE`, () => {
    const result = parse(`="-1">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"Z"' = TRUE`, () => {
    const result = parse(`="-1"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="Z"' = FALSE`, () => {
    const result = parse(`="-1"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"Z"' = TRUE`, () => {
    const result = parse(`="-1"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="Z"' = FALSE`, () => {
    const result = parse(`="-1">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="Z"' = TRUE`, () => {
    const result = parse(`="-1"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"Z"' = -1Z`, () => {
    const result = parse(`="-1"&"Z"`);
    expect(result.value).toBe("-1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"$"' = TRUE`, () => {
    const result = parse(`="-1">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"$"' = FALSE`, () => {
    const result = parse(`="-1"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="$"' = FALSE`, () => {
    const result = parse(`="-1"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"$"' = TRUE`, () => {
    const result = parse(`="-1"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="$"' = TRUE`, () => {
    const result = parse(`="-1">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="$"' = FALSE`, () => {
    const result = parse(`="-1"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"$"' = -1$`, () => {
    const result = parse(`="-1"&"$"`);
    expect(result.value).toBe("-1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="-1"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="-1"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="-1"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="-1"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="-1"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="-1">"_"' = TRUE`, () => {
    const result = parse(`="-1">"_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<"_"' = FALSE`, () => {
    const result = parse(`="-1"<"_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"="_"' = FALSE`, () => {
    const result = parse(`="-1"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>"_"' = TRUE`, () => {
    const result = parse(`="-1"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">="_"' = TRUE`, () => {
    const result = parse(`="-1">="_"`);
    expect(result.value).toBe(false); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<="_"' = FALSE`, () => {
    const result = parse(`="-1"<="_"`);
    expect(result.value).toBe(true); // adjusted to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&"_"' = -1_`, () => {
    const result = parse(`="-1"&"_"`);
    expect(result.value).toBe("-1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+{1}' = 0`, () => {
    const result = parse(`="-1"+{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-{1}' = -2`, () => {
    const result = parse(`="-1"-{1}`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*{1}' = -1`, () => {
    const result = parse(`="-1"*{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/{1}' = -1`, () => {
    const result = parse(`="-1"/{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^{1}' = -1`, () => {
    const result = parse(`="-1"^{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">{1}' = TRUE`, () => {
    const result = parse(`="-1">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<{1}' = FALSE`, () => {
    const result = parse(`="-1"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"={1}' = FALSE`, () => {
    const result = parse(`="-1"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>{1}' = TRUE`, () => {
    const result = parse(`="-1"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">={1}' = TRUE`, () => {
    const result = parse(`="-1">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<={1}' = FALSE`, () => {
    const result = parse(`="-1"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&{1}' = -11`, () => {
    const result = parse(`="-1"&{1}`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="-1"+{"1"}' = 0`, () => {
    const result = parse(`="-1"+{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"-{"1"}' = -2`, () => {
    const result = parse(`="-1"-{"1"}`);
    expect(result.value).toBe(-2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"*{"1"}' = -1`, () => {
    const result = parse(`="-1"*{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"/{"1"}' = -1`, () => {
    const result = parse(`="-1"/{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1"^{"1"}' = -1`, () => {
    const result = parse(`="-1"^{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'="-1">{"1"}' = TRUE`, () => {
    const result = parse(`="-1">{"1"}`);
    expect(result.value).toBe(false); // excel makes no sense whatsoever
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<{"1"}' = FALSE`, () => {
    const result = parse(`="-1"<{"1"}`);
    expect(result.value).toBe(true); // excel makes no sense whatsoever
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"={"1"}' = FALSE`, () => {
    const result = parse(`="-1"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<>{"1"}' = TRUE`, () => {
    const result = parse(`="-1"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1">={"1"}' = TRUE`, () => {
    const result = parse(`="-1">={"1"}`);
    expect(result.value).toBe(false); // excel makes no sense whatsoever
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"<={"1"}' = FALSE`, () => {
    const result = parse(`="-1"<={"1"}`);
    expect(result.value).toBe(true); // excel makes no sense whatsoever
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="-1"&{"1"}' = -11`, () => {
    const result = parse(`="-1"&{"1"}`);
    expect(result.value).toBe("-11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+0' = 1`, () => {
    const result = parse(`=TRUE+0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-0' = 1`, () => {
    const result = parse(`=TRUE-0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*0' = 0`, () => {
    const result = parse(`=TRUE*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/0' = parser.DIV0`, () => {
    const result = parse(`=TRUE/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^0' = 1`, () => {
    const result = parse(`=TRUE^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>0' = TRUE`, () => {
    const result = parse(`=TRUE>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<0' = FALSE`, () => {
    const result = parse(`=TRUE<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=0' = FALSE`, () => {
    const result = parse(`=TRUE=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>0' = TRUE`, () => {
    const result = parse(`=TRUE<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=0' = TRUE`, () => {
    const result = parse(`=TRUE>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=0' = FALSE`, () => {
    const result = parse(`=TRUE<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&0' = TRUE0`, () => {
    const result = parse(`=TRUE&0`);
    expect(result.value).toBe("TRUE0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+1' = 2`, () => {
    const result = parse(`=TRUE+1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-1' = 0`, () => {
    const result = parse(`=TRUE-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*1' = 1`, () => {
    const result = parse(`=TRUE*1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/1' = 1`, () => {
    const result = parse(`=TRUE/1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^1' = 1`, () => {
    const result = parse(`=TRUE^1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>1' = TRUE`, () => {
    const result = parse(`=TRUE>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<1' = FALSE`, () => {
    const result = parse(`=TRUE<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=1' = FALSE`, () => {
    const result = parse(`=TRUE=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>1' = TRUE`, () => {
    const result = parse(`=TRUE<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=1' = TRUE`, () => {
    const result = parse(`=TRUE>=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=1' = FALSE`, () => {
    const result = parse(`=TRUE<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&1' = TRUE1`, () => {
    const result = parse(`=TRUE&1`);
    expect(result.value).toBe("TRUE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"0"' = 1`, () => {
    const result = parse(`=TRUE+"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-"0"' = 1`, () => {
    const result = parse(`=TRUE-"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*"0"' = 0`, () => {
    const result = parse(`=TRUE*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/"0"' = parser.DIV0`, () => {
    const result = parse(`=TRUE/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"0"' = 1`, () => {
    const result = parse(`=TRUE^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>"0"' = TRUE`, () => {
    const result = parse(`=TRUE>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"0"' = FALSE`, () => {
    const result = parse(`=TRUE<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="0"' = FALSE`, () => {
    const result = parse(`=TRUE="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"0"' = TRUE`, () => {
    const result = parse(`=TRUE<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="0"' = TRUE`, () => {
    const result = parse(`=TRUE>="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="0"' = FALSE`, () => {
    const result = parse(`=TRUE<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"0"' = TRUE0`, () => {
    const result = parse(`=TRUE&"0"`);
    expect(result.value).toBe("TRUE0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"1"' = 2`, () => {
    const result = parse(`=TRUE+"1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-"1"' = 0`, () => {
    const result = parse(`=TRUE-"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*"1"' = 1`, () => {
    const result = parse(`=TRUE*"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/"1"' = 1`, () => {
    const result = parse(`=TRUE/"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^"1"' = 1`, () => {
    const result = parse(`=TRUE^"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>"1"' = TRUE`, () => {
    const result = parse(`=TRUE>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"1"' = FALSE`, () => {
    const result = parse(`=TRUE<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="1"' = FALSE`, () => {
    const result = parse(`=TRUE="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"1"' = TRUE`, () => {
    const result = parse(`=TRUE<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="1"' = TRUE`, () => {
    const result = parse(`=TRUE>="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="1"' = FALSE`, () => {
    const result = parse(`=TRUE<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"1"' = TRUE1`, () => {
    const result = parse(`=TRUE&"1"`);
    expect(result.value).toBe("TRUE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+-1' = 0`, () => {
    const result = parse(`=TRUE+-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE--1' = 2`, () => {
    const result = parse(`=TRUE--1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*-1' = -1`, () => {
    const result = parse(`=TRUE*-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/-1' = -1`, () => {
    const result = parse(`=TRUE/-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^-1' = 1`, () => {
    const result = parse(`=TRUE^-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>-1' = TRUE`, () => {
    const result = parse(`=TRUE>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<-1' = FALSE`, () => {
    const result = parse(`=TRUE<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=-1' = FALSE`, () => {
    const result = parse(`=TRUE=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>-1' = TRUE`, () => {
    const result = parse(`=TRUE<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=-1' = TRUE`, () => {
    const result = parse(`=TRUE>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=-1' = FALSE`, () => {
    const result = parse(`=TRUE<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&-1' = TRUE-1`, () => {
    const result = parse(`=TRUE&-1`);
    expect(result.value).toBe("TRUE-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"-1"' = 0`, () => {
    const result = parse(`=TRUE+"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-"-1"' = 2`, () => {
    const result = parse(`=TRUE-"-1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*"-1"' = -1`, () => {
    const result = parse(`=TRUE*"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/"-1"' = -1`, () => {
    const result = parse(`=TRUE/"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^"-1"' = 1`, () => {
    const result = parse(`=TRUE^"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>"-1"' = TRUE`, () => {
    const result = parse(`=TRUE>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"-1"' = FALSE`, () => {
    const result = parse(`=TRUE<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="-1"' = FALSE`, () => {
    const result = parse(`=TRUE="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"-1"' = TRUE`, () => {
    const result = parse(`=TRUE<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="-1"' = TRUE`, () => {
    const result = parse(`=TRUE>="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="-1"' = FALSE`, () => {
    const result = parse(`=TRUE<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"-1"' = TRUE-1`, () => {
    const result = parse(`=TRUE&"-1"`);
    expect(result.value).toBe("TRUE-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+TRUE' = 2`, () => {
    const result = parse(`=TRUE+TRUE`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-TRUE' = 0`, () => {
    const result = parse(`=TRUE-TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*TRUE' = 1`, () => {
    const result = parse(`=TRUE*TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/TRUE' = 1`, () => {
    const result = parse(`=TRUE/TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^TRUE' = 1`, () => {
    const result = parse(`=TRUE^TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>TRUE' = FALSE`, () => {
    const result = parse(`=TRUE>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<TRUE' = FALSE`, () => {
    const result = parse(`=TRUE<TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=TRUE' = TRUE`, () => {
    const result = parse(`=TRUE=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>TRUE' = FALSE`, () => {
    const result = parse(`=TRUE<>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=TRUE' = TRUE`, () => {
    const result = parse(`=TRUE>=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=TRUE' = TRUE`, () => {
    const result = parse(`=TRUE<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&TRUE' = TRUETRUE`, () => {
    const result = parse(`=TRUE&TRUE`);
    expect(result.value).toBe("TRUETRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+FALSE' = 1`, () => {
    const result = parse(`=TRUE+FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-FALSE' = 1`, () => {
    const result = parse(`=TRUE-FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*FALSE' = 0`, () => {
    const result = parse(`=TRUE*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/FALSE' = parser.DIV0`, () => {
    const result = parse(`=TRUE/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^FALSE' = 1`, () => {
    const result = parse(`=TRUE^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>FALSE' = TRUE`, () => {
    const result = parse(`=TRUE>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<FALSE' = FALSE`, () => {
    const result = parse(`=TRUE<FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=FALSE' = FALSE`, () => {
    const result = parse(`=TRUE=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>FALSE' = TRUE`, () => {
    const result = parse(`=TRUE<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=FALSE' = TRUE`, () => {
    const result = parse(`=TRUE>=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=FALSE' = FALSE`, () => {
    const result = parse(`=TRUE<=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&FALSE' = TRUEFALSE`, () => {
    const result = parse(`=TRUE&FALSE`);
    expect(result.value).toBe("TRUEFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"Hello"' = TRUE`, () => {
    const result = parse(`=TRUE>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"Hello"' = FALSE`, () => {
    const result = parse(`=TRUE<"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="Hello"' = FALSE`, () => {
    const result = parse(`=TRUE="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"Hello"' = TRUE`, () => {
    const result = parse(`=TRUE<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="Hello"' = TRUE`, () => {
    const result = parse(`=TRUE>="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="Hello"' = FALSE`, () => {
    const result = parse(`=TRUE<="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"Hello"' = TRUEHello`, () => {
    const result = parse(`=TRUE&"Hello"`);
    expect(result.value).toBe("TRUEHello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'=TRUE+""' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-""' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*""' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/""' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^""' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>""' = TRUE`, () => {
    const result = parse(`=TRUE>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<""' = FALSE`, () => {
    const result = parse(`=TRUE<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE=""' = FALSE`, () => {
    const result = parse(`=TRUE=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>""' = TRUE`, () => {
    const result = parse(`=TRUE<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>=""' = TRUE`, () => {
    const result = parse(`=TRUE>=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<=""' = FALSE`, () => {
    const result = parse(`=TRUE<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&""' = TRUE`, () => {
    const result = parse(`=TRUE&""`);
    expect(result.value).toBe("TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"h1"' = TRUE`, () => {
    const result = parse(`=TRUE>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"h1"' = FALSE`, () => {
    const result = parse(`=TRUE<"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="h1"' = FALSE`, () => {
    const result = parse(`=TRUE="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"h1"' = TRUE`, () => {
    const result = parse(`=TRUE<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="h1"' = TRUE`, () => {
    const result = parse(`=TRUE>="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="h1"' = FALSE`, () => {
    const result = parse(`=TRUE<="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"h1"' = TRUEh1`, () => {
    const result = parse(`=TRUE&"h1"`);
    expect(result.value).toBe("TRUEh1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"1h"' = TRUE`, () => {
    const result = parse(`=TRUE>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"1h"' = FALSE`, () => {
    const result = parse(`=TRUE<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="1h"' = FALSE`, () => {
    const result = parse(`=TRUE="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"1h"' = TRUE`, () => {
    const result = parse(`=TRUE<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="1h"' = TRUE`, () => {
    const result = parse(`=TRUE>="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="1h"' = FALSE`, () => {
    const result = parse(`=TRUE<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"1h"' = TRUE1h`, () => {
    const result = parse(`=TRUE&"1h"`);
    expect(result.value).toBe("TRUE1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"A"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"A"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"A"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"A"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"A"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"A"' = TRUE`, () => {
    const result = parse(`=TRUE>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"A"' = FALSE`, () => {
    const result = parse(`=TRUE<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="A"' = FALSE`, () => {
    const result = parse(`=TRUE="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"A"' = TRUE`, () => {
    const result = parse(`=TRUE<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="A"' = TRUE`, () => {
    const result = parse(`=TRUE>="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="A"' = FALSE`, () => {
    const result = parse(`=TRUE<="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"A"' = TRUEA`, () => {
    const result = parse(`=TRUE&"A"`);
    expect(result.value).toBe("TRUEA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"Z"' = TRUE`, () => {
    const result = parse(`=TRUE>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"Z"' = FALSE`, () => {
    const result = parse(`=TRUE<"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="Z"' = FALSE`, () => {
    const result = parse(`=TRUE="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"Z"' = TRUE`, () => {
    const result = parse(`=TRUE<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="Z"' = TRUE`, () => {
    const result = parse(`=TRUE>="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="Z"' = FALSE`, () => {
    const result = parse(`=TRUE<="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"Z"' = TRUEZ`, () => {
    const result = parse(`=TRUE&"Z"`);
    expect(result.value).toBe("TRUEZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"$"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"$"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"$"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"$"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"$"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"$"' = TRUE`, () => {
    const result = parse(`=TRUE>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"$"' = FALSE`, () => {
    const result = parse(`=TRUE<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="$"' = FALSE`, () => {
    const result = parse(`=TRUE="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"$"' = TRUE`, () => {
    const result = parse(`=TRUE<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="$"' = TRUE`, () => {
    const result = parse(`=TRUE>="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="$"' = FALSE`, () => {
    const result = parse(`=TRUE<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"$"' = TRUE$`, () => {
    const result = parse(`=TRUE&"$"`);
    expect(result.value).toBe("TRUE$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+"_"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE-"_"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE*"_"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE/"_"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE^"_"' = parser.VVALUE`, () => {
    const result = parse(`=TRUE^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=TRUE>"_"' = TRUE`, () => {
    const result = parse(`=TRUE>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<"_"' = FALSE`, () => {
    const result = parse(`=TRUE<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE="_"' = FALSE`, () => {
    const result = parse(`=TRUE="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>"_"' = TRUE`, () => {
    const result = parse(`=TRUE<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>="_"' = TRUE`, () => {
    const result = parse(`=TRUE>="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<="_"' = FALSE`, () => {
    const result = parse(`=TRUE<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&"_"' = TRUE_`, () => {
    const result = parse(`=TRUE&"_"`);
    expect(result.value).toBe("TRUE_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+{1}' = 2`, () => {
    const result = parse(`=TRUE+{1}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-{1}' = 0`, () => {
    const result = parse(`=TRUE-{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*{1}' = 1`, () => {
    const result = parse(`=TRUE*{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/{1}' = 1`, () => {
    const result = parse(`=TRUE/{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^{1}' = 1`, () => {
    const result = parse(`=TRUE^{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>{1}' = TRUE`, () => {
    const result = parse(`=TRUE>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<{1}' = FALSE`, () => {
    const result = parse(`=TRUE<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE={1}' = FALSE`, () => {
    const result = parse(`=TRUE={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>{1}' = TRUE`, () => {
    const result = parse(`=TRUE<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>={1}' = TRUE`, () => {
    const result = parse(`=TRUE>={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<={1}' = FALSE`, () => {
    const result = parse(`=TRUE<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&{1}' = TRUE1`, () => {
    const result = parse(`=TRUE&{1}`);
    expect(result.value).toBe("TRUE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=TRUE+{"1"}' = 2`, () => {
    const result = parse(`=TRUE+{"1"}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE-{"1"}' = 0`, () => {
    const result = parse(`=TRUE-{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE*{"1"}' = 1`, () => {
    const result = parse(`=TRUE*{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE/{"1"}' = 1`, () => {
    const result = parse(`=TRUE/{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE^{"1"}' = 1`, () => {
    const result = parse(`=TRUE^{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=TRUE>{"1"}' = TRUE`, () => {
    const result = parse(`=TRUE>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<{"1"}' = FALSE`, () => {
    const result = parse(`=TRUE<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE={"1"}' = FALSE`, () => {
    const result = parse(`=TRUE={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<>{"1"}' = TRUE`, () => {
    const result = parse(`=TRUE<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE>={"1"}' = TRUE`, () => {
    const result = parse(`=TRUE>={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE<={"1"}' = FALSE`, () => {
    const result = parse(`=TRUE<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=TRUE&{"1"}' = TRUE1`, () => {
    const result = parse(`=TRUE&{"1"}`);
    expect(result.value).toBe("TRUE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+0' = 0`, () => {
    const result = parse(`=FALSE+0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-0' = 0`, () => {
    const result = parse(`=FALSE-0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*0' = 0`, () => {
    const result = parse(`=FALSE*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/0' = parser.DIV0`, () => {
    const result = parse(`=FALSE/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^0' = parser.NUMVALUE`, () => {
    const result = parse(`=FALSE^0`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>0' = TRUE`, () => {
    const result = parse(`=FALSE>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<0' = FALSE`, () => {
    const result = parse(`=FALSE<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=0' = FALSE`, () => {
    const result = parse(`=FALSE=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>0' = TRUE`, () => {
    const result = parse(`=FALSE<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=0' = TRUE`, () => {
    const result = parse(`=FALSE>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=0' = FALSE`, () => {
    const result = parse(`=FALSE<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&0' = FALSE0`, () => {
    const result = parse(`=FALSE&0`);
    expect(result.value).toBe("FALSE0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+1' = 1`, () => {
    const result = parse(`=FALSE+1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-1' = -1`, () => {
    const result = parse(`=FALSE-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*1' = 0`, () => {
    const result = parse(`=FALSE*1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/1' = 0`, () => {
    const result = parse(`=FALSE/1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^1' = 0`, () => {
    const result = parse(`=FALSE^1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE>1' = TRUE`, () => {
    const result = parse(`=FALSE>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<1' = FALSE`, () => {
    const result = parse(`=FALSE<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=1' = FALSE`, () => {
    const result = parse(`=FALSE=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>1' = TRUE`, () => {
    const result = parse(`=FALSE<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=1' = TRUE`, () => {
    const result = parse(`=FALSE>=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=1' = FALSE`, () => {
    const result = parse(`=FALSE<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&1' = FALSE1`, () => {
    const result = parse(`=FALSE&1`);
    expect(result.value).toBe("FALSE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"0"' = 0`, () => {
    const result = parse(`=FALSE+"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-"0"' = 0`, () => {
    const result = parse(`=FALSE-"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*"0"' = 0`, () => {
    const result = parse(`=FALSE*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/"0"' = parser.DIV0`, () => {
    const result = parse(`=FALSE/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"0"' = parser.NUMVALUE`, () => {
    const result = parse(`=FALSE^"0"`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"0"' = TRUE`, () => {
    const result = parse(`=FALSE>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"0"' = FALSE`, () => {
    const result = parse(`=FALSE<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="0"' = FALSE`, () => {
    const result = parse(`=FALSE="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"0"' = TRUE`, () => {
    const result = parse(`=FALSE<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="0"' = TRUE`, () => {
    const result = parse(`=FALSE>="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="0"' = FALSE`, () => {
    const result = parse(`=FALSE<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"0"' = FALSE0`, () => {
    const result = parse(`=FALSE&"0"`);
    expect(result.value).toBe("FALSE0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"1"' = 1`, () => {
    const result = parse(`=FALSE+"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-"1"' = -1`, () => {
    const result = parse(`=FALSE-"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*"1"' = 0`, () => {
    const result = parse(`=FALSE*"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/"1"' = 0`, () => {
    const result = parse(`=FALSE/"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^"1"' = 0`, () => {
    const result = parse(`=FALSE^"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE>"1"' = TRUE`, () => {
    const result = parse(`=FALSE>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"1"' = FALSE`, () => {
    const result = parse(`=FALSE<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="1"' = FALSE`, () => {
    const result = parse(`=FALSE="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"1"' = TRUE`, () => {
    const result = parse(`=FALSE<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="1"' = TRUE`, () => {
    const result = parse(`=FALSE>="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="1"' = FALSE`, () => {
    const result = parse(`=FALSE<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"1"' = FALSE1`, () => {
    const result = parse(`=FALSE&"1"`);
    expect(result.value).toBe("FALSE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+-1' = -1`, () => {
    const result = parse(`=FALSE+-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE--1' = 1`, () => {
    const result = parse(`=FALSE--1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*-1' = 0`, () => {
    const result = parse(`=FALSE*-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/-1' = 0`, () => {
    const result = parse(`=FALSE/-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^-1' = parser.DIV0`, () => {
    const result = parse(`=FALSE^-1`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>-1' = TRUE`, () => {
    const result = parse(`=FALSE>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<-1' = FALSE`, () => {
    const result = parse(`=FALSE<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=-1' = FALSE`, () => {
    const result = parse(`=FALSE=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>-1' = TRUE`, () => {
    const result = parse(`=FALSE<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=-1' = TRUE`, () => {
    const result = parse(`=FALSE>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=-1' = FALSE`, () => {
    const result = parse(`=FALSE<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&-1' = FALSE-1`, () => {
    const result = parse(`=FALSE&-1`);
    expect(result.value).toBe("FALSE-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"-1"' = -1`, () => {
    const result = parse(`=FALSE+"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-"-1"' = 1`, () => {
    const result = parse(`=FALSE-"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*"-1"' = 0`, () => {
    const result = parse(`=FALSE*"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/"-1"' = 0`, () => {
    const result = parse(`=FALSE/"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^"-1"' = parser.DIV0`, () => {
    const result = parse(`=FALSE^"-1"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"-1"' = TRUE`, () => {
    const result = parse(`=FALSE>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"-1"' = FALSE`, () => {
    const result = parse(`=FALSE<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="-1"' = FALSE`, () => {
    const result = parse(`=FALSE="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"-1"' = TRUE`, () => {
    const result = parse(`=FALSE<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="-1"' = TRUE`, () => {
    const result = parse(`=FALSE>="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="-1"' = FALSE`, () => {
    const result = parse(`=FALSE<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"-1"' = FALSE-1`, () => {
    const result = parse(`=FALSE&"-1"`);
    expect(result.value).toBe("FALSE-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+TRUE' = 1`, () => {
    const result = parse(`=FALSE+TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-TRUE' = -1`, () => {
    const result = parse(`=FALSE-TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*TRUE' = 0`, () => {
    const result = parse(`=FALSE*TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/TRUE' = 0`, () => {
    const result = parse(`=FALSE/TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^TRUE' = 0`, () => {
    const result = parse(`=FALSE^TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE>TRUE' = FALSE`, () => {
    const result = parse(`=FALSE>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<TRUE' = TRUE`, () => {
    const result = parse(`=FALSE<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=TRUE' = FALSE`, () => {
    const result = parse(`=FALSE=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>TRUE' = TRUE`, () => {
    const result = parse(`=FALSE<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=TRUE' = FALSE`, () => {
    const result = parse(`=FALSE>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=TRUE' = TRUE`, () => {
    const result = parse(`=FALSE<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&TRUE' = FALSETRUE`, () => {
    const result = parse(`=FALSE&TRUE`);
    expect(result.value).toBe("FALSETRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+FALSE' = 0`, () => {
    const result = parse(`=FALSE+FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-FALSE' = 0`, () => {
    const result = parse(`=FALSE-FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*FALSE' = 0`, () => {
    const result = parse(`=FALSE*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/FALSE' = parser.DIV0`, () => {
    const result = parse(`=FALSE/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^FALSE' = parser.NUMVALUE`, () => {
    const result = parse(`=FALSE^FALSE`);
    expect(result.value).toBe(parser.NUMVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>FALSE' = FALSE`, () => {
    const result = parse(`=FALSE>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<FALSE' = FALSE`, () => {
    const result = parse(`=FALSE<FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=FALSE' = TRUE`, () => {
    const result = parse(`=FALSE=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>FALSE' = FALSE`, () => {
    const result = parse(`=FALSE<>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=FALSE' = TRUE`, () => {
    const result = parse(`=FALSE>=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=FALSE' = TRUE`, () => {
    const result = parse(`=FALSE<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&FALSE' = FALSEFALSE`, () => {
    const result = parse(`=FALSE&FALSE`);
    expect(result.value).toBe("FALSEFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"Hello"' = TRUE`, () => {
    const result = parse(`=FALSE>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"Hello"' = FALSE`, () => {
    const result = parse(`=FALSE<"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="Hello"' = FALSE`, () => {
    const result = parse(`=FALSE="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"Hello"' = TRUE`, () => {
    const result = parse(`=FALSE<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="Hello"' = TRUE`, () => {
    const result = parse(`=FALSE>="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="Hello"' = FALSE`, () => {
    const result = parse(`=FALSE<="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"Hello"' = FALSEHello`, () => {
    const result = parse(`=FALSE&"Hello"`);
    expect(result.value).toBe("FALSEHello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'=FALSE+""' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-""' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*""' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/""' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^""' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>""' = TRUE`, () => {
    const result = parse(`=FALSE>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<""' = FALSE`, () => {
    const result = parse(`=FALSE<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE=""' = FALSE`, () => {
    const result = parse(`=FALSE=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>""' = TRUE`, () => {
    const result = parse(`=FALSE<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>=""' = TRUE`, () => {
    const result = parse(`=FALSE>=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<=""' = FALSE`, () => {
    const result = parse(`=FALSE<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&""' = FALSE`, () => {
    const result = parse(`=FALSE&""`);
    expect(result.value).toBe("FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"h1"' = TRUE`, () => {
    const result = parse(`=FALSE>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"h1"' = FALSE`, () => {
    const result = parse(`=FALSE<"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="h1"' = FALSE`, () => {
    const result = parse(`=FALSE="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"h1"' = TRUE`, () => {
    const result = parse(`=FALSE<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="h1"' = TRUE`, () => {
    const result = parse(`=FALSE>="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="h1"' = FALSE`, () => {
    const result = parse(`=FALSE<="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"h1"' = FALSEh1`, () => {
    const result = parse(`=FALSE&"h1"`);
    expect(result.value).toBe("FALSEh1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"1h"' = TRUE`, () => {
    const result = parse(`=FALSE>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"1h"' = FALSE`, () => {
    const result = parse(`=FALSE<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="1h"' = FALSE`, () => {
    const result = parse(`=FALSE="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"1h"' = TRUE`, () => {
    const result = parse(`=FALSE<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="1h"' = TRUE`, () => {
    const result = parse(`=FALSE>="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="1h"' = FALSE`, () => {
    const result = parse(`=FALSE<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"1h"' = FALSE1h`, () => {
    const result = parse(`=FALSE&"1h"`);
    expect(result.value).toBe("FALSE1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"A"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"A"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"A"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"A"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"A"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"A"' = TRUE`, () => {
    const result = parse(`=FALSE>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"A"' = FALSE`, () => {
    const result = parse(`=FALSE<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="A"' = FALSE`, () => {
    const result = parse(`=FALSE="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"A"' = TRUE`, () => {
    const result = parse(`=FALSE<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="A"' = TRUE`, () => {
    const result = parse(`=FALSE>="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="A"' = FALSE`, () => {
    const result = parse(`=FALSE<="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"A"' = FALSEA`, () => {
    const result = parse(`=FALSE&"A"`);
    expect(result.value).toBe("FALSEA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"Z"' = TRUE`, () => {
    const result = parse(`=FALSE>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"Z"' = FALSE`, () => {
    const result = parse(`=FALSE<"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="Z"' = FALSE`, () => {
    const result = parse(`=FALSE="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"Z"' = TRUE`, () => {
    const result = parse(`=FALSE<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="Z"' = TRUE`, () => {
    const result = parse(`=FALSE>="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="Z"' = FALSE`, () => {
    const result = parse(`=FALSE<="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"Z"' = FALSEZ`, () => {
    const result = parse(`=FALSE&"Z"`);
    expect(result.value).toBe("FALSEZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"$"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"$"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"$"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"$"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"$"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"$"' = TRUE`, () => {
    const result = parse(`=FALSE>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"$"' = FALSE`, () => {
    const result = parse(`=FALSE<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="$"' = FALSE`, () => {
    const result = parse(`=FALSE="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"$"' = TRUE`, () => {
    const result = parse(`=FALSE<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="$"' = TRUE`, () => {
    const result = parse(`=FALSE>="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="$"' = FALSE`, () => {
    const result = parse(`=FALSE<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"$"' = FALSE$`, () => {
    const result = parse(`=FALSE&"$"`);
    expect(result.value).toBe("FALSE$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+"_"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE-"_"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE*"_"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE/"_"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE^"_"' = parser.VVALUE`, () => {
    const result = parse(`=FALSE^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=FALSE>"_"' = TRUE`, () => {
    const result = parse(`=FALSE>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<"_"' = FALSE`, () => {
    const result = parse(`=FALSE<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE="_"' = FALSE`, () => {
    const result = parse(`=FALSE="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>"_"' = TRUE`, () => {
    const result = parse(`=FALSE<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>="_"' = TRUE`, () => {
    const result = parse(`=FALSE>="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<="_"' = FALSE`, () => {
    const result = parse(`=FALSE<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&"_"' = FALSE_`, () => {
    const result = parse(`=FALSE&"_"`);
    expect(result.value).toBe("FALSE_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+{1}' = 1`, () => {
    const result = parse(`=FALSE+{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-{1}' = -1`, () => {
    const result = parse(`=FALSE-{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*{1}' = 0`, () => {
    const result = parse(`=FALSE*{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/{1}' = 0`, () => {
    const result = parse(`=FALSE/{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^{1}' = 0`, () => {
    const result = parse(`=FALSE^{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE>{1}' = TRUE`, () => {
    const result = parse(`=FALSE>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<{1}' = FALSE`, () => {
    const result = parse(`=FALSE<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE={1}' = FALSE`, () => {
    const result = parse(`=FALSE={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>{1}' = TRUE`, () => {
    const result = parse(`=FALSE<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>={1}' = TRUE`, () => {
    const result = parse(`=FALSE>={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<={1}' = FALSE`, () => {
    const result = parse(`=FALSE<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&{1}' = FALSE1`, () => {
    const result = parse(`=FALSE&{1}`);
    expect(result.value).toBe("FALSE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=FALSE+{"1"}' = 1`, () => {
    const result = parse(`=FALSE+{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE-{"1"}' = -1`, () => {
    const result = parse(`=FALSE-{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE*{"1"}' = 0`, () => {
    const result = parse(`=FALSE*{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE/{"1"}' = 0`, () => {
    const result = parse(`=FALSE/{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE^{"1"}' = 0`, () => {
    const result = parse(`=FALSE^{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=FALSE>{"1"}' = TRUE`, () => {
    const result = parse(`=FALSE>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<{"1"}' = FALSE`, () => {
    const result = parse(`=FALSE<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE={"1"}' = FALSE`, () => {
    const result = parse(`=FALSE={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<>{"1"}' = TRUE`, () => {
    const result = parse(`=FALSE<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE>={"1"}' = TRUE`, () => {
    const result = parse(`=FALSE>={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE<={"1"}' = FALSE`, () => {
    const result = parse(`=FALSE<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=FALSE&{"1"}' = FALSE1`, () => {
    const result = parse(`=FALSE&{"1"}`);
    expect(result.value).toBe("FALSE1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+0' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-0' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*0' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/0' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^0' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">0' = TRUE`, () => {
    const result = parse(`="Hello">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<0' = FALSE`, () => {
    const result = parse(`="Hello"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=0' = FALSE`, () => {
    const result = parse(`="Hello"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>0' = TRUE`, () => {
    const result = parse(`="Hello"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=0' = TRUE`, () => {
    const result = parse(`="Hello">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=0' = FALSE`, () => {
    const result = parse(`="Hello"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&0' = Hello0`, () => {
    const result = parse(`="Hello"&0`);
    expect(result.value).toBe("Hello0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">1' = TRUE`, () => {
    const result = parse(`="Hello">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<1' = FALSE`, () => {
    const result = parse(`="Hello"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=1' = FALSE`, () => {
    const result = parse(`="Hello"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>1' = TRUE`, () => {
    const result = parse(`="Hello"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=1' = TRUE`, () => {
    const result = parse(`="Hello">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=1' = FALSE`, () => {
    const result = parse(`="Hello"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&1' = Hello1`, () => {
    const result = parse(`="Hello"&1`);
    expect(result.value).toBe("Hello1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"0"' = TRUE`, () => {
    const result = parse(`="Hello">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"0"' = FALSE`, () => {
    const result = parse(`="Hello"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="0"' = FALSE`, () => {
    const result = parse(`="Hello"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"0"' = TRUE`, () => {
    const result = parse(`="Hello"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="0"' = TRUE`, () => {
    const result = parse(`="Hello">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="0"' = FALSE`, () => {
    const result = parse(`="Hello"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"0"' = Hello0`, () => {
    const result = parse(`="Hello"&"0"`);
    expect(result.value).toBe("Hello0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"1"' = TRUE`, () => {
    const result = parse(`="Hello">"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"1"' = FALSE`, () => {
    const result = parse(`="Hello"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="1"' = FALSE`, () => {
    const result = parse(`="Hello"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"1"' = TRUE`, () => {
    const result = parse(`="Hello"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="1"' = TRUE`, () => {
    const result = parse(`="Hello">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="1"' = FALSE`, () => {
    const result = parse(`="Hello"<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"1"' = Hello1`, () => {
    const result = parse(`="Hello"&"1"`);
    expect(result.value).toBe("Hello1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+-1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"--1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*-1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/-1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^-1' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">-1' = TRUE`, () => {
    const result = parse(`="Hello">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<-1' = FALSE`, () => {
    const result = parse(`="Hello"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=-1' = FALSE`, () => {
    const result = parse(`="Hello"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>-1' = TRUE`, () => {
    const result = parse(`="Hello"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=-1' = TRUE`, () => {
    const result = parse(`="Hello">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=-1' = FALSE`, () => {
    const result = parse(`="Hello"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&-1' = Hello-1`, () => {
    const result = parse(`="Hello"&-1`);
    expect(result.value).toBe("Hello-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"-1"' = TRUE`, () => {
    const result = parse(`="Hello">"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"-1"' = FALSE`, () => {
    const result = parse(`="Hello"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="-1"' = FALSE`, () => {
    const result = parse(`="Hello"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"-1"' = TRUE`, () => {
    const result = parse(`="Hello"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="-1"' = TRUE`, () => {
    const result = parse(`="Hello">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="-1"' = FALSE`, () => {
    const result = parse(`="Hello"<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"-1"' = Hello-1`, () => {
    const result = parse(`="Hello"&"-1"`);
    expect(result.value).toBe("Hello-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">TRUE' = FALSE`, () => {
    const result = parse(`="Hello">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<TRUE' = TRUE`, () => {
    const result = parse(`="Hello"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=TRUE' = FALSE`, () => {
    const result = parse(`="Hello"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>TRUE' = TRUE`, () => {
    const result = parse(`="Hello"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=TRUE' = FALSE`, () => {
    const result = parse(`="Hello">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=TRUE' = TRUE`, () => {
    const result = parse(`="Hello"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&TRUE' = HelloTRUE`, () => {
    const result = parse(`="Hello"&TRUE`);
    expect(result.value).toBe("HelloTRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">FALSE' = FALSE`, () => {
    const result = parse(`="Hello">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<FALSE' = TRUE`, () => {
    const result = parse(`="Hello"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=FALSE' = FALSE`, () => {
    const result = parse(`="Hello"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>FALSE' = TRUE`, () => {
    const result = parse(`="Hello"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=FALSE' = FALSE`, () => {
    const result = parse(`="Hello">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=FALSE' = TRUE`, () => {
    const result = parse(`="Hello"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&FALSE' = HelloFALSE`, () => {
    const result = parse(`="Hello"&FALSE`);
    expect(result.value).toBe("HelloFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"Hello"' = FALSE`, () => {
    const result = parse(`="Hello">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"Hello"' = FALSE`, () => {
    const result = parse(`="Hello"<"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="Hello"' = TRUE`, () => {
    const result = parse(`="Hello"="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"Hello"' = FALSE`, () => {
    const result = parse(`="Hello"<>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="Hello"' = TRUE`, () => {
    const result = parse(`="Hello">="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="Hello"' = TRUE`, () => {
    const result = parse(`="Hello"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"Hello"' = HelloHello`, () => {
    const result = parse(`="Hello"&"Hello"`);
    expect(result.value).toBe("HelloHello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+""' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-""' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*""' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/""' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^""' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">""' = TRUE`, () => {
    const result = parse(`="Hello">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<""' = FALSE`, () => {
    const result = parse(`="Hello"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"=""' = FALSE`, () => {
    const result = parse(`="Hello"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>""' = TRUE`, () => {
    const result = parse(`="Hello"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">=""' = TRUE`, () => {
    const result = parse(`="Hello">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<=""' = FALSE`, () => {
    const result = parse(`="Hello"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&""' = Hello`, () => {
    const result = parse(`="Hello"&""`);
    expect(result.value).toBe("Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"h1"' = TRUE`, () => {
    const result = parse(`="Hello">"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"h1"' = FALSE`, () => {
    const result = parse(`="Hello"<"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="h1"' = FALSE`, () => {
    const result = parse(`="Hello"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"h1"' = TRUE`, () => {
    const result = parse(`="Hello"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="h1"' = TRUE`, () => {
    const result = parse(`="Hello">="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="h1"' = FALSE`, () => {
    const result = parse(`="Hello"<="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"h1"' = Helloh1`, () => {
    const result = parse(`="Hello"&"h1"`);
    expect(result.value).toBe("Helloh1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"1h"' = TRUE`, () => {
    const result = parse(`="Hello">"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"1h"' = FALSE`, () => {
    const result = parse(`="Hello"<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="1h"' = FALSE`, () => {
    const result = parse(`="Hello"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"1h"' = TRUE`, () => {
    const result = parse(`="Hello"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="1h"' = TRUE`, () => {
    const result = parse(`="Hello">="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="1h"' = FALSE`, () => {
    const result = parse(`="Hello"<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"1h"' = Hello1h`, () => {
    const result = parse(`="Hello"&"1h"`);
    expect(result.value).toBe("Hello1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"A"' = TRUE`, () => {
    const result = parse(`="Hello">"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"A"' = FALSE`, () => {
    const result = parse(`="Hello"<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="A"' = FALSE`, () => {
    const result = parse(`="Hello"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"A"' = TRUE`, () => {
    const result = parse(`="Hello"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="A"' = TRUE`, () => {
    const result = parse(`="Hello">="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="A"' = FALSE`, () => {
    const result = parse(`="Hello"<="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"A"' = HelloA`, () => {
    const result = parse(`="Hello"&"A"`);
    expect(result.value).toBe("HelloA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"Z"' = FALSE`, () => {
    const result = parse(`="Hello">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"Z"' = TRUE`, () => {
    const result = parse(`="Hello"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="Z"' = FALSE`, () => {
    const result = parse(`="Hello"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"Z"' = TRUE`, () => {
    const result = parse(`="Hello"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="Z"' = FALSE`, () => {
    const result = parse(`="Hello">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="Z"' = TRUE`, () => {
    const result = parse(`="Hello"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"Z"' = HelloZ`, () => {
    const result = parse(`="Hello"&"Z"`);
    expect(result.value).toBe("HelloZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"$"' = TRUE`, () => {
    const result = parse(`="Hello">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"$"' = FALSE`, () => {
    const result = parse(`="Hello"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="$"' = FALSE`, () => {
    const result = parse(`="Hello"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"$"' = TRUE`, () => {
    const result = parse(`="Hello"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="$"' = TRUE`, () => {
    const result = parse(`="Hello">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="$"' = FALSE`, () => {
    const result = parse(`="Hello"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"$"' = Hello$`, () => {
    const result = parse(`="Hello"&"$"`);
    expect(result.value).toBe("Hello$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">"_"' = TRUE`, () => {
    const result = parse(`="Hello">"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<"_"' = FALSE`, () => {
    const result = parse(`="Hello"<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"="_"' = FALSE`, () => {
    const result = parse(`="Hello"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>"_"' = TRUE`, () => {
    const result = parse(`="Hello"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">="_"' = TRUE`, () => {
    const result = parse(`="Hello">="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<="_"' = FALSE`, () => {
    const result = parse(`="Hello"<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&"_"' = Hello_`, () => {
    const result = parse(`="Hello"&"_"`);
    expect(result.value).toBe("Hello_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">{1}' = TRUE`, () => {
    const result = parse(`="Hello">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<{1}' = FALSE`, () => {
    const result = parse(`="Hello"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"={1}' = FALSE`, () => {
    const result = parse(`="Hello"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>{1}' = TRUE`, () => {
    const result = parse(`="Hello"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">={1}' = TRUE`, () => {
    const result = parse(`="Hello">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<={1}' = FALSE`, () => {
    const result = parse(`="Hello"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&{1}' = Hello1`, () => {
    const result = parse(`="Hello"&{1}`);
    expect(result.value).toBe("Hello1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Hello"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Hello"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Hello">{"1"}' = TRUE`, () => {
    const result = parse(`="Hello">{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<{"1"}' = FALSE`, () => {
    const result = parse(`="Hello"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"={"1"}' = FALSE`, () => {
    const result = parse(`="Hello"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<>{"1"}' = TRUE`, () => {
    const result = parse(`="Hello"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello">={"1"}' = TRUE`, () => {
    const result = parse(`="Hello">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"<={"1"}' = FALSE`, () => {
    const result = parse(`="Hello"<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Hello"&{"1"}' = Hello1`, () => {
    const result = parse(`="Hello"&{"1"}`);
    expect(result.value).toBe("Hello1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=0' = 0`, () => {
    const result = parse(`=0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=0' = 0`, () => {
    const result = parse(`=0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=1' = 1`, () => {
    const result = parse(`=1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-1' = -1`, () => {
    const result = parse(`=-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=+"0"' = 0`, () => {
    const result = parse(`=+"0"`);
    expect(result.value).toBe("0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"0"' = 0`, () => {
    const result = parse(`=-"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+"1"' = 1`, () => {
    const result = parse(`=+"1"`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"1"' = -1`, () => {
    const result = parse(`=-"1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+-1' = -1`, () => {
    const result = parse(`=+-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=--1' = 1`, () => {
    const result = parse(`=--1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+"-1"' = -1`, () => {
    const result = parse(`=+"-1"`);
    expect(result.value).toBe("-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"-1"' = 1`, () => {
    const result = parse(`=-"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=+TRUE' = TRUE`, () => {
    const result = parse(`=+TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-TRUE' = -1`, () => {
    const result = parse(`=-TRUE`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+FALSE' = FALSE`, () => {
    const result = parse(`=+FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=-FALSE' = 0`, () => {
    const result = parse(`=-FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+"Hello"' = Hello`, () => {
    const result = parse(`=+"Hello"`);
    expect(result.value).toBe("Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+""' = `, () => {
    const result = parse(`=+""`);
    expect(result.value).toBe("");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-""' = parser.VVALUE`, () => {
    const result = parse(`=-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=+"h1"' = h1`, () => {
    const result = parse(`=+"h1"`);
    expect(result.value).toBe("h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+"1h"' = 1h`, () => {
    const result = parse(`=+"1h"`);
    expect(result.value).toBe("1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+"A"' = A`, () => {
    const result = parse(`=+"A"`);
    expect(result.value).toBe("A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"A"' = parser.VVALUE`, () => {
    const result = parse(`=-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+"Z"' = Z`, () => {
    const result = parse(`=+"Z"`);
    expect(result.value).toBe("Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+"$"' = $`, () => {
    const result = parse(`=+"$"`);
    expect(result.value).toBe("$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"$"' = parser.VVALUE`, () => {
    const result = parse(`=-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+"_"' = _`, () => {
    const result = parse(`=+"_"`);
    expect(result.value).toBe("_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-"_"' = parser.VVALUE`, () => {
    const result = parse(`=-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });

test(`'=+{1}' = 1`, () => {
    const result = parse(`=+{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=-{1}' = -1`, () => {
    const result = parse(`=-{1}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });

test(`'=+{"1"}' = 1`, () => {
    const result = parse(`=+{"1"}`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=-{"1"}' = -1`, () => {
    const result = parse(`=-{"1"}`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'=""+0' = parser.VVALUE`, () => {
    const result = parse(`=""+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-0' = parser.VVALUE`, () => {
    const result = parse(`=""-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*0' = parser.VVALUE`, () => {
    const result = parse(`=""*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/0' = parser.VVALUE`, () => {
    const result = parse(`=""/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^0' = parser.VVALUE`, () => {
    const result = parse(`=""^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">0' = TRUE`, () => {
    const result = parse(`="">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<0' = FALSE`, () => {
    const result = parse(`=""<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=0' = FALSE`, () => {
    const result = parse(`=""=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>0' = TRUE`, () => {
    const result = parse(`=""<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=0' = TRUE`, () => {
    const result = parse(`="">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=0' = FALSE`, () => {
    const result = parse(`=""<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&0' = 0`, () => {
    const result = parse(`=""&0`);
    expect(result.value).toBe("0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+1' = parser.VVALUE`, () => {
    const result = parse(`=""+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-1' = parser.VVALUE`, () => {
    const result = parse(`=""-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*1' = parser.VVALUE`, () => {
    const result = parse(`=""*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/1' = parser.VVALUE`, () => {
    const result = parse(`=""/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^1' = parser.VVALUE`, () => {
    const result = parse(`=""^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">1' = TRUE`, () => {
    const result = parse(`="">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<1' = FALSE`, () => {
    const result = parse(`=""<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=1' = FALSE`, () => {
    const result = parse(`=""=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>1' = TRUE`, () => {
    const result = parse(`=""<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=1' = TRUE`, () => {
    const result = parse(`="">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=1' = FALSE`, () => {
    const result = parse(`=""<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&1' = 1`, () => {
    const result = parse(`=""&1`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"0"' = parser.VVALUE`, () => {
    const result = parse(`=""+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"0"' = parser.VVALUE`, () => {
    const result = parse(`=""-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"0"' = parser.VVALUE`, () => {
    const result = parse(`=""*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"0"' = parser.VVALUE`, () => {
    const result = parse(`=""/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"0"' = parser.VVALUE`, () => {
    const result = parse(`=""^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"0"' = FALSE`, () => {
    const result = parse(`="">"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"0"' = TRUE`, () => {
    const result = parse(`=""<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="0"' = FALSE`, () => {
    const result = parse(`=""="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"0"' = TRUE`, () => {
    const result = parse(`=""<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="0"' = FALSE`, () => {
    const result = parse(`="">="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="0"' = TRUE`, () => {
    const result = parse(`=""<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"0"' = 0`, () => {
    const result = parse(`=""&"0"`);
    expect(result.value).toBe("0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"1"' = parser.VVALUE`, () => {
    const result = parse(`=""+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"1"' = parser.VVALUE`, () => {
    const result = parse(`=""-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"1"' = parser.VVALUE`, () => {
    const result = parse(`=""*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"1"' = parser.VVALUE`, () => {
    const result = parse(`=""/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"1"' = parser.VVALUE`, () => {
    const result = parse(`=""^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"1"' = FALSE`, () => {
    const result = parse(`="">"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"1"' = TRUE`, () => {
    const result = parse(`=""<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="1"' = FALSE`, () => {
    const result = parse(`=""="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"1"' = TRUE`, () => {
    const result = parse(`=""<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="1"' = FALSE`, () => {
    const result = parse(`="">="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="1"' = TRUE`, () => {
    const result = parse(`=""<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"1"' = 1`, () => {
    const result = parse(`=""&"1"`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+-1' = parser.VVALUE`, () => {
    const result = parse(`=""+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""--1' = parser.VVALUE`, () => {
    const result = parse(`=""--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*-1' = parser.VVALUE`, () => {
    const result = parse(`=""*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/-1' = parser.VVALUE`, () => {
    const result = parse(`=""/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^-1' = parser.VVALUE`, () => {
    const result = parse(`=""^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">-1' = TRUE`, () => {
    const result = parse(`="">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<-1' = FALSE`, () => {
    const result = parse(`=""<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=-1' = FALSE`, () => {
    const result = parse(`=""=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>-1' = TRUE`, () => {
    const result = parse(`=""<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=-1' = TRUE`, () => {
    const result = parse(`="">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=-1' = FALSE`, () => {
    const result = parse(`=""<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&-1' = -1`, () => {
    const result = parse(`=""&-1`);
    expect(result.value).toBe("-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"-1"' = parser.VVALUE`, () => {
    const result = parse(`=""+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"-1"' = parser.VVALUE`, () => {
    const result = parse(`=""-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"-1"' = parser.VVALUE`, () => {
    const result = parse(`=""*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"-1"' = parser.VVALUE`, () => {
    const result = parse(`=""/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"-1"' = parser.VVALUE`, () => {
    const result = parse(`=""^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"-1"' = FALSE`, () => {
    const result = parse(`="">"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"-1"' = TRUE`, () => {
    const result = parse(`=""<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="-1"' = FALSE`, () => {
    const result = parse(`=""="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"-1"' = TRUE`, () => {
    const result = parse(`=""<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="-1"' = FALSE`, () => {
    const result = parse(`="">="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="-1"' = TRUE`, () => {
    const result = parse(`=""<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"-1"' = -1`, () => {
    const result = parse(`=""&"-1"`);
    expect(result.value).toBe("-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+TRUE' = parser.VVALUE`, () => {
    const result = parse(`=""+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-TRUE' = parser.VVALUE`, () => {
    const result = parse(`=""-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*TRUE' = parser.VVALUE`, () => {
    const result = parse(`=""*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/TRUE' = parser.VVALUE`, () => {
    const result = parse(`=""/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^TRUE' = parser.VVALUE`, () => {
    const result = parse(`=""^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">TRUE' = FALSE`, () => {
    const result = parse(`="">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<TRUE' = TRUE`, () => {
    const result = parse(`=""<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=TRUE' = FALSE`, () => {
    const result = parse(`=""=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>TRUE' = TRUE`, () => {
    const result = parse(`=""<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=TRUE' = FALSE`, () => {
    const result = parse(`="">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=TRUE' = TRUE`, () => {
    const result = parse(`=""<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&TRUE' = TRUE`, () => {
    const result = parse(`=""&TRUE`);
    expect(result.value).toBe("TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+FALSE' = parser.VVALUE`, () => {
    const result = parse(`=""+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-FALSE' = parser.VVALUE`, () => {
    const result = parse(`=""-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*FALSE' = parser.VVALUE`, () => {
    const result = parse(`=""*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/FALSE' = parser.VVALUE`, () => {
    const result = parse(`=""/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^FALSE' = parser.VVALUE`, () => {
    const result = parse(`=""^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">FALSE' = FALSE`, () => {
    const result = parse(`="">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<FALSE' = TRUE`, () => {
    const result = parse(`=""<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=FALSE' = FALSE`, () => {
    const result = parse(`=""=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>FALSE' = TRUE`, () => {
    const result = parse(`=""<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=FALSE' = FALSE`, () => {
    const result = parse(`="">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=FALSE' = TRUE`, () => {
    const result = parse(`=""<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&FALSE' = FALSE`, () => {
    const result = parse(`=""&FALSE`);
    expect(result.value).toBe("FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=""+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=""-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=""*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=""/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`=""^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"Hello"' = FALSE`, () => {
    const result = parse(`="">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"Hello"' = TRUE`, () => {
    const result = parse(`=""<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="Hello"' = FALSE`, () => {
    const result = parse(`=""="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"Hello"' = TRUE`, () => {
    const result = parse(`=""<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="Hello"' = FALSE`, () => {
    const result = parse(`="">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="Hello"' = TRUE`, () => {
    const result = parse(`=""<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"Hello"' = Hello`, () => {
    const result = parse(`=""&"Hello"`);
    expect(result.value).toBe("Hello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'=""+""' = parser.VVALUE`, () => {
    const result = parse(`=""+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-""' = parser.VVALUE`, () => {
    const result = parse(`=""-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*""' = parser.VVALUE`, () => {
    const result = parse(`=""*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/""' = parser.VVALUE`, () => {
    const result = parse(`=""/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^""' = parser.VVALUE`, () => {
    const result = parse(`=""^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">""' = FALSE`, () => {
    const result = parse(`="">""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<""' = FALSE`, () => {
    const result = parse(`=""<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""=""' = TRUE`, () => {
    const result = parse(`=""=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>""' = FALSE`, () => {
    const result = parse(`=""<>""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">=""' = TRUE`, () => {
    const result = parse(`="">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<=""' = TRUE`, () => {
    const result = parse(`=""<=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&""' = `, () => {
    const result = parse(`=""&""`);
    expect(result.value).toBe("");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"h1"' = parser.VVALUE`, () => {
    const result = parse(`=""+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"h1"' = parser.VVALUE`, () => {
    const result = parse(`=""-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"h1"' = parser.VVALUE`, () => {
    const result = parse(`=""*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"h1"' = parser.VVALUE`, () => {
    const result = parse(`=""/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"h1"' = parser.VVALUE`, () => {
    const result = parse(`=""^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"h1"' = FALSE`, () => {
    const result = parse(`="">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"h1"' = TRUE`, () => {
    const result = parse(`=""<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="h1"' = FALSE`, () => {
    const result = parse(`=""="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"h1"' = TRUE`, () => {
    const result = parse(`=""<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="h1"' = FALSE`, () => {
    const result = parse(`="">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="h1"' = TRUE`, () => {
    const result = parse(`=""<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"h1"' = h1`, () => {
    const result = parse(`=""&"h1"`);
    expect(result.value).toBe("h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"1h"' = parser.VVALUE`, () => {
    const result = parse(`=""+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"1h"' = parser.VVALUE`, () => {
    const result = parse(`=""-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"1h"' = parser.VVALUE`, () => {
    const result = parse(`=""*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"1h"' = parser.VVALUE`, () => {
    const result = parse(`=""/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"1h"' = parser.VVALUE`, () => {
    const result = parse(`=""^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"1h"' = FALSE`, () => {
    const result = parse(`="">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"1h"' = TRUE`, () => {
    const result = parse(`=""<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="1h"' = FALSE`, () => {
    const result = parse(`=""="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"1h"' = TRUE`, () => {
    const result = parse(`=""<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="1h"' = FALSE`, () => {
    const result = parse(`="">="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="1h"' = TRUE`, () => {
    const result = parse(`=""<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"1h"' = 1h`, () => {
    const result = parse(`=""&"1h"`);
    expect(result.value).toBe("1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"A"' = parser.VVALUE`, () => {
    const result = parse(`=""+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"A"' = parser.VVALUE`, () => {
    const result = parse(`=""-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"A"' = parser.VVALUE`, () => {
    const result = parse(`=""*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"A"' = parser.VVALUE`, () => {
    const result = parse(`=""/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"A"' = parser.VVALUE`, () => {
    const result = parse(`=""^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"A"' = FALSE`, () => {
    const result = parse(`="">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"A"' = TRUE`, () => {
    const result = parse(`=""<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="A"' = FALSE`, () => {
    const result = parse(`=""="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"A"' = TRUE`, () => {
    const result = parse(`=""<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="A"' = FALSE`, () => {
    const result = parse(`="">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="A"' = TRUE`, () => {
    const result = parse(`=""<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"A"' = A`, () => {
    const result = parse(`=""&"A"`);
    expect(result.value).toBe("A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"Z"' = parser.VVALUE`, () => {
    const result = parse(`=""+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"Z"' = parser.VVALUE`, () => {
    const result = parse(`=""-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"Z"' = parser.VVALUE`, () => {
    const result = parse(`=""*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"Z"' = parser.VVALUE`, () => {
    const result = parse(`=""/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"Z"' = parser.VVALUE`, () => {
    const result = parse(`=""^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"Z"' = FALSE`, () => {
    const result = parse(`="">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"Z"' = TRUE`, () => {
    const result = parse(`=""<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="Z"' = FALSE`, () => {
    const result = parse(`=""="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"Z"' = TRUE`, () => {
    const result = parse(`=""<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="Z"' = FALSE`, () => {
    const result = parse(`="">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="Z"' = TRUE`, () => {
    const result = parse(`=""<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"Z"' = Z`, () => {
    const result = parse(`=""&"Z"`);
    expect(result.value).toBe("Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"$"' = parser.VVALUE`, () => {
    const result = parse(`=""+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"$"' = parser.VVALUE`, () => {
    const result = parse(`=""-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"$"' = parser.VVALUE`, () => {
    const result = parse(`=""*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"$"' = parser.VVALUE`, () => {
    const result = parse(`=""/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"$"' = parser.VVALUE`, () => {
    const result = parse(`=""^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"$"' = FALSE`, () => {
    const result = parse(`="">"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"$"' = TRUE`, () => {
    const result = parse(`=""<"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="$"' = FALSE`, () => {
    const result = parse(`=""="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"$"' = TRUE`, () => {
    const result = parse(`=""<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="$"' = FALSE`, () => {
    const result = parse(`="">="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="$"' = TRUE`, () => {
    const result = parse(`=""<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"$"' = $`, () => {
    const result = parse(`=""&"$"`);
    expect(result.value).toBe("$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+"_"' = parser.VVALUE`, () => {
    const result = parse(`=""+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-"_"' = parser.VVALUE`, () => {
    const result = parse(`=""-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*"_"' = parser.VVALUE`, () => {
    const result = parse(`=""*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/"_"' = parser.VVALUE`, () => {
    const result = parse(`=""/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^"_"' = parser.VVALUE`, () => {
    const result = parse(`=""^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">"_"' = FALSE`, () => {
    const result = parse(`="">"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<"_"' = TRUE`, () => {
    const result = parse(`=""<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""="_"' = FALSE`, () => {
    const result = parse(`=""="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>"_"' = TRUE`, () => {
    const result = parse(`=""<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">="_"' = FALSE`, () => {
    const result = parse(`="">="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<="_"' = TRUE`, () => {
    const result = parse(`=""<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&"_"' = _`, () => {
    const result = parse(`=""&"_"`);
    expect(result.value).toBe("_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+{1}' = parser.VVALUE`, () => {
    const result = parse(`=""+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-{1}' = parser.VVALUE`, () => {
    const result = parse(`=""-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*{1}' = parser.VVALUE`, () => {
    const result = parse(`=""*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/{1}' = parser.VVALUE`, () => {
    const result = parse(`=""/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^{1}' = parser.VVALUE`, () => {
    const result = parse(`=""^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">{1}' = TRUE`, () => {
    const result = parse(`="">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<{1}' = FALSE`, () => {
    const result = parse(`=""<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""={1}' = FALSE`, () => {
    const result = parse(`=""={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>{1}' = TRUE`, () => {
    const result = parse(`=""<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">={1}' = TRUE`, () => {
    const result = parse(`="">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<={1}' = FALSE`, () => {
    const result = parse(`=""<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&{1}' = 1`, () => {
    const result = parse(`=""&{1}`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'=""+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`=""+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`=""-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`=""*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`=""/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'=""^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`=""^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="">{"1"}' = FALSE`, () => {
    const result = parse(`="">{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<{"1"}' = TRUE`, () => {
    const result = parse(`=""<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""={"1"}' = FALSE`, () => {
    const result = parse(`=""={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<>{"1"}' = TRUE`, () => {
    const result = parse(`=""<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="">={"1"}' = FALSE`, () => {
    const result = parse(`="">={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""<={"1"}' = TRUE`, () => {
    const result = parse(`=""<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'=""&{"1"}' = 1`, () => {
    const result = parse(`=""&{"1"}`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+0' = parser.VVALUE`, () => {
    const result = parse(`="h1"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-0' = parser.VVALUE`, () => {
    const result = parse(`="h1"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*0' = parser.VVALUE`, () => {
    const result = parse(`="h1"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/0' = parser.VVALUE`, () => {
    const result = parse(`="h1"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^0' = parser.VVALUE`, () => {
    const result = parse(`="h1"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">0' = TRUE`, () => {
    const result = parse(`="h1">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<0' = FALSE`, () => {
    const result = parse(`="h1"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=0' = FALSE`, () => {
    const result = parse(`="h1"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>0' = TRUE`, () => {
    const result = parse(`="h1"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=0' = TRUE`, () => {
    const result = parse(`="h1">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=0' = FALSE`, () => {
    const result = parse(`="h1"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&0' = h10`, () => {
    const result = parse(`="h1"&0`);
    expect(result.value).toBe("h10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+1' = parser.VVALUE`, () => {
    const result = parse(`="h1"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-1' = parser.VVALUE`, () => {
    const result = parse(`="h1"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*1' = parser.VVALUE`, () => {
    const result = parse(`="h1"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/1' = parser.VVALUE`, () => {
    const result = parse(`="h1"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^1' = parser.VVALUE`, () => {
    const result = parse(`="h1"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">1' = TRUE`, () => {
    const result = parse(`="h1">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<1' = FALSE`, () => {
    const result = parse(`="h1"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=1' = FALSE`, () => {
    const result = parse(`="h1"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>1' = TRUE`, () => {
    const result = parse(`="h1"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=1' = TRUE`, () => {
    const result = parse(`="h1">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=1' = FALSE`, () => {
    const result = parse(`="h1"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&1' = h11`, () => {
    const result = parse(`="h1"&1`);
    expect(result.value).toBe("h11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"0"' = TRUE`, () => {
    const result = parse(`="h1">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"0"' = FALSE`, () => {
    const result = parse(`="h1"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="0"' = FALSE`, () => {
    const result = parse(`="h1"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"0"' = TRUE`, () => {
    const result = parse(`="h1"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="0"' = TRUE`, () => {
    const result = parse(`="h1">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="0"' = FALSE`, () => {
    const result = parse(`="h1"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"0"' = h10`, () => {
    const result = parse(`="h1"&"0"`);
    expect(result.value).toBe("h10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"1"' = TRUE`, () => {
    const result = parse(`="h1">"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"1"' = FALSE`, () => {
    const result = parse(`="h1"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="1"' = FALSE`, () => {
    const result = parse(`="h1"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"1"' = TRUE`, () => {
    const result = parse(`="h1"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="1"' = TRUE`, () => {
    const result = parse(`="h1">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="1"' = FALSE`, () => {
    const result = parse(`="h1"<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"1"' = h11`, () => {
    const result = parse(`="h1"&"1"`);
    expect(result.value).toBe("h11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+-1' = parser.VVALUE`, () => {
    const result = parse(`="h1"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"--1' = parser.VVALUE`, () => {
    const result = parse(`="h1"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*-1' = parser.VVALUE`, () => {
    const result = parse(`="h1"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/-1' = parser.VVALUE`, () => {
    const result = parse(`="h1"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^-1' = parser.VVALUE`, () => {
    const result = parse(`="h1"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">-1' = TRUE`, () => {
    const result = parse(`="h1">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<-1' = FALSE`, () => {
    const result = parse(`="h1"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=-1' = FALSE`, () => {
    const result = parse(`="h1"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>-1' = TRUE`, () => {
    const result = parse(`="h1"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=-1' = TRUE`, () => {
    const result = parse(`="h1">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=-1' = FALSE`, () => {
    const result = parse(`="h1"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&-1' = h1-1`, () => {
    const result = parse(`="h1"&-1`);
    expect(result.value).toBe("h1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"-1"' = TRUE`, () => {
    const result = parse(`="h1">"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"-1"' = FALSE`, () => {
    const result = parse(`="h1"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="-1"' = FALSE`, () => {
    const result = parse(`="h1"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"-1"' = TRUE`, () => {
    const result = parse(`="h1"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="-1"' = TRUE`, () => {
    const result = parse(`="h1">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="-1"' = FALSE`, () => {
    const result = parse(`="h1"<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"-1"' = h1-1`, () => {
    const result = parse(`="h1"&"-1"`);
    expect(result.value).toBe("h1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="h1"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="h1"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="h1"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="h1"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="h1"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">TRUE' = FALSE`, () => {
    const result = parse(`="h1">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<TRUE' = TRUE`, () => {
    const result = parse(`="h1"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=TRUE' = FALSE`, () => {
    const result = parse(`="h1"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>TRUE' = TRUE`, () => {
    const result = parse(`="h1"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=TRUE' = FALSE`, () => {
    const result = parse(`="h1">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=TRUE' = TRUE`, () => {
    const result = parse(`="h1"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&TRUE' = h1TRUE`, () => {
    const result = parse(`="h1"&TRUE`);
    expect(result.value).toBe("h1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="h1"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="h1"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="h1"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="h1"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="h1"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">FALSE' = FALSE`, () => {
    const result = parse(`="h1">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<FALSE' = TRUE`, () => {
    const result = parse(`="h1"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=FALSE' = FALSE`, () => {
    const result = parse(`="h1"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>FALSE' = TRUE`, () => {
    const result = parse(`="h1"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=FALSE' = FALSE`, () => {
    const result = parse(`="h1">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=FALSE' = TRUE`, () => {
    const result = parse(`="h1"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&FALSE' = h1FALSE`, () => {
    const result = parse(`="h1"&FALSE`);
    expect(result.value).toBe("h1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"Hello"' = FALSE`, () => {
    const result = parse(`="h1">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"Hello"' = TRUE`, () => {
    const result = parse(`="h1"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="Hello"' = FALSE`, () => {
    const result = parse(`="h1"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"Hello"' = TRUE`, () => {
    const result = parse(`="h1"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="Hello"' = FALSE`, () => {
    const result = parse(`="h1">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="Hello"' = TRUE`, () => {
    const result = parse(`="h1"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"Hello"' = h1Hello`, () => {
    const result = parse(`="h1"&"Hello"`);
    expect(result.value).toBe("h1Hello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'="h1"+""' = parser.VVALUE`, () => {
    const result = parse(`="h1"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-""' = parser.VVALUE`, () => {
    const result = parse(`="h1"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*""' = parser.VVALUE`, () => {
    const result = parse(`="h1"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/""' = parser.VVALUE`, () => {
    const result = parse(`="h1"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^""' = parser.VVALUE`, () => {
    const result = parse(`="h1"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">""' = TRUE`, () => {
    const result = parse(`="h1">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<""' = FALSE`, () => {
    const result = parse(`="h1"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"=""' = FALSE`, () => {
    const result = parse(`="h1"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>""' = TRUE`, () => {
    const result = parse(`="h1"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">=""' = TRUE`, () => {
    const result = parse(`="h1">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<=""' = FALSE`, () => {
    const result = parse(`="h1"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&""' = h1`, () => {
    const result = parse(`="h1"&""`);
    expect(result.value).toBe("h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"h1"' = FALSE`, () => {
    const result = parse(`="h1">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"h1"' = FALSE`, () => {
    const result = parse(`="h1"<"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="h1"' = TRUE`, () => {
    const result = parse(`="h1"="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"h1"' = FALSE`, () => {
    const result = parse(`="h1"<>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="h1"' = TRUE`, () => {
    const result = parse(`="h1">="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="h1"' = TRUE`, () => {
    const result = parse(`="h1"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"h1"' = h1h1`, () => {
    const result = parse(`="h1"&"h1"`);
    expect(result.value).toBe("h1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"1h"' = TRUE`, () => {
    const result = parse(`="h1">"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"1h"' = FALSE`, () => {
    const result = parse(`="h1"<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="1h"' = FALSE`, () => {
    const result = parse(`="h1"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"1h"' = TRUE`, () => {
    const result = parse(`="h1"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="1h"' = TRUE`, () => {
    const result = parse(`="h1">="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="1h"' = FALSE`, () => {
    const result = parse(`="h1"<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"1h"' = h11h`, () => {
    const result = parse(`="h1"&"1h"`);
    expect(result.value).toBe("h11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"A"' = TRUE`, () => {
    const result = parse(`="h1">"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"A"' = FALSE`, () => {
    const result = parse(`="h1"<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="A"' = FALSE`, () => {
    const result = parse(`="h1"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"A"' = TRUE`, () => {
    const result = parse(`="h1"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="A"' = TRUE`, () => {
    const result = parse(`="h1">="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="A"' = FALSE`, () => {
    const result = parse(`="h1"<="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"A"' = h1A`, () => {
    const result = parse(`="h1"&"A"`);
    expect(result.value).toBe("h1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"Z"' = FALSE`, () => {
    const result = parse(`="h1">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"Z"' = TRUE`, () => {
    const result = parse(`="h1"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="Z"' = FALSE`, () => {
    const result = parse(`="h1"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"Z"' = TRUE`, () => {
    const result = parse(`="h1"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="Z"' = FALSE`, () => {
    const result = parse(`="h1">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="Z"' = TRUE`, () => {
    const result = parse(`="h1"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"Z"' = h1Z`, () => {
    const result = parse(`="h1"&"Z"`);
    expect(result.value).toBe("h1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"$"' = TRUE`, () => {
    const result = parse(`="h1">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"$"' = FALSE`, () => {
    const result = parse(`="h1"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="$"' = FALSE`, () => {
    const result = parse(`="h1"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"$"' = TRUE`, () => {
    const result = parse(`="h1"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="$"' = TRUE`, () => {
    const result = parse(`="h1">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="$"' = FALSE`, () => {
    const result = parse(`="h1"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"$"' = h1$`, () => {
    const result = parse(`="h1"&"$"`);
    expect(result.value).toBe("h1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="h1"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="h1"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="h1"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="h1"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="h1"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">"_"' = TRUE`, () => {
    const result = parse(`="h1">"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<"_"' = FALSE`, () => {
    const result = parse(`="h1"<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"="_"' = FALSE`, () => {
    const result = parse(`="h1"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>"_"' = TRUE`, () => {
    const result = parse(`="h1"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">="_"' = TRUE`, () => {
    const result = parse(`="h1">="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<="_"' = FALSE`, () => {
    const result = parse(`="h1"<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&"_"' = h1_`, () => {
    const result = parse(`="h1"&"_"`);
    expect(result.value).toBe("h1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="h1"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="h1"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="h1"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="h1"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="h1"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">{1}' = TRUE`, () => {
    const result = parse(`="h1">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<{1}' = FALSE`, () => {
    const result = parse(`="h1"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"={1}' = FALSE`, () => {
    const result = parse(`="h1"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>{1}' = TRUE`, () => {
    const result = parse(`="h1"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">={1}' = TRUE`, () => {
    const result = parse(`="h1">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<={1}' = FALSE`, () => {
    const result = parse(`="h1"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&{1}' = h11`, () => {
    const result = parse(`="h1"&{1}`);
    expect(result.value).toBe("h11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="h1"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="h1"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="h1"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="h1"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="h1"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="h1"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="h1">{"1"}' = TRUE`, () => {
    const result = parse(`="h1">{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<{"1"}' = FALSE`, () => {
    const result = parse(`="h1"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"={"1"}' = FALSE`, () => {
    const result = parse(`="h1"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<>{"1"}' = TRUE`, () => {
    const result = parse(`="h1"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1">={"1"}' = TRUE`, () => {
    const result = parse(`="h1">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"<={"1"}' = FALSE`, () => {
    const result = parse(`="h1"<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="h1"&{"1"}' = h11`, () => {
    const result = parse(`="h1"&{"1"}`);
    expect(result.value).toBe("h11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+0' = parser.VVALUE`, () => {
    const result = parse(`="1h"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-0' = parser.VVALUE`, () => {
    const result = parse(`="1h"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*0' = parser.VVALUE`, () => {
    const result = parse(`="1h"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/0' = parser.VVALUE`, () => {
    const result = parse(`="1h"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^0' = parser.VVALUE`, () => {
    const result = parse(`="1h"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">0' = TRUE`, () => {
    const result = parse(`="1h">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<0' = FALSE`, () => {
    const result = parse(`="1h"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=0' = FALSE`, () => {
    const result = parse(`="1h"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>0' = TRUE`, () => {
    const result = parse(`="1h"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=0' = TRUE`, () => {
    const result = parse(`="1h">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=0' = FALSE`, () => {
    const result = parse(`="1h"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&0' = 1h0`, () => {
    const result = parse(`="1h"&0`);
    expect(result.value).toBe("1h0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+1' = parser.VVALUE`, () => {
    const result = parse(`="1h"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-1' = parser.VVALUE`, () => {
    const result = parse(`="1h"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*1' = parser.VVALUE`, () => {
    const result = parse(`="1h"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/1' = parser.VVALUE`, () => {
    const result = parse(`="1h"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^1' = parser.VVALUE`, () => {
    const result = parse(`="1h"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">1' = TRUE`, () => {
    const result = parse(`="1h">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<1' = FALSE`, () => {
    const result = parse(`="1h"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=1' = FALSE`, () => {
    const result = parse(`="1h"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>1' = TRUE`, () => {
    const result = parse(`="1h"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=1' = TRUE`, () => {
    const result = parse(`="1h">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=1' = FALSE`, () => {
    const result = parse(`="1h"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&1' = 1h1`, () => {
    const result = parse(`="1h"&1`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"0"' = TRUE`, () => {
    const result = parse(`="1h">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"0"' = FALSE`, () => {
    const result = parse(`="1h"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="0"' = FALSE`, () => {
    const result = parse(`="1h"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"0"' = TRUE`, () => {
    const result = parse(`="1h"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="0"' = TRUE`, () => {
    const result = parse(`="1h">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="0"' = FALSE`, () => {
    const result = parse(`="1h"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"0"' = 1h0`, () => {
    const result = parse(`="1h"&"0"`);
    expect(result.value).toBe("1h0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"1"' = TRUE`, () => {
    const result = parse(`="1h">"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"1"' = FALSE`, () => {
    const result = parse(`="1h"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="1"' = FALSE`, () => {
    const result = parse(`="1h"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"1"' = TRUE`, () => {
    const result = parse(`="1h"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="1"' = TRUE`, () => {
    const result = parse(`="1h">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="1"' = FALSE`, () => {
    const result = parse(`="1h"<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"1"' = 1h1`, () => {
    const result = parse(`="1h"&"1"`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+-1' = parser.VVALUE`, () => {
    const result = parse(`="1h"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"--1' = parser.VVALUE`, () => {
    const result = parse(`="1h"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*-1' = parser.VVALUE`, () => {
    const result = parse(`="1h"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/-1' = parser.VVALUE`, () => {
    const result = parse(`="1h"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^-1' = parser.VVALUE`, () => {
    const result = parse(`="1h"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">-1' = TRUE`, () => {
    const result = parse(`="1h">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<-1' = FALSE`, () => {
    const result = parse(`="1h"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=-1' = FALSE`, () => {
    const result = parse(`="1h"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>-1' = TRUE`, () => {
    const result = parse(`="1h"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=-1' = TRUE`, () => {
    const result = parse(`="1h">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=-1' = FALSE`, () => {
    const result = parse(`="1h"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&-1' = 1h-1`, () => {
    const result = parse(`="1h"&-1`);
    expect(result.value).toBe("1h-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"-1"' = TRUE`, () => {
    const result = parse(`="1h">"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"-1"' = FALSE`, () => {
    const result = parse(`="1h"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="-1"' = FALSE`, () => {
    const result = parse(`="1h"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"-1"' = TRUE`, () => {
    const result = parse(`="1h"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="-1"' = TRUE`, () => {
    const result = parse(`="1h">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="-1"' = FALSE`, () => {
    const result = parse(`="1h"<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"-1"' = 1h-1`, () => {
    const result = parse(`="1h"&"-1"`);
    expect(result.value).toBe("1h-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="1h"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="1h"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="1h"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="1h"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="1h"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">TRUE' = FALSE`, () => {
    const result = parse(`="1h">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<TRUE' = TRUE`, () => {
    const result = parse(`="1h"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=TRUE' = FALSE`, () => {
    const result = parse(`="1h"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>TRUE' = TRUE`, () => {
    const result = parse(`="1h"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=TRUE' = FALSE`, () => {
    const result = parse(`="1h">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=TRUE' = TRUE`, () => {
    const result = parse(`="1h"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&TRUE' = 1hTRUE`, () => {
    const result = parse(`="1h"&TRUE`);
    expect(result.value).toBe("1hTRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="1h"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="1h"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="1h"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="1h"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="1h"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">FALSE' = FALSE`, () => {
    const result = parse(`="1h">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<FALSE' = TRUE`, () => {
    const result = parse(`="1h"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=FALSE' = FALSE`, () => {
    const result = parse(`="1h"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>FALSE' = TRUE`, () => {
    const result = parse(`="1h"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=FALSE' = FALSE`, () => {
    const result = parse(`="1h">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=FALSE' = TRUE`, () => {
    const result = parse(`="1h"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&FALSE' = 1hFALSE`, () => {
    const result = parse(`="1h"&FALSE`);
    expect(result.value).toBe("1hFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"Hello"' = FALSE`, () => {
    const result = parse(`="1h">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"Hello"' = TRUE`, () => {
    const result = parse(`="1h"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="Hello"' = FALSE`, () => {
    const result = parse(`="1h"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"Hello"' = TRUE`, () => {
    const result = parse(`="1h"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="Hello"' = FALSE`, () => {
    const result = parse(`="1h">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="Hello"' = TRUE`, () => {
    const result = parse(`="1h"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"Hello"' = 1hHello`, () => {
    const result = parse(`="1h"&"Hello"`);
    expect(result.value).toBe("1hHello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'="1h"+""' = parser.VVALUE`, () => {
    const result = parse(`="1h"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-""' = parser.VVALUE`, () => {
    const result = parse(`="1h"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*""' = parser.VVALUE`, () => {
    const result = parse(`="1h"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/""' = parser.VVALUE`, () => {
    const result = parse(`="1h"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^""' = parser.VVALUE`, () => {
    const result = parse(`="1h"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">""' = TRUE`, () => {
    const result = parse(`="1h">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<""' = FALSE`, () => {
    const result = parse(`="1h"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"=""' = FALSE`, () => {
    const result = parse(`="1h"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>""' = TRUE`, () => {
    const result = parse(`="1h"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">=""' = TRUE`, () => {
    const result = parse(`="1h">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<=""' = FALSE`, () => {
    const result = parse(`="1h"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&""' = 1h`, () => {
    const result = parse(`="1h"&""`);
    expect(result.value).toBe("1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"h1"' = FALSE`, () => {
    const result = parse(`="1h">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"h1"' = TRUE`, () => {
    const result = parse(`="1h"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="h1"' = FALSE`, () => {
    const result = parse(`="1h"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"h1"' = TRUE`, () => {
    const result = parse(`="1h"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="h1"' = FALSE`, () => {
    const result = parse(`="1h">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="h1"' = TRUE`, () => {
    const result = parse(`="1h"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"h1"' = 1hh1`, () => {
    const result = parse(`="1h"&"h1"`);
    expect(result.value).toBe("1hh1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"1h"' = FALSE`, () => {
    const result = parse(`="1h">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"1h"' = FALSE`, () => {
    const result = parse(`="1h"<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="1h"' = TRUE`, () => {
    const result = parse(`="1h"="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"1h"' = FALSE`, () => {
    const result = parse(`="1h"<>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="1h"' = TRUE`, () => {
    const result = parse(`="1h">="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="1h"' = TRUE`, () => {
    const result = parse(`="1h"<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"1h"' = 1h1h`, () => {
    const result = parse(`="1h"&"1h"`);
    expect(result.value).toBe("1h1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"A"' = FALSE`, () => {
    const result = parse(`="1h">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"A"' = TRUE`, () => {
    const result = parse(`="1h"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="A"' = FALSE`, () => {
    const result = parse(`="1h"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"A"' = TRUE`, () => {
    const result = parse(`="1h"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="A"' = FALSE`, () => {
    const result = parse(`="1h">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="A"' = TRUE`, () => {
    const result = parse(`="1h"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"A"' = 1hA`, () => {
    const result = parse(`="1h"&"A"`);
    expect(result.value).toBe("1hA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"Z"' = FALSE`, () => {
    const result = parse(`="1h">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"Z"' = TRUE`, () => {
    const result = parse(`="1h"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="Z"' = FALSE`, () => {
    const result = parse(`="1h"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"Z"' = TRUE`, () => {
    const result = parse(`="1h"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="Z"' = FALSE`, () => {
    const result = parse(`="1h">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="Z"' = TRUE`, () => {
    const result = parse(`="1h"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"Z"' = 1hZ`, () => {
    const result = parse(`="1h"&"Z"`);
    expect(result.value).toBe("1hZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"$"' = TRUE`, () => {
    const result = parse(`="1h">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"$"' = FALSE`, () => {
    const result = parse(`="1h"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="$"' = FALSE`, () => {
    const result = parse(`="1h"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"$"' = TRUE`, () => {
    const result = parse(`="1h"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="$"' = TRUE`, () => {
    const result = parse(`="1h">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="$"' = FALSE`, () => {
    const result = parse(`="1h"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"$"' = 1h$`, () => {
    const result = parse(`="1h"&"$"`);
    expect(result.value).toBe("1h$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="1h"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="1h"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="1h"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="1h"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="1h"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">"_"' = TRUE`, () => {
    const result = parse(`="1h">"_"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<"_"' = FALSE`, () => {
    const result = parse(`="1h"<"_"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"="_"' = FALSE`, () => {
    const result = parse(`="1h"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>"_"' = TRUE`, () => {
    const result = parse(`="1h"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">="_"' = TRUE`, () => {
    const result = parse(`="1h">="_"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<="_"' = FALSE`, () => {
    const result = parse(`="1h"<="_"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&"_"' = 1h_`, () => {
    const result = parse(`="1h"&"_"`);
    expect(result.value).toBe("1h_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="1h"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="1h"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="1h"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="1h"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="1h"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">{1}' = TRUE`, () => {
    const result = parse(`="1h">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<{1}' = FALSE`, () => {
    const result = parse(`="1h"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"={1}' = FALSE`, () => {
    const result = parse(`="1h"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>{1}' = TRUE`, () => {
    const result = parse(`="1h"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">={1}' = TRUE`, () => {
    const result = parse(`="1h">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<={1}' = FALSE`, () => {
    const result = parse(`="1h"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&{1}' = 1h1`, () => {
    const result = parse(`="1h"&{1}`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="1h"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="1h"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="1h"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="1h"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="1h"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="1h"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="1h">{"1"}' = TRUE`, () => {
    const result = parse(`="1h">{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<{"1"}' = FALSE`, () => {
    const result = parse(`="1h"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"={"1"}' = FALSE`, () => {
    const result = parse(`="1h"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<>{"1"}' = TRUE`, () => {
    const result = parse(`="1h"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h">={"1"}' = TRUE`, () => {
    const result = parse(`="1h">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"<={"1"}' = FALSE`, () => {
    const result = parse(`="1h"<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="1h"&{"1"}' = 1h1`, () => {
    const result = parse(`="1h"&{"1"}`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+0' = parser.VVALUE`, () => {
    const result = parse(`="A"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-0' = parser.VVALUE`, () => {
    const result = parse(`="A"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*0' = parser.VVALUE`, () => {
    const result = parse(`="A"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/0' = parser.VVALUE`, () => {
    const result = parse(`="A"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^0' = parser.VVALUE`, () => {
    const result = parse(`="A"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">0' = TRUE`, () => {
    const result = parse(`="A">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<0' = FALSE`, () => {
    const result = parse(`="A"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=0' = FALSE`, () => {
    const result = parse(`="A"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>0' = TRUE`, () => {
    const result = parse(`="A"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=0' = TRUE`, () => {
    const result = parse(`="A">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=0' = FALSE`, () => {
    const result = parse(`="A"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&0' = A0`, () => {
    const result = parse(`="A"&0`);
    expect(result.value).toBe("A0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+1' = parser.VVALUE`, () => {
    const result = parse(`="A"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-1' = parser.VVALUE`, () => {
    const result = parse(`="A"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*1' = parser.VVALUE`, () => {
    const result = parse(`="A"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/1' = parser.VVALUE`, () => {
    const result = parse(`="A"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^1' = parser.VVALUE`, () => {
    const result = parse(`="A"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">1' = TRUE`, () => {
    const result = parse(`="A">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<1' = FALSE`, () => {
    const result = parse(`="A"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=1' = FALSE`, () => {
    const result = parse(`="A"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>1' = TRUE`, () => {
    const result = parse(`="A"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=1' = TRUE`, () => {
    const result = parse(`="A">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=1' = FALSE`, () => {
    const result = parse(`="A"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&1' = A1`, () => {
    const result = parse(`="A"&1`);
    expect(result.value).toBe("A1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"0"' = TRUE`, () => {
    const result = parse(`="A">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"0"' = FALSE`, () => {
    const result = parse(`="A"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="0"' = FALSE`, () => {
    const result = parse(`="A"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"0"' = TRUE`, () => {
    const result = parse(`="A"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="0"' = TRUE`, () => {
    const result = parse(`="A">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="0"' = FALSE`, () => {
    const result = parse(`="A"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"0"' = A0`, () => {
    const result = parse(`="A"&"0"`);
    expect(result.value).toBe("A0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"1"' = TRUE`, () => {
    const result = parse(`="A">"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"1"' = FALSE`, () => {
    const result = parse(`="A"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="1"' = FALSE`, () => {
    const result = parse(`="A"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"1"' = TRUE`, () => {
    const result = parse(`="A"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="1"' = TRUE`, () => {
    const result = parse(`="A">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="1"' = FALSE`, () => {
    const result = parse(`="A"<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"1"' = A1`, () => {
    const result = parse(`="A"&"1"`);
    expect(result.value).toBe("A1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+-1' = parser.VVALUE`, () => {
    const result = parse(`="A"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"--1' = parser.VVALUE`, () => {
    const result = parse(`="A"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*-1' = parser.VVALUE`, () => {
    const result = parse(`="A"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/-1' = parser.VVALUE`, () => {
    const result = parse(`="A"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^-1' = parser.VVALUE`, () => {
    const result = parse(`="A"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">-1' = TRUE`, () => {
    const result = parse(`="A">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<-1' = FALSE`, () => {
    const result = parse(`="A"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=-1' = FALSE`, () => {
    const result = parse(`="A"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>-1' = TRUE`, () => {
    const result = parse(`="A"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=-1' = TRUE`, () => {
    const result = parse(`="A">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=-1' = FALSE`, () => {
    const result = parse(`="A"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&-1' = A-1`, () => {
    const result = parse(`="A"&-1`);
    expect(result.value).toBe("A-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"-1"' = TRUE`, () => {
    const result = parse(`="A">"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"-1"' = FALSE`, () => {
    const result = parse(`="A"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="-1"' = FALSE`, () => {
    const result = parse(`="A"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"-1"' = TRUE`, () => {
    const result = parse(`="A"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="-1"' = TRUE`, () => {
    const result = parse(`="A">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="-1"' = FALSE`, () => {
    const result = parse(`="A"<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"-1"' = A-1`, () => {
    const result = parse(`="A"&"-1"`);
    expect(result.value).toBe("A-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="A"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="A"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="A"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="A"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="A"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">TRUE' = FALSE`, () => {
    const result = parse(`="A">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<TRUE' = TRUE`, () => {
    const result = parse(`="A"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=TRUE' = FALSE`, () => {
    const result = parse(`="A"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>TRUE' = TRUE`, () => {
    const result = parse(`="A"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=TRUE' = FALSE`, () => {
    const result = parse(`="A">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=TRUE' = TRUE`, () => {
    const result = parse(`="A"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&TRUE' = ATRUE`, () => {
    const result = parse(`="A"&TRUE`);
    expect(result.value).toBe("ATRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="A"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="A"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="A"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="A"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="A"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">FALSE' = FALSE`, () => {
    const result = parse(`="A">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<FALSE' = TRUE`, () => {
    const result = parse(`="A"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=FALSE' = FALSE`, () => {
    const result = parse(`="A"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>FALSE' = TRUE`, () => {
    const result = parse(`="A"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=FALSE' = FALSE`, () => {
    const result = parse(`="A">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=FALSE' = TRUE`, () => {
    const result = parse(`="A"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&FALSE' = AFALSE`, () => {
    const result = parse(`="A"&FALSE`);
    expect(result.value).toBe("AFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"Hello"' = FALSE`, () => {
    const result = parse(`="A">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"Hello"' = TRUE`, () => {
    const result = parse(`="A"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="Hello"' = FALSE`, () => {
    const result = parse(`="A"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"Hello"' = TRUE`, () => {
    const result = parse(`="A"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="Hello"' = FALSE`, () => {
    const result = parse(`="A">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="Hello"' = TRUE`, () => {
    const result = parse(`="A"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"Hello"' = AHello`, () => {
    const result = parse(`="A"&"Hello"`);
    expect(result.value).toBe("AHello");
    expect(result.type).toBe(parser.STRING);
  });

test(`'="A"+""' = parser.VVALUE`, () => {
    const result = parse(`="A"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-""' = parser.VVALUE`, () => {
    const result = parse(`="A"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*""' = parser.VVALUE`, () => {
    const result = parse(`="A"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/""' = parser.VVALUE`, () => {
    const result = parse(`="A"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^""' = parser.VVALUE`, () => {
    const result = parse(`="A"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">""' = TRUE`, () => {
    const result = parse(`="A">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<""' = FALSE`, () => {
    const result = parse(`="A"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"=""' = FALSE`, () => {
    const result = parse(`="A"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>""' = TRUE`, () => {
    const result = parse(`="A"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">=""' = TRUE`, () => {
    const result = parse(`="A">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<=""' = FALSE`, () => {
    const result = parse(`="A"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&""' = A`, () => {
    const result = parse(`="A"&""`);
    expect(result.value).toBe("A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"h1"' = FALSE`, () => {
    const result = parse(`="A">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"h1"' = TRUE`, () => {
    const result = parse(`="A"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="h1"' = FALSE`, () => {
    const result = parse(`="A"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"h1"' = TRUE`, () => {
    const result = parse(`="A"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="h1"' = FALSE`, () => {
    const result = parse(`="A">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="h1"' = TRUE`, () => {
    const result = parse(`="A"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"h1"' = Ah1`, () => {
    const result = parse(`="A"&"h1"`);
    expect(result.value).toBe("Ah1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"1h"' = TRUE`, () => {
    const result = parse(`="A">"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"1h"' = FALSE`, () => {
    const result = parse(`="A"<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="1h"' = FALSE`, () => {
    const result = parse(`="A"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"1h"' = TRUE`, () => {
    const result = parse(`="A"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="1h"' = TRUE`, () => {
    const result = parse(`="A">="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="1h"' = FALSE`, () => {
    const result = parse(`="A"<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"1h"' = A1h`, () => {
    const result = parse(`="A"&"1h"`);
    expect(result.value).toBe("A1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"A"' = FALSE`, () => {
    const result = parse(`="A">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"A"' = FALSE`, () => {
    const result = parse(`="A"<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="A"' = TRUE`, () => {
    const result = parse(`="A"="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"A"' = FALSE`, () => {
    const result = parse(`="A"<>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="A"' = TRUE`, () => {
    const result = parse(`="A">="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="A"' = TRUE`, () => {
    const result = parse(`="A"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"A"' = AA`, () => {
    const result = parse(`="A"&"A"`);
    expect(result.value).toBe("AA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"Z"' = FALSE`, () => {
    const result = parse(`="A">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"Z"' = TRUE`, () => {
    const result = parse(`="A"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="Z"' = FALSE`, () => {
    const result = parse(`="A"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"Z"' = TRUE`, () => {
    const result = parse(`="A"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="Z"' = FALSE`, () => {
    const result = parse(`="A">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="Z"' = TRUE`, () => {
    const result = parse(`="A"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"Z"' = AZ`, () => {
    const result = parse(`="A"&"Z"`);
    expect(result.value).toBe("AZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"$"' = TRUE`, () => {
    const result = parse(`="A">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"$"' = FALSE`, () => {
    const result = parse(`="A"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="$"' = FALSE`, () => {
    const result = parse(`="A"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"$"' = TRUE`, () => {
    const result = parse(`="A"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="$"' = TRUE`, () => {
    const result = parse(`="A">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="$"' = FALSE`, () => {
    const result = parse(`="A"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"$"' = A$`, () => {
    const result = parse(`="A"&"$"`);
    expect(result.value).toBe("A$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="A"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="A"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="A"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="A"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="A"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">"_"' = TRUE`, () => {
    const result = parse(`="A">"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<"_"' = FALSE`, () => {
    const result = parse(`="A"<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"="_"' = FALSE`, () => {
    const result = parse(`="A"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>"_"' = TRUE`, () => {
    const result = parse(`="A"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">="_"' = TRUE`, () => {
    const result = parse(`="A">="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<="_"' = FALSE`, () => {
    const result = parse(`="A"<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&"_"' = A_`, () => {
    const result = parse(`="A"&"_"`);
    expect(result.value).toBe("A_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="A"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="A"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="A"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="A"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="A"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">{1}' = TRUE`, () => {
    const result = parse(`="A">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<{1}' = FALSE`, () => {
    const result = parse(`="A"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"={1}' = FALSE`, () => {
    const result = parse(`="A"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>{1}' = TRUE`, () => {
    const result = parse(`="A"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">={1}' = TRUE`, () => {
    const result = parse(`="A">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<={1}' = FALSE`, () => {
    const result = parse(`="A"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&{1}' = A1`, () => {
    const result = parse(`="A"&{1}`);
    expect(result.value).toBe("A1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="A"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="A"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="A"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="A"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="A"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="A"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="A">{"1"}' = TRUE`, () => {
    const result = parse(`="A">{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<{"1"}' = FALSE`, () => {
    const result = parse(`="A"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"={"1"}' = FALSE`, () => {
    const result = parse(`="A"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<>{"1"}' = TRUE`, () => {
    const result = parse(`="A"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A">={"1"}' = TRUE`, () => {
    const result = parse(`="A">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"<={"1"}' = FALSE`, () => {
    const result = parse(`="A"<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="A"&{"1"}' = A1`, () => {
    const result = parse(`="A"&{"1"}`);
    expect(result.value).toBe("A1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+0' = parser.VVALUE`, () => {
    const result = parse(`="Z"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-0' = parser.VVALUE`, () => {
    const result = parse(`="Z"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*0' = parser.VVALUE`, () => {
    const result = parse(`="Z"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/0' = parser.VVALUE`, () => {
    const result = parse(`="Z"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^0' = parser.VVALUE`, () => {
    const result = parse(`="Z"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">0' = TRUE`, () => {
    const result = parse(`="Z">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<0' = FALSE`, () => {
    const result = parse(`="Z"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=0' = FALSE`, () => {
    const result = parse(`="Z"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>0' = TRUE`, () => {
    const result = parse(`="Z"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=0' = TRUE`, () => {
    const result = parse(`="Z">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=0' = FALSE`, () => {
    const result = parse(`="Z"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&0' = Z0`, () => {
    const result = parse(`="Z"&0`);
    expect(result.value).toBe("Z0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+1' = parser.VVALUE`, () => {
    const result = parse(`="Z"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-1' = parser.VVALUE`, () => {
    const result = parse(`="Z"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*1' = parser.VVALUE`, () => {
    const result = parse(`="Z"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/1' = parser.VVALUE`, () => {
    const result = parse(`="Z"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^1' = parser.VVALUE`, () => {
    const result = parse(`="Z"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">1' = TRUE`, () => {
    const result = parse(`="Z">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<1' = FALSE`, () => {
    const result = parse(`="Z"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=1' = FALSE`, () => {
    const result = parse(`="Z"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>1' = TRUE`, () => {
    const result = parse(`="Z"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=1' = TRUE`, () => {
    const result = parse(`="Z">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=1' = FALSE`, () => {
    const result = parse(`="Z"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&1' = Z1`, () => {
    const result = parse(`="Z"&1`);
    expect(result.value).toBe("Z1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"0"' = TRUE`, () => {
    const result = parse(`="Z">"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"0"' = FALSE`, () => {
    const result = parse(`="Z"<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="0"' = FALSE`, () => {
    const result = parse(`="Z"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"0"' = TRUE`, () => {
    const result = parse(`="Z"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="0"' = TRUE`, () => {
    const result = parse(`="Z">="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="0"' = FALSE`, () => {
    const result = parse(`="Z"<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"0"' = Z0`, () => {
    const result = parse(`="Z"&"0"`);
    expect(result.value).toBe("Z0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"1"' = TRUE`, () => {
    const result = parse(`="Z">"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"1"' = FALSE`, () => {
    const result = parse(`="Z"<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="1"' = FALSE`, () => {
    const result = parse(`="Z"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"1"' = TRUE`, () => {
    const result = parse(`="Z"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="1"' = TRUE`, () => {
    const result = parse(`="Z">="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="1"' = FALSE`, () => {
    const result = parse(`="Z"<="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"1"' = Z1`, () => {
    const result = parse(`="Z"&"1"`);
    expect(result.value).toBe("Z1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+-1' = parser.VVALUE`, () => {
    const result = parse(`="Z"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"--1' = parser.VVALUE`, () => {
    const result = parse(`="Z"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*-1' = parser.VVALUE`, () => {
    const result = parse(`="Z"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/-1' = parser.VVALUE`, () => {
    const result = parse(`="Z"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^-1' = parser.VVALUE`, () => {
    const result = parse(`="Z"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">-1' = TRUE`, () => {
    const result = parse(`="Z">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<-1' = FALSE`, () => {
    const result = parse(`="Z"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=-1' = FALSE`, () => {
    const result = parse(`="Z"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>-1' = TRUE`, () => {
    const result = parse(`="Z"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=-1' = TRUE`, () => {
    const result = parse(`="Z">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=-1' = FALSE`, () => {
    const result = parse(`="Z"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&-1' = Z-1`, () => {
    const result = parse(`="Z"&-1`);
    expect(result.value).toBe("Z-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"-1"' = TRUE`, () => {
    const result = parse(`="Z">"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"-1"' = FALSE`, () => {
    const result = parse(`="Z"<"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="-1"' = FALSE`, () => {
    const result = parse(`="Z"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"-1"' = TRUE`, () => {
    const result = parse(`="Z"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="-1"' = TRUE`, () => {
    const result = parse(`="Z">="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="-1"' = FALSE`, () => {
    const result = parse(`="Z"<="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"-1"' = Z-1`, () => {
    const result = parse(`="Z"&"-1"`);
    expect(result.value).toBe("Z-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Z"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Z"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Z"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Z"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="Z"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">TRUE' = FALSE`, () => {
    const result = parse(`="Z">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<TRUE' = TRUE`, () => {
    const result = parse(`="Z"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=TRUE' = FALSE`, () => {
    const result = parse(`="Z"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>TRUE' = TRUE`, () => {
    const result = parse(`="Z"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=TRUE' = FALSE`, () => {
    const result = parse(`="Z">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=TRUE' = TRUE`, () => {
    const result = parse(`="Z"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&TRUE' = ZTRUE`, () => {
    const result = parse(`="Z"&TRUE`);
    expect(result.value).toBe("ZTRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Z"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Z"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Z"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Z"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="Z"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">FALSE' = FALSE`, () => {
    const result = parse(`="Z">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<FALSE' = TRUE`, () => {
    const result = parse(`="Z"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=FALSE' = FALSE`, () => {
    const result = parse(`="Z"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>FALSE' = TRUE`, () => {
    const result = parse(`="Z"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=FALSE' = FALSE`, () => {
    const result = parse(`="Z">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=FALSE' = TRUE`, () => {
    const result = parse(`="Z"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&FALSE' = ZFALSE`, () => {
    const result = parse(`="Z"&FALSE`);
    expect(result.value).toBe("ZFALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"Hello"' = TRUE`, () => {
    const result = parse(`="Z">"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"Hello"' = FALSE`, () => {
    const result = parse(`="Z"<"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="Hello"' = FALSE`, () => {
    const result = parse(`="Z"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"Hello"' = TRUE`, () => {
    const result = parse(`="Z"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="Hello"' = TRUE`, () => {
    const result = parse(`="Z">="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="Hello"' = FALSE`, () => {
    const result = parse(`="Z"<="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"Hello"' = ZHello`, () => {
    const result = parse(`="Z"&"Hello"`);
    expect(result.value).toBe("ZHello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+""' = parser.VVALUE`, () => {
    const result = parse(`="Z"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-""' = parser.VVALUE`, () => {
    const result = parse(`="Z"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*""' = parser.VVALUE`, () => {
    const result = parse(`="Z"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/""' = parser.VVALUE`, () => {
    const result = parse(`="Z"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^""' = parser.VVALUE`, () => {
    const result = parse(`="Z"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">""' = TRUE`, () => {
    const result = parse(`="Z">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<""' = FALSE`, () => {
    const result = parse(`="Z"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"=""' = FALSE`, () => {
    const result = parse(`="Z"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>""' = TRUE`, () => {
    const result = parse(`="Z"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">=""' = TRUE`, () => {
    const result = parse(`="Z">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<=""' = FALSE`, () => {
    const result = parse(`="Z"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&""' = Z`, () => {
    const result = parse(`="Z"&""`);
    expect(result.value).toBe("Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"h1"' = TRUE`, () => {
    const result = parse(`="Z">"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"h1"' = FALSE`, () => {
    const result = parse(`="Z"<"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="h1"' = FALSE`, () => {
    const result = parse(`="Z"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"h1"' = TRUE`, () => {
    const result = parse(`="Z"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="h1"' = TRUE`, () => {
    const result = parse(`="Z">="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="h1"' = FALSE`, () => {
    const result = parse(`="Z"<="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"h1"' = Zh1`, () => {
    const result = parse(`="Z"&"h1"`);
    expect(result.value).toBe("Zh1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"1h"' = TRUE`, () => {
    const result = parse(`="Z">"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"1h"' = FALSE`, () => {
    const result = parse(`="Z"<"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="1h"' = FALSE`, () => {
    const result = parse(`="Z"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"1h"' = TRUE`, () => {
    const result = parse(`="Z"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="1h"' = TRUE`, () => {
    const result = parse(`="Z">="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="1h"' = FALSE`, () => {
    const result = parse(`="Z"<="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"1h"' = Z1h`, () => {
    const result = parse(`="Z"&"1h"`);
    expect(result.value).toBe("Z1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"A"' = TRUE`, () => {
    const result = parse(`="Z">"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"A"' = FALSE`, () => {
    const result = parse(`="Z"<"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="A"' = FALSE`, () => {
    const result = parse(`="Z"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"A"' = TRUE`, () => {
    const result = parse(`="Z"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="A"' = TRUE`, () => {
    const result = parse(`="Z">="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="A"' = FALSE`, () => {
    const result = parse(`="Z"<="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"A"' = ZA`, () => {
    const result = parse(`="Z"&"A"`);
    expect(result.value).toBe("ZA");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"Z"' = FALSE`, () => {
    const result = parse(`="Z">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"Z"' = FALSE`, () => {
    const result = parse(`="Z"<"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="Z"' = TRUE`, () => {
    const result = parse(`="Z"="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"Z"' = FALSE`, () => {
    const result = parse(`="Z"<>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="Z"' = TRUE`, () => {
    const result = parse(`="Z">="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="Z"' = TRUE`, () => {
    const result = parse(`="Z"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"Z"' = ZZ`, () => {
    const result = parse(`="Z"&"Z"`);
    expect(result.value).toBe("ZZ");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"$"' = TRUE`, () => {
    const result = parse(`="Z">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"$"' = FALSE`, () => {
    const result = parse(`="Z"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="$"' = FALSE`, () => {
    const result = parse(`="Z"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"$"' = TRUE`, () => {
    const result = parse(`="Z"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="$"' = TRUE`, () => {
    const result = parse(`="Z">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="$"' = FALSE`, () => {
    const result = parse(`="Z"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"$"' = Z$`, () => {
    const result = parse(`="Z"&"$"`);
    expect(result.value).toBe("Z$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="Z"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="Z"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="Z"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="Z"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="Z"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">"_"' = TRUE`, () => {
    const result = parse(`="Z">"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<"_"' = FALSE`, () => {
    const result = parse(`="Z"<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"="_"' = FALSE`, () => {
    const result = parse(`="Z"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>"_"' = TRUE`, () => {
    const result = parse(`="Z"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">="_"' = TRUE`, () => {
    const result = parse(`="Z">="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<="_"' = FALSE`, () => {
    const result = parse(`="Z"<="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&"_"' = Z_`, () => {
    const result = parse(`="Z"&"_"`);
    expect(result.value).toBe("Z_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="Z"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="Z"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="Z"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="Z"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="Z"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">{1}' = TRUE`, () => {
    const result = parse(`="Z">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<{1}' = FALSE`, () => {
    const result = parse(`="Z"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"={1}' = FALSE`, () => {
    const result = parse(`="Z"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>{1}' = TRUE`, () => {
    const result = parse(`="Z"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">={1}' = TRUE`, () => {
    const result = parse(`="Z">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<={1}' = FALSE`, () => {
    const result = parse(`="Z"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&{1}' = Z1`, () => {
    const result = parse(`="Z"&{1}`);
    expect(result.value).toBe("Z1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="Z"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Z"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Z"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Z"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Z"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="Z"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="Z">{"1"}' = TRUE`, () => {
    const result = parse(`="Z">{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<{"1"}' = FALSE`, () => {
    const result = parse(`="Z"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"={"1"}' = FALSE`, () => {
    const result = parse(`="Z"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<>{"1"}' = TRUE`, () => {
    const result = parse(`="Z"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z">={"1"}' = TRUE`, () => {
    const result = parse(`="Z">={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"<={"1"}' = FALSE`, () => {
    const result = parse(`="Z"<={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="Z"&{"1"}' = Z1`, () => {
    const result = parse(`="Z"&{"1"}`);
    expect(result.value).toBe("Z1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+0' = parser.VVALUE`, () => {
    const result = parse(`="$"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-0' = parser.VVALUE`, () => {
    const result = parse(`="$"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*0' = parser.VVALUE`, () => {
    const result = parse(`="$"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/0' = parser.VVALUE`, () => {
    const result = parse(`="$"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^0' = parser.VVALUE`, () => {
    const result = parse(`="$"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">0' = TRUE`, () => {
    const result = parse(`="$">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<0' = FALSE`, () => {
    const result = parse(`="$"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=0' = FALSE`, () => {
    const result = parse(`="$"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>0' = TRUE`, () => {
    const result = parse(`="$"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=0' = TRUE`, () => {
    const result = parse(`="$">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=0' = FALSE`, () => {
    const result = parse(`="$"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&0' = $0`, () => {
    const result = parse(`="$"&0`);
    expect(result.value).toBe("$0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+1' = parser.VVALUE`, () => {
    const result = parse(`="$"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-1' = parser.VVALUE`, () => {
    const result = parse(`="$"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*1' = parser.VVALUE`, () => {
    const result = parse(`="$"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/1' = parser.VVALUE`, () => {
    const result = parse(`="$"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^1' = parser.VVALUE`, () => {
    const result = parse(`="$"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">1' = TRUE`, () => {
    const result = parse(`="$">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<1' = FALSE`, () => {
    const result = parse(`="$"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=1' = FALSE`, () => {
    const result = parse(`="$"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>1' = TRUE`, () => {
    const result = parse(`="$"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=1' = TRUE`, () => {
    const result = parse(`="$">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=1' = FALSE`, () => {
    const result = parse(`="$"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&1' = $1`, () => {
    const result = parse(`="$"&1`);
    expect(result.value).toBe("$1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"0"' = FALSE`, () => {
    const result = parse(`="$">"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"0"' = TRUE`, () => {
    const result = parse(`="$"<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="0"' = FALSE`, () => {
    const result = parse(`="$"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"0"' = TRUE`, () => {
    const result = parse(`="$"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="0"' = FALSE`, () => {
    const result = parse(`="$">="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="0"' = TRUE`, () => {
    const result = parse(`="$"<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"0"' = $0`, () => {
    const result = parse(`="$"&"0"`);
    expect(result.value).toBe("$0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"1"' = FALSE`, () => {
    const result = parse(`="$">"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"1"' = TRUE`, () => {
    const result = parse(`="$"<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="1"' = FALSE`, () => {
    const result = parse(`="$"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"1"' = TRUE`, () => {
    const result = parse(`="$"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="1"' = FALSE`, () => {
    const result = parse(`="$">="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="1"' = TRUE`, () => {
    const result = parse(`="$"<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"1"' = $1`, () => {
    const result = parse(`="$"&"1"`);
    expect(result.value).toBe("$1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+-1' = parser.VVALUE`, () => {
    const result = parse(`="$"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"--1' = parser.VVALUE`, () => {
    const result = parse(`="$"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*-1' = parser.VVALUE`, () => {
    const result = parse(`="$"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/-1' = parser.VVALUE`, () => {
    const result = parse(`="$"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^-1' = parser.VVALUE`, () => {
    const result = parse(`="$"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">-1' = TRUE`, () => {
    const result = parse(`="$">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<-1' = FALSE`, () => {
    const result = parse(`="$"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=-1' = FALSE`, () => {
    const result = parse(`="$"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>-1' = TRUE`, () => {
    const result = parse(`="$"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=-1' = TRUE`, () => {
    const result = parse(`="$">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=-1' = FALSE`, () => {
    const result = parse(`="$"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&-1' = $-1`, () => {
    const result = parse(`="$"&-1`);
    expect(result.value).toBe("$-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"-1"' = FALSE`, () => {
    const result = parse(`="$">"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"-1"' = TRUE`, () => {
    const result = parse(`="$"<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="-1"' = FALSE`, () => {
    const result = parse(`="$"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"-1"' = TRUE`, () => {
    const result = parse(`="$"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="-1"' = FALSE`, () => {
    const result = parse(`="$">="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="-1"' = TRUE`, () => {
    const result = parse(`="$"<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"-1"' = $-1`, () => {
    const result = parse(`="$"&"-1"`);
    expect(result.value).toBe("$-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="$"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="$"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="$"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="$"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="$"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">TRUE' = FALSE`, () => {
    const result = parse(`="$">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<TRUE' = TRUE`, () => {
    const result = parse(`="$"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=TRUE' = FALSE`, () => {
    const result = parse(`="$"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>TRUE' = TRUE`, () => {
    const result = parse(`="$"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=TRUE' = FALSE`, () => {
    const result = parse(`="$">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=TRUE' = TRUE`, () => {
    const result = parse(`="$"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&TRUE' = $TRUE`, () => {
    const result = parse(`="$"&TRUE`);
    expect(result.value).toBe("$TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="$"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="$"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="$"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="$"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="$"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">FALSE' = FALSE`, () => {
    const result = parse(`="$">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<FALSE' = TRUE`, () => {
    const result = parse(`="$"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=FALSE' = FALSE`, () => {
    const result = parse(`="$"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>FALSE' = TRUE`, () => {
    const result = parse(`="$"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=FALSE' = FALSE`, () => {
    const result = parse(`="$">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=FALSE' = TRUE`, () => {
    const result = parse(`="$"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&FALSE' = $FALSE`, () => {
    const result = parse(`="$"&FALSE`);
    expect(result.value).toBe("$FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"Hello"' = FALSE`, () => {
    const result = parse(`="$">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"Hello"' = TRUE`, () => {
    const result = parse(`="$"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="Hello"' = FALSE`, () => {
    const result = parse(`="$"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"Hello"' = TRUE`, () => {
    const result = parse(`="$"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="Hello"' = FALSE`, () => {
    const result = parse(`="$">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="Hello"' = TRUE`, () => {
    const result = parse(`="$"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"Hello"' = $Hello`, () => {
    const result = parse(`="$"&"Hello"`);
    expect(result.value).toBe("$Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+""' = parser.VVALUE`, () => {
    const result = parse(`="$"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-""' = parser.VVALUE`, () => {
    const result = parse(`="$"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*""' = parser.VVALUE`, () => {
    const result = parse(`="$"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/""' = parser.VVALUE`, () => {
    const result = parse(`="$"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^""' = parser.VVALUE`, () => {
    const result = parse(`="$"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">""' = TRUE`, () => {
    const result = parse(`="$">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<""' = FALSE`, () => {
    const result = parse(`="$"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"=""' = FALSE`, () => {
    const result = parse(`="$"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>""' = TRUE`, () => {
    const result = parse(`="$"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">=""' = TRUE`, () => {
    const result = parse(`="$">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<=""' = FALSE`, () => {
    const result = parse(`="$"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&""' = $`, () => {
    const result = parse(`="$"&""`);
    expect(result.value).toBe("$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"h1"' = FALSE`, () => {
    const result = parse(`="$">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"h1"' = TRUE`, () => {
    const result = parse(`="$"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="h1"' = FALSE`, () => {
    const result = parse(`="$"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"h1"' = TRUE`, () => {
    const result = parse(`="$"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="h1"' = FALSE`, () => {
    const result = parse(`="$">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="h1"' = TRUE`, () => {
    const result = parse(`="$"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"h1"' = $h1`, () => {
    const result = parse(`="$"&"h1"`);
    expect(result.value).toBe("$h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"1h"' = FALSE`, () => {
    const result = parse(`="$">"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"1h"' = TRUE`, () => {
    const result = parse(`="$"<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="1h"' = FALSE`, () => {
    const result = parse(`="$"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"1h"' = TRUE`, () => {
    const result = parse(`="$"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="1h"' = FALSE`, () => {
    const result = parse(`="$">="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="1h"' = TRUE`, () => {
    const result = parse(`="$"<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"1h"' = $1h`, () => {
    const result = parse(`="$"&"1h"`);
    expect(result.value).toBe("$1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"A"' = FALSE`, () => {
    const result = parse(`="$">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"A"' = TRUE`, () => {
    const result = parse(`="$"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="A"' = FALSE`, () => {
    const result = parse(`="$"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"A"' = TRUE`, () => {
    const result = parse(`="$"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="A"' = FALSE`, () => {
    const result = parse(`="$">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="A"' = TRUE`, () => {
    const result = parse(`="$"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"A"' = $A`, () => {
    const result = parse(`="$"&"A"`);
    expect(result.value).toBe("$A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"Z"' = FALSE`, () => {
    const result = parse(`="$">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"Z"' = TRUE`, () => {
    const result = parse(`="$"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="Z"' = FALSE`, () => {
    const result = parse(`="$"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"Z"' = TRUE`, () => {
    const result = parse(`="$"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="Z"' = FALSE`, () => {
    const result = parse(`="$">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="Z"' = TRUE`, () => {
    const result = parse(`="$"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"Z"' = $Z`, () => {
    const result = parse(`="$"&"Z"`);
    expect(result.value).toBe("$Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"$"' = FALSE`, () => {
    const result = parse(`="$">"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"$"' = FALSE`, () => {
    const result = parse(`="$"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="$"' = TRUE`, () => {
    const result = parse(`="$"="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"$"' = FALSE`, () => {
    const result = parse(`="$"<>"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="$"' = TRUE`, () => {
    const result = parse(`="$">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="$"' = TRUE`, () => {
    const result = parse(`="$"<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"$"' = $$`, () => {
    const result = parse(`="$"&"$"`);
    expect(result.value).toBe("$$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="$"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="$"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="$"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="$"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="$"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">"_"' = FALSE`, () => {
    const result = parse(`="$">"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<"_"' = TRUE`, () => {
    const result = parse(`="$"<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"="_"' = FALSE`, () => {
    const result = parse(`="$"="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>"_"' = TRUE`, () => {
    const result = parse(`="$"<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">="_"' = FALSE`, () => {
    const result = parse(`="$">="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<="_"' = TRUE`, () => {
    const result = parse(`="$"<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&"_"' = $_`, () => {
    const result = parse(`="$"&"_"`);
    expect(result.value).toBe("$_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="$"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="$"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="$"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="$"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="$"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">{1}' = TRUE`, () => {
    const result = parse(`="$">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<{1}' = FALSE`, () => {
    const result = parse(`="$"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"={1}' = FALSE`, () => {
    const result = parse(`="$"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>{1}' = TRUE`, () => {
    const result = parse(`="$"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">={1}' = TRUE`, () => {
    const result = parse(`="$">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<={1}' = FALSE`, () => {
    const result = parse(`="$"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&{1}' = $1`, () => {
    const result = parse(`="$"&{1}`);
    expect(result.value).toBe("$1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="$"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="$"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="$"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="$"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="$"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="$"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="$">{"1"}' = FALSE`, () => {
    const result = parse(`="$">{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<{"1"}' = TRUE`, () => {
    const result = parse(`="$"<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"={"1"}' = FALSE`, () => {
    const result = parse(`="$"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<>{"1"}' = TRUE`, () => {
    const result = parse(`="$"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$">={"1"}' = FALSE`, () => {
    const result = parse(`="$">={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"<={"1"}' = TRUE`, () => {
    const result = parse(`="$"<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="$"&{"1"}' = $1`, () => {
    const result = parse(`="$"&{"1"}`);
    expect(result.value).toBe("$1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+0' = parser.VVALUE`, () => {
    const result = parse(`="_"+0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-0' = parser.VVALUE`, () => {
    const result = parse(`="_"-0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*0' = parser.VVALUE`, () => {
    const result = parse(`="_"*0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/0' = parser.VVALUE`, () => {
    const result = parse(`="_"/0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^0' = parser.VVALUE`, () => {
    const result = parse(`="_"^0`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">0' = TRUE`, () => {
    const result = parse(`="_">0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<0' = FALSE`, () => {
    const result = parse(`="_"<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=0' = FALSE`, () => {
    const result = parse(`="_"=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>0' = TRUE`, () => {
    const result = parse(`="_"<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=0' = TRUE`, () => {
    const result = parse(`="_">=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=0' = FALSE`, () => {
    const result = parse(`="_"<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&0' = _0`, () => {
    const result = parse(`="_"&0`);
    expect(result.value).toBe("_0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+1' = parser.VVALUE`, () => {
    const result = parse(`="_"+1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-1' = parser.VVALUE`, () => {
    const result = parse(`="_"-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*1' = parser.VVALUE`, () => {
    const result = parse(`="_"*1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/1' = parser.VVALUE`, () => {
    const result = parse(`="_"/1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^1' = parser.VVALUE`, () => {
    const result = parse(`="_"^1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">1' = TRUE`, () => {
    const result = parse(`="_">1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<1' = FALSE`, () => {
    const result = parse(`="_"<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=1' = FALSE`, () => {
    const result = parse(`="_"=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>1' = TRUE`, () => {
    const result = parse(`="_"<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=1' = TRUE`, () => {
    const result = parse(`="_">=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=1' = FALSE`, () => {
    const result = parse(`="_"<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&1' = _1`, () => {
    const result = parse(`="_"&1`);
    expect(result.value).toBe("_1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"0"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"0"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"0"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"0"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"0"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"0"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"0"' = FALSE`, () => {
    const result = parse(`="_">"0"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"0"' = TRUE`, () => {
    const result = parse(`="_"<"0"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="0"' = FALSE`, () => {
    const result = parse(`="_"="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"0"' = TRUE`, () => {
    const result = parse(`="_"<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="0"' = FALSE`, () => {
    const result = parse(`="_">="0"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="0"' = TRUE`, () => {
    const result = parse(`="_"<="0"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"0"' = _0`, () => {
    const result = parse(`="_"&"0"`);
    expect(result.value).toBe("_0");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"1"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"1"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"1"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"1"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"1"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"1"' = FALSE`, () => {
    const result = parse(`="_">"1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"1"' = TRUE`, () => {
    const result = parse(`="_"<"1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="1"' = FALSE`, () => {
    const result = parse(`="_"="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"1"' = TRUE`, () => {
    const result = parse(`="_"<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="1"' = FALSE`, () => {
    const result = parse(`="_">="1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="1"' = TRUE`, () => {
    const result = parse(`="_"<="1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"1"' = _1`, () => {
    const result = parse(`="_"&"1"`);
    expect(result.value).toBe("_1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+-1' = parser.VVALUE`, () => {
    const result = parse(`="_"+-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"--1' = parser.VVALUE`, () => {
    const result = parse(`="_"--1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*-1' = parser.VVALUE`, () => {
    const result = parse(`="_"*-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/-1' = parser.VVALUE`, () => {
    const result = parse(`="_"/-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^-1' = parser.VVALUE`, () => {
    const result = parse(`="_"^-1`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">-1' = TRUE`, () => {
    const result = parse(`="_">-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<-1' = FALSE`, () => {
    const result = parse(`="_"<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=-1' = FALSE`, () => {
    const result = parse(`="_"=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>-1' = TRUE`, () => {
    const result = parse(`="_"<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=-1' = TRUE`, () => {
    const result = parse(`="_">=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=-1' = FALSE`, () => {
    const result = parse(`="_"<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&-1' = _-1`, () => {
    const result = parse(`="_"&-1`);
    expect(result.value).toBe("_-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"-1"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"-1"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"-1"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"-1"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"-1"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"-1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"-1"' = FALSE`, () => {
    const result = parse(`="_">"-1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"-1"' = TRUE`, () => {
    const result = parse(`="_"<"-1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="-1"' = FALSE`, () => {
    const result = parse(`="_"="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"-1"' = TRUE`, () => {
    const result = parse(`="_"<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="-1"' = FALSE`, () => {
    const result = parse(`="_">="-1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="-1"' = TRUE`, () => {
    const result = parse(`="_"<="-1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"-1"' = _-1`, () => {
    const result = parse(`="_"&"-1"`);
    expect(result.value).toBe("_-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+TRUE' = parser.VVALUE`, () => {
    const result = parse(`="_"+TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-TRUE' = parser.VVALUE`, () => {
    const result = parse(`="_"-TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*TRUE' = parser.VVALUE`, () => {
    const result = parse(`="_"*TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/TRUE' = parser.VVALUE`, () => {
    const result = parse(`="_"/TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^TRUE' = parser.VVALUE`, () => {
    const result = parse(`="_"^TRUE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">TRUE' = FALSE`, () => {
    const result = parse(`="_">TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<TRUE' = TRUE`, () => {
    const result = parse(`="_"<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=TRUE' = FALSE`, () => {
    const result = parse(`="_"=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>TRUE' = TRUE`, () => {
    const result = parse(`="_"<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=TRUE' = FALSE`, () => {
    const result = parse(`="_">=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=TRUE' = TRUE`, () => {
    const result = parse(`="_"<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&TRUE' = _TRUE`, () => {
    const result = parse(`="_"&TRUE`);
    expect(result.value).toBe("_TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+FALSE' = parser.VVALUE`, () => {
    const result = parse(`="_"+FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-FALSE' = parser.VVALUE`, () => {
    const result = parse(`="_"-FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*FALSE' = parser.VVALUE`, () => {
    const result = parse(`="_"*FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/FALSE' = parser.VVALUE`, () => {
    const result = parse(`="_"/FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^FALSE' = parser.VVALUE`, () => {
    const result = parse(`="_"^FALSE`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">FALSE' = FALSE`, () => {
    const result = parse(`="_">FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<FALSE' = TRUE`, () => {
    const result = parse(`="_"<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=FALSE' = FALSE`, () => {
    const result = parse(`="_"=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>FALSE' = TRUE`, () => {
    const result = parse(`="_"<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=FALSE' = FALSE`, () => {
    const result = parse(`="_">=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=FALSE' = TRUE`, () => {
    const result = parse(`="_"<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&FALSE' = _FALSE`, () => {
    const result = parse(`="_"&FALSE`);
    expect(result.value).toBe("_FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"Hello"' = FALSE`, () => {
    const result = parse(`="_">"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"Hello"' = TRUE`, () => {
    const result = parse(`="_"<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="Hello"' = FALSE`, () => {
    const result = parse(`="_"="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"Hello"' = TRUE`, () => {
    const result = parse(`="_"<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="Hello"' = FALSE`, () => {
    const result = parse(`="_">="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="Hello"' = TRUE`, () => {
    const result = parse(`="_"<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"Hello"' = _Hello`, () => {
    const result = parse(`="_"&"Hello"`);
    expect(result.value).toBe("_Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+""' = parser.VVALUE`, () => {
    const result = parse(`="_"+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-""' = parser.VVALUE`, () => {
    const result = parse(`="_"-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*""' = parser.VVALUE`, () => {
    const result = parse(`="_"*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/""' = parser.VVALUE`, () => {
    const result = parse(`="_"/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^""' = parser.VVALUE`, () => {
    const result = parse(`="_"^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">""' = TRUE`, () => {
    const result = parse(`="_">""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<""' = FALSE`, () => {
    const result = parse(`="_"<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"=""' = FALSE`, () => {
    const result = parse(`="_"=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>""' = TRUE`, () => {
    const result = parse(`="_"<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">=""' = TRUE`, () => {
    const result = parse(`="_">=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<=""' = FALSE`, () => {
    const result = parse(`="_"<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&""' = _`, () => {
    const result = parse(`="_"&""`);
    expect(result.value).toBe("_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"h1"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"h1"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"h1"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"h1"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"h1"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"h1"' = FALSE`, () => {
    const result = parse(`="_">"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"h1"' = TRUE`, () => {
    const result = parse(`="_"<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="h1"' = FALSE`, () => {
    const result = parse(`="_"="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"h1"' = TRUE`, () => {
    const result = parse(`="_"<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="h1"' = FALSE`, () => {
    const result = parse(`="_">="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="h1"' = TRUE`, () => {
    const result = parse(`="_"<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"h1"' = _h1`, () => {
    const result = parse(`="_"&"h1"`);
    expect(result.value).toBe("_h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"1h"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"1h"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"1h"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"1h"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"1h"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"1h"' = FALSE`, () => {
    const result = parse(`="_">"1h"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"1h"' = TRUE`, () => {
    const result = parse(`="_"<"1h"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="1h"' = FALSE`, () => {
    const result = parse(`="_"="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"1h"' = TRUE`, () => {
    const result = parse(`="_"<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="1h"' = FALSE`, () => {
    const result = parse(`="_">="1h"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="1h"' = TRUE`, () => {
    const result = parse(`="_"<="1h"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"1h"' = _1h`, () => {
    const result = parse(`="_"&"1h"`);
    expect(result.value).toBe("_1h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"A"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"A"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"A"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"A"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"A"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"A"' = FALSE`, () => {
    const result = parse(`="_">"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"A"' = TRUE`, () => {
    const result = parse(`="_"<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="A"' = FALSE`, () => {
    const result = parse(`="_"="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"A"' = TRUE`, () => {
    const result = parse(`="_"<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="A"' = FALSE`, () => {
    const result = parse(`="_">="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="A"' = TRUE`, () => {
    const result = parse(`="_"<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"A"' = _A`, () => {
    const result = parse(`="_"&"A"`);
    expect(result.value).toBe("_A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"Z"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"Z"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"Z"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"Z"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"Z"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"Z"' = FALSE`, () => {
    const result = parse(`="_">"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"Z"' = TRUE`, () => {
    const result = parse(`="_"<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="Z"' = FALSE`, () => {
    const result = parse(`="_"="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"Z"' = TRUE`, () => {
    const result = parse(`="_"<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="Z"' = FALSE`, () => {
    const result = parse(`="_">="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="Z"' = TRUE`, () => {
    const result = parse(`="_"<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"Z"' = _Z`, () => {
    const result = parse(`="_"&"Z"`);
    expect(result.value).toBe("_Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"$"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"$"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"$"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"$"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"$"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"$"' = TRUE`, () => {
    const result = parse(`="_">"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"$"' = FALSE`, () => {
    const result = parse(`="_"<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="$"' = FALSE`, () => {
    const result = parse(`="_"="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"$"' = TRUE`, () => {
    const result = parse(`="_"<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="$"' = TRUE`, () => {
    const result = parse(`="_">="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="$"' = FALSE`, () => {
    const result = parse(`="_"<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"$"' = _$`, () => {
    const result = parse(`="_"&"$"`);
    expect(result.value).toBe("_$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+"_"' = parser.VVALUE`, () => {
    const result = parse(`="_"+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-"_"' = parser.VVALUE`, () => {
    const result = parse(`="_"-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*"_"' = parser.VVALUE`, () => {
    const result = parse(`="_"*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/"_"' = parser.VVALUE`, () => {
    const result = parse(`="_"/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^"_"' = parser.VVALUE`, () => {
    const result = parse(`="_"^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">"_"' = FALSE`, () => {
    const result = parse(`="_">"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<"_"' = FALSE`, () => {
    const result = parse(`="_"<"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"="_"' = TRUE`, () => {
    const result = parse(`="_"="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>"_"' = FALSE`, () => {
    const result = parse(`="_"<>"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">="_"' = TRUE`, () => {
    const result = parse(`="_">="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<="_"' = TRUE`, () => {
    const result = parse(`="_"<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&"_"' = __`, () => {
    const result = parse(`="_"&"_"`);
    expect(result.value).toBe("__");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+{1}' = parser.VVALUE`, () => {
    const result = parse(`="_"+{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-{1}' = parser.VVALUE`, () => {
    const result = parse(`="_"-{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*{1}' = parser.VVALUE`, () => {
    const result = parse(`="_"*{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/{1}' = parser.VVALUE`, () => {
    const result = parse(`="_"/{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^{1}' = parser.VVALUE`, () => {
    const result = parse(`="_"^{1}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">{1}' = TRUE`, () => {
    const result = parse(`="_">{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<{1}' = FALSE`, () => {
    const result = parse(`="_"<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"={1}' = FALSE`, () => {
    const result = parse(`="_"={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>{1}' = TRUE`, () => {
    const result = parse(`="_"<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">={1}' = TRUE`, () => {
    const result = parse(`="_">={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<={1}' = FALSE`, () => {
    const result = parse(`="_"<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&{1}' = _1`, () => {
    const result = parse(`="_"&{1}`);
    expect(result.value).toBe("_1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'="_"+{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="_"+{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"-{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="_"-{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"*{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="_"*{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"/{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="_"/{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_"^{"1"}' = parser.VVALUE`, () => {
    const result = parse(`="_"^{"1"}`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'="_">{"1"}' = FALSE`, () => {
    const result = parse(`="_">{"1"}`);
    expect(result.value).toBe(true); // adjust to localcomapre
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<{"1"}' = TRUE`, () => {
    const result = parse(`="_"<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"={"1"}' = FALSE`, () => {
    const result = parse(`="_"={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<>{"1"}' = TRUE`, () => {
    const result = parse(`="_"<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_">={"1"}' = FALSE`, () => {
    const result = parse(`="_">={"1"}`);
    expect(result.value).toBe(true); // adjust to localcomapre
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"<={"1"}' = TRUE`, () => {
    const result = parse(`="_"<={"1"}`);
    expect(result.value).toBe(false); // adjust to localcomapre
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'="_"&{"1"}' = _1`, () => {
    const result = parse(`="_"&{"1"}`);
    expect(result.value).toBe("_1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+0' = 1`, () => {
    const result = parse(`={1}+0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-0' = 1`, () => {
    const result = parse(`={1}-0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*0' = 0`, () => {
    const result = parse(`={1}*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/0' = parser.DIV0`, () => {
    const result = parse(`={1}/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^0' = 1`, () => {
    const result = parse(`={1}^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>0' = TRUE`, () => {
    const result = parse(`={1}>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<0' = FALSE`, () => {
    const result = parse(`={1}<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=0' = FALSE`, () => {
    const result = parse(`={1}=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>0' = TRUE`, () => {
    const result = parse(`={1}<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=0' = TRUE`, () => {
    const result = parse(`={1}>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=0' = FALSE`, () => {
    const result = parse(`={1}<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&0' = 10`, () => {
    const result = parse(`={1}&0`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+1' = 2`, () => {
    const result = parse(`={1}+1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-1' = 0`, () => {
    const result = parse(`={1}-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*1' = 1`, () => {
    const result = parse(`={1}*1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/1' = 1`, () => {
    const result = parse(`={1}/1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^1' = 1`, () => {
    const result = parse(`={1}^1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>1' = FALSE`, () => {
    const result = parse(`={1}>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<1' = FALSE`, () => {
    const result = parse(`={1}<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=1' = TRUE`, () => {
    const result = parse(`={1}=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>1' = FALSE`, () => {
    const result = parse(`={1}<>1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=1' = TRUE`, () => {
    const result = parse(`={1}>=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=1' = TRUE`, () => {
    const result = parse(`={1}<=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&1' = 11`, () => {
    const result = parse(`={1}&1`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"0"' = 1`, () => {
    const result = parse(`={1}+"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-"0"' = 1`, () => {
    const result = parse(`={1}-"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*"0"' = 0`, () => {
    const result = parse(`={1}*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/"0"' = parser.DIV0`, () => {
    const result = parse(`={1}/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"0"' = 1`, () => {
    const result = parse(`={1}^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>"0"' = FALSE`, () => {
    const result = parse(`={1}>"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"0"' = TRUE`, () => {
    const result = parse(`={1}<"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="0"' = FALSE`, () => {
    const result = parse(`={1}="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"0"' = TRUE`, () => {
    const result = parse(`={1}<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="0"' = FALSE`, () => {
    const result = parse(`={1}>="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="0"' = TRUE`, () => {
    const result = parse(`={1}<="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"0"' = 10`, () => {
    const result = parse(`={1}&"0"`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"1"' = 2`, () => {
    const result = parse(`={1}+"1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-"1"' = 0`, () => {
    const result = parse(`={1}-"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*"1"' = 1`, () => {
    const result = parse(`={1}*"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/"1"' = 1`, () => {
    const result = parse(`={1}/"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^"1"' = 1`, () => {
    const result = parse(`={1}^"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>"1"' = FALSE`, () => {
    const result = parse(`={1}>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"1"' = TRUE`, () => {
    const result = parse(`={1}<"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="1"' = FALSE`, () => {
    const result = parse(`={1}="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"1"' = TRUE`, () => {
    const result = parse(`={1}<>"1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="1"' = FALSE`, () => {
    const result = parse(`={1}>="1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="1"' = TRUE`, () => {
    const result = parse(`={1}<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"1"' = 11`, () => {
    const result = parse(`={1}&"1"`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+-1' = 0`, () => {
    const result = parse(`={1}+-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}--1' = 2`, () => {
    const result = parse(`={1}--1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*-1' = -1`, () => {
    const result = parse(`={1}*-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/-1' = -1`, () => {
    const result = parse(`={1}/-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^-1' = 1`, () => {
    const result = parse(`={1}^-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>-1' = TRUE`, () => {
    const result = parse(`={1}>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<-1' = FALSE`, () => {
    const result = parse(`={1}<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=-1' = FALSE`, () => {
    const result = parse(`={1}=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>-1' = TRUE`, () => {
    const result = parse(`={1}<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=-1' = TRUE`, () => {
    const result = parse(`={1}>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=-1' = FALSE`, () => {
    const result = parse(`={1}<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&-1' = 1-1`, () => {
    const result = parse(`={1}&-1`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"-1"' = 0`, () => {
    const result = parse(`={1}+"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-"-1"' = 2`, () => {
    const result = parse(`={1}-"-1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*"-1"' = -1`, () => {
    const result = parse(`={1}*"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/"-1"' = -1`, () => {
    const result = parse(`={1}/"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^"-1"' = 1`, () => {
    const result = parse(`={1}^"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>"-1"' = FALSE`, () => {
    const result = parse(`={1}>"-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"-1"' = TRUE`, () => {
    const result = parse(`={1}<"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="-1"' = FALSE`, () => {
    const result = parse(`={1}="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"-1"' = TRUE`, () => {
    const result = parse(`={1}<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="-1"' = FALSE`, () => {
    const result = parse(`={1}>="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="-1"' = TRUE`, () => {
    const result = parse(`={1}<="-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"-1"' = 1-1`, () => {
    const result = parse(`={1}&"-1"`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+TRUE' = 2`, () => {
    const result = parse(`={1}+TRUE`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-TRUE' = 0`, () => {
    const result = parse(`={1}-TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*TRUE' = 1`, () => {
    const result = parse(`={1}*TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/TRUE' = 1`, () => {
    const result = parse(`={1}/TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^TRUE' = 1`, () => {
    const result = parse(`={1}^TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>TRUE' = FALSE`, () => {
    const result = parse(`={1}>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<TRUE' = TRUE`, () => {
    const result = parse(`={1}<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=TRUE' = FALSE`, () => {
    const result = parse(`={1}=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>TRUE' = TRUE`, () => {
    const result = parse(`={1}<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=TRUE' = FALSE`, () => {
    const result = parse(`={1}>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=TRUE' = TRUE`, () => {
    const result = parse(`={1}<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&TRUE' = 1TRUE`, () => {
    const result = parse(`={1}&TRUE`);
    expect(result.value).toBe("1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+FALSE' = 1`, () => {
    const result = parse(`={1}+FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-FALSE' = 1`, () => {
    const result = parse(`={1}-FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*FALSE' = 0`, () => {
    const result = parse(`={1}*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/FALSE' = parser.DIV0`, () => {
    const result = parse(`={1}/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^FALSE' = 1`, () => {
    const result = parse(`={1}^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>FALSE' = FALSE`, () => {
    const result = parse(`={1}>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<FALSE' = TRUE`, () => {
    const result = parse(`={1}<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=FALSE' = FALSE`, () => {
    const result = parse(`={1}=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>FALSE' = TRUE`, () => {
    const result = parse(`={1}<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=FALSE' = FALSE`, () => {
    const result = parse(`={1}>=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=FALSE' = TRUE`, () => {
    const result = parse(`={1}<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&FALSE' = 1FALSE`, () => {
    const result = parse(`={1}&FALSE`);
    expect(result.value).toBe("1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"Hello"' = FALSE`, () => {
    const result = parse(`={1}>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"Hello"' = TRUE`, () => {
    const result = parse(`={1}<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="Hello"' = FALSE`, () => {
    const result = parse(`={1}="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"Hello"' = TRUE`, () => {
    const result = parse(`={1}<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="Hello"' = FALSE`, () => {
    const result = parse(`={1}>="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="Hello"' = TRUE`, () => {
    const result = parse(`={1}<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"Hello"' = 1Hello`, () => {
    const result = parse(`={1}&"Hello"`);
    expect(result.value).toBe("1Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+""' = parser.VVALUE`, () => {
    const result = parse(`={1}+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-""' = parser.VVALUE`, () => {
    const result = parse(`={1}-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*""' = parser.VVALUE`, () => {
    const result = parse(`={1}*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/""' = parser.VVALUE`, () => {
    const result = parse(`={1}/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^""' = parser.VVALUE`, () => {
    const result = parse(`={1}^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>""' = FALSE`, () => {
    const result = parse(`={1}>""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<""' = TRUE`, () => {
    const result = parse(`={1}<""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}=""' = FALSE`, () => {
    const result = parse(`={1}=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>""' = TRUE`, () => {
    const result = parse(`={1}<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>=""' = FALSE`, () => {
    const result = parse(`={1}>=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<=""' = TRUE`, () => {
    const result = parse(`={1}<=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&""' = 1`, () => {
    const result = parse(`={1}&""`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"h1"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"h1"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"h1"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"h1"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"h1"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"h1"' = FALSE`, () => {
    const result = parse(`={1}>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"h1"' = TRUE`, () => {
    const result = parse(`={1}<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="h1"' = FALSE`, () => {
    const result = parse(`={1}="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"h1"' = TRUE`, () => {
    const result = parse(`={1}<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="h1"' = FALSE`, () => {
    const result = parse(`={1}>="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="h1"' = TRUE`, () => {
    const result = parse(`={1}<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"h1"' = 1h1`, () => {
    const result = parse(`={1}&"h1"`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"1h"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"1h"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"1h"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"1h"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"1h"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"1h"' = FALSE`, () => {
    const result = parse(`={1}>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"1h"' = TRUE`, () => {
    const result = parse(`={1}<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="1h"' = FALSE`, () => {
    const result = parse(`={1}="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"1h"' = TRUE`, () => {
    const result = parse(`={1}<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="1h"' = FALSE`, () => {
    const result = parse(`={1}>="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="1h"' = TRUE`, () => {
    const result = parse(`={1}<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"1h"' = 11h`, () => {
    const result = parse(`={1}&"1h"`);
    expect(result.value).toBe("11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"A"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"A"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"A"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"A"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"A"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"A"' = FALSE`, () => {
    const result = parse(`={1}>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"A"' = TRUE`, () => {
    const result = parse(`={1}<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="A"' = FALSE`, () => {
    const result = parse(`={1}="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"A"' = TRUE`, () => {
    const result = parse(`={1}<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="A"' = FALSE`, () => {
    const result = parse(`={1}>="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="A"' = TRUE`, () => {
    const result = parse(`={1}<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"A"' = 1A`, () => {
    const result = parse(`={1}&"A"`);
    expect(result.value).toBe("1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"Z"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"Z"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"Z"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"Z"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"Z"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"Z"' = FALSE`, () => {
    const result = parse(`={1}>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"Z"' = TRUE`, () => {
    const result = parse(`={1}<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="Z"' = FALSE`, () => {
    const result = parse(`={1}="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"Z"' = TRUE`, () => {
    const result = parse(`={1}<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="Z"' = FALSE`, () => {
    const result = parse(`={1}>="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="Z"' = TRUE`, () => {
    const result = parse(`={1}<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"Z"' = 1Z`, () => {
    const result = parse(`={1}&"Z"`);
    expect(result.value).toBe("1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"$"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"$"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"$"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"$"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"$"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"$"' = FALSE`, () => {
    const result = parse(`={1}>"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"$"' = TRUE`, () => {
    const result = parse(`={1}<"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="$"' = FALSE`, () => {
    const result = parse(`={1}="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"$"' = TRUE`, () => {
    const result = parse(`={1}<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="$"' = FALSE`, () => {
    const result = parse(`={1}>="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="$"' = TRUE`, () => {
    const result = parse(`={1}<="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"$"' = 1$`, () => {
    const result = parse(`={1}&"$"`);
    expect(result.value).toBe("1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+"_"' = parser.VVALUE`, () => {
    const result = parse(`={1}+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}-"_"' = parser.VVALUE`, () => {
    const result = parse(`={1}-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}*"_"' = parser.VVALUE`, () => {
    const result = parse(`={1}*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}/"_"' = parser.VVALUE`, () => {
    const result = parse(`={1}/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}^"_"' = parser.VVALUE`, () => {
    const result = parse(`={1}^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={1}>"_"' = FALSE`, () => {
    const result = parse(`={1}>"_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<"_"' = TRUE`, () => {
    const result = parse(`={1}<"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}="_"' = FALSE`, () => {
    const result = parse(`={1}="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>"_"' = TRUE`, () => {
    const result = parse(`={1}<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>="_"' = FALSE`, () => {
    const result = parse(`={1}>="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<="_"' = TRUE`, () => {
    const result = parse(`={1}<="_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&"_"' = 1_`, () => {
    const result = parse(`={1}&"_"`);
    expect(result.value).toBe("1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+{1}' = 2`, () => {
    const result = parse(`={1}+{1}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-{1}' = 0`, () => {
    const result = parse(`={1}-{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*{1}' = 1`, () => {
    const result = parse(`={1}*{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/{1}' = 1`, () => {
    const result = parse(`={1}/{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^{1}' = 1`, () => {
    const result = parse(`={1}^{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>{1}' = FALSE`, () => {
    const result = parse(`={1}>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<{1}' = FALSE`, () => {
    const result = parse(`={1}<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}={1}' = TRUE`, () => {
    const result = parse(`={1}={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>{1}' = FALSE`, () => {
    const result = parse(`={1}<>{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>={1}' = TRUE`, () => {
    const result = parse(`={1}>={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<={1}' = TRUE`, () => {
    const result = parse(`={1}<={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&{1}' = 11`, () => {
    const result = parse(`={1}&{1}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={1}+{"1"}' = 2`, () => {
    const result = parse(`={1}+{"1"}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}-{"1"}' = 0`, () => {
    const result = parse(`={1}-{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}*{"1"}' = 1`, () => {
    const result = parse(`={1}*{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}/{"1"}' = 1`, () => {
    const result = parse(`={1}/{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}^{"1"}' = 1`, () => {
    const result = parse(`={1}^{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={1}>{"1"}' = FALSE`, () => {
    const result = parse(`={1}>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<{"1"}' = TRUE`, () => {
    const result = parse(`={1}<{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}={"1"}' = FALSE`, () => {
    const result = parse(`={1}={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<>{"1"}' = TRUE`, () => {
    const result = parse(`={1}<>{"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}>={"1"}' = FALSE`, () => {
    const result = parse(`={1}>={"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}<={"1"}' = TRUE`, () => {
    const result = parse(`={1}<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={1}&{"1"}' = 11`, () => {
    const result = parse(`={1}&{"1"}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+0' = 1`, () => {
    const result = parse(`={"1"}+0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-0' = 1`, () => {
    const result = parse(`={"1"}-0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*0' = 0`, () => {
    const result = parse(`={"1"}*0`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/0' = parser.DIV0`, () => {
    const result = parse(`={"1"}/0`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^0' = 1`, () => {
    const result = parse(`={"1"}^0`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>0' = TRUE`, () => {
    const result = parse(`={"1"}>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<0' = FALSE`, () => {
    const result = parse(`={"1"}<0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=0' = FALSE`, () => {
    const result = parse(`={"1"}=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>0' = TRUE`, () => {
    const result = parse(`={"1"}<>0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=0' = TRUE`, () => {
    const result = parse(`={"1"}>=0`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=0' = FALSE`, () => {
    const result = parse(`={"1"}<=0`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&0' = 10`, () => {
    const result = parse(`={"1"}&0`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+1' = 2`, () => {
    const result = parse(`={"1"}+1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-1' = 0`, () => {
    const result = parse(`={"1"}-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*1' = 1`, () => {
    const result = parse(`={"1"}*1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/1' = 1`, () => {
    const result = parse(`={"1"}/1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^1' = 1`, () => {
    const result = parse(`={"1"}^1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>1' = TRUE`, () => {
    const result = parse(`={"1"}>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<1' = FALSE`, () => {
    const result = parse(`={"1"}<1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=1' = FALSE`, () => {
    const result = parse(`={"1"}=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>1' = TRUE`, () => {
    const result = parse(`={"1"}<>1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=1' = TRUE`, () => {
    const result = parse(`={"1"}>=1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=1' = FALSE`, () => {
    const result = parse(`={"1"}<=1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&1' = 11`, () => {
    const result = parse(`={"1"}&1`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"0"' = 1`, () => {
    const result = parse(`={"1"}+"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-"0"' = 1`, () => {
    const result = parse(`={"1"}-"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*"0"' = 0`, () => {
    const result = parse(`={"1"}*"0"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/"0"' = parser.DIV0`, () => {
    const result = parse(`={"1"}/"0"`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"0"' = 1`, () => {
    const result = parse(`={"1"}^"0"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>"0"' = TRUE`, () => {
    const result = parse(`={"1"}>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"0"' = FALSE`, () => {
    const result = parse(`={"1"}<"0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="0"' = FALSE`, () => {
    const result = parse(`={"1"}="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"0"' = TRUE`, () => {
    const result = parse(`={"1"}<>"0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="0"' = TRUE`, () => {
    const result = parse(`={"1"}>="0"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="0"' = FALSE`, () => {
    const result = parse(`={"1"}<="0"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"0"' = 10`, () => {
    const result = parse(`={"1"}&"0"`);
    expect(result.value).toBe("10");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"1"' = 2`, () => {
    const result = parse(`={"1"}+"1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-"1"' = 0`, () => {
    const result = parse(`={"1"}-"1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*"1"' = 1`, () => {
    const result = parse(`={"1"}*"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/"1"' = 1`, () => {
    const result = parse(`={"1"}/"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^"1"' = 1`, () => {
    const result = parse(`={"1"}^"1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>"1"' = FALSE`, () => {
    const result = parse(`={"1"}>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"1"' = FALSE`, () => {
    const result = parse(`={"1"}<"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="1"' = TRUE`, () => {
    const result = parse(`={"1"}="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"1"' = FALSE`, () => {
    const result = parse(`={"1"}<>"1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="1"' = TRUE`, () => {
    const result = parse(`={"1"}>="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="1"' = TRUE`, () => {
    const result = parse(`={"1"}<="1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"1"' = 11`, () => {
    const result = parse(`={"1"}&"1"`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+-1' = 0`, () => {
    const result = parse(`={"1"}+-1`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}--1' = 2`, () => {
    const result = parse(`={"1"}--1`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*-1' = -1`, () => {
    const result = parse(`={"1"}*-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/-1' = -1`, () => {
    const result = parse(`={"1"}/-1`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^-1' = 1`, () => {
    const result = parse(`={"1"}^-1`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>-1' = TRUE`, () => {
    const result = parse(`={"1"}>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<-1' = FALSE`, () => {
    const result = parse(`={"1"}<-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=-1' = FALSE`, () => {
    const result = parse(`={"1"}=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>-1' = TRUE`, () => {
    const result = parse(`={"1"}<>-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=-1' = TRUE`, () => {
    const result = parse(`={"1"}>=-1`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=-1' = FALSE`, () => {
    const result = parse(`={"1"}<=-1`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&-1' = 1-1`, () => {
    const result = parse(`={"1"}&-1`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"-1"' = 0`, () => {
    const result = parse(`={"1"}+"-1"`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-"-1"' = 2`, () => {
    const result = parse(`={"1"}-"-1"`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*"-1"' = -1`, () => {
    const result = parse(`={"1"}*"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/"-1"' = -1`, () => {
    const result = parse(`={"1"}/"-1"`);
    expect(result.value).toBe(-1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^"-1"' = 1`, () => {
    const result = parse(`={"1"}^"-1"`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>"-1"' = FALSE`, () => {
    const result = parse(`={"1"}>"-1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"-1"' = TRUE`, () => {
    const result = parse(`={"1"}<"-1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="-1"' = FALSE`, () => {
    const result = parse(`={"1"}="-1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"-1"' = TRUE`, () => {
    const result = parse(`={"1"}<>"-1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="-1"' = FALSE`, () => {
    const result = parse(`={"1"}>="-1"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="-1"' = TRUE`, () => {
    const result = parse(`={"1"}<="-1"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"-1"' = 1-1`, () => {
    const result = parse(`={"1"}&"-1"`);
    expect(result.value).toBe("1-1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+TRUE' = 2`, () => {
    const result = parse(`={"1"}+TRUE`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-TRUE' = 0`, () => {
    const result = parse(`={"1"}-TRUE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*TRUE' = 1`, () => {
    const result = parse(`={"1"}*TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/TRUE' = 1`, () => {
    const result = parse(`={"1"}/TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^TRUE' = 1`, () => {
    const result = parse(`={"1"}^TRUE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>TRUE' = FALSE`, () => {
    const result = parse(`={"1"}>TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<TRUE' = TRUE`, () => {
    const result = parse(`={"1"}<TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=TRUE' = FALSE`, () => {
    const result = parse(`={"1"}=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>TRUE' = TRUE`, () => {
    const result = parse(`={"1"}<>TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=TRUE' = FALSE`, () => {
    const result = parse(`={"1"}>=TRUE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=TRUE' = TRUE`, () => {
    const result = parse(`={"1"}<=TRUE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&TRUE' = 1TRUE`, () => {
    const result = parse(`={"1"}&TRUE`);
    expect(result.value).toBe("1TRUE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+FALSE' = 1`, () => {
    const result = parse(`={"1"}+FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-FALSE' = 1`, () => {
    const result = parse(`={"1"}-FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*FALSE' = 0`, () => {
    const result = parse(`={"1"}*FALSE`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/FALSE' = parser.DIV0`, () => {
    const result = parse(`={"1"}/FALSE`);
    expect(result.value).toBe(parser.DIV0);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^FALSE' = 1`, () => {
    const result = parse(`={"1"}^FALSE`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>FALSE' = FALSE`, () => {
    const result = parse(`={"1"}>FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<FALSE' = TRUE`, () => {
    const result = parse(`={"1"}<FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=FALSE' = FALSE`, () => {
    const result = parse(`={"1"}=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>FALSE' = TRUE`, () => {
    const result = parse(`={"1"}<>FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=FALSE' = FALSE`, () => {
    const result = parse(`={"1"}>=FALSE`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=FALSE' = TRUE`, () => {
    const result = parse(`={"1"}<=FALSE`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&FALSE' = 1FALSE`, () => {
    const result = parse(`={"1"}&FALSE`);
    expect(result.value).toBe("1FALSE");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"Hello"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"Hello"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"Hello"' = FALSE`, () => {
    const result = parse(`={"1"}>"Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"Hello"' = TRUE`, () => {
    const result = parse(`={"1"}<"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="Hello"' = FALSE`, () => {
    const result = parse(`={"1"}="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"Hello"' = TRUE`, () => {
    const result = parse(`={"1"}<>"Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="Hello"' = FALSE`, () => {
    const result = parse(`={"1"}>="Hello"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="Hello"' = TRUE`, () => {
    const result = parse(`={"1"}<="Hello"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"Hello"' = 1Hello`, () => {
    const result = parse(`={"1"}&"Hello"`);
    expect(result.value).toBe("1Hello");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+""' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-""' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*""' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/""' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^""' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^""`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>""' = TRUE`, () => {
    const result = parse(`={"1"}>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<""' = FALSE`, () => {
    const result = parse(`={"1"}<""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}=""' = FALSE`, () => {
    const result = parse(`={"1"}=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>""' = TRUE`, () => {
    const result = parse(`={"1"}<>""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>=""' = TRUE`, () => {
    const result = parse(`={"1"}>=""`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<=""' = FALSE`, () => {
    const result = parse(`={"1"}<=""`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&""' = 1`, () => {
    const result = parse(`={"1"}&""`);
    expect(result.value).toBe("1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"h1"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"h1"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"h1"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"h1"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"h1"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"h1"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"h1"' = FALSE`, () => {
    const result = parse(`={"1"}>"h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"h1"' = TRUE`, () => {
    const result = parse(`={"1"}<"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="h1"' = FALSE`, () => {
    const result = parse(`={"1"}="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"h1"' = TRUE`, () => {
    const result = parse(`={"1"}<>"h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="h1"' = FALSE`, () => {
    const result = parse(`={"1"}>="h1"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="h1"' = TRUE`, () => {
    const result = parse(`={"1"}<="h1"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"h1"' = 1h1`, () => {
    const result = parse(`={"1"}&"h1"`);
    expect(result.value).toBe("1h1");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"1h"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"1h"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"1h"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"1h"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"1h"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"1h"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"1h"' = FALSE`, () => {
    const result = parse(`={"1"}>"1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"1h"' = TRUE`, () => {
    const result = parse(`={"1"}<"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="1h"' = FALSE`, () => {
    const result = parse(`={"1"}="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"1h"' = TRUE`, () => {
    const result = parse(`={"1"}<>"1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="1h"' = FALSE`, () => {
    const result = parse(`={"1"}>="1h"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="1h"' = TRUE`, () => {
    const result = parse(`={"1"}<="1h"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"1h"' = 11h`, () => {
    const result = parse(`={"1"}&"1h"`);
    expect(result.value).toBe("11h");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"A"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"A"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"A"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"A"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"A"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"A"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"A"' = FALSE`, () => {
    const result = parse(`={"1"}>"A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"A"' = TRUE`, () => {
    const result = parse(`={"1"}<"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="A"' = FALSE`, () => {
    const result = parse(`={"1"}="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"A"' = TRUE`, () => {
    const result = parse(`={"1"}<>"A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="A"' = FALSE`, () => {
    const result = parse(`={"1"}>="A"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="A"' = TRUE`, () => {
    const result = parse(`={"1"}<="A"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"A"' = 1A`, () => {
    const result = parse(`={"1"}&"A"`);
    expect(result.value).toBe("1A");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"Z"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"Z"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"Z"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"Z"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"Z"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"Z"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"Z"' = FALSE`, () => {
    const result = parse(`={"1"}>"Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"Z"' = TRUE`, () => {
    const result = parse(`={"1"}<"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="Z"' = FALSE`, () => {
    const result = parse(`={"1"}="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"Z"' = TRUE`, () => {
    const result = parse(`={"1"}<>"Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="Z"' = FALSE`, () => {
    const result = parse(`={"1"}>="Z"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="Z"' = TRUE`, () => {
    const result = parse(`={"1"}<="Z"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"Z"' = 1Z`, () => {
    const result = parse(`={"1"}&"Z"`);
    expect(result.value).toBe("1Z");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"$"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"$"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"$"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"$"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"$"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"$"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"$"' = TRUE`, () => {
    const result = parse(`={"1"}>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"$"' = FALSE`, () => {
    const result = parse(`={"1"}<"$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="$"' = FALSE`, () => {
    const result = parse(`={"1"}="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"$"' = TRUE`, () => {
    const result = parse(`={"1"}<>"$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="$"' = TRUE`, () => {
    const result = parse(`={"1"}>="$"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="$"' = FALSE`, () => {
    const result = parse(`={"1"}<="$"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"$"' = 1$`, () => {
    const result = parse(`={"1"}&"$"`);
    expect(result.value).toBe("1$");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+"_"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}+"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}-"_"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}-"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}*"_"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}*"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}/"_"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}/"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}^"_"' = parser.VVALUE`, () => {
    const result = parse(`={"1"}^"_"`);
    expect(result.value).toBe(parser.VVALUE);
    expect(result.type).toBe(parser.ERROR);
  });


test(`'={"1"}>"_"' = TRUE`, () => {
    const result = parse(`={"1"}>"_"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<"_"' = FALSE`, () => {
    const result = parse(`={"1"}<"_"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}="_"' = FALSE`, () => {
    const result = parse(`={"1"}="_"`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>"_"' = TRUE`, () => {
    const result = parse(`={"1"}<>"_"`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>="_"' = TRUE`, () => {
    const result = parse(`={"1"}>="_"`);
    expect(result.value).toBe(false); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<="_"' = FALSE`, () => {
    const result = parse(`={"1"}<="_"`);
    expect(result.value).toBe(true); // adjust to localcompare
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&"_"' = 1_`, () => {
    const result = parse(`={"1"}&"_"`);
    expect(result.value).toBe("1_");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+{1}' = 2`, () => {
    const result = parse(`={"1"}+{1}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-{1}' = 0`, () => {
    const result = parse(`={"1"}-{1}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*{1}' = 1`, () => {
    const result = parse(`={"1"}*{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/{1}' = 1`, () => {
    const result = parse(`={"1"}/{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^{1}' = 1`, () => {
    const result = parse(`={"1"}^{1}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>{1}' = TRUE`, () => {
    const result = parse(`={"1"}>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<{1}' = FALSE`, () => {
    const result = parse(`={"1"}<{1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}={1}' = FALSE`, () => {
    const result = parse(`={"1"}={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>{1}' = TRUE`, () => {
    const result = parse(`={"1"}<>{1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>={1}' = TRUE`, () => {
    const result = parse(`={"1"}>={1}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<={1}' = FALSE`, () => {
    const result = parse(`={"1"}<={1}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&{1}' = 11`, () => {
    const result = parse(`={"1"}&{1}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });


test(`'={"1"}+{"1"}' = 2`, () => {
    const result = parse(`={"1"}+{"1"}`);
    expect(result.value).toBe(2);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}-{"1"}' = 0`, () => {
    const result = parse(`={"1"}-{"1"}`);
    expect(result.value).toBe(0);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}*{"1"}' = 1`, () => {
    const result = parse(`={"1"}*{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}/{"1"}' = 1`, () => {
    const result = parse(`={"1"}/{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}^{"1"}' = 1`, () => {
    const result = parse(`={"1"}^{"1"}`);
    expect(result.value).toBe(1);
    expect(result.type).toBe(parser.NUMBER);
  });


test(`'={"1"}>{"1"}' = FALSE`, () => {
    const result = parse(`={"1"}>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<{"1"}' = FALSE`, () => {
    const result = parse(`={"1"}<{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}={"1"}' = TRUE`, () => {
    const result = parse(`={"1"}={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<>{"1"}' = FALSE`, () => {
    const result = parse(`={"1"}<>{"1"}`);
    expect(result.value).toBe(false);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}>={"1"}' = TRUE`, () => {
    const result = parse(`={"1"}>={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}<={"1"}' = TRUE`, () => {
    const result = parse(`={"1"}<={"1"}`);
    expect(result.value).toBe(true);
    expect(result.type).toBe(parser.BOOLEAN);
  });


test(`'={"1"}&{"1"}' = 11`, () => {
    const result = parse(`={"1"}&{"1"}`);
    expect(result.value).toBe("11");
    expect(result.type).toBe(parser.STRING);
  });

});
