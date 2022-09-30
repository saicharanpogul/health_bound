import {
  NftWithToken,
  SftWithToken,
  UploadMetadataInput,
} from '@metaplex-foundation/js';
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {Keypair, PublicKey} from '@solana/web3.js';
import SimpleToast from 'react-native-simple-toast';
import {wait} from '../../utils';
import {
  createHBT,
  createSBT,
  getHBTsFromTokenAccount,
  getMetaplexOffChainData,
  getMetaplexOnChainData,
  getSBTFromTokenAccount,
  getTokenAccounts,
} from '../../utils/metaplex';

import {Cryptography, Mnemonic, PrivateKey, Solana} from '../../utils/web3';
import {RootState} from '../store';

const getWallet = (
  walletType: any,
  encryptedWalletInfo: any,
  hashedPasscode: string,
  passcode: string,
) => {
  let wallet: Keypair = new Keypair();
  const _hashedPasscode = Cryptography.hash(passcode);
  if (_hashedPasscode !== hashedPasscode) {
    SimpleToast.show('Incorrect Passcode');
    throw new Error('Incorrect Passcode.');
  }
  if (walletType === 'mnemonic') {
    const encryptedMnemonic = encryptedWalletInfo.mnemonic;
    const {mnemonic} = Mnemonic.decryptMnemonic(
      encryptedMnemonic,
      hashedPasscode,
    );
    wallet = Mnemonic.restoreWalletFromMnemonic(mnemonic);
  } else if (walletType === 'privateKey') {
    const encryptedPrivateKey = encryptedWalletInfo.privateKey;
    const {privateKey} = PrivateKey.decryptPrivateKey(
      encryptedPrivateKey,
      hashedPasscode,
    );
    wallet = PrivateKey.restoreWalletFromPrivateKey(privateKey);
  }
  return wallet;
};

export interface WalletState {
  isPasscodeSet: boolean;
  hashedPasscode: string;
  walletType: 'mnemonic' | 'privateKey';
  encryptedWalletInfo: {
    mnemonic: string;
    privateKey: string;
  };
  publicKey: Object;
  base58Address: string;
  privateKey: string;
  solBalance: string;
  sbt: {
    onChain: SftWithToken | NftWithToken;
    offChain: UploadMetadataInput;
  } | null;
  hbts:
    | {
        onChain: SftWithToken | NftWithToken;
        offChain: UploadMetadataInput;
      }[]
    | null;
  loading: boolean;
  error: string;
}

const initialState: WalletState = {
  isPasscodeSet: false,
  hashedPasscode: '',
  walletType: 'mnemonic',
  encryptedWalletInfo: {
    mnemonic: '',
    privateKey: '',
  },
  publicKey: {},
  base58Address: '',
  privateKey: '',
  solBalance: '',
  sbt: null,
  hbts: null,
  loading: false,
  error: '',
};

export const setSolBalance = createAsyncThunk(
  'wallet/setSolBalance',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const balance = await Solana.getBalance(
      new PublicKey(state.wallet.base58Address),
    );
    return {balance};
  },
);

export const requestAirdrop = createAsyncThunk(
  'wallet/requestAirdrop',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const signature = await Solana.requestAirdrop(
      new PublicKey(state.wallet.base58Address),
      2,
    );
    const balance = await Solana.getBalance(
      new PublicKey(state.wallet.base58Address),
    );
    console.log('Airdrop Signature: ', signature);
    return {balance};
  },
);

