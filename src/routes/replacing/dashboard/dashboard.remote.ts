import { command } from "$app/server";
import { db } from "$lib/client/firebase";
import { Character, FCharacter } from "$lib/Profile.svelte";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import z from "zod";

// export const addAgent = command(z.string().optional(), async (name) => {
//     const c = new Character(name);
//     console.log(c.id)
//     await setDoc(doc(db, 'agents', c.id).withConverter(FCharacter), c);
// });
