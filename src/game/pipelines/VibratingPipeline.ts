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
      //renderer: game.renderer,
      fragShader: vibratingShader,
      /*
      fragShader: `
        precision mediump float;

        uniform sampler2D uMainSampler;
        uniform vec2 uTextureSize;

        uniform sampler2D uGradientSampler;

        uniform float time;

        varying vec2 outTexCoord;

        void main(void) 
        {
          float step = mod(floor(time * 3.0),3.0);

          vec4 offset = texture2D(uGradientSampler, mod(outTexCoord+step/3.0, 1.0));
          vec2 uv = outTexCoord + 0.1*offset.xy;

          vec4 texture = texture2D(uMainSampler, uv);
          vec4 color = texture;

          vec4 texture2 = texture2D(uGradientSampler, outTexCoord);

          float c = 0.5*sin(outTexCoord.x) + 0.5;
          gl_FragColor = texture;//color;//vec4(c, c, c, 1.0);//color;
        }
      `*/
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
