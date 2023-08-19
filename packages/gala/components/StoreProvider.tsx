import { ReactNode, useEffect, useState } from "react";
import { initStore } from "../lib/store";
import Loading from "./Loading";

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      return initStore(() => setStoreLoaded(true), () => setStoreLoaded(false));
    }
  }, []);

  if (!storeLoaded) {
    return <Loading />;
  } else {
    return <>{children}</>
  }
}

export default StoreProvider;
