export default class RubberBand extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "gomilla");
        this.scale = 1 / 4
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(this.width * 0.8, this.height / 2);
    }

    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);
    }
}