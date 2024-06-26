import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/router';

const NavBar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    if (!user && (path === '/account' || path === '/calculator')) {
      router.push('/login');
    } else {
      router.push(path);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <a
            href="#"
            onClick={() => navigateTo('/')}
            className="text-gray-700 font-semibold hover:text-gray-900"
          >
            Home
          </a>
          {user && (
            <>
              <a
                href="#"
                onClick={() => navigateTo('/calculator')}
                className="text-gray-700 font-semibold hover:text-gray-900"
              >
                Calculator
              </a>
              <a
                href="#"
                onClick={() => navigateTo('/account')}
                className="text-gray-700 font-semibold hover:text-gray-900"
              >
                Account
              </a>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-gray-700 font-semibold">
                {user.username}
              </div>
              <button onClick={handleLogout} className="text-red-500 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => router.push('/login')} className="text-blue-500 font-semibold">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;