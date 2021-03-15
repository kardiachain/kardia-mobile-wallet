export const lang: Language = {
  name: 'US English',
  flag: 'US',
  key: 'en_US',
  dateTimeFormat: 'MMM do yyyy - HH:mm',
  tag: ['en_US', 'US', 'en', 'US English'],
  mapping: {
    // Common key:
    BALANCE: 'Balance',
    STAKED_AMOUNT: 'Staked',
    AGO: 'ago',
    GO_BACK: 'Go back',
    CREATE_NEW_WALLET: 'Create New Wallet',
    IMPORT_WALLET: 'Access Your Wallet',
    WELCOME: 'Welcome to Kardia Wallet',
    GETTING_STARTED_DESCRIPTION:
      'To get started, choose one of the following options',
    SUBMIT: 'Submit',
    REQUIRED_FIELD: 'This field is required.',
    COPY_TO_CLIPBOARD: 'Copy to Clipboard',
    SECOND: 'sec',
    CONFIRM_IMPORT: 'Are you sure you want to import a new wallet?',
    RESTART_APP_DESCRIPTION:
      'Kardia Wallet will now restart to ensure everything works properly.',
    ARE_YOU_SURE: 'Are you sure?',
    SAVE: 'Save',
    CLOSE: 'Close',
    CONFIRM: 'Confirm',
    SCAN_QR_FOR_ADDRESS: 'Your Wallet Address',
    LATER: 'Later',
    SET_APP_PASSCODE: 'Set Passcode',
    NO_PASSCODE: "You haven't set your app passcode yet.",
    PASSCODE_DESCRIPTION:
      "A Passcode helps to increase your wallet's security level.",
    IMPORT_WITH_PRIVATE_KEY: 'Import with Private Key',
    IMPORT_WITH_SEED: 'Import with Seed Phrase',
    SELECT_ADDRESS: 'Select Address',
    NO_SAVED_ADDRESS: 'No Saved Address',
    SAVE_TO_ADDRESS_BOOK: 'Save to address book',
    INVALID_ADDRESS: 'Invalid address',
    TOKEN_EXISTS: 'Token already exists.',
    // Create wallet key:
    SUBMIT_CREATE: 'Understood. Access my wallet now.',
    MNEMONIC_DESCRIPTION:
      'The above 12 words will be used to recover, as well as access, your wallet.',
    // Import wallet key:
    ENTER_SEED_PHRASE: 'Enter your 12-words secret seed phrase.',
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
    // Transaction key
    RECENT_TRANSACTION: 'Recent Transactions',
    NO_TRANSACTION: 'No transaction',
    SEARCH_TRANSACTION_PLACEHOLDER:
      'Search with address / hash / block number...',
    VIEW_ALL_TRANSACTION: 'View All',
    SEND: 'Send',
    RECEIVE: 'Receive',
    TRANSACTION_HASH: 'Transaction Hash',
    TRANSACTION_DETAIL: 'Detail',
    TRANSACTION_AMOUNT: 'Amount',
    TRANSACTION_FEE: 'Transaction Fee',
    FROM: 'From',
    TO: 'To',
    TRANSACTION_DATE: 'Transaction Date',
    CREATE_TX_ADDRESS: 'Send to Address',
    CREATE_KRC20_TX_ADDRESS: 'Send to Address',
    CREATE_TX_KAI_AMOUNT: 'Amount (maximum: 5,000,000,000)',
    CREATE_TX_KRC20_AMOUNT: 'Amount',
    TRANSACTION_SPEED: 'Choose Transaction Speed',
    SLOW_SPEED: 'Slow',
    AVERAGE_SPEED: 'Average',
    FAST_SPEED: 'Fast',
    GAS_PRICE: 'Gas price',
    GAS_LIMIT: 'Gas limit',
    SPEED_DESCRIPTION:
      '* Accelerating a transaction by using a higher gas price increases its chances of getting processed by the network faster but, it is not always guaranteed.',
    CONFIRM_TRANSACTION: 'Confirm your Transaction',
    CONFIRM_KAI_AMOUNT: 'Amount',
    NOT_ENOUGH_KAI_FOR_TX: 'Insufficient Balance',
    // Wallet key
    IMPORT: 'Import',
    WALLET: 'Wallet',
    ADDRESS: 'Address',
    REMOVE_WALLET: 'Remove Wallet',
    // News key
    NEWS_SCREEN_TITLE: 'News',
    // Staking key
    NO_STAKING_ITEM: "You haven't staked for any validator yet.",
    CLAIMABLE: 'Claimable KAI',
    STAKED: 'Staked KAI',
    WITHDRAWABLE: 'Withdrawable KAI',
    UNBONDED: 'Unbonded KAI',
    CLAIM_REWARD: 'Claim',
    UNDELEGATE: 'Undelegate',
    WITHDRAW: 'Withdraw',
    CLAIM_SUCCESS: '{{KAI_AMOUNT}} KAI successfully claimed to your wallet.',
    WITHDRAW_SUCCESS:
      '{{KAI_AMOUNT}} KAI successfully withdrawn to your wallet.',
    UNDELEGATE_SUCCESS:
      '{{KAI_AMOUNT}} KAI is undelegated. You will need to wait 7 days to withdraw {{KAI_AMOUNT}} KAI back to your wallet.',
    UNDELEGATE_AMOUNT_TOO_MUCH: 'Must be less than your staked KAI amount.',
    UNDELEGATE_AMOUNT_REMAIN_1000:
      'You must keep at least 1.000 KAI in staking, or undelegate all KAI.',
    UNDELEGATE_AMOUNT_PLACEHOLDER: 'Amount to Undelegate:',
    YOUR_INVESTMENTS: 'Your Delegated Investments',
    TOTAL_EARNING: 'Your Total Earnings', // Your Total Return?
    INVEST: 'Stake',
    CHOOSE_VALIDATOR: 'Choose Validator to Stake',
    STAKING_AMOUNT: 'Amount to Stake',
    STAKING_AMOUNT_NOT_ENOUGHT: 'Not enough KAI to stake.',
    AT_LEAST_MIN_DELEGATE: 'Must delegate at least {{MIN_KAI}}',
    DELEGATE: 'Delegate',
    ESTIMATED_EARNING: 'Estimated return in 30 days',
    ESTIMATED_APR: 'Estimated APR',
    TOTAL_STAKED_AMOUNT: 'Total Staked Amount',
    COMMISSION_RATE: 'Commission Rate',
    VOTING_POWER: 'Voting Power',
    VALIDATOR_LIST_TITLE: 'Choose a Validator',
    NEW_STAKING_TITLE: 'Stake & Earn',
    SEARCH_VALIDATOR_PLACEHOLDER: 'Search by validator name ...',
    // Notification Key
    NOTIFICATION_SCREEN_TITLE: 'Notification',
    TODAY: 'Today',
    EARLIER: 'Earlier',
    // Setting key
    SETTING_SCREEN_TITLE: 'Setting',
    ADDRESS_BOOK_MENU: 'Address Book',
    LANGUAGE_MENU: 'Language Setting',
    LANGUAGE_SETTING_TITLE: 'Choose Display Language',
    SECRET_PHRASE_MENU: 'Export Secret Credential',
    PASSCODE_MENU: 'App Passcode Setting',
    INFO_MENU: 'About KardiaChain Wallet',
    MNEMONIC_SETTING_TITLE: 'Secret Credential',
    SHOW_SECRET_TEXT: 'Show my Credential',
    ADDRESS_NAME: 'Name',
    ADDRESS_ADDRESS: 'Address',
    PASSCODE_SETTING_TITLE: 'App Passcode',
    PASSCODE_SETTING_TRIGGER: 'Enable App Passcode',
    CHANGE_PASSCODE: 'Change Passcode',
    NEW_PASSCODE: 'Enter New Passcode',
    CONFIRM_PASSCODE: 'Confirm New Passcode',
    CONFIRM_PASSCODE_NOT_MATCH: 'Confirmation passcode does NOT match',
    ENTER_PASSCODE: 'Enter passcode to continue.',
    INCORRECT_PASSCODE: 'Incorrect Passcode',
    // Error boundary key
    ERROR_BOUNDARY_TITLE: 'Oops, Something Went Wrong',
    ERROR_BOUNDARY_DESCRIPTION:
      'The app ran into a problem and could not continue. We apologise for any inconvenience this may have caused. Press the button below to restart the app and sign back in. Please contact us if this issue persists.',
    NOT_ENOUGH_BALANCE:
      'The amount requested exceeds your current wallet balance.',
    GENERAL_ERROR: 'An error occured. Please try again later.',
    // KRC20 key
    KRC20_TOKENS_SECTION_TITLE: 'Your assets',
    ADD_TOKEN: 'Add token',
    TOKEN_ADDRESS: 'Token address',
    SEND_TOKEN: 'Send {{TOKEN_SYMBOL}}',
    RECEIVE_TOKEN: 'Receive {{TOKEN_SYMBOL}}',
    REMOVE_TOKEN: 'Remove token',
  },
};
