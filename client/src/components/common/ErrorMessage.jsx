/**
 * Displays a clean, grounded alert for API/form errors.
 * @param {string} message - Error message to display
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
      <i className="bi bi-exclamation-circle-fill me-2 flex-shrink-0" aria-hidden="true" />
      <div>{message}</div>
    </div>
  );
};

export default ErrorMessage;
