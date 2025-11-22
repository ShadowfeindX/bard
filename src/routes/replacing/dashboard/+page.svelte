<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { onMount } from 'svelte';
	import {
		addAgent,
		parseAgents,
		getAgents,
		removeAgent,
		getRandomInteger,
		getInitiatives
	} from './dashboard.svelte.js';

	import { rollExplodingDie, initiative_roll, getRollResult } from './DieRollers.svelte';

	const { data } = $props();

	// Only in testing. In production, initial agent list will come from server
	if (dev && browser) parseAgents(JSON.parse(localStorage.getItem('agent_data') || '[]'));
	else parseAgents(data.agents);

	let agents = getAgents();
	let initiatives = getInitiatives();

	let active_agent = 0;
	let active_skill = "";
	let active_skill_prof = "";
	let roll_type = ""
	let roll_result = getRollResult();

	function kickAgent(i: number) {
		return () => {
			const agent = removeAgent(i);
			delete initiatives[agent.id];
		};
	}

	function toggleTheme() {
		if (theme === 'classic') theme = 'modern';
		else theme = 'classic';

		localStorage.setItem('dashbaord-theme', theme);
	}

	function openProjectorWindow() {
		addAgent(`Agent #${agents.length}`);
	}

	function searchMusic() {
		for (const agent of agents) {
			for (const attribute in agent.attributes) {
				agent.attributes[attribute] = getRandomInteger(1, 5);
			}
		}
	}
	function searchInstants() {}
	function sortInitiative() {
		agents.sort((agentA, agentB) => -1 * (initiatives[agentA.id] - initiatives[agentB.id]));
	}
	function uploadFile() {
		/* document.getElementById('file-upload-input').click() */
	}
	function handleFileUpload(_: any) {
		return () => {};
	}
	function controlMedia(_: any) {
		return () => {};
	}

	let theme = $state('');
	onMount(() => {
		theme = localStorage.getItem('dashboard-theme') || 'classic';
	});

	$effect(() => {
		const agent_data = agents.map((agent) => {
			return { ...agent.toJSON(), initiative: initiatives[agent.id] };
		});
		// console.log(agent_data);
		localStorage.setItem('agent_data', JSON.stringify(agent_data));
	});
</script>



<svelte:head>
	<title>B.A.R.D. Handler Dashboard - Classified</title>
</svelte:head>

