export const ProgressBar = ({ cantMax = 0, actualProductos = 0 }) => {
  const max = Number(cantMax) || 0;
  const actual = Number(actualProductos) || 0;
  const progress = max > 0 ? Math.min(100, Math.max(0, (actual * 100) / max)) : 0;

  return (
    <div className="progressbar" aria-label={`Progreso ${Math.round(progress)}%`}>
      <div
        className="actualProgress"
        style={{ width: `${progress}%`, borderRadius: progress >= 100 ? "10px" : undefined }}
      ></div>
    </div>
  );
};
