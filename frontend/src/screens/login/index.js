import { Link } from 'react-router-dom';
import { Formik } from 'formik';

import { useAuth } from '../../contexts/AuthContext';
import { useAcquireTokens } from '../../hooks';

import { isValidEmail } from '../../utils/strings';
import { isObjectEmpty } from '../../utils/object';

import ControlInput from '../../components/controlinput';

import './index.scss';

const validate = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'This field is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Email address must be valid.';
  } else if (values.email.length > 50) {
    errors.email = 'The maximum length of this field is 50 characters.';
  }

  if (!values.password) {
    errors.password = 'This field is required.';
  } else if (values.password.length > 50) {
    errors.password = 'The maximum length of this field is 50 characters.';
  }

  return errors;
};

function Login() {
  const { setAccessToken, setRefreshToken } = useAuth();
  const { isAcquiring, acquireTokens } = useAcquireTokens();

  return (
    <>
      <div className="app-name">
        <span className="wild fs-3 fw-bold">Wild</span>
        <span className="fs-3 fw-bolder">FORGE</span>
      </div>
      <div className="login-container">
        <div className="login-form">
          <span className="fs-3 fw-bold pb-3">Login</span>
          <Formik
            initialValues={{
              email: '',
              password: '',
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

              await acquireTokens({
                email: values.email,
                password: values.password,
                callbacks: acquireTokensCallbacks,
              });
            }}
          >
            {({ errors, values, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ControlInput
                  name="email"
                  label="Email"
                  className="yellow-on-focus"
                  value={values.email}
                  onChange={(e) => setFieldValue('email', e.target.value)}
                  error={errors.email}
                />
                <ControlInput
                  name="password"
                  label="Password"
                  type="password"
                  className="yellow-on-focus"
                  value={values.password}
                  onChange={(e) => setFieldValue('password', e.target.value)}
                  autoComplete="on"
                  error={errors.password}
                />
                <Link
                  to="/forgotpassword"
                  className="d-flex justify-content-end fs-6 redirect-text"
                >
                  Forgot Password
                </Link>
                {errors.overall && (
                  <div className="d-flex justify-content-center pt-2 pb-1">
                    <span className="fs-6 text-danger">{errors.overall}</span>
                  </div>
                )}
                <div className="d-grid gap-2 pt-3 pb-3">
                  <button
                    type="submit"
                    className="btn btn-wild-primary btn-large fw-bold fs-5"
                    disabled={isAcquiring}
                  >
                    {isAcquiring ? 'Logging In...' : 'Login'}
                  </button>
                </div>
              </form>
            )}
          </Formik>

          <div className="d-flex justify-content-center pt-3 pb-3">
            <span className="fs-5">
              Don't have an account?{' '}
              <Link to="/signup" className="redirect-text">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
