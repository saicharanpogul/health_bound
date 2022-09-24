import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import React from 'react';
import {colors} from '../theme';
import {scale} from 'react-native-size-matters';

type Props = {
  showsVerticalScrollIndicator?: boolean;
  children: React.ReactNode;
  header?: React.ReactElement;
};

const KeyboardAvoidingViewWrapper: React.FC<Props> = ({
  header,
  children,
  showsVerticalScrollIndicator,
}) => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1, backgroundColor: colors.background.main}}>
      {header}
      <ScrollView
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={{
          paddingBottom: scale(50),
          flex: 1,
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewWrapper;
