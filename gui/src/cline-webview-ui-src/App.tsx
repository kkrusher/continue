import { ExtensionMessage } from "@shared/ExtensionMessage";
import { useCallback, useEffect, useState } from "react";
import { useEvent } from "react-use";
import Navigation from "../components/Navigation";
import AccountView from "./components/account/AccountView";
import ChatView from "./components/chat/ChatView";
import HistoryView from "./components/history/HistoryView";
import McpView from "./components/mcp/configuration/McpConfigurationView";
import SettingsView from "./components/settings/SettingsView";
import WelcomeView from "./components/welcome/WelcomeView";
import { VIEW_TOP_SPACING } from "./constants";
import { useExtensionState } from "./context/ExtensionStateContext";
// import { Providers } from "./Providers"
import { vscode } from "./utils/vscode";

const AppContent = () => {
  const {
    didHydrateState,
    showWelcome,
    shouldShowAnnouncement,
    showMcp,
    mcpTab,
  } = useExtensionState();
  const [showSettings, setShowSettings] = useState(false);
  const hideSettings = useCallback(() => setShowSettings(false), []);
  const [showHistory, setShowHistory] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const { setShowMcp, setMcpTab } = useExtensionState();

  // Debug logging for initial state
  useEffect(() => {
    console.log("[DEBUG] AppContent mounted with state:", {
      didHydrateState,
      showWelcome,
      shouldShowAnnouncement,
      showMcp,
      mcpTab,
    });
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log("[DEBUG] View state changed:", {
      showSettings,
      showHistory,
      showMcp,
      showAccount,
      showAnnouncement,
      showChat,
    });
  }, [
    showSettings,
    showHistory,
    showMcp,
    showAccount,
    showAnnouncement,
    showChat,
  ]);

  const closeMcpView = useCallback(() => {
    console.log("[DEBUG] Closing MCP view");
    setShowMcp(false);
    setMcpTab(undefined);
  }, [setShowMcp, setMcpTab]);

  const handleMessage = useCallback(
    (e: MessageEvent) => {
      const message: ExtensionMessage = e.data;
      console.log("[DEBUG] Received message:", message);

      switch (message.type) {
        case "action":
          switch (message.action!) {
            case "settingsButtonClicked":
              console.log("[DEBUG] Settings button clicked");
              setShowSettings(true);
              setShowHistory(false);
              closeMcpView();
              setShowAccount(false);
              setShowChat(false);
              break;
            case "historyButtonClicked":
              console.log("[DEBUG] History button clicked");
              setShowSettings(false);
              setShowHistory(true);
              closeMcpView();
              setShowAccount(false);
              setShowChat(false);
              break;
            case "mcpButtonClicked":
              console.log("[DEBUG] MCP button clicked with tab:", message.tab);
              setShowSettings(false);
              setShowHistory(false);
              if (message.tab) {
                setMcpTab(message.tab);
              }
              setShowMcp(true);
              setShowAccount(false);
              setShowChat(false);
              break;
            case "accountButtonClicked":
              console.log("[DEBUG] Account button clicked");
              setShowSettings(false);
              setShowHistory(false);
              closeMcpView();
              setShowAccount(true);
              setShowChat(false);
              break;
            case "chatButtonClicked":
              console.log("[DEBUG] Chat button clicked");
              setShowSettings(false);
              setShowHistory(false);
              closeMcpView();
              setShowAccount(false);
              setShowChat(true);
              break;
          }
          break;
      }
    },
    [setShowMcp, setMcpTab, closeMcpView],
  );

  useEvent("message", handleMessage);

  useEffect(() => {
    if (shouldShowAnnouncement) {
      console.log("[DEBUG] Showing announcement");
      setShowAnnouncement(true);
      vscode.postMessage({ type: "didShowAnnouncement" });
    }
  }, [shouldShowAnnouncement]);

  useEffect(() => {
    console.log("[DEBUG] didHydrateState changed:", didHydrateState);
  }, [didHydrateState]);

  if (!didHydrateState) {
    console.log("[DEBUG] State not yet hydrated, rendering null");
    return null;
  }

  console.log("[DEBUG] Rendering AppContent with view state:", {
    showWelcome,
    showSettings,
    showHistory,
    showMcp,
    showAccount,
    showChat,
  });

  const openSettings = () => {
    console.log("[DEBUG] Settings button clicked directly");
    setShowSettings(true);
    setShowHistory(false);
    closeMcpView();
    setShowAccount(false);
    setShowChat(false);
  };

  const openHistory = () => {
    console.log("[DEBUG] History button clicked directly");
    setShowSettings(false);
    setShowHistory(true);
    closeMcpView();
    setShowAccount(false);
    setShowChat(false);
  };

  const openMcp = () => {
    console.log("[DEBUG] MCP button clicked directly");
    setShowSettings(false);
    setShowHistory(false);
    setShowMcp(true);
    setShowAccount(false);
    setShowChat(false);
  };

  const openChat = () => {
    console.log("[DEBUG] Chat button clicked directly");
    setShowSettings(false);
    setShowHistory(false);
    closeMcpView();
    setShowAccount(false);
    setShowChat(true);
  };

  return (
    <>
      {showWelcome ? (
        <WelcomeView />
      ) : (
        <>
          {/* Navigation bar with mode toggle and feature buttons */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: `${VIEW_TOP_SPACING}px`,
              backgroundColor: "var(--vscode-panel-background)",
              zIndex: 100,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Navigation
              openSettings={openSettings}
              openHistory={openHistory}
              openMcp={openMcp}
              openChat={openChat}
              showSettings={showSettings}
              showHistory={showHistory}
              showMcp={showMcp}
              showChat={showChat}
            />
          </div>

          {showSettings && <SettingsView onDone={hideSettings} />}
          {showHistory && <HistoryView onDone={() => setShowHistory(false)} />}
          {showMcp && <McpView initialTab={mcpTab} onDone={closeMcpView} />}
          {showAccount && <AccountView onDone={() => setShowAccount(false)} />}
          {/* Do not conditionally load ChatView, it's expensive and there's state we don't want to lose (user input, disableInput, askResponse promise, etc.) */}
          <ChatView
            showHistoryView={() => {
              console.log("[DEBUG] Showing history view from ChatView");
              setShowSettings(false);
              closeMcpView();
              setShowAccount(false);
              setShowHistory(true);
              setShowChat(false);
            }}
            isHidden={
              showSettings || showHistory || showMcp || showAccount || !showChat
            }
            showAnnouncement={showAnnouncement}
            hideAnnouncement={() => {
              console.log("[DEBUG] Hiding announcement");
              setShowAnnouncement(false);
            }}
          />
        </>
      )}
    </>
  );
};

// const App = () => {
//   console.log("[DEBUG] App component rendering");
//   return (
//     <div>Hello</div>
//     // <Providers>
//     // {/* <AppContent /> */}
//     // </Providers>
//   );
// };

export default AppContent;
// export default App;
