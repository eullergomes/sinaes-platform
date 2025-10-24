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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import CoordinatorAutocomplete from '@/components/coordinator-autocomplete';
import { createCourse } from '@/app/actions/course';
import type { CreateCourseState } from '@/app/actions/course';
import { CourseLevel, CourseModality } from '@prisma/client';

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className="bg-green-600 hover:bg-green-700"
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

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Criar curso</h1>
        <Button asChild variant="outline">
          <Link href="/courses">Voltar</Link>
        </Button>
      </div>

      <form action={formAction} noValidate>
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex.: Licenciatura em Matemática"
                  required
                />
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
                  onChange={(e) => setEmecCode(e.target.value)}
                  placeholder="Apenas números"
                  required
                />
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
                disabled={!level || !modality || !selectedCoordinator?.id}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
