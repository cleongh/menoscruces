/*
 * Cutre shader para hacer "vibrar" al sprite sobre el que se
 * aplica.
 *
 * Espera recibir una segunda textura de "ruido" que debería ser
 * un degradado continuo de modo que no haya "saltos" entre
 * píxeles contiguos. Se utilizan los canales r y g de cada
 * píxel como coordenadas (u,v) con el desplazamiento que se
 * aplicará a las coordenadas en cada píxel.
 *
 * Para que el desplazamiento cambie con el tiempo, se espera
 * recibir también un parámetro uniforme con el tiempo. El
 * tiempo se discretiza y se "salta" aplicando un desplazamiento
 * discreto a la posición en la que se mira en la textura.
 */
precision mediump float;

/**
 * Sampler de la textura principal del sprite.
 */
uniform sampler2D uMainSampler;

/**
 * Sampler con la textura que modeliza la deformación.
 */
uniform sampler2D uGradientSampler;

/**
 * Tiempo desde que se lanzó el juego en segundos.
 */
uniform float time;

/**
 * Escala a aplicar a las coordenadas (u,v) leídas de la textura.
 * Los canales (r,g) leídos se multiplican por el valor. Una
 * escala menor reduce la deformación que se aplica.
 */
uniform float scale;

/**
 * Velocidad del cambio. Indica cuántos cambios se hacen por segundo.
 * También es el número de "frames" (desplazamientos distintos), que
 * paso de complicarme más,  por lo que no pongas 1 ':-D
 */
uniform float speed;

//-------------------------------------

varying vec2 outTexCoord;

//-------------------------------------

/**
 * Fragment shader
 */
void main(void) 
{
	// Discretizamos el tiempo. ¿En qué "frame" estamos?
	float step = mod(floor(time * speed),speed);

	vec4 offset = texture2D(uGradientSampler, mod(outTexCoord+step/speed, 1.0));
	vec2 uv = outTexCoord + scale*offset.xy;

	vec4 texture = texture2D(uMainSampler, uv);

	gl_FragColor = texture;

} // main
