import { BaseLayout, Button } from "@components/layout";
import { MarketHeader } from "@components/marketHeader";
import { useItems } from "@components/hooks/useItems";
import { Box } from "@components/box";
import { useState, useEffect } from "react";
import { useWeb3 } from "@components/web3";
import useAdmin from "@components/hooks/useAdmin";
import { toastCreator } from "@utils/toast";
import { STATE_OBJ } from "@components/box/base";
import Router from "next/router";

const Input = ({ verifyProof }) => {
  const [exactlyValue, setExactlyValue] = useState("");

  return (
    <div className="flex flex-row items-center">
      <input
        value={exactlyValue}
        onChange={({ target: { value } }) => {
          setExactlyValue(value);
        }}
        className=" appearance-none mr-3 my-2 border w-2/3 rounded w-full p-3 text-gray-700  leading-tight focus:outline-none "
      />
      <Button
        disabled={!exactlyValue}
        onClick={() => verifyProof(exactlyValue)}
      >
        Check proofs
      </Button>
    </div>
  );
};

export default function Manage() {
  const { web3, contract, requireInstall } = useWeb3();
  const { account, shouldRedirect, redirectPath } = useAdmin({
    redirectTo: "/marketplace"
  });

  const { data } = useItems(account);

  const [isProof, setIsProof] = useState({});
  const [isWaitingPanelHash, setIsWaitingPanelHash] = useState(null);
  const [showOnly, setShowOnly] = useState("All");

  const verifyProof = (email, { hash, proof }) => {
    const emailHash = web3.utils.sha3(email);
    const currentProof = web3.utils.soliditySha3(
      {
        type: "bytes32",
        value: emailHash
      },
      {
        type: "bytes32",
        value: hash
      }
    );

    if (currentProof === proof) {
      setIsProof(prev => {
        return { ...prev, [hash]: true };
      });
    } else {
      setIsProof(prev => {
        return { ...prev, [hash]: false };
      });
    }
  };

  const changeCourseState = async (method, hash) => {
    try {
      setIsWaitingPanelHash(hash);
      return await contract.contract.methods[method](hash).send({
        from: account.account
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsWaitingPanelHash(null);
    }
  };

  const activateItem = async courseHash => {
    toastCreator(changeCourseState("verifyItem", courseHash));
  };

  const deactivateItem = async courseHash => {
    changeCourseState("deactivateItem", courseHash);
  };

  const redirect = () => {
    Router.push(redirectPath);
  };

  useEffect(() => {
    if (shouldRedirect && account.account) {
      redirect();
    }
  }, [shouldRedirect, account.account]);

  if (requireInstall) {
    redirect();
  }

  return (
    <>
      <MarketHeader />
      {!shouldRedirect && data && (
        <div className="flex-col px-4 md:px-16 lg:px-32">
          <div className="flex justify-start text-white font-abeezee text-lg mb-3">
            <span>Show only: </span>
            <select
              value={showOnly}
              onChange={({ target: { value } }) => {
                setShowOnly(value);
              }}
              className="focus:outline-none rounded-md ml-3 text-black"
            >
              <option selected value="All">
                All
              </option>
              <option value="Activated">Activated</option>
              <option value="Deactivated">Deactivated</option>
              <option value="WaitAction">Wait action</option>
            </select>
          </div>

          {data &&
            data
              .filter(i => {
                if (showOnly === "All") {
                  return true;
                } else if (
                  showOnly === "WaitAction" &&
                  STATE_OBJ[i.state] === "Purchased"
                ) {
                  return true;
                } else if (STATE_OBJ[i.state] === showOnly) {
                  return true;
                }
              })
              .map(i => {
                return (
                  <Box item={i} key={i.hashItem}>
                    <div className="p-2">
                      <Input
                        verifyProof={email =>
                          verifyProof(email, {
                            hash: i.hashItem,
                            proof: i.proof
                          })
                        }
                      />

                      {isProof[i.hashItem] && (
                        <div className="p-3 uppercase bg-green-700 rounded-md text-center text-black">
                          verify
                        </div>
                      )}
                      {isProof[i.hashItem] === false && (
                        <div className="p-3 uppercase bg-red-700 rounded-md text-center text-black">
                          isnt verify
                        </div>
                      )}
                    </div>
                    {i.state === "0" && (
                      <div className="flex justify-start px-2 pb-2 ">
                        {isWaitingPanelHash === i.hashItem && (
                          <div className="p-3 bg-yellow">UPDATING STATE</div>
                        )}
                        <Button
                          onClick={() => activateItem(i.hashItem)}
                          className="mr-2 bg-green-600 text-black border-none"
                        >
                          Activate
                        </Button>
                        <Button
                          onClick={() => deactivateItem(i.hashItem)}
                          className="bg-red-600 text-black border-none"
                        >
                          Deactivate
                        </Button>
                      </div>
                    )}
                  </Box>
                );
              })}
        </div>
      )}
    </>
  );
}

Manage.Layout = BaseLayout;
