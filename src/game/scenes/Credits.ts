import { Scene } from "phaser";
import { Button } from "../UI/Button";

export class Credicts extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  credits: Phaser.GameObjects.Text;
  ret: Button;

  constructor() {
    super("Credicts");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.credits = this.add.text(512, 384, "Credits", {
      fontFamily: "Arial Black",
      fontSize: 64,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.credits.setOrigin(0.5);
    this.ret= new Button(this, "Main Menu", 512, 512, "buttonNormal", "buttonHover", "buttonPressed");

    this.ret.setPointerUpCallback(() => {
            this.scene.start("MainMenu");
    });

    /*this.return = this.add
      .text(512, 512, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerover', () => this.returnButtonHoverState() )
      .on('pointerout', () => this.returnButtonRestState() )
      .on('pointerdown', () => this.returnButtonActiveState() )
      .on('pointerup', () => {
        this.returnButtonHoverState();
        this.scene.start("MainMenu");
      });*/
  }

  returnButtonHoverState() {
    this.credits.setStyle({ fill: '#ff0'});
  }

  returnButtonRestState() {
    this.credits.setStyle({ fill: '#ffffff' });
  }

  returnButtonActiveState() {
    this.credits.setStyle({ fill: '#0ff' });
  }
}
