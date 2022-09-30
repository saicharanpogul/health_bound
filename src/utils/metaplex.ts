import {
  Transaction,
  SystemProgram,
  Keypair,
  PublicKey,
  AccountInfo,
  ParsedAccountData,
} from '@solana/web3.js';
import {
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToCheckedInstruction,
  createFreezeAccountInstruction,
} from '@solana/spl-token';
import {
  DataV2,
  createCreateMetadataAccountV2Instruction,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  bundlrStorage,
  findMetadataPda,
  walletAdapterIdentity,
  Metaplex,
  UploadMetadataInput,
  SftWithToken,
  NftWithToken,
} from '@metaplex-foundation/js';
import {connection, rpcUrl, Wallet} from './web3';
import {truncateAddress} from '.';
import axios from 'axios';

const metaplex = Metaplex.make(connection).use(
  bundlrStorage({
    address: 'https://devnet.bundlr.network',
    providerUrl: rpcUrl,
    timeout: 60000,
  }),
);

const MINT_CONFIG = {
  numDecimals: 0,
  numberTokens: 1,
};

const generateHBTMetadata = (
  steps: number,
  distance: number,
  date: number,
  name: string,
): UploadMetadataInput => {
  return {
    name: `HBT #${date}:1`,
    description:
      "Health-bound token(HBT) is a non-transferable token representing a person's walking stats.",
    image: `https://saicharanpogul.xyz/api/healthbound/hbt/?steps=${steps}&distance=${distance}&name=${name}&date=${date}&face=front&filetype=png`,
    // back: `https://saicharanpogul.xyz/api/healthbound/hbt/?calories=${calories}&name=${name}&face=back&filetype=png`,
    symbol: 'HBT1',
    attributes: [
      {
        trait_type: 'steps',
        value: String(steps),
      },
      {
        trait_type: 'distance',
        value: String(distance),
      },
      {
        trait_type: 'date',
        value: String(date),
      },
      {
        trait_type: 'name',
        value: name,
      },
    ],
  };
};

const generateSBTMetadata = (
  soul: string,
  address: string,
): UploadMetadataInput => {
  return {
    name: 'Health Bound Token',
    description:
      "Health-bound Token is a non-transferable token representing a person's associated Soul-bound Token in Health Bound.",
    image: `https://saicharanpogul.xyz/api/healthbound/sbt/?soul=${soul.replace(
      ' ',
      '%20',
    )}&address=${truncateAddress(address)}&filetype=png`,
    symbol: 'HBT',
    attributes: [
      {
        trait_type: 'soul',
        value: soul,
      },
      {
        trait_type: 'address',
        value: address,
      },
    ],
  };
};

export const createHBT = async (
  steps: number,
  distance: number,
  date: number,
  name: string,
  payer: Keypair,
) => {
  const wallet = new Wallet(payer);

  const TOKEN_METADATA = generateHBTMetadata(steps, distance, date, name);
  const ON_CHAIN_METADATA: DataV2 = {
    name: String(TOKEN_METADATA.name),
    symbol: String(TOKEN_METADATA.symbol),
    uri: '', // update later
    sellerFeeBasisPoints: 0,
    creators: [
      {
        address: wallet.publicKey,
        verified: true,
        share: 100,
      },
    ],
    collection: null, // { verified: boolean; key: web3.PublicKey; }
    uses: null, // { useMethod: { Burn = 0, Multiple = 1, Single = 2 }; remaining: BN; total: BN; }
  };

  metaplex.use(walletAdapterIdentity(wallet));

  const {uri} = await metaplex.nfts().uploadMetadata(TOKEN_METADATA).run();
  ON_CHAIN_METADATA.uri = uri;

  // mint address
  const mintKeypair = Keypair.generate();

  const {transaction, tokenATA, metadataPDA} = await createMintTransaction(
    wallet,
    mintKeypair,
    wallet.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    ON_CHAIN_METADATA,
  );

  const signature = await connection.sendTransaction(transaction, [
    payer,
    mintKeypair,
  ]);

  return {
    signature,
    tokenATA,
    metadataPDA,
  };
};

export const createSBT = async (name: string, payer: Keypair) => {
  const wallet = new Wallet(payer);
  const TOKEN_METADATA = generateSBTMetadata(name, wallet.publicKey.toBase58());
  const ON_CHAIN_METADATA: DataV2 = {
    name: String(TOKEN_METADATA.name),
    symbol: String(TOKEN_METADATA.symbol),
    uri: '', // update later
    sellerFeeBasisPoints: 500,
    creators: [
      {
        address: wallet.publicKey,
        verified: true,
        share: 100,
      },
    ],
    collection: null, // { verified: boolean; key: web3.PublicKey; }
    uses: null, // { useMethod: { Burn = 0, Multiple = 1, Single = 2 }; remaining: BN; total: BN; }
  };
  metaplex.use(walletAdapterIdentity(wallet));
  const {uri} = await metaplex.nfts().uploadMetadata(TOKEN_METADATA).run();
  ON_CHAIN_METADATA.uri = uri;

  // mint address
  const mintKeypair = Keypair.generate();

  const {transaction, tokenATA, metadataPDA} = await createMintTransaction(
    wallet,
    mintKeypair,
    wallet.publicKey,
    wallet.publicKey,
    wallet.publicKey,
    ON_CHAIN_METADATA,
  );

  const signature = await connection.sendTransaction(transaction, [
    payer,
    mintKeypair,
  ]);

  return {
    signature,
    tokenATA,
    metadataPDA,
  };
};

