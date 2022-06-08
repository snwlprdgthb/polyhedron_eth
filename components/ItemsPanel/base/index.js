import Image from "next/image";
import { Button } from "@components/layout";
import { useRouter } from "next/router";
import { STATE_OBJ } from "@components/box/base";

export default function ItemsPanel({ item }) {
  const router = useRouter();

  return (
    <div className="flex-col md:flex md:flex-row mb-6 font-abeezee text-white border-2 rounded-lg">
      <div className="md:w-2/5 xl:w-1/3 h-80 md:h-full image-wrapper">
        <Image
          alt="coverImg"
          className="object-cover"
          width="400"
          height="400"
          layout="responsive"
          src={item.coverImg}
        />
      </div>
      <div className="md:w-3/5 xl:w-2/3 pt-2 ">
        <div className="mt-2 p-3 border-b">
          <div className="text-xl font-bold">{item.title}</div>
          <div className="text-sm text-gray">{item.price}</div>
        </div>

        <div className="mt-2 p-3 border-b">
          <span className="text-lg">ItemId:</span>
          <div className="text-sm text-gray">{item.id}</div>
        </div>
        <div className="mt-2 p-3 border-b">
          <span className="text-lg">Proof:</span>
          <div className="text-sm text-gray break-words">{item.proof}</div>
        </div>
        <div className="mt-2 p-3 border-b">
          <span className="text-lg">State:</span>
          <div className="text-sm text-gray">{STATE_OBJ[item.state]}</div>
        </div>
        <Button
          onClick={() => router.push(`/item/${item.slug}`)}
          className="ml-3 my-3 sm:my-6"
        >
          View Item
        </Button>
      </div>
    </div>
  );
}
