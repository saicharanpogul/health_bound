import {ScaledSheet} from 'react-native-size-matters';
import {colors, fontFamily, fontSizes} from '../../theme';

export const backupMnemonicStyles = ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    fontSize: fontSizes[5],
    color: colors.text.main,
    textAlign: 'center',
    marginTop: '20@s',
    fontFamily: fontFamily.normal.bold,
  },
  warningView: {
    marginTop: '10@s',
    marginHorizontal: '15@s',
    backgroundColor: colors.warning.dark,
    borderRadius: '6@s',
    padding: '20@s',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  warningIcon: {
    width: '20@s',
    height: '20@s',
    marginRight: '8@s',
  },
  warning: {
    fontSize: fontSizes[1],
    color: colors.warning.main,
    fontFamily: fontFamily.normal.regular,
    width: '80%',
  },
  info: {
    fontSize: fontSizes[2],
    color: colors.text.main,
    marginTop: '20@s',
    fontFamily: fontFamily.normal.regular,
    flexWrap: 'wrap',
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '20@s',
  },
});

export const newWalletStyles = ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    fontSize: fontSizes[5],
    color: colors.text.main,
    textAlign: 'center',
    marginTop: '4@s',
    fontFamily: fontFamily.normal.bold,
  },
  info: {
    fontSize: fontSizes[1],
    color: colors.text.main,
    marginHorizontal: '15@s',
    marginTop: '8@s',
    fontFamily: fontFamily.normal.regular,
  },
  errorView: {
    marginTop: '15@s',
    marginHorizontal: '15@s',
    backgroundColor: colors.error.dark,
    borderRadius: '6@s',
    padding: '18@s',
    flexDirection: 'row',
  },
  errorIcon: {
    width: '18@s',
    height: '18@s',
    marginRight: '8@s',
  },
  error: {
    fontSize: fontSizes[1],
    color: colors.error.main,
    fontFamily: fontFamily.normal.regular,
  },
  mnemonicView: {
    marginTop: '20@s',
    marginHorizontal: '15@s',
    borderColor: colors.background.dark,
    borderRadius: '6@s',
    paddingHorizontal: '2@s',
    paddingVertical: '10@s',
    borderWidth: 2,
  },
  mnemonicHeader: {
    fontSize: fontSizes[1],
    fontFamily: fontFamily.normal.semiBold,
    color: colors.text.main,
    textAlign: 'center',
  },
  words: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'auto',
    flexWrap: 'wrap',
    marginTop: '10@s',
    justifyContent: 'space-around',
  },
  wordView: {
    flexDirection: 'row',
    backgroundColor: '#15171C',
    alignSelf: 'flex-start',
    padding: '10@s',
    borderRadius: '6@s',
    justifyContent: 'center',
    margin: '5@s',
    flexBasis: '30%',
  },
  word: {
    fontSize: fontSizes[1],
    fontFamily: fontFamily.normal.semiBold,
    color: colors.text.main,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '20@s',
  },
});

export const mnemonicVerificationStyles = ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  header: {
    fontSize: fontSizes[5],
    color: colors.text.main,
    textAlign: 'center',
    marginTop: '4@s',
    fontFamily: fontFamily.normal.bold,
  },
  info: {
    fontSize: fontSizes[1],
    color: colors.text.main,
    marginHorizontal: '15@s',
    marginTop: '8@s',
    fontFamily: fontFamily.normal.regular,
  },
  mnemonicView: {
    marginTop: '20@s',
    marginHorizontal: '15@s',
    borderColor: colors.background.light,
    borderRadius: '6@s',
    paddingHorizontal: '2@s',
    paddingVertical: '10@s',
    paddingTop: '-10@s',
    borderWidth: 2,
  },
  emptyMnemonicView: {
    marginTop: '20@s',
    marginHorizontal: '15@s',
    borderColor: colors.background.light,
    borderRadius: '6@s',
    paddingHorizontal: '20@s',
    paddingVertical: '100@s',
    paddingTop: '-10@s',
    borderWidth: 2,
  },
  wordsView: {
    flex: 5,
    justifyContent: 'flex-end',
    marginHorizontal: '15@s',
  },
  words: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'auto',
    flexWrap: 'wrap',
    marginTop: '10@s',
    justifyContent: 'space-around',
  },
  wordView: {
    flexDirection: 'row',
    backgroundColor: '#15171C',
    alignSelf: 'flex-start',
    padding: '10@s',
    borderRadius: '6@s',
    justifyContent: 'center',
    margin: '5@s',
    flexBasis: '30%',
  },
  word: {
    fontSize: fontSizes[1],
    fontFamily: fontFamily.normal.semiBold,
    color: colors.text.main,
  },
  buttonView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '-20@s',
  },
});

