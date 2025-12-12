'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

const formSchema = z
	.object({
		password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
		confirmPassword: z.string().min(1, 'Confirme a senha')
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'As senhas não conferem'
	})

type FormValues = z.infer<typeof formSchema>

export default function ResetPasswordClient() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const token = searchParams.get('token')
	const error = searchParams.get('error')

	const [submitting, setSubmitting] = useState(false)

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: '',
			confirmPassword: ''
		}
	})

	useEffect(() => {
		if (error === 'INVALID_TOKEN') {
			toast.error('Link inválido ou expirado. Solicite uma nova recuperação.')
		}
	}, [error])

	async function onSubmit(values: FormValues) {
		if (!token) {
			toast.error('Token inválido ou ausente. Solicite uma nova recuperação.')
			return
		}

		try {
			setSubmitting(true)

			const { error } = await authClient.resetPassword({
				newPassword: values.password,
				token
			})

			if (error) {
				console.error(error)
				toast.error('Não foi possível redefinir a senha. Tente novamente.')
				return
			}

			toast.success('Senha alterada com sucesso!')
			router.push('/sign-in')
		} catch (err) {
			console.error(err)
			toast.error('Erro ao redefinir senha.')
		} finally {
			setSubmitting(false)
		}
	}

	if (!token && !error) {
		return (
			<div className="flex min-h-svh items-center justify-center">
				<p>Link inválido. Solicite uma nova recuperação de senha.</p>
			</div>
		)
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-1 items-center justify-center">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-4">
								<div className="mb-4 flex flex-col items-center gap-1 text-center">
									<h1 className="text-3xl font-bold">Definir nova senha</h1>
									<p className="text-muted-foreground text-sm text-balance">
										Digite sua nova senha para concluir a recuperação.
									</p>
								</div>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="password">Nova senha</FormLabel>
											<FormControl>
												<PasswordInput
													id="password"
													autoComplete="new-password"
													placeholder="********"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="grid gap-2">
											<FormLabel htmlFor="confirmPassword">
												Confirmar nova senha
											</FormLabel>
											<FormControl>
												<PasswordInput
													id="confirmPassword"
													autoComplete="new-password"
													placeholder="********"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full cursor-pointer bg-green-500 hover:bg-green-600"
									disabled={submitting}
								>
									{submitting ? 'Redefinindo...' : 'Redefinir senha'}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	)
}