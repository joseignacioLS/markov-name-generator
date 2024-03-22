"use client";

import { createContext, ReactNode, useState } from "react";
import { generateId } from "../utils/other";

export interface IToast {
  id: number;
  message: string;
  type: "msg" | "wrn" | "err";
  expired: boolean;
}

interface IValue {
  messages: IToast[];
  addToast: (message: string, type?: IToast["type"]) => void;
}

export const toastContext = createContext<IValue>({
  messages: [],
  addToast: (message: string, type?: IToast["type"]) => {},
});

interface IProps {
  children: ReactNode;
}
export const ToastProvider = ({ children }: IProps) => {
  const [messages, setMessages] = useState<IToast[]>([]);

  const removeToast = (id: number) => {
    setMessages((oldState) => {
      const message = oldState.find((m) => m.id === id);
      if (!message) return oldState;
      return [
        ...oldState.filter((m) => m.id !== id),
        { ...message, expired: true },
      ];
    });
  };

  const addToast = (message: string, type?: IToast["type"]) => {
    const id = generateId();
    setMessages((oldState) => {
      return [
        { id, message, type: type || "msg", expired: false },
        ...oldState.filter((v) => !v.expired),
      ];
    });

    setTimeout(() => {
      removeToast(id);
    }, 2000);
  };
  return (
    <toastContext.Provider value={{ messages, addToast }}>
      {children}
    </toastContext.Provider>
  );
};
