<script>
	import { onDestroy } from 'svelte';
    import { defaultTableAPI } from "../../util.js";

    export let col;
    export let row;
    export let sheet;
    export let workbook;

    let value;
    let formula;

    const onCellUpdate = (evt) => {
        value = evt.value.value;
        formula = evt.formula;
    };

    let cellUnSubscription = defaultTableAPI.registerCell([workbook, sheet, col, row], onCellUpdate);
    let onCellChange = (evt) => {
        defaultTableAPI.change([workbook, sheet, col, row], evt)
    };

    onDestroy(cellUnSubscription);

    
</script>

<div class="cell">
    <input class="formula" data-row={row} data-col={col} value={formula || ""} on:change={onCellChange}>
    <input class="value" tabindex='-1' readonly data-row={row} data-col={col} value={value || ""} >
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