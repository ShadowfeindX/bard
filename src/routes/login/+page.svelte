<script lang="ts">
	import Login from './Login.svelte';
	import Register from './Register.svelte';

	let { form } = $props();

	let registering: boolean = $state(false);
	function onRegister(): void {
		registering = !registering;
		console.log('registering.....');
	}
</script>

{#if registering}
	<Register></Register>
{:else}
	<Login {form} register={onRegister}></Login>
{/if}

<!-- <div id="message">
	<h2>Welcome</h2>
	<h1>Firebase Hosting Setup Complete</h1>
	<p>
		You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build
		something extraordinary!
	</p>
	<a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
</div>
<p id="load">Firebase SDK Loading&hellip;</p> -->

<svelte:head>
	<style>
		body {
			background: #eceff1;
			color: rgba(0, 0, 0, 0.87);
			font-family: Roboto, Helvetica, Arial, sans-serif;
			margin: 0;
			padding: 0;
		}
	</style>
</svelte:head>
