import { GameScene } from "../scenes/GameScene";
import AbstractEnemy from "./AbstractEnemy";
import Boss from "./Boss";
import { EnemyType, WaveConfig } from "./enemyWave";
import { ProjectileEnemy } from "./ProjectileEnemy";
import BasicEnemy from "./basicEnemy";

export class EnemySpawner {
  private scene: Phaser.Scene;
  private waves: WaveConfig[];
  private currentWaveIndex: number = 0;

  private isPaused: boolean = false;
  private spawnTimer?: Phaser.Time.TimerEvent;
  private waveTimer?: Phaser.Time.TimerEvent;
  private enemies: Phaser.Physics.Arcade.Group;

  // Corona (Ring) Parameters
  public center: Phaser.Math.Vector2;
  public innerRadius: number = 400;
  public outerRadius: number = 600;

  constructor(
    scene: Phaser.Scene,
    waves: WaveConfig[],
    player: Phaser.GameObjects.Components.Transform,
    enemies: Phaser.Physics.Arcade.Group,
  ) {
    this.scene = scene;
    this.waves = waves;
    this.center = new Phaser.Math.Vector2(player.x, player.y);
    this.enemies = enemies;

    this.startWave(0);
  }

  private startWave(index: number) {
    if (index >= this.waves.length) {
      console.log("All waves completed!");
      return;
    }

    this.currentWaveIndex = index;
    const config = this.waves[index];

    // 1. Prepare the randomized pool of enemies for this wave
    const enemyPool: EnemyType[] = [];
    config.enemies.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        enemyPool.push(group.type);
      }
    });
    Phaser.Utils.Array.Shuffle(enemyPool);

    // 2. Calculate uniform timing
    const totalEnemies = enemyPool.length;
    const spawnInterval = (config.lengthInSeconds * 1000) / totalEnemies;

    // 3. Setup the Spawn Loop
    this.spawnTimer = this.scene.time.addEvent({
      delay: spawnInterval,
      repeat: totalEnemies - 1,
      callback: () => this.spawnSingleEnemy(enemyPool.pop()!),
      callbackScope: this,
      paused: this.isPaused,
    });

    // 4. Setup the Transition to next wave
    this.waveTimer = this.scene.time.delayedCall(
      (config.lengthInSeconds + config.waitBeforeNextWaveInSeconds) * 1000,
      () => this.startWave(index + 1),
      [],
      this,
    );
  }

  private spawnSingleEnemy(type: EnemyType) {
    const point = this.getRandomPointInCorona();

    // Logic to instantiate your specific enemy classes
    let enemy: AbstractEnemy;
    switch (type) {
      case "boss":
        enemy = new Boss(this.scene, point.x, point.y);
        break;
      case "projectileEnemy":
        enemy = new ProjectileEnemy(this.scene, point.x, point.y);
        break;
      case "basic":
        enemy = new BasicEnemy(this.scene, point.x, point.y);
        break;
    }
    this.enemies.add(enemy, true);
    console.log(`Spawned enemy of type ${type} at (${point.x}, ${point.y})`);
  }

  private getRandomPointInCorona(): Phaser.Math.Vector2 {
    // Uniform distribution in a circular ring (corona)
    const angle = Math.random() * Math.PI * 2;
    // We use sqrt to ensure uniform density across the area
    const r = Math.sqrt(
      Math.random() *
      (Math.pow(this.outerRadius, 2) - Math.pow(this.innerRadius, 2)) +
      Math.pow(this.innerRadius, 2),
    );

    return new Phaser.Math.Vector2(
      this.center.x + r * Math.cos(angle),
      this.center.y + r * Math.sin(angle),
    );
  }

  public setPaused(value: boolean) {
    this.isPaused = value;
    if (this.spawnTimer) this.spawnTimer.paused = value;
    if (this.waveTimer) this.waveTimer.paused = value;
  }

  public updateCenter(x: number, y: number) {
    this.center.set(x, y);
  }
}
