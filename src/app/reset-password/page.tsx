import { Suspense } from 'react'
import ResetPasswordClient from './ResetPasswordClient'

export default function ResetPasswordPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-svh items-center justify-center">
					<p>Carregando...</p>
				</div>
			}
		>
			<ResetPasswordClient />
		</Suspense>
	)
}