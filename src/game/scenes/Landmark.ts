export default class Landmark extends Phaser.Physics.Arcade.Sprite {

    propsArray = ["bush", "grass", "grass"]
    tintsArray = ["#ffb1b1", "#a0abff", "#fbffc3"]
        .map((colorString) => { return Phaser.Display.Color.HexStringToColor(colorString).color })

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "bush");

        let randomLandmark = this.generateRandomLandmark();

        this.setTexture(randomLandmark[0], randomLandmark[1])
        this.setScale(0.20);
        this.setDepth(-10); // poner debajo del jugador y bichitos
        this.applyRandomTint();
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

    }

    generateRandomLandmark(): [string, number] {
        const index = Math.floor(Math.random() * this.propsArray.length);
        let name = this.propsArray[index];

        let frame = Math.floor(Math.random() * 4);

        return [name, frame]
    }

    applyRandomTint() {
        const index = Math.floor(Math.random() * this.tintsArray.length);
        let color = this.tintsArray[index]
        this.setTint(color)
    }
}