import { useEffect, useState } from "react";
import { LESSONS_FALLBACK } from "../data/lessons";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") ||
  "https://typeing-project.onrender.com";

export default function useCourses() {
  const [courses, setCourses] = useState(LESSONS_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE_URL}/api/courses`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (
          data.success &&
          Array.isArray(data.courses) &&
          data.courses.length
        ) {
          const mapped = data.courses.map((c) => ({
            id: c.id,
            slug: c.slug,
            icon: c.icon,
            color: c.color,
            title: c.title,
            sub: c.sub,
            score: c.score,
            stars: c.stars,
            progress: c.progress,
          }));
          setCourses(mapped);
        }
      })
      .catch((err) =>
        console.error("Courses fetch failed, using fallback:", err)
      )
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { courses, loading };
}