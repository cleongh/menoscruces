export class Button {
    bg: Phaser.GameObjects.Rectangle;
    label: Phaser.GameObjects.Text;

    pointerDownCallback?: () => void;
    pointerUpCallback?: () => void;
    pointerOverCallback?: () => void;
    pointerOutCallback?: () => void;

    constructor(scene: Phaser.Scene, text: string, x: number, y: number, width: number, height: number) {
        this.bg = scene.add
            .rectangle(x, y, width, height, 0x777777)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.label = scene.add
            .text(x, y, text, {
                fontSize: "22px",
                color: "#ffffff",
                fontFamily: "Arial",
            })
            .setOrigin(0.5);

        // INTERACCIONES CON EL BOTÓN
        this.bg.on("pointerdown", () => {
            this.bg.setScale(0.96);
            this.label.setScale(0.96);
            this.pointerDownCallback && this.pointerDownCallback();
        });
        this.bg.on("pointerup", () => {
            this.bg.setScale(1);
            this.label.setScale(1);

            this.bg.setFillStyle(0x333333);
            this.pointerUpCallback && this.pointerUpCallback();
        });
        this.bg.on("pointerout", () => {
            this.bg.setScale(1);
            this.label.setScale(1);
            this.pointerOutCallback && this.pointerOutCallback();
        });
        this.bg.on("pointerover", () => {
            this.bg.setScale(1.1);
            this.label.setScale(1.1);
            this.pointerOverCallback && this.pointerOverCallback();
        });
    }

    hide() {
        this.bg.setVisible(false);
        this.label.setVisible(false);
    }

    show() {
        this.bg.setVisible(true);
        this.label.setVisible(true);
    }

    setPointerDownCallback(callback: () => void) {
        this.pointerDownCallback = callback;
    }

    setPointerUpCallback(callback: () => void) {
        this.pointerUpCallback = callback;
    }

    setPointerOverCallback(callback: () => void) {
        this.pointerOverCallback = callback;
    }

    setPointerOutCallback(callback: () => void) {
        this.pointerOutCallback = callback;
    }


}