"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

type CourseLinkProps = {
	currentCourseId: string
	currentCourseName: string | null
}

export default function CourseLink(props: CourseLinkProps): React.JSX.Element {
	const { currentCourseId, currentCourseName } = props
	const router = useRouter()

	const href: string = `/courses/${currentCourseId}/dimensions`

	return (
		<Link
			href={href}
			prefetch
			onMouseEnter={(): void => {
				router.prefetch(href)
			}}
			className="inline-flex w-full max-w-full items-center gap-2 rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white"
			title={currentCourseName ?? "—"}
		>
			<span className="opacity-80">Curso:</span>
			<span className="min-w-0 flex-1 truncate font-medium">
				{currentCourseName ?? "—"}
			</span>
		</Link>
	)
}
