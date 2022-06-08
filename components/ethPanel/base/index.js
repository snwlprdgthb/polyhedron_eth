import Image from "next/image";
import { useEthPrice } from "@components/hooks/useEthPrice";

export default function EthPanel() {
  const { eth } = useEthPrice();
  return (
    <div className="text-lg bg-white rounded-md p-1 font-abeezee sm:py-3 sm:px-4 flex-col justify-center items-center">
      <div className="text-center pt-2">ETH price</div>
      <div className="flex items-center justify-center pr-2">
        <div className="">
          <Image width="38" height="38" layout="intrinsic" src="/eth.svg" />
        </div>

        <span className="">{`= ${eth.data}$`}</span>
      </div>
    </div>
  );
}
