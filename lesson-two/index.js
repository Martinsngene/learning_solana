// Import Solana web3 functionalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} = require("@solana/web3.js");

// Making a keypair and getting the private key
const newPair = Keypair.generate();
console.log("Below is what you will paste into your code:\n");
// console.log(newPair.secretKey);

const DEMO_FROM_SECRET_KEY = new Uint8Array(
  // paste your secret key inside this empty array
  // then uncomment transferSol() at the bottom
  [
    57, 118, 105, 163, 231, 142, 33, 215, 202, 216, 134, 61, 57, 213, 103, 200,
    146, 6, 147, 153, 132, 0, 14, 40, 156, 228, 76, 21, 7, 169, 107, 198, 213,
    147, 248, 214, 230, 69, 87, 119, 124, 45, 187, 246, 152, 18, 14, 99, 223,
    120, 169, 67, 3, 40, 168, 220, 247, 90, 55, 37, 140, 159, 99, 231,
  ]
);

const transferSol = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Get Keypair from Secret Key
  let from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

  // (Optional) - Other things you can try:
  // 1) Form array from userSecretKey
  // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
  // 2) Make a new Keypair (starts with 0 SOL)
  // const from = Keypair.generate();

  // Generate another Keypair (account we'll be sending to)
  const to = Keypair.generate();

  // Aidrop 2 SOL to Sender wallet
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
    new PublicKey(from.publicKey),
    2 * LAMPORTS_PER_SOL
  );

  // Latest blockhash (unique identifer of the block) of the cluster
  let latestBlockHash = await connection.getLatestBlockhash();

  // Confirm transaction using the last valid block height (refers to its time)
  // to check for transaction expiration
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: fromAirDropSignature,
  });

  console.log("Airdrop completed for the Sender account\n");

  // Send money from "from" wallet and into "to" wallet
  let transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: LAMPORTS_PER_SOL / 100,
    })
  );

  // Sign transaction
  let signature = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  console.log("Signature is", signature);
};

transferSol();
