export const generateId = (): number => {
  return Math.floor(Math.random() * 1e9);
};


export const windowToColor: { [key: number]: string } = {
  1: "#001C47", // Substituted for background color
  2: "#193559",
  3: "#32416C",
  4: "#4B5D7F",
  5: "#647992",
  6: "#7D95A5", // Substituted for highlight color
};