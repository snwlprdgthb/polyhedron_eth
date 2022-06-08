import { BaseLayout } from "@components/layout";
import { getAllItems } from "@content/courses/fetcher";
import { List } from "@components/items";
import { Card } from "@components/card";
// import { useWeb3 } from "@components/web3";
import { Main } from "@components/main";
import { MMPanel } from "@components/mmPanel";

export default function Home({ items }) {
  return (
    <div className="relative overflow-hidden">
      <Main />
      <List items={items}>{item => <Card key={item.id} item={item} />}</List>
      <MMPanel customStyle="flex justify-end mr-16" />
    </div>
  );
}

export function getStaticProps() {
  const { data } = getAllItems();
  return {
    props: {
      items: data
    }
  };
}

Home.Layout = BaseLayout;
