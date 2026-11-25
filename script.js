/* ========================================================
   MANNAN CORPORATION - ARCADE LOGIC & GAMES
   Includes:
   - Web Audio API Sound Synthesizer (Zero asset dependencies!)
   - 4 Complete Playable Games:
     1. Berry Snake 🍓
     2. Mannan Bunny Hop 🐰
     3. Kawaii Match 🌸
     4. Star Breaker ⭐
   - Full keyboard, touch, mouse, and on-screen D-Pad support
   - LocalStorage High Score persistence
   ======================================================== */

// --- Global Sound Manager (Web Audio API) ---
class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    const saved = localStorage.getItem('mannan_sound_enabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('mannan_sound_enabled', this.enabled);
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  playEat() {
    this.playTone(600, 'sine', 0.08, 0.2);
    setTimeout(() => this.playTone(850, 'triangle', 0.1, 0.25), 60);
  }

  playJump() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  playGameOver() {
    this.playTone(400, 'sawtooth', 0.15, 0.15);
    setTimeout(() => this.playTone(300, 'sawtooth', 0.18, 0.15), 120);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.35, 0.2), 260);
  }

  playFlip() {
    this.playTone(450, 'sine', 0.05, 0.12);
  }

  playMatch() {
    this.playTone(523.25, 'sine', 0.08, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.2), 80); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.18, 0.25), 160); // G5
  }

  playBounce() {
    this.playTone(350, 'triangle', 0.06, 0.18);
  }

  playBrickBreak() {
    this.playTone(700, 'square', 0.08, 0.12);
  }

  // --- 4D Horror Audio Synthesizer ---
  playHeartbeat(rate = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain.gain.setValueAtTime(0.35 * rate, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Secondary thump
      setTimeout(() => {
        if (!this.ctx) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(70, now2);
        osc2.frequency.exponentialRampToValueAtTime(30, now2 + 0.1);
        gain2.gain.setValueAtTime(0.25 * rate, now2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.12);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now2);
        osc2.stop(now2 + 0.13);
      }, 160);
    } catch (e) {}
  }

  playWarpSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {}
  }

  playJumpscare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = [650, 720, 840, 1100];
      const now = this.ctx.currentTime;
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.linearRampToValueAtTime(f * 1.5, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      });
    } catch (e) {}
  }

  playFlashlightClick() {
    this.playTone(1200, 'square', 0.03, 0.1);
  }

  playRelicChime() {
    this.playTone(587.33, 'triangle', 0.15, 0.2); // D5
    setTimeout(() => this.playTone(880, 'sine', 0.25, 0.25), 100); // A5
    setTimeout(() => this.playTone(1174.66, 'sine', 0.4, 0.3), 220); // D6
  }
}

const sounds = new SoundController();

// --- Main Arcade State ---
const state = {
  activeGame: 'snake',
  isRunning: false,
  score: 0,
  highScores: {
    snake: 0,
    runner: 0,
    memory: 0,
    breaker: 0,
    horror: 0,
  },
};

// Load saved high scores
try {
  const savedScores = JSON.parse(localStorage.getItem('mannan_highscores') || '{}');
  state.highScores = { ...state.highScores, ...savedScores };
} catch (e) {}

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const memoryContainer = document.getElementById('memoryGameContainer');
const memoryGrid = document.getElementById('memoryGrid');
const memoryMovesEl = document.getElementById('memoryMoves');
const memoryPairsEl = document.getElementById('memoryPairs');

// Horror 4D DOM Elements
const horrorHud = document.getElementById('horrorHud');
const sanityBar = document.getElementById('sanityBar');
const batteryBar = document.getElementById('batteryBar');
const dimensionTag = document.getElementById('dimensionTag');
const dimensionName = document.getElementById('dimensionName');
const relicCountEl = document.getElementById('relicCount');
const bloodVignette = document.getElementById('bloodVignette');
const jumpscareFace = document.getElementById('jumpscareFace');
const cabinetEl = document.querySelector('.arcade-cabinet');
const cabinetScreenEl = document.getElementById('cabinetScreen');
const warpBtn = document.getElementById('warpBtn');
const flashBtn = document.getElementById('flashBtn');
const actionBtn = document.getElementById('actionBtn');

const toggleTrailerBtn = document.getElementById('toggleTrailerBtn');
const trailerPlayerContainer = document.getElementById('trailerPlayerContainer');
const corpVideoPlayer = document.getElementById('corpVideoPlayer');

const overlay = document.getElementById('screenOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMsg = document.getElementById('overlayMessage');
const overlayBtn = document.getElementById('overlayBtn');
const overlayIcon = document.getElementById('overlayIcon');
const overlayHint = document.getElementById('overlayKeysHint');

const scoreEl = document.getElementById('currentScore');
const highScoreEl = document.getElementById('highScore');
const activeTitleEl = document.getElementById('activeGameTitle');
const soundToggleBtn = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const soundText = document.getElementById('soundText');

// Setup Canvas Resolution
function fixCanvasDPI() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 600 * dpr;
  canvas.height = 400 * dpr;
  ctx.resetTransform?.();
  ctx.scale(dpr, dpr);
}
fixCanvasDPI();
window.addEventListener('resize', fixCanvasDPI);

// Background Ambient Floating Bubbles
function setupFloatingBackground() {
  const container = document.getElementById('floatingBg');
  const colors = ['#ffccd5', '#d8b4fe', '#c7d2fe', '#fef08a', '#bbf7d0'];
  for (let i = 0; i < 8; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'bg-bubble';
    const size = Math.floor(Math.random() * 180) + 120;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = colors[i % colors.length];
    bubble.style.left = `${Math.random() * 95}%`;
    bubble.style.top = `${Math.random() * 95}%`;
    bubble.style.animationDelay = `${i * 1.5}s`;
    bubble.style.animationDuration = `${16 + i * 3}s`;
    container.appendChild(bubble);
  }
}
setupFloatingBackground();

// Update UI
function updateUI() {
  scoreEl.textContent = state.score;
  highScoreEl.textContent = state.highScores[state.activeGame] || 0;
}

function updateSoundUI() {
  if (sounds.enabled) {
    soundIcon.textContent = '🔊';
    soundText.textContent = 'Sound ON';
  } else {
    soundIcon.textContent = '🔇';
    soundText.textContent = 'Muted';
  }
}
updateSoundUI();

