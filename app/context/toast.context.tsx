"use client";

import { createContext, ReactNode, useState } from "react";
import { generateId } from "../utils/other";

export enum EToastType {
  MSG,
  WRN,
  ERR,
}

export interface IToast {
  id: number;
  message: string;
  type: EToastType;
  expired: boolean;
}

interface IValue {
  messages: IToast[];
  addToast: (message: string, type?: IToast["type"]) => void;
  removeToast: (id: number) => void;
}

export const toastContext = createContext<IValue>({
  messages: [],
  addToast: (message: string, type?: IToast["type"]) => {},
  removeToast: (id: number) => {},
});

interface IProps {
  children: ReactNode;
}
export const ToastProvider = ({ children }: IProps) => {
  const [messages, setMessages] = useState<IToast[]>([]);

  const removeToast = (id: number) => {
    setMessages((oldState) => {
      return [
        ...oldState.map((m) => (m.id === id ? { ...m, expired: true } : m)),
      ];
    });
  };

  const addToast = (message: string, type?: IToast["type"]) => {
    const id = generateId();
    setMessages((oldState) => {
      const newState = [
        ...oldState.filter((v) => !v.expired),
        { id, message, type: type || EToastType.MSG, expired: false },
      ];
      const visibleToastPrev = newState.findIndex((v) => v.id === id);
      setTimeout(() => {
        removeToast(id);
      }, 4000 + 500 * visibleToastPrev);
      return newState;
    });
  };
  return (
    <toastContext.Provider value={{ messages, addToast, removeToast }}>
      {children}
    </toastContext.Provider>
  );
};
