import { useState, useEffect } from "react";

export const handler = (web3, contract) => (item, account) => {
  const [ownItem, setOwnItem] = useState(null);

  useEffect(() => {
    const loadOwnItems = async () => {
      const { slug, id, title, coverImg, description, wsl } = item;

      let idInHex = web3.utils.utf8ToHex(id);

      let itemHash = web3.utils.soliditySha3(
        {
          type: "bytes16",
          value: idInHex
        },
        {
          type: "address",
          value: account
        }
      );

      const res = await contract.contract.methods
        .getItemDataByHash(itemHash)
        .call();

      if (res.owner.toLowerCase() != account.toLowerCase()) {
        setOwnItem(item);
      } else {
        setOwnItem({
          ...res,
          title,
          coverImg,
          slug,
          description,
          wsl
        });
      }
    };

    web3 && contract && item && account && loadOwnItems();
  }, [web3, contract, account]);

  return {
    ownItem: ownItem
  };
};
