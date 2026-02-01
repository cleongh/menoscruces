import AbstractEnemy from "./AbstractEnemy";
import Player from "../player";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;
    public damage: number;
    private speed: number;
    private shooter: ProjectileEnemy;

    constructor(scene: Phaser.Scene, x: number, y: number, damage: number, lifeSpan: number, speed: number, shooter: ProjectileEnemy) {
        super(scene, x, y, "projectile");
        this.damage = damage;
        this.speed = speed;
        this.shooter = shooter;

        scene.time.addEvent({
            delay: lifeSpan,
            callback: () => {
                this.shooter.setCanShoot(true);
                this.destroy();
            },
            callbackScope: this,
        })

        this.setDisplaySize(20, 20);
    }

    setDirection(direction: Phaser.Math.Vector2) {
        if (direction.x < 0) {
            this.setFlipX(true);
        }
        this.body.setVelocity(direction.x * this.speed, direction.y * this.speed);
    }
}

export class ProjectileEnemy extends AbstractEnemy {
    private shootDistance: number = 500;
    private canShoot: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, {
            health: 500,
            speed: 80,
            attack: 0.15,
            distanceAttack: 25,
            sprite: "shootmachine",
        });

        this.canShoot = true;
        this.setDisplaySize(50, 50);
        //this.setDisplaySize(15, 15);
    }

    update(player: Player) {
        super.update(player);

        if (this.canShoot && Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y) <= this.shootDistance) {
            let dir = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y).normalize();
            this.shoot(dir);
        }
    }

    shoot(direction: Phaser.Math.Vector2) {
        const p = new Projectile(
            this.scene,
            this.x,
            this.y,
            this.attack,
            1000,
            200,
            this,
        );
        (this.scene as any).projectiles.add(p, true);
        p.setDirection(direction);

        this.canShoot = false;
    }

    setCanShoot(canShoot: boolean) {
        this.canShoot = canShoot;
    }
}