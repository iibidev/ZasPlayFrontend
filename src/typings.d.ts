declare module 'canvas-confetti' {
  export interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: ('square' | 'circle' | 'star')[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  type Confetti = (options?: Options) => Promise<null>;

  interface CreateOptions {
    resize?: boolean;
    useWorker?: boolean;
  }

  export function create(canvas?: HTMLCanvasElement | null, options?: CreateOptions): Confetti;

  const confetti: Confetti;
  export default confetti;
}
