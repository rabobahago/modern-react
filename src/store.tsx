import React, {
  useEffect,
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
  //   const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  //   const [search, setSearch] = useState("");
  type PokemonState = {
    pokemon: Pokemon[];
    search: string;
  };
  type PokemonAction =
    | { type: "setPokemon"; payload: Pokemon[] }
    | { type: "setSearch"; payload: string };
  const [{ pokemon, search }, dispatch] = useReducer(
    (state: PokemonState, action: PokemonAction) => {
      switch (action.type) {
        case "setPokemon":
          return { ...state, pokemon: action.payload };
        case "setSearch":
          return { ...state, search: action.payload };
      }
    },
    {
      pokemon: [],
      search: "",
    }
  );

  useEffect(() => {
    fetch("/Pokemon.json")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "setPokemon", payload: data }));
  }, []);
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
