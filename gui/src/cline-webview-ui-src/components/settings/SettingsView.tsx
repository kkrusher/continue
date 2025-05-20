import { ExtensionMessage } from "@shared/ExtensionMessage";
import {
  VSCodeButton,
  VSCodeCheckbox,
  VSCodeLink,
  VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import SettingsButton from "@webview-ui/components/common/SettingsButton";
import { useExtensionState } from "@webview-ui/context/ExtensionStateContext";
import {
  validateApiConfiguration,
  validateModelId,
} from "@webview-ui/utils/validate";
import { vscode } from "@webview-ui/utils/vscode";
import { memo, useCallback, useEffect, useState } from "react";
import { useEvent } from "react-use";
import { VIEW_TOP_SPACING } from "../../constants";
import { TabButton } from "../mcp/configuration/McpConfigurationView";
import ApiOptions from "./ApiOptions";
import BrowserSettingsSection from "./BrowserSettingsSection";
import TerminalSettingsSection from "./TerminalSettingsSection";
// const { IS_DEV } = process.env;
const IS_DEV = false;

type SettingsViewProps = {
  onDone: () => void;
};

const SettingsView = ({ onDone }: SettingsViewProps) => {
  const {
    apiConfiguration,
    version,
    customInstructions,
    setCustomInstructions,
    openRouterModels,
    telemetrySetting,
    setTelemetrySetting,
    chatSettings,
    planActSeparateModelsSetting,
    setPlanActSeparateModelsSetting,
  } = useExtensionState();
  const [apiErrorMessage, setApiErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [modelIdErrorMessage, setModelIdErrorMessage] = useState<
    string | undefined
  >(undefined);
  const [pendingTabChange, setPendingTabChange] = useState<
    "plan" | "act" | null
  >(null);

  const handleSubmit = (withoutDone: boolean = false) => {
    const apiValidationResult = validateApiConfiguration(apiConfiguration);
    const modelIdValidationResult = validateModelId(
      apiConfiguration,
      openRouterModels,
    );

    // setApiErrorMessage(apiValidationResult)
    // setModelIdErrorMessage(modelIdValidationResult)

    let apiConfigurationToSubmit = apiConfiguration;
    if (!apiValidationResult && !modelIdValidationResult) {
      // vscode.postMessage({ type: "apiConfiguration", apiConfiguration })
      // vscode.postMessage({
      // 	type: "customInstructions",
      // 	text: customInstructions,
      // })
      // vscode.postMessage({
      // 	type: "telemetrySetting",
      // 	text: telemetrySetting,
      // })
      // console.log("handleSubmit", withoutDone)
      // vscode.postMessage({
      // 	type: "separateModeSetting",
      // 	text: separateModeSetting,
      // })
    } else {
      // if the api configuration is invalid, we don't save it
      apiConfigurationToSubmit = undefined;
    }

    vscode.postMessage({
      type: "updateSettings",
      planActSeparateModelsSetting,
      customInstructionsSetting: customInstructions,
      telemetrySetting,
      apiConfiguration: apiConfigurationToSubmit,
    });

    if (!withoutDone) {
      onDone();
    }
  };

  useEffect(() => {
    setApiErrorMessage(undefined);
    setModelIdErrorMessage(undefined);
  }, [apiConfiguration]);

  // validate as soon as the component is mounted
  /*
	useEffect will use stale values of variables if they are not included in the dependency array. 
	so trying to use useEffect with a dependency array of only one value for example will use any 
	other variables' old values. In most cases you don't want this, and should opt to use react-use 
	hooks.
    
		// uses someVar and anotherVar
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [someVar])
	If we only want to run code once on mount we can use react-use's useEffectOnce or useMount
	*/

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const message: ExtensionMessage = event.data;
      switch (message.type) {
        case "didUpdateSettings":
          if (pendingTabChange) {
            vscode.postMessage({
              type: "togglePlanActMode",
              chatSettings: {
                mode: pendingTabChange,
              },
            });
            setPendingTabChange(null);
          }
          break;
        case "scrollToSettings":
          setTimeout(() => {
            const elementId = message.text;
            if (elementId) {
              const element = document.getElementById(elementId);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });

                element.style.transition = "background-color 0.5s ease";
                element.style.backgroundColor =
                  "var(--vscode-textPreformat-background)";

                setTimeout(() => {
                  element.style.backgroundColor = "transparent";
                }, 1200);
              }
            }
          }, 300);
          break;
      }
    },
    [pendingTabChange],
  );

  useEvent("message", handleMessage);

  const handleResetState = () => {
    vscode.postMessage({ type: "resetState" });
  };

  const handleTabChange = (tab: "plan" | "act") => {
    if (tab === chatSettings.mode) {
      return;
    }
    setPendingTabChange(tab);
    handleSubmit(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: VIEW_TOP_SPACING,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      className="flex flex-col overflow-hidden pb-0 pl-5 pr-0 pt-[10px]"
    >
      <div className="mb-[13px] flex items-center justify-between pr-[17px]">
        <h3 className="m-0 text-[var(--vscode-foreground)]">Settings</h3>
        <VSCodeButton onClick={() => handleSubmit(false)}>Save</VSCodeButton>
      </div>
      <div className="flex grow flex-col overflow-y-scroll pr-2">
        {/* Tabs container */}
        {planActSeparateModelsSetting ? (
          <div className="mb-5 rounded-md border border-solid border-[var(--vscode-panel-border)] bg-[var(--vscode-panel-background)] p-[10px]">
            <div className="-mt-2 mb-[10px] flex gap-[1px] border-0 border-b border-solid border-[var(--vscode-panel-border)]">
              <TabButton
                isActive={chatSettings.mode === "plan"}
                onClick={() => handleTabChange("plan")}
              >
                Plan Mode
              </TabButton>
              <TabButton
                isActive={chatSettings.mode === "act"}
                onClick={() => handleTabChange("act")}
              >
                Act Mode
              </TabButton>
            </div>

            {/* Content container */}
            <div className="-mb-3">
              <ApiOptions
                key={chatSettings.mode}
                showModelOptions={true}
                apiErrorMessage={apiErrorMessage}
                modelIdErrorMessage={modelIdErrorMessage}
              />
            </div>
          </div>
        ) : (
          <ApiOptions
            key={"single"}
            showModelOptions={true}
            apiErrorMessage={apiErrorMessage}
            modelIdErrorMessage={modelIdErrorMessage}
          />
        )}

        <div className="mb-[5px]">
          <VSCodeTextArea
            value={customInstructions ?? ""}
            className="w-full"
            resize="vertical"
            rows={4}
            placeholder={
              'e.g. "Run unit tests at the end", "Use TypeScript with async/await", "Speak in Spanish"'
            }
            onInput={(e: any) => setCustomInstructions(e.target?.value ?? "")}
          >
            <span className="font-medium">Custom Instructions</span>
          </VSCodeTextArea>
          <p className="mt-[5px] text-xs text-[var(--vscode-descriptionForeground)]">
            These instructions are added to the end of the system prompt sent
            with every request.
          </p>
        </div>

        <div className="mb-[5px]">
          <VSCodeCheckbox
            className="mb-[5px]"
            checked={planActSeparateModelsSetting}
            onChange={(e: any) => {
              const checked = e.target.checked === true;
              setPlanActSeparateModelsSetting(checked);
            }}
          >
            Use different models for Plan and Act modes
          </VSCodeCheckbox>
          <p className="mt-[5px] text-xs text-[var(--vscode-descriptionForeground)]">
            Switching between Plan and Act mode will persist the API and model
            used in the previous mode. This may be helpful e.g. when using a
            strong reasoning model to architect a plan for a cheaper coding
            model to act on.
          </p>
        </div>

        <div className="mb-[5px]">
          <VSCodeCheckbox
            className="mb-[5px]"
            checked={telemetrySetting === "enabled"}
            onChange={(e: any) => {
              const checked = e.target.checked === true;
              setTelemetrySetting(checked ? "enabled" : "disabled");
            }}
          >
            Allow anonymous error and usage reporting
          </VSCodeCheckbox>
          <p className="mt-[5px] text-xs text-[var(--vscode-descriptionForeground)]">
            Help improve Cline by sending anonymous usage data and error
            reports. No code, prompts, or personal information are ever sent.
            See our{" "}
            <VSCodeLink
              href="https://docs.cline.bot/more-info/telemetry"
              className="text-inherit"
            >
              telemetry overview
            </VSCodeLink>{" "}
            and{" "}
            <VSCodeLink
              href="https://cline.bot/privacy"
              className="text-inherit"
            >
              privacy policy
            </VSCodeLink>{" "}
            for more details.
          </p>
        </div>

        {/* Browser Settings Section */}
        <BrowserSettingsSection />

        {/* Terminal Settings Section */}
        <TerminalSettingsSection />

        <div className="mt-auto flex justify-center pr-2">
          <SettingsButton
            onClick={() =>
              vscode.postMessage({ type: "openExtensionSettings" })
            }
            className="mb-4 ml-0 mr-0 mt-0"
          >
            <i className="codicon codicon-settings-gear" />
            Advanced Settings
          </SettingsButton>
        </div>

        {IS_DEV && (
          <>
            <div className="mb-1 mt-[10px]">Debug</div>
            <VSCodeButton
              onClick={handleResetState}
              className="mt-[5px] w-auto"
              style={{
                backgroundColor: "var(--vscode-errorForeground)",
                color: "black",
              }}
            >
              Reset State
            </VSCodeButton>
            <p className="mt-[5px] text-xs text-[var(--vscode-descriptionForeground)]">
              This will reset all global state and secret storage in the
              extension.
            </p>
          </>
        )}

        <div className="mt-auto px-0 py-0 pb-[15px] pr-2 text-center text-xs leading-[1.2] text-[var(--vscode-descriptionForeground)]">
          <p className="m-0 break-words p-0">
            If you have any questions or feedback, feel free to open an issue at{" "}
            <VSCodeLink
              href="https://github.com/cline/cline"
              className="inline"
            >
              https://github.com/cline/cline
            </VSCodeLink>
          </p>
          <p className="mb-0 mt-[10px] p-0 italic">v{version}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsView);
