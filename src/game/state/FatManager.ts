import { GameScene } from "../scenes/GameScene";
import { BaseStats, Coin, GameState } from "./GameState";

export class FatManager {
  private gameState: GameState;
  private scene: GameScene;

  constructor(gameScene: GameScene, initialStats: BaseStats) {
    this.gameState = {
      baseStats: initialStats,
      localCoins: 0,
      merchantCoins: 0,
      localRound: 1,
      globalRound: 1,
      permanentCoins: [],
      currentCoins: [],
    };

    this.scene = gameScene;
  }

  public registerPermanentCoin(coin: Coin): void {
    this.gameState.permanentCoins.push(coin);
  }

  public registerNewLocalCoin(coinData: Coin): void {
    // Las monedas van: [nueva, vieja1, vieja2, vieja3, vieja4]
    this.gameState.currentCoins.pop();
    this.gameState.currentCoins = [coinData, ...this.gameState.currentCoins];
  }

  public getTransformedState(): GameState {
    const stateAfterPermanentChanges = this.gameState.permanentCoins.reduce(
      (currentState, coin) =>
        coin.modifier ? coin.modifier(currentState) : currentState,
      this.gameState,
    );
    return stateAfterPermanentChanges.currentCoins.reduce(
      (currentState, coin) =>
        coin.modifier ? coin.modifier(currentState) : currentState,
      stateAfterPermanentChanges,
    );
  }

  public adjustLocalCoins(amount: number): void {
    this.gameState.localCoins += amount;
  }

  public pickCoin(): void {
    this.gameState.localCoins += 1;
    this.scene.events.emit("coin-collected");
  }
}

export const baseStats: BaseStats = {
  attackBase: 10,
  defenseBase: 5,
  speedBase: 100,
  healthBase: 100,
  regenBase: 1,
  rangeBase: 50,
};
