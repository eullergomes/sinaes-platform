import { useEffect, useState } from 'react';

export interface CourseInfo {
  name: string | null;
  coordinatorId: string | null;
}

export function useCourseInfo(courseId: string | null) {
  const [info, setInfo] = useState<CourseInfo>({
    name: null,
    coordinatorId: null
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCourseName(slug: string) {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error('Falha ao carregar curso');
        const data: { name: string; coordinatorId?: string | null } =
          await res.json();
        if (!cancelled) {
          setInfo({
            name: data.name,
            coordinatorId: data.coordinatorId ?? null
          });
        }
      } catch {
        if (!cancelled) {
          setInfo({ name: null, coordinatorId: null });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (courseId) {
      setInfo({ name: null, coordinatorId: null });
      loadCourseName(courseId);
    } else {
      setInfo({ name: null, coordinatorId: null });
    }

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return { info, loading };
}
