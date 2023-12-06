import React from "react";

const Field = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error = "",
}) => {
  return (
    <div className="form-group mr-sm-2 btn-sm">
      <label htmlFor={name}>{label}</label>
      <input
        onChange={onChange}
        value={value}
        id={name}
        placeholder={placeholder}
        type={type}
        name={name}
        className={"form-control" + (error && " is-invalid")}
      />
      {error && <p className="invalide-feedback">{error}</p>}
    </div>
  );
};

export default Field;
