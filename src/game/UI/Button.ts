export class Button {
    bg: Phaser.GameObjects.Image;
    imgHover: Phaser.GameObjects.Image;
    imgPressed: Phaser.GameObjects.Image;
    label: Phaser.GameObjects.Text;

    pointerDownCallback?: () => void;
    pointerUpCallback?: () => void;
    pointerOverCallback?: () => void;
    pointerOutCallback?: () => void;

    constructor(scene: Phaser.Scene, text: string, x: number, y: number, imagen: string = "", imagenHover: string = "", imagenPressed: string = "", fontS = "34px") {
        this.bg = scene.add.image(x, y, imagen)
            .setInteractive({ useHandCursor: true })

        this.imgHover = scene.add.image(x, y, imagenHover);
        this.imgHover.visible = false;
        this.imgPressed = scene.add.image(x, y, imagenPressed);
        this.imgPressed.visible = false;
        

        this.label = scene.add
            .text(x, y, text, {
                fontSize: fontS,
                color: '#000000',
                fontFamily: "salpicaduraFont",
            })
            .setOrigin(0.5);

        // INTERACCIONES CON EL BOTÓN
        this.bg.on("pointerdown", () => {

            this.bg.setScale(0.96);
            this.imgHover.setScale(0.96);
            this.imgPressed.setScale(0.96);
            this.imgHover.visible = false;
            this.imgPressed.visible = true;

            this.label.setScale(0.96);
            this.pointerDownCallback && this.pointerDownCallback();
        });
        this.bg.on("pointerup", () => {

            this.bg.setScale(1);
            this.label.setScale(1);

            this.imgHover.setScale(1);
            this.imgPressed.setScale(1);
            this.imgHover.visible = false;
            this.imgPressed.visible = false;

            this.pointerUpCallback && this.pointerUpCallback();
        });
        this.bg.on("pointerout", () => {
   
            this.bg.setScale(1);

            this.imgHover.setScale(1);
            this.imgPressed.setScale(1);

            this.imgHover.visible = false;
            this.imgPressed.visible = false;

            this.label.setScale(1);
            this.pointerOutCallback && this.pointerOutCallback();
        });
        this.bg.on("pointerover", () => {
            this.select();
        });
    }

    hide() {
        this.bg.setVisible(false);
        this.label.setVisible(false);
    }

    isVisible(): boolean { return this.bg.visible; }

    deactivate() {
        this.bg.setAlpha(0.5);
        this.label.setAlpha(0.5);
        this.bg.disableInteractive();
    }


    setDepth(d:number)
    {
        this.bg.setDepth(d);
        this.imgHover.setDepth(d);
        this.imgPressed.setDepth(d);
        this.label.setDepth(d);
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

    select() {

        this.bg.setScale(1.1);
        this.label.setScale(1.1);
        this.imgHover.setScale(1.1);
        this.imgPressed.setScale(1.1);
        //this.bg.visible = false;
        this.imgHover.visible = true;
        this.imgPressed.visible = false;

        this.pointerOverCallback && this.pointerOverCallback();
    }

    deselect() {
        this.bg.setScale(1);
        this.label.setScale(1);

        this.imgHover.setScale(1);
        this.imgPressed.setScale(1);
        this.imgHover.visible = false;
        this.imgPressed.visible = false;
    }


}