import { BigCoin, BigCoinData } from "./BigCoin";

interface TierDefinition {
  name: string;
  availableCoins: BigCoinData[];
}

const SnakeCoin_Tier1: BigCoinData = {
        texture: "moneda_vida",
        name: "Snake Coin",
        passCost: 55,
        option1: {
          name: "+10 Extra Health",
          description: "Increases your maximum health by 10 points.",
          kind: "passive",
          texture: "moneda_vida",
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
          texture: "moneda_vida",
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
      };

const AresCoin_Tier1: BigCoinData = {
        texture: "moneda_ares",
        name: "Ares Coin",
        passCost: 85,
        option1: {
          name: "+1 Attack",
          description: "Increases your attack by 1 point.",
          kind: "passive",
          texture: "moneda_ares",
          modifier: (state) => {
            const newAttack = state.baseStats.attackBase + 1;
            return {
              ...state,
              baseStats: {
                ...state.baseStats,
                attackBase: newAttack,
              },
            };
          },
        },
        option2: {
          name: "-1 Attack",
          description: "Decreases your attack by 1 point.",
          kind: "passive",
          texture: "moneda_ares",
          modifier: (state) => {
            const newAttack = state.baseStats.attackBase - 1;
            return {
              ...state,
              baseStats: {
                ...state.baseStats,
                attackBase: newAttack,
              },
            };
          },
        },
      };

const SmellCoin: BigCoinData = {
        texture: "moneda_bomba",
        name: "Smell Coin",
        passCost: 100,
        option1: {
          name: "What a stench!",
          description: "Generates a smell that harms enemies.",
          kind: "active",
          texture: "moneda_bomba",
          onEffectStart(scene) {
            scene.time.addEvent({
              delay: 5000,
              callback: scene.infernallSmell_Cara,
              callbackScope: scene,
              loop: true,
              }
            )
          },
          onEffectTick(scene) {
            
          },
          onEffectEnd(scene) {
            
          },
        },
        option2: {
          name: "Good Smell",
          description: "Generates a smell that heals enemies.",
          kind: "active",
          texture: "moneda_bomba",
          onEffectStart(scene) {
            scene.time.addEvent({
              delay: 7000,
              callback: () => {
                scene.time.addEvent({
                  delay: 5000,
                  callback: scene.infernallSmell_Cruz,
                  callbackScope: scene,
                  loop: true,
                })
              },
              callbackScope: scene,
              loop: true,
              }
            )
          },
          onEffectTick(scene) {
            
          },
          onEffectEnd(scene) {
            
          },
        },
      };
export const coinDefinitions: TierDefinition[] = [
  {
    name: "Tier 1",
    availableCoins: [
      SnakeCoin_Tier1,
      AresCoin_Tier1,
      SmellCoin,
    ],
  },
];