<main data-theme={theme}>
	<audio id="handler-music-audio" loop style="display: none;"></audio>
	<audio id="handler-sfx-audio" style="display: none;"></audio>

	<div class="container">
		<h1>B.A.R.D. OPERATIONAL COMMAND HANDLER DASHBOARD // CLASSIFIED</h1>

		<div id="top-control-bar">
			<button id="theme-toggle" onclick={toggleTheme}>Toggle Theme ({theme})</button>
			<button onclick={openProjectorWindow}>OPEN 16:9 PROJECTOR POPUP</button>
			<div id="music-control">
				<input
					type="text"
					id="music-search"
					placeholder="Search Free Music Archive..."
					style="width: 180px; margin-right: 5px;"
				/>
				<button onclick={searchMusic} style="width: auto;">Search Music</button>
			</div>
			<div id="sound-search">
				<input
					type="text"
					id="instant-search"
					placeholder="Search MyInstants.com..."
					style="width: 180px; margin-right: 5px;"
				/>
				<button onclick={searchInstants} style="width: auto;">Search Instants</button>
			</div>
		</div>
		<div id="character-tracker" class="component-box">
			<h2>AGENT & THREAT TRACKER (MAX 20)</h2>
			<table id="character-table" style="width: 100%; border-collapse: collapse;">
				<thead>
					<tr>
						<th style="width: 5%;">#</th>
						<th style="width: 20%;">Name / Class</th>
						<th style="width: 8%;">Initiative</th>
						<th style="width: 8%;">HP Current/Max</th>
						<th style="width: 8%;">SAN Current/Max</th>
						<th style="width: 25%;">Afflictions/Disorders</th>
						<th style="width: 26%;">Notes (DC, DR, Temp Mod)</th>
					</tr>
				</thead>
				<tbody>
					{#each agents as agent, i (agent.id)}
						<tr id="char-row-{i}">
							<td>{i}</td>
							<td><input type="text" id="name-${i}" value={agent.codename} disabled /></td>
							<td
								><input
									type="number"
									id="init-${i}"
									defaultValue="0"
									bind:value={initiatives[agent.id]}
								/></td
							>
							<td
								><input
									type="text"
									id="hp-${i}"
									value="{agent.stats.HP}/{agent.computed_stats.MaxHP}"
									disabled
								/></td
							>
							<td
								><input
									type="text"
									id="san-${i}"
									value="{agent.stats.SAN}/{agent.computed_stats.MaxSAN}"
									disabled
								/></td
							>
							<td><input type="text" id="afflictions-${i}" value={agent.afflictions} /></td>
							<td
								><input
									type="text"
									id="notes-${i}"
									value="{agent.id} ({agent.computed_stats.DC},{agent.computed_stats.DR},??)"
									disabled
								/></td
							>
							<td onclick={kickAgent(i)}>X</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<button onclick={sortInitiative} style="margin-top: 10px;">SORT INITIATIVE</button>
		</div>
		<div id="obs-area" class="component-box">
			<h2>OBS/PLAYER SCREEN FEED PREVIEW</h2>

			<div id="obs-image-display">Waiting for Handler Input...</div>

			<div id="obs-output-roll">Roll Output Strip</div>

			<div>
				<input
					type="file"
					id="file-upload-input"
					accept="image/*, video/*, .txt, audio/*"
					style="display: none;"
					onchange={handleFileUpload('this.files')}
				/>
				<button onclick={uploadFile}>UPLOAD & DISPLAY LOCAL FILE</button>
				<button onclick={controlMedia('stop')}>STOP PROJECTOR MEDIA</button>
			</div>
		</div>
		<div id="dice-reference" class="component-box">
			<h2>DICE ROLLERS</h2>
			<div class="die-roller">
				<h3>INITIATIVE ROLL</h3>
				<div style="display: flex; gap: 5px;">
					<select name="init-name" id="init-name" style="flex: 1;" bind:value={active_agent}>
						{#each agents as { codename }, i}
							<option value={i}>{codename}</option>
						{/each}
					</select>
					<input
						type="number"
						id="init-dex"
						value={agents[active_agent].computed_stats.DC}
						placeholder="DEX"
						style="flex: 1;"
						disabled
					/>
				</div>
				<div style="display: flex; gap: 5px;">
					<button onclick={rollExplodingDie('Initiative')}>ROLL INITIATIVE</button>
					<button style="flex: 1;" onclick={rollExplodingDie('Party Initiative')}
						>ROLL ALL AGENTS</button
					>
				</div>
			</div>
			<div class="die-roller">
				<h3>SKILL CHECK // 1D6! + ATTR + PROF</h3>
				<p style="font-size: 0.9em; margin: 0 0 5px 0;">1D6 explodes on 6.</p>
				<div style="display: flex; gap: 5px;">
					<select name="attr-mod" id="attr-mod" style="flex: 1;" bind:value={active_skill}>
						{#each Object.entries(agents[active_agent].attributes) as [attr, value]}
							<option {value}>{attr}</option>
						{/each}
					</select>
					<!-- <input type="number" id="attr-mod" value="1" placeholder="Attr" style="flex: 1;" /> -->
					<select id="prof-die" style="flex: 1;" bind:value={active_skill_prof}>
						<option value="0" selected>None</option>
						<option value="4">+1d4 (Prof)</option>
						<option value="6">+1d6 (Expert)</option>
					</select>
					<input
						type="number"
						id="sit-mod-skill"
						value="0"
						placeholder="Sit. Mod"
						style="flex: 1;"
					/>
				</div>
				<button onclick={rollExplodingDie('Skill Check')}>ROLL SKILL CHECK</button>
			</div>
			<div class="die-roller">
				<h3>DAMAGE ROLL // DMG DIE! + MOD</h3>
				<p style="font-size: 0.9em; margin: 0 0 5px 0;">DMG Dice explode on max. Capped at MIN.</p>
				<select id="damage-category">
					<option value="1d6,0">Cat-F: Frail/Unarmed (1d6!, MIN N/A)</option>
					<option value="1d8,1">Cat-E: Light weapons (1d8!, MIN 1)</option>
					<option value="1d10,2">Cat-D: Standard weapons (1d10!, MIN 2)</option>
					<option value="1d12,3">Cat-C: Heavy weapons (1d12!, MIN 3)</option>
					<option value="2d6,5">Cat-B: Military/Explosive (2d6!, MIN 5)</option>
					<option value="2d8,7">Cat-A: High-Caliber/Arcane (2d8!, MIN 7)</option>
					<option value="2d10,9">Cat-S: Special/Supernatural (2d10!, MIN 9)</option>
					<option value="N/A,11">Cat-Ω: Cosmic/Impossible (MIN 11+)</option>
				</select>
				<input type="number" id="damage-mod" placeholder="Extra Mod/Ammunition" />
				<button onclick={rollExplodingDie('Damage')}>ROLL DAMAGE</button>
			</div>

			<div id="roll-result" class="component-box" style="margin-top: 10px;">
				{#if roll_type}
					{@render initiative_roll(roll_result)}
				{:else}
					Roll details will appear here.	
				{/if}
			</div>
			<button onclick={rollExplodingDie()}>CLEAR RESULTS</button>
		</div>

		<div id="rules-reference" class="component-box">
			<h2>QUICK REFERENCE CHARTS</h2>

			<h3>Damage Categories</h3>
			<table class="rules-table">
				<thead>
					<tr><th>Category</th><th>DMG</th><th>MIN</th><th>DESCRIPTION</th></tr>
				</thead>
				<tbody>
					<tr><td>Cat-F</td><td>1d6</td><td>N/A</td><td>Frail/Unarmed/Improvised</td></tr>
					<tr><td>Cat-E</td><td>1d8</td><td>1</td><td>Light weapons (small pistols)</td></tr>
					<tr><td>Cat-D</td><td>1d10</td><td>2</td><td>Standard weapons (pistols, rifles)</td></tr>
					<tr><td>Cat-C</td><td>1d12</td><td>3</td><td>Heavy weapons (hunting rifles)</td></tr>
					<tr><td>Cat-B</td><td>2d6</td><td>5</td><td>Military/Explosive</td></tr>
					<tr><td>Cat-A</td><td>2d8</td><td>7</td><td>High-Caliber/Arcane</td></tr>
					<tr></tr><tr><td>Cat-S</td><td>2d10</td><td>9</td><td>Special/Supernatural</td></tr>
					<tr><td>Cat-&Omega;</td><td>∞</td><td>11+</td><td>Cosmic/Impossible</td></tr>
				</tbody>
			</table>

			<h3>Difficulty Class (DC)</h3>
			<table class="rules-table">
				<thead>
					<tr><th>Category</th><th>DC</th><th>Description</th></tr>
				</thead>
				<tbody>
					<tr><td>Cat-F</td><td>3</td><td>Minimal (Barely a task)</td></tr>
					<tr><td>Cat-E</td><td>5</td><td>Simple for trained/attentive</td></tr>
					<tr><td>Cat-D</td><td>7</td><td>Trained/Competent</td></tr>
					<tr><td>Cat-C</td><td>10</td><td>Standard challenge</td></tr>
					<tr><td>Cat-B</td><td>13</td><td>Demanding, requires focus</td></tr>
					<tr><td>Cat-A</td><td>17</td><td>Extremely difficult</td></tr>
					<tr><td>Cat-S</td><td>21</td><td>Almost impossible</td></tr>
					<tr><td>Cat-&Omega;</td><td>25</td><td>Cosmic/Impossible</td></tr>
				</tbody>
			</table>
		</div>

		<div id="sound-music-panel" class="component-box">
			<h2>SOUND/MUSIC</h2>

			<div id="projector-controls" style="margin-bottom: 15px;">
				<h3>Projector Audio Controls</h3>
				<div style="display: flex; gap: 10px; margin-bottom: 5px;">
					<button onclick={controlMedia('togglePlayPause')}>PLAY / PAUSE</button>
					<button onclick={controlMedia('stop')}>STOP ALL MEDIA</button>
				</div>
				<div style="display: flex; align-items: center; gap: 5px;">
					<span style="min-width: 50px;">Volume:</span>
					<input type="range" id="master-volume" min="0" max="1" step="0.05" value="0.75" />
					<span id="volume-display" style="min-width: 30px; text-align: right;">75%</span>
				</div>
			</div>
			<h3 style="margin-top: 5px;">FMA Search Results (Simulated)</h3>
			<div id="music-results" style="max-height: 150px; overflow-y: auto;">
				Search for music above to see results.
			</div>

			<h3 style="margin-top: 15px;">Instant Soundboard (Simulated)</h3>
			<div id="soundboard"></div>
		</div>
	</div>
</main>

<style>
	/* --- 1. CORE VARIABLES & THEMES --- */
	:root {
		/* Classic Handler Theme (Default) */
		--classic-primary: #c00000; /* BARD Red */
		--classic-secondary: #eaeaea; /* White */
		--classic-background: #0a0a0a; /* Black */
		--classic-component: #1f1f1f; /* Sepia/Dark Gray */
		--classic-accent: #00ff99; /* Alert Green/Yellow */

		/* Modern Stream Theme */
		--modern-primary: #00ffff; /* Cyan */
		--modern-secondary: #ffffff; /* Pure White */
		--modern-background: #282a36; /* Dark Purple-Gray (Dracula) */
		--modern-component: #383a59; /* Lighter Purple-Gray */
		--modern-accent: #ff5555; /* Alert Red */
	}

	/* --- 2. BASE STYLES & LAYOUT --- */
	main {
		margin: 0;
		padding: 20px;
		font-size: 14px;
		transition:
			background-color 0.3s,
			color 0.3s;
	}

	.container {
		max-width: 1600px;
		margin: auto;
		border: 5px double;
		padding: 15px;
		box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
		transition:
			border-color 0.3s,
			background-color 0.3s,
			color 0.3s;
	}

	h1 {
		width: 100%;
		text-align: center;
		font-size: 28px;
		border-bottom: 3px solid;
		padding-bottom: 5px;
		margin-bottom: 15px;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	h2 {
		border-bottom: 1px solid;
		margin-top: 0;
		padding-bottom: 3px;
		font-size: 18px;
		transition:
			border-color 0.3s,
			color 0.3s;
	}

	h3 {
		font-size: 15px;
		margin-top: 0;
	}

	.component-box {
		border: 1px solid;
		padding: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
		flex: 1 1 300px;
		min-width: 300px;
		transition:
			border-color 0.3s,
			background-color 0.3s,
			color 0.3s;
	}

	/* --- 3. INPUTS & BUTTONS (Shared Styling) --- */
	input[type='text'],
	input[type='number'],
	select {
		border: 1px solid;
		padding: 3px;
		box-sizing: border-box;
		color: inherit;
		font-family: inherit;
		margin-bottom: 5px;
		width: 100%;
		transition:
			border-color 0.3s,
			background-color 0.3s,
			color 0.3s;
	}

	input[type='range'] {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		background: #555;
		outline: none;
		opacity: 0.7;
		transition: opacity 0.2s;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 15px;
		height: 15px;
		cursor: pointer;
	}

	button {
		border: 2px solid;
		padding: 8px 12px;
		font-size: 14px;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			border-color 0.2s;
		font-weight: bold;
		margin-top: 5px;
		width: 100%;
		box-sizing: border-box;
	}

	.die-roller button,
	#top-control-bar button {
		width: auto; /* Override for specific sections */
	}

	.die-roller div,
	.die-roller h3 {
		margin-bottom: 5px;
	}

	/* --- 4. THEME: CLASSIC HANDLER (Default) --- */
	main[data-theme='classic'] {
		font-family: 'Georgia', serif;
		background-color: var(--classic-background);
		color: var(--classic-secondary);
	}

	main[data-theme='classic'] .container {
		background-color: var(--classic-component);
		border-color: var(--classic-primary);
	}

	main[data-theme='classic'] h1 {
		color: var(--classic-primary);
		border-color: var(--classic-primary);
	}
	main[data-theme='classic'] h2,
	main[data-theme='classic'] .component-box {
		border-color: var(--classic-secondary);
	}

	main[data-theme='classic'] input,
	main[data-theme='classic'] select {
		background-color: var(--classic-component);
		border-color: var(--classic-secondary);
	}

	main[data-theme='classic'] input[type='range']::-webkit-slider-thumb {
		background: var(--classic-primary);
	}
	main[data-theme='classic'] input[type='range'] {
		background: var(--classic-background);
	}

	main[data-theme='classic'] button {
		background-color: var(--classic-background);
		color: var(--classic-secondary);
		border-color: var(--classic-secondary);
	}
	main[data-theme='classic'] button:hover {
		background-color: #333;
	}
	main[data-theme='classic'] #obs-area {
		background-color: var(--classic-background);
		color: var(--classic-accent);
		border: 5px dashed var(--classic-accent);
	}
	main[data-theme='classic'] #obs-area h2 {
		color: var(--classic-accent);
		border-color: var(--classic-accent);
	}
	main[data-theme='classic'] #obs-area button {
		background-color: var(--classic-accent);
		color: var(--classic-background);
		border-color: var(--classic-background);
	}

	/* Tables (Tracker and Rules) */
	main[data-theme='classic'] .rules-table th,
	main[data-theme='classic'] #character-table th {
		background-color: var(--classic-primary);
		color: var(--classic-secondary);
	}
	main[data-theme='classic'] .rules-table td,
	main[data-theme='classic'] .rules-table th,
	main[data-theme='classic'] #character-table td,
	main[data-theme='classic'] #character-table th {
		border-color: var(--classic-secondary);
	}

	/* Projector Controls Theme */
	main[data-theme='classic'] #projector-controls {
		border: 1px solid;
		border-color: var(--classic-primary);
	}
	main[data-theme='classic'] #projector-controls button {
		border-color: var(--classic-primary);
		color: var(--classic-primary);
		background-color: var(--classic-component);
	}

	/* --- 5. THEME: MODERN STREAM --- */
	main[data-theme='modern'] {
		font-family: 'Consolas', monospace;
		background-color: var(--modern-background);
		color: var(--modern-secondary);
	}

	main[data-theme='modern'] .container {
		background-color: var(--modern-component);
		border-color: var(--modern-primary);
	}

	main[data-theme='modern'] h1 {
		color: var(--modern-primary);
		border-color: var(--modern-primary);
	}
	main[data-theme='modern'] h2,
	main[data-theme='modern'] .component-box {
		border-color: var(--modern-secondary);
	}

	main[data-theme='modern'] input,
	main[data-theme='modern'] select {
		background-color: var(--modern-background);
		border-color: var(--modern-secondary);
	}

	main[data-theme='modern'] input[type='range']::-webkit-slider-thumb {
		background: var(--modern-primary);
	}
	main[data-theme='modern'] input[type='range'] {
		background: var(--modern-background);
	}

	main[data-theme='modern'] button {
		background-color: var(--modern-background);
		color: var(--modern-primary);
		border-color: var(--modern-primary);
	}
	main[data-theme='modern'] button:hover {
		background-color: var(--modern-primary);
		color: var(--modern-background);
	}

	main[data-theme='modern'] #obs-area {
		background-color: var(--modern-background);
		color: var(--modern-accent);
		border: 5px dashed var(--modern-accent);
	}
	main[data-theme='modern'] #obs-area h2 {
		color: var(--modern-accent);
		border-color: var(--modern-accent);
	}
	main[data-theme='modern'] #obs-area button {
		background-color: var(--modern-accent);
		color: var(--modern-background);
		border-color: var(--modern-background);
	}

	/* Tables (Tracker and Rules) */
	main[data-theme='modern'] .rules-table th,
	main[data-theme='modern'] #character-table th {
		background-color: var(--modern-background);
		color: var(--modern-primary);
	}
	main[data-theme='modern'] .rules-table td,
	main[data-theme='modern'] .rules-table th,
	main[data-theme='modern'] #character-table td,
	main[data-theme='modern'] #character-table th {
		border-color: var(--modern-secondary);
	}

	/* Projector Controls Theme */
	main[data-theme='modern'] #projector-controls {
		border: 1px solid;
		border-color: var(--modern-primary);
	}
	main[data-theme='modern'] #projector-controls button {
		border-color: var(--modern-primary);
		color: var(--modern-primary);
		background-color: var(--modern-component);
	}

	/* --- 6. SPECIFIC COMPONENT STYLING --- */
	#top-control-bar {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		margin-bottom: 15px;
	}
	#top-control-bar > div,
	#top-control-bar button {
		margin: 0 5px;
	}

	#character-tracker {
		flex-basis: 100%;
		overflow-x: auto;
	}
	#character-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	#character-table input {
		border: none;
		background: none;
		text-align: center;
	}

	#dice-reference {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}
	.die-roller {
		padding: 10px;
		border: 1px dashed;
	}
	.die-roller input,
	.die-roller select {
		width: 100%;
	}

	#soundboard {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	#soundboard button {
		flex: 1 1 110px;
		margin: 0;
		padding: 8px 5px;
		font-size: 12px;
	}

	#obs-area {
		display: flex;
		flex-direction: column;
	}
	#obs-image-display {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border: 2px dashed;
		margin-bottom: 10px;
	}
	#obs-image-display > * {
		/* Content inside preview */
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
	#obs-output-roll {
		min-height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1em;
	}

	/* Music Search Results Styling */
	.music-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px 0;
		border-bottom: 1px dotted;
	}
	.music-result-item span {
		flex-grow: 1;
	}
	.music-result-item button {
		width: 80px;
		margin: 0 0 0 10px;
	}

	#projector-controls button {
		flex: 1;
	}

	#projector-controls h3 {
		margin-bottom: 5px;
	}

	/* --- 7. PROJECTOR POPUP CSS (16:9 Aspect Ratio Lock) --- */
	.proj-main {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		transition: background-color 0.3s;
	}
	.proj-container {
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 16 / 9;
		margin: auto;
		display: flex;
		flex-direction: column;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
		transition:
			border-color 0.3s,
			background-color 0.3s,
			color 0.3s;
	}
	.proj-visual-pane {
		flex-grow: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: var(--classic-background);
	}
	.proj-visual-pane > * {
		/* Media content inside preview */
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border: 0;
	}
	.proj-roll-strip,
	.proj-now-playing {
		flex-shrink: 0;
		padding: 10px;
		text-align: center;
		border-top: 1px solid;
		font-family: 'Consolas', monospace;
	}

	/* Projector Theme Classes */
	.classic {
		background-color: var(--classic-background);
	}
	.classic .proj-container {
		border: 2px solid var(--classic-accent);
	}
	.classic .proj-roll-strip,
	.classic .proj-now-playing {
		color: var(--classic-accent);
		border-color: var(--classic-accent);
		background-color: var(--classic-component);
	}
	.modern {
		background-color: var(--modern-background);
	}
	.modern .proj-container {
		border: 2px solid var(--modern-primary);
	}
	.modern .proj-roll-strip,
	.modern .proj-now-playing {
		color: var(--modern-primary);
		border-color: var(--modern-primary);
		background-color: var(--modern-component);
	}

	/* Text display styles for the projector, using the main's current theme color */
	.proj-text-content {
		padding: 30px;
		overflow-y: auto;
		white-space: pre-wrap;
		word-wrap: break-word;
		max-width: 90%;
		max-height: 90%;
		font-size: 1.5em;
		line-height: 1.5;
	}
</style>
