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
      currentHealth: baseStats.healthBase,
    };
    this.scene = gameScene;
  }

  public registerNewLocalCoin(coinData: Coin): void {
    // vida máxima previa al cambio
    const oldMaxHealth = this.getTransformedState().baseStats.healthBase;

    // Las monedas van: [nueva, vieja1, vieja2, vieja3, vieja4]
    if (this.gameState.currentCoins.length >= 5) {
      const oldCoin = this.gameState.currentCoins.pop();
      if (oldCoin && oldCoin.kind === "active") {
        oldCoin.onEffectEnd(this.scene);
      }
    }

    this.gameState.currentCoins = [coinData, ...this.gameState.currentCoins];

    if (coinData.kind === "active") {
      coinData.onEffectStart(this.scene);
    }

    this.scene.typedEvents.emit("big-coin-collected", coinData);

    // vida máxima después del cambio
    const newMaxHealth = this.getTransformedState().baseStats.healthBase;
    const currentHealth = this.getTransformedState().currentHealth;

    // ñapa para que actualizar la vida máxima también actualice la vida actual
    this.updatePlayerHealth(
      Math.max(0, currentHealth + (newMaxHealth - oldMaxHealth)),
    );
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

  public pickCoin(): void {
    const transformedState = this.getTransformedState();
    const minCoins = transformedState.globalRound;
    const maxCoins = transformedState.globalRound + transformedState.localRound;
    const coinsToAdd =
      Math.ceil(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
    this.gameState.localCoins += coinsToAdd;
    this.scene.typedEvents.emit(
      "local-coins-changed",
      this.gameState.localCoins,
    );
  }

  /**
   * El jugador le entrega todas sus monedas al mercader:
   * - las monedas pequeñas se añaden al contador global del mercader, las del jugador se quedan en 0
   * - las monedas grandes se convierten en bufos y debufos permanentes (monedas grandes del mercader)
   * - el jugador se queda sin monedas grandes
   * - comienza una ronda nueva (local)
   */
  public commitCoinsToMerchant(): void {
    this.gameState.merchantCoins += this.gameState.localCoins;

    this.gameState.localCoins = 0;
    this.scene.typedEvents.emit(
      "local-coins-changed",
      this.gameState.localCoins,
    );

    this.gameState.localRound = 1;
    this.scene.typedEvents.emit(
      "local-round-changed",
      this.gameState.localRound,
    );

    // Creo que la ronda global sólo depende de las waves
    /*
    this.gameState.globalRound += 1;
    this.scene.typedEvents.emit(
      "global-round-changed",
      this.gameState.globalRound,
    );
    */

    this.gameState.permanentCoins.push(...this.gameState.currentCoins);
    this.scene.typedEvents.emit("coins-commited", this.gameState.currentCoins);
    this.gameState.currentCoins = [];
    this.scene.typedEvents.emit("current-coins-reset");
  }

  public increaseRound() {
    this.gameState.localRound += 1;
    this.scene.typedEvents.emit(
      "local-round-changed",
      this.gameState.localRound,
    );
    this.gameState.globalRound += 1;
    this.scene.typedEvents.emit(
      "global-round-changed",
      this.gameState.globalRound,
    );
  }

  private updatePlayerHealth(currentHealth: number) {
    this.gameState.currentHealth = currentHealth;
    this.scene.typedEvents.emit("player-health-updated", currentHealth);

    if (currentHealth <= 0) {
      this.scene.typedEvents.emit("player-dead");
    }
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

  public damagePlayer(damage: number) {
    // valor actual transformado de la defensa
    const defense = this.getTransformedState().baseStats.defenseBase;
    damage = Math.max(damage - defense, 0);
    this.updatePlayerHealth(Math.max(0, this.gameState.currentHealth - damage));
  }

  public regenPlayer() {
    const regen = this.getTransformedState().baseStats.regenBase;
    const health = this.getTransformedState().currentHealth;
    const maxHealth = this.getTransformedState().baseStats.healthBase;
    this.updatePlayerHealth(Math.min(maxHealth, health + regen));
  }
}

export const baseStats: BaseStats = {
  attackBase: 1,
  defenseBase: 0,
  speedBase: 1,
  healthBase: 5,
  regenBase: 0,
  rangeBase: 1,

  enemyDamageBase: 1,
  enemySpeedBase: 0.5,
  enemyHealthBase: 1.0,
  enemyDistanceAttack: 0.5,
  enemyRangedAttack: 5,
};
