interface StatCardProps {
  label: string
  value: string
  change: string
  color: 'blue' | 'green' | 'amber' | 'purple'
}

const colors = {
  blue: 'border-t-sky-500',
  green: 'border-t-emerald-500',
  amber: 'border-t-amber-500',
  purple: 'border-t-purple-500',
}

export default function StatCard({ label, value, change, color }: StatCardProps) {
  return (
    <div className={`bg-[#0d1320] border border-[#1e2d45] border-t-2 ${colors[color]} rounded-xl p-4`}>
      <p className="font-mono text-[10px] text-[#334155] tracking-widest uppercase mb-2">
        // {label}
      </p>
      <p className="text-3xl font-extrabold text-slate-100">{value}</p>
      <p className="text-emerald-400 text-xs font-semibold mt-2">{change}</p>
    </div>
  )
}