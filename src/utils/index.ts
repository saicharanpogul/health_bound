import {web3} from '@project-serum/anchor';
import convert from 'convert-units';

export const truncateAddress = (address: string) => {
  const first4Chars = address.slice(0, 4);
  const last4Chars = address.slice(40, 44);
  return first4Chars + '...' + last4Chars;
};

export const isValidAddress = (address: string) => {
  try {
    return web3.PublicKey.isOnCurve(address);
  } catch (error) {
    return false;
  }
};

export const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

// export const getExplorerLink = (signature: string) => {
//   return `https://explorer.solana.com/tx/${signature}?cluster=${Config.NETWORK}`;
// };

export const mtoFtIn = (m: number | undefined) => {
  if (!m) {
    return '0 ft';
  }
  const ft = convert(m).from('m').to('ft-us');
  // const inches = convert(m).from('m').to('in');
  return `${ft.toFixed(1)} ft`;
};

export const mtoKm = (m: number | undefined) => {
  if (!m) {
    return 0;
  }
  return convert(m).from('m').to('km');
};

export const toURLString = (string: string) => {
  return string.replace(' ', '%20');
};
