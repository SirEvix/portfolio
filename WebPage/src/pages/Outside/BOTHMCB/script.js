document.addEventListener('DOMContentLoaded', () => {
  const installScreen = document.getElementById('installScreen');
  const gameScreen = document.getElementById('gameScreen');
  const installBtn = document.getElementById('installBtn');
  const overlay = document.getElementById('installOverlay');
  const closeOverlay = document.getElementById('closeOverlay');
  // Game UI elements
  const boardContainer = document.getElementById('board');
  const goalDisplay = document.getElementById('goalDisplay');
  const movesDisplay = document.getElementById('movesDisplay');
  const rotateBtn = document.getElementById('rotateBtn');
  const mirrorHBtn = document.getElementById('mirrorHBtn');
  const mirrorVBtn = document.getElementById('mirrorVBtn');
  const newGoalBtn = document.getElementById('newGoalBtn');
  const declareBtn = document.getElementById('declareBtn');

  // Game state
  let board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];

  let goal = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ];

  let declaredMoves = 0;
  let remainingMoves = 0;

  let selectedCell = null; // {r,c}

  // Utility
  function cloneMatrix(m){
    return m.map(row=>row.slice());
  }

  // Rendering
  function renderGoal(g){
    // show a simple textual representation above the board
    if (!goalDisplay) { console.log('Goal:', g); return; }
    const lines = g.map(r => r.join(' ')).join(' | ');
    goalDisplay.textContent = 'Goal: ' + lines;
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
      for (let c=0;c<3;c++){
        const cell = document.createElement('div');
        cell.className = 'bm-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = String(b[r][c]);
        cell.style.flex='1';
        cell.style.minWidth='0';
        cell.style.border='1px solid rgba(255,255,255,0.06)';
        cell.style.padding='12px';
        cell.style.display='flex';
        cell.style.alignItems='center';
        cell.style.justifyContent='center';
        cell.style.cursor='pointer';
        cell.style.userSelect='none';
        cell.style.fontSize='1.1rem';
        cell.style.color='var(--text)';
        // highlight selected
        if (selectedCell && selectedCell.r==r && selectedCell.c==c){
          cell.style.outline='3px solid rgba(211,47,47,0.6)';
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
    for (let r=0;r<3;r++){
      for (let c=0;c<3;c++){
        goal[r][c] = Math.floor(Math.random()*5); // 0-4
      }
    }
    renderGoal(goal);
  }

  // Transformations
  function rotateGoal90(){
    // clockwise rotation
    const g = cloneMatrix(goal);
    for (let r=0;r<3;r++){
      for (let c=0;c<3;c++){
        goal[c][2-r] = g[r][c];
      }
    }
    consumeMove();
    renderGoal(goal);
  }

  function mirrorGoalHorizontal(){
    // flip left-right
    for (let r=0;r<3;r++){
      goal[r].reverse();
    }
    consumeMove();
    renderGoal(goal);
  }

  function mirrorGoalVertical(){
    // flip top-bottom
    goal.reverse();
    consumeMove();
    renderGoal(goal);
  }

  // Moves
  function declareMoves(){
    declaredMoves = 10; // hardcoded per requirement
    remainingMoves = declaredMoves;
    updateMovesDisplay();
  }

  function consumeMove(){
    if (remainingMoves>0) remainingMoves--;
    updateMovesDisplay();
    if (remainingMoves<=0) {
      // check immediately
      checkWinCondition();
    }
  }

  function updateMovesDisplay(){
    if (!movesDisplay) return;
    movesDisplay.textContent = 'Remaining Moves: ' + remainingMoves;
  }

  // Cell interactions
  function onCellClick(r,c){
    if (!selectedCell){
      selectedCell = {r,c};
      renderBoard(board);
      return;
    }
    // if same cell, deselect
    if (selectedCell.r===r && selectedCell.c===c){
      selectedCell = null;
      renderBoard(board);
      return;
    }
    // swap
    const sr = selectedCell.r, sc = selectedCell.c;
    const tmp = board[sr][sc];
    board[sr][sc] = board[r][c];
    board[r][c] = tmp;
    selectedCell = null;
    consumeMove();
    renderBoard(board);
    checkWinCondition();
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

  function checkWinCondition(){
    if (arraysEqual(board, goal)){
      alert('YOU WIN');
      return true;
    }
    if (remainingMoves<=0){
      alert('YOU LOSE');
      return false;
    }
    return null;
  }

  // Wire controls
  rotateBtn?.addEventListener('click', rotateGoal90);
  mirrorHBtn?.addEventListener('click', mirrorGoalHorizontal);
  mirrorVBtn?.addEventListener('click', mirrorGoalVertical);
  newGoalBtn?.addEventListener('click', () => { generateRandomGoal(); });
  declareBtn?.addEventListener('click', declareMoves);

  // initial render
  renderBoard(board);
  renderGoal(goal);

  function showGame() {
    installScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  }

  function showInstall() {
    installScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
  }

  // Detection per requirement
  try {
    if (window.navigator.standalone) {
      showGame();
    } else {
      showInstall();
    }
  } catch (e) {
    showInstall();
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
