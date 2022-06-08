import { WalletBar } from "@components/walletBar";
import { EthPanel } from "@components/ethPanel";
import { Breadcrumbs } from "@components/breadcrumbs";

const list = [
  { title: "Buy", href: "/marketplace" },
  { title: "My items", href: "/marketplace/items/owned" },
  { title: "Manage items", href: "/marketplace/items/manage", isAdmin: true }
];

export default function MarketHeader() {
  return (
    <>
      <WalletBar />
      {/* <EthPanel /> */}
      <Breadcrumbs list={list} />
    </>
  );
}
