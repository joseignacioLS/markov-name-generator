import { ReactNode } from "react";
import { ToastProvider } from "./toast.context";
import { ModalProvider } from "./modal.context";
import { FavoritesProvider } from "./favorites.context";
import { PredictorProvider } from "./predictor.context";

interface IProps {
  children: ReactNode;
}

const ContextProvider = ({ children }: IProps) => {
  return (
    <ToastProvider>
      <ModalProvider>
        <FavoritesProvider>
          <PredictorProvider>{children}</PredictorProvider>
        </FavoritesProvider>
      </ModalProvider>
    </ToastProvider>
  );
};

export default ContextProvider;
