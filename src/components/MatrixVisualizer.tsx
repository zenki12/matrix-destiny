import { MatrixDestiny } from '@/utils/matrixDestiny';

export default function MatrixVisualizer({ matrix }: { matrix: MatrixDestiny }) {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto my-12 font-sans">
      {/* Background SVG Lines */}
      <svg className="absolute inset-0 w-full h-full text-zinc-300 dark:text-zinc-700 pointer-events-none" viewBox="0 0 100 100">
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
        <line x1="18" y1="18" x2="82" y2="82" stroke="currentColor" strokeWidth="0.5" />
        <line x1="18" y1="82" x2="82" y2="18" stroke="currentColor" strokeWidth="0.5" />
        {/* Outer Square Base */}
        <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <polygon points="18,18 82,18 82,82 18,82" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      
      {/* Points */}
      <CircleNode value={matrix.E} label="Center (Core)" cx="50%" cy="50%" primary />
      <CircleNode value={matrix.B} label="Top (Sky)" cx="50%" cy="5%" />
      <CircleNode value={matrix.C} label="Right (Year)" cx="95%" cy="50%" />
      <CircleNode value={matrix.D} label="Bottom (Earth)" cx="50%" cy="95%" />
      <CircleNode value={matrix.A} label="Left (Day)" cx="5%" cy="50%" />
      
      <CircleNode value={matrix.F} label="Top Left (Ancestors)" cx="18%" cy="18%" secondary />
      <CircleNode value={matrix.G} label="Top Right (Ancestors)" cx="82%" cy="18%" secondary />
      <CircleNode value={matrix.H} label="Bot Right (Ancestors)" cx="82%" cy="82%" secondary />
      <CircleNode value={matrix.I} label="Bot Left (Ancestors)" cx="18%" cy="82%" secondary />
    </div>
  );
}

function CircleNode({ value, label, cx, cy, primary, secondary }: { value: number, label: string, cx: string, cy: string, primary?: boolean, secondary?: boolean }) {
  let colorClass = "bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-700 dark:border-zinc-300";
  if (primary) colorClass = "bg-amber-500 text-zinc-900 border-amber-400 z-10 w-14 h-14";
  if (secondary) colorClass = "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 w-10 h-10";
  if (!primary && !secondary) colorClass += " w-12 h-12";

  return (
    <div 
      className={`absolute flex flex-col items-center justify-center rounded-full border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 cursor-help ${colorClass}`}
      style={{ left: cx, top: cy }}
      title={label}
    >
      <span className="font-bold text-lg leading-none">{value}</span>
    </div>
  );
}
