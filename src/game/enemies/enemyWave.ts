export interface WaveConfig {
  /** Cuántos segundos vamos a estar spawneando enemigos de esta oledada */
  lengthInSeconds: number;
  /** Cuántos segundos vamos a esperar entre esta ronda y la siguiente sin enemigos */
  waitBeforeNextWaveInSeconds: number;
  /**
   * Qué enemigos van a salir y cuántos de cada uno
   */
  enemies: { type: EnemyType; count: number }[];
}

export type EnemyType = "boss" | "projectileEnemy" | "basic";

export const enemyWaves: WaveConfig[] = [
  // --- EARLY GAME ---
  {
    lengthInSeconds: 20,
    waitBeforeNextWaveInSeconds: 8,
    enemies: [
      { type: "boss", count: 1 },
      { type: "basic", count: 10 },
    ],
  },
  {
    lengthInSeconds: 20,
    waitBeforeNextWaveInSeconds: 8,
    enemies: [
      { type: "boss", count: 1 },
      { type: "basic", count: 20 },
    ],
  },
  {
    lengthInSeconds: 25,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 1 },
      { type: "projectileEnemy", count: 5 },
    ],
  },
  {
    lengthInSeconds: 30,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 2 },
      { type: "basic", count: 30 },
    ],
  },
  {
    lengthInSeconds: 30,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 2 },
      { type: "projectileEnemy", count: 10 },
    ],
  },

  // --- EARLY-MID ---
  {
    lengthInSeconds: 40,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 3 },
      { type: "basic", count: 50 },
    ],
  },
  {
    lengthInSeconds: 40,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 3 },
      { type: "projectileEnemy", count: 15 },
    ],
  },
  {
    lengthInSeconds: 45,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 4 },
      { type: "basic", count: 60 },
    ],
  },
  {
    lengthInSeconds: 45,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 4 },
      { type: "projectileEnemy", count: 20 },
    ],
  },
  {
    lengthInSeconds: 50,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "boss", count: 6 },
      { type: "basic", count: 40 },
    ],
  }, // Pico de Power-ups

  // --- MID GAME ---
  {
    lengthInSeconds: 50,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 5 },
      { type: "basic", count: 80 },
    ],
  },
  {
    lengthInSeconds: 55,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 5 },
      { type: "projectileEnemy", count: 30 },
    ],
  },
  {
    lengthInSeconds: 60,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 6 },
      { type: "basic", count: 100 },
    ],
  },
  {
    lengthInSeconds: 60,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 6 },
      { type: "projectileEnemy", count: 40 },
    ],
  },
  {
    lengthInSeconds: 65,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "boss", count: 10 },
      { type: "basic", count: 50 },
    ],
  }, // Gran Inyección de stats

  // --- LATE-MID ---
  {
    lengthInSeconds: 70,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "boss", count: 8 },
      { type: "basic", count: 150 },
    ],
  },
  {
    lengthInSeconds: 70,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 8 },
      { type: "projectileEnemy", count: 60 },
    ],
  },
  {
    lengthInSeconds: 75,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 10 },
      { type: "basic", count: 100 },
      { type: "projectileEnemy", count: 20 },
    ],
  },
  {
    lengthInSeconds: 80,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 12 },
      { type: "basic", count: 200 },
    ],
  },
  {
    lengthInSeconds: 85,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "boss", count: 15 },
      { type: "projectileEnemy", count: 80 },
    ],
  },

  // --- LATE GAME ---
  {
    lengthInSeconds: 90,
    waitBeforeNextWaveInSeconds: 12,
    enemies: [
      { type: "boss", count: 12 },
      { type: "basic", count: 250 },
    ],
  },
  {
    lengthInSeconds: 90,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 15 },
      { type: "projectileEnemy", count: 100 },
    ],
  },
  {
    lengthInSeconds: 95,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 18 },
      { type: "basic", count: 300 },
    ],
  },
  {
    lengthInSeconds: 100,
    waitBeforeNextWaveInSeconds: 8,
    enemies: [
      { type: "boss", count: 20 },
      { type: "projectileEnemy", count: 120 },
    ],
  },
  {
    lengthInSeconds: 110,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "boss", count: 25 },
      { type: "basic", count: 400 },
    ],
  },

  {
    lengthInSeconds: 120,
    waitBeforeNextWaveInSeconds: 10,
    enemies: [
      { type: "boss", count: 30 },
      { type: "basic", count: 500 },
    ],
  },
  {
    lengthInSeconds: 120,
    waitBeforeNextWaveInSeconds: 8,
    enemies: [
      { type: "boss", count: 35 },
      { type: "projectileEnemy", count: 150 },
    ],
  },
  {
    lengthInSeconds: 130,
    waitBeforeNextWaveInSeconds: 5,
    enemies: [
      { type: "boss", count: 40 },
      { type: "basic", count: 600 },
    ],
  },
  {
    lengthInSeconds: 140,
    waitBeforeNextWaveInSeconds: 5,
    enemies: [
      { type: "boss", count: 50 },
      { type: "projectileEnemy", count: 200 },
    ],
  },
  {
    lengthInSeconds: 180,
    waitBeforeNextWaveInSeconds: 0,
    enemies: [
      { type: "boss", count: 100 },
      { type: "projectileEnemy", count: 400 },
      { type: "basic", count: 1000 },
    ],
  },
];
