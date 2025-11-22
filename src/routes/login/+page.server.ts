import { fail, type Action, type ActionFailure, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth, hash } from "$lib/server/firebase";
import { Timestamp } from "firebase/firestore";

import { collection, doc, getDoc, addDoc, setDoc } from "firebase/firestore";
import type { User } from '$lib/Profile.svelte';
import { FirebaseAuthError } from 'firebase-admin/auth';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;


type LoginValidator = [false, ActionFailure<{ badge?: string, missing?: string }>] | [true, { badge: string, passcode: string }]
function validateLogin(data: FormData): LoginValidator {
    const badge = data.get('badge')?.toString(), passcode = data.get('passcode')?.toString();
    if (!badge) return [false, fail(400, { missing: 'badge' })];
    if (!passcode) return [false, fail(400, { badge, missing: 'passcode' })];
    return [true, { badge, passcode }];
}

function handleAuthError(error: FirebaseAuthError) {
    const { code, message } = error;

    switch (code) {
        case 'auth/user-not-found':
            console.error(message)
            return fail(400, { error: 'User with that badge number was not found!' })

        case 'auth/uid-already-exists':
            break;

        case 'auth/invalid-password':
            break;

        default:
            console.error(error, message);
            break;
    }
}

export const actions = {
    login: async ({ request }) => {
        // Get submitted login data
        const data = await request.formData();

        // Validate login data
        const [valid, fail_or_data] = validateLogin(data);
        if (!valid) return fail_or_data;
        const { badge, passcode } = fail_or_data;

        try {
            // Find user by badge #
            const user = await auth.getUser(badge);
        } catch (error) {
            // Handle auth errors
            if (error instanceof FirebaseAuthError) return handleAuthError(error);
            else {
                console.trace(error);
                throw error;
            }
        }
    },

    register: async event => {
        const data = await event.request.formData();
        console.log("Registering...")
        console.log(data)
        const maybeUserData = convertToUser(data);
        if (maybeUserData) {
            const [user, passcode] = maybeUserData;
            if (user) await addUser(user, passcode);
        }
    }
} satisfies Actions;


async function findUser(badge_number: string) {
    // const user = await getDoc(doc(db, 'players', badge_number));

    // if (user.exists()) {
    //     console.log("Data:", user.data());
    //     return true;
    // } else {
    //     console.error("No Such User Found!");
    //     return false;
    // }
}

async function addUser(user: User, passcode: string) {
    // const d = doc(db, "players", user.badge_number.toString());
    // await setDoc(d, user);
    createNewUser(user.badge_number.toString(), user.name, passcode);
    console.log(`User {${user.name}} Created.`)
}

function convertToUser(data: FormData): [User, string] | null {
    const creation_date = data.get('creation')?.valueOf() as Timestamp,
        badge_number = data.get('badge')?.valueOf() as number,
        name = data.get('name')?.toString(),
        passcode = data.get('passcode')?.toString();

    if (creation_date && badge_number && name && passcode) {
        return [{
            name,
            badge_number,
            creation_date
        }, passcode]
    } else { return null; }
}

function createNewUser(uid: string, displayName: string, password: string) {
    auth.createUser({
        uid,
        displayName,
        password
    }).then(user => {
        console.log(user)
    }).catch(error => {
        console.error(error)
    })
}
