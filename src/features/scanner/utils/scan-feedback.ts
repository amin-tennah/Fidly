export function triggerScanFeedback(): void {
  if (typeof window === "undefined") {
    return;
  }

  if ("vibrate" in navigator) {
    navigator.vibrate([80, 40, 120]);
  }

  try {
    const AudioContextClass = window.AudioContext;
    if (!AudioContextClass) {
      return;
    }
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Audio feedback is optional if blocked by browser autoplay policy
  }
}
