import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    verifyPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const isDisabled =
    !formValues.username.trim() ||
    !formValues.password.trim() ||
    !formValues.verifyPassword.trim();

  async function handleSubmit(event) {
    event.preventDefault();

    if (formValues.password !== formValues.verifyPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setErrorMessage("");
      await register({
        username: formValues.username,
        password: formValues.password,
      });
      navigate("/games");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="page card form-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="Choose username"
            value={formValues.username}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, username: event.target.value }))
            }
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formValues.password}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, password: event.target.value }))
            }
          />
        </label>
        <label>
          Verify Password
          <input
            type="password"
            name="verifyPassword"
            placeholder="Verify password"
            value={formValues.verifyPassword}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, verifyPassword: event.target.value }))
            }
          />
        </label>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <button type="submit" disabled={isDisabled}>
          Submit
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
