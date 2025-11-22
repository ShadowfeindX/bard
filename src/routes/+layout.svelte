<script lang="ts">
	import { auth } from '$lib/client/firebase.js';
	import { newUser, type User } from '$lib/Profile.svelte.js';
	import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

	// let user = $state(auth.currentUser);
	// onAuthStateChanged(auth, aUser => {
	// 	if (aUser) {
	// 		user = aUser;
	// 	} else {
	// 		// signed out
	// 	}
	// });

	let { children, data } = $props();
</script>



<p
	class="firebase-emulator-warning"
	style="position: fixed; width: 100%; background-color: rgb(255, 255, 255); border: 0.1em solid rgb(0, 0, 0); color: rgb(181, 0, 0); bottom: 0px; left: 0px; margin: 0px; z-index: 10001; text-align: center;"
>
	Currently not logged in.
</p>

{@render children?.()}
