import { createAppKit } from '@reown/appkit'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { solanaDevnet } from '@reown/appkit/networks'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

const solanaAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter()],
})

export const modal = createAppKit({
  adapters: [solanaAdapter],
  networks: [solanaDevnet],
  projectId: '9513562d2104a85d87144db225436bf0',
  metadata: {
    name: 'MathProof Quest',
    description: 'Decentralized Math Challenge Platform',
    url: 'http://localhost:5173',
    icons: [],
  },
  features: {
    analytics: false,
  },
})