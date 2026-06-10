import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { AnchorProvider, Program, BN, setProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { useState } from 'react'
import idl from '../mathproof_contract.json'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'

const PROGRAM_ID = new PublicKey('F2ARYj2A3s3mYtk3iQ8cjysBo92J2Hk5k3jciACSbN9n')
const DEVNET_URL = 'https://api.devnet.solana.com'

export default function TeacherDashboard() {
  const { isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('Algebra')
  const [problem, setProblem] = useState('')
  const [answer, setAnswer] = useState('')
  const [reward, setReward] = useState('50')
  const [difficulty, setDifficulty] = useState('0')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleCreateChallenge() {
    if (!isConnected || !walletProvider) {
      setMessage('Please connect your wallet first!')
      return
    }
    try {
      setLoading(true)
      setMessage('')
      const connection = new Connection(DEVNET_URL, 'confirmed')
      const provider = new AnchorProvider(connection, walletProvider as any, {
        commitment: 'confirmed',
      })
      setProvider(provider)
      const program = new Program(idl as any, provider)

      const [challengePDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('challenge'),
          provider.wallet.publicKey.toBuffer(),
          Buffer.from(title),
        ],
        PROGRAM_ID
      )

      await program.methods
        .createChallenge(
          title,
          topic,
          problem,
          answer,
          new BN(parseInt(reward)),
          parseInt(difficulty),
        )
        .accounts({
          challenge: challengePDA,
          teacher: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      setMessage('✅ Challenge deployed to Solana successfully!')
      setTitle('')
      setProblem('')
      setAnswer('')
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#080c14]">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar
          title="Teacher Dashboard"
          subtitle="// SLOT #284,719,043 — SOLANA DEVNET"
        />
        <div className="p-7">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Active Challenges" value="12" change="↑ 3 this week" color="blue" />
            <StatCard label="Total Submissions" value="347" change="↑ 28 today" color="green" />
            <StatCard label="NFTs Minted" value="89" change="↑ 5 today" color="amber" />
            <StatCard label="Tokens Rewarded" value="4,210" change="↑ 180 today" color="purple" />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-[1fr_360px] gap-4 min-w-0">

            {/* Left Column */}
            <div className="flex flex-col gap-4">

              {/* Active Challenges */}
              <div className="bg-[#0d1320] border border-[#1e2d45] rounded-xl">
                <div className="px-5 py-3 border-b border-[#1e2d45] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-400">Active Challenges</h2>
                  <button className="text-xs text-slate-500 border border-[#1e3a52] px-3 py-1 rounded-lg hover:text-sky-400 hover:border-sky-400 transition-all">
                    View All
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-1">
                  {[
                    { name: 'Quadratic Equations — Set A', topic: 'Algebra', submissions: 24, tokens: 50, status: 'ACTIVE' },
                    { name: 'Circle Theorems Quiz', topic: 'Geometry', submissions: 18, tokens: 30, status: 'ACTIVE' },
                    { name: 'Trig Identities Challenge', topic: 'Trigonometry', submissions: 11, tokens: 75, status: 'DRAFT' },
                    { name: 'Linear Inequalities HW', topic: 'Algebra', submissions: 31, tokens: 20, status: 'CLOSED' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 py-2.5 border-b border-[#111827] last:border-0">
                      <div className="w-9 h-9 rounded-lg bg-[#0f1e2e] border border-[#1e3a52] flex items-center justify-center text-sky-400 text-sm flex-shrink-0">
                        ƒ
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-300">{c.name}</p>
                        <p className="font-mono text-[10px] text-[#334155] mt-0.5">
                          {c.topic} · {c.submissions} submissions · {c.tokens} tokens/correct
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded 
                          ${c.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                            c.status === 'DRAFT' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                            'bg-[#1a1a1a] text-slate-500 border border-[#1e2d45]'}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Submissions */}
              <div className="bg-[#0d1320] border border-[#1e2d45] rounded-xl">
                <div className="px-5 py-3 border-b border-[#1e2d45] flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-400">Recent Submissions</h2>
                  <span className="font-mono text-[10px] text-[#334155]">LIVE</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    { initials: 'AK', name: 'Ahmed K.', challenge: 'Quadratic Equations — Set A', correct: true, tokens: 50 },
                    { initials: 'SL', name: 'Sara L.', challenge: 'Circle Theorems Quiz', correct: true, tokens: 30 },
                    { initials: 'MR', name: 'Musa R.', challenge: 'Quadratic Equations — Set A', correct: false, tokens: 0 },
                    { initials: 'FZ', name: 'Fatima Z.', challenge: 'Circle Theorems Quiz', correct: true, tokens: 30 },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center gap-3 bg-[#080c14] border border-[#1e2d45] rounded-lg px-3 py-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0f1e2e] border border-[#1e3a52] flex items-center justify-center text-sky-400 text-xs font-bold flex-shrink-0">
                        {s.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-300">{s.name}</p>
                        <p className="font-mono text-[10px] text-[#334155]">{s.challenge}</p>
                      </div>
                      <div className="ml-auto text-xs font-bold">
                        {s.correct
                          ? <span className="text-emerald-400">✓ Correct · +{s.tokens} tokens</span>
                          : <span className="text-red-400">✗ Wrong · 0 tokens</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Create Challenge Form */}
            <div className="bg-[#0d1320] border border-[#1e2d45] rounded-xl h-fit">
              <div className="px-5 py-3 border-b border-[#1e2d45]">
                <h2 className="text-sm font-bold text-slate-400">+ Create Challenge</h2>
              </div>
              <div className="p-5 flex flex-col gap-4">

                {message && (
                  <div className={`text-xs font-mono p-3 rounded-lg ${message.startsWith('✅') ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                    {message}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest">// CHALLENGE TITLE</label>
                  <input type="text" placeholder="e.g. Algebra Homework #3"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest">// TOPIC</label>
                  <select value={topic} onChange={(e) => setTopic(e.target.value)}
                    className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all">
                    <option>Algebra</option>
                    <option>Geometry</option>
                    <option>Trigonometry</option>
                    <option>Calculus</option>
                    <option>Statistics</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] text-slate-500 tracking-widest">// PROBLEM STATEMENT</label>
                  <textarea placeholder="Solve: 2x² + 5x - 3 = 0" rows={3}
                    value={problem} onChange={(e) => setProblem(e.target.value)}
                    className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] text-slate-500 tracking-widest">// CORRECT ANSWER</label>
                    <input type="text" placeholder="e.g. x = 0.5, -3"
                      value={answer} onChange={(e) => setAnswer(e.target.value)}
                      className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] text-slate-500 tracking-widest">// TOKEN REWARD</label>
                    <input type="number" placeholder="50"
                      value={reward} onChange={(e) => setReward(e.target.value)}
                      className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] text-slate-500 tracking-widest">// DIFFICULTY</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                      className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all">
                      <option value="0">Easy</option>
                      <option value="1">Medium</option>
                      <option value="2">Hard</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] text-slate-500 tracking-widest">// DEADLINE</label>
                    <input type="date"
                      className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all" />
                  </div>
                </div>
                <button
                  onClick={handleCreateChallenge}
                  disabled={loading}
                  className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-900 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-lg transition-all mt-1">
                  {loading ? '⏳ Deploying...' : '🚀 Deploy to Solana'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}