const createMintTransaction = async (
  payer: Wallet,
  mintKeypair: Keypair,
  destinationWallet: PublicKey,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey,
  onChainMetadata: DataV2,
) => {
  // Get the minimum lamport balance to create a new account and avoid rent payments
  const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);

  // Metadata account associated with mint
  const metadataPDA = await findMetadataPda(mintKeypair.publicKey);

  // Get associated token account of your wallet
  const tokenATA = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    destinationWallet,
  );

  // Create Transaction
  const transaction = new Transaction();

  // Create Account
  transaction.add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: requiredBalance,
      programId: TOKEN_PROGRAM_ID,
    }),
  );

  // Create Initialize Mint Instruction
  transaction.add(
    createInitializeMintInstruction(
      mintKeypair.publicKey, //Mint Address
      MINT_CONFIG.numDecimals, //Number of Decimals of New mint
      mintAuthority, //Mint Authority
      freezeAuthority, //Freeze Authority
      TOKEN_PROGRAM_ID,
    ),
  );

  // Create Associated TokenAccount Instruction
  transaction.add(
    createAssociatedTokenAccountInstruction(
      payer.publicKey, //Payer
      tokenATA, //Associated token account
      payer.publicKey, //Token account owner
      mintKeypair.publicKey, //Mint
    ),
  );

  // Create Mint To Instruction
  transaction.add(
    createMintToCheckedInstruction(
      mintKeypair.publicKey, //Mint
      tokenATA, //Destination Token Account
      mintAuthority, //Authority
      MINT_CONFIG.numberTokens, //number of tokens
      0, // decimals
    ),
  );

  // Create Metadata Account V2 Instruction
  transaction.add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: mintKeypair.publicKey,
        mintAuthority: mintAuthority,
        payer: payer.publicKey,
        updateAuthority: mintAuthority,
      },
      {
        createMetadataAccountArgsV2: {
          data: onChainMetadata,
          isMutable: true,
        },
      },
    ),
  );

  // freeze token account
  transaction.add(
    createFreezeAccountInstruction(
      tokenATA,
      mintKeypair.publicKey,
      payer.publicKey,
    ),
  );

  return {transaction, tokenATA, metadataPDA};
};

export const getTokenAccounts = async (publicKey: PublicKey) => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {programId: TOKEN_PROGRAM_ID},
    );
    if (tokenAccounts.value.length === 0) {
      throw new Error('No token accounts found.');
    }
    return tokenAccounts;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMetaplexOnChainData = async (
  publicKey: PublicKey,
  tokenATA?: PublicKey,
) => {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {programId: TOKEN_PROGRAM_ID},
    );
    if (tokenAccounts.value.length === 0) {
      throw new Error('No token accounts found.');
    }
    const nft = await metaplex
      .nfts()
      .findByToken({
        token: tokenATA
          ? tokenATA
          : tokenAccounts.value[tokenAccounts.value.length - 1].pubkey,
      })
      .run();
    return {nft};
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getMetaplexOffChainData = async (
  uri: string,
): Promise<UploadMetadataInput> => {
  try {
    return (await (
      await axios.get(uri)
    ).data) as UploadMetadataInput;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSBTFromTokenAccount = async (
  tokenAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }[],
): Promise<SftWithToken | NftWithToken | {}> => {
  try {
    for await (const tokenAccount of tokenAccounts) {
      const nft = await metaplex
        .nfts()
        .findByToken({
          token: tokenAccount.pubkey,
        })
        .run();
      if (nft.symbol === 'HBT') {
        return nft;
      }
    }
    return {};
  } catch (error: any) {
    console.error('getSBTFromTokenAccount', error);
    throw new Error(error);
  }
};

export const getHBTsFromTokenAccount = async (
  tokenAccounts: {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }[],
): Promise<{} | SftWithToken | NftWithToken> => {
  let HBTs: (SftWithToken | NftWithToken)[] = [];
  try {
    for await (const tokenAccount of tokenAccounts) {
      const nft = await metaplex
        .nfts()
        .findByToken({
          token: tokenAccount.pubkey,
        })
        .run();
      if (nft.symbol !== 'HBT') {
        HBTs.push(nft);
      }
    }
    return HBTs;
  } catch (error: any) {
    console.error('getHBTsFromTokenAccount', error);
    throw new Error(error);
  }
};
