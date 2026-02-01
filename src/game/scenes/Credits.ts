import { Scene } from "phaser";
import { Button } from "../UI/Button";

export class Credits extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  credits: Phaser.GameObjects.Text;
  ret: Button;

  constructor() {
    super("Credicts");
  }

  create() {
    this.camera = this.cameras.main;
    //this.camera.setBackgroundColor(0xff0000);

    this.background = this.add.image(512, 384, "credits");

    this.ret = new Button(this, "Main Menu", 512, 100, "buttonNormal", "buttonHover", "buttonPressed");

    this.ret.setPointerUpCallback(() => {
      this.scene.start("MainMenu");
    });


    let selected = false;
    this.input.keyboard?.on("keydown-SPACE", () => {
      if (selected) {
        this.scene.start("MainMenu");
      }
    });

    this.input.keyboard?.on("keydown-ENTER", () => {
      if (selected) {
        this.scene.start("MainMenu");
      }
    });

    this.input.keyboard?.on("keydown-W", () => {
      this.ret.select();
      selected = true;
    });

    this.input.keyboard?.on("keydown-S", () => {
      this.ret.select();
      selected = true;
    });
  }

  returnButtonHoverState() {
    this.credits.setStyle({ fill: '#ff0' });
  }

  returnButtonRestState() {
    this.credits.setStyle({ fill: '#ffffff' });
  }

  returnButtonActiveState() {
    this.credits.setStyle({ fill: '#0ff' });
  }
}
