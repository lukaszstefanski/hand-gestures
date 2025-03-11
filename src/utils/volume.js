export const normalizeYPosition = (positionY, screenHeight) => {
  const clampedToScreen = Math.max(0, Math.min(screenHeight, positionY));
  const normalized = (clampedToScreen - 0) / 450;
  const limitedNormalized = 1 - Math.max(0, Math.min(1, normalized));

  return limitedNormalized;
};
