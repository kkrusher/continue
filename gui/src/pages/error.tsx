import { ArrowPathIcon, FlagIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { DISCORD_LINK, GITHUB_LINK } from "core/util/constants";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useRouteError } from "react-router-dom";
import { Button, SecondaryButton } from "../components";
import { DiscordIcon } from "../components/svg/DiscordIcon";
import { GithubIcon } from "../components/svg/GithubIcon";
import { IdeMessengerContext } from "../context/IdeMessenger";
import { newSession } from "../redux/slices/sessionSlice";

const ErrorPage: React.FC = () => {
  const error: any = useRouteError();

  // 添加更详细的错误日志
  console.error("Detailed error information:", error);
  console.error("Error message:", error?.message);
  console.error("Error status:", error?.status);
  console.error("Error statusText:", error?.statusText);
  console.error("Error stack:", error?.stack);

  // 如果error是个对象，打印所有属性
  if (error && typeof error === "object") {
    console.error("All error properties:", Object.keys(error));

    // 尝试显示更详细的信息
    try {
      const errorStr = JSON.stringify(error, null, 2);
      console.error("Stringified error:", errorStr);

      // 将错误保存到localStorage中，方便调试
      localStorage.setItem("lastRouteError", errorStr);
      localStorage.setItem("lastRouteErrorTime", new Date().toISOString());
    } catch (e) {
      console.error("Could not stringify error:", e);
      localStorage.setItem("lastRouteErrorFailure", String(e));
    }
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const messenger = useContext(IdeMessengerContext);
  const openUrl = (url: string) => {
    if (messenger) {
      messenger.post("openUrl", url);
    }
  };

  const [initialLoad, setInitialLoad] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(false);
    }, 500);
  }, []);

  // 格式化错误信息为可读格式
  const formatErrorDetails = () => {
    try {
      if (!error) return "No error information available";

      let details = [];
      details.push(`Type: ${error.constructor?.name || typeof error}`);
      if (error.message) details.push(`Message: ${error.message}`);
      if (error.status) details.push(`Status: ${error.status}`);
      if (error.statusText) details.push(`Status Text: ${error.statusText}`);
      if (error.stack) details.push(`Stack Trace:\n${error.stack}`);

      if (error && typeof error === "object") {
        details.push(`Properties: ${Object.keys(error).join(", ")}`);
      }

      return details.join("\n\n");
    } catch (e) {
      return `Error parsing error: ${e}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-2 py-4 text-center sm:px-8">
      <h1 className="mb-4 text-3xl font-bold">Oops! Something went wrong</h1>

      <code className="whitespace-wrap mx-2 mb-4 max-w-full break-words py-2">
        {error.statusText || error.message || "Unknown error"}
      </code>

      <Button
        className="flex flex-row items-center gap-2"
        onClick={() => {
          dispatch(newSession());
          localStorage.removeItem("persist:root");
          localStorage.removeItem("inputHistory_chat");
          // localStorage.removeItem("showTutorialCard");
          // localStorage.removeItem("onboardingStatus");
          navigate("/");
        }}
      >
        {initialLoad ? (
          <FlagIcon className="h-5 w-5 text-red-600" />
        ) : (
          <ArrowPathIcon className="h-5 w-5" />
        )}
        Continue
      </Button>

      <div className="mt-6 w-full max-w-2xl">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between rounded bg-gray-700 px-4 py-2 text-left text-sm font-medium text-white"
        >
          <span>Error Details (for debugging)</span>
          {showDetails ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>

        {showDetails && (
          <pre className="mt-2 max-h-64 w-full overflow-auto rounded bg-gray-800 p-4 text-left text-xs text-white">
            {formatErrorDetails()}
          </pre>
        )}
      </div>

      <p className="mb-0 mt-6 text-lg">
        Report the issue on GitHub or Discord:
      </p>

      <div className="mt-2 flex flex-row flex-wrap justify-center gap-2">
        <SecondaryButton
          onClick={() => openUrl(GITHUB_LINK)}
          className="flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-base text-white"
        >
          <GithubIcon size={20} /> <span className="ml-2">GitHub</span>
        </SecondaryButton>
        <SecondaryButton
          onClick={() => openUrl(DISCORD_LINK)}
          className="flex items-center justify-center rounded-lg text-base"
        >
          <DiscordIcon size={20} /> <span className="ml-2">Discord</span>
        </SecondaryButton>
      </div>
    </div>
  );
};

export default ErrorPage;
