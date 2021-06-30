export const lang: Language = {
  name: 'US English',
  flag: 'US',
  key: 'en_US',
  dateTimeFormat: 'MMM do yyyy - HH:mm',
  tag: ['en_US', 'US', 'en', 'US English'],
  mapping: {
    // Common key:
    RECEIVE_ANY_TOKEN: 'This wallet can receive KAI and any KRC20 Tokens',
    CREATE: 'Create',
    CREATE_DESC: 'a brand new Wallet',
    UNDER_MAINTAINENCE_DESC: 'We are trying to bring the best experience for you.',
    COMING_SOON_DESC: 'On the way already!! Be patient',
    COPIED: 'Copied',
    PICKER_TITLE: 'Choose image',
    TAKE_PICTURE: 'Take picture',
    CHOOSE_FROM_LIBRARY: 'Choose from library',
    KEEP_IT: 'Keep it',
    DELETE_NOW: 'Delete Now',
    DONE: 'Done',
    BUY_KAI: 'Buy KAI',
    OK_TEXT: 'Ok! Got it',
    TOTAL_BALANCE: 'Total value',
    BALANCE: 'Available balance',
    CURRENT_BALANCE: 'Current balance',
    STAKED_AMOUNT: 'Staked',
    AGO: 'ago',
    GO_BACK: 'Go back',
    CREATE_NEW_WALLET: 'Create New Wallet',
    IMPORT_WALLET: 'New Wallet',
    IMPORT_YOUR_WALLET: 'Import Wallet',
    IMPORT_WALLET_DESCRIPTION:
      'Create or Import your wallets to start sending & receiving digital currency',
    WELCOME: 'Welcome to Kardia Wallet',
    GETTING_STARTED_DESCRIPTION:
      'To get started, choose one of the following options',
    SUBMIT: 'Submit',
    REQUIRED_FIELD: 'This field is required.',
    ADDRESS_NOT_FOUND: 'Address not found',
    ADDRESS_EXISTS: 'Address already exists.',
    COPY_TO_CLIPBOARD: 'Copy to Clipboard',
    SECOND: 'sec',
    CONFIRM_IMPORT: 'Are you sure you want to import a new wallet?',
    RESTART_APP_DESCRIPTION:
      'Kardia Wallet will now restart to ensure everything works properly.',
    ARE_YOU_SURE: 'Are you sure?',
    CONFIRM_REMOVE_TITLE: 'Delete Wallet',
    CONFIRM_REMOVE_WALLET: 'Remove this wallet from the device. \n Are you sure?',
    SAVE: 'Save',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    CONFIRM_REMOVE_ADDRESS: 'Are you sure you want to delete this address?',
    SCAN_QR_FOR_ADDRESS: 'Your Wallet Address',
    SCAN_QR_FOR_ADDRESS_DESCRIPTION:
      'Scan QR code containing address to import',
    ERC20_WARNING:
      'Please DO NOT send ERC20 KAI to this wallet.\nSending any others may result permanent loss.',
    LATER: 'Later',
    SET_APP_PASSCODE: 'Set Passcode',
    NO_PASSCODE: "You haven't set your app passcode yet.",
    PASSCODE_DESCRIPTION:
      "A Passcode helps to increase your wallet's security level.",
    IMPORT_WITH_PRIVATE_KEY: 'Import with Private Key',
    IMPORT_WITH_SEED: 'Import with Seed Phrase',
    SELECT_ADDRESS: 'Select Address',
    NO_SAVED_ADDRESS: 'No Address',
    NO_SAVED_ADDRESS_SUB_TEXT: 'Make transactions and save your favourite addresses here.',
    ADD_NEW_ADDRESS: 'Add new',
    SAVE_TO_ADDRESS_BOOK: 'Save address',
    INVALID_ADDRESS: 'Invalid address',
    TOKEN_EXISTS: 'Token already exists.',
    // Create wallet key:
    SUBMIT_CREATE: 'Understood. Access my wallet now.',
    MNEMONIC_DESCRIPTION:
      'The above 12 words will be used to recover, as well as access, your wallet.',
    WALLET_CARD_NAME: 'Name',
    // Import wallet key:
    ENTER_SEED_PHRASE: 'Enter your Seed Phrase.',
    ENTER_PRIVATE_KEY: 'Enter private key.',
    SCAN_SEED_PHRASE: 'Scan QR code for seed phrase.',
    SCAN_PRIVATE_KEY: 'Scan QR code for private key.',
    WALLET_EXISTED: 'Wallet already exists.',
    ERROR_SEED_PHRASE:
      'The format for your seed phrase is incorrect, please recheck.',
    ERROR_PRIVATE_KEY: 'Invalid private key provided, please recheck.',
    CONFIRM_ENTER_SEED_PHRASE:
      'Are you sure you have copied the 12 seed phrases correctly?',
    SURE: "Yes, I'm sure.",
    NOT_SURE: 'Take me back.',
    SELECT_YOUR_WALLET: 'Select your wallet.',
    PROCESSING_YOUR_SEED: 'Processing your seed phrase...',
    BY_PRIVATE_KEY: 'by Private Key',
    BY_SEED_PHRASE: 'by Seed Phrase',
    // Transaction key
    HISTORY: 'History',
    RECENT_TRANSACTION: 'History',
    NO_TRANSACTION: 'No transaction',
    NO_TRANSACTION_SUB_TEXT: 'Hello!? Anybody home ??',
    NO_KRC20_TRANSACTION_SUB_TEXT: 'Looks like we don’t have any transaction for this token...yet',
    SEARCH_TRANSACTION_PLACEHOLDER:
      'Search with address / hash / block number...',
    VIEW_ALL: 'Manage',
    SEND: 'Send',
    SEND_NOW: 'Send Now',
    CANCEL: 'Cancel',
    RECEIVE: 'Receive',
    TX_TYPE_RECEIVED: 'Received',
    TX_TYPE_SEND: 'Send',
    TRANSACTION_HASH: 'Transaction Hash',
    TRANSACTION_DETAIL: 'Detail',
    TRANSACTION_AMOUNT: 'Amount',
    TRANSACTION_FEE: 'Transaction Fee',
    FROM: 'From',
    TO: 'To',
    TRANSACTION_DATE: 'Transaction Date',
    CREATE_TX_ADDRESS: 'Address',
    CREATE_TX_ADDRESS_PLACEHOLDER: 'Receiver address',
    CREATE_KRC20_TX_ADDRESS: 'Send to Address',
    CREATE_TX_KAI_AMOUNT: 'Amount',
    CREATE_TX_KRC20_AMOUNT: 'Amount',
    TRANSACTION_SPEED: 'Transaction Speed',
    SLOW_SPEED: 'Slow',
    AVERAGE_SPEED: 'Average',
    FAST_SPEED: 'Fast',
    GAS_PRICE: 'Gas price',
    GAS_LIMIT: 'Gas limit',
    NEW_CONTACT: 'New Contact',
    SPEED_DESCRIPTION:
      '* Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster but, it is not always guaranteed.',
    CONFIRM_TRANSACTION: 'Confirm your Transaction',
    CONFIRM_KAI_AMOUNT: 'Amount',
    NOT_ENOUGH_KAI_FOR_TX: 'Insufficient Balance',
    TX_SUCCESS: 'You have just sent to',
    // Wallet key
    IMPORT: 'Import',
    WALLET: 'Wallet',
    ADDRESS: 'Address',
    REMOVE_WALLET: 'Remove Wallet',
    NEW_WALLET: 'New Wallet',
    // News key
    NEWS_SCREEN_TITLE: 'News',
    // Staking key
    STAKING_TITLE: 'Staking',
    NO_STAKING: 'No Staking?',
    NO_STAKING_ITEM: "You haven't staked for any validator yet? What are you waiting for?",
    STAKE_NOW: 'Stake Now',
    CLAIMABLE: 'Claimable KAI',
    STAKED: 'Staked KAI',
    WITHDRAWABLE: 'Withdrawable KAI',
    UNBONDED: 'Unbonded KAI',
    CLAIM_REWARD: 'Claim',
    UNDELEGATE: 'Undelegate',
    WITHDRAW: 'Withdraw',
    SUCCESS: 'Success',
    FAIL: 'Fail',
    GENERAL_FAIL_DESC: 'Please send transaction hash to admin for support.',
    DELEGATE_SUCCESS: 'You have just delegated to',
    CLAIM_SUCCESS: '{{KAI_AMOUNT}} KAI successfully claimed to your wallet.',
    WITHDRAW_SUCCESS:
      '{{KAI_AMOUNT}} KAI successfully withdrawn to your wallet.',
    UNDELEGATE_SUCCESS:
      '{{KAI_AMOUNT}} KAI is undelegated. You will need to wait 7 days to withdraw {{KAI_AMOUNT}} KAI back to your wallet.',
    UNDELEGATE_AMOUNT_TOO_MUCH: 'Must be less than your staked KAI amount.',
    UNDELEGATE_AMOUNT_REMAIN_MIN:
      'You must keep at least {{MIN_KAI}} KAI in staking, or undelegate all KAI.',
    UNDELEGATE_AMOUNT_PLACEHOLDER: 'Amount to Undelegate:',
    YOUR_INVESTMENTS: 'My Investments',
    TOTAL_EARNING: 'Total Earnings', // Your Total Return?
    INVEST: 'Stake Now',
    CHOOSE_VALIDATOR: 'Choose a Validator',
    STAKING_AMOUNT: 'Staking Amount',
    STAKING_AMOUNT_NOT_ENOUGHT: 'Not enough KAI to stake.',
    AT_LEAST_MIN_DELEGATE: 'Must delegate at least {{MIN_KAI}} KAI',
    DELEGATE: 'Delegate Now',
    ESTIMATED_EARNING: 'Estimated return in 30 days',
    ESTIMATED_APR: 'Estimated APR',
    TOTAL_STAKED_AMOUNT: 'Total Staked Amount',
    COMMISSION_RATE: 'Commission Fee',
    VOTING_POWER: 'Voting Power',
    VALIDATOR_LIST_TITLE: 'Choose a Validator',
    NEW_STAKING_TITLE: 'Stake & Earn',
    SEARCH_VALIDATOR_PLACEHOLDER: 'Search by validator name ...',
    // Notification Key
    NOTIFICATION_SCREEN_TITLE: 'Notification',
    TODAY: 'Today',
    EARLIER: 'Earlier',
    // Setting key
    SETTING_SCREEN_TITLE: 'Settings',
    ADDRESS_BOOK_MENU: 'Address Book',
    LANGUAGE_MENU: 'Language Settings',
    LANGUAGE_SETTING_TITLE: 'Languages',
    SECRET_PHRASE_MENU: 'Export Secret Credential',
    PASSCODE_MENU: 'App Passcode Settings',
    INFO_MENU: 'About KardiaChain Wallet',
    MNEMONIC_SETTING_TITLE: 'Secret Credential',
    SHOW_SECRET_TEXT: 'Show my Credential',
    ADDRESS_NAME: 'Name',
    ADDRESS_NAME_PLACEHOLDER: 'Contact Name',
    ADDRESS_ADDRESS: 'Address',
    ADDRESS_ADDRESS_PLACEHOLDER: 'Wallet address',
    PASSCODE_SETTING_TITLE: 'App Passcode',
    PASSCODE_SETTING_TRIGGER: 'Enable App Passcode',
    CHANGE_PASSCODE: 'Change Passcode',
    NEW_PASSCODE: 'Enter New PIN',
    CONFIRM_PASSCODE: 'Confirm New PIN',
    CONFIRM_PASSCODE_NOT_MATCH: 'Confirmation passcode does NOT match',
    ENTER_PASSCODE: 'Enter PIN to continue.',
    INCORRECT_PASSCODE: 'Incorrect Passcode',
    AVATAR: 'Avatar',
    WALLET_MANAGEMENT: 'Wallet Management',
    GENERAL_GROUP: 'General',
    SECURITY_GROUP: 'Security',
    SET_NEW_PIN: 'Set new PIN',
    CONFIRM_PIN: 'Confirm PIN',
    WALLET_DETAILS: 'Wallet Details',
    WALLET_CARD_TYPE: 'Card Type',
    SEED_PHRASE_TITLE: 'My credentials',
    SEED_PHRASE_DESC: 'Keep it safe & sound.',
    FONT_SIZE: 'Font Size',
    // Error boundary key
    ERROR_BOUNDARY_TITLE: 'Oops, Something Went Wrong',
    ERROR_BOUNDARY_DESCRIPTION:
      'The app ran into a problem and could not continue. We apologise for any inconvenience this may have caused. Press the button below to restart the app and sign back in. Please contact us if this issue persists.',
    NOT_ENOUGH_BALANCE:
      'The amount requested exceeds your current wallet balance.',
    GENERAL_ERROR: 'An error occured. Please try again later.',
    // KRC20 key
    KRC20_TOKENS_SECTION_TITLE: 'My Tokens',
    ADD_TOKEN: 'Add token',
    ADD_CUSTOM_TOKEN: 'Custom token',
    TOKEN_ADDRESS: 'Token address',
    SEND_TOKEN: 'Send {{TOKEN_SYMBOL}}',
    RECEIVE_TOKEN: 'Receive {{TOKEN_SYMBOL}}',
    REMOVE_TOKEN: 'Hide token',
    HIDE_NOW: 'Hide this token',
    CONFIRM_REMOVE_TOKEN: 'Hide {{SPLIT_HERE}} from the list.\nYou can add it again anytime.',
    NO_TOKENS: 'No Tokens',
    NO_TOKENS_SUB_TEXT: 'Add your tokens and manage them easily.',
    ERROR_FETCH_KRC20_DATA: "Couldn't get tokens data.",
    CHOOSE_VERIFIED_TOKENS: 'Choose token',
    CUSTOM_TOKENS_DESC: 'created by developer',
    VERIFIED_TOKENS: 'Listed Token',
    VERIFIED_TOKENS_DESC: 'listed by KardiaChain',
    ADD_TOKEN_DESCRIPTION: 'All tokens in 1 wallet for easier management',
    // Auth modal key
    ENTER_PIN_CODE: 'Enter your PIN to process',
    WRONG_PIN: 'Incorrect PIN',
    // Scan QR screen
    SCAN_QR_TITLE: 'Scan QR Code',
    LOAD_MORE_WALLET: 'Load more Wallet (+5)',
    INVALID_PHRASE: 'Invalid Seed Phrase',
    INVALID_PRIVATE_KEY: 'Invalid Private Key',
    SCAN_QR_MNEMONIC: 'Scan your seed phrase QR code, then we will do the rest',
    ENTER_QR_MNEMONIC: 'Input your 12-words secret seed phrase manually, or just scan the QR code.',
    SCAN_QR_PRIVATE_KEY: 'Scan QR code containing wallet\'s private key to import.',
    ENTER_QR_PRIVATE_KEY: 'Input your private key manually, or just scan the QR code.',
    SCAN_MODE: 'Scan code',
    INPUT_MODE: 'Enter code',
    // Tab nav:
    HOME: 'My Wallet',
    TRANSACTIONS: 'Transactions',
    STAKING: 'Staking',
    ADDRESS_BOOK: 'Address',
    SETTING: 'Settings',
    KAI_DEX: 'KAI Dex',
    // Walk through screen:
    START_NOW: 'Start now',
    EASY: 'Easy',
    INSTANT: 'Instant',
    SECURE: 'Secure',
    EASY_DESC: 'Easily create or import you wallet in just a few steps.',
    INSTANT_DESC: 'Send and receive your crypto currencies within a blink of an eye.',
    SECURE_DESC: 'Protect your digital assets with state-of-the-art blockchain technology.',
    // Dex key
    MARKET_TITLE: 'Market',
    LIMIT_TITLE: 'Limit',
    PAIRS: 'Pairs',
    BUY: 'Buy',
    SELL: 'Sell',
    CLICK_TO_SELECT_PAIR: 'Click to select pair',
    TX_DEADLINE: 'Transaction deadline',
    SLIPPAGE_TOLERANCE: 'Slippage tolerance',
    DEX_MODE_BUY: 'Buy',
    DEX_MODE_SELL: 'Sell',
    DEX_TX_SUCCESS: '{{DEX_MODE}} {{TOKEN_AMOUNT}} {{TOKEN_SYMBOL}} successfully',
    MINS: 'mins',
    TX_SETTING: 'Transaction settings',
    VOLUME_24H: 'Volume (24h):',
    SWAP_GENERAL_ERROR: 'Transaction failed. Please try setting deadline and slippage tolerance then try again.',
    ENTER_AMOUNT: 'Enter amount',
    NOT_ENOUGH_KRC20_FOR_TX: 'Insufficient {{SYMBOL}} Balance',
    APPROVE: 'Approve',
    APPROVE_NOTE: 'Approving will NOT cost you any token.',
    APPROVE_ERROR: 'Error approving your tokens, please try again later.',
    PRICE_IMPACT: 'Price impact',
    SLIPPAGE_ERROR: 'Invalid slippage tolerance',
    DEADLINE_ERROR: 'Invalid transaction deadline',
    SEARCH_FOR_TOKEN: 'Search for token',
    ORDER_HISTORY: 'My orders',
    ADD_LIQUIDITY: 'Liquidity',
    TRADE: 'Trade',
    ORDER_TYPE_BUY: 'Buy',
    ORDER_TYPE_SELL: 'Sell',
    BUY_AT: 'Buy at',
    SELL_AT: 'Sell at',
    PAIR: 'Pair',
    PRICE: 'Price',
    AMOUNT: 'Amount',
    // Referral key
    REFERRAL_CODE: 'Referral Code',
    REFERRAL_CODE_TITLE: 'Referral',
    REFERRAL_CODE_DESCRIPTION: 'Paste your code here',
    REFERRAL_CODE_PLACEHOLDER: 'Referral Code',
    REFERRAL_CODE_NOTE: 'Be careful. This referral code can NOT be changed in the future.',
    // DApp
    DAPP: 'DApps',
    SEARCH_DAPP_PLACEHOLDER: 'Search or enter DApp URL',
    DAPP_ERROR: 'Error confirming your transaction. Please try again later or contact admin for support.'
  },
};
