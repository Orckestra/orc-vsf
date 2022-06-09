import type { ResponseData } from '../types';
export const checkResponseForError = (response: ResponseData): void => {
  if (response?.responseStatus?.errorCode) {
    const error = new Error(response.responseStatus.message);
    error.name = response.responseStatus.errorCode;
    throw error;
  }
};
