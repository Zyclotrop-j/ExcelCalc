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

## Try it

Try it now: https://zyclotrop-j.github.io/ExcelCalc/

Try it locally:

1. Download the repo
2. Go to Demo & run 'npm install'
3. Run 'npm run dev'
4. Open your browser at http://localhost:5000/
5. Play with the table


## More to come...


