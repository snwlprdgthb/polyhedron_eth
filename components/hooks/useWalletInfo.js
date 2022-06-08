import { useNetwork } from "@components/hooks/useNetwork";
import { useAccount } from "@components/hooks/useAccount";

export function useWalletInfo() {
  const { account } = useAccount();
  const { network } = useNetwork();

  const isDisabled = !!(account.account && network.isSupported);

  const isConnecting = !!(
    account.hasInitialResponse && network.hasInitialResponse
  );

  return {
    account,
    network,
    isConnecting,
    isDisabled
  };
}
