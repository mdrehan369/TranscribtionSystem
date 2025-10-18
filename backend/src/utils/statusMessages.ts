export const statusMessages: { [key: string]: any } = {
  success: "Operation completed successfully.",
  error: "An error occurred during the operation.",
  notFound: "The requested resource was not found.",
  unauthorized: "You are not authorized to perform this action.",
  badRequest: "The request was invalid or cannot be served.",

  auth: {
    invalidCredentials: "The provided credentials are invalid.",
    tokenExpired: "Your session has expired. Please log in again.",
    accessDenied: "You do not have permission to access this resource.",
    notLoggedIn: "You must be logged in to access this resource.",
  }
}
