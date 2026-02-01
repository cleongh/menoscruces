import { GameScene } from "../scenes/GameScene"
import { CurrentPlayerHealth } from "../state/typedEvents"

export default class HealthBar extends Phaser.GameObjects.Container {
    width: number
    height: number

    padding: number = 4

    borderColor: number = Phaser.Display.Color.HexStringToColor('#4a4a4a').color
    backgroundColor: number = Phaser.Display.Color.HexStringToColor('#979797').color

    colorFull: number = Phaser.Display.Color.HexStringToColor('#1eff00').color
    colorHalf: number = Phaser.Display.Color.HexStringToColor('#fff200').color
    colorQuarter: number = Phaser.Display.Color.HexStringToColor('#ff4000').color

    totalHealth: number = 100
    currentHealth: number = 100

    borderRectangle: Phaser.GameObjects.Rectangle
    backgroundRectangle: Phaser.GameObjects.Rectangle
    fillingRectangle: Phaser.GameObjects.Rectangle

    // TODO añadir valor numérico!

    constructor(scene: GameScene, x: number, y: number) {
        super(scene, x, y);

        this.width = scene.cameras.main.width;
        this.height = 20;

        // Ajuste para que la UI se quede fija en la pantalla aunque se mueva la cámara
        this.setScrollFactor(0);
        this.setDepth(100); // y esto para que siempre esté encima de todo

        this.borderRectangle = new Phaser.GameObjects.Rectangle(scene, x, y, this.width, this.height, this.borderColor)
        this.borderRectangle.setOrigin(0, 0)

        this.backgroundRectangle = new Phaser.GameObjects.Rectangle(scene, x + this.padding, y + this.padding, this.width - 2 * this.padding, this.height - 2 * this.padding, this.backgroundColor)
        this.backgroundRectangle.setOrigin(0, 0)

        this.fillingRectangle = new Phaser.GameObjects.Rectangle(scene, x + this.padding, y + this.padding, this.width - 2 * this.padding, this.height - 2 * this.padding, this.backgroundColor)
        this.fillingRectangle.setOrigin(0, 0)

        scene.add.existing(this.borderRectangle);
        scene.add.existing(this.backgroundRectangle);
        scene.add.existing(this.fillingRectangle);
        scene.add.existing(this);

        this.add(this.borderRectangle)
        this.add(this.backgroundRectangle)
        this.add(this.fillingRectangle)

        this.updateHealthBar(this.totalHealth, this.currentHealth);

        scene.typedEvents.on("player-health-updated", (current: CurrentPlayerHealth) => {
            this.updateHealthBar(current.maxHealth, current.currentHealth);
    });

    }


    updateHealthBar(totalHealth: number, currentHealth: number) {
        this.totalHealth = totalHealth;
        this.currentHealth = currentHealth;
        let healthPercentage = currentHealth / totalHealth

        let totalFillingWidth = this.width - 2 * this.padding
        let currentFillingWidth = totalFillingWidth * healthPercentage

        this.fillingRectangle.displayWidth = currentFillingWidth;
        this.fillingRectangle.fillColor = this.getFillingColor(healthPercentage);
    }

    getFillingColor(healthPercentage: number): number {
        if (healthPercentage > 0.5) {
            return this.colorFull
        } else if (healthPercentage > 0.25) {
            return this.colorHalf
        } else {
            return this.colorQuarter
        }
    }

}
