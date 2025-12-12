import { Suspense } from 'react'
import CourseList from '@/components/course-list'
import prisma from '@/utils/prisma'
import { unstable_cache } from 'next/cache'

const getCachedCourses = unstable_cache(
	async () => {
		return prisma.course.findMany({
			include: { coordinator: { select: { id: true, name: true } } },
			orderBy: { name: 'asc' }
		})
	},
	['all-courses'],
	{
		revalidate: 60,
		tags: ['courses']
	}
)

export default async function CoursePage() {
	const courses = await getCachedCourses()

	return (
		<Suspense
			fallback={
				<div className="flex min-h-svh items-center justify-center p-8">
					<p>Carregando...</p>
				</div>
			}
		>
			<CourseList initialCourses={courses} />
		</Suspense>
	)
}
