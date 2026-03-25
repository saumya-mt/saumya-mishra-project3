import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formValues, setFormValues] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const isDisabled = !formValues.username.trim() || !formValues.password.trim();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setErrorMessage("");
      await login(formValues);
      navigate("/games");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="page card form-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            placeholder="Enter username"
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
            placeholder="Enter password"
            value={formValues.password}
            onChange={(event) =>
              setFormValues((current) => ({ ...current, password: event.target.value }))
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

export default LoginPage;
