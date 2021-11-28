import React from 'react';

const Error = ({ errorMessage }) => {
  return (
    <div
      className="alert alert-danger mt-2 p-2 d-flex align-items-center"
      role="alert"
    >
      <i className="bi bi-exclamation-triangle-fill"></i>
      {errorMessage}
    </div>
  );
};

export default Error;
