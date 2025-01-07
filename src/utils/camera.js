export const setupCamera = async (videoRef) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  videoRef.current.srcObject = stream;
  return new Promise((resolve) => {
    videoRef.current.onloadedmetadata = () => {
      resolve(videoRef.current);
    };
  });
};
