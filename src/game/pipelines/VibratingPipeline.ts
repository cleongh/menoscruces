import Phaser from "phaser";

import vibratingShader from './shaders/vibrating.glsl?raw';

export default class VibratingPipeline
	extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
  // the unique id of this pipeline
  public static readonly KEY = "Vibrating";

  protected _gradient : Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper;

  /**
   * @param {Phaser.Game} game - the controller of the game instance
   */
  constructor(game: Phaser.Game) {
    super({
      game: game,
      fragShader: vibratingShader,
    });
  }

  onBoot() {
    this._gradient = this.game.textures.getFrame('clouds').glTexture;
  }

  onPreRender ()
    {
        this.set1f('time', this.game.loop.time/1000); // En segundos
        this.set1i('uGradientSampler', 1);
        this.bindTexture(this._gradient, 1);
    }  

}
