import CourseList from '@/components/course-list';
import prisma from '@/utils/prisma';

const CoursePage = async () => {
  const courses = await prisma.course.findMany({
    include: { coordinator: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' }
  });

  return <CourseList initialCourses={courses} />;
};

export default CoursePage;
