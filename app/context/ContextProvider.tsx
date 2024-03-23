import { ReactNode } from "react";
import { ToastProvider } from "./toast.context";
import { ModalProvider } from "./modal.context";
import { FavoritesProvider } from "./favorites.contexts";

interface IProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: IProps) => {
  return (
    <ToastProvider>
      <ModalProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </ModalProvider>
    </ToastProvider>
  );
};

export default ContextProvider;
