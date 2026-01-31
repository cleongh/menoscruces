import { BigCoin } from "../sceneObjects/BigCoin";
import AbstractEnemy from "./AbstractEnemy";

export default class Boss extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: 500,
      speed: 80,
      attack: 0.15,
      distanceAttack: 25,
      sprite: "eleph",
    });

    this.setDisplaySize(50, 50);
    this.setOrigin(0.5, 0.5);
  }

  die(): void {
    const coin = new BigCoin(this.scene, this.x, this.y, {
      texture: "big-coin",
      name: "Moneda Vital",
      passCost: 55,
      option1: {
        name: "+10 Extra Health",
        description: "Increases your maximum health by 10 points.",
        kind: "passive",
        texture: "coin",
        modifier: (state) => {
          const newMaxHealth = state.baseStats.healthBase + 10;
          return {
            ...state,
            baseStats: {
              ...state.baseStats,
              healthBase: newMaxHealth,
            },
          };
        },
      },
      option2: {
        name: "-10 Extra Health",
        description: "Decreases your maximum health by 10 points.",
        kind: "passive",
        texture: "coin",
        modifier: (state) => {
          const newMaxHealth = state.baseStats.healthBase - 10;
          return {
            ...state,
            baseStats: {
              ...state.baseStats,
              healthBase: newMaxHealth,
            },
          };
        },
      },
    });

    (this.scene as any).coins.add(coin, true);
    this.destroy();
  }
}
