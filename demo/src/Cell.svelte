<script>
	import { onDestroy } from 'svelte';
    import { Cell } from "../../util.js";

    export let col;
    export let row;
    let cell = new Cell({ onUpdate: (__, c) => {
        cell = c;
        // cell.table.parser -> has all the constants to customize errors
        const logv = typeof cell.value.value === 'symbol' ? cell.value.value.toString() : cell.value.value;
        console.log(`Cell ${row},${col} updated; ${logv}`, );
    }, row, col, allowUnsafe: true });

    let displayValue = ""
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