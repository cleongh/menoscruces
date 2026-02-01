import Phaser from "phaser";
import { BigCoinData } from "../sceneObjects/BigCoin";
import { Button } from "../UI/Button";
import { colors } from "../UI/colors";

export interface NewCoinSceneConfig {
    // número de monedas disponible actualmente (no commiteadas)
    localCoins: number;
    // Aquí se pueden añadir configuraciones específicas para la escena de nueva moneda
    coinData: BigCoinData;
    /**
     * Callback a ser llamado cuando se resuelva el lanzamiento de moneda, con los datos
     * del resultado del lanzamiento.
     * @param pass Si se ha decidido skippear el lanzamiento
     * @param isHead Si la moneda ha caído en cara
     */
    onCoinFlippedResult: (pass: boolean, isHead: boolean) => void;
}

const coinsName = "CHIBICOINS";

/**
 * Escena para el lanzamiento de moneda cuando se consigue una moneda de tipo especial
 * de esas que la cara te da buffo pero la cruz te putea
 */
export class NewCoinScene extends Phaser.Scene {
    headTexture: string; //Textura para la cara de la moneda
    tailTexture: string; //Textura para la cruz de la moneda
    headInfo: string; // Info para la cara de la moneda
    tailInfo: string; // Info para la cruz de la moneda

    bonusCoin: number; // cantidad de bonificador, monedas normales
    passCost: number;

    leftCoin: Phaser.GameObjects.Sprite; // moneda que aparece en el lado izquierdo de la escena (cara)
    rightCoin: Phaser.GameObjects.Sprite; // moneda que aparece en el lado derecho de la escena (cruz)
    coinToThrow: Phaser.GameObjects.Sprite; // moneda que le lanza al pulsar el botón de roll

    bonusCoinText: Phaser.GameObjects.Text; // Texto que muestra la cantidad de monedas normales que tiene el jugador

    elementsToHideOnRoll: Button[]; // Elementos que se ocultan al lanzar la moneda

    rollButton: Button; // Botón para lanzar la moneda
    skipButton: Button; // Botón para saltarse el lanzamiento de moneda
    continueButton: Button; // Botón para continuar con el juego tras el lanzamiento de moneda

    callbackAtTheEnd: (pass: boolean, isHead: boolean) => void; //Función callback para llamar una vez se ha resuelto el lanzamiento de moneda.

    coinResult: boolean; //Resultado de haber lanzado la moneda
    skipResult: boolean; //Indica si se ha skipeado el lanzamiento de moneda

    state: number;

    coinSound: Phaser.Sound.BaseSound;

    constructor() {
        super({ key: "NewCoinScene" });
    }

    init(config: NewCoinSceneConfig): void {
        this.headTexture = config.coinData.option1.texture;
        this.tailTexture = config.coinData.option2.texture;
        this.headInfo =
            config.coinData.option1.description ||
            "Esto es un ejemplo de CARA de moneda";
        this.tailInfo =
            config.coinData.option2.description ||
            "Esto es un ejemplo de CRUZ de moneda";

        this.bonusCoin = config.localCoins;

        this.passCost = config.coinData.passCost;

        console.log(config.onCoinFlippedResult);
        this.callbackAtTheEnd = config.onCoinFlippedResult;
    }

    preload(): void {
        //dibudjo de moneda provisional que ya se cambiará por un Sprite
        const c1 = this.add.graphics();
        c1.fillStyle(0x32ff00, 1); // color
        c1.lineStyle(4, 0xb8860b); // borde
        c1.fillCircle(32, 32, 28);
        c1.strokeCircle(32, 32, 28);
        c1.generateTexture("coin_L", 64, 64);
        c1.destroy();

        const c2 = this.add.graphics();
        c2.fillStyle(0xad0232, 1); // color
        c2.lineStyle(4, 0xb8860b); // borde
        c2.fillCircle(32, 32, 28);
        c2.strokeCircle(32, 32, 28);
        c2.generateTexture("coin_R", 64, 64);
        c2.destroy();
    }

