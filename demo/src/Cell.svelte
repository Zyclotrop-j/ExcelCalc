<script>
	import { onDestroy } from 'svelte';
    import { Cell } from "../../util.js";

    export let col;
    export let row;
    export let sheet;
    export let workbook;

    let cell;
    const onCellUpdate = (__, c) => {
        cell = c;
    };

    cell = new Cell({ row, col, sheet, workbook, allowUnsafe: true });
    let cellUnSubscription = cell.subscribe(onCellUpdate);

    let displayValue = ""
    $: {
        console.log("cell", cell)
        if((cell.row !== row && row !== undefined) || (cell.col !== col && col !== undefined) || (cell.sheet !== sheet && col !== undefined) || (cell.workbook !== workbook && workbook !== undefined)) {
            cellUnSubscription();
            cell = new Cell({ row, col, sheet, workbook, allowUnsafe: true });
            cellUnSubscription = cell.subscribe(onCellUpdate);
            displayValue = typeof cell.value.value === 'symbol' ? cell.value.value.toString() : cell.value.value;
        }
    }
    $: {
        displayValue = typeof cell.value.value === 'symbol' ? cell.value.value.toString() : cell.value.value;
    }
    
    onDestroy(cell.destroy);

    
</script>

<div class="cell">
    <input class="formula" data-row={row} data-col={col} value={cell.formula || ""} on:change={cell.update}>
    <input class="value" tabindex='-1' readonly data-row={row} data-col={col} value={displayValue} >
</div>

<style type="text/scss">
    .cell {
        $w: 8rem;
        width: $w;
        > input {
            width: $w;
            margin: 0;
            border: none;
        }
        position: relative;
        & > input.value {
            opacity: 1;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        }
        & > input.formula {
            opacity: 0;
        }
        & > input.formula:focus {
            opacity: 1;
        }
        & > input.formula:focus + input.value {
            opacity: 0;
        }
    }
</style>