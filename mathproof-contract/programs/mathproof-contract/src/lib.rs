#![allow(ambiguous_glob_reexports)]

pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("F2ARYj2A3s3mYtk3iQ8cjysBo92J2Hk5k3jciACSbN9n");

#[program]
pub mod mathproof_contract {
    use super::*;

    pub fn create_challenge(
        ctx: Context<CreateChallenge>,
        title: String,
        topic: String,
        problem: String,
        answer: String,
        reward: u64,
        difficulty: u8,
    ) -> Result<()> {
        create_challenge::handler(ctx, title, topic, problem, answer, reward, difficulty)
    }

    pub fn submit_answer(
        ctx: Context<SubmitAnswer>,
        answer: String,
    ) -> Result<()> {
        submit_answer::handler(ctx, answer)
    }
}