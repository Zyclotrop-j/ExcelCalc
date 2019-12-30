# ExcelCalc

A Grammar + collection of functions to parse excel-like expressions.

## Examples

```
parse(`27`)
parse(`Hello`)
parse("=1+2")
parse(`=A1&" foo"`)
parse(`=SUM(1,2,A1:A27)`)
parse(`=VLOOKUP(H2,A1:C100,2)`)
parse(`=VLOOKUP(A1&" foo",A1:C100,SUM(1,2,A1:A27))`)
```

Try it now:
(1) Grap the content of Grammar.peg
(2) Go to https://pegjs.org/online
(3) Paste the Grammar into [1]

More to come...


