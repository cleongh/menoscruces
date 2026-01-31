import { GameScene } from "./scenes/GameScene";

interface GameState {
  /**
   * Monedas locales del jugador en la partida actual que aún no han sido commiteadas al mercader
   */
  localCoins: number;
  /**
   * Monedas totales que el jugador ha entregado al mercader a lo largo de la partida
   */
  merchantCoins: number;
  /**
   * Ronda local actual del jugador (visitas al mercader)
   */
  localRound: number;
  /**
   * Ronda global actual del juego
   */
  globalRound: number;

  /**
   * Estadísticas base del jugador
   */
  baseStats: BaseStats;

  /**
   * Modificadores apilados que afectan al estado del juego
   */
  stackedModifyers: GameStateTransformer[];
}

/**
 * Función que transforma el estado del juego según alguna lógica específica
 */
type GameStateTransformer = (state: GameState) => GameState;

interface BaseStats {
  /**
   * Ataque base del personaje (daño absoluto por golpe)
   */
  attackBase: number;
  /**
   * Defensa base del personaje (descuento absoluto de daño recibido)
   */
  defenseBase: number;
  /**
   * Velocidad base del personaje (en píxeles por segundo)
   */
  speedBase: number;
  /**
   * Vida base del personaje (vida máxima)
   */
  healthBase: number;
  /**
   * Regeneración base del personaje (en puntos de vida por segundo)
   */
  regenBase: number;
  /**
   * Rango base del personaje
   */
  rangeBase: number;
}

export type DynamicParamGetter = (gameState: GameState) => number;

export class FatManager {
  private gameState: GameState;

  constructor(gameScene: GameScene, initialStats: BaseStats) {
    this.gameState = {
      baseStats: initialStats,
      localCoins: 0,
      merchantCoins: 0,
      localRound: 1,
      globalRound: 1,
      stackedModifyers: [],
    };

    gameScene.events.on("coin-collected", () => {
      this.gameState.localCoins += 1;
    });
  }

  public registerGameStateTransformer(transformer: GameStateTransformer): void {
    this.gameState.stackedModifyers.push(transformer);
  }

  public getTransformedState(): GameState {
    return this.gameState.stackedModifyers.reduce(
      (currentState, transformer) => transformer(currentState),
      this.gameState,
    );
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
