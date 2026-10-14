import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
  "https://typeing-project.onrender.com";

export default function useUserResults() {
  const [results, setResults] = useState([]);
  const [totalStars, setTotalStars] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/api/results/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.success) {
          setResults(data.results || []);
          setTotalStars(data.totalStars || 0);
          setTotalScore(data.totalScore || 0);
        }
      })
      .catch((err) => console.error("Results fetch failed:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { results, totalStars, totalScore, loading };
}