interface ISource {
  name: string;
  value: string;
}

export const sources: ISource[] = [
  { name: "Ciudades España", value: "/data/spain-locations.txt" },
  { name: "Ciudades España (extendido)", value: "/data/spain-locations-extended.txt" },
  { name: "Nombres España", value: "/data/spain-names.txt" },
  { name: "Ciudades Tierra Media", value: "/data/tolkien-locations.txt" },
  { name: "Nombres Tierra Media", value: "/data/tolkien-names.txt" },
]