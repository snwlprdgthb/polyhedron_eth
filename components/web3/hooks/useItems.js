import useSWR from "swr";

export const handler = (web3, contract) => account => {
  const { data } = useSWR(
    web3 && contract && account?.account
      ? `web3/useItems/${account.account}`
      : null,

    async () => {
      const itemsArray = [];
      const data = await contract.contract.methods.getTotalCount().call();

      for (let i = Number(data) - 1; i >= 0; i--) {
        let hashItem = await contract.contract.methods
          .getItemHashByID(i)
          .call();
        let item = await contract.contract.methods
          .getItemDataByHash(hashItem)
          .call();

        item && itemsArray.push({ ...item, hashItem });
      }

      return itemsArray;
    }
  );

  return {
    data: data
  };
};
