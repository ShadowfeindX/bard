<!-- <svelte:body data-theme="classic"></svelte:body> -->

<script lang="ts">
	function toggleTheme() {}
	function openProjectorWindow() {}
	function searchMusic() {}
	function searchInstants() {}
	function uploadFile() {
		/* document.getElementById('file-upload-input').click() */
	}
    function handleFileUpload(_) {
		return () => {};
	}
	function controlMedia(_) {
		return () => {};
	}
	function rollExplodingDie(_) {
		return () => {};
	}
</script>

<svelte:head>
	<title>B.A.R.D. Handler Dashboard - Classified</title>
</svelte:head>


<main data-theme="classic">
	<audio id="handler-music-audio" loop style="display: none;"></audio>
	<audio id="handler-sfx-audio" style="display: none;"></audio>

	<div class="container">
		<h1>B.A.R.D. OPERATIONAL COMMAND HANDLER DASHBOARD // CLASSIFIED</h1>

		<div id="top-control-bar">
			<button id="theme-toggle" onclick={toggleTheme}>Toggle Theme (Classic)</button>
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
				<tbody> </tbody>
			</table>
			<!-- <button onclick={sortInitiative} style="margin-top: 10px;">SORT INITIATIVE</button> -->
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
				<h3>SKILL CHECK // 1D6! + ATTR + PROF</h3>
				<p style="font-size: 0.9em; margin: 0 0 5px 0;">1D6 explodes on 6.</p>
				<div style="display: flex; gap: 5px;">
					<input type="number" id="attr-mod" value="1" placeholder="Attr" style="flex: 1;" />
					<select id="prof-die" style="flex: 1;">
						<option value="0">None</option><option value="d4">+1d4 (Prof)</option><option value="d6"
							>+1d6 (Expert)</option
						>
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
				<input type="number" id="damage-mod" value="0" placeholder="Extra Mod/Ammunition" />
				<button onclick={rollExplodingDie('Damage Roll')}>ROLL DAMAGE</button>
			</div>

			<div class="die-roller">
				<h3>INITIATIVE ROLL</h3>
				<div style="display: flex; gap: 5px;">
					<input type="number" id="init-dex" value="1" placeholder="DEX" style="flex: 1;" />
					<input type="number" id="init-lck" value="1" placeholder="LCK" style="flex: 1;" />
				</div>
				<input type="text" id="init-name" value="Agent/NPC" placeholder="Name" />
				<button onclick={rollExplodingDie('Initiative')}>ROLL INITIATIVE</button>
			</div>

			<div id="roll-result" class="component-box" style="margin-top: 10px;">
				Roll details will appear here.
			</div>
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
<!-- 
<template id="projector-content">
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>B.A.R.D. Projector Output</title>
        <style>
            :root {
                --classic-primary: #C00000; --classic-secondary: #EAEAEA; --classic-background: #0A0A0A; --classic-component: #1F1F1F; --classic-accent: #00FF99;
                --modern-primary: #00FFFF; --modern-secondary: #FFFFFF; --modern-background: #282A36; --modern-component: #383A59; --modern-accent: #FF5555;
            }
            .proj-body { margin: 0; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; overflow: hidden; }
            .proj-container { max-width: 100%; max-height: 100%; aspect-ratio: 16 / 9; margin: auto; display: flex; flex-direction: column; box-shadow: 0 0 15px rgba(0, 0, 0, 0.7); }
            .proj-visual-pane { flex-grow: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: var(--classic-background); }
            .proj-visual-pane > * { max-width: 100%; max-height: 100%; object-fit: contain; border: 0; }
            .proj-roll-strip, .proj-now-playing { flex-shrink: 0; padding: 10px; text-align: center; border-top: 1px solid; font-family: 'Consolas', monospace; }

            /* Projector Theme Classes */
            .classic { background-color: var(--classic-background); }
            .classic .proj-container { border: 2px solid var(--classic-accent); }
            .classic .proj-roll-strip, .classic .proj-now-playing { color: var(--classic-accent); border-color: var(--classic-accent); background-color: var(--classic-component); }
            .modern { background-color: var(--modern-background); }
            .modern .proj-container { border: 2px solid var(--modern-primary); }
            .modern .proj-roll-strip, .modern .proj-now-playing { color: var(--modern-primary); border-color: var(--modern-primary); background-color: var(--modern-component); }
            
            /* Text display styles for the projector, using the body's current theme color */
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
    </head>
    <body class="proj-body classic">
        <div class="proj-container">
            <audio id="music-audio" loop></audio>
            <audio id="sfx-audio"></audio>
            <video id="proj-video" autoplay loop muted style="display: none;"></video>
            
            <div id="proj-visual-pane" class="proj-visual-pane">
                Waiting for Handler Input...
            </div>
            <div id="proj-roll-strip" class="proj-roll-strip"></div>
            <div id="proj-now-playing" class="proj-now-playing">Now Playing: STOPPED</div>
        </div>
    </body>
    </html>
