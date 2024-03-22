export const getRequest = async (url: string): Promise<unknown> => {
  const request = await fetch(url);
  if (!request.ok) {
    return ""
  }
  const response: string = await request.text();
  return response;
}