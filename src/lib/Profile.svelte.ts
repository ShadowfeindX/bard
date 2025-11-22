import { Timestamp, type DocumentData, type FirestoreDataConverter } from "firebase/firestore";
import { generateFirebaseId } from "./client/firebase";

enum MaritalStatus {
    Married,
    Divorced,
    Widowed,
    Single
}

export enum ProficiencyLevel {
    None = 0,
    Proficient = 4,
    Expert = 6
}

interface IProfile {
    badge_number: number;
    blood_type: string;
    campaigns: ICampaign[];
    communist_threat_level: number;
    creation_date: Timestamp;
    days_since_last_poop: number;
    eye_color_left: string;
    eye_color_right: string;
    height: number;
    heterochromia: boolean;
    is_left_handed: boolean;
    is_male: boolean;
    is_organ_donor: boolean;
    name: string;
    pronouns: string;
    race: string;
    shoe_size: number;
    weight: number;
    marital_status: MaritalStatus;
}

interface ICampaign { }

type Clearance = number;

export interface ICharacter {
    id: string;
    codename: string;
    department: string;
    clearance: Clearance;
    attributes: Attributes;
    bonuses: Attributes;
    stats: Attributes;
    skills: Skills;
    equipment: string;
    afflictions: string;
    notes: string;
}
export const FCharacter: FirestoreDataConverter<Character, DocumentData> = {
    toFirestore: (char: Character) => {
        let c = char.toJSON() as any;
        delete c.id;
        return c;
    },
    fromFirestore: (snapshot, _) => {
        let char = snapshot.data() as ICharacter;
        return Character.fromJSON({ ...char, id: snapshot.id });
    }

}
export class Character {
    codename = $state("[CLASSIFIED]");
    department = $state("General Affairs");
    clearance = $state<Clearance>(1);

    attributes: Record<string, number> = $state({});
    bonuses: Record<string, number> = $state({});
    stats: Record<string, number> = $state({});
    skills: Record<string, string> = $state({});

    readonly computed_stats: Record<string, number>;
    readonly character_power;
    readonly id: string;


    equipment = $state("");
    afflictions = $state("");
    notes = $state("");

    constructor(codename?: string, id?: string) {
        if (codename) this.codename = codename;

        if (id) this.id = id;
        else this.id = generateFirebaseId();


        this.attributes = {
            STR: 1,
            DEX: 1,
            END: 1,
            PER: 1,
            INT: 1,
            WIL: 1,
            CHA: 1,
            WIS: 1,
            LCK: 1
        };

        this.bonuses = {
            HP: 0,
            SAN: 0,
            DR: 0
        };

        this.stats = {
            HP: 1,
            SAN: 1
        }

        this.skills = {
            physical: "",
            investigation: "",
            technical: "",
            social: "",
            arcane: ""
        }

        this.computed_stats = $derived({
            MaxHP: this.attributes.END * this.attributes.LCK + this.bonuses.HP,
            MaxSAN: this.attributes.WIS * this.attributes.LCK + this.bonuses.SAN,
            DC: this.attributes.DEX + this.attributes.LCK,
            DR: this.attributes.END + this.bonuses.DR
        });

        this.character_power = $derived.by(() => {
            let i = 0;
            for (const attr in this.attributes) {
                i += this.attributes[attr];
            }
            return i;
        });
    }

    toJSON(): ICharacter {
        return $state.snapshot({
            id: this.id,
            codename: this.codename,
            department: this.department,
            clearance: this.clearance,
            attributes: this.attributes,
            bonuses: this.bonuses,
            stats: this.stats,
            skills: this.skills,
            equipment: this.equipment,
            afflictions: this.afflictions,
            notes: this.notes,
        });
    }

    static fromJSON(data: ICharacter): Character {
        const character = new Character(data.codename, data.id);
        character.attributes = data.attributes
        character.bonuses = data.bonuses
        character.stats = data.stats
        character.skills = data.skills
        character.department = data.department;
        character.clearance = data.clearance;
        character.equipment = data.equipment;
        character.afflictions = data.afflictions;
        character.notes = data.notes;
        return character;
    }
}

interface IPlayer extends IProfile {
    [index: string]: Field
    characters: Character[];
}

const GENERATION_OFFSET = new Date(204000, 1, 1).getTime();
// const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// const generateId = () => (GENERATION_OFFSET - Date.now()).toString(10).padStart(16, '0');
const generateBadgeId = () => (GENERATION_OFFSET - Date.now());

// let test = $state(generateId());


export type Field = boolean | number | string | Timestamp | Character[] | ICampaign[]
export class Player implements IPlayer {
    [index: string]: Field
    constructor(
        public blood_type: string = "",
        public campaigns: ICampaign[] = [],
        public characters: Character[] = [],
        public communist_threat_level: number = 0,
        public days_since_last_poop: number = 0,
        public eye_color_left: string = "",
        public eye_color_right: string = "",
        public height: number = 0,
        public heterochromia: boolean = false,
        public is_left_handed: boolean = false,
        public is_male: boolean = false,
        public is_organ_donor: boolean = false,
        public name: string = "",
        public pronouns: string = "",
        public race: string = "",
        public shoe_size: number = 0,
        public weight: number = 0,
        public marital_status = MaritalStatus.Single,
        public readonly badge_number: number = generateBadgeId(),
        public readonly creation_date: Timestamp = Timestamp.now()
    ) { }

    static fromObject(obj: { [index: string]: Field }): Player {
        let new_obj = new Player();
        for (const key in new_obj) {
            if (Object.hasOwn(obj, key) && (typeof new_obj[key] === typeof obj[key])) {
                new_obj[key] = obj[key]
            }
        }
        return new_obj;
    }

    static toObject(obj?: Player) {
        return Object.fromEntries(Object.entries(obj || new Player())) as unknown as IPlayer;

        /*
        return {
            badge_number: player.badge_number,
            blood_type: player.blood_type,
            campaigns: player.campaigns,
            characters: player.characters,
            communist_threat_level: player.communist_threat_level,
            creation_date: player.creation_date,
            days_since_last_poop: player.days_since_last_poop,
            eye_color_left: player.eye_color_left,
            eye_color_right: player.eye_color_right,
            height: player.height,
            heterochromia: player.heterochromia,
            is_left_handed: player.is_left_handed,
            is_male: player.is_male,
            is_organ_donor: player.is_organ_donor,
            name: player.name,
            pronouns: player.pronouns,
            race: player.race,
            shoe_size: player.shoe_size,
            weight: player.weight
        }
            */
    }
}

export interface User {
    badge_number: number;
    creation_date: Timestamp;
    name: string;
}

export function newUser(name: string): User {
    return {
        name,
        badge_number: generateBadgeId(),
        creation_date: Timestamp.now()
    }
}

export const attributes_list = [
    'Strength',
    'Dexterity',
    'Endurance',
    'Perception',
    'Intelligence',
    'Willpower',
    'Charisma',
    'Wisdom',
    'Luck'
];
export const skills_list = [
    'Melee, Stealth, Athletics',
    'Forensics, Occultism',
    'Hacking, Demolitions, Mechanics',
    'Interrogation, Diplomacy, Charm',
    'Ritual Magic, Exorcism'
];
export const getAttrID = (attr: string) => {
    if (attr === 'Luck') return 'LCK';
    return attr.substring(0, 3).toLocaleUpperCase();
};