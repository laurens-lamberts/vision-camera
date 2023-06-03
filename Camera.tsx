import { Skia } from "@shopify/react-native-skia";
import { useEffect, useState } from "react";
import { View, Dimensions } from "react-native";
import {
  Camera,
  useFrameProcessor,
  useCameraDevices,
} from "react-native-vision-camera";
import SHADER_EMBROIDERY from "./src/shaders/embroidery";
import SHADER_BLUR from "./src/shaders/blur";
import SHADER_PRIMARY_COLOR from "./src/shaders/primaryColor";
import SHADER_TINY_WORLD from "./src/shaders/tinyWorld";
import SHADER_PIXELATE from "./src/shaders/pixelate";
import SHADER_EMBROIDERY_TWO from "./src/shaders/embroidery-2";

const shaders = [
  SHADER_EMBROIDERY,
  SHADER_EMBROIDERY_TWO,
  SHADER_BLUR,
  SHADER_PRIMARY_COLOR,
  SHADER_TINY_WORLD,
  SHADER_PIXELATE,
];

const runtimeEffect = Skia.RuntimeEffect.Make(SHADER_EMBROIDERY_TWO);
const shaderBuilder = Skia.RuntimeShaderBuilder(runtimeEffect!);
const imageFilter = Skia.ImageFilter.MakeRuntimeShader(
  shaderBuilder,
  null,
  null
);

const paint = Skia.Paint();
paint.setImageFilter(imageFilter);

const CameraWrapper = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      //console.log(`Frame: ${frame.orientation}`);
      frame.render(paint);
    },
    [paint]
  );

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const permissionIsGranted = cameraPermission === "authorized";
      setPermissionGranted(permissionIsGranted);
      if (!permissionIsGranted) {
        const { status } = await Camera.requestCameraPermission();
        setPermissionGranted(status === "authorized");
      }
    };
    getPermissions();
  }, []);

  const devices = useCameraDevices();
  const device = devices.back;

  if (!device || !permissionGranted)
    return <View style={{ flex: 1, backgroundColor: "salmon" }} />;

  return (
    <Camera
      style={{
        flex: 1,
      }}
      frameProcessor={frameProcessor}
      previewType="skia"
      device={device}
      isActive={true}
    />
  );
};

export default CameraWrapper;
