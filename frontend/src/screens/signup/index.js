import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';

import { useAuth } from '../../contexts/AuthContext';
import { useAcquireTokens, useSignup } from '../../hooks';

import ControlInput from '../../components/controlinput';

import GLOBALS from '../../app_globals';
import { isObjectEmpty } from '../../utils/object';
import { isValidEmail } from '../../utils/strings';

import './index.scss';

const validateName = (values) => {
  const errors = {};

  if (!values.first_name) {
    errors.first_name = 'This first name is required.';
  } else if (values.first_name.length > 50) {
    errors.first_name = 'The maximum length of this field is 50 characters.';
  }

  if (!values.last_name) {
    errors.last_name = 'This last name is required.';
  } else if (values.last_name.length > 50) {
    errors.last_name = 'The maximum length of this field is 50 characters.';
  }

  return errors;
};

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'This email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Email address must be valid.';
  } else if (values.email.length > 50) {
    errors.email = 'The maximum length of this field is 50 characters.';
  }

  if (!values.password) {
    errors.password = 'This password is required.';
  } else if (values.password.length > 50) {
    errors.password = 'The maximum length of this field is 50 characters.';
  } else if (!/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(values.password)) {
    errors.password =
      'The password must have at least eight characters, one letter, and one number';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'This confirm password is required.';
  } else if (values.password && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'This  must match with your password.';
  }

  return errors;
};

function Signup() {
  const [step, setStep] = useState(1);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const { setAccessToken, setRefreshToken } = useAuth();
  const { signupUser } = useSignup();
  const { acquireTokens } = useAcquireTokens();

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep1 = (values, setFieldValue) => (
    <>
      <ControlInput
        className="yellow-on-focus"
        label="First Name"
        name="firstName"
        value={values.first_name}
        onChange={(e) => setFieldValue('first_name', e.target.value)}
      />
      {firstNameError && <div className="error">{firstNameError}</div>}
      <ControlInput
        className="yellow-on-focus"
        label="Last Name"
        name="lastName"
        value={values.last_name}
        onChange={(e) => setFieldValue('last_name', e.target.value)}
      />
      {lastNameError && <div className="error">{lastNameError}</div>}
      <div className="d-grid gap-4 pt-3 pb-3">
        <button
          type="button"
          className="btn btn-wild-primary btn-large fw-bold fs-5"
          onClick={(e) => {
            e.preventDefault();
            const name_errors = validateName(values);
            if (name_errors.first_name || name_errors.last_name) {
              setFirstNameError(name_errors.first_name);
              setLastNameError(name_errors.last_name);
            } else {
              setFirstNameError('');
              setLastNameError('');
              nextStep();
            }
          }}
        >
          Sign Up as Student
        </button>
        <button
          type="button"
          className="btn btn-wild-secondary btn-large fw-bold fs-5"
          onClick={(e) => {
            e.preventDefault();
            const name_errors = validateName(values);
            if (name_errors.first_name || name_errors.last_name) {
              setFirstNameError(name_errors.first_name);
              setLastNameError(name_errors.last_name);
            } else {
              setFirstNameError('');
              setLastNameError('');
              setFieldValue('role', GLOBALS.USER_ROLE.MODERATOR);
              nextStep();
            }
          }}
        >
          Sign Up as Teacher
        </button>
      </div>
      <div className="d-flex justify-content-center pt-3 pb-3">
        <span className="fs-5">
          Already have an account?{' '}
          <Link to="/login" className="redirect-text">
            Login
          </Link>
        </span>
      </div>
    </>
  );

  const renderStep2 = (values, errors, setFieldValue) => (
    <>
      <ControlInput
        className="yellow-on-focus"
        name="email"
        label="Email"
        value={values.email}
        onChange={(e) => setFieldValue('email', e.target.value)}
        error={errors.email}
      />

      <ControlInput
        className="yellow-on-focus"
        type="password"
        name="password"
        label="Password"
        value={values.password}
        onChange={(e) => setFieldValue('password', e.target.value)}
        error={errors.password}
      />

      <ControlInput
        className="yellow-on-focus"
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
        value={values.confirmPassword}
        error={errors.confirmPassword}
      />

      {errors.overall && (
        <div className="d-flex justify-content-center pt-2 pb-1">
          <span className="fs-6 text-danger">{errors.overall}</span>
        </div>
      )}

      <div className="d-grid gap-4 pt-3 pb-2">
        <button type="submit" className="btn btn-wild-primary btn-large fw-bold fs-5">
          Sign Up
        </button>
      </div>
      <div className="d-flex justify-content-start pt-3 pb-3">
        <span className="fs-5 redirect-text" aria-hidden="true" onClick={prevStep}>
          Go Back
        </span>
      </div>
    </>
  );

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <div className="app-name">
        <span className="wild fs-3 fw-bold">Wild</span>
        <span className="fs-3 fw-bolder">FORGE</span>
      </div>
      <div className="login-container">
        <div className="login-form">
          <span className="fs-3 fw-bold pb-2">Sign Up</span>
          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: GLOBALS.USER_ROLE.BASIC,
            }}
            onSubmit={async (values, { setErrors }) => {
              const errors = validate(values);
              if (!isObjectEmpty(errors)) {
                setErrors(errors);
                return;
              }

              const acquireTokensCallbacks = {
                acquired: async ({ accessToken, refreshToken }) => {
                  setAccessToken(accessToken);
                  setRefreshToken(refreshToken);
                },
                invalidFields: () =>
                  setErrors({
                    overall: 'Invalid email address and/or password.',
                  }),
                internalError: () =>
                  setErrors({
                    overall: 'Oops, something went wrong.',
                  }),
              };

              const signupUserCallbacks = {
                signedUp: async ({ retrievedUser }) => {
                  await acquireTokens({
                    email: values.email,
                    password: values.password,
                    callbacks: acquireTokensCallbacks,
                  });
                },
                emailExists: () =>
                  setErrors({
                    overall: 'User already exists.',
                  }),
                internalError: () =>
                  setErrors({
                    overall: 'Oops, something went wrong.',
                  }),
              };

              // Signup user
              await signupUser({
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password,
                role: values.role,
                callbacks: signupUserCallbacks,
              });
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                {step === 1
                  ? renderStep1(values, setFieldValue)
                  : renderStep2(values, errors, setFieldValue)}
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Signup;
