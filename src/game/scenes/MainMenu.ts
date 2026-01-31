import { Scene, GameObjects } from "phaser";
import { Button } from "../UI/Button";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;
  playButton : Button;
  credicts : Button;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    this.logo = this.add.image(512, 300, "logo");
    this.playButton= new Button(this, "Play", 512, 400,  "buttonNormal", "buttonHover", "buttonPressed");

    this.playButton.setPointerUpCallback(() => {
      this.scene.start("GameScene");
    });

    this.credicts = new Button(this, "Credicts", 512, 512, "buttonNormal", "buttonHover", "buttonPressed");

    this.credicts.setPointerUpCallback(() => {
      this.scene.start("Credicts");
    });
    

    /*this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });*/
  }

  credictsButtonHoverState() {
    this.credicts.setStyle({ fill: '#ff0'});
  }

  credictsButtonRestState() {
    this.credicts.setStyle({ fill: '#ffffff' });
  }

  credictsButtonActiveState() {
    this.credicts.setStyle({ fill: '#0ff' });
  }


  playButtonHoverState() {
    this.playButton.setStyle({ fill: '#ff0'});
  }

  playButtonRestState() {
    this.playButton.setStyle({ fill: '#ffffff' });
  }

  playButtonActiveState() {
    this.playButton.setStyle({ fill: '#0ff' });
  }
}
