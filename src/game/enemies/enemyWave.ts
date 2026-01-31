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

export type EnemyType = "boss" | "projectileEnemy";

export const enemyWaves: WaveConfig[] = [
  {
    lengthInSeconds: 15,
    waitBeforeNextWaveInSeconds: 5,
    enemies: [
      { type: "projectileEnemy", count: 30 },
      { type: "boss", count: 5 },
    ],
  },
  {
    lengthInSeconds: 40,
    waitBeforeNextWaveInSeconds: 15,
    enemies: [
      { type: "projectileEnemy", count: 20 },
      { type: "boss", count: 2 },
    ],
  },
];
