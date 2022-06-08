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

  return {
    network: {
      network: data,
      target: targetChain,

      isLoaded: !!(data || error),
      hasInitialResponse: !!(data || error),
      isSupported: data === targetChain ? true : false
    }
  };
};
