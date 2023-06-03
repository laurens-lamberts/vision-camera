import { Dimensions } from "react-native";

const windowDimensions = Dimensions.get("window");

const SHADER_BLUR = `
  uniform shader image;
  vec2 imageSize = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);
  vec2 imageResolution = vec2(${windowDimensions.width}.0, ${windowDimensions.height}.0);

  const float blurRadius = 5.0;
  const float brightness = 0.8; // adjust as needed
  const float PI = 3.14159265359;

  half4 main(vec2 pos) {
    // Calculate the step size for the blur
    float stepSize = 1.0 / imageSize.x * blurRadius;

    // Calculate the weights for the blur
    float weights[21];
    float sum = 0.0;
    for (int i = 0; i < 21; i++) {
        float x = float(i - 10) * stepSize;
        weights[i] = exp(-x * x / (2.0 * blurRadius * blurRadius)) / (sqrt(2.0 * PI) * blurRadius);
        sum += weights[i];
    }
    for (int i = 0; i < 21; i++) {
        weights[i] /= sum;
    }

    // Sample the color of the image at nearby pixels and apply the blur in the horizontal direction
    vec3 color = vec3(0.0);
    for (int i = -10; i <= 10; i++) {
        vec2 offset = vec2(float(i) * stepSize, 0.0);
        color += image.eval(pos + offset * imageResolution.xy).rgb * weights[i + 10];
    }

    // Sample the color of the image at nearby pixels and apply the blur in the vertical direction
    for (int i = -10; i <= 10; i++) {
        vec2 offset = vec2(0.0, float(i) * stepSize);
        color += image.eval(pos + offset * imageResolution.xy).rgb * weights[i + 10];
    }

    // Reduce the brightness of the blurred pixels
    color *= brightness;

    // Output the blurred color
    return vec4(color, 1.0);
  }
`;

export default SHADER_BLUR;
