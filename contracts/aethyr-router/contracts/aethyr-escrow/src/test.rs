#![cfg(test)]

use super::*;
use soroban_sdk::{vec, Env, Address, token, testutils::Address as _, testutils::Ledger};

#[test]
fn test_milestone_release_flow() {
    let env = Env::default();
    env.mock_all_auths();

    // 1. Deploy & initialize escrow contract
    let escrow_address = env.register(AethyrEscrow, ());
    let client = AethyrEscrowClient::new(&env, &escrow_address);

    let validator = Address::generate(&env);
    client.initialize(&validator);

    // 2. Set up token & accounts
    let admin = Address::generate(&env);
    let token_info = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = token_info.address();

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);

    // Mint tokens to sender
    let token_admin = token::StellarAssetClient::new(&env, &token_addr);
    token_admin.mint(&sender, &10000);

    let token_client = token::Client::new(&env, &token_addr);
    assert_eq!(token_client.balance(&sender), 10000);

    // 3. Define milestones
    let m1 = Milestone {
        description: Symbol::new(&env, "design"),
        payout_weight: 4000,
        is_completed: false,
    };
    let m2 = Milestone {
        description: Symbol::new(&env, "impl"),
        payout_weight: 6000,
        is_completed: false,
    };
    let milestones = vec![&env, m1, m2];

    // 4. Create escrow
    let escrow_id = client.create_escrow(&sender, &receiver, &token_addr, &10000, &milestones);

    // Assert funds are locked in the contract
    assert_eq!(token_client.balance(&sender), 0);
    assert_eq!(token_client.balance(&escrow_address), 10000);

    // Check stored escrow
    let escrow = client.get_escrow(&escrow_id).unwrap();
    assert_eq!(escrow.amount, 10000);
    assert_eq!(escrow.released_amount, 0);

    // 5. Release first milestone (by validator)
    client.release_milestone(&escrow_id, &0, &validator);

    // Assert payout is distributed (40% of 10000 = 4000)
    assert_eq!(token_client.balance(&receiver), 4000);
    assert_eq!(token_client.balance(&escrow_address), 6000);

    let escrow = client.get_escrow(&escrow_id).unwrap();
    assert_eq!(escrow.released_amount, 4000);
    assert!(escrow.milestones.get(0).unwrap().is_completed);
    assert!(!escrow.milestones.get(1).unwrap().is_completed);

    // 6. Release second milestone (by sender/payer - mutual agreement)
    client.release_milestone(&escrow_id, &1, &sender);

    // Assert payout is distributed (60% of 10000 = 6000, total 10000)
    assert_eq!(token_client.balance(&receiver), 10000);
    assert_eq!(token_client.balance(&escrow_address), 0);

    let escrow = client.get_escrow(&escrow_id).unwrap();
    assert_eq!(escrow.released_amount, 10000);
    assert!(escrow.milestones.get(1).unwrap().is_completed);
}

#[test]
fn test_refund_flow_success() {
    let env = Env::default();
    env.mock_all_auths();

    // Set initial ledger time
    env.ledger().with_mut(|li| {
        li.timestamp = 100000;
    });

    let escrow_address = env.register(AethyrEscrow, ());
    let client = AethyrEscrowClient::new(&env, &escrow_address);

    // Setup token & accounts
    let admin = Address::generate(&env);
    let token_info = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = token_info.address();

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);

    let token_admin = token::StellarAssetClient::new(&env, &token_addr);
    token_admin.mint(&sender, &10000);

    let m1 = Milestone {
        description: Symbol::new(&env, "milestone"),
        payout_weight: 10000,
        is_completed: false,
    };
    let milestones = vec![&env, m1];

    let escrow_id = client.create_escrow(&sender, &receiver, &token_addr, &10000, &milestones);

    // Advance time beyond lock period (7 days = 604,800 seconds)
    // 100000 + 604800 = 704800
    env.ledger().with_mut(|li| {
        li.timestamp = 704801;
    });

    // Refund now should succeed
    client.refund_escrow(&escrow_id, &sender);

    // Assert funds returned to sender
    let token_client = token::Client::new(&env, &token_addr);
    assert_eq!(token_client.balance(&sender), 10000);
    assert_eq!(token_client.balance(&escrow_address), 0);

    // Verify escrow configuration is removed
    assert!(client.get_escrow(&escrow_id).is_none());
}

#[test]
#[should_panic(expected = "Escrow lock has not expired yet")]
fn test_refund_flow_fails_before_expiration() {
    let env = Env::default();
    env.mock_all_auths();

    // Set initial ledger time
    env.ledger().with_mut(|li| {
        li.timestamp = 100000;
    });

    let escrow_address = env.register(AethyrEscrow, ());
    let client = AethyrEscrowClient::new(&env, &escrow_address);

    // Setup token & accounts
    let admin = Address::generate(&env);
    let token_info = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = token_info.address();

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);

    let token_admin = token::StellarAssetClient::new(&env, &token_addr);
    token_admin.mint(&sender, &10000);

    let m1 = Milestone {
        description: Symbol::new(&env, "milestone"),
        payout_weight: 10000,
        is_completed: false,
    };
    let milestones = vec![&env, m1];

    let escrow_id = client.create_escrow(&sender, &receiver, &token_addr, &10000, &milestones);

    // Try to refund immediately - should panic because lock has not expired
    client.refund_escrow(&escrow_id, &sender);
}
