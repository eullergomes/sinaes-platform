'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CoordinatorAutocomplete } from '@/components/CoordinatorAutocomplete'

export default function NewCoursePage() {
  const [name, setName] = useState('')
  const [grau, setGrau] = useState<string | undefined>(undefined)
  const [modalidade, setModalidade] = useState<string | undefined>(undefined)
  const [emec, setEmec] = useState('')
  // Autocomplete - seleciona um coordenador da API (front-end only)
  const [selectedCoordinator, setSelectedCoordinator] = useState<{
    id: string
    name: string
    email?: string
  } | null>(null)

  // Apenas UI/Frontend – nenhum submit real
  const canSubmit = name.trim().length > 0

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Criar curso</h1>
        <Button asChild variant="outline">
          <Link href="/courses">Voltar</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Licenciatura em Matemática"
              />
            </div>

            <div className="space-y-2">
              <Label>Grau</Label>
              <Select value={grau} onValueChange={setGrau}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                  <SelectItem value="Bacharelado">Bacharelado</SelectItem>
                  <SelectItem value="Especialização">Especialização</SelectItem>
                  <SelectItem value="Mestrado">Mestrado</SelectItem>
                  <SelectItem value="Doutorado">Doutorado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Modalidade</Label>
              <Select value={modalidade} onValueChange={setModalidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Presencial">Presencial</SelectItem>
                  <SelectItem value="EaD">EaD</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emec">Código do Curso (e-MEC)</Label>
              <Input
                id="emec"
                value={emec}
                onChange={(e) => setEmec(e.target.value)}
                placeholder="Ex.: E-MEC 123456"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Coordenador</Label>
              <CoordinatorAutocomplete
                value={selectedCoordinator}
                onChange={setSelectedCoordinator}
                placeholder="Buscar e selecionar coordenador"
              />
              <p className="text-xs text-muted-foreground">
                Este campo realiza busca na API quando disponível. Por enquanto, usa uma lista de exemplo.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button asChild variant="outline">
              <Link href="/courses">Cancelar</Link>
            </Button>
            <Button disabled={!canSubmit} className="bg-green-600 hover:bg-green-700">
              Salvar (apenas UI)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
