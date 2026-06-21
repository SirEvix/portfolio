document.addEventListener('DOMContentLoaded', () => {
  const installScreen = document.getElementById('installScreen');
  const gameScreen = document.getElementById('gameScreen');
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

  // Testing override:
  // Set to `true` to force standalone/gameScreen, `false` to force installScreen,
  // or `null` to use the real environment detection (default).
  // For production builds you can uncomment and set to null or remove this line.
  // Example (uncomment to force game view while testing):
  // const TEST_FORCE_STANDALONE = true;
   const TEST_FORCE_STANDALONE = null;

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

  let totalAccuracy = 0;

  // Goal pieces (5-piece card)
  let goalPieces = [0,0,0,0,0];

  const PIECE_SVG = {
    0: "", // empty cell
    1: `<svg viewBox="0 0 100 100" class="piece-svg"><circle cx="50" cy="50" r="30" fill="#ccc"/></svg>`,
    2: `<svg viewBox="0 0 100 100" class="piece-svg"><rect x="25" y="25" width="50" height="50" fill="#ccc"/></svg>`,
    3: `<svg viewBox="0 0 100 100" class="piece-svg"><polygon points="50,10 90,90 10,90" fill="#ccc"/></svg>`,
    4: `<svg viewBox="0 0 100 100" class="piece-svg"><line x1="10" y1="10" x2="90" y2="90" stroke="#ccc" stroke-width="10"/></svg>`,
    5: `<svg viewBox="0 0 100 100" class="piece-svg"><circle cx="50" cy="30" r="20" fill="#ccc"/><rect x="30" y="50" width="40" height="40" fill="#ccc"/></svg>`
  };

  function getPieceSVG(value) {
    return PIECE_SVG[value] || "";
  }

  // Utility
  function cloneMatrix(m){
    return m.map(row=>row.slice());
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
  function renderGoal(g){
    // render as a 3x3 grid above the board; fallback to console if container missing
    if (!goalGrid) { console.log('Goal:', g); return; }
    goalGrid.innerHTML = '';
    for (let r=0;r<3;r++){
      const rowEl = document.createElement('div');
      rowEl.style.display='flex';
      rowEl.style.width='100%';
      rowEl.style.flex='1';
      rowEl.style.minHeight='0';
      for (let c=0;c<3;c++){
        const cell = document.createElement('div');
        cell.className = 'bm-goal-cell';
        cell.innerHTML = getPieceSVG(g[r][c]);
        cell.style.flex='1';
        cell.style.minWidth='0';
        cell.style.minHeight='0';
        cell.style.border='1px solid rgba(255,255,255,0.04)';
        cell.style.padding='4px';
        cell.style.display='flex';
        cell.style.alignItems='center';
        cell.style.justifyContent='center';
        cell.style.overflow='hidden';
        cell.style.fontSize='0.95rem';
        cell.style.color='var(--muted)';
        rowEl.appendChild(cell);
      }
      goalGrid.appendChild(rowEl);
    }
    console.log('Goal:', g);
  }

  function renderBoard(b){
    if (!boardContainer) return;
    // clear
    boardContainer.innerHTML = '';
    // create a 3x3 grid
    for (let r=0;r<3;r++){
      const rowEl = document.createElement('div');
      rowEl.style.display='flex';
      rowEl.style.width='100%';
      rowEl.style.flex='1';
      rowEl.style.minHeight='0';
      for (let c=0;c<3;c++){
        const cell = document.createElement('div');
        cell.className = 'bm-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.innerHTML = getPieceSVG(b[r][c]);
        cell.style.flex='1';
        cell.style.minWidth='0';
        cell.style.minHeight='0';
        cell.style.border='1px solid rgba(255,255,255,0.06)';
        cell.style.padding='2px';
        cell.style.display='flex';
        cell.style.alignItems='center';
        cell.style.justifyContent='center';
        cell.style.overflow='hidden';
        cell.style.cursor='pointer';
        cell.style.userSelect='none';
        cell.style.fontSize='1.1rem';
        cell.style.color='var(--text)';
        // highlight selected (blue)
        if (selectedCell && selectedCell.r==r && selectedCell.c==c){
          cell.style.outline='3px solid rgba(0,122,255,0.75)';
          cell.style.background = 'rgba(0,122,255,0.08)';
        }
        // highlight possible moves: green if empty, red if occupied (blocked)
        const isPossible = possibleMoves.some(pm=>pm[0]===r && pm[1]===c);
        if (isPossible){
          if (board[r][c]===0){
            // allowed
            cell.style.background = 'rgba(52,199,89,0.12)';
            cell.style.border = '2px dashed rgba(52,199,89,0.25)';
          } else {
            // blocked because occupied
            cell.style.background = 'rgba(255,59,48,0.06)';
            cell.style.border = '2px dashed rgba(255,59,48,0.18)';
          }
        }
        // click handler
        cell.addEventListener('click', () => onCellClick(r,c));
        rowEl.appendChild(cell);
      }
      boardContainer.appendChild(rowEl);
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
      if (bishopPos % 2 === 0) {
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
      if (bishopPos % 2 === 0) {
        valid = true;
      }
    }

    for (let i=0;i<5;i++){
      const pos = positions[i];
      const r = Math.floor(pos/3), c = pos%3;
      board[r][c] = goalPieces[i];
    }
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
  }

  function mirrorGoalHorizontal(){
    if (phase !== 'setup') return;
    mirrorHState = (mirrorHState + 1) % 2;
    applyTransforms();
  }

  function mirrorGoalVertical(){
    if (phase !== 'setup') return;
    mirrorVState = (mirrorVState + 1) % 2;
    applyTransforms();
  }

  // Play Initialization
  function startPlay(){
    if (phase !== 'setup') return;
    const baseBids = parseInt(bidInput.value, 10) || 10;
    declaredMoves = baseBids + getPenalty();
    remainingMoves = declaredMoves;
    
    // Switch to play phase
    phase = 'play';
    selectedCell = null;
    possibleMoves = [];
    
    // Update UI
    setupPanel.classList.add('hidden');
    bigMovesDisplay.classList.remove('hidden');
    bigMovesDisplay.textContent = remainingMoves;
    renderBoard(board);
  }

  function consumeMove(){
    if (remainingMoves>0) remainingMoves--;
    bigMovesDisplay.textContent = remainingMoves;
    checkWinCondition();
  }

  // Cell interactions
  function onCellClick(r,c){
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
      const sr = selectedCell.r, sc = selectedCell.c;
      const tmp = board[sr][sc];
      board[sr][sc] = board[r][c];
      board[r][c] = tmp;
      selectedCell = null;
      possibleMoves = [];
      consumeMove();
      renderBoard(board);
      checkWinCondition();
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

  function checkWinCondition(){
    if (phase !== 'play') return null;

    if (arraysEqual(board, goal)){
      const A = declaredMoves - remainingMoves;
      const D = Math.max(1, declaredMoves);
      const acc = A / D;

      totalAccuracy += acc;
      winCount++;
      const overallAcc = totalAccuracy / winCount;

      const lastRank = getRank(acc);
      const overallRank = getRank(overallAcc);

      alert(`YOU WIN!\n\nRank: ${lastRank} (${Math.round(acc*100)}%)\nCard Score: ${Math.floor(100 * acc)}`);
      
      if (winCounterDisplay) {
        winCounterDisplay.innerHTML = `Last Card: ${lastRank} (${Math.round(acc*100)}%)<br>Cards Matched: ${winCount}<br>Overall: ${overallRank} (${Math.round(overallAcc*100)}%)`;
      }
      
      // Setup phase for new card, play area remains as is
      phase = 'setup';
      setupPanel.classList.remove('hidden');
      bigMovesDisplay.classList.add('hidden');
      generateRandomGoal();
      return true;
    }
    if (remainingMoves<=0){
      alert('YOU LOSE!');
      // Reset everything
      winCount = 0;
      totalAccuracy = 0;
      if (winCounterDisplay) winCounterDisplay.textContent = `Cards Matched: 0`;
      phase = 'setup';
      setupPanel.classList.remove('hidden');
      bigMovesDisplay.classList.add('hidden');
      generateRandomGoal();
      randomizeBoard();
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

  rotateBtn?.addEventListener('click', rotateGoal90);
  mirrorHBtn?.addEventListener('click', mirrorGoalHorizontal);
  mirrorVBtn?.addEventListener('click', mirrorGoalVertical);
  newGoalBtn?.addEventListener('click', () => { 
      if (phase === 'setup') {
          generateRandomGoal(); 
          randomizeBoard();
      }
  });
  playBtn?.addEventListener('click', startPlay);

  // initial render
  // initialize
  // initialize: generate goal first, then place same pieces onto board
  generateRandomGoal();
  randomizeBoard();

  function showGame() {
    installScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  }

  function showInstall() {
    installScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
  }

  // Force Game Screen directly unconditionally if TEST_FORCE_STANDALONE is true
  if (TEST_FORCE_STANDALONE === true) {
    showGame();
  } else {
    // Detection per requirement — respect the TEST_FORCE_STANDALONE override if set
    console.log("TEST_FORCE_STANDALONE override:", TEST_FORCE_STANDALONE);
    try {
      const isStandalone = (TEST_FORCE_STANDALONE !== null) ? TEST_FORCE_STANDALONE : Boolean(window.navigator.standalone);
      if (isStandalone) {
        showGame();
      } else {
        showInstall();
      }
    } catch (e) {
      if (TEST_FORCE_STANDALONE === true) {
        showGame();
      } else {
        showInstall();
      }
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
