import { useAuth } from '@/context/authcontext';
import { UserAPI } from '@/network/api';
import { Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8"></div>
  </div>
);

const Login: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    setIsLoading(true);
    if (!isRegister) {
      UserAPI.loginUser(
        email,
        password,
      ).then(data => {
        localStorage.setItem('token', data.token)
        login({ username: email }); // username is the email for simplicity
        router.push('/');
      }).catch(err => {
        setLoginError(err.response.data.message);
        setIsLoading(false);
      })
    } else {
      UserAPI.registerUser(
        email,
        password,
      ).then(data => {
        localStorage.setItem('token', data.token)
        login({ username: email });
        router.push('/');
      }).catch(err => {
        setLoginError(err.response.data.message);
        setIsLoading(false);
      });
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required')
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {!isRegister ? (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleLogin(values.email, values.password);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field name="email" type="email" className="mt-1 p-2 block w-full border rounded-md" />
                    {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field name="password" type="password" className="mt-1 p-2 block w-full border rounded-md" />
                    {errors.password && touched.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                  </div>
                  <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-700" disabled={isLoading}>
                    Login
                  </button>
                  {isLoading && <div className="mt-4"><Spinner /></div>}
                  {loginError && <div className="text-red-500 text-sm mt-4 text-center">{loginError}</div>}
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                handleLogin(values.email, values.password);
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <Field name="email" type="email" className="mt-1 p-2 block w-full border rounded-md" />
                    {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <Field name="password" type="password" className="mt-1 p-2 block w-full border rounded-md" />
                    {errors.password && touched.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                  </div>
                  <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-700" disabled={isLoading}>
                    Register
                  </button>
                  {isLoading && <div className="mt-4"><Spinner /></div>}
                  {loginError && <div className="text-red-500 text-sm mt-4 text-center">{loginError}</div>}
                </Form>
              )}
            </Formik>
          </div>
        )}
        <div className="mt-4 text-center">
          {!isRegister ? (
            <a
              href="#"
              onClick={() => setIsRegister(true)}
              className="text-blue-500 hover:underline"
            >
              Do not have an account? Register
            </a>
          ) : (
            <a
              href="#"
              onClick={() => setIsRegister(false)}
              className="text-blue-500 hover:underline"
            >
              Already have an account? Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;