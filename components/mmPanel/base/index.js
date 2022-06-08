import Image from "next/image";

export default function MMPanel({ customStyle }) {
  return (
    <div className={`${customStyle ? customStyle : ""} flex items-center`}>
      <span className="text-white text-lg font-abeezee pr-2">
        Easier to interact with
      </span>
      <div className="">
        <Image width="40" height="40" layout="intrinsic" src="/metamask.svg" />
      </div>
    </div>
  );
}

{
  /* <div className="flex justify-end items-center pr-5 lg:pr-8 xl:pr-16 "></div> */
}
