import React from "react";

const subscribers: any[] = [];

const originalConsoleError = console["error"];

const consoleError = ((message, ...args) => {
  subscribers.forEach((subscriber) => subscriber(message));
  originalConsoleError(message, ...args);
}) as typeof console["error"];

console["error"] = consoleError;

function useConsoleError(onError: (message: string) => void): void {
  React.useEffect(() => {
    subscribers.push(onError);

    return () => {
      const index = subscribers.indexOf(onError);
      if (index >= 0) {
        subscribers.splice(index, 1);
      }
    };
  }, [onError]);
}

export default useConsoleError;
