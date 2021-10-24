import React from 'react';

const Error = ({ errorMessage }) => {
  return (
    <div>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

export default Error;
