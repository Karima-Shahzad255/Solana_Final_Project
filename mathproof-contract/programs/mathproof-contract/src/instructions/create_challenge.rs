use anchor_lang::prelude::*;
use crate::state::Challenge;
use crate::constants::*;
use crate::error::MathProofError;

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateChallenge<'info> {
    #[account(
        init,
        payer = teacher,
        space = 8 + Challenge::MAX_SIZE,
        seeds = [CHALLENGE_SEED, teacher.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub challenge: Account<'info, Challenge>,

    #[account(mut)]
    pub teacher: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateChallenge>,
    title: String,
    topic: String,
    problem: String,
    answer: String,
    reward: u64,
    difficulty: u8,
) -> Result<()> {
    require!(title.len() <= 50, MathProofError::TitleTooLong);
    require!(answer.len() <= 50, MathProofError::AnswerTooLong);

    let challenge = &mut ctx.accounts.challenge;
    challenge.teacher = ctx.accounts.teacher.key();
    challenge.title = title;
    challenge.topic = topic;
    challenge.problem = problem;
    challenge.answer = answer;
    challenge.reward = reward;
    challenge.difficulty = difficulty;
    challenge.is_active = true;
    challenge.submission_count = 0;
    challenge.bump = ctx.bumps.challenge;

    msg!("Challenge created: {}", challenge.title);
    Ok(())
}