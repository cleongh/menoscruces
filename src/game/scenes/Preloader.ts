import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    //this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");

    //Monedas varias
    this.load.image("moneda_ares", "coins/moneda_ares.png");
    this.load.image("moneda_bomba", "coins/moneda_bomba.png");
    this.load.image("moneda_vida", "coins/moneda_vida.png");
    this.load.image("moneda_vida_mala", "coins/moneda_vida_mala.png");
    this.load.image("moneda_sonic", "coins/moneda_sonic.png");
    this.load.image("moneda_caracol", "coins/moneda_caracol.png");
    this.load.image("moneda_pulpo", "coins/moneda_pulpo.png");

    this.load.image("boss", "placeholder/boss.jpg");
    this.load.image("big-coin", "placeholder/big-coin.png");
    this.load.image("projectileEnemy", "placeholder/projectileEnemy.jpg");
    this.load.image("projectile", "placeholder/projectile.jpg");
    this.load.image("landmark", "placeholder/landmark.jpg");
    this.load.image("buttonNormal", "ui/ButtonNormal.png");
    this.load.image("buttonHover", "ui/ButtonHover.png");
    this.load.image("buttonPressed", "ui/ButtonPressed.png");

    this.load.image("coin", "coins/monedilla.png")

    this.load.spritesheet("player", "player.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    /* ENEMIES */
    this.load.spritesheet("eleph", "enemies/eleph.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet("shootmachine", "enemies/shootmachine.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet("grr", "enemies/grr.png", {
      frameWidth: 512,
      frameHeight: 512,
    });

    this.load.spritesheet("fatbat", "enemies/fatbat.png", {
      frameWidth: 512,
      frameHeight: 512,
    });

    this.load.spritesheet("cloud", "enemies/cloud.png", {
      frameWidth: 512,
      frameHeight: 512,
    });

    /** WEAPONS */
    this.load.spritesheet("gomilla", "weapons/gomilla.png", {
      frameWidth: 512,
      frameHeight: 256,
    });

    this.load.spritesheet("hodor", "weapons/hodor.png", {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet("flares", "particles/flares.png", {
      frameWidth: 128,
      frameHeight: 128
    });

    /** PROPS (landmarks) */
    this.load.spritesheet("bush", "props/bush.png", {
      frameWidth: 256, 
      frameHeight: 256
    })

    this.load.spritesheet("grass", "props/grass.png", {
      frameWidth: 256, 
      frameHeight: 256
    })

    this.load.audio("music", "music/MainSongLoop.mp3");

    this.load.audio("coinToss", ["sfx/CoinTossSFX.ogg", "sfx/CoinTossSFX.mp3"]);
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    // Animaciones
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 4 }),
      frameRate: 12, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
    });

    this.anims.create({
      key: "gomilla",
      frames: this.anims.generateFrameNumbers("gomilla", { start: 0, end: 1 }),
      frameRate: 10,
      repeat: 5,
    });

    this.anims.create({
      key: "hodor",
      frames: this.anims.generateFrameNumbers("hodor", { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "eleph",
      frames: this.anims.generateFrameNumbers("eleph", { start: 0, end: 3 }),
      frameRate: 12, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });

    this.anims.create({
      key: "shootmachine",
      frames: this.anims.generateFrameNumbers("shootmachine", {
        start: 0,
        end: 3,
      }),
      frameRate: 12, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });

    this.anims.create({
      key: "grr",
      frames: this.anims.generateFrameNumbers("grr", { start: 0, end: 1 }),
      frameRate: 6, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });

    this.anims.create({
      key: "fatbat",
      frames: this.anims.generateFrameNumbers("fatbat", { start: 0, end: 1 }),
      frameRate: 6, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });

    this.anims.create({
      key: "cloud",
      frames: this.anims.generateFrameNumbers("cloud", { start: 0, end: 1 }),
      frameRate: 6, // Velocidad de la animación
      repeat: -1, // Animación en bucle
    });
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