export const importWalletStyles = ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  input: {
    height: '120@s',
    backgroundColor: colors.background.light,
    borderRadius: '6@s',
    padding: '20@s',
    marginHorizontal: '10@s',
    marginTop: '20@s',
    fontFamily: fontFamily.normal.regular,
    paddingTop: '15@s',
    color: colors.text.main,
  },
  inputError: {
    color: colors.error.main,
    borderColor: colors.error.main,
    borderWidth: 1,
  },
  errorMessage: {
    color: colors.error.main,
    fontSize: '12@s',
    marginTop: '4@s',
    marginStart: '28@s',
    fontFamily: fontFamily.normal.regular,
  },
});

export const SecurityTipsStyles = ScaledSheet.create({
  background: {
    backgroundColor: colors.background.main,
    flex: 1,
  },
  tips: {
    borderWidth: 1,
    borderColor: colors.primary.main,
    marginHorizontal: '20@s',
    marginVertical: 10,
    borderRadius: 10,
    padding: '20@s',
  },
  header: {
    fontSize: fontSizes[2],
    color: colors.warning.main,
    textAlign: 'center',
    fontFamily: fontFamily.normal.bold,
    marginBottom: '20@s',
  },
  tip: {
    fontSize: fontSizes[1],
    color: colors.text.main,
    fontFamily: fontFamily.normal.semiBold,
    marginVertical: 10,
  },
  buttons: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '20@s',
  },
});

export const ExportMnemonicOrPrivateKeyStyles = ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  backupView: {
    marginTop: '50@s',
    borderWidth: 1,
    borderColor: colors.primary.main,
    marginHorizontal: '20@s',
    marginVertical: '10@s',
    borderRadius: '10@s',
    padding: '20@s',
  },
  header: {
    fontSize: fontSizes[4],
    fontFamily: fontFamily.normal.bold,
    color: colors.text.main,
    textAlign: 'center',
    marginBottom: '10@s',
  },
  info: {
    fontSize: fontSizes[2],
    color: colors.warning.main,
    fontFamily: fontFamily.normal.regular,
    textAlign: 'center',
  },
  privateKeyView: {
    flexDirection: 'row',
    backgroundColor: '#000103',
    padding: '15@s',
    borderRadius: '10@s',
    marginTop: '20@s',
    alignItems: 'center',
  },
  privateKey: {
    fontSize: fontSizes[2],
    color: colors.text.main,
    fontFamily: fontFamily.normal.regular,
    width: '200@s',
  },
  icon: {
    width: '25@s',
    height: '25@s',
    marginStart: '10@s',
  },
});

export default ScaledSheet.create({
  backgroundStyle: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  moreOptions: {
    marginLeft: 'auto',
    marginRight: '16@s',
  },
  more: {
    width: '20@s',
    height: '20@s',
  },
  bottomSheetButton: {
    paddingVertical: '10@s',
  },
  bottomSheetButtonText: {
    color: colors.text.main,
    fontFamily: fontFamily.normal.semiBold,
    textAlign: 'center',
  },
});
