import { getAllItems } from "@content/courses/fetcher";
import { BaseLayout } from "@components/layout";
import { useOwnedItem } from "@components/hooks/useOwnedItem";
import { useAccount } from "@components/hooks/useAccount";
import Image from "next/image";
import { Button } from "@components/layout";
import { useWeb3 } from "@components/web3";
import { MMPanel } from "@components/mmPanel";
import { statePanel } from "@components/statePanel";
import { STATE_OBJ } from "@components/box/base";

export default function Item({ item }) {
  const { account } = useAccount();

  const { ownItem } = useOwnedItem(item, account.account);

  const { connect, isLoading, requireInstall } = useWeb3();

  return (
    <div className="">
      {(requireInstall || !account.account) && (
        <div>
          <div className="fixed z-10">
            <div
              className={` w-screen h-screen  bg-red-900  opacity-60  text-black rounded-md`}
            ></div>
          </div>
          <div className="fixed z-30 flex justify-center w-screen h-screen items-center">
            <div className="bg-black p-8 opacity-90 text-2xl text-white rounded-md flex flex-col items-center">
              <div>U dont have access </div>
              <div>to be down here.</div>
              <div className="">Gotta be install</div>
              <div
                onClick={() => window.open("https://metamask.io/", "_blank")}
                className="cursor-pointer"
              >
                Metamask!
              </div>
              <MMPanel />
            </div>
          </div>
        </div>
      )}

      <div className="w-full font-abeezee 2xl:text-xl">
        <div className="">
          <div className=" flex flex-col md:flex-row ">
            <div className=" flex-2 flex-col flex items-center justify-center pt-32 2xl:pt-16 md:pl-16 lg:pl-32 ">
              <div className="p-3">
                {" "}
                {ownItem?.owner?.toLowerCase() ==
                  account.account?.toLowerCase() && !requireInstall
                  ? ownItem?.state && statePanel(STATE_OBJ[ownItem.state])
                  : !requireInstall && (
                      <span className="bg-red-600 px-3 py-2 text-sm rounded-lg mb-2">
                        Dont own yet!
                      </span>
                    )}
                {/* {ownItem?.state && statePanel(STATE_OBJ[ownItem.state])} */}
                <div className="text-xl xs:text-4xl mb-4 mt-2 font-bold text-indigo-500">
                  {ownItem?.title}
                </div>
                <div className="text-base mb-4 text-gray-400">
                  {ownItem?.description}
                </div>
                {ownItem?.state == null ? (
                  <div className="flex">
                    <Button className="mr-5" disabled={true}>
                      Locked
                    </Button>
                    <Button disabled={true}>Locked</Button>
                  </div>
                ) : ownItem.state === "0" ? (
                  <div className="flex">
                    <Button className="mr-5" disabled={true}>
                      Locked
                    </Button>
                    <Button disabled={true}>Locked</Button>
                  </div>
                ) : (
                  <div className="flex">
                    <Button className="mr-5">Get Started</Button>
                    <Button>Watch</Button>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full flex-2  md:pt-32 relative z-20 ">
              <Image
                height="850"
                alt="coverImg"
                width="850"
                src={item.coverImg}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full sm:w-2/3 p-7 flex   flex-col">
            <div className="flex bg-gray-100">
              <div className="flex-1 p-2 border-white border-r-2">Section</div>
              <div className="flex-1 p-2">Status</div>
            </div>

            {item.wsl.map(item => {
              return (
                <div key={item.id} className="flex  text-white border-b-2 ">
                  <div className="flex-1  p-2 border-r-2">
                    <span className="">{item}</span>
                  </div>
                  <div className="flex-1 p-2 ">
                    <span>
                      {" "}
                      {ownItem?.state == null
                        ? "Locked"
                        : ownItem.state === "0" || ownItem.state === "2"
                        ? "Waiting to activating"
                        : "This article presents formalized intuitionistic proofs for the polyhedra genus theorem, the Euler formula and a sufficient condition of planarity. They are based on a hypermap model for polyhedra and on formal specifications in the Calculus of Inductive Constructions."}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function getStaticPaths() {
  const { data } = getAllItems();

  const paths = data.map(c => ({
    params: {
      slug: c.slug
    }
  }));

  return {
    paths,
    fallback: false
  };
}

export function getStaticProps(props) {
  const { data } = getAllItems();

  const item = data.filter(c => c.slug === props.params.slug)[0];

  return {
    props: {
      item
    }
  };
}

Item.Layout = BaseLayout;
