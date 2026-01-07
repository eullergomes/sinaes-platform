'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Course } from '@prisma/client';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { deleteCourse } from '@/actions/course';
import { Loader2, Trash2, Edit } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import React, { useEffect, useRef, useTransition } from 'react';
import { useAppContext } from '@/context/AppContext';
import { canUpdateCourse, canDeleteCourse } from '@/lib/permissions';

type CourseWithCoordinator = Course & {
  coordinator?: { id: string; name: string } | null;
};

function DeleteButton({
  onPendingChange,
  onDone
}: {
  onPendingChange?: (pending: boolean) => void;
  onDone?: () => void;
}) {
  const { pending } = useFormStatus();
  const prev = useRef(pending);

  useEffect(() => {
    onPendingChange?.(pending);
    if (prev.current && !pending) {
      onDone?.();
    }
    prev.current = pending;
  }, [pending, onPendingChange, onDone]);

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-destructive hover:bg-destructive/60 text-white hover:cursor-pointer"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Apagando...' : 'Sim, apagar curso'}
    </Button>
  );
}

const CourseItem = ({ course }: { course: CourseWithCoordinator }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();
  const { role } = useAppContext();
  const canUpdate = canUpdateCourse(role);
  const canDelete = canDeleteCourse(role);

  const dimensionsHref = `/courses/${course.slug}/dimensions`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge className="bg-gray-700 text-white hover:bg-gray-800">
            e-MEC: {course.emecCode ?? '—'}
          </Badge>

          <div className="flex items-center gap-1">
            {canUpdate && (
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-8 w-8 hover:bg-gray-100"
                aria-label="Editar curso"
              >
                <Link href={`/courses/${course.slug}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            )}

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={(open) => {
                if (isDeleting) return;
                setIsDeleteDialogOpen(open);
              }}
            >
              {canDelete && (
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 hover:cursor-pointer"
                    aria-label="Apagar curso"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
              )}
              <AlertDialogContent>
                <form action={deleteCourse}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold">
                      Você tem certeza absoluta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá apagar
                      permanentemente o curso &ldquo;{course.name}&ldquo; e
                      todos os seus dados avaliativos associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                      disabled={isDeleting}
                      className="hover:cursor-pointer"
                    >
                      Cancelar
                    </AlertDialogCancel>
                    <DeleteButton
                      onPendingChange={setIsDeleting}
                      onDone={() => setIsDeleteDialogOpen(false)}
                    />
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <CardTitle className="pt-2 text-lg">{course.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <div className="text-muted-foreground space-y-1 text-sm">
          <p className="font-bold">
            • Nível: <span className="font-normal">{course.level ?? '—'}</span>
          </p>
          <p className="font-bold">
            • Modalidade:{' '}
            <span className="font-normal">{course.modality ?? '—'}</span>
          </p>
          {course.coordinator?.name && (
            <p className="font-bold">
              • Coordenador(a):{' '}
              <span className="font-normal">{course.coordinator?.name}</span>
            </p>
          )}
          {course.ppcDocumentUrl && (
            <p className="font-semibold">
              • {''}
              <a
                href={course.ppcDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                PPC
              </a>
            </p>
          )}
        </div>

        <div className="flex items-center">
          <Button
            type="button"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isNavigating}
            aria-busy={isNavigating || undefined}
            onMouseEnter={() => router.prefetch(dimensionsHref)}
            onFocus={() => router.prefetch(dimensionsHref)}
            onClick={() => {
              startTransition(() => {
                router.push(dimensionsHref);
              });
            }}
          >
            Abrir dimensões
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseItem;
