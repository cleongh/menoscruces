import { Scene, GameObjects } from "phaser";
import { Button } from "../UI/Button";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  playButton: Button;
  credits: Button;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 300, "logo");
    this.playButton = new Button(this, "PLAY", 512, 400, "buttonNormal", "buttonHover", "buttonPressed");

    this.playButton.setPointerUpCallback(() => {
      this.scene.start("GameScene");
    });

    this.credits = new Button(this, "CREDITS", 512, 512, "buttonNormal", "buttonHover", "buttonPressed");

    this.credits.setPointerUpCallback(() => {
      this.scene.start("Credicts");
    });


    /*this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });*/
  }

  credictsButtonHoverState() {
    this.credits.setStyle({ fill: '#ff0' });
  }

  credictsButtonRestState() {
    this.credits.setStyle({ fill: '#ffffff' });
  }

  credictsButtonActiveState() {
    this.credits.setStyle({ fill: '#0ff' });
  }


  playButtonHoverState() {
    this.playButton.setStyle({ fill: '#ff0' });
  }

  playButtonRestState() {
    this.playButton.setStyle({ fill: '#ffffff' });
  }

  playButtonActiveState() {
    this.playButton.setStyle({ fill: '#0ff' });
  }
}
