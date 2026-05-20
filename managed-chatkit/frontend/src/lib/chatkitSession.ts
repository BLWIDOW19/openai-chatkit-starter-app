const readEnvString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;

export const workflowId = (() => {
  const id = readEnvString(import.meta.env.VITE_CHATKIT_WORKFLOW_ID);
  if (!id || id.startsWith("wf_replace")) {
    throw new Error("Set VITE_CHATKIT_WORKFLOW_ID in your .env file.");
  }
  return id;
})();

export function createClientSecretFetcher(
  workflow: string,
  endpoint = `${import.meta.env.VITE_API_URL || ""}/api/create-session`
) {
  let secretExpiry: number | null = null;

  return async (currentSecret: string | null) => {
    const now = Date.now() / 1000;
    const isExpired = secretExpiry !== null && now > secretExpiry - 300;

    if (currentSecret && !isExpired) return currentSecret;

    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("group");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workflow: { id: workflow },
        ...(groupId ? { group_id: groupId } : {}),
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      client_secret?: string;
      expires_after?: { unix: number } | number;
      error?: string;
    };

    if (!response.ok) {
      throw new Error(payload.error ?? "Failed to create session");
    }

    if (!payload.client_secret) {
      throw new Error("Missing client secret in response");
    }

    if (payload.expires_after) {
      secretExpiry =
        typeof payload.expires_after === "number"
          ? payload.expires_after
          : payload.expires_after.unix;
    }

    return payload.client_secret;
  };
}