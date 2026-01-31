import AbstractEnemy from "./enemies/AbstractEnemy";
import RubberBand from "./RubberBand"
import { GameScene } from "./scenes/GameScene";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  private dir: Phaser.Math.Vector2;
  private lastDir: Phaser.Math.Vector2;

  private aKey: Phaser.Input.Keyboard.Key;
  private dKey: Phaser.Input.Keyboard.Key;
  private sKey: Phaser.Input.Keyboard.Key;
  private wKey: Phaser.Input.Keyboard.Key;

  private attackCooldown: number = 1000;
  private attackTime: number = 500;
  private attackCollider: RubberBand;

  private health: number;
  private cooldownDamage: number = 200;
  private canRecieveDamage: boolean;

  private attackOffset: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyGroup: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, "player");
    this.scale = 1 / 4;
    this.setTint(0xb8fb27)
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.dir = new Phaser.Math.Vector2(0, 0);
    this.lastDir = new Phaser.Math.Vector2(1, 0);

    this.aKey = scene.input.keyboard!.addKey("a");
    this.dKey = scene.input.keyboard!.addKey("d");
    this.sKey = scene.input.keyboard!.addKey("s");
    this.wKey = scene.input.keyboard!.addKey("w");

    this.attackCollider = new RubberBand(scene, this.x, this.y);
    this.attackCollider.setOrigin(0.5, 0.5);
    scene.physics.add.overlap(this.attackCollider, enemyGroup, (_, e) => {
      const fatManager = (this.scene as GameScene).fatManager;
      (e as AbstractEnemy).quitHealth(fatManager.getTransformedState().baseStats.attackBase);
    });
    this.attackCollider.active = false;
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;
    this.attackCollider.visible = false;

    this.scene.time.addEvent({
      delay: this.attackCooldown,
      callback: this.onAttack,
      callbackScope: this,
      loop: true,
    });

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.heal,
      callbackScope: this,
      loop: true,
    });

    this.canRecieveDamage = true;

    this.attackOffset = this.width / 8;
  }

  protected preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    let animKey: string = "idle";

    this.dir.x = 0;
    this.dir.y = 0;

    if (this.aKey.isDown || cursors.left.isDown) {
      this.dir.x = -1;
      this.lastDir.x = -1;
      animKey = "run";
      this.setFlipX(true);
    }

    if (this.dKey.isDown || cursors.right.isDown) {
      this.dir.x = 1;
      this.lastDir.x = 1;
      animKey = "run";
      this.setFlipX(false);
    }

    if (this.wKey.isDown || cursors.up.isDown) {
      this.dir.y = -1;
      this.lastDir.y = -1;
      animKey = "run";
    }

    if (this.sKey.isDown || cursors.down.isDown) {
      this.dir.y = 1;
      this.lastDir.y = 1;
      animKey = "run";
    }

    this.dir.normalize();

    const fatManager = (this.scene as GameScene).fatManager;
    let speed = fatManager.getTransformedState().baseStats.speedBase;
    this.body?.setVelocity(this.dir.x * speed, this.dir.y * speed);

    this.play(animKey, true);

    this.attackCollider.setX(
      this.x +
      this.lastDir.x * (-this.attackOffset + this.width * this.scale / 2 + this.attackCollider.width * this.attackCollider.scale / 2),
    );
    this.attackCollider.setY(this.y);
    this.attackCollider.setFlipX(this.lastDir.x < 0);
  }

  onAttack() {
    this.attackCollider.updateRangeFactor((this.scene as GameScene).fatManager.getTransformedState().baseStats.rangeBase);
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = true;

    this.attackCollider.active = true;
    this.attackCollider.visible = true;
    this.attackCollider.play("gomilla", true);

    this.scene.time.addEvent({
      delay: this.attackTime,
      callback: this.onStopAttacking,
      callbackScope: this,
    });
  }

  onStopAttacking() {
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;
    this.attackCollider.visible = false;
    this.attackCollider.stop();
    this.attackCollider.active = false;
  }

  public receiveDamage(damage: number) {
    if (!this.canRecieveDamage)
      return;

    this.canRecieveDamage = false;
    this.scene.time.addEvent({
      delay: this.cooldownDamage,
      callback: () => { this.canRecieveDamage = true; },
      callbackScope: this,
    })

    const fatManager = (this.scene as GameScene).fatManager;
    damage = damage - fatManager.getTransformedState().baseStats.defenseBase > 0 ? damage - fatManager.getTransformedState().baseStats.defenseBase : 0;
    this.health -= damage;

    if (this.health <= 0) {
      this.destroy();
    }
  }

  heal() {
    const fatManager = (this.scene as GameScene).fatManager;
    this.health = this.health + fatManager.getTransformedState().baseStats.regenBase < fatManager.getTransformedState().baseStats.healthBase ? this.health + fatManager.getTransformedState().baseStats.regenBase : fatManager.getTransformedState().baseStats.healthBase
  }
}