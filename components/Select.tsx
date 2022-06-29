import React, { useEffect, useState } from 'react';
import styles from '../styles/select.module.css';

export interface Option {
  value: string;
  label: string;
}
interface Props {
  option: Option;
  onChange: (option: Option) => void;
}

const Select: React.FC<Props> = ({ option, onChange }) => {
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener(
      'click',
      (e: any) => {
        if (!document.getElementById('select')?.contains(e.target)) {
          setIsFocus(false);
        }
      },
      { passive: true },
    );
  }, []);

  return (
    <div id='select' className={styles.select}>
      <input className={styles.input} value={option.label} onFocus={() => setIsFocus(true)} />
      <ul className={styles.ul} style={isFocus ? { ['--rotate' as string]: '0' } : {}}>
        {options.map((option, idx) => (
          <li
            className={styles.li}
            key={idx}
            onClick={() => {
              onChange(option);
              setIsFocus(false);
            }}>
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

export const options: Option[] = [
  {
    label: '+84',
    value: '84',
  },
  {
    label: '+58',
    value: '58',
  },
];
