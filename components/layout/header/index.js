import Link from "next/link";
import { useWeb3 } from "@components/web3";
import { Button } from "@components/layout";
import { useAccount } from "@components/hooks/useAccount";

export default function Header() {
  const { connect, isLoading, requireInstall } = useWeb3();
  const { account } = useAccount();

  return (
    <>
      <section className="font-abeezee  z-50  flex py-5  fixed w-full">
        <div className="relative w-full px-2 sm:px-4 md:px-12">
          <nav className="relative">
            <div className="flex justify-between items-center">
              <div className="flex flex-col xs:flex-row">
                <div>
                  <Link href="/">
                    <a className="mr-3 uppercase sm:normal-case font-medium sm:mr-8 textHoverZinc">
                      Home
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/features">
                    <a className="mr-3 uppercase sm:mr-8 sm:normal-case textHoverZinc">
                      Features
                    </a>
                  </Link>
                </div>
                <div>
                  {" "}
                  <Link href="/marketplace">
                    <a className="mr-3 uppercase sm:normal-case  sm:mr-8 textHoverZinc">
                      Marketplace
                    </a>
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                {account.isAdmin && (
                  <div className="py-2 px-3 rounded-xl text-md mr-2 bg-green-600">
                    ADMIN
                  </div>
                )}
                {isLoading ? (
                  <Button disabled={true} onClick={connect}>
                    Loading
                  </Button>
                ) : !requireInstall ? (
                  account.account ? (
                    <Button disabled={true} colorProps={"connected"}>
                      Connected
                    </Button>
                  ) : (
                    <Button onClick={connect}>Connect</Button>
                  )
                ) : (
                  <Button
                    onClick={() =>
                      window.open("https://metamask.io/", "_blank")
                    }
                  >
                    Install metamask
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
        <div className="blackGradient h-9/6" />
      </section>
    </>
  );
}
