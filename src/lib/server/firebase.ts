import { dev } from "$app/environment";
import { getAuth } from "firebase-admin/auth";
import { FirebaseScrypt, type FirebaseScryptOptions } from 'firebase-scrypt';

// let hash_config = new Function("return " + process.env.SCRYPT_HASH_CONFIG + ";")();
// const scrypt = new FirebaseScrypt(hash_config);

console.log("server started...")

export const auth = getAuth();

const fakeHash = (context: string, salt: string) => Promise.resolve(`fakeHash:salt=${salt}:password=${context}`);
// const firebaseHash = (context: string, salt: string) => scrypt.hash(context, salt);
const firebaseHash = fakeHash;

export const hash = dev ? fakeHash : firebaseHash;
