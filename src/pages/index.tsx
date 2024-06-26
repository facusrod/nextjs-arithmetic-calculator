import type { NextPage } from 'next';
import { useAuth } from '@/context/authcontext';

const Home: NextPage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">Welcome</h1>
        {user ? (
          <div>
            <p className="text-lg text-gray-700 mb-6">
              Welcome back, {user.username}!
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-700 mb-6">
            Welcome to the Home page. Please log in to access your account.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;