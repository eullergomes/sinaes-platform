'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import CoordinatorAutocomplete from '@/components/coordinator-autocomplete';
import { CourseLevel, CourseModality } from '@prisma/client';
import { updateCourse } from '@/app/actions/course';
import type { CreateCourseState } from '@/app/actions/course';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { validateLink } from '@/utils/validateLink';

type Coordinator = { id: string; name: string };

// Melhorar essa tipagem
export type EditCourseInitial = {
  id: string;
  name: string;
  emecCode: number | null;
  level: CourseLevel | null;
  modality: CourseModality | null;
  ppcDocumentUrl: string | null;
  coordinator: Coordinator | null;
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="bg-green-600 hover:cursor-pointer hover:bg-green-700"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Salvando...' : 'Salvar alterações'}
    </Button>
  );
}

export default function EditCourseForm({
  initial
}: {
  initial: EditCourseInitial;
}) {
  const [name, setName] = useState(initial.name ?? '');
  const [emecCode, setEmecCode] = useState<string>(
    initial.emecCode ? String(initial.emecCode) : ''
  );
  const [level, setLevel] = useState<string>(initial.level ?? '');
  const [modality, setModality] = useState<string>(initial.modality ?? '');
  const [ppcDocumentUrl, setPpcDocumentUrl] = useState<string>(
    initial.ppcDocumentUrl ?? ''
  );
  const [ppcLinkErrors, setPpcLinkErrors] = useState<string[]>([]);
  const hasPpcError = ppcLinkErrors.some((e) => !!e);
  const [nameError, setNameError] = useState<string | ''>('');
  const [emecCodeError, setEmecCodeError] = useState<string | ''>('');
  const [coordinator, setCoordinator] = useState<Coordinator | null>(
    initial.coordinator
  );

  const initialState: CreateCourseState = {
    error: undefined,
    success: undefined
  };
  const [formState, formAction] = useActionState(
    updateCourse,
    initialState
  );
  const router = useRouter();

  useEffect(() => {
    if (formState?.success) {
      toast.success('Curso atualizado com sucesso!');
      router.refresh();
    }
  }, [formState?.success, router]);

  useEffect(() => {
    if (formState?.error && formState?.eventId) {
      toast.error(formState.error);
    }
  }, [formState?.eventId, formState?.error]);

  useEffect(() => {
    validateLink(initial.ppcDocumentUrl || '', setPpcLinkErrors);
  }, [initial.ppcDocumentUrl]);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    let error: string = '';
    if (trimmed.length > 0 && trimmed.length < 3) {
      error = 'Nome deve ter pelo menos 3 caracteres.';
    } else if (trimmed.length > 150) {
      error = 'Nome deve ter no máximo 150 caracteres.';
    }
    setNameError(error);
    return !error;
  };

  const validateEmec = (value: string) => {
    let error: string = '';
    if (value && /\D/.test(value)) {
      error = 'Apenas números são permitidos.';
    } else if (value && value.length > 8) {
      error = 'Código e-MEC deve ter no máximo 8 dígitos.';
    }
    setEmecCodeError(error);
    return !error;
  };

  const disabled = !level || !modality || !coordinator?.id || hasPpcError || !!nameError || !!emecCodeError;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editar curso</h1>
        <Button asChild variant="outline">
          <Link href="/courses">Voltar</Link>
        </Button>
      </div>

      <form
        action={formAction}
        noValidate
        onSubmit={(e) => {
          const okLink = validateLink(ppcDocumentUrl, setPpcLinkErrors);
          const okName = validateName(name);
          const okEmec = validateEmec(emecCode);
          if (!okLink || !okName || !okEmec) e.preventDefault();
        }}
      >
        <input type="hidden" name="courseId" value={initial.id} />
        <Card>
          <CardHeader>
            <CardTitle>Dados do curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Curso</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setName(v);
                  }}
                  onBlur={() => validateName(name)}
                  maxLength={150}
                  aria-invalid={!!nameError || undefined}
                  aria-describedby={nameError ? 'name-error' : undefined}
                  className={nameError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {nameError && (
                  <p id="name-error" className="text-sm text-red-600">{nameError}</p>
                )}
                {formState?.fieldErrors?.name && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emecCode">Código do Curso (e-MEC)</Label>
                <Input
                  id="emecCode"
                  name="emecCode"
                  inputMode="numeric"
                  pattern="\\d+"
                  value={emecCode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setEmecCode(v);
                  }}
                  onBlur={() => validateEmec(emecCode)}
                  maxLength={8}
                  aria-invalid={!!emecCodeError || undefined}
                  aria-describedby={emecCodeError ? 'emecCode-error' : undefined}
                  className={emecCodeError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {emecCodeError && (
                  <p id="emecCode-error" className="text-sm text-red-600">{emecCodeError}</p>
                )}
                {formState?.fieldErrors?.emecCode && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.emecCode}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Grau</Label>
                <Select value={level} onValueChange={(v) => setLevel(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grau" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CourseLevel).map((lv) => (
                      <SelectItem key={lv} value={lv}>
                        {lv}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="level" value={level} required />
                {formState?.fieldErrors?.level && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.level}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Modalidade</Label>
                <Select value={modality} onValueChange={(v) => setModality(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CourseModality).map((md) => (
                      <SelectItem key={md} value={md}>
                        {md}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="modality"
                  value={modality}
                  required
                />
                {formState?.fieldErrors?.modality && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.modality}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ppcDocumentUrl">URL do Documento PPC</Label>
                <Input 
                  id="ppcDocumentUrl"
                  name="ppcDocumentUrl"
                  placeholder="https://drive.google.com/drive/folders/…"
                  value={ppcDocumentUrl}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPpcDocumentUrl(v);
                  }}
                  onBlur={() => validateLink(ppcDocumentUrl, setPpcLinkErrors)}
                  aria-invalid={hasPpcError || undefined}
                  aria-describedby={hasPpcError ? 'ppcDocumentUrl-error' : undefined}
                  className={hasPpcError ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  required
                />
                {hasPpcError && (
                  <p id="ppcDocumentUrl-error" className="text-sm text-red-600">
                    {ppcLinkErrors[0]}
                  </p>
                )}
                {formState?.fieldErrors?.ppcDocumentUrl && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.ppcDocumentUrl}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Coordenador</Label>
                <CoordinatorAutocomplete
                  value={coordinator}
                  onChange={setCoordinator}
                  placeholder="Buscar e selecionar coordenador"
                />
                <input
                  type="hidden"
                  name="coordinatorId"
                  value={coordinator?.id || ''}
                  required
                />
                {formState?.fieldErrors?.coordinatorId && (
                  <p className="text-destructive text-sm">
                    {formState.fieldErrors.coordinatorId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button asChild variant="outline">
                <Link href="/courses">Cancelar</Link>
              </Button>
              <SubmitButton disabled={disabled} />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
