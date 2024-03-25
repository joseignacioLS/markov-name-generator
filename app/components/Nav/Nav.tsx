"use client";

import Link from "next/link";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { routes } from "@/app/routes/routes";

const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className={styles.nav}>
      {routes
        .filter((r) => r.path !== pathname)
        .map((r) => {
          return (
            <Link key={r.icon.value} href={r.path}>
              <span
                className={`material-symbols-outlined ${
                  r.icon.filled && "filled"
                }`}
              >
                {r.icon.value}
              </span>
            </Link>
          );
        })}
    </nav>
  );
};

export default Nav;
