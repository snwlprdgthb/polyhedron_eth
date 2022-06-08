import { useWeb3 } from "@components/web3";
import { useWalletInfo } from "@components/hooks/useWalletInfo";
import { EthPanel } from "@components/ethPanel";

export default function WalletBar() {
  const { requireInstall } = useWeb3();
  const { network, account } = useWalletInfo();

  return (
    <section>
      <div className=" text-lg sm:text-xl  bg-black px-2 xs:px-8 sm:px-16 lg:px-32 pt-40 font-abeezee">
        <div className="flex flex-col text-zinc-50">
          <span className="break-words">{`Hello, ${account.account}`}</span>
          <span>Hope, u a having good day!</span>
        </div>
        <div className="flex flex-row justify-between py-8">
          <div>
            <div className="px-2 text-center py-3 sm:px-4 bg-white text-black rounded-md mb-6">
              Learn how to purchase
            </div>
            <EthPanel />
          </div>

          <div className="text-white flex flex-col justify-start ml-3 md:ml-0">
            {network.isLoaded && !network.isSupported && (
              <div className="bg-red-500 p-4 mb-4 rounded-md">
                <div>Connected to wrong network.</div>
                {`Connect to: ${network.target}`}
              </div>
            )}
            {requireInstall && (
              <div className="bg-red-500 p-3 text-black rounded-md">
                Gotta be install Metamask!
              </div>
            )}
            {network.isLoaded && (
              <div className="flex  flex-col sm:flex-row text-xl ">
                {" "}
                <div>Currently on</div>
                <div className="text-xl font-bold ml-0 sm:ml-2 selectBread">
                  {network.network}
                </div>
              </div>
            )}
            {/* <span>Currently on</span>
             <span className="text-xl ml-2">{network.network}</span> */}
          </div>
        </div>
      </div>
    </section>
  );
}
