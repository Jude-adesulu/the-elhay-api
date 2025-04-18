export enum ResponseMessagesEnum {
    // Success messages
    LOGIN_SUCCESS = "Login successful",
    SIGNUP_SUCCESS = "Signup successful. Please check your mail for a link to verify your account",
    SUCCESS = "Request was successful",
    UPDATE_SUCCESS = "Update successful",
    CREATED = "Created successfully",
    TOKEN_VERIFIED = "Token verified successfully",
    PASSWORD_RESET_SUCCESS = "Successfully changed password",
    PASSWORD_RESET_INITIATED = "Success! We will send a recovery email to this address if it exists",

    // Error messages
    LOGIN_WITH_GOOGLE = "'Continue with Google' or 'Forgot password' to continue",
    INVALID_USER = "Invalid user account",
    EMAIL_ALREADY_EXISTS = "Email already exists",
    EMAIL_NOT_FOUND = "Email doesn't exists",
    ACCOUNT_NOT_FOUND = "Account not found",
    ACCOUNT_CLOSED = "Account closed successfully",
    PASSWORD_MISMATCH = "Password does not match",
    INVALID_DETAILS = "Invalid details passed",
    INVALID_TOKEN = "Invalid or expired token",
    BAD_REQUEST = "Bad request",
    UNAUTHORIZED = "Unauthorized. Please login",
    PASSWORD_EXISTS = "Please use a new password",
    USER_PERMISSION_DENIED = "You do not have permission to do this",
    NOT_FOUND = "Record not found",
    FORBIDDEN = "Forbidden resource",
    SIGNUP_FAILED = "Failed to create account",
    LOGIN_WITH_GOOGLE_FAILED = "Failed to login with Google",
    INVALID_GOOGLE_DATA = "Invalid Google user data",

    // Server messages
    SERVER_ERROR = "Internal server error. Contact developer",
    TOO_MANY_REQUESTS = "Too Many Requests. Try again later",
    ADMIN_UNAUTHORIZED_ACCESS = "Access not authorized 😒",
}
