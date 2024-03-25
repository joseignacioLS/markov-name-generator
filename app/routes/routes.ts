interface IRoute {
  icon: {
    value: string;
    filled: boolean;
  }
  path: string
}

export const routes: IRoute[] = [
  {
    icon: {
      value: "home",
      filled: true
    },
    path: "/",
  },
  {
    icon: {
      value: "star",
      filled: true
    },
    path: "/favs",
  },
];