<script>
	import Cell from './Cell.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { defaultTableAPI } from "../../util.js";

	//const tableSize = { width: 26, height: 100 };
	const tableSize = { width: 10, height: 4 };

	const makeTab = id => Symbol(`tab_${id}`);
	export let items = [{ value: makeTab(1), label: "Tab1" }, { value: makeTab(2), label: "Tab2" }];
	
	export let activeTabValue = items[0].value;

	onMount(() => {
		// Set default tab value
		if (Array.isArray(items) && items.length && items[0].value) {
			activeTabValue = items[0].value;
		}
	});
	const handleClick = tabValue => () => (activeTabValue = tabValue);

	/* Right-click menu */
	let menudata;
	const toggleMenu = command => {
		const menu = document.querySelector(".menu");
		menu.style.display = command === "show" ? "block" : "none";
	};
	const setPosition = ({ top, left, data }) => {
		const menu = document.querySelector(".menu");
		menu.style.left = `${left}px`;
		menu.style.top = `${top}px`;
		menudata = data;
		toggleMenu('show');
	};
	const hideContextMenu = e => {
		toggleMenu("hide");
	};
	const handleContextMenu = e => {
		const origin = {
			left: e.pageX,
			top: e.pageY,
			data: e.target.dataset
		};
		setPosition(origin);
		return false;
	};

	const addCellsBelow = () => {
		console.log("addCellsBelow", menudata);
		const sheet = items.find(({ value }) => value === activeTabValue) && items.find(({ value }) => value === activeTabValue).label;
		defaultTableAPI.addRowAfter(menudata.row, { sheet });
	};
	const addCellsAbove = () => {
		console.log("addCellsAbove", menudata);
		const sheet = items.find(({ value }) => value === activeTabValue) && items.find(({ value }) => value === activeTabValue).label;
		defaultTableAPI.addRowBefore(menudata.row, { sheet });
		//tableSize.height = tableSize.height+1;
	};
	const deleteCells = () => {
		console.log("deleteCells", menudata);
		//tableSize.height = tableSize.height-1;
	};

    // addColAfter
    // addColBefore

</script>


<svelte:window on:click={hideContextMenu} />

<div class="menu">
  <ul class="menu-options">
    <li on:click={addCellsBelow} class="menu-option">Add below</li>
    <li on:click={addCellsAbove} class="menu-option">Add above</li>
    <li on:click={deleteCells} class="menu-option">Delete</li>
  </ul>
</div>

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
				{#each Array(tableSize.width) as _, a}
					<th data-col="{a}">{String.fromCharCode(a+65)}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each Array(tableSize.height) as _, b}
				<tr>
					<th data-row="{b}" on:contextmenu|preventDefault={handleContextMenu}>{b+1}</th>
					{#each Array(tableSize.width) as _, a}
						<td data-row={b} data-col={a} >
							<Cell col={a} row={b} sheet={items.find(({ value }) => value === activeTabValue) && items.find(({ value }) => value === activeTabValue).label} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</main>

<style type="text/scss">
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

	.menu {
		width: 120px;
		box-shadow: 0 4px 5px 3px rgba(0, 0, 0, 0.2);
		position: absolute;
		display: none;
		z-index: 100;
		background: white;

		.menu-options {
			list-style: none;
			padding: 10px 0;

			.menu-option {
				font-weight: 500;
				font-size: 14px;
				padding: 10px 40px 10px 20px;
				cursor: pointer;

				&:hover {
					background: rgba(0, 0, 0, 0.2);
				}
			}
		}
	}
</style>