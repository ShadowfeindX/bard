<script module lang="ts">
	import { getAttrID, ProficiencyLevel } from '$lib/Profile.svelte';
	import { getAgents, getInitiatives, getRandomInteger } from './dashboard.svelte';

	export type Roll = 'Initiative' | 'Skill Check' | 'Damage' | 'Party Initiative' | undefined;
	export type RollResult = Record<string, string | number>;
	export type Die = `${number}d${number},${number}`;
	export { initiative_roll, skillcheck_roll, damage_roll };

	let roll_result: RollResult = $state({});
	let roll_type: Roll = $state();
	let agents = getAgents();

	export function getRollType(): Roll {
		return roll_type;
	}
	export function getRollResult(): RollResult {
		return roll_result;
	}

	export function rollExplodingDie(roll?: Roll) {
		switch (roll) {
			case 'Initiative':
				return rollInitiative;
			case 'Skill Check':
				return rollSkillCheck;
			case 'Damage':
				return rollDamage;
			case 'Party Initiative':
				return rollInitiativeAllAgents;
			default:
				return () => (roll_type = undefined);
		}
	}

	function clearRoll() {
		roll_type = undefined;
		roll_result = {};
	}

	function explodingDieRoll(size: number): [number, number, number, string] {
		let rolling_die = 0,
			exploding_die = 0,
			explosion_count = -1;
		do {
			// Roll 1d6
			rolling_die = getRandomInteger(1, size);

			// Add the value to total
			exploding_die += rolling_die;

			// Increase explosion counter
			explosion_count++;

			// Re-roll if the die lands on a 6
		} while (rolling_die === 6);

		// Convert explosion count to string
		const explosions = '6! + '.repeat(explosion_count) + rolling_die.toString();

		// Return die rolls
		return [rolling_die, exploding_die, explosion_count, explosions];
	}

	let active_agent = $state(0);
	function rollInitiative() {
		// Initialize roll display
		clearRoll();

		const agent = agents[active_agent];
		const bonus = agent.computed_stats.DC;
		const [, roll, , explosions] = explodingDieRoll(6);

		// Add the agent's initiative bonus
		const total = roll + bonus;

		// Save initiative
		getInitiatives()[agent.id] = total;

		// Set roll display
		roll_result = {
			name: agent.codename,
			roll,
			explosions,
			bonus,
			total
		};
		roll_type = 'Initiative';
		return roll_result;
	}

	function rollInitiativeAllAgents() {
		clearRoll();
		const initial_agent = $state.snapshot(active_agent);
		agents.forEach((_, i) => {
			active_agent = i;
			rollInitiative();
		});
		active_agent = initial_agent;
		roll_type = 'Party Initiative';
	}

	class ActiveSkill {
		attribute = $state('Strength');
		proficiency = $state(ProficiencyLevel.None);
		bonus = $state(0);
	}

	let active_skill = $state(new ActiveSkill());
	export const getActiveSkill = () => active_skill;

	function rollSkillCheck() {
		clearRoll();

		const [, roll, , explosions] = explodingDieRoll(6);
		const attrMod = agents[active_agent].attributes[getAttrID(active_skill.attribute)];
		const prof_roll =
			active_skill.proficiency === ProficiencyLevel.None
				? 0
				: getRandomInteger(1, active_skill.proficiency);
		const total = roll + attrMod + prof_roll + active_skill.bonus;

		roll_result = {
			attribute: active_skill.attribute,
			roll,
			explosions,
			prof: ProficiencyLevel[active_skill.proficiency],
			prof_roll,
			attrMod,
			bonus: active_skill.bonus,
			total
		};
		roll_type = 'Skill Check';
		return roll_result;
	}

	export class DamageDice {
		die: Die = $state('1d6,1');
		bonus: number = $state(0);
	}

	let data: DamageDice = $state(new DamageDice());
	export const getDamageDice = () => data;
	export const setDamageDice = (s: DamageDice) => (data = s);
	function convertDie(die: Die) {
		const [die_str, min] = die.split(',');
		const [count, size] = die_str.split('d');

		return [count, size, min].map(Number);
	}

	function rollDamage() {
		const [count, size, min] = convertDie(data.die);
		let current_roll = Array(4).fill(new Array());
		
		if (size.toString() === 'NaN') {
			roll_result = {
				die_size: 'Cat-Ω',
				die_min: min,
				base: min,
				rolls: 'N/A (Minimum Damage Applies)',
				bonus: data.bonus,
				total: min + data.bonus
			}
			roll_type = 'Damage';
			return roll_result;
		}

		let [, t, , e] = Array<number>(count)
			.fill(size)
			.map(explodingDieRoll)
			.reduce((acc, roll) => roll.map((val, i) => acc[i].concat(val)), current_roll) as [
			number | string
		][];

		const explosions = e.map((value) => `(${value})`).join(' + ');
		const base = (t as number[]).reduce((acc, value) => (acc += value), 0);
		const roll = base > min ? base : min;

		roll_result = {
			die_size: `${count}d${size}`,
			die_min: min,
			base,
			roll,
			rolls: explosions,
			bonus: data.bonus,
			total: base + data.bonus
		};
		roll_type = 'Damage';
		return roll_result;
	}
</script>

{#snippet initiative_roll(result: RollResult)}
	{@const { name, roll, explosions, bonus, total } = result}
	<strong>--- INITIATIVE ROLL for {name} ---</strong>
	<br />
	<strong>CORE 1D6! ROLL:</strong>
	{roll} ({explosions})
	<br />
	<strong>INITIATIVE BONUS:</strong>
	{bonus}
	<br />
	<strong>INITIATIVE TOTAL:</strong>
	<span style="font-size: 1.5em;">{total}</span>
{/snippet}

{#snippet skillcheck_roll(result: RollResult)}
	{@const { attribute, roll, explosions, prof, prof_roll, attrMod, bonus, total } = result}
	<strong>--- {attribute.toString().toUpperCase()} CHECK RESOLUTION ---</strong>
	<br />
	<strong>CORE 1D6! ROLL:</strong>
	{roll} ({explosions})
	<br />
	<strong>ATTRIBUTE SCORE:</strong>
	{attrMod} ({getAttrID(attribute.toString())})
	<br />
	<strong>PROFICIENCY ROLL:</strong>
	{prof_roll} ({prof})
	<br />
	<strong>SITUATIONAL MOD:</strong>
	{bonus}
	<br />
	<strong>FINAL TOTAL:</strong>
	<span style="font-size: 1.5em;">{total}</span>
{/snippet}

{#snippet damage_roll(result: RollResult)}
	{@const { die_size, die_min, base, rolls, bonus, total } = result}
	<strong>--- DAMAGE ROLL RESOLUTION ---</strong>
	<br />
	<strong>DAMAGE DIE:</strong>
	{die_size}! (min: {die_min})
	<br />
	<strong>ROLLS:</strong>
	{rolls}
	<br />
	<strong>BASE DAMAGE TOTAL:</strong>
	{base}
	<br />
	<strong>EXTRA MODIFIER:</strong>
	{bonus}
	<br />
	<strong>DAMAGE TOTAL:</strong>
	<span style="font-size: 1.5em; color: var(--bard-red);">{total}</span>
{/snippet}
