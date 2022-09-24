import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import React, {createRef} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import styles from './styles';
import {BottomSheet, Header} from '../../components/common';
import {SettingIcon} from '../../assets/icons';
import {useAppDispatch, useAppSelector} from '../../hooks/useRedux';
import {
  getBase58Address,
  getEncryptedWalletInfo,
  resetWallet,
} from '../../redux/reducers/wallet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {AddressBar} from '../../components';

type Props = NativeStackScreenProps<TabParamList, 'Wallet'>;

const Wallet = ({navigation}: Props) => {
  const bottomSheetRef = createRef<RBSheet>();
  const dispatch = useAppDispatch();
  const {mnemonic, privateKey} = useAppSelector(getEncryptedWalletInfo);
  const address = useAppSelector(getBase58Address);
  const height = privateKey ? 130 : 180;
  return (
    <View style={styles.backgroundStyle}>
      <Header
        title="Wallet"
        other={
          <View style={styles.moreOptions}>
            <BottomSheet ref={bottomSheetRef} height={height}>
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
                          onPress: () => dispatch(resetWallet()),
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
      <AddressBar address={address} />
    </View>
  );
};

export default Wallet;
