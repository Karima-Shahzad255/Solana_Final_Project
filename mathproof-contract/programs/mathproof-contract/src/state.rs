use anchor_lang::prelude::*;

#[account]
pub struct Challenge {
    pub teacher: Pubkey,        // wallet of teacher who created it
    pub title: String,          // challenge title
    pub topic: String,          // algebra, geometry etc
    pub problem: String,        // the math problem
    pub answer: String,         // correct answer (hashed later)
    pub reward: u64,            // tokens rewarded for correct answer
    pub difficulty: u8,         // 0=easy, 1=medium, 2=hard
    pub is_active: bool,        // is challenge open
    pub submission_count: u64,  // how many submissions
    pub bump: u8,               // PDA bump
}

#[account]
pub struct Submission {
    pub student: Pubkey,        // wallet of student
    pub challenge: Pubkey,      // which challenge
    pub answer: String,         // student's answer
    pub is_correct: bool,       // was it correct
    pub bump: u8,               // PDA bump
}

impl Challenge {
    pub const MAX_SIZE: usize = 32 + 4 + 50 + 4 + 30 + 4 + 200 + 4 + 50 + 8 + 1 + 1 + 8 + 1;
}

impl Submission {
    pub const MAX_SIZE: usize = 32 + 32 + 4 + 100 + 1 + 1;
}