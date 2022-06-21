import items from "./index.json.js";

export const getAllItems = () => {
  return {
    data: items,
    dataMap: items.reduce((acc, item, index) => {
      acc[item.id] = item;
      acc[item.id].index = index;
      return acc;
    }, {})
  };
};
