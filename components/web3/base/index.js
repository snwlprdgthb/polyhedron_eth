import { createContext, useContext, useEffect, useState, useMemo } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "@components/web3/hooks/setupHooks";
import { loadContract } from "@utils/loadContract";

const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  const [Web3api, setWeb3api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isLoading: true,
    requireInstall: true,
    hooks: setupHooks()
  });

  const setListener = provider => {
    provider.on("chainChanged", _ => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3 = new Web3(provider);
        const contract = await loadContract("Marketplace", provider);
        setListener(provider);

        setWeb3api({
          provider,
          web3,
          contract,
          isLoading: false,
          hooks: setupHooks(web3, contract, provider),
          requireInstall: false
        });
      } else {
        setWeb3api(prev => ({
          ...prev,
          isLoading: false
        }));

        console.error("gotta be install metamask");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    return {
      ...Web3api,
      connect: Web3api.provider
        ? async () => {
            try {
              await Web3api.provider.request({
                method: "eth_requestAccounts"
              });
            } catch {
              console.error("cannot access to account");
              window.location.reload();
            }
          }
        : () => {
            console.error(" cannot connect to meta mask ");
          },
      requireInstall: !Web3api.isLoading && !Web3api.web3
    };
  }, [Web3api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks(cb) {
  const { hooks } = useWeb3();
  return cb(hooks);
}
