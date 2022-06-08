import { useHooks } from "@components/web3";

export const useNetwork = () => {
  return useHooks(hooks => hooks.useNetwork)();
};
