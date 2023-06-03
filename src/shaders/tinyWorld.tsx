import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

const SHADER_TINY_WORLD = `
  uniform shader image;
  vec2 imageSize = vec2(${windowDimensions.width}.0, ${
  windowDimensions.height
}.0);
  vec2 imageResolution = vec2(${windowDimensions.width}.0, ${
  windowDimensions.height
}.0);

  const float radius = 0.001;

  half4 main(vec2 pos) {
    float aspectRatio = float(${windowDimensions.width}) / float(${
  windowDimensions.height
});

    // Convert the texture coordinates to polar coordinates
    vec2 center = vec2(${windowDimensions.width / 2}, ${
  windowDimensions.height
});
    vec2 diff = pos - center;
    float angle = atan(diff.y, diff.x);
    float radiusTexCoord = length(diff) * 2.0;
    
    // Normalize the angle to the range [0, 2*pi]
    if (angle < 0.0)
        angle += 2.0 * 3.14159265359;
    
    // Calculate the new polar coordinates
    float newAngle = angle + (radiusTexCoord * radius);
    float newRadiusTexCoord = radiusTexCoord;
    
    // Convert the polar coordinates back to Cartesian coordinates
    float u = newRadiusTexCoord * cos(newAngle);
    float v = newRadiusTexCoord * sin(newAngle);
    
    // Map the distorted coordinates to the original image texture

    vec4 distortedColor = image.eval(vec2(u / aspectRatio, v / aspectRatio) * 0.5 + vec2(0.5, 0.5) * imageResolution.xy) ;
    
    return distortedColor;
  }
`;

export default SHADER_TINY_WORLD;
