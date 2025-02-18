export const isThumbUp = (thumbTip, thumbBase, wrist) => {
  // Sprawdzenie czy kciuk znajduje się na zewnątrz względem dłoni
  return Math.abs(thumbTip.x - wrist.x) > Math.abs(thumbBase.x - wrist.x);
};

export const isFingerUp = (fingerTip, fingerBase) => {
  // Sprawdzenie czy końcówka palca jest wyżej niż jego baza
  return fingerTip.y < fingerBase.y;
};

export const countFingersUp = (hands) => {
  if (hands.length < 1) {
    return 0;
  }

  const landmarks = hands[0].keypoints;
  const wrist = landmarks[0];
  const thumb = { tip: landmarks[4], base: landmarks[2] }; // Kciuk
  const index = { tip: landmarks[8], base: landmarks[6] }; // Palec wskazujący
  const middle = { tip: landmarks[12], base: landmarks[10] }; // Palec środkowy
  const ring = { tip: landmarks[16], base: landmarks[14] }; // Palec serdeczny
  const pinky = { tip: landmarks[20], base: landmarks[18] }; // Mały palec

  let count = 0;

  if (isThumbUp(thumb.tip, thumb.base, wrist)) count++;
  if (isFingerUp(index.tip, index.base)) count++;
  if (isFingerUp(middle.tip, middle.base)) count++;
  if (isFingerUp(ring.tip, ring.base)) count++;
  if (isFingerUp(pinky.tip, pinky.base)) count++;

  return count;
};
