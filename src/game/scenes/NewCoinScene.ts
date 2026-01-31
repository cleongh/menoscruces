import Phaser from "phaser";

/**
 * Escena para el lanzamiento de moneda cuando se consigue una moneda de tipo especial
 * de esas que la cara te da buffo pero la cruz te putea
 */
export class NewCoinScene extends Phaser.Scene {

    headTexture: string; //Textura para la cara de la moneda
    tailTexture: string;  //Textura para la cruz de la moneda
    headInfo: string; // Info para la cara de la moneda
    tailInfo: string; // Info para la cruz de la moneda

    leftCoin: Phaser.GameObjects.Sprite; // moneda que aparece en el lado izquierdo de la escena (cara)
    rightCoin: Phaser.GameObjects.Sprite; // moneda que aparece en el lado derecho de la escena (cruz)
    coinToThrow: Phaser.GameObjects.Sprite; // moneda que le lanza al pulsar el botón de roll

    callbackAtTheEnd: Function; //Función callback para llamar una vez se ha resuelto el lanzamiento de moneda.

    constructor() {
        super({ key: "NewCoinScene" });
    }

    init(config: any, callback: Function): void {
        this.headTexture = "coin_L";
        this.tailTexture = "coin_R"
        this.headInfo = "Esto es un ejemplo de CARA de moneda";
        this.tailInfo = "Esto es un ejemplo de CRUZ de moneda";

        this.callbackAtTheEnd = callback;
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
        const width = this.scale.width;
        const height = this.scale.height;

        // Moneda a cada lado de la escena, necesitaré saber los efectos y la info (por ahora, asumo que viene en init).
        const centerY = height * 0.32; //posición en eje Y de las monedas cuando se pinten
        const sideOffset = width * 0.25; // offset desde el borde para pintar las monedas
        const textOffsetY = 100;

        // LADO IZQUIERDO, EL BUENO, CUANTO MÁS-CARA, MEJOR!
        this.drawHeadCoin(centerY, sideOffset, width, textOffsetY);

        // LADO DERECHO, EL MALO, LA CRUZ
        this.drawTailCoin(centerY, sideOffset, width, textOffsetY);

        // CENTRO
        
        // Botoncico de "roll", pos eso, lanza la monedica y a ver que sale
        const btnWidth = 180;
        const btnHeight = 56;
        const btnX = width / 2;
        const btnY = height - 80;

        const button = this.add
            .rectangle(btnX, btnY, btnWidth, btnHeight, 0x777777)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({   useHandCursor: true });

        const label = this.add
            .text(btnX, btnY, "ROLL", {
                fontSize: "22px",
                color: "#ffffff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // INTERACCIONES CON EL BOTÓN
        button.on("pointerdown", () => {
            button.setScale(0.96);
            label.setScale(0.96);
            
        });
        button.on("pointerup", () => {
            button.setScale(1);
            label.setScale(1);

            this.rollCoin();
            button.disableInteractive(); // desactiva el botón una vez lanzada la moneda
            button.fillColor = 0x333333; 
        });
        button.on("pointerout", () => {
            button.setScale(1);
            label.setScale(1);
        });
        button.on("pointerover", () => {
            button.setScale(1.1);
            label.setScale(1.1);
        });

        // Moneda que será lanzada al pulsar el botón
        this.coinToThrow = this.add.sprite(btnX, btnY-100, "coin_L").setOrigin(0.5).setScale(2, 1);
        this.coinToThrow.setDepth(10); // ensure it's above the button/label

    }

    /**
     * Dibuja una moneda con su información.
     * @param spriteKey Clave de la textura de la moneda.
     * @param posX Posición X donde se dibuja la moneda.
     * @param posY Posición Y donde se dibuja la moneda.
     * @param textOffsetY Desplazamiento en Y para la información de la moneda.
     * @param textInfo Información a mostrar debajo de la moneda.
     */
    private drawCoin(spriteKey: string, posX: number, posY: number, textOffsetY: number, textInfo: string): void {
        this.leftCoin = this.add.sprite(posX, posY, spriteKey).setOrigin(0.5).setScale(1);

        this.add.text(posX, posY + textOffsetY, textInfo, {
                fontSize: "24px",
                color: "#ffffff",
                fontFamily: "Arial",
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
    private drawHeadCoin(centerY: number, sideOffset: number, width: number, textOffsetY: number): void {
        this.drawCoin(this.headTexture, sideOffset, centerY, textOffsetY, this.headInfo);
    }

    /**
     * Dibuja la moneda de la parte derecha (CRUZ) y su info.
     * @param centerY  Centro en Y donde se dibuja la moneda
     * @param sideOffset  Offset desde el borde lateral derecho para la X de la moneda
     * @param width   Ancho total de la escena
     * @param textOffsetY  Offset en Y desde la moneda para escribir la info
     */
    private drawTailCoin(centerY: number, sideOffset: number, width: number, textOffsetY: number): void {
        this.drawCoin(this.tailTexture, width - sideOffset, centerY, textOffsetY, this.tailInfo);
    }

    /**
     * Lanza una monedas
     * TODO: Modificar para verse afectado por posibles modificadores de probabilidad
     */
    private rollCoin(): void {
        let isHeads = true;
        let flipCount = Phaser.Math.Between(8, 15); // número aleatorio de "giros" completos
        let totalDuration = 6000;
        let height = 500
        console.log(flipCount)

        // Tween principal de giro en eje vertical con cambio de textura
        this.tweens.add({
            targets: this.coinToThrow,
            scaleY: 0,
            duration: totalDuration/((flipCount+2) * 2),
            ease: 'Linear',
            yoyo: true,
            repeat: flipCount, // cantidad de "giros"
            onYoyo: () => {
                // Cambia la textura cuando vuelve a crecer
                isHeads = !isHeads;
                this.coinToThrow.setTexture(isHeads ? this.headTexture : this.tailTexture);
            }
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
            y: "-="+height,
            yoyo: true,
            duration: totalDuration/2,
            ease: "Quad.easeOut",
        });
    }
}