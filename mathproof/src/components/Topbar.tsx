interface TopbarProps {
  title: string
  subtitle: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="bg-[#0d1320] border-b border-[#1e2d45] px-7 py-4 flex items-center justify-between">
      {/* Left - Title */}
      <div>
        <h1 className="text-lg font-extrabold text-slate-100">{title}</h1>
        <p className="font-mono text-[10px] text-[#334155] mt-0.5">{subtitle}</p>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Live Indicator */}
        <div className="flex items-center gap-2 bg-[#0a1a2e] border border-[#0c3460] rounded-md px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-sky-400">Solana Live</span>
        </div>

        {/* Connect Wallet Button */}
       <appkit-button />

        {/* New Challenge Button */}
        <button className="bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
          + New Challenge
        </button>
      </div>
    </div>
  )
}