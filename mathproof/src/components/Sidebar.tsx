import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', path: '/teacher', section: 'Overview' },
    { label: 'Analytics', path: '/teacher', section: null },
    { label: 'Challenges', path: '/teacher', section: 'Manage' },
    { label: 'Students', path: '/student', section: null },
    { label: 'Submissions', path: '/student', section: null },
    { label: 'NFT Badges', path: '/teacher', section: 'Rewards' },
    { label: 'Token Pool', path: '/teacher', section: null },
    { label: 'Settings', path: '/teacher', section: null },
  ]

  return (
    <div className="w-[220px] min-w-[220px] bg-[#0d1320] border-r border-[#1e2d45] flex flex-col py-6 min-h-screen">

      <div className="px-5 pb-6 border-b border-[#1e2d45] mb-3">
        <p className="text-sky-400 font-extrabold text-sm leading-tight tracking-wide">
          MathProof<br />Quest
        </p>
        <p className="font-mono text-[10px] text-[#334155] mt-1 tracking-widest">
          // PORTAL
        </p>
      </div>

      {navItems.map((item) => (
        <div key={item.label}>
          {item.section && (
            <p className="font-mono text-[9px] text-[#1e3a52] tracking-widest uppercase px-5 pt-4 pb-1">
              {item.section}
            </p>
          )}
          <Link
            to={item.path}
            className={`flex items-center gap-2 px-5 py-2 text-[13px] font-semibold border-l-2 transition-all ${
              location.pathname === item.path
                ? 'text-sky-400 border-sky-400 bg-[#0f1e2e]'
                : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-[#111827]'
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}

      <div className="mx-4 mt-auto bg-[#0f1e2e] border border-[#1e3a52] rounded-xl p-3">
        <p className="font-mono text-[9px] text-[#334155] tracking-widest mb-1">
          // CONNECTED WALLET
        </p>
        <p className="font-mono text-[10px] text-sky-400">7xKp...3fQz</p>
        <p className="text-sm font-bold text-slate-100 mt-1">142.5 SOL</p>
      </div>

    </div>
  )
}