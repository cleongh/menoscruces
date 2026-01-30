import Enemy from "./enemy";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public speed: number = 160;
  private dir: Phaser.Math.Vector2;
  private lastDir: Phaser.Math.Vector2;

  private aKey: Phaser.Input.Keyboard.Key;
  private dKey: Phaser.Input.Keyboard.Key;
  private sKey: Phaser.Input.Keyboard.Key;
  private wKey: Phaser.Input.Keyboard.Key;

  private attackLength: number = 100;
  private attackCooldown: number = 1000;
  private attackTime: number = 500;
  private timerAttack: Phaser.Time.TimerEvent;
  private attackCollider: Phaser.GameObjects.Zone;
  private damage: number = 100;

  constructor(scene: Phaser.Scene, x: number, y: number, enemyGroup: Phaser.Physics.Arcade.Group) {
    super(scene, x, y, "logo");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    this.dir = new Phaser.Math.Vector2(0, 0);
    this.lastDir = new Phaser.Math.Vector2(1, 0);

    this.aKey = scene.input.keyboard!.addKey('a');
    this.dKey = scene.input.keyboard!.addKey('d');
    this.sKey = scene.input.keyboard!.addKey('s');
    this.wKey = scene.input.keyboard!.addKey('w');

    this.attackCollider = scene.add.zone(x, y, this.attackLength, 50);
    this.attackCollider.setOrigin(0.5, 0.5);
    scene.physics.add.existing(this.attackCollider);
    scene.physics.add.overlap(this.attackCollider, enemyGroup, (p, e) => {
      (e as Enemy).quitHealth(this.damage);
    });
    this.attackCollider.active = false;
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;

    this.timerAttack = this.scene.time.addEvent({
      delay: this.attackCooldown,
      callback: this.onAttack,
      callbackScope: this,
      loop: true
    })
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    let animKey: string;

    this.dir.x = 0;
    this.dir.y = 0;

    if (this.aKey.isDown || cursors.left.isDown) {
      this.dir.x = -1;
      this.lastDir.x = -1;
      animKey = '_run';
      this.setFlipX(true);
    }

    if (this.dKey.isDown || cursors.right.isDown) {
      this.dir.x = 1
      this.lastDir.x = 1;
      animKey = '_run'
      this.setFlipX(false);
    }

    if (this.wKey.isDown || cursors.up.isDown) {
      this.dir.y = -1
      this.lastDir.y = -1
      animKey = '_run'
    }

    if (this.sKey.isDown || cursors.down.isDown) {
      this.dir.y = 1
      this.lastDir.y = 1
      animKey = '_run'
    }

    this.dir.normalize();
    this.body!.setVelocity(this.dir.x * this.speed, this.dir.y * this.speed);

    this.attackCollider.setX(this.x + this.lastDir.x * (this.width / 2 + this.attackCollider.width / 2));
    this.attackCollider.setY(this.y);
  }

  onAttack() {
    // this.attackCollider.setX(this.x + this.lastDir.x * (this.width / 2 + this.attackCollider.width / 2));
    // this.attackCollider.setY(this.y);

    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = true;

    this.scene.time.addEvent({
      delay: this.attackTime,
      callback: this.onStopAttacking,
      callbackScope: this,
    })
  }

  onStopAttacking(){
    (this.attackCollider.body as Phaser.Physics.Arcade.Body).enable = false;
  }
}

