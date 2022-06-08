import { BaseLayout } from "@components/layout";
import { MarketHeader } from "@components/marketHeader";
import { getAllItems } from "@content/courses/fetcher";
import { useOwnedItems } from "@components/hooks/useOwnedItems";
import { ItemsPanel } from "@components/ItemsPanel";
import { ActivityPanel } from "@components/activityPanel";
import { useWalletInfo } from "@components/hooks/useWalletInfo";

export default function Owned({ items }) {
  const { account, network } = useWalletInfo();
  const { ownItems } = useOwnedItems(items, account.account, network.network);

  return (
    <>
      <MarketHeader />
      <div className="flex-col px-9 md:px-16 lg:px-32">
        {account.account &&
          ownItems?.length >= 1 &&
          ownItems.map(item => <ItemsPanel item={item} key={item.id} />)}

        {ownItems?.length === 0 && Array.from(ownItems).length === 0 && (
          <>
            <ActivityPanel>
              U dont have any items yet. Wanna buy something ?
            </ActivityPanel>
          </>
        )}
      </div>
    </>
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

Owned.Layout = BaseLayout;
