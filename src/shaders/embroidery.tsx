import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

const SHADER_EMBROIDERY = `
uniform shader image;
//uniform vec2 imageSize;
//uniform vec2 imageResolution;
//vec2 imageSize = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);
//vec2 imageResolution = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);

vec2 imageSize = vec2(500.0, 970.0);
vec2 imageResolution = vec2(500.0, 970.0);

float pixelSize = 2.0;
float stitchSize = 1.0;
float borderSize = 8.0;

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

vec3 getRandomPoint(vec2 uv) {
    vec2 p = floor(uv * stitchSize);
    vec2 f = fract(uv * stitchSize);
    float n = p.x + p.y * 57.0;
    float r = mod(n * 41.0, 289.0) / 289.0;
    float rnd = random(n) * 0.1; // Add randomness to stitching pattern

    // Sample the color of the image at the current pixel
    vec2 pixelCoord = vec2(uv * imageSize);
    vec3 pixelColor = image.eval(pixelCoord * imageResolution.xy).rgb;

    // Sample the color of the image at nearby pixels
    vec2 wovenSize = vec2(0.05, 0.05); // adjust as needed
    vec2 woven = fract(uv / wovenSize) * 2.0 - 1.0;
    float wovenBorder = smoothstep(0.0, 0.01, abs(woven.x)) * smoothstep(0.0, 0.01, abs(woven.y));

    // Sample the color of the image at nearby pixels
    vec2 sampleOffset = vec2(0.05, 0.05) * (1.0 - abs(woven));
    vec3 sampleColor = vec3(0.0);
    for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
            vec2 sampleCoord = (uv + vec2(x, y) * sampleOffset) * imageSize;
            sampleColor += image.eval(sampleCoord * imageResolution.xy).rgb;
        }
    }
    sampleColor /= 25.0;

    // Adjust the stitching color based on the pixel color and whether it's on the border
    vec3 color = mix(vec3(r + rnd), sampleColor, 0.5);

    return mix(color, vec3(r + rnd), smoothstep(0.2, 0.0, f.x));
}

half4 main(vec2 pos) {
  vec2 texCoord = pos / imageSize;

  // Apply pixelation effect
  ivec2 pixelCoord = ivec2(texCoord * imageSize);
  vec2 pixelTexCoord = (vec2(pixelCoord) + 0.5) / imageSize;
  vec4 pixelColor = image.eval(pixelTexCoord * imageResolution.xy);

  vec2 scaledCoord = vec2(texCoord * imageSize / pixelSize);
  vec2 scaledTexCoord = (vec2(scaledCoord) + 0.5) * pixelSize / imageSize;

  // Calculate stitching color based on Voronoi pattern
  vec3 stitchColor = getRandomPoint(scaledCoord);

  // Apply shading and texture variation
  vec3 shading = vec3(0.2, 0.3, 0.0); // Adjust shading parameters
  float textureVariation = 0.1 + random(pos.x * pos.y) * 0.1; // Add randomness to texture variation
  vec3 stitchedColor = stitchColor + shading * (1.0 - stitchColor);
  stitchedColor += textureVariation * vec3(image.eval(scaledTexCoord * imageResolution.xy).r);

  vec4 finalColor = mix(pixelColor, vec4(stitchedColor, 1.0), step(0.5, stitchColor.r));
  return vec4(finalColor.rgb, 1.0);
}`;

export default SHADER_EMBROIDERY;
