import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from '../styles/home.module.css';

const SignInForm = dynamic(() => import('../components/SignInForm'));
const Home: NextPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  return (
    <div className={styles.container}>
      {!isLogin && <SignInForm onSuccess={() => setIsLogin(true)} />}
      {isLogin && <div>login success!</div>}
    </div>
  );
};

export default Home;
