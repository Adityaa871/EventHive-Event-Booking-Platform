/**
 * Displays a Bootstrap alert for API/form errors.
 * @param {string} message - Error message to display
 */
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="alert alert-danger" role="alert">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {message}
    </div>
  );
};

export default ErrorMessage;

