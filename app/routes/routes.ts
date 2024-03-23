interface IRoute {
  icon: string;
  path: string
}

export const routes: IRoute[] = [
  {
    icon: "home",
    path: "/",
  },
  {
    icon: "star",
    path: "/favs",
  },
];