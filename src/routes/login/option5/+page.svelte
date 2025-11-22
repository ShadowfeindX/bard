<script lang="ts">
    import type { PageData } from '../login/new/$types';

    let { data }: { data: PageData } = $props();

    const fields = [
		'Badge number (16 digits)',
		'Name',
		'Sex',
		'Pronouns',
		'Blood Type',
		'Height',
		'Weight',
		// 'Profile Image',
		'Organ Donor Status',
		'Country of Origin',
		'Marital Status',
		'Ethnicity',
		'Eye color(s)',
		'Shoe Size',
		'Left or Right handedness',
		'Communism Level',
		' # of days since last poop',
		'Date of sign up'
	];

    let register_fields = Array(fields.length);

</script>

<section>
	<form action="?/register" method="post">
		{#each fields as field, i}
			<label for={field}>{field}:</label>
			<input type="text" id={field} bind:value={register_fields[i]}/>
			<br />
		{/each}
		<button type="submit">Register</button>
	</form>
</section>