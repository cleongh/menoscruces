import { GameScene } from "../scenes/GameScene";

export interface IBaseCoin {
  readonly tier: number;
  readonly kind: "passive";
  readonly texture: string;
  readonly name: string;
  readonly description: string;
  readonly modifier?: GameStateTransformer;
  readonly face: "head" | "tail";
}

export interface IActiveCoin extends Omit<IBaseCoin, "kind"> {
  readonly kind: "active";
  readonly onEffectTick: (scene: GameScene) => void;
  readonly onEffectStart: (scene: GameScene) => void;
  readonly onEffectEnd: (scene: GameScene) => void;
}

export type Coin = IBaseCoin | IActiveCoin;

/**
 * Toma una cara de moneda (IBaseCoin) y devuelve una copia donde
 * el cálculo de poder ignorará las localCoins futuras, usando las actuales.
 * TODO: no funciona para cosas activas.
 */
export const fixCoin = (coin: IBaseCoin, state: GameState): IBaseCoin => {
  const capturedLocalCoins = state.localCoins;

  return {
    ...coin,
    // Si es pasiva, envolvemos el modifier para inyectar las monedas capturadas
    modifier: coin.modifier
      ? (currentState: GameState) => {
          const fixedState = {
            ...currentState,
            localCoins: capturedLocalCoins,
          };
          return coin.modifier!(fixedState);
        }
      : undefined,
  };
};

export interface GameState {
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
   * Modificadores permanentes aplicados al estado del juego
   */
  permanentCoins: Coin[];

  /**
   * Monedas actuales que posee el jugador
   */
  currentCoins: Coin[];

  /**
   * Vida actual del personaje
   */
  currentHealth: number;
}

/**
 * Función que transforma el estado del juego según alguna lógica específica
 */
export type GameStateTransformer = (state: GameState) => GameState;

export interface PlayerStats {
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
   * Rango base del personaje. Valor entre 0 y X, 1 es el balor base. 0.5 indica que el rango es la mitad. Y 2 que es el doble de rango
   */
  rangeBase: number;
}

export type BaseStats = PlayerStats & {
  /**
   * Daño base que infligen los enemigos
   */
  enemyDamageBase: number;
  /**
   * Velocidad base de los enemigos (en píxeles por segundo)
   */
  enemySpeedBase: number;

  enemyHealthBase: number;

  enemyDistanceAttack: number;

  enemyRangedAttack: number;
};
