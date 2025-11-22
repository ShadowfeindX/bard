<script lang="ts">
	import { createTagsInput, melt } from '@melt-ui/svelte';

	const {
		elements: { root, input, tag, deleteTrigger, edit },
		states: { tags }
	} = createTagsInput({
		unique: true,
		add(tag) {
			return { id: tag, value: tag };
		},
		addOnPaste: true
	});
</script>

<div id="root" use:melt={$root}>
	{#each $tags as t}
		<div class="tag" use:melt={$tag(t)}>
			<span>{t.value}</span>
			<button use:melt={$deleteTrigger(t)}> X </button>
		</div>
		<div class="edit" use:melt={$edit(t)}></div>
	{/each}

	<input class="input" use:melt={$input} type="text" placeholder="Enter tags..." />
</div>

<style lang="scss">


	#root {
		width: 100%;

		.input {
            border: none;
			background-color: var(--bard-sepia);
			padding: 3px;
			font-size: 14px;
			font-family: 'Consolas', monospace;

			&:focus-visible {
				outline: none;
			}
		}

		button {
			background: none;
			border: none;
		}
	}
</style>
