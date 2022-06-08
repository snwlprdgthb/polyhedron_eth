import { useHooks } from "@components/web3";

export const useOwnedItems = (items, account, network) => {
  return useHooks(hooks => hooks.useOwnedItems)(items, account, network);
};