</template>
 -->

<!-- 
<script>
    // --- Global State & Constants ---
    const MAX_CHARACTERS = 20;
    const tableBody = document.querySelector('#character-table tbody');
    let popupWindow = null;
    let currentTheme = localStorage.getItem('bardTheme') || 'classic';
    
    // Audio Elements for Handler's Local Playback
    let handlerMusicAudio;
    let handlerSfxAudio;
    let masterVolumeControl;
    let currentMusicTitle = "STOPPED"; // State tracking for background music

    // --- Placeholder Music Data (Simulated FMA results) ---
    const FMA_TRACKS = [
        { id: 1, title: "The Dark Archive Theme", url: "https://fma.sim/track/dark-archive.mp3", artist: "Ghost Writer" },
        { id: 2, title: "City of Whispers", url: "https://fma.sim/track/city-whispers.mp3", artist: "Urban Drone" },
        { id: 3, title: "Breach Protocol", url: "https://fma.sim/track/breach-protocol.mp3", artist: "Synthwave Hero" },
        { id: 4, title: "Silent Descent (Cinematic Sad Piano)", url: "https://fma.sim/track/silent-descent.mp3", artist: "Eugenio Mininni" },
        { id: 5, title: "Deep Space Mystery", url: "https://fma.sim/track/space-mystery.mp3", artist: "The Void" },
    ];
    
    // --- Placeholder Soundboard Data (Simulated MyInstants/Freesound) ---
    const SOUNDBOARD_SFX = [
        { name: "Pistol Shot", url: "https://sfx.sim/sfx/pistol.mp3" },
        { name: "Door Creak", url: "https://sfx.sim/sfx/creak.mp3" },
        { name: "Dramatic Sting", url: "https://sfx.sim/sfx/sting.mp3" },
        { name: "Glass Break", url: "https://sfx.sim/sfx/glass.mp3" },
        { name: "Small Explosion", url: "https://sfx.sim/sfx/explosion.mp3" },
        { name: "Computer Beep", url: "https://sfx.sim/sfx/beep.mp3" },
    ];

    // --- Persistence: Load/Save/Sort ---
    function storeStats() {
        const characters = [];
        for (let i = 1; i <= MAX_CHARACTERS; i++) {
            characters.push({
                name: document.getElementById(`name-${i}`).value,
                init: document.getElementById(`init-${i}`).value,
                hp: document.getElementById(`hp-${i}`).value,
                san: document.getElementById(`san-${i}`).value,
                afflictions: document.getElementById(`afflictions-${i}`).value,
                notes: document.getElementById(`notes-${i}`).value,
            });
        }
        localStorage.setItem('bardCharacterData', JSON.stringify(characters));
    }

    function loadStats() {
        const data = localStorage.getItem('bardCharacterData');
        if (!data) return;

        const characters = JSON.parse(data);
        characters.forEach((char, index) => {
            const i = index + 1;
            const nameEl = document.getElementById(`name-${i}`);
            if (nameEl && char) {
                nameEl.value = char.name || '';
                document.getElementById(`init-${i}`).value = char.init || '';
                document.getElementById(`hp-${i}`).value = char.hp || '';
                document.getElementById(`san-${i}`).value = char.san || '';
                document.getElementById(`afflictions-${i}`).value = char.afflictions || '';
                document.getElementById(`notes-${i}`).value = char.notes || '';
            }
        });
    }
    
    function sortInitiative() {
        // [Existing sortInitiative function logic remains the same]
        const characters = [];
        for (let i = 1; i <= MAX_CHARACTERS; i++) {
            const name = document.getElementById(`name-${i}`).value.trim();
            const init_str = document.getElementById(`init-${i}`).value.trim();
            const init_val = parseInt(init_str) || -1; 
            if (name === '' && init_val === -1) continue; 

            characters.push({
                name: name,
                init: init_val,
                init_str: init_str,
                hp: document.getElementById(`hp-${i}`).value,
                san: document.getElementById(`san-${i}`).value,
                afflictions: document.getElementById(`afflictions-${i}`).value,
                notes: document.getElementById(`notes-${i}`).value,
            });
        }

        characters.sort((a, b) => {
            if (a.init === -1 && b.init !== -1) return 1;
            if (a.init !== -1 && b.init === -1) return -1;
            if (a.init === -1 && b.init === -1) return 0;
            return b.init - a.init;
        });

        tableBody.innerHTML = '';
        characters.forEach((char, index) => {
            const rowNum = index + 1;
            const row = tableBody.insertRow();
            row.id = `char-row-sorted-${rowNum}`;

            row.innerHTML = `
                <td>${rowNum}</td>
                <td><input type="text" id="name-${rowNum}" placeholder="Agent ${rowNum} / NPC Name" onchange="storeStats()" value="${char.name}"></td>
                <td><input type="number" id="init-${rowNum}" placeholder="0" onchange="storeStats()" value="${char.init_str}"></td>
                <td><input type="text" id="hp-${rowNum}" placeholder="10/10" onchange="storeStats()" value="${char.hp}"></td>
                <td><input type="text" id="san-${rowNum}" placeholder="10/10" onchange="storeStats()" value="${char.san}"></td>
                <td><input type="text" id="afflictions-${rowNum}" placeholder="Broken Arm (-1 DEX)" onchange="storeStats()" value="${char.afflictions}"></td>
                <td><input type="text" id="notes-${rowNum}" placeholder="Evasion DC 14, DR 3" onchange="storeStats()" value="${char.notes}"></td>
            `;
        });
        
        for (let i = characters.length + 1; i <= MAX_CHARACTERS; i++) {
            createCharacterRow(i);
        }
        
        storeStats(); 
    }


    // --- Projector Window Communication & Dual Audio Control ---
    
    // Function to stop local audio elements
    function stopLocalMedia() {
        if (handlerMusicAudio) { 
            handlerMusicAudio.pause(); 
            handlerMusicAudio.removeAttribute('src'); 
            handlerMusicAudio.loop = false; // Ensure loop is disabled
        }
        if (handlerSfxAudio) { 
            handlerSfxAudio.pause(); 
            handlerSfxAudio.removeAttribute('src'); 
            handlerSfxAudio.onended = null; 
        }
        currentMusicTitle = "STOPPED";
    }
    
    // Function to handle Play/Pause/Stop from the controls panel (FIXED LOGIC)
    function controlMedia(action) {
        if (action === 'stop') {
            stopLocalMedia();
            sendCommand('stopAllMedia');
        } else if (action === 'togglePlayPause') {
            // Check if music is currently loaded and playing/paused
            if (handlerMusicAudio && handlerMusicAudio.src) {
                if (handlerMusicAudio.paused) {
                    handlerMusicAudio.play().catch(e => console.error("Local Music Playback Failed:", e));
                } else {
                    handlerMusicAudio.pause();
                }
            } 
            // Fallback: If no music, check if an SFX was paused and resume it
            else if (handlerSfxAudio && handlerSfxAudio.src) {
                if (handlerSfxAudio.paused) {
                     handlerSfxAudio.play().catch(e => console.error("Local SFX Playback Failed:", e));
                } else {
                    handlerSfxAudio.pause();
                }
            } else {
                console.log("No media source loaded to play/pause.");
            }
            
            // Send command to the projector popup
            sendCommand('togglePlayPause');
        }
    }
    
    // Function to set volume on both local and projector audio
    function setMasterVolume(volume) {
        // 1. Update local audio volume
        const vol = parseFloat(volume);
        if (handlerMusicAudio) handlerMusicAudio.volume = vol;
        if (handlerSfxAudio) handlerSfxAudio.volume = vol;
        
        // 2. Update display
        document.getElementById('volume-display').textContent = `${Math.round(vol * 100)}%`;
        
        // 3. Send command to projector popup
        sendCommand('setVolume', { volume: vol });
    }
    
    // The script injected into the popup window
    function getProjectorScript() {
        return `
            (function() {
                const visualPane = document.getElementById('proj-visual-pane');
                const rollStrip = document.getElementById('proj-roll-strip');
                const nowPlaying = document.getElementById('proj-now-playing');
                const projVideo = document.getElementById('proj-video');
                const musicAudio = document.getElementById('music-audio');
                const sfxAudio = document.getElementById('sfx-audio');
                let currentMusicTitle = "STOPPED"; 

                // Function to set initial volume (synced from opener)
                function setInitialVolume() {
                    if (window.opener && window.opener.masterVolumeControl) {
                        const vol = parseFloat(window.opener.masterVolumeControl.value);
                        musicAudio.volume = vol;
                        sfxAudio.volume = vol;
                    }
                }

                function stopAllMedia() {
                    // Stop all media elements in the popup
                    if (projVideo) { projVideo.pause(); projVideo.removeAttribute('src'); projVideo.style.display = 'none'; }
                    if (musicAudio) { musicAudio.pause(); musicAudio.removeAttribute('src'); musicAudio.loop = false; }
                    if (sfxAudio) { 
                        sfxAudio.pause(); 
                        sfxAudio.removeAttribute('src'); 
                        sfxAudio.onended = null; 
                    }
                    visualPane.innerHTML = 'Waiting for Handler Input...'; // Clear visual pane
                    nowPlaying.textContent = "Now Playing: STOPPED";
                    currentMusicTitle = "STOPPED";
                    console.log("All media stopped.");
                }
                
                function displayMedia(mediaHTML, type, source) {
                    stopAllMedia(); // Stop existing media before displaying new content
                    visualPane.innerHTML = mediaHTML;
                    
                    if (type.startsWith('audio/')) {
                        visualPane.innerHTML = '<div style="font-size: 2em;">Audio File: Playing</div>';
                        // Extracting source URL from the passed HTML string (for uploaded files)
                        const srcMatch = mediaHTML.match(/src="([^"]+)"/);
                        if (srcMatch) {
                            musicAudio.src = srcMatch[1]; 
                            musicAudio.loop = true; // Set loop for uploaded music
                            musicAudio.play().catch(e => console.error("Audio playback failed:", e));
                            currentMusicTitle = "UPLOADS (Music)";
                            nowPlaying.textContent = "Now Playing: " + currentMusicTitle;
                        }
                    } 
                }

                // Main message listener for communication from the Handler Dashboard
                window.addEventListener('message', (event) => {
                    const data = event.data;
                    if (!data || !data.type) return;

                    switch (data.type) {
                        case 'syncContent':
                            rollStrip.innerHTML = data.roll;
                            if (data.visual) { 
                                visualPane.innerHTML = data.visual; 
                            }
                            break;
                        case 'displayMedia':
                            displayMedia(data.html, data.mimeType, data.source);
                            break;
                        case 'stopAllMedia':
                            stopAllMedia();
                            break;
                        case 'setTheme':
                            document.body.classList.remove('classic', 'modern');
                            document.body.classList.add(data.theme);
                            break;
                        case 'setMusicTrack': 
                            stopAllMedia(); 
                            if (musicAudio) {
                                musicAudio.src = data.url;
                                musicAudio.loop = true; // Set loop for FMA tracks
                                musicAudio.play().catch(e => console.error("Music playback failed:", e));
                                currentMusicTitle = data.title;
                                nowPlaying.textContent = "Now Playing: " + currentMusicTitle;
                            }
                            break;
                        case 'playSFX': 
                            if (sfxAudio) {
                                sfxAudio.src = data.url;
                                sfxAudio.play().catch(e => console.error("SFX playback failed:", e));
                                nowPlaying.textContent = "Now Playing: SFX Triggered";
                                
                                sfxAudio.onended = () => {
                                    sfxAudio.removeAttribute('src'); 
                                    sfxAudio.onended = null; 
                                    
                                    // Restore music track title if music is still playing/paused
                                    if (musicAudio.src && !musicAudio.paused) {
                                        nowPlaying.textContent = "Now Playing: " + currentMusicTitle;
                                    } else if (musicAudio.src && musicAudio.paused) {
                                         nowPlaying.textContent = "Now Playing: PAUSED (" + currentMusicTitle + ")";
                                    } else {
                                        nowPlaying.textContent = "Now Playing: STOPPED";
                                    }
                                };
                            }
                            break;
                        case 'setVolume': 
                            musicAudio.volume = data.volume;
                            sfxAudio.volume = data.volume;
                            break;
                        case 'togglePlayPause': // FIXED: Logic for Play/Pause control
                             if (musicAudio.src) {
                                if (!musicAudio.paused) {
                                    musicAudio.pause();
                                    nowPlaying.textContent = "Now Playing: PAUSED (" + currentMusicTitle + ")";
                                } else {
                                    musicAudio.play().catch(e => console.error("Music playback failed:", e));
                                    nowPlaying.textContent = "Now Playing: " + currentMusicTitle;
                                }
                            } else if (sfxAudio.src) {
                                if (!sfxAudio.paused) {
                                    sfxAudio.pause();
                                } else {
                                    sfxAudio.play().catch(e => console.error("SFX playback failed:", e));
                                }
                                nowPlaying.textContent = "Now Playing: SFX Triggered (Toggled)";
                            }
                            break;
                    }
                }, false);
                
                // Set initial theme and volume on load
                window.onload = function() {
                    if (window.opener) {
                        document.body.classList.remove('classic', 'modern');
                        document.body.classList.add(window.opener.currentTheme);
                        setInitialVolume(); // Set initial volume
                    }
                };

            })();
        `;
    }

    function openProjectorWindow() {
        if (popupWindow && !popupWindow.closed) {
            popupWindow.focus();
            return;
        }
        
        const content = document.getElementById('projector-content').innerHTML;
        popupWindow = window.open("", "ProjectorOutput", "width=800,height=450,menubar=no,toolbar=no,location=no,status=no,resizable=yes");
        
        if (popupWindow) {
            popupWindow.document.write(content);
            
            // 1. Inject the Projector Logic Script
            const script = popupWindow.document.createElement('script');
            script.textContent = getProjectorScript();
            popupWindow.document.body.appendChild(script);

            popupWindow.document.close();
            
            // 2. Sync theme and content after a small delay
            syncProjectorTheme();
            sendCommand('syncContent', { roll: document.getElementById('obs-output-roll').innerHTML, visual: document.getElementById('obs-image-display').innerHTML });
            
        } else {
            alert("Could not open pop-up window. Check your browser's pop-up blocker settings.");
        }
    }
    
    function syncProjectorTheme() {
        if (popupWindow && !popupWindow.closed) {
            sendCommand('setTheme', { theme: currentTheme });
            const themeBtn = document.getElementById('theme-toggle');
            themeBtn.textContent = `Toggle Theme (${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)})`;
        }
    }
    
    function sendCommand(commandType, data = {}) {
        const message = { type: commandType, ...data };
        if (popupWindow && !popupWindow.closed) {
            popupWindow.postMessage(message, '*');
        } else {
            // console.warn("Projector is closed. Command not sent:", commandType);
        }
    }
    
    function toggleTheme() {
        currentTheme = currentTheme === 'classic' ? 'modern' : 'classic';
        document.body.setAttribute('data-theme', currentTheme);
        localStorage.setItem('bardTheme', currentTheme);
        syncProjectorTheme();
    }


    // --- File Handling Logic ---
    function handleFileUpload(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        const reader = new FileReader();
        const mimeType = file.type;
        
        reader.onload = function(e) {
            const dataURL = e.target.result;
            let htmlContent = '';
            let previewContent = '';
            let sourceType = 'visual';

            if (mimeType.startsWith('image/')) {
                htmlContent = `<img src="${dataURL}" alt="${file.name}">`;
                previewContent = htmlContent;
            } else if (mimeType.startsWith('video/')) {
                htmlContent = `<video id="proj-media" src="${dataURL}" autoplay loop muted></video>`;
                previewContent = `<video src="${dataURL}" style="max-width: 100%; max-height: 100%;" controls muted></video>`;
            } else if (mimeType.startsWith('audio/')) {
                // Audio: Send source to popup, and set local source
                stopLocalMedia();
                handlerMusicAudio.src = dataURL;
                handlerMusicAudio.loop = true; // Set loop for uploaded music
                handlerMusicAudio.play().catch(e => console.error("Local Audio Playback Failed:", e));
                currentMusicTitle = "UPLOADS (Music)";
                
                htmlContent = `<audio src="${dataURL}"></audio>`;
                previewContent = `<div><p>Audio File Loaded: <strong>${file.name}</strong></p><audio src="${dataURL}" controls></audio></div>`;
                sourceType = 'music';

            } else if (mimeType.startsWith('text/')) {
                const textReader = new FileReader();
                textReader.onload = function(e_text) {
                    const textContent = e_text.target.result;
                    htmlContent = `<pre class="proj-text-content">${textContent}</pre>`;
                    previewContent = `<pre style="font-size: 0.8em; max-height: 200px; overflow-y: scroll;">${textContent.substring(0, 500)}...</pre>`;

                    document.getElementById('obs-image-display').innerHTML = previewContent;
                    sendCommand('displayMedia', { html: htmlContent, mimeType: 'text/plain', source: 'visual' });
                };
                textReader.readAsText(file);
                return;
            } else {
                previewContent = `File type unsupported or unrecognized: ${mimeType}`;
                htmlContent = previewContent;
            }

            document.getElementById('obs-image-display').innerHTML = previewContent;
            sendCommand('displayMedia', { html: htmlContent, mimeType: mimeType, source: sourceType });

        };
        
        if (!mimeType.startsWith('text/')) {
            reader.readAsDataURL(file);
        }
    }


    // --- Dice Roller Logic (Remains the same) ---
    function rollExplodingDie(rollType) {
        const resultDiv = document.getElementById('roll-result');
        let finalTotal = 0;
        let output = '';
        let obsOutput = '';
        let components = [];
        
        const rollCoreD6 = () => {
            let total = 0;
            let rolls = [];
            let roll = 0;
            do {
                roll = Math.floor(Math.random() * 6) + 1;
                rolls.push(roll);
                total += roll;
            } while (roll === 6); 
            const annotatedRolls = rolls.map((r, index) => r === 6 && index < rolls.length - 1 ? '6!' : r).join(" + ");
            return { total, rolls: annotatedRolls };
        };
        
        const rollDamageDice = (diceStr, minDamage) => {
            let [numDice, dieSize] = diceStr.split('d').map(Number);
            let total = 0;
            let rollDetails = [];
            
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
        };
        
        const rollProficiencyDie = (type) => {
            if (type === 'd4') { return { roll: Math.floor(Math.random() * 4) + 1, desc: '1d4 (Proficient)' }; }
            if (type === 'd6') { return { roll: Math.floor(Math.random() * 6) + 1, desc: '1d6 (Expert)' }; }
            return { roll: 0, desc: 'N/A' };
        };


        if (rollType === 'Damage Roll') {
            const categoryValue = document.getElementById('damage-category').value;
            const [diceStr, minStr] = categoryValue.split(',');
            const extraMod = parseInt(document.getElementById('damage-mod').value) || 0; 
            const minDamage = parseInt(minStr) || 0; 

            if (diceStr === 'N/A') {
                finalTotal = minDamage + extraMod;
                components.push(`<strong>DAMAGE CATEGORY: Cat-Ω (Cosmic/Impossible)</strong>`);
                components.push(`<strong>BASE DAMAGE:</strong> ${minDamage} (Minimum 11+)`);
                obsOutput = `<span style="color: var(--classic-primary);">DAMAGE: ${finalTotal} (Cat-Ω)</span>`;
            } else {
                const dResult = rollDamageDice(diceStr, minDamage);
                finalTotal = dResult.total + extraMod;

                components.push(`<strong>DAMAGE ROLL:</strong> ${dResult.diceRolled}!`);
                components.push(`<strong>ROLLS:</strong> ${dResult.rolls}`);
                components.push(`<strong>BASE DAMAGE TOTAL:</strong> ${dResult.total} (Min applied: ${dResult.minApplied ? 'Yes' : 'No'})`);
                components.push(`<strong>EXTRA MODIFIER:</strong> ${extraMod}`);
                obsOutput = `<span style="color: ${finalTotal >= 10 ? 'var(--classic-primary)' : 'inherit'};">DAMAGE: ${finalTotal}</span>`;
            }
            
            output += `<strong>--- DAMAGE ROLL RESOLUTION ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>DAMAGE TOTAL:</strong> <span style="font-size: 1.5em;">${finalTotal}</span> (Apply DR)<br>`;
            
        } else if (rollType === 'Skill Check') {
            const d6Result = rollCoreD6();
            const attrMod = parseInt(document.getElementById('attr-mod').value) || 0;
            const profDieType = document.getElementById('prof-die').value;
            const sitMod = parseInt(document.getElementById('sit-mod-skill').value) || 0; 
            const prof = rollProficiencyDie(profDieType);
            
            finalTotal = d6Result.total + attrMod + prof.roll + sitMod;

            components.push(`<strong>CORE 1D6! ROLL:</strong> ${d6Result.total} (${d6Result.rolls})`);
            components.push(`<strong>ATTRIBUTE SCORE:</strong> ${attrMod}`);
            components.push(`<strong>PROFICIENCY DIE:</strong> ${prof.roll} (${prof.desc})`);
            components.push(`<strong>SITUATIONAL MOD:</strong> ${sitMod}`);
            
            output += `<strong>--- SKILL CHECK RESOLUTION ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>FINAL TOTAL:</strong> <span style="font-size: 1.5em;">${finalTotal}</span><br>`;
            obsOutput = `<span style="color: ${finalTotal >= 17 ? 'var(--classic-primary)' : 'inherit'};">SKILL CHECK: ${finalTotal}</span>`;

        } else if (rollType === 'Initiative') {
            const d6Result = rollCoreD6();
            const initDex = parseInt(document.getElementById('init-dex').value) || 0;
            const initLck = parseInt(document.getElementById('init-lck').value) || 0;
            const initName = document.getElementById('init-name').value || 'Unidentified';
            
            finalTotal = d6Result.total + initDex + initLck;

            components.push(`<strong>CORE 1D6! ROLL:</strong> ${d6Result.total} (${d6Result.rolls})`);
            components.push(`<strong>DEX SCORE:</strong> ${initDex}`);
            components.push(`<strong>LCK SCORE:</strong> ${initLck}`);
            
            output += `<strong>--- INITIATIVE ROLL for ${initName} ---</strong><br>${components.join('<br>')}<br>`;
            output += `<br><strong>INITIATIVE TOTAL:</strong> <span style="font-size: 1.5em;">${finalTotal}</span><br>`;
            
            let added = false;
            for (let i = 1; i <= MAX_CHARACTERS; i++) {
                const nameEl = document.getElementById(`name-${i}`);
                if (nameEl && !nameEl.value) {
                    nameEl.value = initName;
                    document.getElementById(`init-${i}`).value = finalTotal;
                    added = true;
                    break;
                }
            }
            if (!added) {
                 console.log("Tracker is full. Manually add/replace.");
            }
            sortInitiative(); 
            obsOutput = `INITIATIVE (${initName}): ${finalTotal}`;
        }
        
        resultDiv.innerHTML = output;
        
        const finalObsOutput = `<div style="font-size: 1.5em; padding: 5px;">${obsOutput}</div>`;
        document.getElementById('obs-output-roll').innerHTML = finalObsOutput;
        sendCommand('syncContent', { roll: finalObsOutput });
    }
    
    // --- Music and Sound Functionality ---
    function searchMusic() { 
        // [Existing searchMusic function logic remains the same]
        const query = document.getElementById('music-search').value.toLowerCase().trim();
        const resultsDiv = document.getElementById('music-results');
        resultsDiv.innerHTML = '';
        
        if (query.length < 3) {
            resultsDiv.innerHTML = 'Please enter at least 3 characters. Showing featured tracks.';
            
            FMA_TRACKS.forEach(track => {
                resultsDiv.innerHTML += createMusicResultHTML(track);
            });
            return;
        }

        const filteredTracks = FMA_TRACKS.filter(track => 
            track.title.toLowerCase().includes(query) || 
            track.artist.toLowerCase().includes(query)
        );

        if (filteredTracks.length === 0) {
            resultsDiv.innerHTML = 'No tracks found matching your query. (Simulated search)';
        } else {
            filteredTracks.forEach(track => {
                resultsDiv.innerHTML += createMusicResultHTML(track);
            });
        }
    }
    
    function createMusicResultHTML(track) {
        const encodedTitle = encodeURIComponent(track.title);
        return `
            <div class="music-result-item">
                <span><strong>${track.title}</strong> by ${track.artist}</span>
                <button onclick="playMusic('${track.url}', '${encodedTitle}')">Play</button>
            </div>
        `;
    }

    function playMusic(url, encodedTitle) {
        const title = decodeURIComponent(encodedTitle);
        
        // 1. Stop any existing media (local and remote)
        stopLocalMedia();
        sendCommand('stopAllMedia');

        // 2. Start local playback (FIXED: Set loop property)
        handlerMusicAudio.src = url;
        handlerMusicAudio.loop = true; 
        handlerMusicAudio.play().catch(e => {
            console.error("Local Music Playback Failed (Did you remember to click the page first?):", e);
        });
        currentMusicTitle = title;
        
        // 3. Send command to projector popup
        sendCommand('setMusicTrack', { url: url, title: title });
    }
    
    function searchInstants() {
        const query = document.getElementById('instant-search').value.toLowerCase().trim();
        let message = `Search for "${query}" not supported. Use the pre-loaded Soundboard below. (Simulated)`;
        
        if (query.includes('stop')) {
            controlMedia('stop'); // Use the new control function
            message = 'Media stop command sent to projector.';
        }
        
        const tempOutput = `<div style="font-size: 1.1em; color: var(--classic-primary); padding: 5px;">${message}</div>`;
        document.getElementById('obs-output-roll').innerHTML = tempOutput;
        sendCommand('syncContent', { roll: tempOutput });
    }
    
    function populateSoundboard() {
        const soundboardDiv = document.getElementById('soundboard');
        soundboardDiv.innerHTML = '';
        
        SOUNDBOARD_SFX.forEach(sfx => {
            const button = document.createElement('button');
            button.textContent = sfx.name;
            button.setAttribute('onclick', `playSound('${sfx.url}')`);
            soundboardDiv.appendChild(button);
        });
    }
    
    function playSound(url) {
        // 1. Stop any existing SFX only (not music)
        if (handlerSfxAudio) { 
            handlerSfxAudio.pause(); 
            handlerSfxAudio.removeAttribute('src'); 
            handlerSfxAudio.onended = null;
        }

        // 2. Start local SFX playback
        handlerSfxAudio.src = url;
        handlerSfxAudio.play().catch(e => console.error("Local SFX Playback Failed:", e));
        
        // 3. Set up onended listener for local SFX
        handlerSfxAudio.onended = () => {
            handlerSfxAudio.removeAttribute('src'); // Cleanup
            handlerSfxAudio.onended = null; 
        };

        // 4. Send command to projector popup
        sendCommand('playSFX', { url: url });
    }


    // --- Initialization ---
    function createCharacterRow(i) {
        const row = tableBody.insertRow();
        row.id = `char-row-${i}`;
        
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="text" id="name-${i}" placeholder="Agent ${i} / NPC Name" onchange="storeStats()"></td>
            <td><input type="number" id="init-${i}" placeholder="0" onchange="storeStats()"></td>
            <td><input type="text" id="hp-${i}" placeholder="10/10" onchange="storeStats()"></td>
            <td><input type="text" id="san-${i}" placeholder="10/10" onchange="storeStats()"></td>
            <td><input type="text" id="afflictions-${i}" placeholder="Broken Arm (-1 DEX)" onchange="storeStats()"></td>
            <td><input type="text" id="notes-${i}" placeholder="Evasion DC 14, DR 3" onchange="storeStats()"></td>
        `;
    }

    function generateTable() {
        tableBody.innerHTML = '';
        for (let i = 1; i <= MAX_CHARACTERS; i++) {
            createCharacterRow(i);
        }
        loadStats();
    }
    
    // Function to ensure theme is applied from local storage on first load
    function applyThemeOnLoad() {
        document.body.setAttribute('data-theme', currentTheme);
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.textContent = `Toggle Theme (${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)})`;
        }
    }
    
    // Function to hook up audio elements and set initial volume
    function initializeAudioControls() {
        handlerMusicAudio = document.getElementById('handler-music-audio');
        handlerSfxAudio = document.getElementById('handler-sfx-audio');
        masterVolumeControl = document.getElementById('master-volume');
        
        // Set initial volume on load
        const initialVolume = parseFloat(masterVolumeControl?.value);
        handlerMusicAudio.volume = initialVolume;
        handlerSfxAudio.volume = initialVolume;
        document.getElementById('volume-display').textContent = `${Math.round(initialVolume * 100)}%`;
        
        // Add event listeners to sync volume immediately on change
        masterVolumeControl.addEventListener('input', (e) => setMasterVolume(e.target.value));
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyThemeOnLoad();
        initializeAudioControls();
        generateTable();
        populateSoundboard();
        searchMusic(); // Populate initial music results with featured tracks
    });
</script>
 -->

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
