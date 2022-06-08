import { useHooks } from "@components/web3";

export const useItems = account => {
  return useHooks(hooks => hooks.useItems)(account);
};
