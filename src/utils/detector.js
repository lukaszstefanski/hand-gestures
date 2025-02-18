import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

export const createDetector = async () =>
  handPoseDetection.createDetector(
    handPoseDetection.SupportedModels.MediaPipeHands,
    {
      runtime: "mediapipe", // "mediapipe" lub "tfjs"
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    }
  );
