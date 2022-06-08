import useSWR from "swr";

const URL =
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false";

const ITEM_PRICE = 15;

const fetcher = async url => {
  const res = await fetch(url);
  const json = await res.json();

  return json.market_data.current_price.usd
    ? json.market_data.current_price.usd
    : null;
};

export const useEthPrice = () => {
  const { data, ...rest } = useSWR(URL, fetcher, { refreshInterval: 1000 });

  const forItem = data ? (ITEM_PRICE / Number(data)).toFixed(4) : null;

  return {
    eth: {
      data,
      ...rest,
      forItem
    }
  };
};
