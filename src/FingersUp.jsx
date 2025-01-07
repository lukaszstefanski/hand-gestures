import { useRef, useState, useEffect } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { setupCamera } from "./utils/camera";

const FingersUp = () => {
  const videoRef = useRef(null);
  const [fingersUp, setFingersUp] = useState(0);

  useEffect(() => {
    const runHandPoseDetection = async () => {
      const video = await setupCamera(videoRef);
      video.play();

      // Inicjalizacja modelu do detekcji dłoni
      const detector = await handPoseDetection.createDetector(
        handPoseDetection.SupportedModels.MediaPipeHands,
        {
          modelType: handPoseDetection.SupportedModels.MediaPipeHands,
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
        }
      );

      const detectHands = async () => {
        if (video.readyState === 4) {
          // Tablica hands zawiera ilość wykrytych dłoni
          const hands = await detector.estimateHands(video);

          if (hands.length > 0) {
            const landmarks = hands[0].keypoints;

            const isThumbUp = (thumbTip, thumbBase, wrist) => {
              // Sprawdzenie czy kciuk znajduje się na zewnątrz względem dłoni
              return (
                Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbBase.x - wrist.x)
              );
            };

            const isFingerUp = (fingerTip, fingerBase) => {
              // Sprawdzenie czy końcówka palca jest wyżej niż jego baza
              return fingerTip.y < fingerBase.y;
            };

            const countFingers = () => {
              const wrist = landmarks[0];
              const [thumb, index, middle, ring, pinky] = [
                { tip: landmarks[4], base: landmarks[2] }, // Kciuk
                { tip: landmarks[8], base: landmarks[6] }, // Palec wskazujący
                { tip: landmarks[12], base: landmarks[10] }, // Palec środkowy
                { tip: landmarks[16], base: landmarks[14] }, // Palec serdeczny
                { tip: landmarks[20], base: landmarks[18] }, // Mały palec
              ];

              let count = 0;

              if (isThumbUp(thumb.tip, thumb.base, wrist)) count++;
              if (isFingerUp(index.tip, index.base)) count++;
              if (isFingerUp(middle.tip, middle.base)) count++;
              if (isFingerUp(ring.tip, ring.base)) count++;
              if (isFingerUp(pinky.tip, pinky.base)) count++;

              setFingersUp(count);
            };

            console.log("Fingers up:", countFingers());
          }
        }

        requestAnimationFrame(detectHands);
      };

      detectHands();
    };

    runHandPoseDetection();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <video ref={videoRef} style={{ display: "block", width: "40%" }} />
      <p style={{ fontSize: "40px" }}>{fingersUp}</p>
    </div>
  );
};

export default FingersUp;
