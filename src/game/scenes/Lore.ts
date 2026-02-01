import { Scene } from "phaser";
import { Button } from "../UI/Button";

export class Lore extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    lore: Phaser.GameObjects.Text;
    ret: Button;
    loreText: string = "Eres feo\nAl nacer el médico dijo \"si no llora es un tumor\"\nTu madre, en lugar del pecho, te dio la espalda\nY hoy, fuiste a comprar una MÁSCARA...\n... y solo te vendieron la goma\n\nVan a sufrir haberte vendido esa goma...";
    tween: Phaser.Tweens.Tween;

  constructor() {
    super("Lore");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x000000);

    this.lore = this.add.text(512, 384, "", {
      fontFamily: "Arial Black",
      fontSize: 25,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });

    this.lore.setOrigin(0.5);
    this.ret= new Button(this, "Continue", 512, 600, "buttonNormal", "buttonHover", "buttonPressed");

    this.ret.setPointerUpCallback(() => {
            this.scene.start("GameScene");
    });

    this.ret.hide();

    this.tween = this.tweens.add({
        targets: { i: 0 },
        i: this.loreText.length,
        duration: 5000,
        ease: "Linear",
        onUpdate: () => {
            const progress = this.tween.progress; // valor entre 0 y 1
            const j = Math.floor(progress * this.loreText.length);
            this.lore.text = this.loreText.substring(0, j);
        },
        onComplete:() => {
            console.log("Complete");
            this.ret.show();
        },
    });
    }
}
