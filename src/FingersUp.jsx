import { useRef, useState, useEffect } from "react";
import { setupCamera } from "./utils/camera";
import { createDetector } from "./utils/detector";
import { countFingersUp } from "./utils/fingers";

const FingersUp = () => {
  const videoRef = useRef(null);
  const [fingersUp, setFingersUp] = useState(0);

  useEffect(() => {
    const runHandPoseDetection = async () => {
      const video = await setupCamera(videoRef);
      video.play();

      const detectHands = async () => {
        if (video.readyState === 4) {
          const detector = await createDetector();
          const hands = await detector.estimateHands(video);
          const count = countFingersUp(hands);

          setFingersUp(count);
        }

        requestAnimationFrame(detectHands);
      };

      detectHands();
    };

    runHandPoseDetection();
  }, []);

  return (
    <div className="container">
      <video ref={videoRef} />
      <p>{fingersUp}</p>
    </div>
  );
};

export default FingersUp;
