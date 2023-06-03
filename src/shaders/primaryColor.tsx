import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

const SHADER_PRIMARY_COLOR = `
  uniform shader image;
  vec2 imageSize = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);
  vec2 imageResolution = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);

  vec2 chunkSize = vec2(200.0, 200.0);
  vec3 chunkColor = vec3(1.0, 1.0, 1.0);

  half4 main(vec2 pos) {
    // Calculate the chunk position based on the texture coordinate
    vec2 chunkPos = floor(pos * (imageSize / chunkSize)) * chunkSize;

    // Sample the color of the chunk
    vec3 color = image.eval(chunkPos / imageSize).rgb;

    // Output the chunk color
    return vec4(chunkColor * color, 1.0);
  }
`;

export default SHADER_PRIMARY_COLOR;
