# ExcelCalc

A Grammar + collection of functions to parse excel-like expressions.

## Examples

```
parse(`27`)
parse(`Hello`)
parse("=1+2")
parse(`=A2&" foo"`)
parse(`=SUM(1,2,B1:B2)`)
parse(`=VLOOKUP(A2,{1,2,3;"A","B","C"},2)`)
parse(`=VLOOKUP(A2&" foo",A2:C100,SUM(1,2,A2:A27))`)
```

Try it now:

1. Go to https://pegjs.org/online
2. Paste the content of grammar.peg into field [1] overwriting the default calculator code in there
3. Type an Excel-like formula into [2] and observe the output


## More to come...


