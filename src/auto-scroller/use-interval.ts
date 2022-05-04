import React from "react";

export const useInterval = () => {
  const idRef = React.useRef<number>();

  const set = React.useCallback((handler: () => void, timeout: number) => {
    idRef.current = setInterval(handler, timeout);
  }, []);

  const clear = React.useCallback(() => {
    if (idRef.current == undefined) return;
    clearInterval(idRef.current);
    idRef.current = undefined;
  }, []);

  return [set, clear] as const;
};
