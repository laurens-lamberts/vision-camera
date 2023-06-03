import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

const SHADER_EMBROIDERY_TWO = `
  uniform shader image;
  //vec2 imageSize = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);
  vec2 imageResolution = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);

  half4 main(vec2 pos) {
    vec2 coordinates = pos.xy/imageResolution.xy;
    const float size = 42.0;
    vec2 pixelSize = vec2(size/imageResolution.x,
                          size/imageResolution.y);
    vec2 position = floor(coordinates/pixelSize)*pixelSize;
    vec4 finalColor =  image.eval(position * imageResolution.xy);
    return finalColor;
  }
`;

export default SHADER_EMBROIDERY_TWO;
