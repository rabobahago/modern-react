import { useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import "./App.css";
interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}
function usePokemonSource(): {
  pokemon: Pokemon[];
  search: string;
  setSearch: (search: string) => void;
} {
  type PokemonState = {
    search: string;
  };
  const { data: pokemon } = useQuery<Pokemon[]>(
    ["pokemon"],
    () => fetch("/pokemon.json").then((res) => res.json()),
    { initialData: [] }
  );
  type PokemonAction = { type: "setSearch"; payload: string };
  const [{ search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setSearch":
          return { ...state, search: action.payload };
      }
    },
    {
      search: "",
    }
  );

  const setSearch = useCallback((search: string) => {
    dispatch({ type: "setSearch", payload: search });
  }, []);
  const filteredPokemon = useMemo(
    () =>
      pokemon
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 20),
    [pokemon, search]
  );
  return { pokemon: filteredPokemon, search, setSearch };
}
const PokemonConText = createContext<ReturnType<typeof usePokemonSource>>(
  {} as unknown as ReturnType<typeof usePokemonSource>
);
export const usePokemon = () => {
  return useContext(PokemonConText);
};

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const value = usePokemonSource();
  return (
    <PokemonConText.Provider value={value}>{children}</PokemonConText.Provider>
  );
}
