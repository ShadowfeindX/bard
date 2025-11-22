import { FCharacter } from "$lib/Profile.svelte";
import { collection, getDocs } from "firebase/firestore";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/client/firebase";

export const load = (async () => {
    const collectionRef = collection(db, 'agents').withConverter(FCharacter);
    const docRefs = await getDocs(collectionRef);
    const agents = docRefs.docs.map(doc => doc.data());

    return { agents };
}) satisfies PageServerLoad;