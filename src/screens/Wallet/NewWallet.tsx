import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import Clipboard from '@react-native-clipboard/clipboard';
import SimpleToast from 'react-native-simple-toast';

import {newWalletStyles as styles} from './styles';
import {Button, Header} from '../../components/common';
import {ErrorIcon} from '../../assets/icons';
import {Bip39} from '../../utils/web3';

const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

type Props = NativeStackScreenProps<RootStackParamList, 'NewWallet'>;

const Word = ({word}: {word: string}) => {
  return (
    <View style={styles.wordView}>
      <Text style={styles.word}>{word}</Text>
    </View>
  );
};

const NewWallet = ({navigation}: Props) => {
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  let mnemonicWords = generatedMnemonic?.split(' ');
  // const generatedMnemonic =
  //   'dad abstract amount patrol fall three similar day avocado gown require public';
  // const mnemonicWords = [
  //   'dad',
  //   'abstract',
  //   'amount',
  //   'patrol',
  //   'fall',
  //   'three',
  //   'similar',
  //   'day',
  //   'avocado',
  //   'gown',
  //   'require',
  //   'public',
  // ];
  useEffect(() => {
    setGeneratedMnemonic(Bip39.generateMnemonic(128));
  }, []);
  const copyToClipboard = (mnemonic: string) => {
    Clipboard.setString(mnemonic);
    SimpleToast.show('Mnemonic copied to clipboard');
  };
  return (
    <View style={styles.backgroundStyle}>
      <Header title="New Wallet" onBackPress={() => navigation.goBack()} />
      <Text style={styles.header}>Your Mnemonic</Text>
      <Text style={styles.info}>
        Write down the Mnemonic words in order. Save it properly.
      </Text>
      <View style={styles.errorView}>
        <Image source={ErrorIcon} style={styles.errorIcon} />
        <Text style={styles.error}>Do not divulge to third parties.</Text>
      </View>
      <View style={styles.mnemonicView}>
        <Text style={styles.mnemonicHeader}>Mnemonic Words</Text>
        <View style={styles.words}>
          {mnemonicWords?.map((word, index) => (
            <Word key={index} word={word} />
          ))}
        </View>
      </View>
      <View style={styles.buttonView}>
        <Button
          title="Copy"
          onButtonPress={() => copyToClipboard(generatedMnemonic)}
        />
        <Button
          title="Next"
          onButtonPress={() =>
            navigation.navigate({
              name: 'MnemonicVerification',
              params: {
                mnemonicWords,
                generatedMnemonic,
                shuffledMnemonic: shuffle([...mnemonicWords]),
              },
            })
          }
        />
      </View>
    </View>
  );
};

export default NewWallet;
