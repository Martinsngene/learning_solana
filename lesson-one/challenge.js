// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Extract the private key from the keypair
const privateKey = newPair._keypair.secretKey;

const airDropSol = async () => {
  try {
    // Connect to the Devnet and make a wallet from privateKey
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myWallet = await Keypair.fromSecretKey(privateKey);

    // Request airdrop of 3 SOL to the wallet
    console.log("Airdropping some SOL to my wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(myWallet.publicKey),
      3 * LAMPORTS_PER_SOL
    );

    // Confirm Transaction
    await connection.confirmTransaction(fromAirDropSignature);

    // Get Wallet Balance
    const walletBalance = await connection.getBalance(
      new PublicKey(newPair.publicKey)
    );

    // Print Wallet Balance To Console
    console.log(
      `Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
    );
  } catch (err) {
    console.log(err);
  }
};

airDropSol();
