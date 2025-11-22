import { Character, type ICharacter } from "$lib/Profile.svelte";

let agents: Character[] = $state([]);
let initiatives: Record<string, number> = $state({});

export function getAgents() {
    return agents;
}

export function getInitiatives() {
    return initiatives;
}

export function parseAgents(data: object[]) {
    agents = [];
    for (const agent of data) {
        if (agent instanceof Character) {
            let sAgent = $state(agent);
            agents.push(sAgent);
            initiatives[sAgent.id] = 0;
        }
        else {
            let sAgent = $state(Character.fromJSON(agent as ICharacter));
            agents.push(sAgent);
            initiatives[sAgent.id] = (agent as typeof initiatives)["initiative"] || 0;
        }
    }
    return agents;
}

function test() {
    throw new Error("Function not implemented.");
}

export function addAgent(name?: string): void {
    agents.push(new Character(name));
}

export function removeAgent(i: number): Character {
    if (agents.length === 0) throw new Error("List of Agents is empty!");

    const [removed] = agents.splice(i, 1);
    console.log(removed);
    return removed;
    // deleteDoc(doc(db, 'agents',  agents.splice(i,1)[0].id));
}

export const getRandomInteger = (min: number, max: number): number => {
    if (max < min) throw Error('Integer range cannot be less than 0!');

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// const agentDocs = await getDocs(collection(db, 'agents').withConverter(FCharacter));

// onSnapshot(agentDocs.query, (docs) => {
// 	// agents = docs.docs.map((data) => data.data());
// });