import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {scale} from 'react-native-size-matters';

import {mnemonicVerificationStyles as styles} from './styles';
import {Button, Header, Input} from '../../components/common';
import SimpleToast from 'react-native-simple-toast';
import {useAppDispatch} from '../../hooks/useRedux';
import {setEncryptedWalletInfo, setPasscode} from '../../redux/reducers/wallet';
import {Cryptography} from '../../utils/web3';
import {KeyboardAvoidingViewWrapper} from '../../components';

const SelectedWord = ({
  word,
  removeWord,
}: {
  word: string;
  removeWord: (word: string) => void;
}) => {
  return (
    <TouchableOpacity style={styles.wordView} onPress={() => removeWord(word)}>
      <Text style={styles.word}>{word}</Text>
    </TouchableOpacity>
  );
};

const Word = ({
  word,
  addWord,
}: {
  word: string;
  addWord: (word: string) => void;
}) => {
  return (
    <TouchableOpacity style={styles.wordView} onPress={() => addWord(word)}>
      <Text style={styles.word}>{word}</Text>
    </TouchableOpacity>
  );
};

type FormProps = {
  passcode: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MnemonicVerification'>;

const MnemonicVerification = ({navigation, route}: Props) => {
  const [localPasscode, setLocalPasscode] = useState('');
  const dispatch = useAppDispatch();
  const {mnemonicWords, generatedMnemonic, shuffledMnemonic} = route.params;
  const [removableWords, setRemovableWords] =
    useState<string[]>(shuffledMnemonic);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const validationSchema = yup.object().shape({
    passcode: yup
      .string()
      .test('len', 'Must be exactly 6 characters', val => val!.length === 6)
      .required('Passcode is required'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
  });

  const addWord = (word: string) => {
    setSelectedWords([...selectedWords, word]);
    setRemovableWords(removableWords.filter(w => w !== word));
  };

  const removeWord = (word: string) => {
    setSelectedWords(selectedWords.filter(w => w !== word));
    setRemovableWords([...removableWords, word]);
  };

  const onVerify = () => {
    if (selectedWords.length === 0) {
      SimpleToast.show('Please select mnemonic words');
      return;
    }
    if (selectedWords.length !== mnemonicWords.length) {
      SimpleToast.show('Please select all mnemonic words');
      return;
    }
    let selectedWordsString: string;
    selectedWordsString = selectedWords.join(' ');
    // console.log('Result', selectedWordsString);
    // console.log(generatedMnemonic);
    if (generatedMnemonic === selectedWordsString) {
      SimpleToast.show('Mnemonic verified successfully');
      // navigation.navigate({
      //   name: 'SetPasscode',
      //   params: {
      //     mnemonic: generatedMnemonic,
      //   },
      // });
      const hashedPasscode = Cryptography.hash(localPasscode);
      dispatch(
        setEncryptedWalletInfo({
          hashedPasscode,
          mnemonic: selectedWordsString,
        }),
      );
      dispatch(
        setPasscode({
          passcode: localPasscode,
        }),
      );
    } else {
      SimpleToast.show('Mnemonic is incorrect');
    }
  };

  const onSubmit = (data: FormProps) => {
    setLocalPasscode(data.passcode);
  };

  return (
    <KeyboardAvoidingViewWrapper
      header={
        <Header
          title="Create New Wallet"
          onBackPress={() => navigation.goBack()}
        />
      }>
      <View style={{flex: 1}}>
        {!localPasscode ? (
          <View style={{marginHorizontal: scale(15), marginTop: scale(40)}}>
            <Input
              control={control}
              name="passcode"
              label="Passcode"
              placeholder="Enter your passcode"
              error={errors.passcode?.message}
              keyboardType="number-pad"
              secureTextEntry
            />
          </View>
        ) : (
          <>
            <Text style={styles.header}>Mnemonic Verification</Text>
            <Text style={styles.info}>
              Please select the correct word in right order from the below list.
            </Text>
            {selectedWords.length > 0 ? (
              <View style={styles.mnemonicView}>
                <View style={styles.words}>
                  {selectedWords.map((word, index) => (
                    <SelectedWord
                      key={index}
                      word={word}
                      removeWord={removeWord}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyMnemonicView} />
            )}
            <View style={styles.wordsView}>
              <View style={styles.words}>
                {removableWords.map((word, index) => (
                  <Word key={index} word={word} addWord={addWord} />
                ))}
              </View>
            </View>
          </>
        )}
        <View style={styles.buttonView}>
          {!localPasscode ? (
            <Button
              title="Set Passcode"
              onButtonPress={handleSubmit(onSubmit)}
            />
          ) : (
            <Button title="Done" onButtonPress={onVerify} />
          )}
        </View>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default MnemonicVerification;
