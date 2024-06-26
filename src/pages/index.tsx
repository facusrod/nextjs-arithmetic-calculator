import type { NextPage } from 'next';
import router from 'next/router';
import { useEffect } from 'react';
import Calculator from './calculator';

const Home: NextPage = () => {
  useEffect(() => {
    //Redirect to account page if authenticated
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, []);

  return (
    <Calculator></Calculator>
  );
};

export default Home;