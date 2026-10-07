/** Build a base transform string from shared user controls. */
function base({ x, y, rotate, scale }) {
  return `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
}

export const PRESET_NAMES = ['Floating', 'Bounce', 'Spin', 'Pulse', 'Shake', 'Flip'];

/** Returns an array of { pct, transform } keyframe stops for a given preset + control state. */
export function buildFrames(preset, state) {
  const b = base(state);
  switch (preset) {
    case 'Floating':
      return [
        { pct: 0, transform: `${b} translateY(0px)` },
        { pct: 50, transform: `${b} translateY(-20px)` },
        { pct: 100, transform: `${b} translateY(0px)` },
      ];
    case 'Bounce':
      return [
        { pct: 0, transform: `${b} translateY(0px)` },
        { pct: 45, transform: `${b} translateY(-60px) scale(${(state.scale * 1.06).toFixed(2)})` },
        { pct: 100, transform: `${b} translateY(0px)` },
      ];
    case 'Spin':
      return [
        { pct: 0, transform: `${b} rotate(${state.rotate}deg)` },
        { pct: 100, transform: `${b} rotate(${state.rotate + 360}deg)` },
      ];
    case 'Pulse':
      return [
        { pct: 0, transform: b },
        { pct: 50, transform: `translate(${state.x}px, ${state.y}px) rotate(${state.rotate}deg) scale(${(state.scale * 1.2).toFixed(2)})` },
        { pct: 100, transform: b },
      ];
    case 'Shake':
      return [
        { pct: 0, transform: b },
        { pct: 25, transform: `translate(${state.x - 10}px, ${state.y}px) rotate(${state.rotate}deg) scale(${state.scale})` },
        { pct: 50, transform: `translate(${state.x + 10}px, ${state.y}px) rotate(${state.rotate}deg) scale(${state.scale})` },
        { pct: 75, transform: `translate(${state.x - 10}px, ${state.y}px) rotate(${state.rotate}deg) scale(${state.scale})` },
        { pct: 100, transform: b },
      ];
    case 'Flip':
      return [
        { pct: 0, transform: `${b} rotateY(0deg)` },
        { pct: 100, transform: `${b} rotateY(360deg)` },
      ];
    default:
      return [{ pct: 0, transform: b }, { pct: 100, transform: b }];
  }
}

export function buildKeyframesCSS(name, preset, state) {
  const frames = buildFrames(preset, state);
  const body = frames.map(f => `  ${f.pct}% { transform: ${f.transform}; }`).join('\n');
  return `@keyframes ${name} {\n${body}\n}`;
}

export function buildFullCSS(preset, state) {
  const name = 'craftAnim';
  const keyframes = buildKeyframesCSS(name, preset, state);
  const rule = `.craft-element {
  border-radius: ${state.radius}px;
  opacity: ${state.opacity};
  animation: ${name} ${state.speed}s ${state.easing} infinite;
}`;
  return `${keyframes}\n\n${rule}`;
}
