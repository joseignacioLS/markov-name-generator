export const store = (key: string, value: any) => {
  if (typeof value === "object") {
    localStorage.setItem(key, JSON.stringify(value))
  }
  else {
    localStorage.setItem(key, "" + value)
  }
}

export const recover = (key: string) => {
  const recovered = localStorage.getItem(key);
  if (!recovered) return undefined
  if (recovered[0] === "{" && recovered.at(-1) === "}") {
    return JSON.parse(recovered)
  }
  return recovered
}