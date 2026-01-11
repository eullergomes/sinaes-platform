import { Suspense } from 'react'
import CourseList from '@/components/course-list'
import { gradeToNumber } from '@/utils/gradeToNumber'
import prisma from '@/utils/prisma'
import { unstable_cache } from 'next/cache'

const getCachedCourses = unstable_cache(
	async () => {
		const courses = await prisma.course.findMany({
			include: { coordinator: { select: { id: true, name: true } } },
			orderBy: { name: 'asc' }
		})

		const courseIds = courses.map((c) => c.id)
		if (courseIds.length === 0) return courses

		const indicators = await prisma.courseIndicator.findMany({
			where: { courseId: { in: courseIds } },
			select: {
				courseId: true,
				evaluationYear: true,
				grade: true,
				indicatorDef: { select: { dimensionId: true } }
			}
		})

		const latestYearByCourse = new Map<string, number>()
		for (const row of indicators) {
			const prev = latestYearByCourse.get(row.courseId)
			if (prev === undefined || row.evaluationYear > prev) {
				latestYearByCourse.set(row.courseId, row.evaluationYear)
			}
		}

		const totalsByCourse = new Map<
			string,
			Map<string, { total: number; count: number }>
		>()

		for (const row of indicators) {
			const latestYear = latestYearByCourse.get(row.courseId)
			if (latestYear === undefined || row.evaluationYear !== latestYear) continue

			const gradeValue = gradeToNumber(row.grade)
			if (gradeValue <= 0) continue

			const dimId = row.indicatorDef.dimensionId
			let byDimension = totalsByCourse.get(row.courseId)
			if (!byDimension) {
				byDimension = new Map()
				totalsByCourse.set(row.courseId, byDimension)
			}
			const current = byDimension.get(dimId) ?? { total: 0, count: 0 }
			current.total += gradeValue
			current.count += 1
			byDimension.set(dimId, current)
		}

		return courses.map((course) => {
			const byDimension = totalsByCourse.get(course.id)
			if (!byDimension || byDimension.size === 0) {
				return { ...course, averageGrade: 0 }
			}

			const dimensionAverages = Array.from(byDimension.values())
				.filter((d) => d.count > 0)
				.map((d) => d.total / d.count)

			const avg =
				dimensionAverages.length > 0
					? Number.parseFloat(
						(
							dimensionAverages.reduce((acc, v) => acc + v, 0) /
							dimensionAverages.length
						).toFixed(2)
					)
					: 0

			return { ...course, averageGrade: avg }
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