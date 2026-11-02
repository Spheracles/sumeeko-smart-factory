/** Decide whether Android back should revisit a task step (0..4).
 * A committed result (step 5) must exit the task, not re-save the record. */
export function previousTaskStep(step: number): number | null {
  return Number.isInteger(step) && step >= 1 && step <= 4 ? step - 1 : null;
}

/** Camera bounds for the nine-cell overview, inclusive of outer machines. */
export const FACTORY_CAMERA = { worldWidth: 900, worldHeight: 720, centerX: 400, centerY: 210 } as const;
export function factoryViewBox(viewWidth: number, viewHeight: number, zoom: number, panX = 0, panY = 0) {
  const { worldWidth, worldHeight, centerX, centerY } = FACTORY_CAMERA;
  const aspect = Math.max(1, viewWidth) / Math.max(1, viewHeight);
  const k = Math.min(3, Math.max(0.8, zoom));
  const width = (aspect >= worldWidth / worldHeight ? worldHeight * aspect : worldWidth) / k;
  const height = width / aspect;
  return { x: centerX - width / 2 + panX, y: centerY - height / 2 + panY, width, height };
}
