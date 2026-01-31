export class PickableCoin extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  public coinData: { texture: string; value: number; stat: string };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    value: number,
    stat: string,
  ) {
    super(scene, x, y, texture);
    this.coinData = { texture, value, stat };

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(20, 20);

    // TODO: tunear cuerpo para que se sienta natural al chocar
    this.body.setCircle(this.width / 2);
  }
}
