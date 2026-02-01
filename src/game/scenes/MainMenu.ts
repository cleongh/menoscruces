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
    let state = 1;
    this.credits.setPointerUpCallback(() => {
      this.scene.start("Credicts");
    });


    /*this.input.once("pointerdown", () => {
      this.scene.start("GameScene");
    });*/

    
    this.playButton.select();
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
      state = state + 1;
      if(state == 3)
        state = 1;
      this.showButtonFeedback(state);
    });

    this.input.keyboard?.on("keydown-S", () => {
      state = state - 1;
      if(state == 0)
        state = 2;
      this.showButtonFeedback(state);
    });
  }

  showButtonFeedback(state:integer)
  {
    if(state == 1)
    {
      this.playButton.select();
      this.credits.deselect();
    }
    else if(state == 2)
    {
      this.credits.select();
      this.playButton.deselect();
    }

  }

}
