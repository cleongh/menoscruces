export interface IBaseCoin {
  readonly kind: "passive";
  readonly texture: string;
  readonly name: string;
  readonly description: string;
  readonly modifier?: GameStateTransformer;
}

export interface IActiveCoin extends Omit<IBaseCoin, "kind"> {
  readonly kind: "active";
  readonly onEffectTick: () => void;
  readonly onEffectStart: () => void;
  readonly onEffectEnd: () => void;
}

export type Coin = IBaseCoin | IActiveCoin;

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
}

/**
 * Función que transforma el estado del juego según alguna lógica específica
 */
export type GameStateTransformer = (state: GameState) => GameState;

export interface BaseStats {
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
