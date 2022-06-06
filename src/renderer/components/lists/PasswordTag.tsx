import { useState } from 'react';

interface Props {
  content: string;
  iv: string;
}

const PasswordTag = ({ content, iv }: Props) => {
  const [passwordShown, setPasswordShown] = useState('**************');

  const startActive = () => {
    const decrypted = window.cipher.decrypt(iv, content);
    setPasswordShown(decrypted);
  };

  const stopActive = () => {
    setPasswordShown('**************');
  };

  return (
    <p
      className="mt-1 font-light cursor-pointer text-ksv-light-gray min-w-[10rem]"
      onMouseDown={startActive}
      onMouseUp={stopActive}
      onMouseLeave={stopActive}
    >
      {passwordShown}
    </p>
  );
};

export default PasswordTag;
