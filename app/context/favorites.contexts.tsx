"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { IPrediction } from "../types";
import { recover, store } from "../services/localstorage.service";

interface IValue {
  favorites: IPrediction[];
  handleFav: (value: IPrediction) => void;
  isFav: (value: string) => boolean;
}

export const favoritesContext = createContext<IValue>({
  favorites: [],
  handleFav: (value: IPrediction) => {},
  isFav: (value: string) => false,
});

interface IProps {
  children: ReactNode;
}
export const FavoritesProvider = ({ children }: IProps) => {
  const [favorites, setFavorites] = useState<IPrediction[]>([]);

  const addFav = (fav: IPrediction) => {
    setFavorites((oldState) => {
      const newState = [fav, ...oldState];
      store("markov-names", { 0: newState });
      return newState;
    });
  };

  const removeFav = (id: number) => {
    setFavorites((oldState) => {
      const newState = oldState.filter((v) => v.id !== id);
      store("markov-names", { 0: newState });
      return newState;
    });
  };

  const handleFav = (prediction: IPrediction) => {
    if (isFav(prediction.value)) {
      removeFav(prediction.id);
    } else {
      addFav(prediction);
    }
  };

  const isFav = (value: string): boolean => {
    return favorites.find((f) => f.value === value) !== undefined;
  };

  useEffect(() => {
    const recovered = recover("markov-names");
    if (!recovered?.[0]) return;
    setFavorites(recovered[0]);
  }, []);

  return (
    <favoritesContext.Provider value={{ favorites, handleFav, isFav }}>
      {children}
    </favoritesContext.Provider>
  );
};
