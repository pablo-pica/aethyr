#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol, Vec, token};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Milestone {
    pub description: Symbol,   // Short description of the work
    pub payout_weight: u32,   // Payout percentage represented in basis points (e.g., 5000 = 50.00%)
    pub is_completed: bool,   // Completion status
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Escrow {
    pub sender: Address,
    pub receiver: Address,
    pub token: Address,
    pub amount: i128,
    pub milestones: Vec<Milestone>,
    pub released_amount: i128,
    pub creation_time: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Escrow(BytesN<32>),
    Validator,
}

pub const LOCK_PERIOD_SECONDS: u64 = 7 * 24 * 60 * 60; // 7 days lock period

pub trait AethyrEscrowTrait {
    /// Creates an escrow lock for a routed payment
    /// - `sender`: The account locking the funds (requires require_auth)
    /// - `receiver`: The account receiving payouts upon milestone completion
    /// - `token`: Soroban token address of locked funds
    /// - `amount`: Total amount locked
    /// - `milestones`: Vector of milestones with descriptions and payout weights
    fn create_escrow(
        env: Env,
        sender: Address,
        receiver: Address,
        token: Address,
        amount: i128,
        milestones: Vec<Milestone>,
    ) -> BytesN<32>; // Returns Escrow ID

    /// Releases funds for a specific milestone
    /// - `escrow_id`: Unique identifier of the escrow
    /// - `milestone_index`: The index of the milestone being completed
    /// - `auth_party`: The designated validator/oracle address authorizing release (requires require_auth)
    fn release_milestone(
        env: Env,
        escrow_id: BytesN<32>,
        milestone_index: u32,
        auth_party: Address,
    );

    /// Refunds remaining locked funds upon cancellation or failure
    /// - `escrow_id`: Unique identifier of the escrow
    /// - `sender`: The sender reclaiming funds (requires require_auth; only allowed after lock expiration)
    fn refund_escrow(
        env: Env, 
        escrow_id: BytesN<32>, 
        sender: Address
    );
}

#[contract]
pub struct AethyrEscrow;

#[contractimpl]
impl AethyrEscrow {
    /// Initializes the contract with a designated global validator/oracle address
    pub fn initialize(env: Env, validator: Address) {
        if env.storage().instance().has(&DataKey::Validator) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Validator, &validator);
    }

    /// Helper to get the designated validator address if set
    pub fn get_validator(env: Env) -> Option<Address> {
        env.storage().instance().get(&DataKey::Validator)
    }

    /// Helper to get escrow details by ID
    pub fn get_escrow(env: Env, escrow_id: BytesN<32>) -> Option<Escrow> {
        env.storage().persistent().get(&DataKey::Escrow(escrow_id))
    }
}

#[contractimpl]
impl AethyrEscrowTrait for AethyrEscrow {
    fn create_escrow(
        env: Env,
        sender: Address,
        receiver: Address,
        token: Address,
        amount: i128,
        milestones: Vec<Milestone>,
    ) -> BytesN<32> {
        // require_auth on sender
        sender.require_auth();

        if amount <= 0 {
            panic!("Escrow amount must be positive");
        }

        if milestones.is_empty() {
            panic!("Escrow must have at least one milestone");
        }

        // Validate milestone weights sum up to exactly 10000 basis points (100.00%)
        let mut total_weight: u32 = 0;
        let mut sanitized_milestones = Vec::new(&env);
        for milestone in milestones.iter() {
            total_weight += milestone.payout_weight;
            sanitized_milestones.push_back(Milestone {
                description: milestone.description,
                payout_weight: milestone.payout_weight,
                is_completed: false, // Ensure initially false
            });
        }
        if total_weight != 10000 {
            panic!("Total milestone weight must be exactly 10000 basis points");
        }

        // Transfer tokens from sender to this contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        // Generate unique escrow ID
        let escrow_id: BytesN<32> = env.prng().gen();

        let escrow = Escrow {
            sender: sender.clone(),
            receiver: receiver.clone(),
            token: token.clone(),
            amount,
            milestones: sanitized_milestones,
            released_amount: 0,
            creation_time: env.ledger().timestamp(),
        };

        // Store configuration in persistent storage
        env.storage().persistent().set(&DataKey::Escrow(escrow_id.clone()), &escrow);

        // Emit custom event
        env.events().publish(
            (Symbol::new(&env, "create_escrow"), escrow_id.clone(), sender),
            (receiver, token, amount),
        );

        escrow_id
    }

    fn release_milestone(
        env: Env,
        escrow_id: BytesN<32>,
        milestone_index: u32,
        auth_party: Address,
    ) {
        // require_auth on auth_party
        auth_party.require_auth();

        // Get escrow configuration
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id.clone()))
            .unwrap_or_else(|| panic!("Escrow not found"));

        if milestone_index >= escrow.milestones.len() {
            panic!("Invalid milestone index");
        }

        let mut milestones = escrow.milestones;
        let mut milestone = milestones.get(milestone_index).unwrap();

        if milestone.is_completed {
            panic!("Milestone already completed");
        }

        // Verify authorization: auth_party must be either the sender (payer)
        // or the designated global validator.
        let is_sender = auth_party == escrow.sender;
        let is_validator = if env.storage().instance().has(&DataKey::Validator) {
            let val: Address = env.storage().instance().get(&DataKey::Validator).unwrap();
            auth_party == val
        } else {
            false
        };

        if !is_sender && !is_validator {
            panic!("Unauthorized auth_party for milestone release");
        }

        // Mark milestone as completed
        milestone.is_completed = true;
        milestones.set(milestone_index, milestone.clone());
        escrow.milestones = milestones;

        // Calculate payout amount based on weight
        let payout_amount = (escrow.amount * milestone.payout_weight as i128) / 10000;
        escrow.released_amount += payout_amount;

        // Update persistent storage
        env.storage().persistent().set(&DataKey::Escrow(escrow_id.clone()), &escrow);

        // Transfer funds if payout_amount is positive
        if payout_amount > 0 {
            let token_client = token::Client::new(&env, &escrow.token);
            token_client.transfer(&env.current_contract_address(), &escrow.receiver, &payout_amount);
        }

        // Emit custom event
        env.events().publish(
            (Symbol::new(&env, "release_milestone"), escrow_id, milestone_index),
            (auth_party, payout_amount),
        );
    }

    fn refund_escrow(
        env: Env,
        escrow_id: BytesN<32>,
        sender: Address,
    ) {
        // require_auth on sender
        sender.require_auth();

        // Get escrow configuration
        let escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id.clone()))
            .unwrap_or_else(|| panic!("Escrow not found"));

        // Verify caller matches sender in escrow config
        if sender != escrow.sender {
            panic!("Caller does not match escrow sender");
        }

        // Verify lock expiration
        if env.ledger().timestamp() < escrow.creation_time + LOCK_PERIOD_SECONDS {
            panic!("Escrow lock has not expired yet");
        }

        let refund_amount = escrow.amount - escrow.released_amount;
        if refund_amount <= 0 {
            panic!("No remaining funds to refund");
        }

        // Remove escrow from persistent storage
        env.storage().persistent().remove(&DataKey::Escrow(escrow_id.clone()));

        // Transfer remaining funds to sender
        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(&env.current_contract_address(), &escrow.sender, &refund_amount);

        // Emit custom event
        env.events().publish(
            (Symbol::new(&env, "refund_escrow"), escrow_id, sender),
            refund_amount,
        );
    }
}

mod test;
