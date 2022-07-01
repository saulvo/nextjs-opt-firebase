import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../styles/form.module.css";
import Select, { Option, options } from "./Select";
import VerificationInput from "./VerificationInput";
import { collection, getFirestore, addDoc } from "firebase/firestore";
interface Props {
  onSuccess: () => void;
}

const SignInForm: React.FC<Props> = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirmResult, setConfirmResult] = useState<any>();
  const [error, setError] = useState<boolean>(false);
  const [isSend, setIsSend] = useState<boolean>(false);
  const [verficationCode, setVerificationCode] = useState("");
  const [phoneAreaCode, setPhoneAreaCode] = useState<Option>(options[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const auth = getAuth();
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log(response);
          },
        },
        auth
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
        appVerifier
      );
      setConfirmResult(confirmationResult);
      setIsSend(true);
    } catch (error) {
      console.log("SMS not sent", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (verficationCode.length === 6) {
      try {
        setIsSubmitting(true);
        const res = await confirmResult.confirm(verficationCode);
        const user = res.user;

        const db = getFirestore();
        const colRef: any = collection(db, "users");
        addDoc(colRef, {
          username: user.phoneNumber,
          email: "",
          profile_picture: "",
        });
        onSuccess();
      } catch (error) {
        console.log("bad verification code", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Please enter a 6 digit OTP code.");
    }
  };

  return (
    <div className={styles.formWrap}>
      <div className={styles.banner}>
        <Image src="/welcome.svg" alt="welcome" width={768} height={397} />
      </div>
      {!isSend && (
        <>
          <h1 className={styles.h1}>Get going with My App</h1>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <Select option={phoneAreaCode} onChange={setPhoneAreaCode} />
            <div className={styles.wrapInput}>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your mobile phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <span
                className={styles.line}
                style={error ? { ["--error-color" as string]: "#ff0000" } : {}}
              ></span>
            </div>
            {error && (
              <p className={styles.errorPhone}>Invalid phone number!</p>
            )}
            {!isSubmitting && (
              <button type="submit" className={styles.button}>
                Next
              </button>
            )}
            {isSubmitting && (
              <button type="button" className={styles.button}>
                Wait...
              </button>
            )}
          </form>
        </>
      )}
      {isSend && (
        <form onSubmit={handleVerifyCode}>
          <h1 className={styles.h1}>
            Enter 6 digit verification code sent to your number
          </h1>
          <VerificationInput
            code={verficationCode}
            onChange={setVerificationCode}
          />
          <button
            type={!isSubmitting ? "submit" : "button"}
            className={styles.button}
          >
            {!isSubmitting ? "Verify" : "Wait..."}
          </button>
        </form>
      )}
      <div id="recaptcha-container"></div>
      <p className={styles.author}>
        -- Created by&nbsp;<a href="https://github.com/sonvt-fe">Saul Vo</a>
        &nbsp;😍 --
      </p>
    </div>
  );
};

export default SignInForm;
