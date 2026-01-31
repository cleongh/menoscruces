export default class Merchant extends Phaser.Physics.Arcade.Sprite {

  // TODO change with actual world size after it is defined
  worldWidth = 700;
  worldHeight = 700;

  // TODO add emitter

  destinationZone: Phaser.GameObjects.Zone 
  zoneWidth = 10;
  zoneHeigth = 10

  destinationCollider: Phaser.Physics.Arcade.Collider
  hasReachedDestination = false;

  public speed: number = 100;
  
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "coin");
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.onDestinationReached();
  }

  update() {
    // keep trying to reach destionation
    this.scene.physics.moveToObject(this, this.destinationZone, this.speed)
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

  this.hasReachedDestination = false
  }
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


