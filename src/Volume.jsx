import { useRef, useEffect, useState, useCallback } from "react";
import { setupCamera } from "./utils/camera";
import { createDetector } from "./utils/detector";
import { normalizeYPosition } from "./utils/volume";

const FingersUp = () => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const controlVolume = useCallback(
    (hands) => {
      const indexFingerY = hands[0]?.keypoints[8].y;
      const videoHeight = videoRef.current.clientHeight;
      const volume = normalizeYPosition(indexFingerY, videoHeight);

      audioRef.current.volume = volume;
    },
    [videoRef, audioRef]
  );

  useEffect(() => {
    const runHandPoseDetection = async () => {
      const video = await setupCamera(videoRef);
      video.play();

      const detectHands = async () => {
        if (video.readyState === 4) {
          const detector = await createDetector();
          const hands = await detector.estimateHands(video);

          if (hands.length > 0) {
            controlVolume(hands);
          }
        }

        requestAnimationFrame(detectHands);
      };

      detectHands();
    };

    runHandPoseDetection();
  }, [controlVolume]);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="container">
      <video ref={videoRef} />
      <button className="playButton" onClick={togglePlay}>
        {isPlaying ? "Zatrzymaj" : "Odtwórz"}
      </button>
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
      />
    </div>
  );
};

export default FingersUp;
