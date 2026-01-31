import Player from "./player";
import { GameScene } from "./scenes/GameScene";
import { FatManager } from "./state/FatManager";

export default class Merchant extends Phaser.Physics.Arcade.Sprite {

  // zona a la que se desplaza el mercader
  destinationZone: Phaser.GameObjects.Zone;
  destinationZoneWidth = 10;
  destinationZoneHeight = 10;
  destinationCollider: Phaser.Physics.Arcade.Collider;
  hasReachedDestination = false;

  // distancia alrededor del merchant en la que debe entrar el jugador para poder interactuar
  playerMinDistance = 200;
  playerIsWithMerchant = false;

  // velocidad de movimiento del mercader
  public speed: number = 60;
  defaultSpeed: number = 60;
  speedWithPlayer: number = 10;

  // emitter de particulas tras el mercader
  trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  // reference to the player, see if it is colliding still with the merchant 
  player: Player

  // indicador visual de que se puede interactuar con el mercader
  interactionSign: Phaser.GameObjects.Text
  interactionSignBackgroundDefault = "#2201fc"
  interactionSignBackgroundPressed = "#fc01fc"

  // pulsar tecla M para interactuar con mercader
  private mKey = "keydown-M";

  // true cuando el jugador: está en rango de mercader Y pulsa la tecla
  playerHasInteracted = false

  // el gestor gordote
  fatManager: FatManager;

  constructor(scene: Phaser.Scene,
    x: number,
    y: number,
    player: Player) {
    super(scene, x, y, "flares");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(30, 30);

    this.fatManager = (scene as GameScene).fatManager;
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

    // pulsar tecla para interactuar con mercader
    scene.input.keyboard?.on(this.mKey, (event: any) => {
      console.log("M key pressed", event)
      this.onPlayerWantsToTrade();
    })
    
  }

  update() {
    // seguir viajando al siguiente destino
    this.scene.physics.moveToObject(this, this.destinationZone, this.speed)

    // mover el trail
    this.trailEmitter?.setX(this.x);
    this.trailEmitter?.setY(this.y);

    // cuando el jugador se acerca al merchant, habilitar interaccion
    let distanceFromPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.x, this.y)

    // si el jugador no había llegado y ahora entra en la zona, trigger
    if (distanceFromPlayer <= this.playerMinDistance && !this.playerIsWithMerchant) {
      this.onPlayerReachedMerchant();
    }

    // si el jugador estaba con el merchant y se va, trigger
    if (distanceFromPlayer > this.playerMinDistance && this.playerIsWithMerchant) {
      this.onPlayerLeftMerchant();
    }


    // cuando el jugador está en rango del mercader
    if (this.playerIsWithMerchant) {

      // cuando el player está en rango, y se muestra indicador, moverlo con el mercader
      if (this.interactionSign) {
        let newInteractionSignCoords = this.getInteractionSignCoords(this.x, this.y);
        this.interactionSign.setX(newInteractionSignCoords[0])
        this.interactionSign.setY(newInteractionSignCoords[1])
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
    console.log("LLEGASTE AL MERCADER!!")
    this.playerIsWithMerchant = true

    // reducir velocidad cuando le encuentra el jugador
    this.speed = this.speedWithPlayer;



    // mostrar que se puede interactuar
    this.showInteraction();
  }

  /**
   * Callback cuando el jugador deja la zona del mercader
   */
  onPlayerLeftMerchant() {
    console.log("por qué te vas? :(")
    this.playerIsWithMerchant = false

    // restaurar velocidad cuando player se va 
    this.speed = this.defaultSpeed;

    // no mostrar interaccion cuando el jugador se aleja
    this.hideInteraction();
    this.playerHasInteracted = false
  }

  onPlayerWantsToTrade() {
    if (this.playerIsWithMerchant && !this.playerHasInteracted) {
      this.playerHasInteracted = true
      console.log("MERCADEA CONMIGO!!!")
      this.interactionSign?.setBackgroundColor(this.interactionSignBackgroundPressed)
      this.fatManager.commitCoinsToMerchant();
      this.speed = this.defaultSpeed;
    }
  }

  /**
   * Muestra visualmente que se puede interactuar con el mercader
   */
  showInteraction() {
    let signCoordinates = this.getInteractionSignCoords(this.x, this.y)
    this.interactionSign = this.scene.add.text(signCoordinates[0], signCoordinates[1], 'M', {
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      fixedWidth: 30,
      backgroundColor: this.interactionSignBackgroundDefault
    }).setPadding(2).setOrigin(0.5);
  }

  /**
   * Dejar de mostrar que se puede interactuar con el mercader
   */
  hideInteraction() {
    this.interactionSign.destroy();
  }

  /**
   * Colocar el simbolo que señaliza que se puede interactuar con el mercader en funcion de la localización del mercader
   */
  getInteractionSignCoords(merchantX: number, merchantY: number): [number, number] {
    var signX = merchantX
    var signY = merchantY - this.playerMinDistance / 4

    return [signX, signY]
  }

}

