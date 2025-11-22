<script lang="ts">
	import Popout from '$lib/Popout.svelte';
	import {
		attributes_list,
		Character,
		getAttrID,
		ProficiencyLevel,
		skills_list
	} from '$lib/Profile.svelte';
	import { enableStyleCopying } from '$lib/observe-styles';
	import {
		getActiveSkill,
		getRollResult,
		getRollType,
		rollExplodingDie,
		initiative_roll,
		skillcheck_roll,
		damage_roll,
		setDamageDice,
		getDamageDice
	} from '../dashboard/DieRollers.svelte';
	import { getAgents } from '../dashboard/dashboard.svelte';
	import { onMount } from 'svelte';

	let character = $state(new Character());
	const active_skill = getActiveSkill();
	const damage_dice = getDamageDice();

	onMount(() => loadCharacter());
	$effect(() => {
		let agents = getAgents();
		agents[0] = character;
		saveCharacter();
	});

	let die_roller: HTMLDialogElement;
	let open = $state(false);

	function saveCharacter() {
		console.log('saving...');
		localStorage.setItem('character_sheet', JSON.stringify(character));
	}
	function loadCharacter() {
		console.log('loading...');
		let char = localStorage.getItem('character_sheet');
		if (char) character = Character.fromJSON(JSON.parse(char));
	}
	function logCharacter() {
		// console.log(JSON.parse(JSON.stringify(character)));
		// const popout = window.open(undefined, '_blank', 'popup');
		// if (!popout) throw Error('Popout window could not be opened!');

		// enableStyleCopying(popout.document.head);
		// const target = popout.document.body;
		// target.appendChild(die_roller);

		// popout.resizeTo()

		die_roller.showModal();
	}

	let high_attr = $derived.by(() => {
		let j = false;
		for (const attr in character.attributes) {
			if (character.attributes[attr] == 5) j = true;
		}
		return j;
	});

	const getMaxAttr = (attr: string) =>
		character.character_power == 20 ? character.attributes[attr] : high_attr ? 4 : 5;

	function onWindowInitialised(window: Window | null): void | (() => void) {
		// throw new Error('Function not implemented.');
		console.log('initializing...');
	}
	function onClose(): void {
		throw new Error('Function not implemented.');
	}
</script>

