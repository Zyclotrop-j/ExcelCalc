<script>
	import Cell from './Cell.svelte';

	const tableSize = { width: 24, height: 100 };
	
</script>

<main>
	<h1>Table demo</h1>
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
							<Cell col={a} row={b} />
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
</style>