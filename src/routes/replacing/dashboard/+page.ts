import { Character } from "$lib/Profile.svelte";
import type { PageLoad } from "./$types";

export const load = (async ({ data }) => {
    return data;
}) satisfies PageLoad;