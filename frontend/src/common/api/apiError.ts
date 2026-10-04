export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (typeof data === "object" && data !== null && "message" in data &&
        typeof data.message === "string" && data.message.trim()) return data.message;
    }
  }
  return error instanceof Error && error.message.trim() ? error.message : fallbackMessage;
}
