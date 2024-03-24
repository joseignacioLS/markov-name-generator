import { useEffect, useState } from "react";

export const useEffectAfterInit = (
  callback: () => void,
  dependencies: any[]
) => {
  const [hasInit, setHasInit] = useState(false);
  useEffect(() => {
    if (!hasInit) return setHasInit(true);
    callback();
  }, dependencies);
};
