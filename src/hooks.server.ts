import { building } from "$app/environment";
import { applicationDefault, initializeApp } from "firebase-admin/app"

if (!building) {
initializeApp({
    credential: applicationDefault()
});
}