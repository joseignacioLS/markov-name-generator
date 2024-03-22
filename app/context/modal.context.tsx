"use client";

import { createContext, ReactNode, useState } from "react";

interface IValue {
  content: ReactNode;
  showModal: (value: ReactNode) => void;
  hideModal: () => void;
  isShown: boolean;
}

export const modalContext = createContext<IValue>({
  content: undefined,
  showModal: (v: ReactNode) => {},
  hideModal: () => {},
  isShown: false,
});

interface IProps {
  children: ReactNode;
}
export const ModalProvider = ({ children }: IProps) => {
  const [isShown, setIsShown] = useState(false);
  const [content, setContent] = useState<ReactNode>(undefined);

  const showModal = (newContent: ReactNode) => {
    setIsShown(true);
    setContent(newContent);
  };

  const hideModal = () => {
    setIsShown(false);
    setContent(undefined);
  };
  return (
    <modalContext.Provider value={{ content, isShown, showModal, hideModal }}>
      {children}
    </modalContext.Provider>
  );
};
