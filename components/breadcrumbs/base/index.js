import { ActiveLink } from "@components/activeLink";
import { useRouter } from "next/router";
import { useAccount } from "@components/hooks/useAccount";

export default function Breadcrumbs({ list }) {
  const { pathname } = useRouter();
  const { account } = useAccount();
  pathname;

  return (
    <div className="py-4 flex bg-black justify-end font-abeezee pr-6 lg:pr-8 xl:pr-16">
      <nav aria-label="breadcrumb">
        <ol className="list-reset flex">
          {list.map((item, i, arr) => {
            if (!item.isAdmin) {
              return (
                <>
                  <li
                    key={i}
                    className={`${
                      pathname === item.href
                        ? "text-zinc-300 selectBread"
                        : "textHoverZinc"
                    }  `}
                  >
                    <ActiveLink href={item.href}>
                      <a>{item.title}</a>
                    </ActiveLink>
                  </li>
                  {i === 0 ? (
                    <li>
                      <span className="text-zinc-50 mx-2">|</span>
                    </li>
                  ) : null}
                </>
              );
            }

            if (item.isAdmin && account.isAdmin) {
              return (
                <>
                  <span className="text-zinc-50 mx-2">|</span>
                  <li
                    key={i}
                    className={`${
                      pathname === item.href
                        ? "text-gray-400 selectBread"
                        : "textHoverZinc"
                    }  `}
                  >
                    <ActiveLink href={item.href}>
                      <a>{item.title}</a>
                    </ActiveLink>
                  </li>
                  {arr.length - 1 != i ? (
                    <li>
                      <span className="text-zinc-50 mx-2">|</span>
                    </li>
                  ) : null}
                </>
              );
            }
          })}
        </ol>
      </nav>
    </div>
  );
}
