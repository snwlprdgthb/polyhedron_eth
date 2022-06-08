import { useAccount } from "./useAccount";
import { useWeb3 } from "@components/web3";

export default function useAdmin({ redirectTo }) {
  const { account } = useAccount();
  const { requireInstall } = useWeb3();
  let shouldRedirect = false;

  if (requireInstall || !account.isAdmin) {
    // return router.push(redirectTo);
    // window.location.replace(redirectTo);

    shouldRedirect = true;
  }

  return { account, shouldRedirect, redirectPath: redirectTo };
}
