import { GameScene } from "../scenes/GameScene";
import { WaveConfig } from "./enemyWave";

export class EnemySpawner {
  private waveData: WaveConfig[];
  private timeUntilNextWave: number = 0;
  private scene: GameScene;

  constructor(scene: GameScene, waveData: WaveConfig[]) {
    this.waveData = waveData;
    this.scene = scene;
  }
}
