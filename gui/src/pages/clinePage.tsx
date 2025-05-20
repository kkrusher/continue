import AppContent from "@webview-ui/App";
// import Demo from "@webview-ui/components/common/Demo";
// import SettingsButton from "@webview-ui/components/common/SettingsButton";
// import HomeHeader from "@webview-ui/components/welcome/HomeHeader";

const ClinePage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AppContent />
      {/* <h1 className="mb-4 text-2xl font-bold">New Page</h1>
      <p className="mb-8">
        This is a new page created with React Router navigation.
      </p>
      <div className="w-full max-w-5xl rounded-lg border border-gray-300 bg-white p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">App Component:</h2>

        <SettingsButton />
        <HomeHeader />
        <Demo />
      </div> */}
    </div>
  );
};

export default ClinePage;
