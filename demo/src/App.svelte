<script>
	import Cell from './Cell.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { Cell as AbstractCell, globalTable } from "../../util.js";

	//const tableSize = { width: 26, height: 100 };
	const tableSize = { width: 10, height: 10 };

	const makeTab = id => Symbol(`tab_${id}`);
	export let items = [{ value: makeTab(1), label: "Tab1" }, { value: makeTab(2), label: "Tab2" }];

	// initialize all cells with ""
	for(const { label } of items) {
		for(let w = 0; w < tableSize.width; w++) {
			for(let h = 0; h < tableSize.height; h++) {
				new AbstractCell({ row: h, col: w, sheet: label, allowUnsafe: true });
			}
		}
	}
	
	export let activeTabValue;

	onMount(() => {
		// Set default tab value
		if (Array.isArray(items) && items.length && items[0].value) {
		activeTabValue = items[0].value;
		}
	});
	const handleClick = tabValue => () => (activeTabValue = tabValue);

</script>

<main>
	<h1>Table demo</h1>
	<ul class="tabs">
	{#each items as item}
		<li class={activeTabValue === item.value ? 'active' : ''}>
			<span on:click={handleClick(item.value)}>{item.label}</span>
		</li>
	{/each}
	</ul>
	<table>
		<thead>
			<tr>
				<th></th>
				{#each { length: tableSize.width } as _, a}
					<th>{String.fromCharCode(a+65)}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each { length: tableSize.height } as _, b}
				<tr>
					<th>{b+1}</th>
					{#each { length: tableSize.width } as _, a}
						<td>
							<Cell col={a} row={b} sheet={items.find(({ value }) => value === activeTabValue) && items.find(({ value }) => value === activeTabValue).label} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	table {
		border-spacing: 0px;
	}
	table th, table td {
		padding: 0;
		margin: 0;
		width: 100%;
		border: 0.5px solid gray;
		height: 33px;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	ul.tabs {
		display: flex;
		flex-wrap: wrap;
		padding-left: 0;
		margin-bottom: 0;
		list-style: none;
		border-bottom: 1px solid #dee2e6;
	}

	.tabs span {
		border: 1px solid transparent;
		border-top-left-radius: 0.25rem;
		border-top-right-radius: 0.25rem;
		display: block;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.tabs span:hover {
		border-color: #e9ecef #e9ecef #dee2e6;
	}

	.tabs li.active > span {
		color: #495057;
		background-color: #fff;
		border-color: #dee2e6 #dee2e6 #fff;
	}
</style>