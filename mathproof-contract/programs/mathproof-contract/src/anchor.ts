import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import idl from './mathproof_contract.json'

export const PROGRAM_ID = new PublicKey('F2ARYj2A3s3mYtk3iQ8cjysBo92J2Hk5k3jciACSbN9n')
export const DEVNET_URL = 'https://api.devnet.solana.com'

export function getProgram(wallet: any) {
  const connection = new Connection(DEVNET_URL, 'confirmed')
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
  setProvider(provider)
  const program = new Program(idl as any, provider)
  return program
}
