import { BaseLayout } from "@components/layout";
import Image from "next/image";

export default function Features() {
  return (
    <div className="overflow-hidden absolute pb-8">
      <div className="font-abeezee  z-10 text-white pt-40 px-8 lg:px-20 text-lg4 lg:text-xl">
        <div className="w-full md:w-4/5 lg:w-2/3">
          <div className="text-lg lg:text-2xl">
            ETHEREUM VIRTUAL MACHINE (
            <span className="text-indigo-500">EVM</span>)
          </div>
          <div className="pt-8">
            The
            <span className="text-indigo-500"> EVM’s </span>
            physical instantiation can’t be described in the same way that one
            might point to a cloud or an ocean wave, but it does exist as one
            single entity maintained by thousands of connected computers running
            an Ethereum client.
          </div>
          <div className="pt-4">
            The Ethereum protocol itself exists solely for the purpose of
            keeping the continuous, uninterrupted, and immutable operation of
            this special state machine; Its the environment in which all
            Ethereum accounts and smart contracts live. At any given block in
            the chain, Ethereum has one and only one canonical state, and the
            <span className="text-indigo-500"> EVM </span>
            is what defines the rules for computing a new valid state from block
            to block.
          </div>
          <div className="pt-8">
            A fixed price in USD guaranteed over a certain period was
            advantageous in volatile markets.
          </div>
          <div className="pt-2">
            The price is 15 USD automatic converting in ETH.
          </div>
        </div>
      </div>
      <div className=" customFull fixed ">
        <Image
          width="1800"
          height="1800"
          alt="eth"
          layout="fixed"
          src="/eth.svg"
        />
      </div>
    </div>
  );
}

Features.Layout = BaseLayout;
