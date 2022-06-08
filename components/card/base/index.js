import Image from "next/image";
import Link from "next/link";
import { STATE_OBJ } from "@components/box/base";
import { statePanel } from "@components/statePanel";
import { useEthPrice } from "@components/hooks/useEthPrice";

export default function Card({ item, Footer, disabled, state }) {
  const { eth } = useEthPrice();
  return (
    <div
      key={item.index}
      className="border font-abeezee rounded-md bg-black opacity-70 md:max-w-2xl 2xl:max-w-4xl"
    >
      <div className="flex h-full">
        <Link href={`/item/${item.slug} `}>
          <div className=" w-1/3 z-50 h-full image-wrapper cursor-pointer">
            <Image
              className={`object-cover ${disabled ? "filter grayscale" : ""}`}
              width="200"
              height="200"
              layout="responsive"
              src={item.coverImg}
              alt={item.title}
            />
          </div>
        </Link>
        <div className="flex flex-col w-2/3  text-white">
          <div className="pt-5 pr-3 p-2 xl:p-8">
            <div className="flex flex-row justify-between">
              <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500">
                  {item.type}
                </div>

                <Link item={item} href={`/item/${item.slug} `}>
                  <a className="h-8 block mt-1 text-lg">{item.title}</a>
                </Link>

                <div className="flex justify-start items-center">
                  <div className="text-xl"> {eth.forItem}</div>
                  <div className="">
                    <Image
                      width="42"
                      height="42"
                      layout="intrinsic"
                      src="/eth.svg"
                    />
                  </div>
                </div>
              </div>
              <div>{state && statePanel(STATE_OBJ[state])}</div>
            </div>

            <div className="h-full flex flex-col self-end">
              <p className="mt-3 text-md text-gray-500 text-start mb-2">
                {`${item.description.substr(0, 120)}...`}
              </p>
              {Footer && <Footer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