<main class="container">
	<section id="personnel">
		<h1>B.A.R.D. AGENT FILE: PERSONNEL RECORD</h1>
		<div class="flex-group">
			<div class="flex-item">
				<label for="codename">Agent Codename/Alias:</label>
				<input type="text" id="codename" bind:value={character.codename} />
			</div>
			<div class="flex-item">
				<label for="department">Department/Specialization:</label>
				<input id="department" type="text" bind:value={character.department} />
			</div>
			<div class="flex-item">
				<label for="rank">Current Clearance/Rank:</label>
				<input id="rank" type="number" bind:value={character.clearance} />
			</div>
		</div>
	</section>

	<section id="attributes">
		<h2>ATTRIBUTES (Min 1, Max 5 at Creation, 20 Total Points)</h2>
		{#snippet stat_item(attr: string, index: number)}
			<div class="stat-item">
				<label for={attr}>{attr}</label>
				<input
					type="number"
					id={attr}
					bind:value={character.attributes[attr]}
					defaultValue="1"
					min="1"
				/>
				<!-- max={getMaxAttr(attr)} -->
				<span>({attributes_list[index]})</span>
			</div>
		{/snippet}

		<div class="flex-group">
			{#each Object.entries(character.attributes) as [attr, _], i}
				{@render stat_item(attr, i)}
			{/each}
		</div>
	</section>

	<section id="vitality">
		<h2>VITALITY & DEFENSE PROTOCOLS</h2>
		<div class="flex-group">
			<div class="vitality-item">
				<label for="health">HEALTH (HP) - Current / Maximum:</label>
				<div id="health" style="display: flex; gap: 5px;">
					<input
						type="number"
						id="current-hp"
						placeholder="Current HP"
						bind:value={character.stats.HP}
						max={character.computed_stats.MaxHP}
						min="0"
						style="flex: 1;"
					/>
					<input
						type="number"
						id="max-hp-display"
						placeholder="Max HP (Calculated)"
						value={character.computed_stats.MaxHP}
						readonly
						style="flex: 1;"
					/>
				</div>
				<label for="hp-bonus" style="font-size: 0.9em; margin-top: 5px;">HP Bonus Modifier:</label>
				<input
					type="number"
					id="hp-bonus"
					defaultValue="0"
					min="0"
					bind:value={character.bonuses.HP}
				/>
				<p class="mechanics-note">
					Physical ability to endure damage and stress. Max HP = END * LCK + Bonus.
				</p>
			</div>

			<div class="vitality-item">
				<label for="sanity">SANITY (SAN) - Current / Maximum:</label>
				<div id="sanity" style="display: flex; gap: 5px;">
					<input
						type="number"
						id="current-san"
						bind:value={character.stats.SAN}
						max={character.computed_stats.MaxSAN}
						min="0"
						placeholder="Current SAN"
						style="flex: 1;"
					/>
					<input
						type="number"
						id="max-san-display"
						placeholder="Max SAN (Calculated)"
						value={character.computed_stats.MaxSAN}
						readonly
						style="flex: 1;"
					/>
				</div>
				<label for="san-bonus" style="font-size: 0.9em; margin-top: 5px;">SAN Bonus Modifier:</label
				>
				<input
					type="number"
					id="san-bonus"
					defaultValue="0"
					min="0"
					bind:value={character.bonuses.SAN}
				/>
				<p class="mechanics-note">
					Lost from exposure to anomalous sources. Max SAN = WIS * LCK + Bonus.
				</p>
			</div>

			<div class="flex-item" style="flex: 1 1 calc(33.33% - 10px);">
				<label for="evasion-dc">Evasion DC (DEX + LCK):</label>
				<input
					type="text"
					id="evasion-dc"
					placeholder="Calculated from Attributes"
					value={character.computed_stats.DC}
					readonly
				/>
				<p class="mechanics-note">DC for incoming attacks when not actively avoiding.</p>
			</div>
			<div class="flex-item" style="flex: 1 1 calc(33.33% - 10px);">
				<label for="dr-modifier">Damage Reduction (END + DR Bonus):</label>
				<input type="number" id="dr-modifier" value={character.computed_stats.DR} readonly />
				<p class="mechanics-note">Base DR = END score + Modifier from Armor.</p>
			</div>
		</div>
	</section>

	<section id="skills">
		<h2>SKILLS & PROFICIENCIES</h2>
		<p class="mechanics-note">
			<strong>Proficient</strong> adds +1d4 to the roll. <strong>Expert</strong> adds +1d6 to the roll.
			Max 3 Proficient, 1 Expert at creation.
		</p>
		<div class="flex-group">
			{#each Object.entries(character.skills) as [skill, _], i}
				<div class="flex-item">
					<label for="skills-{skill}">{skill.toUpperCase()} SKILLS (e.g., {skills_list[i]})</label>
					<textarea name="skills-{skill}" id="skills-{skill}" bind:value={character.skills[skill]}
					></textarea>
				</div>
			{/each}
		</div>
	</section>

	<section id="status">
		<h2>EQUIPMENT, AFFLICTIONS, & DISORDERS</h2>
		<div class="flex-group">
			<div class="flex-item" style="flex: 1 1 calc(50% - 10px);">
				<label for="equipment">Weapon/Equipment List (Damage, Features, etc.)</label>
				<textarea
					name="equipment"
					id="equipment"
					placeholder="Standard Issue: Basic weapons, light armor, investigative tools..."
					bind:value={character.equipment}
				></textarea>
			</div>
			<div class="flex-item" style="flex: 1 1 calc(50% - 10px);">
				<label for="afflictions">Afflictions & Long-Term Disorders</label>
				<textarea
					id="afflictions"
					name="afflictions"
					placeholder="e.g., Broken Bones (-1 DEX), Paranoia (-3 CHA Checks w/ non-team NPCs)"
					bind:value={character.afflictions}
				></textarea>
			</div>
		</div>
	</section>

	<section id="notes">
		<h2>MISSION NOTES & LOGS (UNCENSORED)</h2>
		<textarea
			id="notes-section"
			placeholder="This is your permanent log for mission notes, personal history, contacts, and other relevant classified information."
			bind:value={character.notes}
		></textarea>
	</section>

	<div id="test-data">
		<!-- <button id="save-button" onclick={saveCharacter}>Save</button> -->
		<!-- <button id="load-button" onclick={loadCharacter}>Load</button> -->
		<button id="show-roller" onclick={logCharacter}>Roll</button>
	</div>
</main>

<!-- {#if open} -->
<dialog
	bind:this={die_roller}
	onclick={(e) => (e.target === die_roller ? die_roller.close() : null)}
>
	<div class="die-roller">
		<h2>AGENT DIE ROLLER (1D6! CORE MECHANIC)</h2>
		<div id="roll-result">
			{#if getRollType() === 'Initiative'}
				{@render initiative_roll(getRollResult())}
			{:else if getRollType() === 'Skill Check'}
				{@render skillcheck_roll(getRollResult())}
			{:else if getRollType() === 'Damage'}
				{@render damage_roll(getRollResult())}
			{:else}
				Roll details will appear here.
			{/if}
		</div>

		<div class="flex-group">
			<div class="flex-item" style="border: 1px solid rgba(255,255,255,0.5); padding: 10px;">
				<h3>SKILL CHECK // 1D6! + ATTR + PROF</h3>
				<div style="display: flex; gap: 5px;">
					<select id="attr-selector" style="flex: 1;" bind:value={active_skill.attribute}>
						{#each attributes_list as attr}
							{@const ID = getAttrID(attr)}
							<option value={attr}>{`${ID} (${attr})`}</option>
						{/each}
					</select>
					<input
						type="number"
						id="attr-mod-calculated"
						placeholder="Attr Val"
						value={character.attributes[getAttrID(active_skill.attribute)]}
						readonly
						style="flex: 1; text-align: center;"
					/>
				</div>
				<div style="display: flex; gap: 5px; margin-top: 5px;">
					<select id="prof-die" style="flex: 1;" bind:value={active_skill.proficiency}>
						<option value={ProficiencyLevel.None}>None</option>
						<option value={ProficiencyLevel.Proficient}>+1d4 (Prof)</option>
						<option value={ProficiencyLevel.Expert}>+1d6 (Expert)</option>
					</select>
					<input
						type="number"
						id="sit-mod-skill"
						bind:value={active_skill.bonus}
						placeholder="Sit. Mod (+/-)"
						style="flex: 1;"
					/>
				</div>
				<button onclick={rollExplodingDie('Skill Check')}>ROLL SKILL CHECK</button>
			</div>

			<div class="flex-item" style="border: 1px solid rgba(255,255,255,0.5); padding: 10px;">
				<h3>DAMAGE ROLL // DMG DIE! + MOD</h3>
				<p class="mechanics-note" style="border: none; padding-left: 0; color: var(--bard-white);">
					DMG Dice explode on max. Capped at MIN.
				</p>
				<select id="damage-category" bind:value={damage_dice.die}>
					<option value="1d6,1">Cat-F: Frail/Unarmed (1d6!, MIN 1)</option>
					<option value="1d8,1">Cat-E: Light weapons (1d8!, MIN 1)</option>
					<option value="1d10,2">Cat-D: Standard weapons (1d10!, MIN 2)</option>
					<option value="1d12,3">Cat-C: Heavy weapons (1d12!, MIN 3)</option>
					<option value="2d6,5">Cat-B: Military/Explosive (2d6!, MIN 5)</option>
					<option value="2d8,7">Cat-A: High-Caliber/Arcane (2d8!, MIN 7)</option>
					<option value="2d10,9">Cat-S: Special/Supernatural (2d10!, MIN 9)</option>
					<option value="N/A,11">Cat-Ω: Cosmic/Impossible (MIN 11+)</option>
				</select>
				<input
					type="number"
					id="damage-mod"
					bind:value={damage_dice.bonus}
					placeholder="Extra Mod/Ammunition"
					style="margin-top: 5px;"
				/>
				<button onclick={rollExplodingDie('Damage')}>ROLL DAMAGE</button>
			</div>

			<div class="flex-item" style="border: 1px solid rgba(255,255,255,0.5); padding: 10px;">
				<h3>INITIATIVE ROLL (DEX: {character.attributes.DEX} | LCK: {character.attributes.LCK})</h3>
				<p class="mechanics-note" style="border: none; padding-left: 0; color: var(--bard-white);">
					1D6! + DEX + LCK (Pulls from sheet Attributes).
				</p>
				<input
					type="text"
					id="init-name"
					value={character.codename}
					placeholder="Agent/NPC Name"
					style="margin-top: 5px;"
					disabled
				/>
				<button onclick={rollExplodingDie('Initiative')}>ROLL INITIATIVE</button>
			</div>
		</div>
	</div>
</dialog>
<!-- {/if} -->
<!-- 
			<script>
			// --- Utility Functions ---
			
			/**
			* Rolls a d6. If it's a 6, it rolls again and adds the result, repeating the process (Exploding Die rule).
     */
    function rollCoreD6() {
        let total = 0;
        let rolls = [];
        let roll = 0;
        
        do {
            roll = Math.floor(Math.random() * 6) + 1;
            rolls.push(roll);
            total += roll;
        } while (roll === 6); 

        let annotatedRolls = rolls.map((r, index) => {
            if (r === 6 && index < rolls.length - 1) {
                return '6!';
            }
            return r;
        });

        return { total, rolls: annotatedRolls.join(" + ") };
    }

    /**
     * Rolls damage dice (e.g., 2d8!). Dice explode on max, and min damage is applied.
     */
    function rollDamageDice(diceStr, minDamage) {
        let total = 0;
        let rollDetails = [];
        
        if (diceStr === 'N/A') return { total: minDamage, rolls: 'N/A (Minimum Damage Applied)', minApplied: true, diceRolled: 'Cat-Ω' };

        let [numDice, dieSize] = diceStr.split('d').map(Number);
        
        for (let i = 0; i < numDice; i++) {
            let currentDieTotal = 0;
            let dieRolls = [];
            let roll = 0;
            do {
                roll = Math.floor(Math.random() * dieSize) + 1;
                dieRolls.push(roll);
                currentDieTotal += roll;
            } while (roll === dieSize); 
            const annotatedRolls = dieRolls.map((r, index) => r === dieSize && index < dieRolls.length - 1 ? `${dieSize}!` : r).join(" + ");
            rollDetails.push(`(${annotatedRolls})`);
            total += currentDieTotal;
        }

        let finalRoll = total;
        let minApplied = false;
        if (minDamage > 0 && finalRoll < minDamage) {
            finalRoll = minDamage;
            minApplied = true;
        }
        
        return { total: finalRoll, rolls: rollDetails.join(" + "), minApplied: minApplied, diceRolled: diceStr };
    }

    /**
     * Rolls the Proficiency Die (1d4 or 1d6).
     */
    function rollProficiencyDie(type) {
        if (type === 'd4') {
            return Math.floor(Math.random() * 4) + 1; // 1d4 for Proficient
        } else if (type === 'd6') {
            return Math.floor(Math.random() * 6) + 1; // 1d6 for Expert
        }
        return 0;
    }

    // --- Derived Stats & Syncing ---

    /**
     * Syncs the Attribute value from the main sheet to the roller display.
     */
    function syncAttributeMod() {
        const selectedAttr = document.getElementById('attr-selector').value.toLowerCase();
        // Fallback to 1 if the attribute input is empty or invalid
        const attrValue = parseInt(document.getElementById(selectedAttr).value) || 1; 
        document.getElementById('attr-mod-calculated').value = attrValue;
    }

    /**
     * Calculates and displays Max HP (END * LCK + Bonus), Max SAN (WIS * LCK + Bonus), and Evasion DC (DEX + LCK).
     */
    function updateDerivedStats() {
        // 1. Get Core Attribute Values (default to 1 if empty to avoid 0 results)
        const dex = parseInt(document.getElementById('dex').value) || 1;
        const end = parseInt(document.getElementById('end').value) || 1;
        const lck = parseInt(document.getElementById('lck').value) || 1;
        const wis = parseInt(document.getElementById('wis').value) || 1;
        
        // 2. Get Bonus Modifiers
        const hpBonus = parseInt(document.getElementById('hp-bonus').value) || 0;
        const sanBonus = parseInt(document.getElementById('san-bonus').value) || 0;
        
        // 3. Calculate Derived Stats
        
        // Evasion DC = DEX + LCK
        const evasionDC = dex + lck;
        document.getElementById('evasion-dc').value = evasionDC;
        
        // Max HP = (END * LCK) + Bonus 
        const maxHP = (end * lck) + hpBonus;
        document.getElementById('max-hp-display').value = maxHP;
        
        // Max SAN = (WIS * LCK) + Bonus 
        const maxSAN = (wis * lck) + sanBonus;
        document.getElementById('max-san-display').value = maxSAN;
        
        // 4. Update Roller Displays
        document.getElementById('init-dex-display').textContent = dex;
        document.getElementById('init-lck-display').textContent = lck;
        syncAttributeMod(); 
    }

    // --- Main Roller Logic ---

    /**
     * Main function to perform the full Die Roll based on rollType.
     */
    function rollExplodingDie(rollType) { 
        const resultDiv = document.getElementById('roll-result');
        let finalTotal = 0;
        let output = '';
        let components = [];
        
        if (rollType === 'Damage Roll') {
            const categoryValue = document.getElementById('damage-category').value;
            const [diceStr, minStr] = categoryValue.split(',');
            const extraMod = parseInt(document.getElementById('damage-mod').value) || 0; 
            const minDamage = parseInt(minStr) || 0; 

            const dResult = rollDamageDice(diceStr, minDamage);
            finalTotal = dResult.total + extraMod;

            components.push(`<strong>DAMAGE ROLL:</strong> ${dResult.diceRolled}!`);
            components.push(`<strong>ROLLS:</strong> ${dResult.rolls}`);
            components.push(`<strong>BASE DAMAGE TOTAL:</strong> ${dResult.total} (Min applied: ${dResult.minApplied ? 'Yes' : 'No'})`);
            components.push(`<strong>EXTRA MODIFIER:</strong> ${extraMod}`);
            
            output += `<strong>--- DAMAGE ROLL RESOLUTION ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>DAMAGE TOTAL:</strong> <span style="font-size: 1.5em; color: var(--bard-red);">${finalTotal}</span> (Apply DR)<br>`;
            
        } else if (rollType === 'Skill Check') {
            const d6Result = rollCoreD6();
            
            // Get attribute value from the selected input on the sheet
            const selectedAttrId = document.getElementById('attr-selector').value.toLowerCase();
            const attrMod = parseInt(document.getElementById(selectedAttrId).value) || 1; 
            const profDieType = document.getElementById('prof-die').value;
            const sitMod = parseInt(document.getElementById('sit-mod-skill').value) || 0; 
            const profRoll = rollProficiencyDie(profDieType);
            
            finalTotal = d6Result.total + attrMod + profRoll + sitMod;

            components.push(`<strong>CORE 1D6! ROLL:</strong> ${d6Result.total} (${d6Result.rolls})`);
            components.push(`<strong>PROFICIENCY DIE:</strong> ${profRoll} (${profDieType === 'd4' ? '1d4 (Proficient)' : profDieType === 'd6' ? '1d6 (Expert)' : 'N/A'})`);
            components.push(`<strong>ATTRIBUTE SCORE:</strong> ${attrMod} (${selectedAttrId.toUpperCase()})`);
            components.push(`<strong>SITUATIONAL MOD:</strong> ${sitMod}`);
            
            output += `<strong>--- SKILL CHECK RESOLUTION ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>FINAL TOTAL:</strong> <span style="font-size: 1.5em; color: var(--bard-red);">${finalTotal}</span><br>`;
            output += `<br><em>Compare to DC (e.g., Cat-C: 10, Cat-B: 13, Cat-A: 17) to determine success.</em>`;

        } else if (rollType === 'Initiative') {
            const d6Result = rollCoreD6();
            // Pull values directly from the main sheet attributes (default to 1)
            const initDex = parseInt(document.getElementById('dex').value) || 1; 
            const initLck = parseInt(document.getElementById('lck').value) || 1; 
            const initName = document.getElementById('agent-codename').value || document.getElementById('init-name').value || 'Unidentified';
            
            finalTotal = d6Result.total + initDex + initLck;

            components.push(`<strong>CORE 1D6! ROLL:</strong> ${d6Result.total} (${d6Result.rolls})`);
            components.push(`<strong>DEX SCORE:</strong> ${initDex}`);
            components.push(`<strong>LCK SCORE:</strong> ${initLck}`);
            
            output += `<strong>--- INITIATIVE ROLL for ${initName} ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>INITIATIVE TOTAL:</strong> <span style="font-size: 1.5em; color: var(--bard-red);">${finalTotal}</span><br>`;
            
        }
        
        resultDiv.innerHTML = output;
    }

    // Call update on load and whenever an Attribute input changes
    document.addEventListener('DOMContentLoaded', updateDerivedStats);
</script>
 -->

<svelte:head>
	<title>B.A.R.D. Agent File (Character Sheet)</title>
	<style>
		body {
			font-family: 'Georgia', serif;
			background-color: var(--bard-sepia);
			color: var(--bard-black);
			margin: 0;
			padding: 20px;
			font-size: 14px;
		}
	</style>
</svelte:head>

<style lang="scss">
	#test-data {
		display: flex;
		justify-content: right;
		position: relative;
		top: 10px;
	}

	section#skills > .flex-group {
		align-items: flex-end;
	}

	:root {
		/* Retained for the 'File' look, but styled to be bolder/darker */
		--bard-red: #c00000;
		--bard-black: #1a1a1a;
		--bard-white: #f5f5f5;
		--bard-sepia: #e6e0d8;
	}

	main,
	.die-roller {
		max-width: 1000px;
		margin: auto;
		background-color: var(--bard-white);
		border: 5px double var(--bard-black);
		padding: 0px 20px 20px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}

	h1 {
		text-align: center;
		color: var(--bard-red);
		text-shadow: 1px 1px 2px var(--bard-black);
		font-size: 24px;
		border-bottom: 2px solid var(--bard-red);
		padding-bottom: 5px;
	}

	h2 {
		color: var(--bard-black);
		border-bottom: 1px solid var(--bard-black);
		margin-top: 20px;
		font-size: 18px;
		padding-bottom: 3px;
	}

	/* --- Input Fields Styling --- */
	input[type='text'],
	input[type='number'],
	textarea,
	select {
		background-color: var(--bard-sepia);
		border: 1px solid var(--bard-black);
		padding: 3px;
		font-size: 14px;
		font-family: 'Consolas', monospace;
		width: calc(100% - 8px);
		box-sizing: border-box;
	}

	/* Readonly inputs for calculated stats */
	input[readonly] {
		background-color: var(--bard-white); /* White background for calculated fields */
		font-weight: bold;
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.flex-group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.flex-item {
		flex: 1 1 calc(33.33% - 10px);
		min-width: 150px;
	}

	.stat-item {
		flex: 1 1 calc(20% - 10px);
		min-width: 80px;
		text-align: center;
	}

	.stat-item label {
		display: block;
		font-weight: bold;
		font-size: 1.1em;
		margin-bottom: 2px;
	}

	.stat-item input[type='number'] {
		width: 50px;
		text-align: center;
	}

	/* --- Die Roller Styling (Handler Dashboard Aesthetic) --- */
	.die-roller {
		background-color: var(--bard-black); /* Dark background */
		color: var(--bard-white);
		padding: 15px;
		border-radius: 5px;
		border: 2px solid var(--bard-red);
	}

	dialog {
		padding: 0;
		border: none;
		border-radius: 5px;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	.die-roller h2 {
		color: var(--bard-red);
		border-color: var(--bard-red);
	}

	.die-roller h3 {
		margin-top: 0;
		font-size: 16px;
	}

	.die-roller button,
	#show-roller {
		background-color: var(--bard-red);
		color: var(--bard-white);
		border: 2px solid var(--bard-white);
		padding: 10px 15px;
		font-size: 16px;
		cursor: pointer;
		transition: background-color 0.2s;
		font-weight: bold;
		width: 100%;
		margin-top: 10px;
	}

	.die-roller button:hover,
	#show-roller:hover {
		background-color: #8b0000;
	}

	#show-roller {
		border: 2px solid var(--bard-black);
	}

	#roll-result {
		min-height: 50px;
		background-color: var(--bard-white);
		color: var(--bard-black);
		padding: 10px;
		border-radius: 3px;
		margin-bottom: 10px;
		font-size: 1.2em;
		font-weight: bold;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		font-family: 'Consolas', monospace;
	}

	/* Input fields inside the roller for the dark aesthetic */
	.die-roller input,
	.die-roller select {
		background-color: var(--bard-black);
		color: var(--bard-white);
		border: 1px solid var(--bard-red);
		font-family: 'Consolas', monospace;
		padding: 5px;
	}

	.die-roller input[readonly] {
		background-color: #555; /* Dark gray for calculated field */
		color: var(--bard-white);
	}

	.die-roller select {
		width: 100%; /* Fix select box width */
	}

	/* --- Mechanics Notes --- */
	.mechanics-note {
		font-size: 0.85em;
		margin-top: 5px;
		padding-left: 10px;
		border-left: 3px solid var(--bard-red);
	}

	.vitality-item {
		flex: 1 1 calc(50% - 10px);
	}
</style>
