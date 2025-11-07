import CourseList from '@/components/course-list';
import prisma from '@/utils/prisma';
import { unstable_cache } from 'next/cache';

const getCachedCourses = unstable_cache(
  async () => {
    return prisma.course.findMany({
      include: { coordinator: { select: { id: true, name: true } } },
      orderBy: { name: 'asc' }
    });
  },
  ['all-courses'],
  {
    revalidate: 60,
    tags: ['courses'],
  }
);

const CoursePage = async () => {
  const courses = await getCachedCourses();

  return <CourseList initialCourses={courses} />;
};

export default CoursePage;
