import { useState, useEffect } from "react";

const KEY = 54682175;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal }
        );

        if (res.ok) {
          const data = await res.json();

          if (data.Error) {
            setError(data.Error);
          } else {
            setMovies(data.Search);
          }
        }
      } catch (err) {
        if (!err.name === "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    // handleCloseDetails();

    fetchMovies();

    return () => controller.abort();
  }, [query]);
  
  return { movies, isloading, error };
}