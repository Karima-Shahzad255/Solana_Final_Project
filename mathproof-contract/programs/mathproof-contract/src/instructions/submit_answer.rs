use anchor_lang::prelude::*;
use crate::state::{Challenge, Submission};
use crate::constants::*;
use crate::error::MathProofError;

#[derive(Accounts)]
#[instruction(answer: String)]
pub struct SubmitAnswer<'info> {
    #[account(
        mut,
        seeds = [CHALLENGE_SEED, challenge.teacher.as_ref(), challenge.title.as_bytes()],
        bump = challenge.bump
    )]
    pub challenge: Account<'info, Challenge>,

    #[account(
        init,
        payer = student,
        space = 8 + Submission::MAX_SIZE,
        seeds = [SUBMISSION_SEED, challenge.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub submission: Account<'info, Submission>,

    #[account(mut)]
    pub student: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<SubmitAnswer>,
    answer: String,
) -> Result<()> {
    let challenge = &mut ctx.accounts.challenge;
    let submission = &mut ctx.accounts.submission;

    require!(challenge.is_active, MathProofError::ChallengeNotActive);

    let is_correct = challenge.answer.trim().to_lowercase() == answer.trim().to_lowercase();

    submission.student = ctx.accounts.student.key();
    submission.challenge = challenge.key();
    submission.answer = answer;
    submission.is_correct = is_correct;
    submission.bump = ctx.bumps.submission;

    challenge.submission_count += 1;

    if is_correct {
        msg!("Correct answer! Reward: {} tokens", challenge.reward);
    } else {
        msg!("Wrong answer, try again!");
    }

    Ok(())
}