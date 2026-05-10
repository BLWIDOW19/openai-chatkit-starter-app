import { useMemo, useCallback } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createClientSecretFetcher, workflowId } from "../lib/chatkitSession";

export function ChatKitPanel() {
  const groupId = new URLSearchParams(window.location.search).get("group");
  const storageKey = groupId ? `chatkit_thread_${groupId}` : null;
  const savedThread = storageKey ? localStorage.getItem(storageKey) : null;

  const getClientSecret = useMemo(
    () => createClientSecretFetcher(workflowId),
    []
  );

  const handleThreadChange = useCallback(
    ({ threadId }: { threadId: string | null }) => {
      if (storageKey && threadId) {
        localStorage.setItem(storageKey, threadId);
      }
    },
    [storageKey]
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    initialThread: savedThread ?? undefined,
    onThreadChange: handleThreadChange,
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