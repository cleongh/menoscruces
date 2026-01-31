export default class Merchant extends Phaser.Physics.Arcade.Sprite {

  // TODO change with actual world size after it is defined
  worldWidth = 700;
  worldHeight = 700;

  destinationZone: Phaser.GameObjects.Zone 
  zoneWidth = 10;
  zoneHeigth = 10

  destinationCollider: Phaser.Physics.Arcade.Collider
  hasReachedDestination = false;

  public speed: number = 100;

  trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "flares");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(30, 30);

    this.trailEmitter = this.scene.add.particles(0, 0, 'flares', {
    lifespan: 2000,
    scale: { start: 0.2, end: 0 },
    blendMode: 'ADD',
    emitting: true,
    speed: { min: this.speed - 20 , max: this.speed + 20 },
    angle: 0
  });

    this.onDestinationReached();
  }

  update() {
    // keep trying to reach destionation
    this.scene.physics.moveToObject(this, this.destinationZone, this.speed)

    // set trail at merchant's location
    this.trailEmitter?.setX(this.x);
    this.trailEmitter?.setY(this.y);
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
  let trailAngleDegrees = trailAngleRadians * 180 /  Math.PI;

  this.trailEmitter.setAngle(trailAngleDegrees);
}

  /**
   * Removes current destination zone and replaces it with a new random one
   */
  newDestionationZone() {
    let newZone = this.generateNewZone(this.worldWidth, this.worldHeight);
    this.replaceDestinationZone(newZone);
  }

  /**
   * Creates a new zone with random coordinates
   */
  generateNewZone(canvasWidth: number, canvasHeight: number): Phaser.GameObjects.Zone {
    let x = Phaser.Math.Between(this.zoneWidth/2, canvasWidth - this.zoneWidth/2);
    let y = Phaser.Math.Between(this.zoneHeigth/2, canvasHeight - this.zoneHeigth/2);

    // TODO any extra logic for zone generation?

    return new Phaser.GameObjects.Zone(this.scene, x, y, this.zoneWidth, this.zoneHeigth);
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

}


