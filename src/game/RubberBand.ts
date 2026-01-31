export default class RubberBand extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    baseWidth: number;
    baseHeight: number;
    baseScale: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "gomilla");
        this.baseWidth = this.width * 0.8;
        this.baseHeight = this.height / 2;
        this.baseScale = 1 / 4;

        this.scale = this.baseScale;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.baseWidth, this.baseHeight);

        this.setOrigin(0, 0.5);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
    }

    updateRangeFactor(scaleFactor: number) {
        this.scale = this.baseScale * scaleFactor;
    }
}