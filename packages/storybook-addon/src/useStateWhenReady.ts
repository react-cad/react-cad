import React from "react";

function useStateWhenReady<T>(value: T): [T, (value: boolean) => void] {
  const [ready, setReady] = React.useState(true);
  const [myValue, setMyValue] = React.useState(value);

  React.useEffect(() => {
    if (ready) {
      setMyValue(value);
    }
  }, [value, ready]);

  return [myValue, setReady];
}

export default useStateWhenReady;
