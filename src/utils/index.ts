export const truncateAddress = (address: string) => {
  const first4Chars = address.slice(0, 4);
  const last4Chars = address.slice(40, 44);
  return first4Chars + '...' + last4Chars;
};

// export const getExplorerLink = (signature: string) => {
//   return `https://explorer.solana.com/tx/${signature}?cluster=${Config.NETWORK}`;
// };
