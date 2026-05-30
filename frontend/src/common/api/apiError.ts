type ApiFailure = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  return (error as ApiFailure)?.response?.data?.message ?? fallbackMessage;
}
