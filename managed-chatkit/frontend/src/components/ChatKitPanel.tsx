import { useMemo } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

export function ChatKitPanel() {
  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    composer: {
      attachments: {
        enabled: true,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
      },
    },
});

  return (
    <div className="flex h-[100dvh] w-full bg-white transition-colors dark:bg-slate-900 md:h-[90vh] md:rounded-2xl md:shadow-sm">
      <ChatKit control={chatkit.control} className="h-full w-full" />
    </div>
  );
}