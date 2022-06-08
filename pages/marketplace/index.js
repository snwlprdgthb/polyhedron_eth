import { BaseLayout } from "@components/layout";
import { List } from "@components/items";
import { Card } from "@components/card";
import { getAllItems } from "@content/courses/fetcher";
import { Button } from "@components/layout";
import { Modal } from "@components/modal";
import { useState } from "react";
import { useWalletInfo } from "@components/hooks/useWalletInfo";
import { MarketHeader } from "@components/marketHeader";
import { useWeb3 } from "@components/web3";
import { useOwnedItems } from "@components/hooks/useOwnedItems";
import { STATE_OBJ } from "@components/box/base";
import { toastCreator } from "@utils/toast";

export default function Marketplace({ items }) {
  const [currentItem, setCurrentItem] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);
  const [pendingItemId, setPendingItemId] = useState(null);

  const { web3, contract, isLoading, requireInstall } = useWeb3();
  const { account, network, isDisabled, isConnecting } = useWalletInfo();

  const { lookup, ownItems } = useOwnedItems(
    items,
    account.account,
    network.network
  );

  const purchaseItem = async order => {
    const hexCourseId = web3.utils.utf8ToHex(currentItem.id);

    const itemHash = web3.utils.soliditySha3(
      {
        type: "bytes16",
        value: hexCourseId
      },
      {
        type: "address",
        value: account.account
      }
    );

    const priceInWei = web3.utils.toWei(String(order.price));

    setPendingItemId(currentItem.id);

    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email);
      const proof = web3.utils.soliditySha3(
        {
          type: "bytes32",
          value: emailHash
        },
        {
          type: "bytes32",
          value: itemHash
        }
      );

      toastCreator(_purchaseItem(hexCourseId, proof, priceInWei));
    } else {
      toastCreator(_rePurchaseItem(itemHash, priceInWei));
    }
  };

  const _purchaseItem = async (hexCourseId, proof, priceInWei) => {
    try {
      return await contract.contract.methods
        .purchaseItem(hexCourseId, proof)
        .send({ from: account.account, value: priceInWei });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setPendingItemId(null);
      // ownItems.mutate();     gotta change hook structure for immediately update state after tx
    }
  };

  const _rePurchaseItem = async (itemHash, priceInWei) => {
    try {
      return await contract.contract.methods
        .rePurchaseItem(itemHash)
        .send({ from: account.account, value: priceInWei });
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setPendingItemId(null);
      // ownItems.mutate();
    }
  };

  return (
    <>
      <MarketHeader />

      <List items={items}>
        {item => {
          const owned = lookup[item.id];

          return (
            <Card
              disabled={!isDisabled}
              key={item.id}
              item={item}
              state={owned?.state}
              Footer={() => {
                if (isLoading && !isConnecting) {
                  return (
                    <div>
                      <Button disabled={true}>Loading</Button>
                    </div>
                  );
                }

                if (requireInstall && !isLoading) {
                  return (
                    <div>
                      <Button disabled={true}>Install</Button>
                    </div>
                  );
                }

                if (owned) {
                  if (STATE_OBJ[owned.state] === "Deactivated") {
                    return (
                      <>
                        <div className="flex">
                          <Button disabled={true} className="mr-3">
                            OWNED
                          </Button>
                          <Button
                            onClick={() => {
                              setIsNewPurchase(false);
                              setCurrentItem(item);
                            }}
                            disabled={false}
                          >
                            Fund to Activate item
                          </Button>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div>
                          <Button disabled={true}>OWNED</Button>
                        </div>
                      </>
                    );
                  }
                }
                const isPending = pendingItemId === item.id;
                return !isPending ? (
                  <div>
                    <Button
                      disabled={!isDisabled}
                      onClick={() => setCurrentItem(item)}
                    >
                      Purchase
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button disabled={true}>Waiting TX...</Button>
                  </div>
                );
              }}
            />
          );
        }}
      </List>
      {currentItem && (
        <Modal
          purchaseItem={purchaseItem}
          isNewPurchase={isNewPurchase}
          onClose={() => {
            setCurrentItem(false);
            setIsNewPurchase(true);
          }}
          item={currentItem}
        />
      )}
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

Marketplace.Layout = BaseLayout;
