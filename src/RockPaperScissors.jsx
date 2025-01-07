import { useRef, useState, useEffect } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { setupCamera } from "./utils/camera";

const RockPaperScissors = () => {
  const videoRef = useRef(null);
  const [sign, setSign] = useState("Unknown");

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

          // Tablica hands zawiera ilość wykrytych dłoni
          if (hands.length > 0) {
            const landmarks = hands[0].keypoints;

            const isRock = (landmarks) => {
              const [thumb, index, middle, ring, pinky] = [
                { tip: landmarks[4], base: landmarks[3] }, // Kciuk
                { tip: landmarks[8], base: landmarks[6] }, // Palec wskazujący
                { tip: landmarks[12], base: landmarks[10] }, // Palec środkowy
                { tip: landmarks[16], base: landmarks[14] }, // Palec serdeczny
                { tip: landmarks[20], base: landmarks[18] }, // Mały palec
              ];

              // Sprawdzenie czy końcówka palca jest blisko podstawy
              const isFingerBent = (fingerTip, fingerBase) => {
                const yDifference = fingerTip.y - fingerBase.y;
                return yDifference > -10; // Zgięcie: końcówka poniżej bazy
              };

              const isThumbBent = (thumbTip, thumbBase) => {
                const xDifference = Math.abs(thumbTip.x - thumbBase.x);
                return xDifference < 30; // Kciuk blisko dłoni
              };

              return (
                isThumbBent(thumb.tip, thumb.base) &&
                isFingerBent(index.tip, index.base) &&
                isFingerBent(middle.tip, middle.base) &&
                isFingerBent(ring.tip, ring.base) &&
                isFingerBent(pinky.tip, pinky.base)
              );
            };

            const isPaper = (landmarks) => {
              const [thumb, index, middle, ring, pinky] = [
                { tip: landmarks[4], base: landmarks[3] }, // Kciuk
                { tip: landmarks[8], base: landmarks[6] }, // Palec wskazujący
                { tip: landmarks[12], base: landmarks[10] }, // Palec środkowy
                { tip: landmarks[16], base: landmarks[14] }, // Palec serdeczny
                { tip: landmarks[20], base: landmarks[18] }, // Mały palec
              ];

              // Tolerancja dla osi Y (prostowanie)
              const TOLERANCE_Y = 15;

              // Sprawdzanie czy palec jest wyprostowany (końcówka wyraźnie powyżej podstawy)
              const isFingerStraight = (fingerTip, fingerBase) => {
                return fingerTip.y < fingerBase.y - TOLERANCE_Y;
              };

              // Minimalna odległość w osi X (rozłożenie)
              const MIN_SPREAD = 5;

              // Sprawdzanie czy palce są rozłożone
              const areFingersSpread = () => {
                const distances = [
                  Math.abs(index.tip.x - middle.tip.x),
                  Math.abs(middle.tip.x - ring.tip.x),
                  Math.abs(ring.tip.x - pinky.tip.x),
                ];

                return distances.every((distance) => distance > MIN_SPREAD);
              };

              return (
                isFingerStraight(thumb.tip, thumb.base) &&
                isFingerStraight(index.tip, index.base) &&
                isFingerStraight(middle.tip, middle.base) &&
                isFingerStraight(ring.tip, ring.base) &&
                isFingerStraight(pinky.tip, pinky.base) &&
                areFingersSpread()
              );
            };

            const isScissors = (landmarks) => {
              const [thumb, index, middle, ring, pinky] = [
                { tip: landmarks[4], base: landmarks[3] }, // Kciuk
                { tip: landmarks[8], base: landmarks[6] }, // Palec wskazujący
                { tip: landmarks[12], base: landmarks[10] }, // Palec środkowy
                { tip: landmarks[16], base: landmarks[14] }, // Palec serdeczny
                { tip: landmarks[20], base: landmarks[18] }, // Mały palec
              ];

              // Tolerancja dla prostowania palców
              const TOLERANCE_Y = 2;

              // Sprawdzamy, czy palec jest wyprostowany
              const isFingerStraight = (fingerTip, fingerBase) => {
                return fingerTip.y < fingerBase.y - TOLERANCE_Y;
              };

              // Sprawdzenie czy palec jest zgięty
              const isFingerBent = (fingerTip, fingerBase) => {
                return fingerTip.y > fingerBase.y + TOLERANCE_Y;
              };

              return (
                isFingerStraight(index.tip, index.base) &&
                isFingerStraight(middle.tip, middle.base) &&
                isFingerBent(thumb.tip, thumb.base) &&
                isFingerBent(ring.tip, ring.base) &&
                isFingerBent(pinky.tip, pinky.base)
              );
            };

            const chosenSign = isRock(landmarks)
              ? "Rock"
              : isPaper(landmarks)
              ? "Paper"
              : isScissors(landmarks)
              ? "Scissors"
              : "Unknown";

            setSign(chosenSign);
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
      <p style={{ fontSize: "40px" }}>{sign}</p>
    </div>
  );
};

export default RockPaperScissors;
