
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

    reader.onload = function (e) {
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
            textReader.onload = function (e_text) {
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
function _rollExplodingDie(rollType) {
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