    create(): void {
        this.coinSound = this.sound.add("coinToss", { volume: 1 });
        /****
         * INPUT VARIOS
         *
         */
        this.state = 0;
        this.input.keyboard?.on("keydown-SPACE", () => {
            if (this.state === 0) {
                return;
            }
            if (this.state === 1) {
                this.skipCoin();
            } else if (this.state === 2) {
                this.rollCoin();
            } else if (this.state == 3) {
                this.finishRollScene(this.skipResult, this.coinResult);
            }
            this.skipButton.deselect();
            this.rollButton.deselect();
            this.continueButton.deselect();
            this.elementsToHideOnRoll.forEach((element) => {
                element.hide();
            });
            this.state = 0;
        });

        this.input.keyboard?.on("keydown-W", () => {
            if (this.skipButton.isVisible() && this.bonusCoin >= this.passCost) {
                this.state = 1;
                this.skipButton.select();
                this.rollButton.deselect();
            } else if (this.rollButton.isVisible()) {
                this.state = 2;
                this.rollButton.select();
                this.skipButton.deselect();
            } else {
                this.state = 3;
                this.continueButton.select();
            }
        });

        this.input.keyboard?.on("keydown-S", () => {
            if (this.rollButton.isVisible()) {
                this.state = 2;
                this.rollButton.select();
                this.skipButton.deselect();
            } else {
                this.state = 3;
                this.continueButton.select();
            }
        });
        /**
         *
         *
         */
        const width = this.scale.width;
        const height = this.scale.height;

        const bgRect = this.add
            .rectangle(
                width / 2,
                height / 2,
                width * 0.9,
                height * 0.9,
                0x000000,
                0.8,
            )
            .setOrigin(0.5); // fondo semitransparente
        bgRect.setStrokeStyle(4, 0xffffff);

        // Moneda a cada lado de la escena, necesitaré saber los efectos y la info (por ahora, asumo que viene en init).
        const centerY = height * 0.32; //posición en eje Y de las monedas cuando se pinten
        const sideOffset = width * 0.25; // offset desde el borde para pintar las monedas
        const textOffsetY = 100;

        // LADO IZQUIERDO, EL BUENO, CUANTO MÁS-CARA, MEJOR!
        this.drawHeadCoin(centerY, sideOffset, width, textOffsetY);

        // LADO DERECHO, EL MALO, LA CRUZ
        this.drawTailCoin(centerY, sideOffset, width, textOffsetY);

        // CENTRO
        const btnWidth = 180;
        const btnHeight = 56;

        this.elementsToHideOnRoll = [];
        // Botoncico de "roll", pos eso, lanza la monedica y a ver que sale
        this.rollButton = this.drawButton(
            "ROLL",
            width / 2,
            height - 240,
            btnWidth,
            btnHeight,
            this.rollCoin,
        );
        this.elementsToHideOnRoll.push(this.rollButton);

        // Botoncico de "skip", descuenta monedas
        this.skipButton = this.drawButton(
            "SKIP",
            width / 2,
            height - 360,
            btnWidth,
            btnHeight,
            this.skipCoin,
        );
        if (this.bonusCoin < this.passCost) this.skipButton.deactivate();
        this.elementsToHideOnRoll.push(this.skipButton);

        this.continueButton = this.drawButton(
            "CONTINUE",
            width / 2,
            height - 240,
            btnWidth,
            btnHeight,
            () => {
                this.finishRollScene(this.skipResult, this.coinResult);
            },
        );
        this.continueButton.hide();

        // Texto de bonus de monedas normales
        this.drawBonusCoinInfo();

        // Moneda que será lanzada al pulsar el botón
        this.coinToThrow = this.add
            .sprite(width / 2, height - 100, this.headTexture)
            .setOrigin(0.5)
            .setScale(0.4, 0.2)
            .setTint(colors["head"]);
        this.coinToThrow.setDepth(10); // ensure it's above the button/label
    }

    /**
     * Escribe el texto que representa la bonificación, las monedas normales que tiene el
     * jugador en el momento
     *
     * También escrib el coste de pasar el lanzamiento
     **/
    private drawBonusCoinInfo(): void {
        this.bonusCoinText = this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.1,
                `${coinsName}: ${this.bonusCoin}`,
                {
                    fontSize: "36px",
                    color: "#ffff00",
                    fontFamily: "salpicaduraFont",
                },
            )
            .setOrigin(0.5, 0);

