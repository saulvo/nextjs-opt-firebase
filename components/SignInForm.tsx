import { initializeApp } from '@firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from '../styles/form.module.css';
import Select, { Option, options } from './Select';
import VerificationInput from './VerificationInput';

// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyCO7yJmJFQyLHxFwJV7uizhVX4Kx5UZUCI',
  authDomain: 'fir-auth-web-b238b.firebaseapp.com',
  projectId: 'fir-auth-web-b238b',
  storageBucket: 'fir-auth-web-b238b.appspot.com',
  messagingSenderId: '632102097661',
  appId: '1:632102097661:web:b4538e843c7f552069e494',
};

interface Props {
  onSuccess: () => void;
}

const SignInForm: React.FC<Props> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [confirmResult, setConfirmResult] = useState<any>();
  const [error, setError] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [verficationCode, setVerificationCode] = useState('');
  const [phoneAreaCode, setPhoneAreaCode] = useState<Option>(options[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await initializeApp(firebaseConfig);
      const auth = getAuth();
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log(response);
          },
        },
        auth,
      );
    })();
  }, []);

  const validatePhoneNumber = () => {
    const phoneNumberRegex = /([3|5|7|8|9])+([0-9]{8})\b/g;
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!validatePhoneNumber()) {
        setError(true);
        return;
      }

      setError(false);
      setIsSubmitting(true);
      const auth = getAuth();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `${phoneAreaCode.label}${phoneNumber}`,
        appVerifier,
      );
      setConfirmResult(confirmationResult);
      setIsSend(true);
    } catch (error) {
      console.log('SMS not sent', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (verficationCode.length === 6) {
      confirmResult
        .confirm(verficationCode)
        .then((result: any) => {
          onSuccess();
        })
        .catch((error: any) => {
          console.log('bad verification code', error);
        });
    } else {
      alert('Please enter a 6 digit OTP code.');
    }
  };

  return (
    <div className={styles.formWrap}>
      <div className={styles.banner}>
        <Image src='/welcome.svg' alt='welcome' width={768} height={397} />
      </div>
      {!isSend && (
        <>
          <h1 className={styles.h1}>Get going with My App</h1>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <Select option={phoneAreaCode} onChange={setPhoneAreaCode} />
            <div className={styles.wrapInput}>
              <input
                type='text'
                className={styles.input}
                placeholder='Enter your mobile phone'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <span
                className={styles.line}
                style={error ? { ['--error-color' as string]: '#ff0000' } : {}}></span>
            </div>
            {error && (
              <p className={styles.errorPhone}>Invalid phone number!</p>
            )}
            {!isSubmitting && (
              <button type='submit' className={styles.button}>
                Next
              </button>
            )}
            {isSubmitting && (
              <button type='button' className={styles.button}>
                Wait...
              </button>
            )}
          </form>
        </>
      )}
      {isSend && (
        <form onSubmit={handleVerifyCode}>
          <h1 className={styles.h1}>Enter 6 digit verification code sent to your number</h1>
          <VerificationInput code={verficationCode} onChange={setVerificationCode} />
          <button type='submit' className={styles.button}>
            Verify
          </button>
        </form>
      )}
      <div id='recaptcha-container'></div>
      <p className={styles.author}>
        -- Created by&nbsp;<a href='https://github.com/sonvt-fe'>Saul Vo</a>&nbsp;😍 --
      </p>
    </div>
  );
};

export default SignInForm;
