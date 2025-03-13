import { useEffect, useState } from "react";
import "./styles.css";
import { getPokemonAll, getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon";
  const [loding, setLoding] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータの取得
      let res = await getPokemonAll(initialUrl);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      setLoding(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  const handlePrevPage = async () => {
    if (!prevUrl) return;

    setLoding(true);
    let data = await getPokemonAll(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoding(false);
  };

  const handleNextPage = async () => {
    setLoding(true);
    let data = await getPokemonAll(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoding(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loding ? (
          <h3>ロード中</h3>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
