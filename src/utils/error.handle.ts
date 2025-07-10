import { AxiosError } from "axios";

// utils/errorHandler.ts
export const getErrorMessage = (error): string => {
    let errorMessage = 'An unexpected error occurred';
    if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: { data: { message: string } } };
        return httpError.response?.data?.message || 'Request failed';
    }

    if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return errorMessage;
};