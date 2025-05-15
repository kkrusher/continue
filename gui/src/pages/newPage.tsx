import Demo from "@webview-ui/components/common/Demo";
// import SettingsButton from "@webview-ui/components/common/SettingsButton";
// 1. import `HeroUIProvider` component
// import { HeroUIProvider } from "@heroui/react";
// import HomeHeader from "@webview-ui/components/welcome/HomeHeader";
// import { Providers } from "@webview-ui/Providers";

const NewPage = () => {
  return (
    // <HeroUIProvider>
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">New Page</h1>
      <p className="mb-8">
        This is a new page created with React Router navigation.
      </p>
      <div className="w-full max-w-5xl rounded-lg border border-gray-300 bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">App Component:</h2>
        {/* <AppContent /> */}
        {/* <SettingsButton />
        <HomeHeader /> */}
        <Demo />
      </div>
    </div>
    // </HeroUIProvider>
  );
};

export default NewPage;
