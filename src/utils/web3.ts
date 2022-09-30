import crypto from 'crypto';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {Buffer} from 'buffer';
import aesjs from 'aes-js';
import {derivePath} from 'ed25519-hd-key';
import * as splToken from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {Platform} from 'react-native';
import nacl from 'tweetnacl';
import {decodeUTF8} from 'tweetnacl-util';

const rpcUrl = clusterApiUrl('devnet');

const host = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

const network = `http://${host}:8899`;
const connection = new Connection(
  // rpcUrl,
  // network,
  'https://metaplex.devnet.rpcpool.com/',
  'confirmed',
);

const deriveSeed = (seed: Buffer) => {
  const path44Change = "m/44'/501'/0'/0'";
  return derivePath(path44Change, Buffer.from(seed.toString('hex')).toString())
    .key;
};

class Bip39 {
  static generateMnemonic(strength: number): string {
    return bip39.generateMnemonic(strength);
  }

  static mnemonicToSeed(mnemonic: string, password: string): Promise<Buffer> {
    return bip39.mnemonicToSeed(mnemonic, password);
  }

  static mnemonicToEntropy(mnemonic: string): string {
    return bip39.mnemonicToEntropy(mnemonic);
  }

  static entropyToMnemonic(entropy: string): string {
    return bip39.entropyToMnemonic(entropy);
  }

