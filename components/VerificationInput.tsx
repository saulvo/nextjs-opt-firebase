import React, { useRef, useState } from 'react';
import styles from '../styles/verification-input.module.css';

interface Props {
  code: string;
  onChange: (value: string) => void;
}

const VerificationInput: React.FC<Props> = ({code, onChange}) => {
  const maxLengthCode = 6;
  const codeDigitsArray = [...new Array(maxLengthCode)];
  const inputRef = useRef<HTMLInputElement>(null);

  const toCodeDigitInput = (_value: any, index: number) => {
    const emptyInputChar = ' ';
    const digit = code[index] || emptyInputChar;

    // formatting
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLengthCode - 1;
    const isCodeFull = code.length === maxLengthCode - 1;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <li
        className={styles.li}
        key={index}
        style={isDigitFocused ? { ['--active-color' as string]: 'var(--primary-color)' } : {}}>
        {digit}
      </li>
    );
  };

  const handleFocusInput = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <div className={styles.box} onClick={handleFocusInput}>
      <input
        className={styles.input}
        ref={inputRef}
        name='code'
        maxLength={maxLengthCode}
        value={code}
        onChange={(e) => onChange(e.target.value.trim())}
      />
      <ul className={styles.ul}>{codeDigitsArray.map(toCodeDigitInput)}</ul>
    </div>
  );
};

export default VerificationInput;
