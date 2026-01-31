export abstract class AbstractCoin extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    size: number,
  ) {
    super(scene, x, y, texture);

    this.setOrigin(0.5, 0.5);
    this.setDisplaySize(size, size);

    scene.physics.add.existing(this);

    // TODO: tunear cuerpo para que se sienta natural al chocar
    this.body.setCircle(this.width / 2);
  }

  /**
   * Maneja la lógica cuando el jugador recoge la moneda.
   * Debe ser llamada desde la escena en el callback de colisión entre entidades.
   */
  public abstract handleCoinPickup(): void;
}
