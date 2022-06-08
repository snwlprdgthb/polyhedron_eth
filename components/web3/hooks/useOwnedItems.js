import useSWR from "swr";

export const handler = (web3, contract) => (items, account, network) => {
  const { data } = useSWR(
    () =>
      web3 && contract && account && network
        ? `web3/ownedCourses/${account}/${network}`
        : null,
    async () => {
      const reallyOwnItems = [];

      for (let i = 0; i < items.length; i++) {
        const { title, coverImg, slug, id } = items[i];

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

        if (res.owner.toLowerCase() == account.toLowerCase()) {
          reallyOwnItems.push({
            ...res,
            title,
            coverImg,
            slug
          });
        }
      }

      return reallyOwnItems;
    }
  );

  return {
    ownItems: data,
    lookup:
      data?.reduce((acc, item) => {
        acc[web3.utils.hexToUtf8(item.itemId)] = item;
        return acc;
      }, {}) ?? {}
  };
};

// export const handler = (web3, contract) => (items, account, network) => {
//   const [ownItems, setOwnItems] = useState([]);

//   useEffect(() => {
//     const loadOwnItems = async () => {
//       const reallyOwnItems = [];

//       for (let i = 0; i < items.length; i++) {
//         const { title, coverImg, slug, id } = items[i];

//         let idInHex = web3.utils.utf8ToHex(id);

//         let itemHash = web3.utils.soliditySha3(
//           {
//             type: "bytes16",
//             value: idInHex
//           },
//           {
//             type: "address",
//             value: account
//           }
//         );

//         const res = await contract.contract.methods
//           .getItemDataByHash(itemHash)
//           .call();

//         if (res.owner.toLowerCase() == account.toLowerCase()) {
//           reallyOwnItems.push({
//             ...res,
//             title,
//             coverImg,
//             slug
//           });
//         }
//       }

//       setOwnItems(reallyOwnItems);
//     };

//     web3 && contract && account && network && loadOwnItems();
//   }, [web3, contract, account, network]);

//   debugger;
//   return {
//     ownItems: ownItems,
//     lookup:
//       ownItems.reduce((a, i) => {
//         a[web3.utils.hexToUtf8(i.itemId)] = i;
//         return a;
//       }, {}) ?? {}
//   };
// };
