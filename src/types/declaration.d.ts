declare module '*.png';

type RootStackParamList = {
  Root: TabParamList;
  Welcome: {};
  BackupMnemonicInfo: {};
  NewWallet: {};
  ImportWallet: {};
  MnemonicVerification: {
    mnemonicWords: string[];
    generatedMnemonic: string;
    shuffledMnemonic: string[];
  };
};

type TabParamList = {
  Home: {};
  Profile: {};
  Wallet: {};
  SecurityTips: {
    type: 'mnemonic' | 'privateKey';
  };
  ExportMnemonicOrPrivateKey: {
    type: 'mnemonic' | 'privateKey';
  };
};

type NavigationProps = StackNavigationProp<TabParamList>;

interface ControlFieldValues {
  passcode: string;
  fullName: string;
}
