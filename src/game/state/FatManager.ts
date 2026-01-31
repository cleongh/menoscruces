import { enemyWaves } from "../enemies/enemyWave";
import { BigCoinData } from "../sceneObjects/BigCoin";
import { coinDefinitions } from "../sceneObjects/coinDefinitions";
import { GameScene } from "../scenes/GameScene";
import { BaseStats, Coin, GameState } from "./GameState";

export class FatManager {
  private gameState: GameState;
  private scene: GameScene;

  constructor(gameScene: GameScene, initialStats: BaseStats) {
    this.gameState = {
      baseStats: initialStats,
      /**
       * monedas pequeñas actuales del jugador
       */
      localCoins: 0,
      /**
       * monedas pequeñas que han sido entregadas al mercader
       */
      merchantCoins: 0,
      /**
       * ronda local
       */
      localRound: 1,
      /**
       * ronda global (siempre crece)
       */
      globalRound: 1,
      /**
       * monedas grandes ya entregadas al mercader
       */
      permanentCoins: [],
      /**
       * monedas grandes recogidas en la ronda actual, no entregadas (temporales)
       */
      currentCoins: [],
    };
    this.scene = gameScene;
  }

  public registerNewLocalCoin(coinData: Coin): void {
    // Las monedas van: [nueva, vieja1, vieja2, vieja3, vieja4]
    this.gameState.currentCoins.pop();
    this.gameState.currentCoins = [coinData, ...this.gameState.currentCoins];

    if (coinData.kind === "active") {
      coinData.onEffectStart(this.scene);
    }

    this.scene.events.emit("big-coin-collected", coinData);
  }

  public tickActiveCoins(): void {
    this.gameState.currentCoins.forEach((coin) => {
      if (coin.kind === "active") {
        coin.onEffectTick(this.scene);
      }
    });
    this.gameState.permanentCoins.forEach((coin) => {
      if (coin.kind === "active") {
        coin.onEffectTick(this.scene);
      }
    });
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
    const transformedState = this.getTransformedState();
    const minCoins = transformedState.globalRound;
    const maxCoins = transformedState.globalRound + transformedState.localRound;
    const coinsToAdd =
      Math.ceil(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
    this.gameState.localCoins += coinsToAdd;
    this.scene.events.emit("local-coins-changed", this.gameState.localCoins);
  }

  public commitCoinsToMerchant(): void {
    this.gameState.merchantCoins += this.gameState.localCoins;

    this.gameState.localCoins = 0;
    this.scene.events.emit("local-coins-changed", this.gameState.localCoins);

    this.gameState.localRound = 1;
    this.scene.events.emit("local-round-changed", this.gameState.localRound);

    this.gameState.globalRound += 1;
    this.scene.events.emit("global-round-changed", this.gameState.globalRound);

    this.gameState.currentCoins.forEach((coin) => {
      this.gameState.permanentCoins.push(coin);
      this.scene.events.emit("coin-commited", coin);
    });
    this.gameState.currentCoins = [];
    this.scene.events.emit("current-coins-reset");
  }

  public increaseRound() {
    this.gameState.localRound += 1;
    this.scene.events.emit("local-round-changed", this.gameState.localRound);
    this.gameState.globalRound += 1;
    this.scene.events.emit("global-round-changed", this.gameState.globalRound);
  }

  /**
   * Consigue una definición aleatoria de moneda en base a la ronda actual
   */
  public getRandomCoinFromCurrent(): BigCoinData {
    // cada Tier de monedas tiene asociado un conjunto de oleadas de enemigos (de momento, uniforme)
    const wavesPerTier = Math.ceil(enemyWaves.length / coinDefinitions.length);
    const currentTier = Math.min(
      Math.floor((this.gameState.globalRound - 1) / wavesPerTier),
      coinDefinitions.length - 1,
    );
    const currentTierCoins = coinDefinitions[currentTier];
    return currentTierCoins.availableCoins[
      Math.floor(Math.random() * currentTierCoins.availableCoins.length)
    ];
  }
}

export const baseStats: BaseStats = {
  attackBase: 250,
  defenseBase: 5,
  speedBase: 100,
  healthBase: 100,
  regenBase: 1,
  rangeBase: 50,
  enemyDamageBase: 20,
  enemySpeedBase: 80,
};
