'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

interface MoshPitGameProps {
  onGameEnd: (score: number) => void;
}

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface Collectible {
  x: number;
  y: number;
  type: 'guitar' | 'beer';
}

export default function MoshPitGame({ onGameEnd }: MoshPitGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameStateRef = useRef({
    player: { x: 300, y: 300, size: 30 },
    enemies: [] as Entity[],
    collectibles: [] as Collectible[],
    keys: {} as Record<string, boolean>,
    score: 0,
    difficulty: 1,
    lastSpawn: 0,
    lastCollectibleSpawn: 0,
  });

  const spawnEnemy = useCallback((width: number, height: number) => {
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = 2 + gameStateRef.current.difficulty * 0.5;

    switch (side) {
      case 0: // Top
        x = Math.random() * width;
        y = -30;
        vx = (Math.random() - 0.5) * speed;
        vy = Math.random() * speed + 1;
        break;
      case 1: // Right
        x = width + 30;
        y = Math.random() * height;
        vx = -(Math.random() * speed + 1);
        vy = (Math.random() - 0.5) * speed;
        break;
      case 2: // Bottom
        x = Math.random() * width;
        y = height + 30;
        vx = (Math.random() - 0.5) * speed;
        vy = -(Math.random() * speed + 1);
        break;
      default: // Left
        x = -30;
        y = Math.random() * height;
        vx = Math.random() * speed + 1;
        vy = (Math.random() - 0.5) * speed;
    }

    return { x, y, vx, vy, size: 25 + Math.random() * 15 };
  }, []);

  const spawnCollectible = useCallback((width: number, height: number) => {
    return {
      x: 50 + Math.random() * (width - 100),
      y: 50 + Math.random() * (height - 100),
      type: Math.random() > 0.7 ? 'beer' : 'guitar' as 'guitar' | 'beer',
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationId: number;

    // Initialize player position
    gameStateRef.current.player.x = width / 2;
    gameStateRef.current.player.y = height / 2;

    // Key handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (gameOver || isPaused) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }

      const state = gameStateRef.current;
      const playerSpeed = 5;

      // Move player
      if (state.keys['arrowup'] || state.keys['w']) {
        state.player.y = Math.max(state.player.size, state.player.y - playerSpeed);
      }
      if (state.keys['arrowdown'] || state.keys['s']) {
        state.player.y = Math.min(height - state.player.size, state.player.y + playerSpeed);
      }
      if (state.keys['arrowleft'] || state.keys['a']) {
        state.player.x = Math.max(state.player.size, state.player.x - playerSpeed);
      }
      if (state.keys['arrowright'] || state.keys['d']) {
        state.player.x = Math.min(width - state.player.size, state.player.x + playerSpeed);
      }

      // Spawn enemies
      const spawnRate = Math.max(500, 2000 - state.difficulty * 200);
      if (timestamp - state.lastSpawn > spawnRate) {
        state.enemies.push(spawnEnemy(width, height));
        state.lastSpawn = timestamp;
      }

      // Spawn collectibles
      if (timestamp - state.lastCollectibleSpawn > 3000 && state.collectibles.length < 3) {
        state.collectibles.push(spawnCollectible(width, height));
        state.lastCollectibleSpawn = timestamp;
      }

      // Update enemies
      state.enemies = state.enemies.filter(enemy => {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;

        // Remove if off screen
        if (enemy.x < -50 || enemy.x > width + 50 || enemy.y < -50 || enemy.y > height + 50) {
          return false;
        }

        // Check collision with player
        const dx = enemy.x - state.player.x;
        const dy = enemy.y - state.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < state.player.size + enemy.size / 2) {
          setGameOver(true);
          onGameEnd(state.score);
          return false;
        }

        return true;
      });

      // Check collectible collisions
      state.collectibles = state.collectibles.filter(collectible => {
        const dx = collectible.x - state.player.x;
        const dy = collectible.y - state.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < state.player.size + 15) {
          const points = collectible.type === 'guitar' ? 100 : 50;
          state.score += points;
          setScore(state.score);
          return false;
        }
        return true;
      });

      // Increase difficulty
      state.difficulty = 1 + Math.floor(state.score / 500);

      // Add time-based score
      state.score += 1;
      setScore(state.score);

      // Draw
      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Grid pattern
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw collectibles
      state.collectibles.forEach(collectible => {
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(collectible.type === 'guitar' ? '🎸' : '🍺', collectible.x, collectible.y);
      });

      // Draw enemies (moseurs)
      state.enemies.forEach(enemy => {
        ctx.font = `${enemy.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Rotate based on velocity
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(Math.atan2(enemy.vy, enemy.vx));
        ctx.fillText('💀', 0, 0);
        ctx.restore();
      });

      // Draw player
      ctx.font = `${state.player.size * 1.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🤘', state.player.x, state.player.y);

      // Player glow
      ctx.beginPath();
      ctx.arc(state.player.x, state.player.y, state.player.size, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        state.player.x, state.player.y, 0,
        state.player.x, state.player.y, state.player.size
      );
      gradient.addColorStop(0, 'rgba(220, 38, 38, 0.3)');
      gradient.addColorStop(1, 'rgba(220, 38, 38, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, isPaused, spawnEnemy, spawnCollectible, onGameEnd]);

  const handleRestart = () => {
    gameStateRef.current = {
      player: { x: 300, y: 300, size: 30 },
      enemies: [],
      collectibles: [],
      keys: {},
      score: 0,
      difficulty: 1,
      lastSpawn: 0,
      lastCollectibleSpawn: 0,
    };
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="relative">
      {/* Score display */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-[var(--muted)] px-4 py-2 rounded-lg">
          <span className="text-sm text-[var(--muted-foreground)]">Score: </span>
          <span className="text-2xl font-display text-[var(--accent-red)]">{score}</span>
        </div>
        <div className="bg-[var(--muted)] px-4 py-2 rounded-lg">
          <span className="text-sm text-[var(--muted-foreground)]">Niveau: </span>
          <span className="text-xl font-display text-[var(--foreground)]">
            {Math.floor(1 + score / 500)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? '▶️ Reprendre' : '⏸️ Pause'}
        </Button>
      </div>

      {/* Game canvas */}
      <div className="relative border-2 border-[var(--accent-red)] rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full max-w-[600px] mx-auto block bg-[#0a0a0a]"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center"
          >
            <div className="text-center">
              <p className="font-display text-4xl text-[var(--foreground)] mb-4">PAUSE</p>
              <Button onClick={() => setIsPaused(false)}>
                Reprendre
              </Button>
            </div>
          </motion.div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center"
          >
            <div className="text-center p-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                💀
              </motion.div>
              <h2 className="font-display text-5xl text-[var(--accent-red)] mb-4">
                GAME OVER
              </h2>
              <p className="text-2xl text-[var(--foreground)] mb-2">
                Score final: <span className="text-[var(--accent-red)]">{score}</span>
              </p>
              <p className="text-[var(--muted-foreground)] mb-6">
                Tu as survécu jusqu&apos;au niveau {Math.floor(1 + score / 500)}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleRestart}>
                  🔄 Rejouer
                </Button>
                <Button variant="outline" onClick={() => onGameEnd(score)}>
                  Retour au menu
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile controls */}
      <div className="mt-4 md:hidden">
        <p className="text-center text-sm text-[var(--muted-foreground)] mb-2">
          Contrôles tactiles
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          <div />
          <button
            className="bg-[var(--muted)] p-4 rounded-lg text-2xl active:bg-[var(--accent-red)]"
            onTouchStart={() => gameStateRef.current.keys['w'] = true}
            onTouchEnd={() => gameStateRef.current.keys['w'] = false}
          >
            ↑
          </button>
          <div />
          <button
            className="bg-[var(--muted)] p-4 rounded-lg text-2xl active:bg-[var(--accent-red)]"
            onTouchStart={() => gameStateRef.current.keys['a'] = true}
            onTouchEnd={() => gameStateRef.current.keys['a'] = false}
          >
            ←
          </button>
          <button
            className="bg-[var(--muted)] p-4 rounded-lg text-2xl active:bg-[var(--accent-red)]"
            onTouchStart={() => gameStateRef.current.keys['s'] = true}
            onTouchEnd={() => gameStateRef.current.keys['s'] = false}
          >
            ↓
          </button>
          <button
            className="bg-[var(--muted)] p-4 rounded-lg text-2xl active:bg-[var(--accent-red)]"
            onTouchStart={() => gameStateRef.current.keys['d'] = true}
            onTouchEnd={() => gameStateRef.current.keys['d'] = false}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
