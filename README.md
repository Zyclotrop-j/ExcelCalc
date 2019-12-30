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

1. Go to https://pegjs.org/online
2. Paste the content of grammar.peg into field [1] overwriting the default calculator code in there
3. Type an Excel-like formula into [2] and observe the output


## More to come...


