/**
 * CustomError is an extension of the standard Error class, designed to provide
 * additional context and information about errors that occur within the application.
 * 
 * This class includes additional properties such as `statusCode`, `details`, and
 * an optional nested `error` object to encapsulate more detailed error information.
 * 
 * The `statusCode` property is particularly useful for HTTP-based applications where
 * different types of errors need to be communicated with specific HTTP status codes.
 * 
 * The `details` property can be used to provide more granular information about the
 * error, which can be useful for debugging or logging purposes.
 * 
 * The `error` property allows for nesting of errors, enabling the capture of an
 * original error that may have been caught and re-thrown with additional context.
 * 
 * @extends Error
 * 
 * @property {string} message - A human-readable description of the error.
 * @property {Error} [error] - An optional nested error object for additional context.
 * @property {string} [details] - Additional details about the error.
 * @property {number} [statusCode] - An optional HTTP status code associated with the error.
 * 
 * @constructor
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @param {string} message - A human-readable description of the error.
 * @param {string} [details] - Additional details about the error.
 * @param {Error} [error] - An optional nested error object for additional context.
 */
class CustomError extends Error {
    message: string;
    error?: Error;
    details?: string;
    statusCode?: number;
  
    constructor(statusCode: number, message: string, details?: string, error?: Error) {
      // Call the parent class constructor (Error) to ensure the error is properly handled
      super(message);
  
      // Set the name of the error as the name of the class to better identify the type of error
      this.name = this.constructor.name;
  
      // Initialize the specific fields of the CustomError class
      this.message = message;
      this.error = error || undefined;
      this.details = details || '';
      this.statusCode = statusCode;
  
      // Capture the stack trace, but only in development environments
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
    }
  }
  export {CustomError}