document.addEventListener('DOMContentLoaded', () => {
 const installScreen = document.getElementById('installScreen');
  const gameScreen = document.getElementById('gameScreen');
  const homeScreen = document.getElementById('homeScreen');
  const settingsScreen = document.getElementById('settingsScreen');
  const playGameBtn = document.getElementById('playGameBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const backToHomeBtn = document.getElementById('backToHomeBtn');
  const versionLabel = document.getElementById('versionLabel');
  const deleteDataBtn = document.getElementById('deleteDataBtn');
  
  const musicToggle = document.getElementById('musicToggle');
  const sfxToggle = document.getElementById('sfxToggle');
  const musicVolumeInput = document.getElementById('musicVolume');
  const sfxVolumeInput = document.getElementById('sfxVolume');
  
  const quickSettingsBtn = document.getElementById('quickSettingsBtn');
  const quickSettingsOverlay = document.getElementById('quickSettingsOverlay');
  const closeQuickSettingsBtn = document.getElementById('closeQuickSettingsBtn');
  const saveExitBtn = document.getElementById('saveExitBtn');
  const quickMusicToggle = document.getElementById('quickMusicToggle');
  const quickSfxToggle = document.getElementById('quickSfxToggle');
  const quickMusicVolumeInput = document.getElementById('quickMusicVolume');
  const quickSfxVolumeInput = document.getElementById('quickSfxVolume');
  
  const homeTotalCards = document.getElementById('homeTotalCards');
  const homeOverallAcc = document.getElementById('homeOverallAcc');
  const homeBestStreak = document.getElementById('homeBestStreak');
  
  const installBtn = document.getElementById('installBtn');
  const overlay = document.getElementById('installOverlay');
  const closeOverlay = document.getElementById('closeOverlay');
  // Game UI elements
  const boardContainer = document.getElementById('board');
  const goalGrid = document.getElementById('goalGrid');
  const movesDisplay = document.getElementById('movesDisplay');
  const rotateBtn = document.getElementById('rotateBtn');
  const mirrorHBtn = document.getElementById('mirrorHBtn');
  const mirrorVBtn = document.getElementById('mirrorVBtn');
  const newGoalBtn = document.getElementById('newGoalBtn');
  const setupPanel = document.getElementById('setupPanel');
  const bidInput = document.getElementById('bidInput');
  const bidDownBtn = document.getElementById('bidDownBtn');
  const bidUpBtn = document.getElementById('bidUpBtn');
  const penaltyDisplay = document.getElementById('penaltyDisplay');
  const playBtn = document.getElementById('playBtn');
  const bigMovesDisplay = document.getElementById('bigMovesDisplay');
  const winCounterDisplay = document.getElementById('winCounterDisplay');
  const winPopup = document.getElementById('winPopup');
  const winRankText = document.getElementById('winRank');
  const winScoreText = document.getElementById('winScore');
  const winOkBtn = document.getElementById('winOkBtn');
  const losePopup = document.getElementById('losePopup');
  const loseOkBtn = document.getElementById('loseOkBtn');

  // Testing override:
  // Set to `true` to force standalone/gameScreen, `false` to force installScreen,
  // or `null` to use the real environment detection (default).
  // For production builds you can uncomment and set to null or remove this line.
  // Example (uncomment to force game view while testing):
  // const TEST_FORCE_STANDALONE = true;
   const TEST_FORCE_STANDALONE = true; // Set to true to force standalone/gameScreen, false to force installScreen, or null to use real detection
   const APP_VERSION = "0.006";
  const SAVE_KEY = 'BOTHMCB_SAVE';

  // Data & Settings state
  let longestStreak = 0;
  let totalCards = 0;
  let totalAccuracySum = 0;
  let currentStreak = 0;
  
  let musicEnabled = true;
  let sfxEnabled = true;
  let musicVolume = 0.5;
  let sfxVolume = 0.5;

  const musicMenu = new Audio('sound/menu_music.mp3');
  const musicGame = new Audio('sound/game_music.mp3');
  musicMenu.loop = true;
  musicGame.loop = true;

  const sfxMove = new Audio('sound/move.wav');
  const sfxWin = new Audio('sound/win.wav');
  const sfxLose = new Audio('sound/lose.wav');
  const sfxRotate = new Audio('sound/rotate.wav');
  const sfxMirrorH = new Audio('sound/mirrorH.wav');
  const sfxMirrorV = new Audio('sound/mirrorV.wav');
  const sfxNewGoal = new Audio('sound/newGoal.wav');

  function startMenuMusic() {
      musicGame.pause();
      musicGame.currentTime = 0;
      if (musicEnabled && musicMenu.paused) {
          musicMenu.volume = musicVolume;
          musicMenu.play().catch(e=>{});
      }
  }

  function stopMenuMusic() {
      musicMenu.pause();
  }

  function startGameMusic() {
      musicMenu.pause();
      musicMenu.currentTime = 0;
      if (musicEnabled && musicGame.paused) {
          musicGame.volume = musicVolume;
          musicGame.play().catch(e=>{});
      }
  }

  function stopGameMusic() {
      musicGame.pause();
  }

  function applyMusicSettings() {
      musicMenu.volume = musicVolume;
      musicGame.volume = musicVolume;
      if (!musicEnabled) {
          musicMenu.pause();
          musicGame.pause();
      } else {
          if (!gameScreen.classList.contains('hidden')) {
              musicMenu.pause(); // definitively mute the other channel
              if (musicGame.paused) musicGame.play().catch(e=>{});
          } else if (!homeScreen.classList.contains('hidden') || !settingsScreen.classList.contains('hidden')) {
              musicGame.pause(); // definitively mute the other channel
              if (musicMenu.paused) musicMenu.play().catch(e=>{});
          } else {
              musicMenu.pause();
              musicGame.pause();
          }
      }
  }

  function playMove() {
      if (sfxEnabled) { sfxMove.volume = sfxVolume; sfxMove.currentTime = 0; sfxMove.play().catch(e=>{}); }
  }
  function playWin() {
      if (sfxEnabled) { sfxWin.volume = sfxVolume; sfxWin.currentTime = 0; sfxWin.play().catch(e=>{}); }
  }
  function playLose() {
      if (sfxEnabled) { sfxLose.volume = sfxVolume; sfxLose.currentTime = 0; sfxLose.play().catch(e=>{}); }
  }
  function playRotate() {
      if (sfxEnabled) { sfxRotate.volume = sfxVolume; sfxRotate.currentTime = 0; sfxRotate.play().catch(e=>{}); }
  }
  function playMirrorH() {
      if (sfxEnabled) { sfxMirrorH.volume = sfxVolume; sfxMirrorH.currentTime = 0; sfxMirrorH.play().catch(e=>{}); }
  }
  function playMirrorV() {
      if (sfxEnabled) { sfxMirrorV.volume = sfxVolume; sfxMirrorV.currentTime = 0; sfxMirrorV.play().catch(e=>{}); }
  } 
  function playNewGoal() {
      if (sfxEnabled) { sfxNewGoal.volume = sfxVolume; sfxNewGoal.currentTime = 0; sfxNewGoal.play().catch(e=>{}); }
  }

function showWinPopup(rank, accuracyPercent, cardScore, repeatCount = 0, repeatPenaltyPercent = 0, rawAccuracyPercent = accuracyPercent) {
  if (winRankText) winRankText.innerHTML = getRankSVG(rank);
  if (winScoreText) {
    winScoreText.innerHTML = `Card Score: ${cardScore} (${accuracyPercent}%)<br>Base Accuracy: ${rawAccuracyPercent}%<br>Repeated States: ${repeatCount}<br>Repeat Penalty: -${repeatPenaltyPercent}%`;
  }
  winPopup?.classList.remove('hidden');
}


    function hideWinPopup() {
      winPopup?.classList.add('hidden');
    }

    function showLosePopup() {
      losePopup?.classList.remove('hidden');
    }

    function hideLosePopup() {
      losePopup?.classList.add('hidden');
    }

    function finalizeWinRound() {
      goalGrid.classList.remove("goal-hover");
      bigMovesDisplay.classList.remove("big-moves-hover");
      phase = 'setup';
      setupPanel.classList.remove('hidden');
      setTimeout(() => {
      setupPanel.classList.remove('fade-out');
      }, 10);
      bigMovesDisplay.classList.add('hidden');
      generateRandomGoal();
      randomizeBoard();
      pendingResult = null;
      hideWinPopup();
      updateRunStatsDisplay();
      // showHome();
    }

    function finalizeLoseRound() {
      goalGrid.classList.remove("goal-hover");
      bigMovesDisplay.classList.remove("big-moves-hover");
      winCount = 0;
      totalAccuracy = 0;
      lastRoundAccuracy = null;
      updateRunStatsDisplay();

      phase = 'setup';
      setupPanel.classList.remove('hidden');
      setTimeout(() => {
      setupPanel.classList.remove('fade-out');
      }, 10);
      bigMovesDisplay.classList.add('hidden');
      generateRandomGoal();
      randomizeBoard();
      pendingResult = null;
      hideLosePopup();
      clearInProgressGame();
      showHome();
    }

  function syncSettingsUI() {
      if(musicToggle) musicToggle.checked = musicEnabled;
      if(quickMusicToggle) quickMusicToggle.checked = musicEnabled;
      if(sfxToggle) sfxToggle.checked = sfxEnabled;
      if(quickSfxToggle) quickSfxToggle.checked = sfxEnabled;
      
      if(musicVolumeInput) musicVolumeInput.value = musicVolume;
      if(quickMusicVolumeInput) quickMusicVolumeInput.value = musicVolume;
      if(sfxVolumeInput) sfxVolumeInput.value = sfxVolume;
      if(quickSfxVolumeInput) quickSfxVolumeInput.value = sfxVolume;
  }

  function updateSettings(type, val) {
      if (type === 'musicToggle') musicEnabled = val;
      if (type === 'sfxToggle') sfxEnabled = val;
      if (type === 'musicVolume') musicVolume = parseFloat(val);
      if (type === 'sfxVolume') sfxVolume = parseFloat(val);
      
      syncSettingsUI();
      saveData();
      applyMusicSettings();
  }

  function loadData() {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY)) || {};
      longestStreak = data.longestStreak || 0;
      totalCards = data.totalCards || 0;
      totalAccuracySum = data.totalAccuracySum || 0;
      currentStreak = data.currentStreak || 0;
      inProgressGame = data.inProgressGame || null;
      
      musicEnabled = data.musicEnabled !== undefined ? data.musicEnabled : true;
      sfxEnabled = data.sfxEnabled !== undefined ? data.sfxEnabled : true;
      musicVolume = data.musicVolume !== undefined ? data.musicVolume : 0.5;
      sfxVolume = data.sfxVolume !== undefined ? data.sfxVolume : 0.5;
      
      syncSettingsUI();
      applyMusicSettings();
      updateHomeStats();
  }

  function saveData() {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        longestStreak,
        totalCards,
        totalAccuracySum,
        currentStreak,
        musicEnabled,
        sfxEnabled,
        musicVolume,
        sfxVolume,
        inProgressGame
      }));
  }

  function resetData() {
      localStorage.removeItem(SAVE_KEY);
      currentStreak = 0;
      inProgressGame = null;
      winCount = 0;
      totalAccuracy = 0;
      lastRoundAccuracy = null;
      loadData();
      alert("All data deleted!");
  }

  function updateHomeStats() {
      const acc = totalCards > 0 ? Math.round((totalAccuracySum / totalCards) * 100) : 0;
      if (homeTotalCards) homeTotalCards.textContent = totalCards;
      if (homeOverallAcc) homeOverallAcc.textContent = acc + '%';
      if (homeBestStreak) homeBestStreak.textContent = longestStreak;
      
      if (versionLabel) versionLabel.textContent = APP_VERSION;
  }

      function getRunOverallAccuracy() {
        return winCount > 0 ? totalAccuracy / winCount : 0;
      }

      function updateRunStatsDisplay() {
        if (!winCounterDisplay) return;
        if (winCount <= 0 || lastRoundAccuracy === null) {
          winCounterDisplay.textContent = 'Cards Matched: 0';
          return;
        }

        const overallAcc = getRunOverallAccuracy();
        const lastRankSVG = getRankSVG(getRank(lastRoundAccuracy));
        const overallRankSVG = getRankSVG(getRank(overallAcc));

        winCounterDisplay.innerHTML = `
      <span class="wc-item">
        <span class="wc-label">Last:</span>
        <span class="wc-rank">${lastRankSVG}</span>
        <span class="wc-percent">${Math.round(lastRoundAccuracy * 100)}%</span>
      </span>
      <span class="wc-item">
        <span class="wc-label">Cards:</span>
        <span class="wc-value">${winCount}</span>
      </span>
      <span class="wc-item">
        <span class="wc-label">Overall:</span>
        <span class="wc-rank">${overallRankSVG}</span>
        <span class="wc-percent">${Math.round(overallAcc * 100)}%</span>
      </span>
      `;
      }

      function captureInProgressGame() {
        return {
          phase,
          board: cloneMatrix(board),
          baseGoal: cloneMatrix(baseGoal),
          goalPieces: goalPieces.slice(),
          rotateState,
          mirrorHState,
          mirrorVState,
          declaredMoves,
          remainingMoves,
          bidValue: bidInput ? bidInput.value : '10',
          winCount,
          totalAccuracy,
          lastRoundAccuracy
        };
      }

      function clearInProgressGame() {
        inProgressGame = null;
        saveData();
      }

      function restoreInProgressGame(savedGame) {
        if (!savedGame) return false;

        phase = savedGame.phase || 'setup';
        board = cloneMatrix(savedGame.board || board);
        baseGoal = cloneMatrix(savedGame.baseGoal || baseGoal);
        goalPieces = Array.isArray(savedGame.goalPieces) ? savedGame.goalPieces.slice() : goalPieces;
        rotateState = savedGame.rotateState || 0;
        mirrorHState = savedGame.mirrorHState || 0;
        mirrorVState = savedGame.mirrorVState || 0;
        declaredMoves = savedGame.declaredMoves || 0;
        remainingMoves = savedGame.remainingMoves || 0;
        winCount = savedGame.winCount || 0;
        totalAccuracy = savedGame.totalAccuracy || 0;
        lastRoundAccuracy = savedGame.lastRoundAccuracy ?? null;
        selectedCell = null;
        possibleMoves = [];
        pendingResult = null;

        if (bidInput && savedGame.bidValue !== undefined) {
          bidInput.value = savedGame.bidValue;
        }

        applyTransforms();
        resetRepeatStateTracking(board);
        renderBoard(board);
        updateRunStatsDisplay();

        if (phase === 'play') {
          setupPanel.classList.add('hidden');
          setupPanel.classList.add('fade-out');
          bigMovesDisplay.classList.remove('hidden');
          bigMovesDisplay.textContent = Math.max(0, remainingMoves);
        } else {
          phase = 'setup';
          setupPanel.classList.remove('hidden');
          setupPanel.classList.remove('fade-out');
          bigMovesDisplay.classList.add('hidden');
        }

        return true;
      }

      function startFreshGameSession() {
        phase = 'setup';
        winCount = 0;
        totalAccuracy = 0;
        lastRoundAccuracy = null;
        selectedCell = null;
        possibleMoves = [];
        pendingResult = null;
        if (bidInput) bidInput.value = 10;
        setupPanel.classList.remove('hidden');
        setupPanel.classList.remove('fade-out');
        bigMovesDisplay.classList.add('hidden');
        generateRandomGoal();
        randomizeBoard();
        updateRunStatsDisplay();
      }

  // Game state
  let phase = 'setup'; // 'setup' | 'play'
  let winCount = 0;

  let board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];

  let baseGoal = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];

  let goal = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];

  let rotateState = 0; // 0,1,2,3
  let mirrorHState = 0; // 0,1
  let mirrorVState = 0; // 0,1

  let declaredMoves = 0;
  let remainingMoves = 0;

  let selectedCell = null; // {r,c}
  let possibleMoves = [];
  let gameInputUnlockAt = 0;
  let visitedStates = new Map();
  let repeatStateCount = 0;

  let totalAccuracy = 0;
  let lastRoundAccuracy = null;
  let inProgressGame = null;
  let pendingResult = null; // 'win' | 'lose' | null

  // Goal pieces (5-piece card)
  let goalPieces = [0,0,0,0,0];

  const PIECE_SVG = {
    0: "", // empty cell
    1: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="piece-svg">
  <defs>
    <style>
      .cls-1 {
        fill: #ffffff;
      }
    </style>
  </defs>
  <path class="cls-1" d="M60.82,37.3c.53.61,1.13,1.16,1.61,1.82,1-.6,1.94-1.3,2.86-2.02.15-.15.49-.31.29-.57-.55-.75-1.28-1.33-1.91-2.01-1.1.77-1.94,1.83-2.86,2.79h0Z"/>
  <path class="cls-1" d="M60.14,36.68c.78-.73,1.5-1.53,2.29-2.24.2-.17.33-.4.45-.63-.93-.64-1.76-1.42-2.74-1.98-.84,1.05-1.52,2.23-2.19,3.39.77.42,1.46.98,2.2,1.47h0Z"/>
  <path class="cls-1" d="M54.85,33.57c.79.27,1.54.61,2.24,1.08.77-1.02,1.42-2.12,2.16-3.16-.56-.51-1.31-.74-1.98-1.05-1.68-.64-3.4-1.19-5.15-1.6.94,1.08,1.67,2.33,2.2,3.66.16.36.26.76.54,1.06h0Z"/>
  <path class="cls-1" d="M64.56,41.89c1.19-.73,2.52-1.25,3.63-2.12-.5-.85-1.04-1.69-1.75-2.39-1.15.81-2.28,1.66-3.35,2.56.53.62,1.02,1.26,1.47,1.94h0Z"/>
  <path class="cls-1" d="M65.77,44.79c.52,0,1-.23,1.48-.41.92-.36,1.89-.63,2.76-1.13-.18-.78-.58-1.49-.98-2.18-.13-.22-.32-.61-.64-.4-1.14.75-2.39,1.32-3.52,2.1.38.63.66,1.31.89,2.01h0Z"/>
  <path class="cls-1" d="M66.81,49.75c1.61,0,3.22.13,4.83.15.04-1.98-.51-3.91-1.2-5.74-1.48.3-2.88.94-4.26,1.54.34,1.33.59,2.68.63,4.05h0Z"/>
  <path class="cls-1" d="M66.82,69.67c.23-.21.23-.56.36-.83.15-.53.53-.99.48-1.57-1.47-.6-2.93-1.24-4.42-1.81-.29.76-.6,1.52-.71,2.33,1.18.43,2.27,1.06,3.4,1.61.29.1.57.35.89.27h0Z"/>
  <path class="cls-1" d="M37.62,81.92c-.36.02-.74-.04-1.08.11-1.02.5-.74,2.22.41,2.29,8.63,0,17.25,0,25.88-.02.94.13,1.65-1.11,1.1-1.87-.3-.55-1-.51-1.53-.52-8.26-.04-16.53,0-24.79,0h0Z"/>
  <path class="cls-1" d="M43.39,40.27c1.15.29,2.33.37,3.51.44-1.16.44-2.16,1.19-3.29,1.69-.73.32-1.76.13-2.1-.65-.27-1.02,1-1.74,1.88-1.47h0ZM54.01,59.86c-1.7,2.39-3.28,4.92-4.2,7.73-.81,2.41-1.06,5.09-.18,7.51.35,1.12,1.01,2.1,1.58,3.11-1.95-.73-3.53-2.44-4.03-4.47-.83-2.77-.09-5.74,1.17-8.26,2.08-3.8,5.2-6.93,8.52-9.67-.79,1.45-1.9,2.7-2.85,4.05h0ZM31.39,55.43c.8.77,1.71,1.69,2.91,1.64,1.31-.54,2.07-1.85,2.94-2.9,2.93-1.38,6.26-1.54,9.45-1.4,1.77.1,3.68.02,5.22-.99,2.44-1.53,3.97-4.57,3.32-7.44-.22-1.26-.97-2.33-1.38-3.53,2.67,1.37,3.45,4.89,2.51,7.56-.56,1.98-2.08,3.45-3.63,4.7-3.45,2.72-7.02,5.34-10.06,8.54-2.57,2.74-5.06,5.66-6.61,9.13-1.32,2.91-1.87,6.18-1.49,9.35.43.06.86.18,1.23.43,2.59.15,5.19.04,7.78.05,4.2,0,8.41,0,12.62,0,2.32-.05,4.66.08,6.98-.11-.94-1.14-1.89-2.3-2.44-3.69-.85-2.2-.88-4.65-.3-6.91.65-2.62,1.66-5.13,2.49-7.7,1.41-4.49,3.02-9.13,2.4-13.9-.91-6.04-5.39-11.36-11.12-13.42-.23-.11-.53-.13-.7-.32-.89-3.9-4.02-7.2-7.86-8.31-.26,3.74.83,8.05,4.23,10.12-.73-.04-1.48-.13-2.1-.54-.76-.42-1.25-1.16-1.86-1.76-2.49,1.51-4.85,3.24-7.08,5.11-.39.34-.79.69-1.02,1.17.35.27.7.55,1.04.85-2.83,1.9-5.74,3.69-8.56,5.6-.55.38-1.2.69-1.58,1.25-.91,2.21.08,4.69,1.61,6.35,1.48-.9,2.99-1.83,4.64-2.38-1.02,1.31-2.37,2.29-3.55,3.45h0Z"/>
  <path class="cls-1" d="M31.36,92.89c.24.79.92,1.58,1.82,1.51,11.21.05,22.42.03,33.63,0,1.29.08,2.1-1.3,2.08-2.45.11-1.66-.99-3.2-2.47-3.85-1.35-.63-3.02-1.11-3.67-2.61-6.32-.02-12.63.02-18.94,0-2.18.06-4.37-.1-6.54.09-.78,1.91-3.12,1.98-4.54,3.19-1.23.94-1.8,2.63-1.37,4.12h0Z"/>
  <path class="cls-1" d="M62.17,76.66c.74,1.45,1.84,2.83,3.37,3.49.08-2.2-.28-4.41.08-6.6-.71-.56-1.49-1.01-2.16-1.62.74.3,1.44.85,2.27.83.45-.54.45-1.31.74-1.93.21-.33-.21-.52-.44-.65-1.23-.63-2.48-1.23-3.75-1.79-1.11,2.59-1.27,5.68-.11,8.28h0Z"/>
  <path class="cls-1" d="M68.08,63.93c-1.3-.46-2.6-.93-3.9-1.4-.21.75-.54,1.45-.69,2.22,1.12.61,2.34,1.01,3.5,1.55.31.1.61.36.97.28.33-.61.48-1.31.74-1.94.15-.39-.34-.58-.62-.7h0Z"/>
  <path class="cls-1" d="M71.03,54.33c-1.46-.29-2.95-.48-4.43-.64-.11.73-.31,1.43-.42,2.16,1.5.44,3.03.81,4.56,1.09.45-.25.31-.94.48-1.38.03-.4.4-1.09-.19-1.23h0Z"/>
  <path class="cls-1" d="M71.58,50.89c-1.56-.21-3.14-.19-4.7-.27-.05.74-.1,1.47-.15,2.21,1.47.39,3,.51,4.5.77.42-.02.31-.51.37-.79,0-.64.16-1.31-.02-1.93h0Z"/>
  <path class="cls-1" d="M70.04,57.58c-1.35-.33-2.7-.69-4.08-.91-.14.73-.35,1.45-.57,2.16,1.49.61,3.06.99,4.6,1.45.38-.68.51-1.46.67-2.22.12-.38-.39-.4-.63-.49h0Z"/>
  <path class="cls-1" d="M67.95,95.74c-10.04,0-20.08,0-30.12,0-2.04.05-4.09-.1-6.12.06-1.15.31-1.81,1.88-.97,2.82.63.7,1.62.42,2.45.46,11.66,0,23.32-.02,34.97.01,1.03-.03,1.87-1.25,1.45-2.21-.27-.64-.93-1.17-1.65-1.13h0Z"/>
  <path class="cls-1" d="M69.03,60.75c-1.3-.34-2.54-.89-3.86-1.12-.21.7-.44,1.4-.68,2.09,1.43.78,3.01,1.29,4.59,1.7.2-.68.46-1.34.67-2.01.16-.45-.43-.54-.71-.66h0Z"/>
</svg>`,
    2: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="piece-svg">
  <defs>
    <style>
      .cls-1 {
        fill: #ffffff;
      }
    </style>
  </defs>
  <path class="cls-1" d="M40.27,83.35c6.42.02,12.85.02,19.27.02.58.03,1.06-.64.95-1.19-.16-.49-.69-.77-1.19-.73-5.76.05-11.51.01-17.27.02-.64.04-1.32-.15-1.92.12-.8.35-.67,1.53.15,1.76h0Z"/>
  <path class="cls-1" d="M42.02,63.83c5.1.19,10.2.01,15.3.09.67-.03,1.53.07,1.93-.6.61-.7.07-1.89-.82-1.97-5.47.02-10.95,0-16.43.03-.09.02-.28.06-.37.09-1.27.33-.88,2.41.38,2.36h0Z"/>
  <path class="cls-1" d="M45.03,65.09c-.08,5.16-1.15,10.25-2.71,15.16,5.22.04,10.43.04,15.65,0-1.63-4.87-2.67-10-2.62-15.15-3.44-.03-6.88.02-10.32-.02h0Z"/>
  <path class="cls-1" d="M55.61,57.97c-4,.04-8-.02-12,.03-1.2.03-1.16,2.13,0,2.18,4.34.03,8.69,0,13.04,0,1,.14,1.38-1.33.72-1.92-.46-.47-1.18-.25-1.76-.28h0Z"/>
  <path class="cls-1" d="M35.22,94.07c.57.1,1.15.09,1.72.1,9.09,0,18.17.02,27.26,0,.89.02,1.59-.75,1.77-1.56.3-1.32-.23-2.77-1.26-3.62-1.02-.81-2.34-1.14-3.35-1.97-.87-.63-1.46-1.56-1.9-2.53-6.28-.08-12.56.02-18.84,0-.29.77-.65,1.54-1.26,2.11-.99,1.03-2.42,1.4-3.59,2.16-1.24.81-1.95,2.39-1.64,3.85.1.63.53,1.2,1.11,1.46h0Z"/>
  <path class="cls-1" d="M55.57,56.71c.37.08.52-.3.71-.53,1.74-2.64,2.61-5.8,2.72-8.94.11-4.43-1.7-8.79-4.65-12.06-.98-1.1-2.2-1.93-3.34-2.85,1.05-.39,1.92-1.42,1.83-2.58-.04-1.32-1.32-2.37-2.6-2.35-1.45-.05-2.78,1.32-2.57,2.79.09,1.01.91,1.7,1.7,2.22-4.67,3.03-7.7,8.39-7.93,13.94-.15,3.66.97,7.34,3.08,10.34,3.68.06,7.37-.04,11.05.03h0Z"/>
  <path class="cls-1" d="M64.61,95.37c-9.11.03-18.23-.04-27.35.02-.77.02-1.53-.01-2.29.04-1.02.08-1.92,1.05-1.83,2.08.09.79.74,1.58,1.58,1.57,9.75.02,19.49,0,29.24,0,.72-.04,1.55.17,2.16-.33.82-.59.99-1.88.31-2.64-.42-.56-1.13-.8-1.82-.75h0Z"/>
</svg>`,
    3: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="piece-svg">
  <defs>
    <style>
      .cls-1 {
        fill: #ffffff;
      }
    </style>
  </defs>
  <path class="cls-1" d="M39.72,53.87c6.78-.02,13.57-.03,20.35,0,.55-.03,1.01-.56.95-1.11.04-3.33,0-6.66.03-9.98-.28-.21-.61-.3-.96-.27-1.12,0-2.23,0-3.34,0-.27.05-.77-.1-.83.29-.2,1.66.17,3.38-.11,5.01-.7.18-1.44.1-2.15.11-.29-.05-.7.05-.9-.21-.08-1.62.04-3.25-.04-4.87-.04-.07-.12-.21-.16-.27-1.69-.12-3.39,0-5.08-.03-.06.07-.17.2-.23.27-.08,1.67.11,3.36-.04,5.03-1,.03-2.01.09-3.01-.01-.23-1.7.03-3.46-.13-5.18l-.13-.11c-1.64-.02-3.29,0-4.94-.03-.09.23-.13.48-.14.73.06,3.26.01,6.52.06,9.78-.03.45.39.78.8.85h0Z"/>
  <path class="cls-1" d="M39.36,83.44c7.05.03,14.11,0,21.17.03.55.04,1.08-.52.96-1.07-.15-.39-.54-.67-.95-.68-5.61.02-11.22,0-16.83.01-1.1.06-2.2.03-3.3-.01-.48.01-1.01-.1-1.44.17-.78.38-.42,1.54.41,1.54h0Z"/>
  <path class="cls-1" d="M34.19,93.99c.62.25,1.33.1,1.99.15,9.67,0,19.34.04,29-.01.67-.02,1.22-.55,1.46-1.15.62-1.55-.09-3.44-1.51-4.27-1.04-.61-2.22-.98-3.13-1.8-.78-.6-1.14-1.54-1.64-2.35-.3-.11-.63-.06-.93-.08-5.45.02-10.89,0-16.33.03-1.2.04-2.4-.03-3.6.04-.46.54-.54,1.36-1.07,1.88-1.21,1.58-3.51,1.67-4.65,3.31-.9,1.24-.99,3.34.41,4.25h0Z"/>
  <path class="cls-1" d="M43.71,56.89c4.47-.04,8.95.03,13.42-.01.75-.42,1.41-1.11,1.73-1.92-5.9-.05-11.81-.04-17.71,0,.06.73.69,1.18,1.19,1.64.36.38.91.28,1.38.3h0Z"/>
  <path class="cls-1" d="M59.05,80.46c-.36-1.25-.58-2.54-.82-3.81-.83-4.76-1.57-9.54-1.87-14.37-.09-1.41-.25-2.83-.12-4.24-4.2-.04-8.39.05-12.59-.02.09,2.83-.27,5.65-.57,8.46-.58,4.7-1.31,9.39-2.27,14.02,6.08.01,12.16.06,18.23-.04h0Z"/>
  <path class="cls-1" d="M65.58,95.36c-9.62-.02-19.24,0-28.87,0-1.35.15-3.06-.41-4.06.78-.94.96-.31,2.91,1.09,2.93,10.77.02,21.53,0,32.3.01,1.18.1,2.04-1.3,1.65-2.36-.32-.85-1.2-1.44-2.11-1.37h0Z"/>
</svg>`,
    4: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="piece-svg">
  <defs>
    <style>
      .cls-1 {
        fill: #ffffff;
      }
    </style>
  </defs>
  <path class="cls-1" d="M35.45,93.83c9.72,0,19.44.04,29.16.03.94.09,1.66-.72,1.93-1.55.5-1.58-.38-3.32-1.79-4.09-1.27-.69-2.63-1.28-3.67-2.31-.75-.78-1.31-1.74-1.62-2.77-2.12-.14-4.26.02-6.38-.04-4.12.02-8.24-.05-12.35.04-.4.63-.59,1.38-1.09,1.97-.97,1.4-2.54,2.15-4.01,2.89-1.37.67-2.31,2.15-2.15,3.7,0,1.05.78,2.32,1.97,2.14h0Z"/>
  <path class="cls-1" d="M46.42,31.39c1.16-2.01,2.25-4.07,3.54-6,1.27,1.96,2.33,4.06,3.58,6.04,1.24-1.27,2.45-2.57,3.71-3.82-.91-4.06-2.69-8.21-6.18-10.69,1.41-.6,1.95-2.61.96-3.79-1.05-1.41-3.55-1.21-4.32.39-.69,1.23-.03,2.81,1.17,3.44-2.52,1.95-4.17,4.78-5.21,7.75-.32,1-.77,1.99-.87,3.03,1.14,1.29,2.36,2.5,3.63,3.66h0Z"/>
  <path class="cls-1" d="M40.44,51.24c.72.77,1.89.42,2.82.48.59,1.84.92,3.75,1.19,5.66.7,4.88.24,9.84-.64,14.67-.41,2.24-1.12,4.41-1.64,6.63,5.25-.05,10.5,0,15.75-.08-.35-1.54-.93-3.01-1.24-4.55-1.82-7.28-2.1-15.05-.01-22.3.95-.12,2.26.34,2.89-.63.62-.75.08-2.12-.94-2.06-5.76-.04-11.52,0-17.28,0-1.11-.07-1.65,1.46-.91,2.21h0Z"/>
  <path class="cls-1" d="M40.66,81.98c6.28-.07,12.57-.04,18.85-.03.73.06,1.33-.92.89-1.53-.24-.37-.69-.56-1.13-.52-6.05-.03-12.09,0-18.14-.02-.35.04-.75-.08-1.05.15-1.01.48-.5,2.06.58,1.95h0Z"/>
  <path class="cls-1" d="M43.54,44.53c4.29.04,8.57,0,12.86.02,1.18.12,1.41-2.05.21-2.13-4.48-.01-8.97-.05-13.45.02-1.06.23-.71,2.27.39,2.09h0Z"/>
  <path class="cls-1" d="M55.5,41.28c.52-.07,1.38.25,1.58-.44,1-2.31,2-4.62,3.07-6.9.86-1.98,1.93-3.86,2.7-5.87-1.73,1.54-3.03,3.51-4.74,5.06-.22-1.26-.33-2.53-.52-3.79-.04,0-.13.01-.18.01-1.17,1.16-2.37,2.28-3.51,3.45-.21.23-.48.4-.75.54-1.02-1.85-2.15-3.64-3.16-5.5-1.2,1.78-2.15,3.72-3.29,5.53-1.48-1.36-2.95-2.75-4.27-4.26-.24,1.32-.35,2.66-.61,3.97-1.72-1.55-3-3.53-4.72-5.08,1.88,4.43,4.05,8.75,5.93,13.18,4.15.26,8.33-.03,12.49.12h0Z"/>
  <path class="cls-1" d="M43.1,47.81c4.51.02,9.02,0,13.54.03.39,0,.87,0,1.09-.39.49-.69.05-1.85-.87-1.8-4.71.06-9.44-.14-14.15.07-1.01.31-.76,2.32.39,2.1h0Z"/>
  <path class="cls-1" d="M65.25,95.16c-10.3-.02-20.61-.08-30.91-.03-.99.03-1.83.91-1.91,1.88-.15.97.62,2.05,1.62,2.07,10.69,0,21.38,0,32.07.01,1.27-.15,1.84-1.83,1.21-2.85-.39-.76-1.25-1.16-2.08-1.08h0Z"/>
</svg>`,
    5: `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="piece-svg">
  <defs>
    <style>
      .cls-1 {
        fill: #ffffff;
      }
    </style>
  </defs>
  <path class="cls-1" d="M39.14,44.54c.44.47,1.13.37,1.72.4,6.28.04,12.56.07,18.83-.03.64.03,1.24-.45,1.4-1.07.28-.77-.3-1.8-1.15-1.82-1.85-.09-3.71-.06-5.57-.06-4.86.04-9.71-.06-14.57.05-1.1.22-1.46,1.79-.66,2.53h0Z"/>
  <path class="cls-1" d="M41.11,76.36c5.89.09,11.79.02,17.69.06-.12-.89-.49-1.7-.71-2.56-1.63-5.39-2.35-11.03-2.4-16.65.06-3.68.32-7.4,1.36-10.94-4.66-.05-9.32-.08-13.99,0,1.18,4.88,1.43,9.94,1.08,14.94-.36,5.15-1.38,10.26-3.03,15.15h0Z"/>
  <path class="cls-1" d="M42.2,40.65c5.01.05,10.03,0,15.04.05.33-.02.72.03.98-.24.65-.68.27-2.07-.73-2.11-4.87,0-9.75.01-14.62-.02-.35.01-.72-.02-1.03.16-.9.44-.7,2.12.36,2.16h0Z"/>
  <path class="cls-1" d="M43.36,33.67c4.42.11,8.85.04,13.28.05,1.01-4.55,2.92-8.85,5.17-12.91.23-.52,1.16-1.28.32-1.68-1.4-.07-2.81.05-4.21-.04-.29,0-.47-.26-.67-.42-1.64-1.6-3.92-2.4-6.17-2.55-2.44-.2-5,.16-7.11,1.46-.68.41-1.21,1.02-1.87,1.46-1.42.19-2.88-.1-4.27.19-.64.38-.1,1.02.17,1.46,2.36,4.05,4.27,8.41,5.36,12.98h0Z"/>
  <path class="cls-1" d="M56.82,37.15c1.14,0,1.18-2.17-.01-2.12-4.35-.03-8.7,0-13.06-.03-.35.02-.73-.05-1.04.12-.88.4-.68,2.06.36,2.02,4.58.04,9.17.01,13.75,0h0Z"/>
  <path class="cls-1" d="M39.12,80.08c7.22.04,14.45,0,21.67.02.48.02.93-.33,1.07-.78.32-.8-.51-1.62-1.29-1.61-6.86-.06-13.73,0-20.59-.02-.35.02-.72-.02-1.03.16-1.06.37-.98,2.09.17,2.23h0Z"/>
  <path class="cls-1" d="M43.21,9.85c.02.49-.11,1.05.27,1.44,1.59-.58,3.22-1.04,4.83-1.55-.59,1.79-1.23,3.57-1.83,5.37,2.32-.33,4.68-.31,7,.03-.47-1.86-1.39-3.58-1.9-5.43,1.68.46,3.3,1.13,5,1.56.06-.08.18-.23.24-.3.03-1.26-.08-2.52-.05-3.77-.03-.79.1-1.6-.13-2.37-1.7.47-3.37,1.07-5.1,1.47.55-1.79,1.29-3.51,1.92-5.26-.36-.1-.72-.13-1.09-.12-1.95.04-3.9-.01-5.85.03.03.6.28,1.14.49,1.68.49,1.24.94,2.5,1.37,3.76-1.72-.44-3.37-1.14-5.12-1.49-.17,1.65-.01,3.31-.06,4.96h0Z"/>
  <path class="cls-1" d="M34,92.79c10.55.02,21.1.02,31.66,0,1.92.21,3.02-2.09,2.61-3.73-.26-1.62-1.67-2.73-3.13-3.27-2.02-.76-3.76-2.32-4.48-4.38-2.1-.09-4.19-.02-6.29-.05-5.03.03-10.07-.06-15.1.04-.58,1.7-1.94,3.02-3.48,3.89-.77.45-1.62.71-2.37,1.18-1.42.88-2.14,2.71-1.79,4.34.27,1.05,1.2,2.13,2.39,1.99h0Z"/>
  <path class="cls-1" d="M67.2,94.15c-7.45,0-14.9.05-22.35.03-4.17.03-8.36-.09-12.53.09-1.61.43-2.38,2.55-1.46,3.93.4.6,1.11.96,1.83.89,11.65,0,23.31.02,34.96,0,1.03-.09,1.75-1.1,1.85-2.06.2-1.37-.88-2.86-2.31-2.87h0Z"/>
</svg>`
  };

  function getPieceSVG(value) {
    return PIECE_SVG[value] || "";
  }

  // Utility
  function cloneMatrix(m){
    return m.map(row=>row.slice());
  }

  function getBoardStateKey(state = board) {
    return state.map(row => row.join(',')).join('|');
  }

  function resetRepeatStateTracking(state = board) {
    visitedStates = new Map();
    repeatStateCount = 0;
    const initialStateKey = getBoardStateKey(state);
    visitedStates.set(initialStateKey, 1);
  }

  function recordCurrentBoardState() {
    const stateKey = getBoardStateKey(board);
    const visits = visitedStates.get(stateKey) || 0;
    visitedStates.set(stateKey, visits + 1);

    if (visits > 0) {
      repeatStateCount++;
    }
  }

  function getRepeatStatePenaltyPoints() {
    let penaltyPoints = 0;

    visitedStates.forEach((visits) => {
      const revisits = Math.max(0, visits - 1);
      const penalizedRevisits = Math.max(0, revisits - 1);

      penaltyPoints += (penalizedRevisits * (penalizedRevisits + 1)) / 2;
    });

    return penaltyPoints;
  }

  function getPenalty() {
    return rotateState + mirrorHState + mirrorVState;
  }

  function applyTransforms() {
    let g = cloneMatrix(baseGoal);
    
    // Rotate
    for (let i=0; i<rotateState; i++) {
        let temp = cloneMatrix(g);
        for (let r=0;r<3;r++){
          for (let c=0;c<3;c++){
            g[c][2-r] = temp[r][c];
          }
        }
    }

    // Mirror H
    if (mirrorHState === 1) {
        for (let r=0;r<3;r++){
          g[r].reverse();
        }
    }

    // Mirror V
    if (mirrorVState === 1) {
        g.reverse();
    }

    goal = cloneMatrix(g);
    renderGoal(goal);
    
    if (penaltyDisplay) {
        penaltyDisplay.textContent = getPenalty();
    }
  }

  function resetTransforms() {
     rotateState = 0;
     mirrorHState = 0;
     mirrorVState = 0;
  }

  // Rendering
  // function renderGoal(g){
  //   // render as a 3x3 grid above the board; fallback to console if container missing
  //   if (!goalGrid) { console.log('Goal:', g); return; }
  //   goalGrid.innerHTML = '';
  //   for (let r=0;r<3;r++){
  //     const rowEl = document.createElement('div');
  //     rowEl.style.display='flex';
  //     rowEl.style.width='100%';
  //     rowEl.style.flex='1';
  //     rowEl.style.minHeight='0';
  //     for (let c=0;c<3;c++){
  //       const cell = document.createElement('div');
  //       cell.className = 'bm-goal-cell';
  //       cell.innerHTML = getPieceSVG(g[r][c]);
  //       // cell.style.flex='1';
  //       cell.style.minWidth='0';
  //       cell.style.minHeight='0';
  //       cell.style.border='1px solid rgba(255,255,255,0.04)';
  //       cell.style.padding='4px';
  //       cell.style.display='flex';
  //       cell.style.alignItems='center';
  //       cell.style.justifyContent='center';
  //       cell.style.overflow='hidden';
  //       cell.style.fontSize='0.95rem';
  //       cell.style.color='var(--muted)';
  //       rowEl.appendChild(cell);
  //     }
  //     goalGrid.appendChild(rowEl);
  //   }
  //   console.log('Goal:', g);
  // }
  function renderGoal(g){
  if (!goalGrid) return;
  goalGrid.innerHTML = '';

  for (let r=0; r<3; r++){
    for (let c=0; c<3; c++){
      const cell = document.createElement('div');
      cell.className = 'bm-goal-cell';
      cell.innerHTML = getPieceSVG(g[r][c]);
      goalGrid.appendChild(cell);
    }
  }
}


  function renderBoard(b){
     if (!boardContainer) return;
  boardContainer.innerHTML = '';
  for (let r=0; r<3; r++){
    for (let c=0; c<3; c++){
      const cell = document.createElement('div');
      cell.className = 'bm-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.innerHTML = getPieceSVG(b[r][c]);

      // highlight selected
      if (selectedCell && selectedCell.r == r && selectedCell.c == c) {
        cell.classList.add('selected');
      }

      // highlight possible moves
      const isPossible = possibleMoves.some(pm => pm[0]===r && pm[1]===c);
      if (isPossible) {
        if (board[r][c] === 0) {
          cell.classList.add('move-allowed');
        } else {
          cell.classList.add('move-blocked');
        }
      }

      cell.addEventListener('click', () => onCellClick(r,c));
      boardContainer.appendChild(cell);
    }
  }
  }

  // Goal generation
  function generateRandomGoal(){
    if (phase !== 'setup') return;
    resetTransforms();

    // clear goal grid
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) baseGoal[r][c] = 0;
    
    let valid = false;
    let positions = [];
    while (!valid) {
      positions = [];
      // place 5 pieces into random distinct cells in the goal grid
      while (positions.length < 5) {
        const idx = Math.floor(Math.random()*9);
        if (!positions.includes(idx)) positions.push(idx);
      }
      // use exactly one of each valid piece (1-5)
      goalPieces = [1, 2, 3, 4, 5];
      // shuffle them
      for (let i = 4; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [goalPieces[i], goalPieces[j]] = [goalPieces[j], goalPieces[i]];
      }
      
      // Enforce Bishop (2) parity: always on even cells (0, 2, 4, 6, 8)
      // This prevents unsolvable states when generating new goal cards without resetting the board
      const bishopIdx = goalPieces.indexOf(2);
      const bishopPos = positions[bishopIdx];
      
      // Enforce Knight (1) cannot spawn in the middle (4) because it would have 0 legal moves on a 3x3 board
      const knightIdx = goalPieces.indexOf(1);
      const knightPos = positions[knightIdx];

      if (bishopPos % 2 === 0 && knightPos !== 4) {
        valid = true;
      }
    }

    for (let i=0;i<5;i++){
      const val = goalPieces[i];
      const pos = positions[i];
      const r = Math.floor(pos/3), c = pos%3;
      baseGoal[r][c] = val;
    }
    applyTransforms();
  }

  // Randomize board values 0-5
  function randomizeBoard(){
    // place the same 5 goal pieces onto the board at random positions (not necessarily same as goal)
    // start with all empty
    for (let r=0;r<3;r++) for (let c=0;c<3;c++) board[r][c] = 0;

    let valid = false;
    let positions = [];
    while (!valid) {
      positions = [];
      while (positions.length < 5) {
        const idx = Math.floor(Math.random()*9);
        if (!positions.includes(idx)) positions.push(idx);
      }
      
      // Enforce Bishop (2) parity: always on even cells (0, 2, 4, 6, 8) matching the goal card
      const bishopIdx = goalPieces.indexOf(2);
      const bishopPos = positions[bishopIdx];
      
      // Enforce Knight (1) cannot spawn in the middle (4)
      const knightIdx = goalPieces.indexOf(1);
      const knightPos = positions[knightIdx];

      if (bishopPos % 2 === 0 && knightPos !== 4) {
        valid = true;
      }
    }

    for (let i=0;i<5;i++){
      const pos = positions[i];
      const r = Math.floor(pos/3), c = pos%3;
      board[r][c] = goalPieces[i];
    }
    resetRepeatStateTracking(board);
    renderBoard(board);
  }

  // Compute legal moves for piece at r,c using simplified chess rules
  function computeLegalMoves(r,c){
    const moves = [];
    const piece = board[r][c];
    if (!piece || piece===0) return moves;
    const inBounds = (rr,cc)=> rr>=0 && rr<3 && cc>=0 && cc<3;
    // helpers for sliding pieces
    function slide(drs){
      for (const [dr,dc] of drs){
        let rr=r+dr, cc=c+dc;
        while(inBounds(rr,cc)){
          moves.push([rr,cc]);
          if (board[rr][cc]!==0) break; // can capture then stop
          rr += dr; cc += dc;
        }
      }
    }
    switch(piece){
      case 1: // knight
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
          const rr=r+dr, cc=c+dc; if (inBounds(rr,cc)) moves.push([rr,cc]);
        });
        break;
      case 2: // bishop
        slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
        break;
      case 3: // rook
        slide([[-1,0],[1,0],[0,-1],[0,1]]);
        break;
      case 4: // queen
        slide([[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]);
        break;
      case 5: // king
        for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){
          if (dr===0 && dc===0) continue; const rr=r+dr, cc=c+dc; if (inBounds(rr,cc)) moves.push([rr,cc]);
        }
        break;
      default:
        break;
    }
    return moves;
  }

  // Transformations
  // Toggling logical states instead of consuming moves immediately
  function rotateGoal90(){
    if (phase !== 'setup') return;
    rotateState = (rotateState + 1) % 4;
    applyTransforms();
    playRotate(); // play sound effect for rotation
  }

  function mirrorGoalHorizontal(){
    if (phase !== 'setup') return;
    mirrorHState = (mirrorHState + 1) % 2;
    applyTransforms();
    playMirrorH(); // play sound effect for horizontal mirror
  }

  function mirrorGoalVertical(){
    if (phase !== 'setup') return;
    mirrorVState = (mirrorVState + 1) % 2;
    applyTransforms();
    playMirrorV(); // play sound effect for vertical mirror
  }

  // Play Initialization
  function startPlay(){
    goalGrid.classList.add("goal-hover");
    bigMovesDisplay.classList.add("big-moves-hover");
    if (Date.now() < gameInputUnlockAt) return;
    if (phase !== 'setup') return;
    const parsedBid = parseInt(bidInput.value, 10);
    const baseBids = Number.isFinite(parsedBid) ? parsedBid : 10;
    declaredMoves = Math.max(1, baseBids + getPenalty());
    remainingMoves = declaredMoves;
    
    // Switch to play phase
    phase = 'play';
    selectedCell = null;
    possibleMoves = [];
    resetRepeatStateTracking(board);
    
    // Update UI
  setupPanel.classList.add('fade-out');

  setTimeout(() => {
    setupPanel.classList.add('hidden');   // removes from layout
    bigMovesDisplay.classList.remove('hidden');
  }, 500); // match CSS transition

    bigMovesDisplay.textContent = remainingMoves;
    renderBoard(board);
  }

  function consumeMove(){
    remainingMoves--;
    bigMovesDisplay.textContent = Math.max(0, remainingMoves);
    checkWinCondition();
    bigMovesDisplay.classList.add("big-moves-jerk");

    bigMovesDisplay.addEventListener("animationend", () => {
        bigMovesDisplay.classList.remove("big-moves-jerk");
    }, { once: true });

  }

  // Cell interactions
  function onCellClick(r,c){
    if (Date.now() < gameInputUnlockAt) return;
    if (phase !== 'play') return; // Cannot move during setup

    if (!selectedCell){
      selectedCell = {r,c};
      possibleMoves = computeLegalMoves(r,c);
      renderBoard(board);
      return;
    }
    // if same cell, deselect
    if (selectedCell.r===r && selectedCell.c===c){
      selectedCell = null;
      renderBoard(board);
      return;
    }
    // allow swap only if target is empty and is in possibleMoves
    const isPossibleIndex = possibleMoves.some(pm=>pm[0]===r && pm[1]===c);
    if (isPossibleIndex && board[r][c]===0){
      playMove();
      const sr = selectedCell.r, sc = selectedCell.c;
      const tmp = board[sr][sc];
      board[sr][sc] = board[r][c];
      board[r][c] = tmp;
      selectedCell = null;
      possibleMoves = [];
      recordCurrentBoardState();
      consumeMove();
      renderBoard(board);
      return;
    }
    // otherwise deselect
    selectedCell = null;
    possibleMoves = [];
    renderBoard(board);
  }

  // Win check
  function arraysEqual(a,b){
    for (let r=0;r<3;r++){
      for (let c=0;c<3;c++){
        if (a[r][c] !== b[r][c]) return false;
      }
    }
    return true;
  }

  function getRank(acc) {
    if (acc >= 1) return "SS";
    if (acc >= 0.90) return "S";
    if (acc >= 0.75) return "A";
    if (acc >= 0.50) return "B";
    if (acc >= 0.25) return "C";
    if (acc >= 0.10) return "D";
    return "F";
  }

  let rankSvgIdCounter = 0;

  function getRankSVG(rank) {
  const uniqueId = `rank-grad-${rank.toLowerCase().replace(/[^a-z0-9-]/g, '')}-${rankSvgIdCounter++}`;
  const svgs = {
    "SS": `<svg width="140" height="120" viewBox="0 0 140 120">
  <defs>
    <linearGradient id="${uniqueId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd700"/>
      <stop offset="40%" stop-color="#ffef9f"/>
      <stop offset="70%" stop-color="#ff3b3b"/>
      <stop offset="100%" stop-color="#b30000"/>
    </linearGradient>
  </defs>
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="60" font-family="Impact, sans-serif"
        fill="url(#${uniqueId})" stroke="#000" stroke-width="3">SS</text>
</svg>`,
    "S": `<svg width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="${uniqueId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffd700"/>
      <stop offset="40%" stop-color="#ffef9f"/>
      <stop offset="70%" stop-color="#ff3b3b"/>
      <stop offset="100%" stop-color="#b30000"/>
    </linearGradient>
  </defs>
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="60" font-family="Impact, sans-serif"
        fill="url(#${uniqueId})" stroke="#000" stroke-width="3">S</text>
</svg>`
,
    "A": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="60" font-family="Impact, sans-serif"
        fill="#f1c40f" stroke="#000" stroke-width="3">A</text>
</svg>
`,
    "B": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="70" font-family="Impact, sans-serif"
        fill="#2471A3" stroke="#000" stroke-width="3">B</text>
</svg>
`,
    "C": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="70" font-family="Impact, sans-serif"
        fill="#27AE60" stroke="#000" stroke-width="3">C</text>
</svg>
`,
"D": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="70" font-family="Impact, sans-serif"
        fill="#7D3C98" stroke="#000" stroke-width="3">D</text>
</svg>
`,

    "E": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="70" font-family="Impact, sans-serif"
        fill="#D35400" stroke="#000" stroke-width="3">E</text>
</svg>
`,
    "F": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="70" font-family="Impact, sans-serif"
        fill="#7B241C" stroke="#000" stroke-width="3">F</text>
</svg>`,
    "F-": `<svg width="90" height="100" viewBox="0 0 120 120">
  <text x="50%" y="50%" text-anchor="middle"
        dominant-baseline="middle"
        font-size="60" font-family="Impact, sans-serif"
        fill="#dc2367" stroke="#000" stroke-width="3">F-</text>
</svg>`
  };
  return svgs[rank];
}


  function checkWinCondition(){
    if (phase !== 'play') return null;

    if (arraysEqual(board, goal)){
      const A = declaredMoves - remainingMoves;
      const D = Math.max(1, declaredMoves);
      const rawAcc = A / D;
      const repeatPenaltyInput = repeatStateCount;
      const repeatPenaltyPoints = getRepeatStatePenaltyPoints();
      const repeatPenalty = repeatPenaltyPoints / D;
      const acc = Math.max(0, rawAcc - repeatPenalty);

      totalAccuracy += acc;
      winCount++;
      lastRoundAccuracy = acc;
      
      currentStreak++;
      totalCards++;
      totalAccuracySum += acc;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
      saveData();
      updateHomeStats();
      playWin();

      const overallAcc = getRunOverallAccuracy();

      const lastRank = getRank(acc);
      const overallRank = getRank(overallAcc);

        phase = 'result';
        pendingResult = 'win';
        showWinPopup(
          lastRank,
          Math.round(acc * 100),
          Math.floor(100 * acc),
          repeatPenaltyInput,
          Math.round(repeatPenalty * 100),
          Math.round(rawAcc * 100)
        );

      updateRunStatsDisplay();
      return true;

    }
    if (remainingMoves<=0){
      playLose();
      
      currentStreak = 0;
      totalCards++;
      // Loss acts as a 0 on accuracy, so totalAccuracySum stays perfectly intact 
      // but is divided by higher totalCards lowering the overall average.
      saveData();
      updateHomeStats();
      
      phase = 'result';
      pendingResult = 'lose';
      showLosePopup();
      return false;
    }
    return null;
  }

  // Wire controls
  if (bidUpBtn) bidUpBtn.addEventListener('click', () => { bidInput.value = parseInt(bidInput.value,10)+1; });
  if (bidDownBtn) bidDownBtn.addEventListener('click', () => { 
      let val = parseInt(bidInput.value,10)-1; 
      if (val < 1) val = 1;
      bidInput.value = val; 
  });

  rotateBtn?.addEventListener('click', () => { rotateGoal90(); playRotate(); });
  mirrorHBtn?.addEventListener('click', () => { mirrorGoalHorizontal(); playMirrorH(); });
  mirrorVBtn?.addEventListener('click', () => { mirrorGoalVertical(); playMirrorV(); });
  newGoalBtn?.addEventListener('click', () => { 
      if (phase === 'setup') {
          generateRandomGoal(); 
          randomizeBoard();
      }
                playNewGoal(); // play sound effect for new goal
  });
  playBtn?.addEventListener('click', startPlay);

  // initial render
  // initialize
  // initialize: generate goal first, then place same pieces onto board
  generateRandomGoal();
  randomizeBoard();

  if (deleteDataBtn) deleteDataBtn.addEventListener('click', resetData);
  
  if (musicToggle) musicToggle.addEventListener('change', (e) => updateSettings('musicToggle', e.target.checked));
  if (quickMusicToggle) quickMusicToggle.addEventListener('change', (e) => updateSettings('musicToggle', e.target.checked));
  if (sfxToggle) sfxToggle.addEventListener('change', (e) => updateSettings('sfxToggle', e.target.checked));
  if (quickSfxToggle) quickSfxToggle.addEventListener('change', (e) => updateSettings('sfxToggle', e.target.checked));
  
  if (musicVolumeInput) musicVolumeInput.addEventListener('input', (e) => updateSettings('musicVolume', e.target.value));
  if (quickMusicVolumeInput) quickMusicVolumeInput.addEventListener('input', (e) => updateSettings('musicVolume', e.target.value));
  if (sfxVolumeInput) sfxVolumeInput.addEventListener('input', (e) => updateSettings('sfxVolume', e.target.value));
  if (quickSfxVolumeInput) quickSfxVolumeInput.addEventListener('input', (e) => updateSettings('sfxVolume', e.target.value));

  // Quick Settings Overlay triggers
  if (quickSettingsBtn) {
    quickSettingsBtn.addEventListener('click', () => quickSettingsOverlay.classList.remove('hidden'));
  }
  if (closeQuickSettingsBtn) {
    closeQuickSettingsBtn.addEventListener('click', () => quickSettingsOverlay.classList.add('hidden'));
  }
  if (saveExitBtn) {
    saveExitBtn.addEventListener('click', () => {
      inProgressGame = captureInProgressGame();
      saveData();
      quickSettingsOverlay.classList.add('hidden');
      showHome();
    });
  }
  if (winOkBtn) {
    winOkBtn.addEventListener('click', () => {
      if (pendingResult === 'win') finalizeWinRound();
    });
  }
  if (loseOkBtn) {
    loseOkBtn.addEventListener('click', () => {
      if (pendingResult === 'lose') finalizeLoseRound();
    });
  }

  function showHome() {
    installScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    document.body.classList.remove('game-mode'); // remove game-mode class when returning to home (this hides game background and shows home background)
    stopGameMusic();
    startMenuMusic();
  }

  function showGame() {
    installScreen.classList.add('hidden');
    homeScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    gameInputUnlockAt = Date.now() + 450;

    // Enter game screen in a stable setup state.
    hideWinPopup();
    hideLosePopup();
    document.body.classList.add('game-mode'); // add game-mode class to body (this hides home background and shows game background)
    pendingResult = null;

    if (!restoreInProgressGame(inProgressGame)) {
      startFreshGameSession();
    }

    stopMenuMusic();
    startGameMusic();
  }

  function showInstall() {
    installScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    homeScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    stopMenuMusic();
    stopGameMusic();
  }
  
  function showSettings() {
    installScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    homeScreen.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
    stopGameMusic();
    startMenuMusic(); // Will just ensure volume/play state if already active
  }

  if (playGameBtn) playGameBtn.addEventListener('click', showGame);
  if (settingsBtn) settingsBtn.addEventListener('click', showSettings);
  if (backToHomeBtn) backToHomeBtn.addEventListener('click', showHome);

  loadData(); // Load saved profiles & set settings

  try {
    const isStandalone = 
      (TEST_FORCE_STANDALONE === true) ||
      (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
      window.navigator.standalone === true;

    if (isStandalone) {
      showHome();
    } else {
      showInstall();
    }
  } catch (e) {
    // fallback just in case
    if (TEST_FORCE_STANDALONE === true) {
      showHome();
    } else {
      showInstall();
    }
  }

  // Install overlay toggle (no actual install flow)
  installBtn?.addEventListener('click', () => {
    overlay.classList.remove('hidden');
  });
  closeOverlay?.addEventListener('click', () => {
    overlay.classList.add('hidden');
  });

  // Minimal service worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{
      // ignore registration failures for MVP
    });
  }
});