        this.add
            .text(
                this.scale.width / 2,
                this.scale.height * 0.2,
                `>> skip cost: ${this.passCost} <<`,
                {
                    fontSize: "30px",
                    color: "#ffaaaa",
                    fontFamily: "salpicaduraFont",
                },
            )
            .setOrigin(0.5, 0);
    }

    /**
     * Pinta un botón con el texto dado que llama a la función callbackFun al ser pulsado
     * @param text
     * @param x
     * @param y
     * @param width
     * @param height
     * @param callbackFun
     */
    private drawButton(
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        callbackFun: Function,
    ): Button {
        let button = new Button(
            this,
            text,
            x,
            y,
            "buttonNormal",
            "buttonHover",
            "buttonPressed",
        );

        button.setPointerUpCallback(() => {
            callbackFun.bind(this)();

            this.elementsToHideOnRoll.forEach((element) => {
                element.hide();
            });
        });

        return button;
    }

    /**
     * Dibuja una moneda con su información.
     * @param spriteKey Clave de la textura de la moneda.
     * @param posX Posición X donde se dibuja la moneda.
     * @param posY Posición Y donde se dibuja la moneda.
     * @param textOffsetY Desplazamiento en Y para la información de la moneda.
     * @param textInfo Información a mostrar debajo de la moneda.
     */
    private drawCoin(
        spriteKey: string,
        posX: number,
        posY: number,
        textOffsetY: number,
        textInfo: string,
        type: "head" | "tail",
    ): void {
        this.add
            .sprite(posX, posY, spriteKey)
            .setOrigin(0.5)
            .setScale(0.275)
            .setTint(colors[type]);

        this.add
            .text(posX, posY + textOffsetY, textInfo, {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "salpicaduraFont",
                align: "center",
                wordWrap: { width: 220 },
            })
            .setOrigin(0.5, 0);
    }

    /**
     * Dibuja la moneda de la parte izquierda (CARA) y su info.
     * @param centerY  Centro en Y donde se dibuja la moneda
     * @param sideOffset  Offset desde el borde lateral izquierdo para la X de la moneda
     * @param width   Ancho total de la escena
     * @param textOffsetY  Offset en Y desde la moneda para escribir la info
     */
    private drawHeadCoin(
        centerY: number,
        sideOffset: number,
        width: number,
        textOffsetY: number,
    ): void {
        this.drawCoin(
            this.headTexture,
            sideOffset,
            centerY,
            textOffsetY,
            this.headInfo,
            "head",
        );
    }

    /**
     * Dibuja la moneda de la parte derecha (CRUZ) y su info.
     * @param centerY  Centro en Y donde se dibuja la moneda
     * @param sideOffset  Offset desde el borde lateral derecho para la X de la moneda
     * @param width   Ancho total de la escena
     * @param textOffsetY  Offset en Y desde la moneda para escribir la info
     */
    private drawTailCoin(
        centerY: number,
        sideOffset: number,
        width: number,
        textOffsetY: number,
    ): void {
        this.drawCoin(
            this.tailTexture,
            width - sideOffset,
            centerY,
            textOffsetY,
            this.tailInfo,
            "tail",
        );
    }

    /**
     * Omite el lanzamiento de moneda, descuenta las monedas normales y llama al callback
     */
    private skipCoin(): void {
        this.bonusCoin -= this.passCost;
        this.bonusCoinText.setText(`${coinsName}: ${this.bonusCoin}`);

        this.skipResult = true;
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.continueButton.show();
            },
        });
    }

    /**
     * Lanza una monedas
     * TODO: Modificar para verse afectado por posibles modificadores de probabilidad
     */
    private rollCoin(): void {
        let isHeads = true;
        let flipCount = Phaser.Math.Between(8, 19); // número aleatorio de "giros" completos
        let totalDuration = 2000;
        let height = Phaser.Math.Between(200, 500);
        console.log(flipCount);

        this.coinSound.play();
        // Tween principal de giro en eje vertical con cambio de textura
        this.tweens.add({
            targets: this.coinToThrow,
            scaleY: 0,
            duration: totalDuration / ((flipCount + 2) * 2),
            ease: "Linear",
            yoyo: true,
            repeat: flipCount, // cantidad de "giros"
            onYoyo: () => {
                // Cambia la textura cuando vuelve a crecer
                isHeads = !isHeads;
                const kind = isHeads ? "head" : "tail";
                this.coinToThrow.setTexture(
                    isHeads ? this.headTexture : this.tailTexture,
                );
                this.coinToThrow.setTint(colors[kind]);
            },
        });

        // Tween de rotación
        this.tweens.add({
            targets: this.coinToThrow,
            angle: "+=1440",
            duration: totalDuration,
            ease: "Cubic.easeOut",
        });

        // Tween de altura
        this.tweens.add({
            targets: this.coinToThrow,
            y: "-=" + height,
            yoyo: true,
            duration: totalDuration / 2,
            ease: "Quad.easeOut",
            onComplete: () => {
                // Al completar el lanzamiento, llamar al callback con el resultado
                //this.finishRollScene(true, isHeads);
                this.coinResult = isHeads;
                this.skipResult = false;
                this.continueButton.show();
            },
        });
    }

    /**
     * Finaliza la escena de lanzamiento de moneda.
     * TODO Completar con lo que haya que hacer.
     * @param pass
     * @param isHead
     */
    private finishRollScene(pass: boolean, isHead: boolean): void {
        //if (this.callbackAtTheEnd) {
        //this.time.addEvent({
        //    delay: 1000,
        this.callbackAtTheEnd(pass, isHead); // true indica que se ha lanzado la moneda
        //});
        //}
    }
}
