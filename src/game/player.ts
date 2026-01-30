export default class Player extends Phaser.Physics.Arcade.Sprite {
  public speed: number = 160;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "logo");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.setVelocity(0);

    if (cursors.left.isDown) this.setVelocityX(-this.speed);
    else if (cursors.right.isDown) this.setVelocityX(this.speed);

    if (cursors.up.isDown) this.setVelocityY(-this.speed);
    else if (cursors.down.isDown) this.setVelocityY(this.speed);

    this.body?.velocity.normalize().scale(this.speed);
  }
}
