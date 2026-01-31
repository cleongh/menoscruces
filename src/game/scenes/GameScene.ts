import Player from "../player";
import { InventoryUI } from "../UI/InventoryUI";
import Merchant from "../merchant";
import AbstractEnemy from "../enemies/AbstractEnemy";
import { AbstractCoin } from "../sceneObjects/AbstractCoin";
import { baseStats, FatManager } from "../state/FatManager";
import { Projectile } from "../enemies/ProjectileEnemy";
import Landmark from "./Landmark";
import { EnemySpawner } from "../enemies/EnemySpawner";
import { enemyWaves } from "../enemies/enemyWave";
import { TypedEventEmitter } from "../state/typedEvents";

export class GameScene extends Phaser.Scene {
  declare body: Phaser.Physics.Arcade.Body;

  private player: Player;
  private merchant: Merchant;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private landmarks: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private inventory: InventoryUI;
  private coins: Phaser.Physics.Arcade.Group;
  private width: number = 2000;
  private height: number = 2000;
  private music: any;
  public typedEvents: TypedEventEmitter;

  public fatManager: FatManager;
  private enemySpawner: EnemySpawner;

  constructor() {
    super("GameScene");
    this.fatManager = new FatManager(this, baseStats);
    this.typedEvents = new TypedEventEmitter();
  }

  create() {
    this.enemies = this.physics.add.group({
      classType: AbstractEnemy,
    });

    this.projectiles = this.physics.add.group({
      classType: Projectile,
    });

    this.landmarks = this.physics.add.staticGroup({
      classType: Landmark,
    });

    this.player = new Player(this, 0, 0, this.enemies);

    this.merchant = new Merchant(this, 0, 0, this.player);

    this.coins = this.physics.add.group({
      classType: AbstractCoin,
    });

    // recoger moneda al tocarla
    this.physics.add.collider(this.player, this.coins, (_, coin) => {
      const c = coin as AbstractCoin;
      c.handleCoinPickup();
    });

    this.physics.add.collider(this.player, this.landmarks);

    this.physics.add.overlap(
      this.player,
      this.projectiles,
      (player, projectile) => {
        const pr = projectile as Projectile;
        const pl = player as Player;

        pl.receiveDamage(pr.damage);
        pr.destroy();
      },
    );

    this.enemySpawner = new EnemySpawner(
      this,
      enemyWaves,
      this.player,
      this.enemies,
    );
    this.enemySpawner.updateCenter(0, 0);
    const outerRadius = Math.max(
      this.game.config.height as number,
      this.game.config.width as number,
    );
    const innerRadius = outerRadius * 0.75;
    this.enemySpawner.innerRadius = innerRadius;
    this.enemySpawner.outerRadius = outerRadius;
    this.enemySpawner.setPaused(false);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.inventory = new InventoryUI(this, 50, 40);

    this.physics.world.setBounds(0, 0, this.width, this.height);
    this.cameras.main.setBounds(0, 0, this.width, this.height);
    this.cameras.main.startFollow(this.player);

    this.createLandmarks();

    const config = {
      mute: false,
      volume: 0,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0,
    };
    this.music = this.sound.add("music", config);
    this.music.play();

    this.tweens.add({
      targets: this.music,
      volume: { from: 0, to: 0.5 },
      duration: 3000,
      ease: "Linear",
    });
  }

  update() {
    this.player.update(this.cursors);
    this.fatManager.tickActiveCoins();

    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.update(this.player);
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
        ) <= enemy.distanceAttack
      ) {
        console.log("Pero te quiero...");
        enemy.physicalAttack(this.player);
      }
    });

    this.merchant.update();
  }

  createLandmarks(numLandMarks: number = 10) {
    for (let i = 0; i < numLandMarks; ++i) {
      let x = Phaser.Math.Between(0, this.width);
      let y = Phaser.Math.Between(0, this.height);

      const l = new Landmark(this, x, y);
      this.landmarks.add(l);
      l.body!.immovable = true;
    }
  }

  public infernallSmell_Cara(){
    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.update(this.player);
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
        ) <= 2 * this.player.width
      ) {
        let damage = this.fatManager.getTransformedState().baseStats.attackBase;
        enemy.quitHealth(damage * 3);

        console.log("Quita vida");
      }
    });
  }

  public infernallSmell_Cruz(){
    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.update(this.player);
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
        ) <= 2* this.player.width
      ) {
        let damage = this.fatManager.getTransformedState().baseStats.attackBase;
        enemy.quitHealth(-damage/2);

        console.log("Da vida");
      }
    });
  }
}
