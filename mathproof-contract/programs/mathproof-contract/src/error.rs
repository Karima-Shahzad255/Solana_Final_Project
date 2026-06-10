use anchor_lang::prelude::*;

#[error_code]
pub enum MathProofError {
    #[msg("Challenge is not active")]
    ChallengeNotActive,
    #[msg("Already submitted an answer")]
    AlreadySubmitted,
    #[msg("Title too long")]
    TitleTooLong,
    #[msg("Answer too long")]
    AnswerTooLong,
}