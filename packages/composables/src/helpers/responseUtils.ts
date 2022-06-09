export const checkResponseForError = (response: any): void => {
  if (response?.responseStatus?.errorCode) {
    const error = new Error(response.responseStatus.message);
    error.name = response.responseStatus.errorCode;
    throw error;
  }
};
  