  static validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic);
  }

  static validatePrivateKey(privateKey: string) {
    try {
      Keypair.fromSecretKey(Uint8Array.from(bs58.decode(privateKey)));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

class Cryptography {
  static encrypt(data: any, password: string) {
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    const dataBytes = aesjs.utils.utf8.toBytes(data);
    const key = Buffer.from(passwordHash, 'hex');
    const iv = crypto.randomBytes(16);
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const encryptedBytes = aesCbc.encrypt(aesjs.padding.pkcs7.pad(dataBytes));
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return iv.toString('hex') + ':' + encryptedHex;
  }
  static decrypt(data: any, password: string) {
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');
    let dataParts = data.split(':');
    const encryptedHex = dataParts[1];
    let iv = Buffer.from(dataParts.shift(), 'hex');
    const key = Buffer.from(passwordHash, 'hex');
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const decryptedBytes = aesCbc.decrypt(encryptedBytes);
    const decrypted = aesjs.utils.utf8.fromBytes(
      aesjs.padding.pkcs7.strip(decryptedBytes),
    );

    return decrypted;
  }
  static hash(data: any) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

class Mnemonic {
  static encryptMnemonic(mnemonic: string, passcode: string) {
    const walletInfo = {
      mnemonic,
    };
    const encryptedMnemonic = Cryptography.encrypt(
      Buffer.from(JSON.stringify(walletInfo), 'utf8'),
      passcode,
    );

    return encryptedMnemonic;
  }

  static decryptMnemonic(encryptedMnemonic: string, passcode: string) {
    const decryptedMnemonic = Cryptography.decrypt(encryptedMnemonic, passcode);
    const walletInfo = {
      mnemonic: decryptedMnemonic,
    };
    return walletInfo;
  }

  static restoreWalletFromMnemonic(mnemonic: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const derivedSeed = deriveSeed(seed);
    const wallet = Keypair.fromSeed(
      Uint8Array.from(Buffer.from(derivedSeed)).slice(0, 32),
    );
    return wallet;
  }
}

class PrivateKey {
  static encryptPrivateKey(privateKey: string, passcode: string) {
    const walletInfo = {
      privateKey,
    };
    const encryptedPrivateKey = Cryptography.encrypt(
      Buffer.from(JSON.stringify(walletInfo), 'utf8'),
      passcode,
    );
    return encryptedPrivateKey;
  }

  static decryptPrivateKey(encryptedPrivateKey: string, passcode: string) {
    const decryptedPrivateKey = Cryptography.decrypt(
      encryptedPrivateKey,
      passcode,
    );
    const walletInfo = {
      privateKey: decryptedPrivateKey,
    };
    return walletInfo;
  }

  static restoreWalletFromPrivateKey(privateKey: string) {
    const wallet = Keypair.fromSecretKey(
      Uint8Array.from(bs58.decode(privateKey)),
    );
    return wallet;
  }
}

class Seed {
  static restoreWalletFromSeed(seed: Buffer) {
    const derivedSeed = deriveSeed(seed);
    const wallet = Keypair.fromSeed(
      Uint8Array.from(Buffer.from(derivedSeed)).slice(0, 32),
    );
    return {wallet, derivedSeed};
  }
}

class Solana {
  wallet: Wallet;
  provider: anchor.AnchorProvider;

  constructor(payer: Keypair) {
    this.wallet = new Wallet(payer);
    this.provider = new anchor.AnchorProvider(connection, this.wallet, {
      commitment: 'confirmed',
    });
  }

  // create associated token account
  async createAssociatedTokenAccount(payer: Keypair, mint: PublicKey) {
    return await splToken.createAssociatedTokenAccount(
      this.provider.connection,
      payer,
      mint,
      payer.publicKey,
    );
  }

  // get all token accounts parsed account info and public key
  async getParsedTokenAccountsPublicKeysByOwnerForMint(mint: PublicKey) {
    const tokenAccounts =
      await this.provider.connection.getParsedTokenAccountsByOwner(
        this.wallet.publicKey,
        {
          mint,
        },
      );
    if (tokenAccounts.value.length === 0) {
      return [];
    }
    const tokenAccountsPublicKeys = tokenAccounts.value.map(
      account => account.pubkey,
    );
    return tokenAccountsPublicKeys;
  }

  // use getParsedTokenAccountsByOwner to get token accounts public keys & get first token account balance
  async getTokenBalancesAndAccountPublicKeys(mint: PublicKey): Promise<
    {
      balance: anchor.web3.TokenAmount;
      accountPublicKey: PublicKey;
    }[]
  > {
    const tokenAccountsPublicKeys =
      await this.getParsedTokenAccountsPublicKeysByOwnerForMint(mint);
    let tokenBalancesAndAccountPublicKeys = [];
    for (let i = 0; i < tokenAccountsPublicKeys.length; i++) {
      const tokenAccount = await connection.getTokenAccountBalance(
        tokenAccountsPublicKeys[i],
      );
      tokenBalancesAndAccountPublicKeys.push({
        balance: tokenAccount.value,
        accountPublicKey: tokenAccountsPublicKeys[i],
      });
    }
    return tokenBalancesAndAccountPublicKeys;
  }

  async getAllTokenAccounts() {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      this.wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      },
    );
    if (tokenAccounts.value.length === 0) {
      return [];
    }
    return tokenAccounts.value;
  }

  async getAllSignatures(): Promise<anchor.web3.ConfirmedSignatureInfo[]> {
    return await connection.getSignaturesForAddress(this.wallet.publicKey);
  }

  async getTransaction(signature: string) {
    return await connection.getTransaction(signature);
  }

  async getAllTransactions(): Promise<anchor.web3.TransactionResponse[]> {
    const signatures = await connection.getSignaturesForAddress(
      this.wallet.publicKey,
    );
    const transactions: anchor.web3.TransactionResponse[] = [];
    for (let i = 0; i < signatures.length; i++) {
      const transaction = (await connection.getTransaction(
        signatures[i].signature,
      )) as anchor.web3.TransactionResponse;
      transactions.push(transaction);
    }
    return transactions;
  }

  async getEstimateFee(receiver: PublicKey, amount: number) {
    const recentBlockhash = await connection.getLatestBlockhash();
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: this.wallet.publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: this.wallet.publicKey,
        toPubkey: receiver,
        lamports: amount,
      }),
    );
    transaction.sign(this.wallet.payer);
    return (
      (await connection.getFeeForMessage(transaction.compileMessage())).value /
      LAMPORTS_PER_SOL
    );
  }

  async transferToken(
    mint: PublicKey,
    receiver: PublicKey,
    amount: number,
    decimal: number,
  ) {
    let payerTokenAccount = await connection.getParsedTokenAccountsByOwner(
      this.wallet.publicKey,
      {mint},
    );
    let receiverTokenAccount = await connection.getParsedTokenAccountsByOwner(
      receiver,
      {
        mint,
      },
    );
    if (payerTokenAccount.value.length === 0) {
      throw new Error('No token account found for payer');
    }
    if (receiverTokenAccount.value.length === 0) {
      throw new Error('No token account found for receiver');
    }
    return await splToken.transferChecked(
      connection, // connection
      this.wallet.payer, // payer
      payerTokenAccount.value[0].pubkey, // from (should be a token account)
      mint, // mint
      receiverTokenAccount.value[0].pubkey, // to (should be a token account)
      this.wallet.payer, // from's owner
      amount * 10 ** decimal, // amount
      decimal, // decimal
    );
  }

  static async getTimestamp(slot: number) {
    return connection.getBlockTime(slot);
  }

  static async getBalance(publicKey: PublicKey) {
    return (await connection.getBalance(publicKey)) / LAMPORTS_PER_SOL;
  }

  static async requestAirdrop(publicKey: PublicKey, amount: number) {
    const airdropSignature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL,
    );
    await connection.confirmTransaction(airdropSignature);
    return airdropSignature;
  }
}

class Wallet {
  payer: Keypair;

  constructor(payer: Keypair) {
    this.payer = payer;
  }

  async signTransaction(transaction: Transaction) {
    transaction.partialSign(this.payer);
    return transaction;
  }

  async signAllTransactions(transactions: Transaction[]) {
    return transactions.map(tx => {
      tx.partialSign(this.payer);
      return tx;
    });
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    const messageBytes = decodeUTF8(message.toString());
    return await nacl.sign.detached(messageBytes, this.payer.secretKey);
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

export {
  Bip39,
  Cryptography,
  Mnemonic,
  PrivateKey,
  Seed,
  Solana,
  Wallet,
  deriveSeed,
  network,
  connection,
  rpcUrl,
};
