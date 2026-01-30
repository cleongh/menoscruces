import Enemy from "../enemy";
import Player from "../player";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("GameScene");
  }
  
  create() {
    this.player = new Player(this, 0, 0);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.player, this.enemies, (p, e) => {
      console.log("Pero te quiero...");
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const x = this.player.x + Math.cos(angle) * 500;
    const y = this.player.y + Math.sin(angle) * 500;

    const enemy = new Enemy(this, x, y);
    this.enemies.add(enemy, true);
  }

  update() {
    this.player.update(this.cursors);

    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.followPlayer(this.player);
    });
  }
}
