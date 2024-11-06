import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import './index.scss';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const nav = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleResetPassword = () => {
    // Handle the logic for resetting the password here.
    // You can add validation and make API requests as needed.
    // If successful, advance to the next step.
    // For demonstration, let's just advance to the next step immediately.
    setStep(step + 1);
  };

  const renderEmailInput = () => (
    <>
      <div className="d-flex flex-column pt-4 pb-4">
        <span className="fs-5 fw-bold pt-2 pb-2">Email</span>
        <InputText
          className="yellow-on-focus"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div className="d-grid gap-2 pt-4 pb-4">
        <button
          type="button"
          className="btn btn-wild-primary btn-large fw-bold fs-5"
          onClick={handleResetPassword}
        >
          Forgot Password
        </button>
      </div>
      <div className="d-flex justify-content-start pt-3 pb-3">
        <span className="fs-5 redirect-text" aria-hidden="true" onClick={() => nav(-1)}>
          Back to Login
        </span>
      </div>
    </>
  );

  const renderResetPassword = () => (
    <>
      <div className="d-flex flex-column pt-4 pb-4">
        <span className="fs-5 fw-bold pt-2 pb-2">New Password</span>
        <InputText
          className="yellow-on-focus"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
      </div>
      <div className="d-flex flex-column pt-3 pb-3">
        <span className="fs-5 fw-bold pb-2">Confirm New Password</span>
        <InputText
          className="yellow-on-focus"
          type="password"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
        />
      </div>
      <div className="d-grid gap-2 pt-4 pb-4">
        <button
          type="button"
          className="btn btn-wild-primary btn-large fw-bold fs-5"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
      <div className="d-flex justify-content-start pt-3">
        <span
          className="fs-5 redirect-text"
          role="button"
          tabIndex={0}
          aria-hidden="true"
          onClick={() => setStep(1)}
        >
          Back
        </span>
      </div>
    </>
  );

  return (
    <>
      <div className="app-name">
        <span className="wild fs-3 fw-bold">Wild</span>
        <span className="fs-3 fw-bolder">FORGE</span>
      </div>
      <div className="login-container">
        <div className="form">
          <span className="fs-3 fw-bold pb-3">Forgot Password</span>
          {step === 1 ? renderEmailInput() : renderResetPassword()}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
