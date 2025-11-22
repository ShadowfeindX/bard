<script lang="ts">
	const FormData: { [index: string]: { label; type } } = $state({
		age: {
			label: 'Age',
			type: 'number'
		},
		height: {
			label: 'Height',
			type: 'number'
		},
		weight: {
			label: 'Weight',
			type: 'number'
		},
		complexion: {
			label: 'Complexion',
			type: 'text'
		},
		hair: {
			label: 'Hair',
			type: 'text'
		},
		eyes: {
			label: 'Eyes',
			type: 'text'
		}
	});
	const description = ['age', 'height', 'weight', 'complexion', 'hair', 'eyes'];
	const status = ['Married', 'Divorced', 'Widowed', 'Single'];
</script>

<style>
	form {
		display: grid;

		fieldset#description {
			display: grid;
			/* align-items: center; */
			justify-items: center;

			grid-template: 	"a a a a a a" 1fr
							"b b b b b b" 1fr;

			label {
				grid-row: a;
			}

			input {
				grid-row: b;
				/* border: 1px solid black; */
			}
		}
	}
</style>

<form action="?/register" method="post">
	<label for="name">Agent: </label>
	<input type="text" />

	<fieldset id='description'>
		<legend>Personal Description of Agent</legend>
			{#each description as item}
			<label for="item">{FormData[item].label}</label>
			<input type={FormData[item].type} name={item} id={item} />
			{:else}{/each}
	</fieldset>

	<fieldset>
		<legend>Sex</legend>
		<input type="radio" name="sex" id="male">
		<label for="male">M</label>
		<input type="radio" name="sex" id="female">
		<label for="male">F</label>
	</fieldset>
	<fieldset>
		<legend>Marital Status</legend>
		{#each ['Married', 'Divorced', 'Widowed', 'Single'] as status}
		<input type="radio" name="status" id={status}>
		<label for={status}>{status}</label>
		{/each}
	</fieldset>

	<label for="kin">Next of Kin: </label>
	<input type="text" name="kin" id="kin">
</form>
