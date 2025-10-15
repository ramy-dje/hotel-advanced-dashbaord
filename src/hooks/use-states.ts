import { useState, useEffect } from "react";
import axios from "axios";

export function useStates(country: string) {
  const [states, setStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!country) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          { country }
        );

        const fetchedStates = response.data.data.states.map(
          (s: { name: string }) => s.name
        );

        setStates(fetchedStates);
      } catch (err) {
        console.error(err);
        setError("Could not fetch states.");
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [country]);

  return { states, loading, error };
}
