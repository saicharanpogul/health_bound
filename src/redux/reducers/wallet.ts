import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Cryptography, Mnemonic, PrivateKey} from '../../utils/web3';
import {RootState} from '../store';

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
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
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
  loading: 'idle',
  error: '',
};

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
  extraReducers: () => {},
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
export const getWalletLoading = (state: RootState) => state.wallet.loading;
export const getWalletError = (state: RootState) => state.wallet.error;

export default walletSlice.reducer;
