<!-- +page.svelte -->

<script>
	import { Player } from '$lib/Profile.svelte';
	let test = $state(Player.toObject());
	let date = test.creation_date.toDate().toJSON().slice(0, -1);
	const blood_types = (() => ['A', 'B', 'AB', 'O'].flatMap((type) => [type + '+', type + '-']))();
	let disabled = $state(true);
	test.blood_type = blood_types[0];
</script>

<form
	id="message"
	method="POST"
	onsubmit={(e) => {
		disabled = false;
	}}
>
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
            <input id={key} name={key} type="text" placeholder={test.is_male ? 'He/Him' : 'She/Her'} bind:value={test[key]} />
		{:else}
			<input id={key} name={key} type="text" placeholder={value} bind:value={test[key]} />
		{/if}
	{/each}
	<input type="submit" id="submit" value="Create Profile" />
</form>

<div id="object_display">
	{'Blood Types: ' + JSON.stringify(blood_types)}
	{JSON.stringify(test)}
</div>

<div id="message">
	<h2>Welcome</h2>
	<h1>Firebase Hosting Setup Complete</h1>
	<p>
		You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build
		something extraordinary!
	</p>
	<a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
</div>
<p id="load">Firebase SDK Loading&hellip;</p>

<style>
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

	:global(body) {
		background: #eceff1;
		color: rgba(0, 0, 0, 0.87);
		font-family: Roboto, Helvetica, Arial, sans-serif;
		margin: 0;
		padding: 0;
	}
	#message {
		background: white;
		max-width: 360px;
		margin: 100px auto 16px;
		padding: 32px 24px;
		border-radius: 3px;
	}
	#message h2 {
		color: #ffa100;
		font-weight: bold;
		font-size: 16px;
		margin: 0 0 8px;
	}
	#message h1 {
		font-size: 22px;
		font-weight: 300;
		color: rgba(0, 0, 0, 0.6);
		margin: 0 0 16px;
	}
	#message p {
		line-height: 140%;
		margin: 16px 0 24px;
		font-size: 14px;
	}
	#message a,
	#message #submit {
		display: block;
		text-align: center;
		background: #039be5;
		text-transform: uppercase;
		text-decoration: none;
		color: white;
		padding: 16px;
		border-radius: 4px;
	}
	#message #submit {
		margin-top: 10px;
		font-size: large;
		/* height: 40px; */
	}
	#message,
	#message a {
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.12),
			0 1px 2px rgba(0, 0, 0, 0.24);
	}
	#load {
		color: rgba(0, 0, 0, 0.4);
		text-align: center;
		font-size: 13px;
	}
	@media (max-width: 600px) {
		:global(body),
		#message {
			margin-top: 0;
			background: white;
			box-shadow: none;
		}
		:global(body) {
			border-top: 16px solid #ffa100;
		}
	}
</style>
