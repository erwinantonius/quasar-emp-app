import { AxiosError } from "axios";

// utils/errorHandler.ts
export const getErrorMessage = (error): string => {
    let errorMessage = 'An unexpected error occurred';
    switch (error.status) {
        case 401:
            errorMessage = 'Unauthorized access. Please log in again.';
            break;
        case 403:
            errorMessage = 'Forbidden access. You do not have permission to perform this action.';
            break;
        case 400:
            errorMessage = 'Bad request. Please check your input and try again.';
        default:
            break;
    }
    return errorMessage;
};