import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number,
  username: string
}

const NavBar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ id: decoded.userId, username: decoded.username });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navigateTo = (path: string) => {
    router.push(path);
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
          <a
            href="#"
            onClick={() => navigateTo('/account')}
            className="text-gray-700 font-semibold hover:text-gray-900"
          >
            Account
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-gray-700 font-semibold">
              {user.username}
            </div>
          )}
          <button onClick={handleLogout} className="text-red-500 font-semibold">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;