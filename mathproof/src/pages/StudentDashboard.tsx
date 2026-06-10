import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import idl from '../mathproof_contract.json'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const PROGRAM_ID = new PublicKey('F2ARYj2A3s3mYtk3iQ8cjysBo92J2Hk5k3jciACSbN9n')
const DEVNET_URL = 'https://api.devnet.solana.com'

interface Challenge {
  publicKey: string
  title: string
  topic: string
  problem: string
  reward: number
  difficulty: number
  isActive: boolean
  submissionCount: number
  teacher: string
}

export default function StudentDashboard() {
  const { isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('solana')

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selected, setSelected] = useState<Challenge | null>(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [message, setMessage] = useState('')

  const difficultyLabel = (d: number) => ['Easy', 'Medium', 'Hard'][d] || 'Easy'
  const difficultyColor = (d: number) => [
    'bg-emerald-950 text-emerald-400 border-emerald-900',
    'bg-amber-950 text-amber-400 border-amber-900',
    'bg-red-950 text-red-400 border-red-900',
  ][d] || 'bg-emerald-950 text-emerald-400'

  async function fetchChallenges() {
    try {
      setFetching(true)
      const connection = new Connection(DEVNET_URL, 'confirmed')
      const provider = new AnchorProvider(
        connection,
        walletProvider as any || { publicKey: PublicKey.default, signTransaction: async (t: any) => t, signAllTransactions: async (t: any) => t },
        { commitment: 'confirmed' }
      )
      setProvider(provider)
      const program = new Program(idl as any, provider)
     const accounts = await (program.account as any).challenge.all()
      const parsed = accounts.map((a: any) => ({
        publicKey: a.publicKey.toString(),
        title: a.account.title,
        topic: a.account.topic,
        problem: a.account.problem,
        reward: a.account.reward.toNumber(),
        difficulty: a.account.difficulty,
        isActive: a.account.isActive,
        submissionCount: a.account.submissionCount.toNumber(),
        teacher: a.account.teacher.toString(),
      }))
      setChallenges(parsed)
    } catch (err) {
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchChallenges()
  }, [isConnected])

  async function handleSubmit() {
    if (!isConnected || !walletProvider) {
      setMessage('Please connect your wallet first!')
      return
    }
    if (!selected) return
    if (!answer.trim()) {
      setMessage('Please enter your answer!')
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

      const challengePubkey = new PublicKey(selected.publicKey)
    

      const [submissionPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('submission'),
          challengePubkey.toBuffer(),
          provider.wallet.publicKey.toBuffer(),
        ],
        PROGRAM_ID
      )

      await program.methods
        .submitAnswer(answer)
        .accounts({
          challenge: challengePubkey,
          submission: submissionPDA,
          student: provider.wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc()

      setMessage('✅ Answer submitted successfully!')
      setAnswer('')
      fetchChallenges()
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
          title="Student Dashboard"
          subtitle="// SOLVE CHALLENGES — EARN REWARDS"
        />
        <div className="p-7">

          {/* Header Row */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-extrabold text-slate-100">
              Available Challenges
            </h2>
            <button
              onClick={fetchChallenges}
              className="text-xs font-bold text-sky-400 border border-sky-800 px-4 py-2 rounded-lg hover:bg-sky-950 transition-all">
              {fetching ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-4">

            {/* Left — Challenge List */}
            <div className="flex flex-col gap-3">
              {fetching && (
                <div className="text-center text-slate-500 font-mono text-sm py-10">
                  Loading challenges from devnet...
                </div>
              )}
              {!fetching && challenges.length === 0 && (
                <div className="text-center text-slate-500 font-mono text-sm py-10 bg-[#0d1320] border border-[#1e2d45] rounded-xl">
                  No challenges found. Ask your teacher to create one!
                </div>
              )}
              {challenges.map((c) => (
                <div
                  key={c.publicKey}
                  onClick={() => { setSelected(c); setMessage(''); setAnswer('') }}
                  className={`bg-[#0d1320] border rounded-xl p-4 cursor-pointer transition-all ${
                    selected?.publicKey === c.publicKey
                      ? 'border-sky-500'
                      : 'border-[#1e2d45] hover:border-sky-800'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-slate-200">{c.title}</h3>
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${difficultyColor(c.difficulty)}`}>
                        {difficultyLabel(c.difficulty)}
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${c.isActive ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : 'bg-[#1a1a1a] text-slate-500 border-[#1e2d45]'}`}>
                        {c.isActive ? 'ACTIVE' : 'CLOSED'}
                      </span>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-[#334155] mb-2">
                    {c.topic} · {c.submissionCount} submissions
                  </p>
                  <p className="text-xs text-slate-400">{c.problem}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sky-400 text-xs font-bold">🏆 {c.reward} tokens</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Submit Answer */}
            <div className="bg-[#0d1320] border border-[#1e2d45] rounded-xl h-fit">
              <div className="px-5 py-3 border-b border-[#1e2d45]">
                <h2 className="text-sm font-bold text-slate-400">
                  {selected ? `📝 ${selected.title}` : '📝 Select a Challenge'}
                </h2>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {!selected ? (
                  <p className="text-slate-500 font-mono text-xs text-center py-6">
                    Click a challenge on the left to solve it
                  </p>
                ) : (
                  <>
                    <div className="bg-[#080c14] border border-[#1e2d45] rounded-lg p-4">
                      <p className="font-mono text-[10px] text-[#334155] mb-2">// PROBLEM</p>
                      <p className="text-sm text-slate-200">{selected.problem}</p>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-[#080c14] border border-[#1e2d45] rounded-lg p-3 flex-1 text-center">
                        <p className="font-mono text-[9px] text-[#334155]">REWARD</p>
                        <p className="text-sky-400 font-bold text-sm">{selected.reward} tokens</p>
                      </div>
                      <div className="bg-[#080c14] border border-[#1e2d45] rounded-lg p-3 flex-1 text-center">
                        <p className="font-mono text-[9px] text-[#334155]">DIFFICULTY</p>
                        <p className="text-slate-200 font-bold text-sm">{difficultyLabel(selected.difficulty)}</p>
                      </div>
                    </div>

                    {message && (
                      <div className={`text-xs font-mono p-3 rounded-lg ${message.startsWith('✅') ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>
                        {message}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] text-slate-500 tracking-widest">// YOUR ANSWER</label>
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="bg-[#080c14] border border-[#1e2d45] rounded-lg text-slate-200 text-sm px-3 py-2 outline-none focus:border-sky-500 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !selected.isActive}
                      className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-900 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                      {loading ? '⏳ Submitting...' : '🚀 Submit Answer'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}