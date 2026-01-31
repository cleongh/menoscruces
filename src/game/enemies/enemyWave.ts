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

type EnemyType = "boss" | "projectileEnemy";