export const createSBTAction = createAsyncThunk(
  'profile/createSBTAction',
  async (
    {
      fullName,
      passcode,
      callback,
    }: {fullName: string; passcode: string; callback: () => void},
    thunkAPI,
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const wallet = getWallet(
        state.wallet.walletType,
        state.wallet.encryptedWalletInfo,
        state.wallet.hashedPasscode,
        passcode,
      );
      if (wallet) {
        if (fullName === 'Unnamed') {
          SimpleToast.show('Please update your name.');
          return thunkAPI.rejectWithValue('Please update you name.');
        }
        const {signature, tokenATA, metadataPDA} = await createSBT(
          fullName,
          wallet as Keypair,
        );
        console.log('Signature: ', signature);
        console.log('TokenATA: ', tokenATA);
        console.log('MetadataPDA: ', metadataPDA);
        await wait(5000);
        const tokenAccounts = await getTokenAccounts(wallet.publicKey);
        const nft = (await getSBTFromTokenAccount(tokenAccounts.value)) as
          | NftWithToken
          | SftWithToken;
        // console.log('Metaplex:', nft);
        const metadata = await getMetaplexOffChainData(nft.uri);
        // console.log('Metadata', metadata);
        callback();
        return {onChain: nft, offChain: metadata};
      } else {
        SimpleToast.show('Something went wrong.');
        return thunkAPI.rejectWithValue('Something went wrong.');
      }
    } catch (error) {
      console.log('Error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getSBTAction = createAsyncThunk(
  'wallet/getSBTAction',
  async (publicKey: PublicKey, thunkAPI) => {
    try {
      const tokenAccounts = await getTokenAccounts(publicKey);
      const nft = (await getSBTFromTokenAccount(tokenAccounts.value)) as
        | NftWithToken
        | SftWithToken;
      // console.log('Metaplex:', nft);
      const metadata = await getMetaplexOffChainData(nft.uri);
      // console.log('Metadata', metadata);
      return {onChain: nft, offChain: metadata};
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const createHBTAction = createAsyncThunk(
  'profile/createHBTAction',
  async (
    {
      fullName,
      steps,
      distance,
      date,
      passcode,
      callback,
    }: {
      fullName: string;
      steps: number;
      distance: number;
      date: number;
      passcode: string;
      callback: () => void;
    },
    thunkAPI,
  ) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const wallet = getWallet(
        state.wallet.walletType,
        state.wallet.encryptedWalletInfo,
        state.wallet.hashedPasscode,
        passcode,
      );
      if (wallet) {
        if (fullName === 'Unnamed') {
          SimpleToast.show('Please update your name.');
          return thunkAPI.rejectWithValue('Please update you name.');
        }
        if (!state.wallet.sbt) {
          SimpleToast.show('No Soul-bound token found.');
          return thunkAPI.rejectWithValue('No Soul-bound token found.');
        }
        const {signature, tokenATA, metadataPDA} = await createHBT(
          steps,
          distance,
          date,
          fullName,
          wallet as Keypair,
        );
        console.log('Signature: ', signature);
        console.log('TokenATA: ', tokenATA);
        console.log('MetadataPDA: ', metadataPDA);
        await wait(5000);
        const {nft} = await getMetaplexOnChainData(wallet.publicKey);
        // console.log('Metaplex:', nft);
        const metadata = await getMetaplexOffChainData(nft.uri);
        // console.log('Metadata', metadata);
        callback();
        return {onChain: nft, offChain: metadata};
      } else {
        SimpleToast.show('Something went wrong.');
        return thunkAPI.rejectWithValue('Something went wrong.');
      }
    } catch (error) {
      console.log('Error', error);
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const getHBTsAction = createAsyncThunk(
  'wallet/getHBTsAction',
  async (publicKey: PublicKey, thunkAPI) => {
    try {
      const tokenAccounts = await getTokenAccounts(publicKey);
      const nfts = (await getHBTsFromTokenAccount(tokenAccounts.value)) as (
        | NftWithToken
        | SftWithToken
      )[];
      const hbts: {
        onChain: SftWithToken | NftWithToken;
        offChain: UploadMetadataInput;
      }[] = [];
      for await (const nft of nfts) {
        const metadata = await getMetaplexOffChainData(nft.uri);
        hbts.push({
          onChain: nft,
          offChain: metadata,
        });
      }
      return hbts;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWallet: () => {
      return initialState;
    },
    setPasscode: (
      state,
      {
        payload,
      }: PayloadAction<{
        passcode: string;
      }>,
    ) => {
      state.hashedPasscode = Cryptography.hash(payload.passcode);
      state.isPasscodeSet = true;
    },
    setEncryptedWalletInfo: (
      state,
      {
        payload,
      }: PayloadAction<{
        hashedPasscode: string;
        mnemonic?: string;
        privateKey?: string;
      }>,
    ) => {
      const {hashedPasscode, mnemonic, privateKey} = payload;
      if (mnemonic) {
        const walletInfo = Mnemonic.restoreWalletFromMnemonic(mnemonic);
        state.walletType = 'mnemonic';
        state.encryptedWalletInfo.mnemonic = Cryptography.encrypt(
          mnemonic,
          hashedPasscode,
        );
        state.base58Address = walletInfo.publicKey.toBase58();
        state.publicKey = walletInfo.publicKey;
      } else if (privateKey) {
        const walletInfo = PrivateKey.restoreWalletFromPrivateKey(privateKey);
        state.walletType = 'privateKey';
        state.encryptedWalletInfo.privateKey = Cryptography.encrypt(
          privateKey,
          hashedPasscode,
        );
        state.base58Address = walletInfo.publicKey.toBase58();
        state.publicKey = walletInfo.publicKey;
      }
    },
  },
  extraReducers: builder => {
    // setSolBalance
    builder
      .addCase(setSolBalance.pending, state => {
        state.loading = true;
      })
      .addCase(setSolBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.solBalance = action.payload.balance.toString();
      })
      .addCase(setSolBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('ERR:', action.error.message);
      });
    // requestAirdrop
    builder
      .addCase(requestAirdrop.pending, state => {
        state.loading = true;
      })
      .addCase(requestAirdrop.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.solBalance = action.payload.balance.toString();
      })
      .addCase(requestAirdrop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('ERR:', action.error.message);
      });
    // createSBTAction
    builder
      .addCase(createSBTAction.pending, state => {
        state.loading = true;
      })
      .addCase(createSBTAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.sbt = action.payload;
      })
      .addCase(createSBTAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('createSBTAction:', action.error.message);
      });
    // getSBTAction
    builder
      .addCase(getSBTAction.pending, state => {
        state.loading = true;
      })
      .addCase(getSBTAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.sbt = action.payload;
      })
      .addCase(getSBTAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('getSBTAction:', action.error.message);
      });
    // createHBTAction
    builder
      .addCase(createHBTAction.pending, state => {
        state.loading = true;
      })
      .addCase(createHBTAction.fulfilled, state => {
        state.loading = false;
        state.error = '';
      })
      .addCase(createHBTAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('createHBTAction:', action.error.message);
      });
    // getHBTsAction
    builder
      .addCase(getHBTsAction.pending, state => {
        state.loading = true;
      })
      .addCase(getHBTsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = '';
        state.hbts = action.payload;
      })
      .addCase(getHBTsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
        console.log('getHBTsAction:', action.error.message);
      });
  },
});

export const {resetWallet, setPasscode, setEncryptedWalletInfo} =
  walletSlice.actions;

export const getIsPasscodeSet = (state: RootState) =>
  state.wallet.isPasscodeSet;
export const getHashedPasscode = (state: RootState) =>
  state.wallet.hashedPasscode;
export const getWalletType = (state: RootState) => state.wallet.walletType;
export const getEncryptedWalletInfo = (state: RootState) =>
  state.wallet.encryptedWalletInfo;
export const getPublicKey = (state: RootState) => state.wallet.publicKey;
export const getBase58Address = (state: RootState) =>
  state.wallet.base58Address;
export const getPrivateKey = (state: RootState) => state.wallet.privateKey;
export const getSolBalance = (state: RootState) => state.wallet.solBalance;
export const getSBT = (state: RootState) => state.wallet.sbt;
export const getHBTs = (state: RootState) => state.wallet.hbts;
export const getWalletLoading = (state: RootState) => state.wallet.loading;
export const getWalletError = (state: RootState) => state.wallet.error;

export default walletSlice.reducer;
