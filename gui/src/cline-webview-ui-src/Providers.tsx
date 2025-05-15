import { type ReactNode } from "react";

import { HeroUIProvider } from "@heroui/react";
// import { ExtensionStateContextProvider } from "./context/ExtensionStateContext";
// import { FirebaseAuthProvider } from "./context/FirebaseAuthContext";
// import { CustomPostHogProvider } from "./CustomPostHogProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // <ExtensionStateContextProvider>
    //   <CustomPostHogProvider>
    //     <FirebaseAuthProvider>
    <HeroUIProvider>{children}</HeroUIProvider>
    //     </FirebaseAuthProvider>
    //   </CustomPostHogProvider>
    // </ExtensionStateContextProvider>
  );
}
