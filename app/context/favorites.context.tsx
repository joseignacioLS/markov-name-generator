"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { EPredictor, IPrediction } from "../types";
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

  const storeFavs = (favs: IPrediction[]) => {
    const stored = recover("markov-names");
    stored.favs = favs;
    store("markov-names", stored);
  };

  const addFav = (fav: IPrediction) => {
    setFavorites((oldState) => {
      const newState = [fav, ...oldState];
      storeFavs(newState);
      return newState;
    });
  };

  const removeFav = (id: number) => {
    setFavorites((oldState) => {
      const newState = oldState.filter((v) => v.id !== id);
      storeFavs(newState);
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
    if (!recovered?.favs) return;
    setFavorites(
      recovered.favs.map((r: any) =>
        r.method ? r : { ...r, method: EPredictor.MARKOV }
      )
    );
  }, []);

  return (
    <favoritesContext.Provider value={{ favorites, handleFav, isFav }}>
      {children}
    </favoritesContext.Provider>
  );
};
