import { useEffect } from "react";
import useSWR from "swr";

const adminAddress = {
  "0x583d6e7214132896260623a96f5381a6174e67bcfe409de8161abba95d370124": true
};

export const handler = (web3, provider) => () => {
  const isAdminByENV = adminAddress[process.env.ADMIN_HASH_ACCOUNT];

  const { data, error, mutate, ...rest } = useSWR(
    web3 ? "web3/useAcccount" : null,
    async () => {
      const accounts = await web3.eth.getAccounts();

      const account = accounts[0];
      if (!account) {
        throw new Error("doesn't exist any accounts");
      }
      return account;
    }
  );

  useEffect(() => {
    const mutator = accounts => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider]);

  return {
    account: {
      account: data,
      hasInitialResponse: !!(data || error),
      isAdmin:
        (data && adminAddress[web3.utils.keccak256(data)] && isAdminByENV) ??
        false,
      mutate,
      ...rest
    }
  };
};
