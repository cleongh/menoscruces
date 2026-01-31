import Player from "./player";

export default class Merchant extends Phaser.Physics.Arcade.Sprite {

  // zona a la que se desplaza el mercader
  destinationZone: Phaser.GameObjects.Zone;
  destinationZoneWidth = 10;
  destinationZoneHeight = 10;
  destinationCollider: Phaser.Physics.Arcade.Collider;
  hasReachedDestination = false;

  // area alrededor del merchant en la que debe entrar el jugador para interactuar
  public playerCollideZone: Phaser.GameObjects.Zone;
  playerCollideSize = 200;
  playerIsWithMerchant = false;

  // velocidad de movimiento del mercader
  public speed: number = 50;

  // emitter de particulas tras el mercader
  trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  // reference to the player, see if it is colliding still with the merchant 
  player: Player

  constructor(scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player) {
    super(scene, x, y, "flares");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(30, 30);

    this.player = player;

    // añadir pedos cósmicos al mercader
    this.trailEmitter = this.scene.add.particles(0, 0, 'flares', {
      lifespan: 2000,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      emitting: true,
      speed: { min: this.speed - 20, max: this.speed + 20 },
      angle: 0
    });

    // genera nueva zona de destino inicial
    this.onDestinationReached();

    // añadir zona con la que colisiona el jugador
    this.playerCollideZone = new Phaser.GameObjects.Zone(this.scene, x, y, this.playerCollideSize, this.playerCollideSize);
    this.scene.add.existing(this.playerCollideZone);
    this.scene.physics.add.existing(this.playerCollideZone);

    // habilitar interacción con mercader al acercarse lo suficiente
    scene.physics.add.overlap(player, this.playerCollideZone, (player, merchantZone) => {
      if (!this.playerIsWithMerchant) {
      this.onPlayerReachedMerchant();
      }
    })
  }

  update() {
    // keep trying to reach destionation
    this.scene.physics.moveToObject(this, this.destinationZone, this.speed)

    // set trail at merchant's location
    this.trailEmitter?.setX(this.x);
    this.trailEmitter?.setY(this.y);

    // mover la zona de colision con el jugador
    this.playerCollideZone.setX(this.x);
    this.playerCollideZone.setY(this.y);

    // después de entrar en la zona del mercader, chequear si el player sigue ahí
    if (this.playerIsWithMerchant) {
      if (!this.player.body?.embedded) {
        this.onPlayerLeftMerchant();
      }
    }
  }

  /**
 * When destination is reached, stop checking, generate new destination, set collider for it
 */
  onDestinationReached() {
    if (!this.hasReachedDestination) {
      this.hasReachedDestination = true

      // Remove previous collider
      if (this.destinationCollider) {
        this.scene.physics.world.removeCollider(this.destinationCollider)
        this.destinationCollider.destroy();
      }

      // generate new zone to travel to
      this.newDestionationZone();

      // set up new collider to trigger when reaching the zone
      this.destinationCollider = this.scene.physics.add.overlap(this.destinationZone, this, (zone, merchant) => {
        this.onDestinationReached();
      }
      )

      // update particle emitter angle when destination changes
      this.updateParticleEmitter();

      this.hasReachedDestination = false
    }
  }

  /**
   * Updates the particle emitter trailing from player to match its path
   */
  updateParticleEmitter() {
    // angle between merechant and destination, 
    let trailAngleRadians = Phaser.Math.Angle.Between(this.destinationZone.x, this.destinationZone.y, this.x, this.y);

    // stupid unit transformation
    let trailAngleDegrees = trailAngleRadians * 180 / Math.PI;

    this.trailEmitter.setAngle(trailAngleDegrees);
  }

  /**
   * Removes current destination zone and replaces it with a new random one
   */
  newDestionationZone() {
    let newZone = this.generateNewZone(this.scene.game.config.width as number, this.scene.game.config.height as number);
    this.replaceDestinationZone(newZone);
  }

  /**
   * Creates a new zone with random coordinates
   */
  generateNewZone(canvasWidth: number, canvasHeight: number): Phaser.GameObjects.Zone {
    let x = Phaser.Math.Between(this.destinationZoneWidth / 2, canvasWidth - this.destinationZoneWidth / 2);
    let y = Phaser.Math.Between(this.destinationZoneHeight / 2, canvasHeight - this.destinationZoneHeight / 2);

    // TODO any extra logic for zone generation?

    return new Phaser.GameObjects.Zone(this.scene, x, y, this.destinationZoneWidth, this.destinationZoneHeight);
  }

  /**
   * Removes previous destination zone and replaces it with new one provided
   */
  replaceDestinationZone(zone: Phaser.GameObjects.Zone) {
    this.destinationZone?.destroy();
    this.destinationZone = zone;
    this.scene.add.existing(zone);
    this.scene.physics.add.existing(zone);
  }

  /**
   * Callback cuando el jugador ha llegado al mercader
   */
  onPlayerReachedMerchant() {
    this.playerIsWithMerchant = true
    console.log("LLEGASTE AL MERCADER!!")
  }

  /**
   * Callback cuando el jugador deja la zona del mercader
   */
  onPlayerLeftMerchant() {
    this.playerIsWithMerchant = false
        console.log("TE FUISTE!!")

  }

}


