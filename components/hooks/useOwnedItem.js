import { useHooks } from "@components/web3";

export const useOwnedItem = (item, account) => {
  return useHooks(hooks => hooks.useOwnedItem)(item, account);
};
