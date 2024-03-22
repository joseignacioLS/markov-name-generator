interface ISource {
  name: string;
  value: string;
}

export const sources: ISource[] = [
  { name: "Ciudades España", value: "/data/spain.txt" },
  { name: "Ciudades España (extendido)", value: "/data/spain-extended.txt" },
  { name: "Nombres España", value: "/data/spain-names.txt" },
  { name: "Ciudades Tierra Media", value: "/data/tolkien.txt" },
  { name: "Nombres Tierra Media", value: "/data/tolkien-names.txt" },
]