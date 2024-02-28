import React from "react";
import "./InputForm.css";

function InputForm({ title, submitFunction, children }) {
  return (
    <div className="card" data-step="1">
      <h3 className="step-title">{title}</h3>
      {children}
      <div className="button-row">
        <div className="flex-row">
          {submitFunction && (
            <form className="form" onSubmit={submitFunction}>
              <button>Submit</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputForm;