soundToggleBtn.addEventListener('click', () => {
  const enabled = sounds.toggle();
  updateSoundUI();
  if (enabled) sounds.playTone(600, 'sine', 0.1);
});

function saveHighScore(gameKey, score) {
  if (score > (state.highScores[gameKey] || 0)) {
    state.highScores[gameKey] = score;
    localStorage.setItem('mannan_highscores', JSON.stringify(state.highScores));
    updateUI();
  }
}

// ========================================================
// GAME 1: BERRY SNAKE 🍓
// ========================================================
const snakeGame = {
  gridSize: 20,
  tileCountX: 30, // 600 / 20
  tileCountY: 20, // 400 / 20
  snake: [],
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  food: { x: 15, y: 10, type: '🍓' },
  foodItems: ['🍓', '🍒', '🍎', '🍇', '🧁'],
  speed: 120, // ms per tick
  lastTick: 0,
  particles: [],

  init() {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.spawnFood();
    this.particles = [];
    this.speed = 120;
    state.score = 0;
    updateUI();
  },

  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food.x = Math.floor(Math.random() * (this.tileCountX - 2)) + 1;
      this.food.y = Math.floor(Math.random() * (this.tileCountY - 2)) + 1;
      valid = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y);
    }
    this.food.type = this.foodItems[Math.floor(Math.random() * this.foodItems.length)];
  },

  addSparkles(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x * this.gridSize + 10,
        y: y * this.gridSize + 10,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        alpha: 1,
        color: ['#ff6584', '#fffa65', '#4ef0bc'][i % 3],
        size: Math.random() * 4 + 2,
      });
    }
  },

  handleKey(key) {
    if (key === 'ArrowUp' || key === 'KeyW') {
      if (this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
    } else if (key === 'ArrowDown' || key === 'KeyS') {
      if (this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
    } else if (key === 'ArrowLeft' || key === 'KeyA') {
      if (this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
    } else if (key === 'ArrowRight' || key === 'KeyD') {
      if (this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
    }
  },

  update(timestamp) {
    if (!state.isRunning) return;

    if (timestamp - this.lastTick > this.speed) {
      this.lastTick = timestamp;
      this.dir = { ...this.nextDir };
      const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
        gameOver('You bumped into the arcade wall!');
        return;
      }

      // Self collision
      if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver('Caterpillar bumped into its own tail!');
        return;
      }

      this.snake.unshift(head);

      // Check food
      if (head.x === this.food.x && head.y === this.food.y) {
        state.score += 10;
        updateUI();
        saveHighScore('snake', state.score);
        sounds.playEat();
        this.addSparkles(head.x, head.y);
        this.spawnFood();
        // Speed up slightly
        if (this.speed > 70) this.speed -= 2;
      } else {
        this.snake.pop();
      }
    }

    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  },

  draw() {
    ctx.clearRect(0, 0, 600, 400);

    // Cute grid background
    ctx.fillStyle = '#1e142e';
    ctx.fillRect(0, 0, 600, 400);

    ctx.strokeStyle = '#291b3e';
    ctx.lineWidth = 1;
    for (let x = 0; x < 600; x += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    for (let y = 0; y < 400; y += this.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    // Draw Food
    ctx.font = '16px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      this.food.type,
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2
    );

    // Draw Snake Segments
    for (let i = this.snake.length - 1; i >= 0; i--) {
      const seg = this.snake[i];
      const px = seg.x * this.gridSize;
      const py = seg.y * this.gridSize;

      if (i === 0) {
        // Head
        ctx.fillStyle = '#4ef0bc';
        ctx.beginPath();
        ctx.roundRect(px + 1, py + 1, this.gridSize - 2, this.gridSize - 2, 8);
        ctx.fill();

        // Cute eyes
        ctx.fillStyle = '#1e152a';
        let eyeOffsetX = 5;
        let eyeOffsetY = 5;
        if (this.dir.x === 1) eyeOffsetX = 12;
        if (this.dir.y === 1) eyeOffsetY = 12;

        ctx.beginPath();
        ctx.arc(px + eyeOffsetX, py + eyeOffsetY, 2.5, 0, Math.PI * 2);
        ctx.arc(px + (this.dir.y !== 0 ? eyeOffsetX + 8 : eyeOffsetX), py + (this.dir.x !== 0 ? eyeOffsetY + 8 : eyeOffsetY), 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Cute blush
        ctx.fillStyle = 'rgba(255, 101, 132, 0.6)';
        ctx.beginPath();
        ctx.arc(px + 4, py + 13, 2, 0, Math.PI * 2);
        ctx.arc(px + 16, py + 13, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body (gradient pastel)
        const ratio = i / this.snake.length;
        ctx.fillStyle = ratio < 0.5 ? '#67f3c7' : '#9ff7dc';
        ctx.beginPath();
        ctx.roundRect(px + 2, py + 2, this.gridSize - 4, this.gridSize - 4, 6);
        ctx.fill();
      }
    }

    // Draw Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  },
};

// ========================================================
// GAME 2: MANNAN BUNNY HOP (RUNNER) 🐰
// ========================================================
const runnerGame = {
  player: {
    x: 80,
    y: 280,
    w: 36,
    h: 38,
    vy: 0,
    gravity: 0.65,
    jumpPower: -11.5,
    isGrounded: true,
    jumpCount: 0,
    maxJumps: 2,
  },
  groundY: 320,
  obstacles: [],
  stars: [],
  sparkles: [],
  speed: 4.8,
  distance: 0,
  nextObstacleDistance: 120,

  init() {
    this.player.y = this.groundY - this.player.h;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.jumpCount = 0;
    this.obstacles = [];
    this.stars = [];
    this.sparkles = [];
    this.speed = 4.8;
    this.distance = 0;
    this.nextObstacleDistance = 90;
    state.score = 0;
    updateUI();
  },

  jump() {
    if (this.player.jumpCount < this.player.maxJumps) {
      this.player.vy = this.player.jumpPower;
      this.player.jumpCount++;
      this.player.isGrounded = false;
      sounds.playJump();

      // Add jump poof sparkles
      for (let i = 0; i < 5; i++) {
        this.sparkles.push({
          x: this.player.x + 18,
          y: this.player.y + this.player.h,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 1,
          alpha: 1,
          color: '#ffc75f',
          size: 3,
        });
      }
    }
  },

  handleKey(key) {
    if (key === 'Space' || key === 'ArrowUp' || key === 'KeyW') {
      this.jump();
    }
  },

  update() {
    if (!state.isRunning) return;

    this.distance += 1;
    if (this.distance % 10 === 0) {
      state.score += 1;
      updateUI();
      saveHighScore('runner', state.score);
    }

    // Slowly ramp up difficulty
    this.speed = 4.8 + Math.min(this.distance / 1200, 3.5);

    // Player physics
    this.player.vy += this.player.gravity;
    this.player.y += this.player.vy;

    if (this.player.y >= this.groundY - this.player.h) {
      this.player.y = this.groundY - this.player.h;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpCount = 0;
    }

    // Spawn Obstacles
    this.nextObstacleDistance -= 1;
    if (this.nextObstacleDistance <= 0) {
      const type = Math.random() > 0.4 ? 'mushroom' : 'slime';
      const obsH = type === 'mushroom' ? 32 : 24;
      const obsW = 28;
      this.obstacles.push({
        x: 620,
        y: this.groundY - obsH,
        w: obsW,
        h: obsH,
        type,
      });

      // Maybe spawn a collectible star above
      if (Math.random() > 0.3) {
        this.stars.push({
          x: 620 + Math.random() * 40,
          y: this.groundY - 75 - Math.random() * 40,
          r: 10,
          collected: false,
        });
      }

      this.nextObstacleDistance = Math.floor(Math.random() * 80) + 70;
    }

    // Move Obstacles
    this.obstacles.forEach(obs => {
      obs.x -= this.speed;

      // Collision Check
      if (
        this.player.x + 4 < obs.x + obs.w &&
        this.player.x + this.player.w - 4 > obs.x &&
        this.player.y + 4 < obs.y + obs.h &&
        this.player.y + this.player.h > obs.y
      ) {
        gameOver('Bunny stumbled on an obstacle!');
      }
    });
    this.obstacles = this.obstacles.filter(obs => obs.x > -50);

    // Move & collect stars
    this.stars.forEach(star => {
      star.x -= this.speed;
      if (!star.collected) {
        const dx = (this.player.x + 18) - star.x;
        const dy = (this.player.y + 19) - star.y;
        if (Math.hypot(dx, dy) < 28) {
          star.collected = true;
          state.score += 25;
          updateUI();
          saveHighScore('runner', state.score);
          sounds.playEat();
          // sparkles
          for (let i = 0; i < 6; i++) {
            this.sparkles.push({
              x: star.x,
              y: star.y,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              alpha: 1,
              color: '#ffd15c',
              size: 4,
            });
          }
        }
      }
    });
    this.stars = this.stars.filter(s => s.x > -30 && !s.collected);

    // Update sparkles
    this.sparkles.forEach(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.05;
    });
    this.sparkles = this.sparkles.filter(s => s.alpha > 0);
  },

  draw() {
    ctx.clearRect(0, 0, 600, 400);

    // Pastel Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 400);
    skyGrad.addColorStop(0, '#1c1533');
    skyGrad.addColorStop(0.7, '#382559');
    skyGrad.addColorStop(1, '#533475');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 600, 400);

    // Distant soft mountains / hills
    ctx.fillStyle = '#2d1e47';
    ctx.beginPath();
    ctx.arc(150, 420, 200, 0, Math.PI * 2);
    ctx.arc(440, 430, 240, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#221636';
    ctx.fillRect(0, this.groundY, 600, 80);
    ctx.fillStyle = '#ff6584';
    ctx.fillRect(0, this.groundY, 600, 4);

    // Draw Stars
    this.stars.forEach(st => {
      ctx.font = '20px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⭐', st.x, st.y);
    });

    // Draw Obstacles
    this.obstacles.forEach(obs => {
      ctx.font = obs.type === 'mushroom' ? '28px Fredoka' : '22px Fredoka';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(obs.type === 'mushroom' ? '🍄' : '👾', obs.x + obs.w / 2, obs.y + obs.h + 2);
    });

    // Draw Player (Cute Bunny)
    const px = this.player.x;
    const py = this.player.y;
    ctx.font = '36px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐰', px + 18, py + 18);

    // Draw Sparkles
    this.sparkles.forEach(s => {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  },
};

// ========================================================
// GAME 3: KAWAII MATCH (MEMORY CARDS) 🌸
// ========================================================
const memoryGame = {
  icons: ['🐱', '🐰', '🐼', '🍓', '🍭', '🌸', '⭐', '🚀'],
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  moves: 0,
  lockBoard: false,

  init() {
    this.matchedPairs = 0;
    this.moves = 0;
    this.flippedCards = [];
    this.lockBoard = false;
    memoryMovesEl.textContent = '0';
    memoryPairsEl.textContent = '0 / 8';
    state.score = 0;
    updateUI();

    // Create 16 cards (8 pairs)
    const deck = [...this.icons, ...this.icons];
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    memoryGrid.innerHTML = '';
    this.cards = deck.map((icon, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = idx;
      card.dataset.icon = icon;
      card.innerHTML = `<span class="card-inner-icon" style="display:none;">${icon}</span><span class="card-back">❓</span>`;
      card.addEventListener('click', () => this.flipCard(card));
      memoryGrid.appendChild(card);
      return card;
    });
  },

  flipCard(card) {
    if (!state.isRunning || this.lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    sounds.playFlip();
    card.classList.add('flipped');
    card.querySelector('.card-inner-icon').style.display = 'block';
    card.querySelector('.card-back').style.display = 'none';
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      memoryMovesEl.textContent = this.moves;
      this.checkMatch();
    }
  },

  checkMatch() {
    const [c1, c2] = this.flippedCards;
    const isMatch = c1.dataset.icon === c2.dataset.icon;

    if (isMatch) {
      sounds.playMatch();
      c1.classList.add('matched');
      c2.classList.add('matched');
      this.matchedPairs++;
      memoryPairsEl.textContent = `${this.matchedPairs} / 8`;
      state.score += 50;
      updateUI();
      saveHighScore('memory', state.score);
      this.flippedCards = [];

      if (this.matchedPairs === 8) {
        // Bonus points for fewer moves
        const bonus = Math.max(0, (25 - this.moves) * 15);
        state.score += bonus;
        updateUI();
        saveHighScore('memory', state.score);

        setTimeout(() => {
          showVictory('All Pairs Matched! You have amazing memory!');
        }, 500);
      }
    } else {
      this.lockBoard = true;
      setTimeout(() => {
        c1.classList.remove('flipped');
        c2.classList.remove('flipped');
        c1.querySelector('.card-inner-icon').style.display = 'none';
        c1.querySelector('.card-back').style.display = 'block';
        c2.querySelector('.card-inner-icon').style.display = 'none';
        c2.querySelector('.card-back').style.display = 'block';
        this.flippedCards = [];
        this.lockBoard = false;
      }, 800);
    }
  },
};

// ========================================================
// GAME 4: STAR BREAKER (BRICK BREAKER) ⭐
// ========================================================
const breakerGame = {
  paddle: { x: 250, y: 360, w: 90, h: 14, speed: 7 },
  ball: { x: 300, y: 340, r: 7, vx: 3.5, vy: -3.8 },
  bricks: [],
  trail: [],
  keys: {},

  init() {
    this.paddle.x = 300 - this.paddle.w / 2;
    this.ball.x = 300;
    this.ball.y = 330;
    this.ball.vx = (Math.random() > 0.5 ? 3.5 : -3.5);
    this.ball.vy = -4;
    this.trail = [];
    state.score = 0;
    updateUI();

    // Generate bricks grid (5 rows x 8 cols)
    this.bricks = [];
    const rows = 4;
    const cols = 8;
    const bw = 60;
    const bh = 18;
    const padding = 10;
    const offsetX = (600 - (cols * (bw + padding) - padding)) / 2;
    const offsetY = 45;
    const colors = ['#ff6584', '#ffc75f', '#4ef0bc', '#845ec2'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: offsetX + c * (bw + padding),
          y: offsetY + r * (bh + padding),
          w: bw,
          h: bh,
          color: colors[r % colors.length],
          points: (rows - r) * 10,
          alive: true,
        });
      }
    }
  },

  handleKey(key, isDown) {
    this.keys[key] = isDown;
  },

  update() {
    if (!state.isRunning) return;

    // Paddle movement
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.paddle.x = Math.max(10, this.paddle.x - this.paddle.speed);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.paddle.x = Math.min(600 - this.paddle.w - 10, this.paddle.x + this.paddle.speed);
    }

    // Ball movement
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    // Trail effect
    this.trail.push({ x: this.ball.x, y: this.ball.y, alpha: 0.8 });
    if (this.trail.length > 8) this.trail.shift();
    this.trail.forEach(t => (t.alpha -= 0.08));

    // Wall bounce
    if (this.ball.x - this.ball.r <= 0) {
      this.ball.x = this.ball.r;
      this.ball.vx = Math.abs(this.ball.vx);
      sounds.playBounce();
    } else if (this.ball.x + this.ball.r >= 600) {
      this.ball.x = 600 - this.ball.r;
      this.ball.vx = -Math.abs(this.ball.vx);
      sounds.playBounce();
    }
    if (this.ball.y - this.ball.r <= 0) {
      this.ball.y = this.ball.r;
      this.ball.vy = Math.abs(this.ball.vy);
      sounds.playBounce();
    }

    // Bottom out
    if (this.ball.y > 400) {
      gameOver('The star fell out of the galaxy!');
      return;
    }

    // Paddle hit
    if (
      this.ball.y + this.ball.r >= this.paddle.y &&
      this.ball.y - this.ball.r <= this.paddle.y + this.paddle.h &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.w
    ) {
      this.ball.vy = -Math.abs(this.ball.vy);
      // Angle influence based on hit point
      const hitDiff = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
      this.ball.vx = hitDiff * 5;
      sounds.playBounce();
    }

    // Brick hits
    let anyAlive = false;
    this.bricks.forEach(brick => {
      if (!brick.alive) return;
      anyAlive = true;

      if (
        this.ball.x + this.ball.r > brick.x &&
        this.ball.x - this.ball.r < brick.x + brick.w &&
        this.ball.y + this.ball.r > brick.y &&
        this.ball.y - this.ball.r < brick.y + brick.h
      ) {
        brick.alive = false;
        this.ball.vy = -this.ball.vy;
        state.score += brick.points;
        updateUI();
        saveHighScore('breaker', state.score);
        sounds.playBrickBreak();
      }
    });

    if (!anyAlive) {
      showVictory('All Sugar Bricks Smashed! Great job!');
    }
  },

  draw() {
    ctx.clearRect(0, 0, 600, 400);

    // Dark Arcade BG
    ctx.fillStyle = '#1c142c';
    ctx.fillRect(0, 0, 600, 400);

    // Bricks
    this.bricks.forEach(brick => {
      if (!brick.alive) return;
      ctx.fillStyle = brick.color;
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 6);
      ctx.fill();
    });

    // Trail
    this.trail.forEach(t => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, t.alpha);
      ctx.fillStyle = '#fffa65';
      ctx.beginPath();
      ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Ball (Glowing Star)
    ctx.font = '16px Fredoka';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', this.ball.x, this.ball.y);

    // Paddle
    ctx.fillStyle = '#4ef0bc';
    ctx.beginPath();
    ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.paddle.x + 8, this.paddle.y + 3, this.paddle.w - 16, 2);
  },
};

