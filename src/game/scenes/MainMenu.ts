import { Scene, GameObjects } from "phaser";
import { Button } from "../UI/Button";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Text;
  title: GameObjects.Text;
  playButton: Button;
  credits: Button;

  constructor() {
    super("MainMenu");
  }

  create() {
    this.background = this.add.image(512, 384, "MainMenuBg");

    // this.logo = this.add.image(512, 300, "logo");
    /*this.logo = this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 3.5, //this.config.height / 2,
        "MENOS CRUCES",
        {
          fontSize: "64px",
          fontStyle: "bold",
          color: "#000000",
          fontFamily: "salpicaduraFont",
        },
      )
      .setOrigin(0.5, 0.5);*/
    this.playButton = new Button(
      this,
      "PLAY",
      650,
      450,
      "buttonNormal",
      "buttonHover",
      "buttonPressed",
    );

    this.playButton.setPointerUpCallback(() => {
      this.scene.start("Lore");
    });

    this.credits = new Button(
      this,
      "CREDITS",
      650,
      562,
      "buttonNormal",
      "buttonHover",
      "buttonPressed",
    );

    this.credits.setPointerUpCallback(() => {
      this.scene.start("Credicts");
    });

    /*this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });*/

    let state = 0;
    this.input.keyboard?.on("keydown-SPACE", () => {
      if (state === 0) {
        return;
      }
      if (state === 1) {
        this.scene.start("Lore");
      } else if (state === 2) {
        this.scene.start("Credicts");
      }
      this.playButton.deselect();
      this.credits.deselect();
      state = 0;
    });

    this.input.keyboard?.on("keydown-W", () => {
      this.playButton.select();
      this.credits.deselect();
      state = 1;
    });

    this.input.keyboard?.on("keydown-S", () => {
      this.credits.select();
      this.playButton.deselect();
      state = 2;
    });
  }

  credictsButtonHoverState() {
    this.credits.setStyle({ fill: "#ff0" });
  }

  credictsButtonRestState() {
    this.credits.setStyle({ fill: "#ffffff" });
  }

  credictsButtonActiveState() {
    this.credits.setStyle({ fill: "#0ff" });
  }

  playButtonHoverState() {
    this.playButton.setStyle({ fill: "#ff0" });
  }

  playButtonRestState() {
    this.playButton.setStyle({ fill: "#ffffff" });
  }

  playButtonActiveState() {
    this.playButton.setStyle({ fill: "#0ff" });
  }
}
