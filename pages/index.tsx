import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "../styles/home.module.css";
import "../components/firebaseConfig";
const SignInForm = dynamic(() => import("../components/SignInForm"));
const Users = dynamic(() => import("../components/Users"));

const Home: NextPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {!isLogin && <SignInForm onSuccess={() => setIsLogin(true)} />}
      {isLogin && <Users />}
    </div>
  );
};

export default Home;