// ========================================================
// GAME 5: PROJECT 4D: CURSED CORRIDORS (4D HD HORROR) 👁️
// ========================================================
const horrorGame = {
  // 16x16 Dungeon Map (1=Wall, 0=Floor, 2=Relic, 3=Escape Portal)
  map: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 2, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 2, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  player: {
    x: 1.5,
    y: 1.5,
    dirX: 1,
    dirY: 0,
    planeX: 0,
    planeY: 0.66,
    moveSpeed: 0.05,
    rotSpeed: 0.04,
    sanity: 100,
    battery: 100,
    flashlightOn: true,
    dimension4D: false,
    relicsCollected: 0,
    totalRelics: 4,
  },

  stalker: {
    x: 14.5,
    y: 14.5,
    speed: 0.022,
  },

  keys: {},
  zBuffer: [],
  lastHeartbeat: 0,
  isScaring: false,

  init() {
    this.player.x = 1.5;
    this.player.y = 1.5;
    this.player.dirX = 1;
    this.player.dirY = 0;
    this.player.planeX = 0;
    this.player.planeY = 0.66;
    this.player.sanity = 100;
    this.player.battery = 100;
    this.player.flashlightOn = true;
    this.player.dimension4D = false;
    this.player.relicsCollected = 0;
    this.stalker.x = 14.5;
    this.stalker.y = 14.5;
    this.isScaring = false;
    this.keys = {};
    state.score = 0;

    // Reset Map Relics
    this.map[1][14] = 2;
    this.map[5][5] = 2;
    this.map[8][7] = 2;
    this.map[11][13] = 2;

    // Reset HUD
    if (jumpscareFace) jumpscareFace.classList.add('hidden');
    if (bloodVignette) bloodVignette.classList.remove('danger');
    if (cabinetScreenEl) cabinetScreenEl.classList.remove('dimension-4d');
    if (dimensionName) dimensionName.textContent = '3D REALITY';
    this.updateHUD();
    updateUI();
  },

  updateHUD() {
    if (sanityBar) {
      sanityBar.style.width = `${Math.max(0, this.player.sanity)}%`;
      if (this.player.sanity < 25) {
        sanityBar.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
      } else if (this.player.sanity < 60) {
        sanityBar.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
      } else {
        sanityBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      }
    }
    if (batteryBar) {
      batteryBar.style.width = `${Math.max(0, this.player.battery)}%`;
      if (this.player.battery < 20) {
        batteryBar.style.background = 'linear-gradient(90deg, #f97316, #ea580c)';
      } else {
        batteryBar.style.background = 'linear-gradient(90deg, #38bdf8, #0284c7)';
      }
    }
    if (relicCountEl) {
      relicCountEl.textContent = `${this.player.relicsCollected} / ${this.player.totalRelics}`;
    }
  },

  toggle4D() {
    this.player.dimension4D = !this.player.dimension4D;
    sounds.playWarpSound();
    if (this.player.dimension4D) {
      cabinetScreenEl.classList.add('dimension-4d');
      dimensionName.textContent = '4D VOID';
      dimensionTag.style.borderColor = '#f43f5e';
    } else {
      cabinetScreenEl.classList.remove('dimension-4d');
      dimensionName.textContent = '3D REALITY';
      dimensionTag.style.borderColor = '#be185d';
    }
  },

  toggleFlashlight() {
    if (this.player.battery > 0) {
      this.player.flashlightOn = !this.player.flashlightOn;
      sounds.playFlashlightClick();
    }
  },

  handleKey(key, isDown) {
    this.keys[key] = isDown;
  },

  update() {
    if (!state.isRunning || this.isScaring) return;

    // Movement & Rotation
    const p = this.player;
    const moveStep = p.dimension4D ? p.moveSpeed * 1.25 : p.moveSpeed;
    const rot = p.rotSpeed;

    // Forward / Backward
    if (this.keys['KeyW'] || this.keys['ArrowUp']) {
      const nextX = p.x + p.dirX * moveStep;
      const nextY = p.y + p.dirY * moveStep;
      if (this.map[Math.floor(nextX)][Math.floor(p.y)] !== 1) p.x = nextX;
      if (this.map[Math.floor(p.x)][Math.floor(nextY)] !== 1) p.y = nextY;
    }
    if (this.keys['KeyS'] || this.keys['ArrowDown']) {
      const nextX = p.x - p.dirX * moveStep;
      const nextY = p.y - p.dirY * moveStep;
      if (this.map[Math.floor(nextX)][Math.floor(p.y)] !== 1) p.x = nextX;
      if (this.map[Math.floor(p.x)][Math.floor(nextY)] !== 1) p.y = nextY;
    }

    // Rotate Left / Right
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
      const oldDirX = p.dirX;
      p.dirX = p.dirX * Math.cos(-rot) - p.dirY * Math.sin(-rot);
      p.dirY = oldDirX * Math.sin(-rot) + p.dirY * Math.cos(-rot);
      const oldPlaneX = p.planeX;
      p.planeX = p.planeX * Math.cos(-rot) - p.planeY * Math.sin(-rot);
      p.planeY = oldPlaneX * Math.sin(-rot) + p.planeY * Math.cos(-rot);
    }
    if (this.keys['KeyD'] || this.keys['ArrowRight']) {
      const oldDirX = p.dirX;
      p.dirX = p.dirX * Math.cos(rot) - p.dirY * Math.sin(rot);
      p.dirY = oldDirX * Math.sin(rot) + p.dirY * Math.cos(rot);
      const oldPlaneX = p.planeX;
      p.planeX = p.planeX * Math.cos(rot) - p.planeY * Math.sin(rot);
      p.planeY = oldPlaneX * Math.sin(rot) + p.planeY * Math.cos(rot);
    }

    // Battery drain
    if (p.flashlightOn) {
      p.battery -= 0.035;
      if (p.battery <= 0) {
        p.battery = 0;
        p.flashlightOn = false;
        sounds.playFlashlightClick();
      }
    }

    // Check Relic Collection
    const currentTileX = Math.floor(p.x);
    const currentTileY = Math.floor(p.y);
    if (this.map[currentTileX][currentTileY] === 2) {
      this.map[currentTileX][currentTileY] = 0;
      p.relicsCollected++;
      state.score += 250;
      p.sanity = Math.min(100, p.sanity + 25);
      sounds.playRelicChime();
      saveHighScore('horror', state.score);
      updateUI();

      if (p.relicsCollected === p.totalRelics) {
        document.getElementById('horrorTip').textContent = 'ESCAPE PORTAL UNLOCKED AT (1, 14)! RUN!';
        document.getElementById('horrorTip').style.color = '#4ef0bc';
      }
    }

    // Check Escape Portal Victory
    if (this.map[currentTileX][currentTileY] === 3 && p.relicsCollected >= p.totalRelics) {
      state.score += 1000;
      saveHighScore('horror', state.score);
      showVictory('YOU SURVIVED THE 4D EXPERIMENT! Escape Successful!');
      return;
    }

    // Stalker AI (Hunts player, slowed in 4D)
    const stalkerSpeed = p.dimension4D ? 0.007 : 0.021;
    const dx = p.x - this.stalker.x;
    const dy = p.y - this.stalker.y;
    const distToPlayer = Math.hypot(dx, dy);

    if (distToPlayer > 0.1) {
      const stepX = (dx / distToPlayer) * stalkerSpeed;
      const stepY = (dy / distToPlayer) * stalkerSpeed;
      const testX = this.stalker.x + stepX;
      const testY = this.stalker.y + stepY;
      if (this.map[Math.floor(testX)][Math.floor(this.stalker.y)] !== 1) this.stalker.x = testX;
      if (this.map[Math.floor(this.stalker.x)][Math.floor(testY)] !== 1) this.stalker.y = testY;
    }

    // Heartbeat Audio & Sanity Drop based on proximity
    const now = Date.now();
    if (distToPlayer < 5.0) {
      const interval = Math.max(260, distToPlayer * 240);
      if (now - this.lastHeartbeat > interval) {
        this.lastHeartbeat = now;
        sounds.playHeartbeat(1.2 - distToPlayer / 5.0);
      }
      p.sanity -= (5.0 - distToPlayer) * 0.025;
      bloodVignette.classList.add('danger');
    } else {
      bloodVignette.classList.remove('danger');
      if (!p.dimension4D && p.flashlightOn) {
        p.sanity = Math.min(100, p.sanity + 0.015);
      }
    }

    // Extra Sanity drain in 4D Void
    if (p.dimension4D) {
      p.sanity -= 0.07;
    }

    // Zero Sanity GameOver
    if (p.sanity <= 0) {
      gameOver('Your mind fractured into the 4th dimension!');
      return;
    }

    // Jumpscare collision!
    if (distToPlayer < 0.65) {
      this.triggerJumpscare();
      return;
    }

    this.updateHUD();
  },

  triggerJumpscare() {
    this.isScaring = true;
    sounds.playJumpscare();
    jumpscareFace.classList.remove('hidden');
    cabinetScreenEl.classList.add('dimension-4d');

    setTimeout(() => {
      jumpscareFace.classList.add('hidden');
      cabinetScreenEl.classList.remove('dimension-4d');
      gameOver('The 4D Entity harvested your flesh!');
    }, 1200);
  },

  draw() {
    ctx.clearRect(0, 0, 600, 400);

    const p = this.player;
    const screenW = 600;
    const screenH = 400;
    const rayStep = 3; // 200 rays across screen for HD crispness
    const numRays = screenW / rayStep;

    // 1. Draw Ceiling & Floor with perspective gradient
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, screenH / 2);
    if (p.dimension4D) {
      ceilGrad.addColorStop(0, '#2e020d');
      ceilGrad.addColorStop(1, '#0f0205');
    } else {
      ceilGrad.addColorStop(0, '#0a0612');
      ceilGrad.addColorStop(1, '#1b1226');
    }
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, screenW, screenH / 2);

    const floorGrad = ctx.createLinearGradient(0, screenH / 2, 0, screenH);
    if (p.dimension4D) {
      floorGrad.addColorStop(0, '#3f0412');
      floorGrad.addColorStop(1, '#1c0107');
    } else {
      floorGrad.addColorStop(0, '#120c1c');
      floorGrad.addColorStop(1, '#050308');
    }
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, screenH / 2, screenW, screenH / 2);

    // 2. Raycasting Loop
    this.zBuffer = new Array(numRays);

    for (let i = 0; i < numRays; i++) {
      const cameraX = (2 * (i * rayStep)) / screenW - 1;
      const rayDirX = p.dirX + p.planeX * cameraX;
      const rayDirY = p.dirY + p.planeY * cameraX;

      let mapX = Math.floor(p.x);
      let mapY = Math.floor(p.y);

      const deltaDistX = Math.abs(1 / rayDirX);
      const deltaDistY = Math.abs(1 / rayDirY);

      let stepX, stepY;
      let sideDistX, sideDistY;

      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (p.x - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1.0 - p.x) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (p.y - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1.0 - p.y) * deltaDistY;
      }

      // Perform DDA
      let hit = 0;
      let side = 0;
      while (hit === 0) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        if (mapX < 0 || mapX >= 16 || mapY < 0 || mapY >= 16) {
          hit = 1;
        } else if (this.map[mapX][mapY] === 1) {
          hit = 1;
        }
      }

      // Calculate distance
      let perpWallDist;
      if (side === 0) {
        perpWallDist = (mapX - p.x + (1 - stepX) / 2) / rayDirX;
      } else {
        perpWallDist = (mapY - p.y + (1 - stepY) / 2) / rayDirY;
      }
      this.zBuffer[i] = perpWallDist;

      // Calculate line height
      const lineHeight = Math.floor(screenH / Math.max(0.001, perpWallDist));
      const drawStart = Math.max(0, -lineHeight / 2 + screenH / 2);
      const drawEnd = Math.min(screenH - 1, lineHeight / 2 + screenH / 2);

      // Distance Fog & Dynamic Flashlight Spotlight
      const fog = Math.max(0, 1 - perpWallDist / (p.flashlightOn ? 10.5 : 4.0));
      const centerFactor = 1 - Math.abs(cameraX) * 0.6;
      const lightFactor = p.flashlightOn ? Math.min(1.2, fog * (centerFactor + 0.3)) : fog * 0.45;

      // Color Palette based on Reality or 4D Void
      let baseR, baseG, baseB;
      if (p.dimension4D) {
        // Occult Crimson / Alien flesh
        baseR = side === 0 ? 220 : 160;
        baseG = side === 0 ? 30 : 15;
        baseB = side === 0 ? 60 : 40;
      } else {
        // Dark Abandoned Asylum slate
        baseR = side === 0 ? 70 : 50;
        baseG = side === 0 ? 65 : 45;
        baseB = side === 0 ? 95 : 75;
      }

      const r = Math.floor(baseR * lightFactor);
      const g = Math.floor(baseG * lightFactor);
      const b = Math.floor(baseB * lightFactor);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(i * rayStep, drawStart, rayStep, drawEnd - drawStart);
    }

    // 3. Render 3D Sprites (Relics, Exit, and Stalker Entity)
    const sprites = [];

    // Collect Relics
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        if (this.map[x][y] === 2) {
          sprites.push({ x: x + 0.5, y: y + 0.5, type: 'relic' });
        } else if (this.map[x][y] === 3) {
          sprites.push({ x: x + 0.5, y: y + 0.5, type: 'portal' });
        }
      }
    }

    // Add Stalker Monster
    sprites.push({ x: this.stalker.x, y: this.stalker.y, type: 'stalker' });

    // Sort sprites far to near
    sprites.forEach(s => {
      s.dist = Math.hypot(p.x - s.x, p.y - s.y);
    });
    sprites.sort((a, b) => b.dist - a.dist);

    // Draw Billboard Sprites
    sprites.forEach(sprite => {
      const spriteX = sprite.x - p.x;
      const spriteY = sprite.y - p.y;

      const invDet = 1.0 / (p.planeX * p.dirY - p.dirX * p.planeY);
      const transformX = invDet * (p.dirY * spriteX - p.dirX * spriteY);
      const transformY = invDet * (-p.planeY * spriteX + p.planeX * spriteY);

      if (transformY <= 0.2) return; // Behind camera

      const spriteScreenX = Math.floor((screenW / 2) * (1 + transformX / transformY));
      const spriteHeight = Math.abs(Math.floor(screenH / transformY));
      const spriteYPos = screenH / 2;

      const rayIndex = Math.floor(spriteScreenX / rayStep);

      // Check Z-Buffer occlusion
      if (rayIndex >= 0 && rayIndex < numRays && transformY < this.zBuffer[rayIndex]) {
        const size = Math.min(180, Math.max(16, spriteHeight * 0.7));

        if (sprite.type === 'relic') {
          ctx.font = `${size}px Fredoka, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // Floating bobbing
          const bob = Math.sin(Date.now() / 250) * 8;
          ctx.fillText(p.dimension4D ? '🔮' : '💎', spriteScreenX, spriteYPos + bob);
        } else if (sprite.type === 'portal') {
          ctx.font = `${size * 1.3}px Fredoka`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🌀', spriteScreenX, spriteYPos);
        } else if (sprite.type === 'stalker') {
          // Stalker Entity (Demonic shadow with glowing eyes)
          ctx.save();
          ctx.font = `${size * 1.4}px Fredoka`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Entity shadow wisp
          ctx.shadowColor = p.dimension4D ? '#ff0033' : '#a855f7';
          ctx.shadowBlur = 25;
          ctx.fillText('👁️‍🗨️', spriteScreenX, spriteYPos);

          // Glowing predatory red eyes
          ctx.font = `${size * 0.7}px Fredoka`;
          ctx.fillText('👁️ 👁️', spriteScreenX, spriteYPos - size * 0.1);
          ctx.restore();
        }
      }
    });
  },
};

// ========================================================
// CONTROLLER & GAME LOOP
// ========================================================
function mainLoop(timestamp) {
  if (state.activeGame === 'snake') {
    snakeGame.update(timestamp);
    snakeGame.draw();
  } else if (state.activeGame === 'runner') {
    runnerGame.update();
    runnerGame.draw();
  } else if (state.activeGame === 'breaker') {
    breakerGame.update();
    breakerGame.draw();
  } else if (state.activeGame === 'horror') {
    horrorGame.update();
    horrorGame.draw();
  }

  requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

// Game Selector Management
const gameConfig = {
  snake: {
    title: 'Berry Snake 🍓',
    icon: '🍓',
    keys: 'Controls: Arrow Keys or WASD to Slither',
    startMsg: 'Feast on berries & avoid colliding with walls!',
  },
  runner: {
    title: 'Mannan Bunny Hop 🐰',
    icon: '🐰',
    keys: 'Controls: Space / Up Arrow / Tap screen to Jump',
    startMsg: 'Hop over slimes & mushrooms to rack up points!',
  },
  memory: {
    title: 'Kawaii Match 🌸',
    icon: '🌸',
    keys: 'Controls: Click or Tap cards to flip & match',
    startMsg: 'Flip cards and find all 8 matching pairs!',
  },
  breaker: {
    title: 'Star Breaker ⭐',
    icon: '⭐',
    keys: 'Controls: A / D or Left / Right Arrows (or Mouse)',
    startMsg: 'Deflect the star to break all sugar bricks!',
  },
  horror: {
    title: 'Project 4D: Cursed Corridors 👁️',
    icon: '👁️',
    keys: 'Controls: WASD/Arrows to walk/turn | SPACE to 4D Warp | F for Flashlight',
    startMsg: 'Find all 4 Relics & escape the Stalker Entity across dimensions!',
  },
};

function selectGame(gameKey) {
  state.activeGame = gameKey;
  state.isRunning = false;

  // Update tabs
  document.querySelectorAll('.game-card').forEach(card => {
    card.classList.toggle('active', card.dataset.game === gameKey);
  });

  const config = gameConfig[gameKey];
  activeTitleEl.textContent = config.title;
  highScoreEl.textContent = state.highScores[gameKey] || 0;
  scoreEl.textContent = 0;

  // Toggle DOM memory container vs Canvas
  if (gameKey === 'memory') {
    canvas.classList.add('hidden');
    memoryContainer.classList.remove('hidden');
  } else {
    canvas.classList.remove('hidden');
    memoryContainer.classList.add('hidden');
  }

  // Horror specific mode transitions
  if (gameKey === 'horror') {
    if (cabinetEl) cabinetEl.classList.add('horror-mode');
    if (horrorHud) horrorHud.classList.remove('hidden');
    if (warpBtn) warpBtn.classList.remove('hidden');
    if (flashBtn) flashBtn.classList.remove('hidden');
    if (actionBtn) actionBtn.classList.add('hidden');
  } else {
    if (cabinetEl) cabinetEl.classList.remove('horror-mode');
    if (horrorHud) horrorHud.classList.add('hidden');
    if (warpBtn) warpBtn.classList.add('hidden');
    if (flashBtn) flashBtn.classList.add('hidden');
    if (actionBtn) actionBtn.classList.remove('hidden');
    if (cabinetScreenEl) cabinetScreenEl.classList.remove('dimension-4d');
    if (bloodVignette) bloodVignette.classList.remove('danger');
    if (jumpscareFace) jumpscareFace.classList.add('hidden');
  }

  // Show Overlay
  showStartOverlay();
}

function showStartOverlay() {
  const conf = gameConfig[state.activeGame];
  overlayIcon.textContent = conf.icon;
  overlayTitle.textContent = `Play ${conf.title}`;
  overlayMsg.textContent = conf.startMsg;
  overlayHint.textContent = conf.keys;
  overlayBtn.textContent = '▶ START GAME';
  overlay.classList.remove('hidden');
}

function startGame() {
  state.isRunning = true;
  overlay.classList.add('hidden');

  if (state.activeGame === 'snake') {
    snakeGame.init();
  } else if (state.activeGame === 'runner') {
    runnerGame.init();
  } else if (state.activeGame === 'memory') {
    memoryGame.init();
  } else if (state.activeGame === 'breaker') {
    breakerGame.init();
  } else if (state.activeGame === 'horror') {
    horrorGame.init();
  }
}

function gameOver(reason) {
  state.isRunning = false;
  sounds.playGameOver();
  overlayIcon.textContent = '💔';
  overlayTitle.textContent = 'GAME OVER';
  overlayMsg.textContent = `${reason} Final Score: ${state.score}`;
  overlayBtn.textContent = '🔄 PLAY AGAIN';
  overlay.classList.remove('hidden');
}

function showVictory(msg) {
  state.isRunning = false;
  sounds.playMatch();
  overlayIcon.textContent = '🏆';
  overlayTitle.textContent = 'VICTORY!';
  overlayMsg.textContent = `${msg} Final Score: ${state.score}`;
  overlayBtn.textContent = '✨ PLAY AGAIN';
  overlay.classList.remove('hidden');
}

// Event Listeners
overlayBtn.addEventListener('click', startGame);

document.getElementById('restartGameBtn').addEventListener('click', () => {
  startGame();
});

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    selectGame(card.dataset.game);
  });
});

// Virtual Control Buttons
warpBtn.addEventListener('click', () => {
  if (state.activeGame === 'horror' && state.isRunning) {
    horrorGame.toggle4D();
  }
});

flashBtn.addEventListener('click', () => {
  if (state.activeGame === 'horror' && state.isRunning) {
    horrorGame.toggleFlashlight();
  }
});

// Trailer Toggle
toggleTrailerBtn.addEventListener('click', () => {
  if (trailerPlayerContainer.classList.contains('hidden')) {
    trailerPlayerContainer.classList.remove('hidden');
    corpVideoPlayer.play();
    toggleTrailerBtn.textContent = '⏸ Pause HD Trailer';
  } else {
    corpVideoPlayer.pause();
    trailerPlayerContainer.classList.add('hidden');
    toggleTrailerBtn.textContent = '▶ Play HD Trailer';
  }
});

// Keyboard Controls
window.addEventListener('keydown', e => {
  // If overlay is showing and space/enter pressed, start game
  if (!state.isRunning && (e.code === 'Space' || e.code === 'Enter')) {
    if (!overlay.classList.contains('hidden')) {
      e.preventDefault();
      startGame();
      return;
    }
  }

  if (state.activeGame === 'snake') {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
    snakeGame.handleKey(e.code);
  } else if (state.activeGame === 'runner') {
    if (['Space', 'ArrowUp'].includes(e.code)) {
      e.preventDefault();
      runnerGame.handleKey(e.code);
    }
  } else if (state.activeGame === 'breaker') {
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD'].includes(e.code)) {
      e.preventDefault();
    }
    breakerGame.handleKey(e.code, true);
  } else if (state.activeGame === 'horror') {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space', 'KeyF', 'KeyQ'].includes(e.code)) {
      e.preventDefault();
    }
    if (e.code === 'Space' || e.code === 'KeyQ') {
      horrorGame.toggle4D();
    } else if (e.code === 'KeyF') {
      horrorGame.toggleFlashlight();
    } else {
      horrorGame.handleKey(e.code, true);
    }
  }
});

window.addEventListener('keyup', e => {
  if (state.activeGame === 'breaker') {
    breakerGame.handleKey(e.code, false);
  } else if (state.activeGame === 'horror') {
    horrorGame.handleKey(e.code, false);
  }
});

// On-screen Virtual D-Pad
document.querySelectorAll('.d-btn').forEach(btn => {
  btn.addEventListener('pointerdown', e => {
    e.preventDefault();
    const dir = btn.dataset.dir;
    if (state.activeGame === 'snake') {
      if (dir === 'up') snakeGame.handleKey('ArrowUp');
      if (dir === 'down') snakeGame.handleKey('ArrowDown');
      if (dir === 'left') snakeGame.handleKey('ArrowLeft');
      if (dir === 'right') snakeGame.handleKey('ArrowRight');
    } else if (state.activeGame === 'breaker') {
      if (dir === 'left') breakerGame.handleKey('ArrowLeft', true);
      if (dir === 'right') breakerGame.handleKey('ArrowRight', true);
    } else if (state.activeGame === 'horror') {
      if (dir === 'up') horrorGame.handleKey('KeyW', true);
      if (dir === 'down') horrorGame.handleKey('KeyS', true);
      if (dir === 'left') horrorGame.handleKey('ArrowLeft', true);
      if (dir === 'right') horrorGame.handleKey('ArrowRight', true);
    }
  });

  btn.addEventListener('pointerup', () => {
    if (state.activeGame === 'breaker') {
      breakerGame.handleKey('ArrowLeft', false);
      breakerGame.handleKey('ArrowRight', false);
    } else if (state.activeGame === 'horror') {
      horrorGame.handleKey('KeyW', false);
      horrorGame.handleKey('KeyS', false);
      horrorGame.handleKey('ArrowLeft', false);
      horrorGame.handleKey('ArrowRight', false);
    }
  });
});

// Action button
document.getElementById('actionBtn').addEventListener('click', () => {
  if (!state.isRunning) {
    startGame();
    return;
  }
  if (state.activeGame === 'runner') {
    runnerGame.jump();
  }
});

// Screen Tap to Jump / Action
canvas.addEventListener('pointerdown', e => {
  if (state.activeGame === 'runner' && state.isRunning) {
    runnerGame.jump();
  }
});

// Mouse Move for Breaker
canvas.addEventListener('mousemove', e => {
  if (state.activeGame === 'breaker' && state.isRunning) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    breakerGame.paddle.x = Math.max(10, Math.min(600 - breakerGame.paddle.w - 10, mouseX - breakerGame.paddle.w / 2));
  }
});

// Initialize first game view
selectGame('snake');
