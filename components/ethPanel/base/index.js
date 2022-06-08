import Image from "next/image";
import { useEthPrice } from "@components/hooks/useEthPrice";

export default function EthPanel() {
  const { eth } = useEthPrice();
  return (
    // <div className="my-2 flex my-0 font-abeezee justify-around bg-black xs:justify-start">
    <div className="text-lg bg-white rounded-md p-1 font-abeezee sm:py-3 sm:px-4 flex-col justify-center items-center">
      <div className="text-center pt-2">ETH price</div>
      <div className="flex items-center justify-center pr-2">
        <div className="">
          <Image width="38" height="38" layout="intrinsic" src="/eth.svg" />
        </div>

        <span className="">{`= ${eth.data}$`}</span>
      </div>
    </div>
    /* <div className="p-3 xs:p-7 border-2 rounded-md grid justify-items-center">
        <div className="flex flex-row items-center font-medium">
          <div className="text-md xs:text-xl">{eth.forItem}</div>
          <div className="">
            <Image width="34" height="34" layout="intrinsic" src="/eth.svg" />
          </div>
          <span className="text-md xs:text-xl"> = 15$</span>
        </div>

        <div className="text-center">Price per item.</div>
      </div>
    </div> */
  );
}
