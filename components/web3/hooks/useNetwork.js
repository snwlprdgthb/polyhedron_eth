import { useState, useEffect } from "react";
import useSWR from "swr";

const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten",
  56: "Binance Smart Chain",
  1337: "Ganache"
};

export const handler = web3 => () => {
  const targetChain = NETWORKS[process.env.NEXT_PUBLIC_TARGET_CHAIN];

  const { data, error } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = await web3.eth.getChainId();

      if (!chainId) {
        throw new Error("Cannot retreive network. Please refresh the browser.");
      }

      return NETWORKS[chainId];
    }
  );

  // useEffect(() => {
  //   const mutator = chainId => window.location.reload();
  //   provider?.on("chainChanged", mutator);

  //   return () => {
  //     provider?.removeListener("chainChanged", mutator);
  //   };
  // }, [provider]);

  return {
    network: {
      network: data,
      target: targetChain,
      // isSupported: data === targetChain,

      // isLoaded: chainId && true,
      isLoaded: !!(data || error),
      hasInitialResponse: !!(data || error),
      isSupported: data === targetChain ? true : false
      // ...rest
    }
  };
};

// export const handler = (web3) => () => {
//   const [chainId, setChainId] = useState(null);

//   useEffect(() => {
//     const loadNetwork = async () => {
//       const chainId = await web3.eth.getChainId();

//       setChainId(chainId);
//     };
//     web3 && loadNetwork();
//   }, [web3]);

//   useEffect(() => {
//     window.ethereum &&
//       window.ethereum.on("chainChanged", chainId =>
//         setChainId(parseInt(chainId, 16))
//       );
//   }, [web3]);

//   return {
//     network: {
//       network: NETWORKS[chainId],
//       target: targetChain,
//       isLoaded: chainId && true,
//       isSupported: NETWORKS[chainId] === targetChain ? true : false
//     }
//   };
// };
