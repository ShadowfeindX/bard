import { dev } from "$app/environment";
import { getAuth } from "firebase-admin/auth";
import { FirebaseScrypt } from 'firebase-scrypt';
import { hash_config } from "$lib/server/secrets";



const scrypt = new FirebaseScrypt(hash_config);

console.log("server started...")

export const auth = getAuth();

const fakeHash = (context: string, salt: string) => Promise.resolve(`fakeHash:salt=${salt}:password=${context}`);
const firebaseHash = (context: string, salt: string) => scrypt.hash(context, salt);

export const hash = dev ? fakeHash : firebaseHash;
