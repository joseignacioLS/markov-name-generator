"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";

const routes = [
  {
    icon: "home",
    path: "/",
  },
  {
    icon: "star",
    path: "/favs",
  },
];

const Nav = () => {
  const pathname = usePathname();
  console.log({ pathname });
  return (
    <nav className={styles.nav}>
      {routes
        .filter((r) => r.path !== pathname)
        .map((r) => {
          return (
            <Link key={r.icon} href={r.path}>
              <span className="material-symbols-outlined">{r.icon}</span>
            </Link>
          );
        })}
    </nav>
  );
};

export default Nav;
