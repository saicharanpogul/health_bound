import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {scale} from 'react-native-size-matters';

import styles from './styles';
import {BottomSheet, Button, Header} from '../../components/common';
import {SettingIcon} from '../../assets/icons';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  createSBTAction,
  getBase58Address,
  getEncryptedWalletInfo,
  getSBT,
  getSBTAction,
  getSolBalance,
  getWalletLoading,
  requestAirdrop,
  resetWallet,
  setSolBalance,
} from '../../redux/reducers/wallet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AddressBar, PasscodeBottomSheet} from '../../components';
import {wait} from '../../utils';
import {getFullName, resetProfile} from '../../redux/reducers/profile';
import {PublicKey} from '@solana/web3.js';
import SimpleToast from 'react-native-simple-toast';

type Props = NativeStackScreenProps<TabParamList, 'Wallet'>;

const Wallet = ({navigation}: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetRef = createRef<RBSheet>();
  const passcodeBottomSheetRef = useRef<RBSheet>();
  const dispatch = useAppDispatch();
  const {mnemonic, privateKey} = useAppSelector(getEncryptedWalletInfo);
  const balance = useAppSelector(getSolBalance);
  const address = useAppSelector(getBase58Address);
  const isWalletLoading = useAppSelector(getWalletLoading);
  const SBT = useAppSelector(getSBT);
  const fullName = useAppSelector(getFullName);
  const height = privateKey ? 130 : 180;

  useEffect(() => {
    dispatch(setSolBalance());
    dispatch(getSBTAction(new PublicKey(address)));
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  return (
    <View style={styles.backgroundStyle}>
      <Header
        title="Wallet"
        other={
          <View style={styles.moreOptions}>
            <BottomSheet
              ref={bottomSheetRef}
              height={height}
              onPress={() => bottomSheetRef.current?.open()}>
              <Image style={styles.more} source={SettingIcon} />
              <View>
                <TouchableOpacity
                  style={styles.bottomSheetButton}
                  onPress={() => {
                    Alert.alert(
                      'Reset Wallet',
                      'Are you sure?',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => bottomSheetRef.current?.close(),
                          style: 'cancel',
                        },
                        {
                          text: 'Reset',
                          onPress: () => {
                            dispatch(resetWallet());
                            dispatch(resetProfile());
                          },
                          style: 'default',
                        },
                      ],
                      {
                        cancelable: false,
                      },
                    );
                  }}>
                  <Text style={styles.bottomSheetButtonText}>Reset</Text>
                </TouchableOpacity>
                {privateKey && (
                  <View>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={() => {
                        navigation.navigate('SecurityTips', {
                          type: 'privateKey',
                        });
                        bottomSheetRef.current?.close();
                      }}>
                      <Text style={styles.bottomSheetButtonText}>
                        Export Private Key
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {mnemonic && (
                  <View>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={() => {
                        navigation.navigate('SecurityTips', {
                          type: 'mnemonic',
                        });
                        bottomSheetRef.current?.close();
                      }}>
                      <Text style={styles.bottomSheetButtonText}>
                        Export Mnemonic
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={() => {
                        navigation.navigate('SecurityTips', {
                          type: 'privateKey',
                        });
                        bottomSheetRef.current?.close();
                      }}>
                      <Text style={styles.bottomSheetButtonText}>
                        Export Private Key
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </BottomSheet>
          </View>
        }
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor="#EEE"
            refreshing={isWalletLoading ? isWalletLoading : refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={styles.balanceView}>
          <View>
            <Text style={styles.balanceTitle}>Your Balance</Text>
            <Text style={styles.balance}>{`${balance ? balance : 0} SOL`}</Text>
          </View>
          <AddressBar address={address} />
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        {!SBT && (
          <Button
            onButtonPress={() => {
              passcodeBottomSheetRef.current?.open();
            }}
            title="Create Soul-bound Token"
            loading={isWalletLoading}
          />
        )}
        <Button
          onButtonPress={() => dispatch(requestAirdrop())}
          title="Airdrop SOL"
          variant="outline"
          style={{
            marginTop: scale(10),
          }}
          loading={isWalletLoading}
        />
      </View>
      <PasscodeBottomSheet
        onSubmit={data => {
          dispatch(
            createSBTAction({
              fullName,
              passcode: data.passcode,
              callback: () => {
                passcodeBottomSheetRef.current?.close();
                wait(1000).then(() => {
                  SimpleToast.show('Successfully minted SBT! 🎉');
                });
              },
            }),
          );
        }}
        title="Create Soul-bound token"
        ref={passcodeBottomSheetRef}
      />
    </View>
  );
};

export default Wallet;
