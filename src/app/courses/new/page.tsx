'use client';

import React, { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Loader2, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import CoordinatorAutocomplete from '@/components/coordinator-autocomplete';
import { createCourse } from '@/app/actions/course';
import type { CreateCourseState } from '@/app/actions/course';
import { CourseLevel, CourseModality } from '@prisma/client';
import { validateLink } from '@/utils/validateLink';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="bg-green-600 hover:bg-green-700 hover:cursor-pointer"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Salvando...' : 'Salvar'}
    </Button>
  );
}

export default function NewCoursePage() {
  const [name, setName] = useState('');
  const [emecCode, setEmecCode] = useState('');
  const [level, setLevel] = useState<string>('');
  const [modality, setModality] = useState<string>('');
  const [ppcDocumentUrl, setPpcDocumentUrl] = useState('');
  const [ppcLinkErrors, setPpcLinkErrors] = useState<string[]>([]);
  const hasPpcError = ppcLinkErrors.some((e) => !!e);
  const [nameError, setNameError] = useState<string | ''>('');
  const [emecCodeError, setEmecCodeError] = useState<string | ''>('');
  const [selectedCoordinator, setSelectedCoordinator] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const initialState: CreateCourseState = {
    error: undefined,
    success: undefined
  };
  const [formState, formAction] = useActionState(createCourse, initialState);

  useEffect(() => {
    if (formState?.error && formState?.eventId) {
      toast.error(formState.error);
    }
  }, [formState?.eventId, formState?.error]);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    let error: string = '';
    if (trimmed.length > 0 && trimmed.length < 3) {
      error = 'Nome do curso muito curto.';
    } else if (trimmed.length > 150) {
      error = 'Nome do curso muito longo.';
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

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const okLink = validateLink(ppcDocumentUrl, setPpcLinkErrors);
    const okName = validateName(name);
    const okEmec = validateEmec(emecCode);
    if (!okLink || !okName || !okEmec) {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Criar curso</h1>
        <Button asChild variant="outline">
          <Link href="/courses">Voltar</Link>
        </Button>
      </div>

  <form action={formAction} onSubmit={handleSubmit} noValidate>
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
                  placeholder="Ex.: Licenciatura em Matemática"
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
                  placeholder="Apenas números"
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

              <div className="space-y-1">
                <Label htmlFor="ppcDocumentUrl" className="text-sm font-medium">PPC</Label>
                <div className="relative">
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
                    className={`pr-10 ${hasPpcError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {ppcDocumentUrl && (
                    <Button
                      type="button"
                      variant='ghost'
                      onClick={() => setPpcDocumentUrl('')}
                      className="absolute right-1 top-1 h-7 w-7 p-0 text-lg hover:cursor-pointer"
                      aria-label="Limpar link"
                      title="Limpar link"
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
                  value={selectedCoordinator}
                  onChange={setSelectedCoordinator}
                  placeholder="Buscar e selecionar coordenador"
                />
                <input
                  type="hidden"
                  name="coordinatorId"
                  value={selectedCoordinator?.id || ''}
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
              <SubmitButton
                disabled={!level || !modality || !selectedCoordinator?.id || hasPpcError || !!nameError || !!emecCodeError}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
