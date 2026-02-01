import { Coin } from "./GameState";

type EventMap = {
  "big-coin-collected": [coinData: Coin];
  "local-coins-changed": [newValue: number];
  "local-round-changed": [newValue: number];
  "global-round-changed": [newValue: number];
  "current-coins-reset": [];
  "coins-commited": [coins: Coin[]];
  "player-health-updated": [playerHealth: number];
  "player-dead": [];
};

export class TypedEventEmitter extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }

  // Sobreescribimos 'emit'
  override emit<K extends keyof EventMap>(
    event: K,
    ...args: EventMap[K]
  ): boolean {
    return super.emit(event, ...args);
  }

  // Sobreescribimos 'on'
  override on<K extends keyof EventMap>(
    event: K,
    fn: (...args: EventMap[K]) => void,
    context?: any,
  ): this {
    return super.on(event, fn, context);
  }

  // Sobreescribimos 'once'
  override once<K extends keyof EventMap>(
    event: K,
    fn: (...args: EventMap[K]) => void,
    context?: any,
  ): this {
    return super.once(event, fn, context);
  }

  // Sobreescribimos 'off'
  override off<K extends keyof EventMap>(
    event: K,
    fn?: (...args: EventMap[K]) => void,
    context?: any,
    once?: boolean,
  ): this {
    return super.off(event, fn, context, once);
  }
}
