<script lang="ts">
	import { Player } from '$lib/Profile.svelte';
	let test = $state(Player.toObject());
	let date = test.creation_date.toDate().toJSON().slice(0, -1);
	const blood_types = (() => ['A', 'B', 'AB', 'O'].flatMap((type) => [type + '+', type + '-']))();
	let disabled = $state(true);
	test.blood_type = blood_types[0];
</script>

<form
	id="message"
	action="?/register"
	method="POST"
	onsubmit={(e) => {
		// e.preventDefault();
		disabled = false;
	}}
>
	<label for="badge">Badge #:</label>
	<input name="badge" type="text" bind:value={test.badge_number} {disabled} />
	<label for="creation">Creation Date:</label>
	<input name="creation" type="datetime-local" step=".001" value={date} {disabled} />
	<label for="name">Name:</label>
	<input name="name" type="text" />
	<label for="passcode">Passcode:</label>
	<input name="passcode" type="password" />

	{#each Object.entries(test) as [key, value]}
		<label for={key}>{key + ' : '}</label>
		{#if key === 'badge_number'}
			<input
				id={key}
				name={key}
				type="text"
				placeholder={value}
				bind:value={test.badge_number}
				{disabled}
			/>
		{:else if key === 'creation_date'}
			<input id={key} name={key} type="datetime-local" step=".001" value={date} {disabled} />
		{:else if key === 'blood_type'}
			<select name={key} id={key} bind:value={test[key]}>
				{#each blood_types as type, i}
					<option value={type}>{type}</option>
				{/each}
			</select>
		{:else if typeof value === 'boolean'}
			<input type="checkbox" name={key} id={key} value={true} bind:checked={test[key]} />
		{:else if key === 'eye_color_right'}
			{#if test.heterochromia}
				<input
					id={key}
					name={key}
					type="text"
					placeholder={test.eye_color_left}
					bind:value={test.eye_color_right}
				/>
			{:else}
				<input id={key} name={key} type="text" bind:value={test.eye_color_left} {disabled} />
			{/if}
		{:else if key === 'pronouns'}
			<input
				id={key}
				name={key}
				type="text"
				placeholder={test.is_male ? 'He/Him' : 'She/Her'}
				bind:value={test[key]}
			/>
		{:else}
			<input id={key} name={key} type="text" placeholder={value} bind:value={test[key]} />
		{/if}
	{/each}
	<input type="submit" id="submit" value="Create Profile" />
</form>

<!-- <div id="object_display">
	{'Blood Types: ' + JSON.stringify(blood_types)}
	{JSON.stringify(test)}
</div> -->

<style lang="scss">
	#object_display {
		word-wrap: break-word;
		max-width: 400px;
		margin: auto;
	}

	form {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		margin: 20px auto;
		padding: 10px;
		border: 1px black solid;
		align-items: left;
		max-width: fit-content;

		label {
			margin-bottom: 5px;
			/* display: flex; */
			/* flex-direction: row; */
			/* align-items: flex-end; */
			/* justify-content: flex-end; */
			/* width: 400px; */
			/* line-height: 26px; */
			/* margin-bottom: 10px; */
			/* white-space: pre; */
		}

		input {
			margin-bottom: 10px;
			/* height: 20px; */
			/* flex: 0 0 200px; */
			/* margin-left: 10px; */
		}
	}
</style>
