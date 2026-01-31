export default class Landmark extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, x, y, "landmark");
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}