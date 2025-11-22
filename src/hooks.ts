import { Character } from '$lib/Profile.svelte';
import type { Transport } from '@sveltejs/kit';

export const transport: Transport = {
	Character: {
		encode: (data) => data instanceof Character && data.toJSON(),
		decode: (data) => Character.fromJSON(data)
	}
};