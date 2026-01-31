import AbstractEnemy from "./enemies/AbstractEnemy";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public speed: number = 160;
  private dir: Phaser.Math.Vector2;
  private lastDir: Phaser.Math.Vector2;

  private aKey: Phaser.Input.Keyboard.Key;
  private dKey: Phaser.Input.Keyboard.Key;
  private sKey: Phaser.Input.Keyboard.Key;
  private wKey: Phaser.Input.Keyboard.Key;

  private attackLength: number = 200;
  private attackCooldown: number = 1000;
  private attackTime: number = 500;
  private attackCollider: Phaser.GameObjects.Zone;
  private damage: number = 250;

  private health: number = 1000;
  private cooldownDamage: number = 200;
  private canRecieveDamage:boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    enemyGroup: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, "player");
    this.scale = 1/4;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.dir = new Phaser.Math.Vector2(0, 0);
    this.lastDir = new Phaser.Math.Vector2(1, 0);

    this.aKey = scene.input.keyboard!.addKey("a");
    this.dKey = scene.input.keyboard!.addKey("d");
    this.sKey = scene.input.keyboard!.addKey("s");
    this.wKey = scene.input.keyboard!.addKey("w");

    this.attackCollider = scene.add.zone(x, y, this.attackLength, this.height);
    this.attackCollider.setOrigin(0.5, 0.5);
    scene.physics.add.existing(this.attackCollider);
    scene.physics.add.overlap(this.attackCollider, enemyGroup, (p, e) => {
      (e as AbstractEnemy).quitHealth(this.damage);
    });
    this.attackCollider.active = false;
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;

    this.scene.time.addEvent({
      delay: this.attackCooldown,
      callback: this.onAttack,
      callbackScope: this,
      loop: true,
    });

    this.canRecieveDamage = true;
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
    this.body?.setVelocity(this.dir.x * this.speed, this.dir.y * this.speed);

    this.play(animKey, true);

    this.attackCollider.setX(
      this.x +
        this.lastDir.x * (this.width / 2 + this.attackCollider.width / 2),
    );
    this.attackCollider.setY(this.y);
  }

  onAttack() {
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = true;

    this.scene.time.addEvent({
      delay: this.attackTime,
      callback: this.onStopAttacking,
      callbackScope: this,
    });
  }

  onStopAttacking() {
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;
  }

  public receiveDamage(damage: number) {
    if(!this.canRecieveDamage)
      return;
    
    this.canRecieveDamage = false;
    this.scene.time.addEvent({
      delay: this.cooldownDamage,
      callback: ()=>{this.canRecieveDamage = true;},
      callbackScope: this,
    })

    this.health -= damage;

    if (this.health <= 0) {
      this.destroy();
    }
  }
}