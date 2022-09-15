import React from "react";

export function useArrayBuffer(url?: string): ArrayBuffer | undefined {
  const [data, setData] = React.useState<ArrayBuffer>();

  React.useEffect(() => {
    if (!url) {
      setData(undefined);
      return;
    }

    let cancelled = false;

    fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (!cancelled) {
          setData(buffer);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}

export default useArrayBuffer;
