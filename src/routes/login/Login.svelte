<script lang="ts">
	let { register, form} = $props();

	let badge: number = $state(form?.badge);

	console.log(form);
</script>

<main>
	<section>
		<form action="?/login" method="post">
			{#if form?.missing === 'badge'}<p class="error">Badge number is required!</p>{/if}
			{#if form?.missing === 'passcode'}<p class="error">Passcode is required!</p>{/if}
			{#if form?.error} <p class="error">{form.error}</p>{/if}
			<label for="badge">Badge #:</label>
			<input type="number" name="badge" bind:value={badge} />
			<br />
			<label for="passcode">Passcode:</label>
			<input type="password" name="passcode" />
			<br />
			<button type="submit">Login</button>
			<br />
			<a href="/login/forgot">Forgot your badge number?</a>
			<br />
			<a href="/login/forgot">Forgot your passcode?</a>
		</form>
	</section>

	<section>
		<form id="message">
			<h1>Are you a new Agent?</h1>
			<button onclick={register}>Get Your Badge!</button>
		</form>
	</section>
</main>

<style lang="scss">
	main {
		display: flex;
		height: 100vh;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		column-gap: 0px;
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
	}

	#message > button {
		min-height: 50px;
		background-color: rgb(196, 17, 17);
		color: rgb(231, 227, 227);
	}

	.error {
		color: red;
		font-weight: bold;
		max-width: 200px;
	}
</style>
