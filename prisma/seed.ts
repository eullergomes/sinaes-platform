import {
  PrismaClient,
  NsaPolicy,
  IndicatorStatus,
  IndicatorGrade
} from '@prisma/client';

const prisma = new PrismaClient();

const allEvidenceRequirements = [
  // Dimensão 1
  { slug: 'politica-ensino', title: 'Política institucional de Ensino' },
  { slug: 'politica-extensao', title: 'Política institucional de Extensão' },
  { slug: 'politica-pesquisa', title: 'Política Institucional de Pesquisa' },
  { slug: 'pdi', title: 'Plano de Desenvolvimento Institucional (PDI)' },
  { slug: 'ppc', title: 'Projeto Político de Curso (PPC)' },
  { slug: 'implantacao-ensino', title: 'Implantação no âmbito do Ensino' },
  { slug: 'implantacao-extensao', title: 'Implantação no âmbito da Extensão' },
  { slug: 'implantacao-pesquisa', title: 'Implantação no âmbito da Pesquisa' },
  {
    slug: 'perfil-egresso-recorte',
    title: 'Perfil do Egresso - recorte do PPC'
  },
  {
    slug: 'praticas-exitosas-inovadoras',
    title: 'Práticas Exitosas e Inovadoras'
  },
  { slug: 'objetivos-recorte', title: 'Objetivos - recorte do PPC' },
  {
    slug: 'perfil-profissional-egresso-recorte',
    title: 'Perfil profissional do egresso - recorte do PPC'
  },
  {
    slug: 'estrutura-curricular-recorte',
    title: 'Estrutura curricular - recorte do PPC'
  },
  { slug: 'dcn', title: 'Diretrizes Curriculares Nacionais (DCN)' },
  { slug: 'acessibilidade-metodologica', title: 'Acessibilidade metodológica' },
  { slug: 'disciplina-libras', title: 'Disciplina de LIBRAS' },
  {
    slug: 'articulacao-componentes-curriculares-recorte',
    title:
      'Articulação entre os componentes curriculares no percurso de formação - recorte do PPC'
  },
  {
    slug: 'elementos-inovadores-recorte',
    title: 'Elementos comprovadamente inovadores - recorte do PPC'
  },
  {
    slug: 'conteudos-curriculares-recorte',
    title: 'Conteúdos curriculares - recorte do PPC'
  },
  {
    slug: 'educacao-ambiental-recorte',
    title: 'Educação ambiental - recorte do PPC'
  },
  {
    slug: 'educacao-direitos-humanos-recorte',
    title: 'Educação em Direitos humanos - recorte do PPC'
  },
  {
    slug: 'educacao-relacoes-etnico-raciais-recorte',
    title: 'Educação das relações étnico raciais - recorte do PPC'
  },
  {
    slug: 'ensino-historia-cultura-afro-indigena-recorte',
    title:
      'Ensino de história e cultura afro-brasileira, africana e indígena - recorte do PPC'
  },
  {
    slug: 'conhecimento-recente-inovador',
    title: 'Conhecimento recente e inovador'
  },
  { slug: 'metodologia-recorte', title: 'Metodologia - recorte do PPC' },
  {
    slug: 'praticas-pedagogicas-acao-discente',
    title: 'Práticas pedagógicas que estimulam a ação discente'
  },
  { slug: 'relacao-teoria-pratica', title: 'Relação teoria-prática' },
  { slug: 'aprendizagem-diferenciada', title: 'Aprendizagem diferenciada' },
  { slug: 'resolucao-estagio', title: 'Resolução de estágio supervisionado' },
  {
    slug: 'estagio-supervisionado-recorte',
    title: 'Estágio supervisionado - recorte do PPC'
  },
  { slug: 'planos-estagios', title: 'Planos de estágios' },
  { slug: 'convenios-estagios', title: 'Convênios de estágios' },
  {
    slug: 'integracao-ensino-mundo-trabalho',
    title: 'Integração entre ensino e mundo do trabalho'
  },
  {
    slug: 'interlocucao-institucionalizada',
    title: 'Interlocução institucionalizada'
  },
  { slug: 'insumos', title: 'Insumos' },
  {
    slug: 'resolucao-160-2022-atividades-complementares',
    title:
      'Resolução N. 160/2022 - Regulamentação das atividades complementares'
  },
  {
    slug: 'carga-horaria-diversidade-atividades-recorte',
    title:
      'Carga horária e diversidade de atividades - recorte da Resolução N. 160/2022'
  },
  {
    slug: 'formas-aproveitamento-recorte',
    title: 'Formas de aproveitamento - recorte da Resolução N. 160/2022'
  },
  {
    slug: 'objetivos-gerais-especificos-recorte',
    title: 'Objetivos Gerais e Específicos - recorte do PPC'
  },
  {
    slug: 'mecanismos-gestao-aproveitamento',
    title: 'Mecanismos de gestão e aproveitamento'
  },
  {
    slug: 'resolucao-088-2017-tcc',
    title: 'Resolução N. 088/2017 - regulamentação do TCC'
  },
  { slug: 'tcc-recorte', title: 'TCC - recorte do PPC' },
  {
    slug: 'manuais-apoio-tcc',
    title: 'Manuais de apoio à produção dos trabalhos'
  },
  {
    slug: 'regras-apresentacao-artigo',
    title: 'Regras para apresentação do artigo científico'
  },
  { slug: 'repositorio', title: 'Repositório' },
  {
    slug: 'apoio-discente-recorte',
    title: 'Apoio ao discente - recorte do PPC'
  },
  {
    slug: 'acoes-acolhimento-permanencia',
    title: 'Ações de acolhimento e permanência'
  },
  {
    slug: 'acessibilidade-metodologica-instrumental',
    title: 'Acessibilidade metodológica e instrumental'
  },
  { slug: 'monitoria', title: 'Monitoria' },
  { slug: 'nivelamento', title: 'Nivelamento' },
  { slug: 'estagios-nao-obrigatorios', title: 'Estágios não obrigatórios' },
  { slug: 'apoio-psicopedagogico', title: 'Apoio Psicopedagógico' },
  { slug: 'centros-academicos', title: 'Centros acadêmicos' },
  { slug: 'intercambios', title: 'Intercâmbios' },
  { slug: 'acoes-exitosas-inovadoras', title: 'Ações exitosas e inovadoras' },
  { slug: 'cae', title: 'Coordenadoria de Assuntos Estudantis (CAE)' },
  {
    slug: 'avaliacao-curso-recorte',
    title: 'Avaliação do curso - recorte do PPC'
  },
  { slug: 'autoavaliacao-institucional', title: 'Autoavaliação institucional' },
  {
    slug: 'gestao-avaliacoes-externas',
    title: 'Gestão baseada em avaliações externas (Plano Trienal)'
  },
  {
    slug: 'apropriacao-resultados-avaliacoes',
    title: 'Apropriação dos resultados das avaliações pela comunidade acadêmica'
  },
  {
    slug: 'autoavaliacao-periodica-curso',
    title: 'Autoavaliação periódica do curso'
  },
  { slug: 'tics-recorte', title: 'TICs - recorte do PPC' },
  {
    slug: 'acessibilidade-digital-comunicacional',
    title: 'Acessibilidade digital e comunicacional'
  },
  {
    slug: 'interatividade-docentes-discentes',
    title:
      'Interatividade entre docentes e discentes; acesso a materiais; experiências diferenciadas de aprendizagem'
  },
  { slug: 'pud', title: 'Planos de Unidade Didática - PUD' },
  { slug: 'ppi', title: 'Projeto Político Institucional (PPI)' },
  {
    slug: 'avaliacao-aprendizagem-recorte-ppc',
    title: 'Avaliação da aprendizagem - recorte do PPC'
  },
  {
    slug: 'avaliacao-aprendizagem-recorte-ppi',
    title: 'Avaliação da aprendizagem - recorte do PPI'
  },
  {
    slug: 'acompanhamento-avaliacao-planos-ensino',
    title: 'Procedimentos de acompanhamento e de avaliação nos Planos de Ensino'
  },
  {
    slug: 'acoes-melhoria-aprendizagem',
    title: 'Ações para a melhoria da aprendizagem'
  },
  { slug: 'estudo-numero-vagas', title: 'Estudo do número de vagas' },
  { slug: 'resolucao-criacao-curso', title: 'Resolução de criação do curso' },
  { slug: 'resolucao-numero-vagas', title: 'Resolução do número de vagas' },
  // Dimensão 2
  { slug: 'regulamento-nde', title: 'Regulamento do NDE' },
  {
    slug: 'portaria-nde-composicao-atual',
    title: 'Portaria NDE - composição atual'
  },
  {
    slug: 'regime-trabalho-membros-nde',
    title: 'Regime de trabalho dos membros do NDE'
  },
  { slug: 'titulacao-stricto-sensu', title: 'Titulação stricto sensu' },
  {
    slug: 'portaria-nomeacao-coordenacao',
    title: 'Portaria de nomeação da coordenação de curso'
  },
  { slug: 'nde-recorte-ppc', title: 'NDE - recorte do PPC' },
  {
    slug: 'docentes-curso-recorte-ppc',
    title: 'Docentes do curso - recorte do PPC'
  },
  { slug: 'atas-reunioes', title: 'Atas de reuniões' },
  { slug: 'atualizacao-ppc', title: 'Atualização do PPC' },
  {
    slug: 'portarias-nde-composicoes-anteriores',
    title: 'Portarias NDE - composições anteriores'
  },
  {
    slug: 'normas-coordenadorias',
    title: 'Normas das Coordenadorias dos Cursos de Graduação'
  },
  {
    slug: 'gestao-curso-recorte-ppc',
    title: 'Gestão do curso - recorte do PPC'
  },
  { slug: 'portarias-colegiado', title: 'Portarias do Colegiado' },
  { slug: 'planos-acao', title: 'Planos de ação' },
  { slug: 'indicadores-desempenho', title: 'Indicadores de desempenho' },
  {
    slug: 'gestao-potencialidade-corpo-docente',
    title: 'Gestão da potencialidade do corpo docente'
  },
  {
    slug: 'regime-trabalho-coordenador',
    title: 'Regime de trabalho do(a) coordenador(a) de curso'
  },
  {
    slug: 'horarios-atendimento-coordenacao',
    title: 'Horários de atendimento da coordenação'
  },
  {
    slug: 'representatividade-colegiados-superiores',
    title: 'Representatividade nos colegiados superiores'
  },
  {
    slug: 'administracao-potencialidade-corpo-docente',
    title: 'Administração da potencialidade do corpo docente'
  },
  { slug: 'ementas-recorte-ppc', title: 'Ementas - recorte do PPC' },
  { slug: 'bases-dados-periodicos', title: 'Bases de dados de periódicos' },
  {
    slug: 'acesso-conteudos-pesquisa-ponta',
    title: 'Acesso a conteúdos de pesquisa de ponta'
  },
  { slug: 'autoavaliacao-docente', title: 'Autoavaliação docente' },
  { slug: 'grupos-pesquisa', title: 'Grupos de pesquisa' },
  { slug: 'publicacoes', title: 'Publicações' },
  {
    slug: 'pit-rit',
    title: 'Plano e Relatório Individual de Trabalho (PIT e RIT)'
  },
  {
    slug: 'regime-trabalho-corpo-docente',
    title: 'Regime de trabalho do corpo docente'
  },
  {
    slug: 'planejamento-gestao-melhoria-continua',
    title: 'Planejamento e gestão para melhoria contínua'
  },
  {
    slug: 'experiencia-profissional-mundo-trabalho',
    title: 'Experiência profissional no mundo do trabalho'
  },
  {
    slug: 'interdisciplinaridade-recorte-ppc',
    title: 'Interdisciplinaridade - recorte do PPC'
  },
  { slug: 'curriculos', title: 'Currículos' },
  {
    slug: 'declaracao-docencia-superior',
    title: 'Declaração de docência superior'
  },
  { slug: 'avaliacao-cpa', title: 'Avaliação CPA' },
  {
    slug: 'atividades-promocao-aprendizagem-dificuldades',
    title:
      'Atividades específicas para a promoção da aprendizagem de discentes com dificuldades'
  },
  { slug: 'colegiado-recorte-ppc', title: 'Colegiado - recorte do PPC' },
  { slug: 'atuacao-colegiado', title: 'Atuação do colegiado' },
  {
    slug: 'institucionalizacao-colegiado',
    title: 'Institucionalização do Colegiado'
  },
  {
    slug: 'representatividade-segmentos-portaria-colegiado',
    title: 'Representatividade dos segmentos - Portaria do Colegiado'
  },
  { slug: 'periodicidade-reunioes', title: 'Periodicidade de reuniões' },
  {
    slug: 'registro-reunioes-decisoes',
    title: 'Registro das reuniões e decisões'
  },
  {
    slug: 'fluxo-encaminhamento-decisoes',
    title: 'Fluxo para encaminhamento das decisões'
  },
  {
    slug: 'sistema-suporte-registro-acompanhamento-execucao',
    title:
      'Sistema de suporte ao registro, acompanhamento e execução das decisões do Colegiado'
  },
  {
    slug: 'avaliacao-periodica-desempenho',
    title: 'Avaliação periódica de desempenho'
  },
  {
    slug: 'implementacao-ajuste-praticas-gestao',
    title: 'Implementação ou ajuste de práticas de gestão'
  },
  {
    slug: 'relacao-producoes-3-anos',
    title: 'Relação de produções nos últimos 3 anos'
  },
  // Dimensão 3
  {
    slug: 'espacos-trabalho-docentes-ti',
    title: 'Espaços de trabalho para docentes em Tempo Integral'
  },
  { slug: 'sala-coordenacao', title: 'Sala da coordenação' },
  {
    slug: 'registro-bens-sala-coordenacao',
    title: 'Registro de bens da sala da coordenação'
  },
  { slug: 'sala-coletiva-professores', title: 'Sala coletiva de professores' },
  {
    slug: 'registro-bens-sala-coletiva',
    title: 'Registro de bens da sala coletiva de professores'
  },
  { slug: 'salas-aula', title: 'Salas de aula' },
  { slug: 'manutencao-periodica', title: 'Manutenção periódica' },
  {
    slug: 'memorando-criacao-laboratorio',
    title: 'Memorando e documentos de criação de laboratório'
  },
  {
    slug: 'meios-acesso-equipamentos-informatica',
    title: 'Meios de acesso a equipamentos de informática'
  },
  {
    slug: 'normas-uso-laboratorios-informatica',
    title: 'Normas para uso dos laboratórios de informática'
  },
  { slug: 'contratacao-internet', title: 'Contratação internet' },
  { slug: 'evidencias-acervo-tombado', title: 'Evidências do acervo tombado' },
  { slug: 'relatorio-adequacao-nde', title: 'Relatório de adequação do NDE' },
  {
    slug: 'contratos-bibliotecas-virtuais',
    title: 'Contratos de bibliotecas virtuais'
  },
  { slug: 'gerenciamento-acervo', title: 'Gerenciamento do acervo' },
  { slug: 'praticas-exitosas', title: 'Práticas exitosas' },
  { slug: 'links-acesso', title: 'Links para acesso' },
  { slug: 'regulamento-guia-usuario', title: 'Regulamento e guia do usuário' },
  {
    slug: 'plano-atualizacao-expansao-acervo',
    title: 'Plano de atualização e expansão do acervo'
  },
  {
    slug: 'memorial-descritivo-biblioteca',
    title: 'Memorial descritivo da biblioteca'
  },
  { slug: 'portfolio-biblioteca', title: 'Portfólio da Biblioteca' },
  { slug: 'planta-baixa-biblioteca', title: 'Planta baixa da biblioteca' },
  { slug: 'laboratorios-recorte-ppc', title: 'Laboratórios - recorte do PPC' },
  { slug: 'laboratorios-informatica', title: 'Laboratórios de Informática' },
  { slug: 'laboratorio-educacao', title: 'Laboratório de Educação' },
  { slug: 'resultados', title: 'Resultados' },
  { slug: 'laboratorios-especificos', title: 'Laboratórios específicos' },
  { slug: 'regimento-interno-cep', title: 'Regimento interno - CEP IFMA' },
  { slug: 'membros-cep', title: 'Membros do CEP IFMA' },
  {
    slug: 'pagina-institucional-cep',
    title: 'Página institucional do CEP IFMA'
  }
];

export const indicatorsData = [
  // ----- DIMENSÃO 1 -----
  {
    code: '1.1',
    name: 'Políticas institucionais no âmbito do curso',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'As políticas institucionais de ensino, extensão e pesquisa (quando for o caso), constantes no PDI, não estão implantadas no âmbito do curso.'
      },
      {
        concept: '2',
        criterion:
          'As políticas institucionais de ensino, extensão e pesquisa (quando for o caso), constantes no PDI, estão implantadas no âmbito do curso de maneira limitada.'
      },
      {
        concept: '3',
        criterion:
          'As políticas institucionais de ensino, extensão e pesquisa (quando for o caso), constantes no PDI, estão implantadas no âmbito do curso.'
      },
      {
        concept: '4',
        criterion:
          'As políticas institucionais de ensino, extensão e pesquisa (quando for o caso), constantes no PDI, estão implantadas no âmbito do curso e claramente voltadas para a promoção de oportunidades de aprendizagem alinhadas ao perfil do egresso.'
      },
      {
        concept: '5',
        criterion:
          'As políticas institucionais de ensino, extensão e pesquisa (quando for o caso), constantes no PDI, estão implantadas no âmbito do curso e claramente voltadas para a promoção de oportunidades de aprendizagem alinhadas ao perfil do egresso, adotando-se práticas comprovadamente exitosas ou inovadoras para a sua revisão.'
      }
    ],
    evidenceSlugs: [
      'politica-ensino',
      'politica-extensao',
      'politica-pesquisa',
      'pdi',
      'ppc',
      'implantacao-ensino',
      'implantacao-extensao',
      'implantacao-pesquisa',
      'perfil-egresso-recorte',
      'praticas-exitosas-inovadoras'
    ]
  },
  {
    code: '1.2',
    name: 'Objetivos do curso',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'Os objetivos do curso, constantes no PPC, não estão implementados, considerando o perfil profissional do egresso, a estrutura curricular e o contexto educacional.'
      },
      {
        concept: '2',
        criterion:
          'Os objetivos do curso, constantes no PPC, estão implementados de maneira limitada, considerando o perfil profissional do egresso, a estrutura curricular e o contexto educacional.'
      },
      {
        concept: '3',
        criterion:
          'Os objetivos do curso, constantes no PPC, estão implementados, considerando o perfil profissional do egresso, a estrutura curricular e o contexto educacional.'
      },
      {
        concept: '4',
        criterion:
          'Os objetivos do curso, constantes no PPC, estão implementados, considerando o perfil profissional do egresso, a estrutura curricular, o contexto educacional e características locais e regionais.'
      },
      {
        concept: '5',
        criterion:
          'Os objetivos do curso, constantes no PPC, estão implementados, considerando o perfil profissional do egresso, a estrutura curricular, o contexto educacional, características locais e regionais e novas práticas emergentes no campo do conhecimento relacionado ao curso.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'objetivos-recorte',
      'perfil-profissional-egresso-recorte',
      'estrutura-curricular-recorte'
    ]
  },
  {
    code: '1.3',
    name: 'Perfil profissional do egresso',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion: 'O perfil profissional do egresso não consta no PPC.'
      },
      {
        concept: '2',
        criterion:
          'O perfil profissional do egresso consta no PPC, mas não está de acordo com as DCN (quando houver) ou não expressa as competências a serem desenvolvidas pelo discente.'
      },
      {
        concept: '3',
        criterion:
          'O perfil profissional do egresso consta no PPC, está de acordo com as DCN (quando houver) e expressa as competências a serem desenvolvidas pelo discente.'
      },
      {
        concept: '4',
        criterion:
          'O perfil profissional do egresso consta no PPC, está de acordo com as DCN (quando houver), expressa as competências a serem desenvolvidas pelo discente e as articula com necessidades locais e regionais.'
      },
      {
        concept: '5',
        criterion:
          'O perfil profissional do egresso consta no PPC, está de acordo com as DCN (quando houver), expressa as competências a serem desenvolvidas pelo discente e as articula com necessidades locais e regionais, sendo ampliado em função de novas demandas apresentadas pelo mundo do trabalho.'
      }
    ],
    evidenceSlugs: ['ppc', 'perfil-profissional-egresso-recorte', 'dcn']
  },
  {
    code: '1.4',
    name: 'Estrutura curricular',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'A estrutura curricular, constante no PPC, não está implementada, ou não considera a flexibilidade, a interdisciplinaridade, a acessibilidade metodológica ou a compatibilidade da carga horária total (em horas-relógio).'
      },
      {
        concept: '2',
        criterion:
          'A estrutura curricular, constante no PPC e implementada, considera a flexibilidade, a interdisciplinaridade, a acessibilidade metodológica, a compatibilidade da carga horária total (em horas-relógio), mas não evidencia a articulação da teoria com a prática, a oferta da disciplina de LIBRAS e mecanismos de familiarização com a modalidade a distância (quando for o caso).'
      },
      {
        concept: '3',
        criterion:
          'A estrutura curricular, constante no PPC e implementada, considera a flexibilidade, a interdisciplinaridade, a acessibilidade metodológica, a compatibilidade da carga horária total (em horas-relógio) e evidencia a articulação da teoria com a prática, a oferta da disciplina de LIBRAS e mecanismos de familiarização com a modalidade a distância (quando for o caso).'
      },
      {
        concept: '4',
        criterion:
          'A estrutura curricular, constante no PPC e implementada, considera a flexibilidade, a interdisciplinaridade, a acessibilidade metodológica, a compatibilidade da carga horária total (em horas-relógio), evidencia a articulação da teoria com a prática, a oferta da disciplina de LIBRAS e mecanismos de familiarização com a modalidade a distância (quando for o caso) e explicita claramente a articulação entre os componentes curriculares no percurso de formação.'
      },
      {
        concept: '5',
        criterion:
          'A estrutura curricular, constante no PPC e implementada, considera a flexibilidade, a interdisciplinaridade, a acessibilidade metodológica, a compatibilidade da carga horária total (em horas-relógio), evidencia a articulação da teoria com a prática, a oferta da disciplina de LIBRAS e mecanismos de familiarização com a modalidade a distância (quando for o caso), explicita claramente a articulação entre os componentes curriculares no percurso de formação e apresenta elementos comprovadamente inovadores.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'estrutura-curricular-recorte',
      'acessibilidade-metodologica',
      'disciplina-libras',
      'articulacao-componentes-curriculares-recorte',
      'elementos-inovadores-recorte'
    ]
  },
  {
    code: '1.5',
    name: 'Conteúdos curriculares',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'Os conteúdos curriculares, constantes no PPC, não promovem o efetivo desenvolvimento do perfil profissional do egresso.'
      },
      {
        concept: '2',
        criterion:
          'Os conteúdos curriculares, constantes no PPC, promovem o efetivo desenvolvimento do perfil profissional do egresso, mas não consideram a atualização da área, a adequação das cargas horárias (em horas-relógio), a adequação da bibliografia, a acessibilidade metodológica, a abordagem de conteúdos pertinentes às políticas de educação ambiental, de educação em direitos humanos e de educação das relações étnico-raciais ou o ensino de história e cultura afro-brasileira, africana e indígena.'
      },
      {
        concept: '3',
        criterion:
          'Os conteúdos curriculares, constantes no PPC, promovem o efetivo desenvolvimento do perfil profissional do egresso, considerando a atualização da área, a adequação das cargas horárias (em horas-relógio), a adequação da bibliografia, a acessibilidade metodológica, a abordagem de conteúdos pertinentes às políticas de educação ambiental, de educação em direitos humanos e de educação das relações étnico-raciais e o ensino de história e cultura afro-brasileira, africana e indígena.'
      },
      {
        concept: '4',
        criterion:
          'Os conteúdos curriculares, constantes no PPC, promovem o efetivo desenvolvimento do perfil profissional do egresso, considerando a atualização da área, a adequação das cargas horárias (em horas-relógio), a adequação da bibliografia, a acessibilidade metodológica, a abordagem de conteúdos pertinentes às políticas de educação ambiental, de educação em direitos humanos e de educação das relações étnico-raciais e o ensino de história e cultura afro-brasileira, africana e indígena, e diferenciam o curso dentro da área profissional.'
      },
      {
        concept: '5',
        criterion:
          'Os conteúdos curriculares, constantes no PPC, promovem o efetivo desenvolvimento do perfil profissional do egresso, considerando a atualização da área, a adequação das cargas horárias (em horas-relógio), a adequação da bibliografia, a acessibilidade metodológica, a abordagem de conteúdos pertinentes às políticas de educação ambiental, de educação em direitos humanos e de educação das relações étnico-raciais e o ensino de história e cultura afro-brasileira, africana e indígena, diferenciam o curso dentro da área profissional e induzem o contato com conhecimento recente e inovador.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'conteudos-curriculares-recorte',
      'perfil-profissional-egresso-recorte',
      'acessibilidade-metodologica',
      'educacao-ambiental-recorte',
      'educacao-direitos-humanos-recorte',
      'educacao-relacoes-etnico-raciais-recorte',
      'ensino-historia-cultura-afro-indigena-recorte',
      'conhecimento-recente-inovador'
    ]
  },
  {
    code: '1.6',
    name: 'Metodologia',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'A metodologia, constante no PPC (e de acordo com as DCN, quando houver), não atende ao desenvolvimento de conteúdos.'
      },
      {
        concept: '2',
        criterion:
          'A metodologia, constante no PPC (e de acordo com as DCN, quando houver), atende ao desenvolvimento de conteúdos, mas não às estratégias de aprendizagem; ou ao contínuo acompanhamento das atividades; ou à acessibilidade metodológica; ou à autonomia do discente.'
      },
      {
        concept: '3',
        criterion:
          'A metodologia, constante no PPC (e de acordo com as DCN, quando houver), atende ao desenvolvimento de conteúdos, às estratégias de aprendizagem, ao contínuo acompanhamento das atividades, à acessibilidade metodológica e à autonomia do discente.'
      },
      {
        concept: '4',
        criterion:
          'A metodologia, constante no PPC (e de acordo com as DCN, quando houver), atende ao desenvolvimento de conteúdos, às estratégias de aprendizagem, ao contínuo acompanhamento das atividades, à acessibilidade metodológica e à autonomia do discente, e se coaduna com práticas pedagógicas que estimulam a ação discente em uma relação teoria-prática.'
      },
      {
        concept: '5',
        criterion:
          'A metodologia, constante no PPC (e de acordo com as DCN, quando houver), atende ao desenvolvimento de conteúdos, às estratégias de aprendizagem, ao contínuo acompanhamento das atividades, à acessibilidade metodológica e à autonomia do discente, coaduna-se com práticas pedagógicas que estimulam a ação discente em uma relação teoria-prática, e é claramente inovadora e embasada em recursos que proporcionam aprendizagens diferenciadas dentro da área.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'dcn',
      'metodologia-recorte',
      'conteudos-curriculares-recorte',
      'acessibilidade-metodologica',
      'praticas-pedagogicas-acao-discente',
      'relacao-teoria-pratica',
      'praticas-exitosas-inovadoras',
      'aprendizagem-diferenciada'
    ]
  },
  {
    code: '1.7',
    name: 'Estágio curricular supervisionado',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O estágio curricular supervisionado não está institucionalizado.'
      },
      {
        concept: '2',
        criterion:
          'O estágio curricular supervisionado está institucionalizado, mas não contempla carga horária adequada; ou orientação cuja relação orientador/aluno seja compatível com as atividades; ou coordenação e supervisão; ou existência de convênios.'
      },
      {
        concept: '3',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e contempla carga horária adequada, orientação cuja relação orientador/aluno seja compatível com as atividades, coordenação e supervisão e existência de convênios.'
      },
      {
        concept: '4',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e contempla carga horária adequada, orientação cuja relação orientador/aluno seja compatível com as atividades, coordenação e supervisão, existência de convênios e estratégias para gestão da integração entre ensino e mundo do trabalho, considerando as competências previstas no perfil do egresso.'
      },
      {
        concept: '5',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e contempla carga horária adequada, orientação cuja relação orientador/aluno seja compatível com as atividades, coordenação e supervisão, existência de convênios, estratégias para gestão da integração entre ensino e mundo do trabalho, considerando as competências previstas no perfil do egresso, e interlocução institucionalizada da IES com o(s) ambiente(s) de estágio, gerando insumos para atualização das práticas do estágio.'
      }
    ],
    evidenceSlugs: [
      'resolucao-estagio',
      'ppc',
      'estagio-supervisionado-recorte',
      'planos-estagios',
      'convenios-estagios',
      'integracao-ensino-mundo-trabalho',
      'perfil-egresso-recorte',
      'interlocucao-institucionalizada',
      'insumos'
    ]
  },
  {
    code: '1.8',
    name: 'Estágio curricular supervisionado – relação com a rede de escolas da educação básica',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O estágio curricular supervisionado não está institucionalizado.'
      },
      {
        concept: '2',
        criterion:
          'O estágio curricular supervisionado está institucionalizado, mas não promove a vivência da realidade escolar de forma integral; ou a participação em conselhos de classe/reuniões de professores; ou a relação com a rede de escolas da educação Básica; ou não há acompanhamento pelo docente da IES (orientador) nas atividades no campo da prática, ao longo do ano letivo.'
      },
      {
        concept: '3',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e promove a vivência da realidade escolar de forma integral, a participação em conselhos de classe/reuniões de professores e a relação com a rede de escolas da educação Básica, havendo acompanhamento pelo docente da IES (orientador) nas atividades no campo da prática, ao longo do ano letivo.'
      },
      {
        concept: '4',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e promove a vivência da realidade escolar de forma integral, a participação em conselhos de classe/reuniões de professores e a relação com a rede de escolas da educação Básica, mantendo-se registro acadêmico e havendo acompanhamento pelo docente da IES (orientador) nas atividades no campo da prática, ao longo do ano letivo.'
      },
      {
        concept: '5',
        criterion:
          'O estágio curricular supervisionado está institucionalizado e promove a vivência da realidade escolar de forma integral, a participação em conselhos de classe/reuniões de professores, a relação com a rede de escolas da educação Básica, mantendo-se registro acadêmico, havendo acompanhamento pelo docente da IES (orientador) nas atividades no campo da prática, ao longo do ano letivo, e práticas inovadoras para a gestão da relação entre a IES e a rede de escolas da educação Básica.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.9',
    name: 'Estágio curricular supervisionado – relação teoria e prática',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O estágio curricular supervisionado não promove a relação teoria e prática ou não contempla a articulação entre o currículo do curso e aspectos práticos da educação Básica.'
      },
      {
        concept: '2',
        criterion:
          'O estágio curricular supervisionado promove a relação teoria e prática e contempla a articulação entre o currículo do curso e aspectos práticos da educação Básica, mas não há o embasamento teórico das atividades planejadas no campo da prática; ou a participação do licenciando em atividades de planejamento, desenvolvimento e avaliação realizadas pelos docentes da educação Básica; ou a reflexão teórica acerca de situações vivenciadas pelos licenciandos.'
      },
      {
        concept: '3',
        criterion:
          'O estágio curricular supervisionado promove a relação teoria e prática e contempla a articulação entre o currículo do curso e aspectos práticos da educação Básica, o embasamento teórico das atividades planejadas no campo da prática, a participação do licenciando em atividades de planejamento, desenvolvimento e avaliação realizadas pelos docentes da educação Básica e a reflexão teórica acerca de situações vivenciadas pelos licenciandos.'
      },
      {
        concept: '4',
        criterion:
          'O estágio curricular supervisionado promove a relação teoria e prática e contempla a articulação entre o currículo do curso e aspectos práticos da educação Básica, o embasamento teórico das atividades planejadas no campo da prática, a participação do licenciando em atividades de planejamento, desenvolvimento e avaliação realizadas pelos docentes da educação Básica, a reflexão teórica acerca de situações vivenciadas pelos licenciandos e a criação e divulgação de produtos que articulam e sistematizam a relação teoria e prática.'
      },
      {
        concept: '5',
        criterion:
          'O estágio curricular supervisionado promove a relação teoria e prática e contempla a articulação entre o currículo do curso e aspectos práticos da educação Básica, o embasamento teórico das atividades planejadas no campo da prática, a participação do licenciando em atividades de planejamento, desenvolvimento e avaliação realizadas pelos docentes da educação Básica, a reflexão teórica acerca de situações vivenciadas pelos licenciandos, a criação e divulgação de produtos que articulam e sistematizam a relação teoria e prática, com atividades comprovadamente exitosas ou inovadoras.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.10',
    name: 'Atividades complementares',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion: 'As atividades complementares não estão institucionalizadas.'
      },
      {
        concept: '2',
        criterion:
          'As atividades complementares estão institucionalizadas, mas não consideram a carga horária; ou a diversidade de atividades e de formas de aproveitamento; ou a aderência à formação geral do discente, constante no PPC.'
      },
      {
        concept: '3',
        criterion:
          'As atividades complementares estão institucionalizadas e consideram a carga horária, a diversidade de atividades e de formas de aproveitamento e a aderência à formação geral do discente, constante no PPC.'
      },
      {
        concept: '4',
        criterion:
          'As atividades complementares estão institucionalizadas e consideram a carga horária, a diversidade de atividades e de formas de aproveitamento e a aderência à formação geral e específica do discente, constante no PPC.'
      },
      {
        concept: '5',
        criterion:
          'As atividades complementares estão institucionalizadas e consideram a carga horária, a diversidade de atividades e de formas de aproveitamento, a aderência à formação geral e específica do discente, constante no PPC, e a existência de mecanismos comprovadamente exitosos ou inovadores na sua regulação, gestão e aproveitamento.'
      }
    ],
    evidenceSlugs: [
      'resolucao-160-2022-atividades-complementares',
      'carga-horaria-diversidade-atividades-recorte',
      'formas-aproveitamento-recorte',
      'ppc',
      'objetivos-gerais-especificos-recorte',
      'mecanismos-gestao-aproveitamento'
    ]
  },
  {
    code: '1.11',
    name: 'Trabalhos de Conclusão de Curso (TCC)',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O Trabalho de Conclusão de Curso não está institucionalizado.'
      },
      {
        concept: '2',
        criterion:
          'O Trabalho de Conclusão de Curso está institucionalizado, mas não considera carga horária, formas de apresentação, orientação ou coordenação.'
      },
      {
        concept: '3',
        criterion:
          'O Trabalho de Conclusão de Curso está institucionalizado e considera carga horária, formas de apresentação, orientação e coordenação.'
      },
      {
        concept: '4',
        criterion:
          'O Trabalho de Conclusão de Curso está institucionalizado e considera carga horária, formas de apresentação, orientação e coordenação e a divulgação de manuais atualizados de apoio à produção dos trabalhos.'
      },
      {
        concept: '5',
        criterion:
          'O Trabalho de Conclusão de Curso está institucionalizado e considera carga horária, formas de apresentação, orientação e coordenação, a divulgação de manuais atualizados de apoio à produção dos trabalhos e a disponibilização dos TCC em repositórios institucionais próprios, acessíveis pela internet.'
      }
    ],
    evidenceSlugs: [
      'resolucao-088-2017-tcc',
      'ppc',
      'tcc-recorte',
      'manuais-apoio-tcc',
      'regras-apresentacao-artigo',
      'repositorio'
    ]
  },
  {
    code: '1.12',
    name: 'Apoio ao discente',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      { concept: '1', criterion: 'Não há ações de apoio ao discente.' },
      {
        concept: '2',
        criterion:
          'O apoio ao discente não contempla ações de acolhimento e permanência, acessibilidade metodológica e instrumental, monitoria, nivelamento, intermediação e acompanhamento de estágios não obrigatórios remunerados ou apoio psicopedagógico.'
      },
      {
        concept: '3',
        criterion:
          'O apoio ao discente contempla ações de acolhimento e permanência, acessibilidade metodológica e instrumental, monitoria, nivelamento, intermediação e acompanhamento de estágios não obrigatórios remunerados, e apoio psicopedagógico.'
      },
      {
        concept: '4',
        criterion:
          'O apoio ao discente contempla ações de acolhimento e permanência, acessibilidade metodológica e instrumental, monitoria, nivelamento, intermediação e acompanhamento de estágios não obrigatórios remunerados, apoio psicopedagógico e participação em centros acadêmicos ou intercâmbios nacionais e internacionais.'
      },
      {
        concept: '5',
        criterion:
          'O apoio ao discente contempla ações de acolhimento e permanência, acessibilidade metodológica e instrumental, monitoria, nivelamento, intermediação e acompanhamento de estágios não obrigatórios remunerados, apoio psicopedagógico, participação em centros acadêmicos ou intercâmbios nacionais e internacionais e promove outras ações comprovadamente exitosas ou inovadoras.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'apoio-discente-recorte',
      'acoes-acolhimento-permanencia',
      'acessibilidade-metodologica-instrumental',
      'monitoria',
      'nivelamento',
      'estagios-nao-obrigatorios',
      'apoio-psicopedagogico',
      'centros-academicos',
      'intercambios',
      'acoes-exitosas-inovadoras',
      'cae'
    ]
  },
  {
    code: '1.13',
    name: 'Gestão do curso e os processos de avaliação interna e externa',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'A gestão do curso não é realizada considerando a autoavaliação institucional e o resultado das avaliações externas como insumo para aprimoramento contínuo do planejamento do curso.'
      },
      {
        concept: '2',
        criterion:
          'A gestão do curso é realizada considerando apenas a autoavaliação institucional ou o resultado das avaliações externas como insumo para aprimoramento contínuo do planejamento do curso.'
      },
      {
        concept: '3',
        criterion:
          'A gestão do curso é realizada considerando a autoavaliação institucional e o resultado das avaliações externas como insumo para aprimoramento contínuo do planejamento do curso.'
      },
      {
        concept: '4',
        criterion:
          'A gestão do curso é realizada considerando a autoavaliação institucional e o resultado das avaliações externas como insumo para aprimoramento contínuo do planejamento do curso, com evidência da apropriação dos resultados pela comunidade acadêmica.'
      },
      {
        concept: '5',
        criterion:
          'A gestão do curso é realizada considerando a autoavaliação institucional e o resultado das avaliações externas como insumo para aprimoramento contínuo do planejamento do curso, com evidência da apropriação dos resultados pela comunidade acadêmica e existência de processo de autoavaliação periódica do curso.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'avaliacao-curso-recorte',
      'autoavaliacao-institucional',
      'gestao-avaliacoes-externas',
      'apropriacao-resultados-avaliacoes',
      'autoavaliacao-periodica-curso'
    ]
  },
  {
    code: '1.14',
    name: 'Atividades de tutoria',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'As atividades de tutoria não atendem às demandas didático-pedagógicas da estrutura curricular.'
      },
      {
        concept: '2',
        criterion:
          'As atividades de tutoria atendem às demandas didático-pedagógicas da estrutura curricular de maneira limitada, compreendendo a mediação pedagógica junto aos discentes, inclusive em momentos presenciais, o domínio do conteúdo, de recursos e dos materiais didáticos e o acompanhamento dos discentes no processo formativo.'
      },
      {
        concept: '3',
        criterion:
          'As atividades de tutoria atendem às demandas didático-pedagógicas da estrutura curricular, compreendendo a mediação pedagógica junto aos discentes, inclusive em momentos presenciais, o domínio do conteúdo, de recursos e dos materiais didáticos e o acompanhamento dos discentes no processo formativo.'
      },
      {
        concept: '4',
        criterion:
          'As atividades de tutoria atendem às demandas didático-pedagógicas da estrutura curricular, compreendendo a mediação pedagógica junto aos discentes, inclusive em momentos presenciais, o domínio do conteúdo, de recursos e dos materiais didáticos e o acompanhamento dos discentes no processo formativo, e são avaliadas periodicamente por estudantes e equipe pedagógica do curso.'
      },
      {
        concept: '5',
        criterion:
          'As atividades de tutoria atendem às demandas didático-pedagógicas da estrutura curricular, compreendendo a mediação pedagógica junto aos discentes, inclusive em momentos presenciais, o domínio do conteúdo, de recursos e dos materiais didáticos e o acompanhamento dos discentes no processo formativo, e são avaliadas periodicamente por estudantes e equipe pedagógica do curso, embasando ações corretivas e de aperfeiçoamento para o planejamento de atividades futuras.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.15',
    name: 'Conhecimentos, habilidades e atitudes necessárias às atividades de tutoria',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'Os conhecimentos, habilidades e atitudes da equipe de tutoria não são adequados para a realização de suas atividades.'
      },
      {
        concept: '2',
        criterion:
          'Os conhecimentos, habilidades e atitudes da equipe de tutoria são adequados para a realização de suas atividades, mas suas ações não estão alinhadas ao PPC, às demandas comunicacionais ou às tecnologias adotadas no curso.'
      },
      {
        concept: '3',
        criterion:
          'Os conhecimentos, habilidades e atitudes da equipe de tutoria são adequados para a realização de suas atividades e suas ações estão alinhadas ao PPC, às demandas comunicacionais e às tecnologias adotadas no curso.'
      },
      {
        concept: '4',
        criterion:
          'Os conhecimentos, habilidades e atitudes da equipe de tutoria são adequados para a realização de suas atividades, e suas ações estão alinhadas ao PPC, às demandas comunicacionais e às tecnologias adotadas no curso, e são realizadas avaliações periódicas para identificar necessidade de capacitação dos tutores.'
      },
      {
        concept: '5',
        criterion:
          'Os conhecimentos, habilidades e atitudes da equipe de tutoria são adequados para a realização de suas atividades, e suas ações estão alinhadas ao PPC, às demandas comunicacionais e às tecnologias adotadas no curso, são realizadas avaliações periódicas para identificar necessidade de capacitação dos tutores e há apoio institucional para adoção de práticas criativas e inovadoras para a permanência e êxito dos discentes.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.16',
    name: 'Tecnologias de Informação e comunicação (TIC) no processo ensino-aprendizagem',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'As tecnologias de informação e comunicação adotadas no processo de ensino-aprendizagem não permitem a execução do projeto pedagógico do curso.'
      },
      {
        concept: '2',
        criterion:
          'As tecnologias de informação e comunicação adotadas no processo de ensino-aprendizagem permitem a execução do projeto pedagógico do curso, mas não garantem a acessibilidade digital e comunicacional ou não promovem a interatividade entre docentes, discentes e tutores (estes últimos, quando for o caso).'
      },
      {
        concept: '3',
        criterion:
          'As tecnologias de informação e comunicação adotadas no processo de ensino-aprendizagem permitem a execução do projeto pedagógico do curso, garantem a acessibilidade digital e comunicacional e promovem a interatividade entre docentes, discentes e tutores (estes últimos, quando for o caso).'
      },
      {
        concept: '4',
        criterion:
          'As tecnologias de informação e comunicação adotadas no processo de ensino-aprendizagem permitem a execução do projeto pedagógico do curso, garantem a acessibilidade digital e comunicacional, promovem a interatividade entre docentes, discentes e tutores (estes últimos, quando for o caso) e asseguram o acesso a materiais ou recursos didáticos a qualquer hora e lugar.'
      },
      {
        concept: '5',
        criterion:
          'As tecnologias de informação e comunicação adotadas no processo de ensino-aprendizagem permitem a execução do projeto pedagógico do curso, garantem a acessibilidade digital e comunicacional, promovem a interatividade entre docentes, discentes e tutores (estes últimos, quando for o caso), asseguram o acesso a materiais ou recursos didáticos a qualquer hora e lugar e possibilitam experiências diferenciadas de aprendizagem baseadas em seu uso.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'tics-recorte',
      'acessibilidade-digital-comunicacional',
      'interatividade-docentes-discentes',
      'pud'
    ]
  },
  {
    code: '1.17',
    name: 'Ambiente Virtual de Aprendizagem (AVA)',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O Ambiente Virtual de Aprendizagem, constante no PPC, não apresenta materiais, recursos ou tecnologias; ou os materiais, recursos ou tecnologias apresentadas não permitem desenvolver a cooperação entre tutores, discentes e docentes.'
      },
      {
        concept: '2',
        criterion:
          'O Ambiente Virtual de Aprendizagem, constante no PPC, apresenta materiais, recursos e tecnologias apropriadas, que permitem desenvolver a cooperação entre tutores, discentes e docentes, mas não permitem a reflexão sobre o conteúdo das disciplinas ou a acessibilidade metodológica, instrumental ou comunicacional.'
      },
      {
        concept: '3',
        criterion:
          'O Ambiente Virtual de Aprendizagem, constante no PPC, apresenta materiais, recursos e tecnologias apropriadas, que permitem desenvolver a cooperação entre tutores, discentes e docentes, a reflexão sobre o conteúdo das disciplinas e a acessibilidade metodológica, instrumental e comunicacional.'
      },
      {
        concept: '4',
        criterion:
          'O Ambiente Virtual de Aprendizagem, constante no PPC, apresenta materiais, recursos e tecnologias apropriadas, que permitem desenvolver a cooperação entre tutores, discentes e docentes, a reflexão sobre o conteúdo das disciplinas e a acessibilidade metodológica, instrumental e comunicacional, e passa por avaliações periódicas devidamente documentadas.'
      },
      {
        concept: '5',
        criterion:
          'O Ambiente Virtual de Aprendizagem, constante no PPC, apresenta materiais, recursos e tecnologias apropriadas, que permitem desenvolver a cooperação entre tutores, discentes e docentes, a reflexão sobre o conteúdo das disciplinas e a acessibilidade metodológica, instrumental e comunicacional, e passa por avaliações periódicas devidamente documentadas, que resultam em ações de melhoria contínua.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.18',
    name: 'Material didático',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O material didático descrito no PPC, disponibilizado aos discentes, não foi elaborado ou validado pela equipe multidisciplinar (no caso de EAD) ou equivalente (no caso presencial), ou não permite desenvolver a formação definida no projeto pedagógico.'
      },
      {
        concept: '2',
        criterion:
          'O material didático descrito no PPC, disponibilizado aos discentes, elaborado ou validado pela equipe multidisciplinar (no caso de EAD) ou equivalente (no caso presencial), permite desenvolver de maneira limitada a formação definida no projeto pedagógico, considerando sua abrangência, aprofundamento e coerência teórica, sua acessibilidade metodológica e instrumental e a adequação da bibliografia às exigências da formação.'
      },
      {
        concept: '3',
        criterion:
          'O material didático descrito no PPC, disponibilizado aos discentes, elaborado ou validado pela equipe multidisciplinar (no caso de EAD) ou equivalente (no caso presencial), permite desenvolver a formação definida no projeto pedagógico, considerando sua abrangência, aprofundamento e coerência teórica, sua acessibilidade metodológica e instrumental e a adequação da bibliografia às exigências da formação.'
      },
      {
        concept: '4',
        criterion:
          'O material didático descrito no PPC, disponibilizado aos discentes, elaborado ou validado pela equipe multidisciplinar (no caso de EAD) ou equivalente (no caso presencial), permite desenvolver a formação definida no projeto pedagógico, considerando sua abrangência, aprofundamento e coerência teórica, sua acessibilidade metodológica e instrumental e a adequação da bibliografia às exigências da formação, e apresenta linguagem inclusiva e acessível.'
      },
      {
        concept: '5',
        criterion:
          'O material didático descrito no PPC, disponibilizado aos discentes, elaborado ou validado pela equipe multidisciplinar (no caso de EAD) ou equivalente (no caso presencial), permite desenvolver a formação definida no projeto pedagógico, considerando sua abrangência, aprofundamento e coerência teórica, sua acessibilidade metodológica e instrumental e a adequação da bibliografia às exigências da formação, e apresenta linguagem inclusiva e acessível, com recursos comprovadamente inovadores.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.19',
    name: 'Procedimentos de acompanhamento e de avaliação dos processos de ensino-aprendizagem',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'Os procedimentos de acompanhamento e de avaliação, utilizados nos processos de ensino-aprendizagem, não atendem à concepção do curso definida no PPC.'
      },
      {
        concept: '2',
        criterion:
          'Os procedimentos de acompanhamento e de avaliação, utilizados nos processos de ensino-aprendizagem, atendem à concepção do curso definida no PPC, mas não permitem o desenvolvimento e a autonomia do discente de forma contínua e efetiva ou não resultam em informações sistematizadas e disponibilizadas aos discentes.'
      },
      {
        concept: '3',
        criterion:
          'Os procedimentos de acompanhamento e de avaliação, utilizados nos processos de ensino-aprendizagem, atendem à concepção do curso definida no PPC, permitindo o desenvolvimento e a autonomia do discente de forma contínua e efetiva, e resultam em informações sistematizadas e disponibilizadas aos estudantes.'
      },
      {
        concept: '4',
        criterion:
          'Os procedimentos de acompanhamento e de avaliação, utilizados nos processos de ensino-aprendizagem, atendem à concepção do curso definida no PPC, permitindo o desenvolvimento e a autonomia do discente de forma contínua e efetiva, e resultam em informações sistematizadas e disponibilizadas aos estudantes, com mecanismos que garantam sua natureza formativa.'
      },
      {
        concept: '5',
        criterion:
          'Os procedimentos de acompanhamento e de avaliação, utilizados nos processos de ensino-aprendizagem, atendem à concepção do curso definida no PPC, permitindo o desenvolvimento e a autonomia do discente de forma contínua e efetiva, e resultam em informações sistematizadas e disponibilizadas aos estudantes, com mecanismos que garantam sua natureza formativa, sendo adotadas ações concretas para a melhoria da aprendizagem em função das avaliações realizadas.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'avaliacao-aprendizagem-recorte-ppc',
      'ppi',
      'avaliacao-aprendizagem-recorte-ppi',
      'acompanhamento-avaliacao-planos-ensino',
      'acoes-melhoria-aprendizagem'
    ]
  },
  {
    code: '1.20',
    name: 'Número de vagas',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'O número de vagas para o curso não está fundamentado em estudos quantitativos e qualitativos.'
      },
      {
        concept: '2',
        criterion:
          'O número de vagas para o curso está fundamentado em estudos quantitativos e qualitativos, mas não há comprovação da sua adequação à dimensão do corpo docente (e tutorial, na modalidade a distância) e às condições de infraestrutura física e tecnológica para o ensino e a pesquisa (esta última, quando for o caso).'
      },
      {
        concept: '3',
        criterion:
          'O número de vagas para o curso está fundamentado em estudos quantitativos e qualitativos, que comprovam sua adequação à dimensão do corpo docente (e tutorial, na modalidade a distância) e às condições de infraestrutura física e tecnológica para o ensino e a pesquisa (esta última, quando for o caso).'
      },
      {
        concept: '4',
        criterion:
          'O número de vagas para o curso está fundamentado em estudos periódicos, quantitativos e qualitativos, que comprovam sua adequação à dimensão do corpo docente (e tutorial, na modalidade a distância) e às condições de infraestrutura física e tecnológica para o ensino e a pesquisa (esta última, quando for o caso).'
      },
      {
        concept: '5',
        criterion:
          'O número de vagas para o curso está fundamentado em estudos periódicos, quantitativos e qualitativos, e em pesquisas com a comunidade acadêmica, que comprovam sua adequação à dimensão do corpo docente (e tutorial, na modalidade a distância) e às condições de infraestrutura física e tecnológica para o ensino e a pesquisa (esta última, quando for o caso).'
      }
    ],
    evidenceSlugs: [
      'estudo-numero-vagas',
      'resolucao-criacao-curso',
      'resolucao-numero-vagas'
    ]
  },
  {
    code: '1.21',
    name: 'Integração com as redes públicas de ensino',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há convênios ou ações de integração com a rede pública de ensino.'
      },
      {
        concept: '2',
        criterion:
          'Os convênios e ações não promovem integração com a rede pública de ensino.'
      },
      {
        concept: '3',
        criterion:
          'Os convênios e ações promovem integração com a rede pública de ensino e permitem o desenvolvimento, a testagem, a execução e a avaliação de estratégias didático-pedagógicas, inclusive com o uso de tecnologias educacionais, sendo as experiências documentadas, abrangentes e consolidadas.'
      },
      {
        concept: '4',
        criterion:
          'Os convênios e ações promovem integração com a rede pública de ensino e permitem o desenvolvimento, a testagem, a execução e a avaliação de estratégias didático-pedagógicas, inclusive com o uso de tecnologias educacionais, sendo as experiências documentadas, abrangentes e consolidadas, com resultados relevantes para os discentes e para as escolas de educação básica.'
      },
      {
        concept: '5',
        criterion:
          'Os convênios e ações promovem integração com a rede pública de ensino e permitem o desenvolvimento, a testagem, a execução e a avaliação de estratégias didático-pedagógicas, inclusive com o uso de tecnologias educacionais, sendo as experiências documentadas, abrangentes e consolidadas, com resultados relevantes para os discentes e para as escolas de educação básica, havendo ações comprovadamente exitosas ou inovadoras.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.22',
    name: 'Integração do curso com o sistema local e regional de saúde (SUS)',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'A integração do curso com o sistema de saúde local e regional (SUS) não está formalizada por meio de convênio.'
      },
      {
        concept: '2',
        criterion:
          'A integração do curso com o sistema de saúde local e regional (SUS) está formalizada por meio de convênio, mas não viabiliza a formação do discente em serviço.'
      },
      {
        concept: '3',
        criterion:
          'A integração do curso com o sistema de saúde local e regional (SUS) está formalizada por meio de convênio, conforme as DCN e/ou o PPC, viabiliza a formação do discente em serviço e permite sua inserção em diferentes cenários do Sistema, em nível de complexidade crescente.'
      },
      {
        concept: '4',
        criterion:
          'A integração do curso com o sistema de saúde local e regional (SUS) está formalizada por meio de convênio, conforme as DCN e/ou o PPC, viabiliza a formação do discente em serviço e permite sua inserção em equipes multidisciplinares, considerando diferentes cenários do Sistema, com nível de complexidade crescente.'
      },
      {
        concept: '5',
        criterion:
          'A integração do curso com o sistema de saúde local e regional (SUS) está formalizada por meio de convênio, conforme as DCN e/ou o PPC, viabiliza a formação do discente em serviço e permite sua inserção em equipes multidisciplinares e multiprofissionais, considerando diferentes cenários do Sistema, com nível de complexidade crescente.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.23',
    name: 'Atividades práticas de ensino para áreas da saúde',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'As atividades práticas de ensino não apresentam conformidade com as Diretrizes Curriculares nacionais do curso.'
      },
      {
        concept: '2',
        criterion:
          'As atividades práticas de ensino apresentam conformidade com as Diretrizes Curriculares nacionais do curso, mas não há regulamentação para a orientação, supervisão e responsabilidade docente.'
      },
      {
        concept: '3',
        criterion:
          'As atividades práticas de ensino apresentam conformidade com as Diretrizes Curriculares nacionais do curso, com regulamentação para a orientação, supervisão e responsabilidade docente.'
      },
      {
        concept: '4',
        criterion:
          'As atividades práticas de ensino apresentam conformidade com as Diretrizes Curriculares nacionais do curso, com regulamentação para a orientação, supervisão e responsabilidade docente, permitindo a inserção nos cenários do SUS e em outros ambientes (laboratórios ou espaços de ensino), resultando no desenvolvimento de competências específicas da profissão.'
      },
      {
        concept: '5',
        criterion:
          'As atividades práticas de ensino apresentam conformidade com as Diretrizes Curriculares nacionais do curso, com regulamentação para a orientação, supervisão e responsabilidade docente, permitindo a inserção nos cenários do SUS e em outros ambientes (laboratórios ou espaços de ensino), resultando no desenvolvimento de competências específicas da profissão, e estando, ainda, relacionadas ao contexto de saúde da região.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '1.24',
    name: 'Atividades práticas de ensino para licenciaturas',
    dimensionNumber: 1,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'As atividades práticas de ensino não estão implantadas, conforme as Diretrizes Curriculares da educação Básica, da Formação de Professores e da área de conhecimento da licenciatura.'
      },
      {
        concept: '2',
        criterion:
          'As atividades práticas de ensino estão implantadas de maneira limitada, conforme as Diretrizes Curriculares da educação Básica, da Formação de Professores e da área de conhecimento da licenciatura.'
      },
      {
        concept: '3',
        criterion:
          'As atividades práticas de ensino estão em conformidade com as Diretrizes Curriculares da educação Básica, da Formação de Professores e da área de conhecimento da licenciatura, em articulação com o PPC.'
      },
      {
        concept: '4',
        criterion:
          'As atividades práticas de ensino estão em conformidade com as Diretrizes Curriculares da educação Básica, da Formação de Professores e da área de conhecimento da licenciatura, em articulação com o PPC, e estão presentes em todo o curso.'
      },
      {
        concept: '5',
        criterion:
          'As atividades práticas de ensino estão em conformidade com as Diretrizes Curriculares da educação Básica, da Formação de Professores e da área de conhecimento da licenciatura, em articulação com o PPC, estão presentes e relacionam teoria e prática de forma reflexiva durante todo o curso.'
      }
    ],
    evidenceSlugs: []
  },

  // ----- DIMENSÃO 2 -----
  {
    code: '2.1',
    name: 'Núcleo Docente Estruturante – NDE',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há NDE; ou o NDE possui menos de 5 docentes do curso; ou menos de 20% de seus membros atuam em regime de tempo integral ou parcial; ou menos de 60% de seus membros possuem titulação stricto sensu.'
      },
      {
        concept: '2',
        criterion:
          'O NDE possui, no mínimo, 5 docentes do curso; seus membros atuam em regime de tempo integral ou parcial (mínimo de 20% em tempo integral); pelo menos 60% de seus membros possuem titulação stricto sensu; mas não atua no acompanhamento, na consolidação ou na atualização do PPC.'
      },
      {
        concept: '3',
        criterion:
          'O NDE possui, no mínimo, 5 docentes do curso; seus membros atuam em regime de tempo integral ou parcial (mínimo de 20% em tempo integral); pelo menos 60% de seus membros possuem titulação stricto sensu; e atua no acompanhamento, na consolidação e na atualização do PPC.'
      },
      {
        concept: '4',
        criterion:
          'O NDE possui, no mínimo, 5 docentes do curso; seus membros atuam em regime de tempo integral ou parcial (mínimo de 20% em tempo integral); pelo menos 60% de seus membros possuem titulação stricto sensu; tem o coordenador de curso como integrante; atua no acompanhamento, na consolidação e na atualização do PPC, realizando estudos e atualização periódica, verificando o impacto do sistema de avaliação de aprendizagem na formação do estudante e analisando a adequação do perfil do egresso, considerando as DCN e as novas demandas do mundo do trabalho.'
      },
      {
        concept: '5',
        criterion:
          'O NDE possui, no mínimo, 5 docentes do curso; seus membros atuam em regime de tempo integral ou parcial (mínimo de 20% em tempo integral); pelo menos 60% de seus membros possuem titulação stricto sensu; tem o coordenador de curso como integrante; atua no acompanhamento, na consolidação e na atualização do PPC, realizando estudos e atualização periódica, verificando o impacto do sistema de avaliação de aprendizagem na formação do estudante e analisando a adequação do perfil do egresso, considerando as DCN e as novas demandas do mundo do trabalho; e mantém parte de seus membros desde o último ato regulatório.'
      }
    ],
    evidenceSlugs: [
      'regulamento-nde',
      'portaria-nde-composicao-atual',
      'regime-trabalho-membros-nde',
      'titulacao-stricto-sensu',
      'portaria-nomeacao-coordenacao',
      'ppc',
      'nde-recorte-ppc',
      'docentes-curso-recorte-ppc',
      'dcn',
      'atas-reunioes',
      'atualizacao-ppc',
      'perfil-egresso-recorte',
      'portarias-nde-composicoes-anteriores'
    ]
  },
  {
    code: '2.2',
    name: 'Equipe multidisciplinar',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion: 'Não há equipe multidisciplinar estabelecida.'
      },
      {
        concept: '2',
        criterion:
          'A equipe multidisciplinar não está em consonância com o PPC, ou não é constituída por profissionais de diferentes áreas do conhecimento, ou não é responsável pela concepção, produção e disseminação de tecnologias, metodologias e os recursos educacionais para a educação a distância.'
      },
      {
        concept: '3',
        criterion:
          'A equipe multidisciplinar, estabelecida em consonância com o PPC, é constituída por profissionais de diferentes áreas do conhecimento e é responsável pela concepção, produção e disseminação de tecnologias, metodologias e os recursos educacionais para a educação a distância.'
      },
      {
        concept: '4',
        criterion:
          'A equipe multidisciplinar, estabelecida em consonância com o PPC, é constituída por profissionais de diferentes áreas do conhecimento, é responsável pela concepção, produção e disseminação de tecnologias, metodologias e os recursos educacionais para a educação a distância e possui plano de ação documentado e implementado.'
      },
      {
        concept: '5',
        criterion:
          'A equipe multidisciplinar, estabelecida em consonância com o PPC, é constituída por profissionais de diferentes áreas do conhecimento, é responsável pela concepção, produção e disseminação de tecnologias, metodologias e os recursos educacionais para a educação a distância e possui plano de ação documentado e implementado e processos de trabalho formalizados.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '2.3',
    name: 'Atuação do coordenador',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion: 'A atuação do coordenador não está de acordo com o PPC.'
      },
      {
        concept: '2',
        criterion:
          'A atuação do coordenador está de acordo com o PPC, mas não atende à demanda existente, considerando a gestão do curso, a relação com os docentes e discentes, com tutores e equipe multidisciplinar (quando for o caso) ou a representatividade nos colegiados superiores.'
      },
      {
        concept: '3',
        criterion:
          'A atuação do coordenador está de acordo com o PPC e atende à demanda existente, considerando a gestão do curso, a relação com os docentes e discentes, com tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores.'
      },
      {
        concept: '4',
        criterion:
          'A atuação do coordenador está de acordo com o PPC, atende à demanda existente, considerando a gestão do curso, a relação com os docentes e discentes, com tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores, é pautada em um plano de ação documentado e compartilhado e dispõe de indicadores de desempenho da coordenação disponíveis e públicos.'
      },
      {
        concept: '5',
        criterion:
          'A atuação do coordenador está de acordo com o PPC, atende à demanda existente, considerando a gestão do curso, a relação com os docentes e discentes, com tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores, é pautada em um plano de ação documentado e compartilhado, dispõe de indicadores de desempenho da coordenação disponíveis e públicos e administra a potencialidade do corpo docente do seu curso, favorecendo a integração e a melhoria contínua.'
      }
    ],
    evidenceSlugs: [
      'normas-coordenadorias',
      'ppc',
      'gestao-curso-recorte-ppc',
      'portarias-colegiado',
      'planos-acao',
      'indicadores-desempenho',
      'gestao-potencialidade-corpo-docente'
    ]
  },
  {
    code: '2.4',
    name: 'Regime de trabalho do coordenador de curso',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'O regime de trabalho do coordenador não é de tempo parcial nem integral.'
      },
      {
        concept: '2',
        criterion:
          'O regime de trabalho do coordenador é de tempo parcial, mas não permite o atendimento da demanda existente, considerando a gestão do curso, a relação com os docentes, discentes, tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores.'
      },
      {
        concept: '3',
        criterion:
          'O regime de trabalho do coordenador é de tempo parcial ou integral e permite o atendimento da demanda existente, considerando a gestão do curso, a relação com os docentes, discentes, tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores.'
      },
      {
        concept: '4',
        criterion:
          'O regime de trabalho do coordenador é de tempo integral e permite o atendimento da demanda existente, considerando a gestão do curso, a relação com os docentes, discentes, tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores, por meio de um plano de ação documentado e compartilhado, com indicadores disponíveis e públicos com relação ao desempenho da coordenação.'
      },
      {
        concept: '5',
        criterion:
          'O regime de trabalho do coordenador é de tempo integral e permite o atendimento da demanda existente, considerando a gestão do curso, a relação com os docentes, discentes, tutores e equipe multidisciplinar (quando for o caso) e a representatividade nos colegiados superiores, por meio de um plano de ação documentado e compartilhado, com indicadores disponíveis e públicos com relação ao desempenho da coordenação, e proporciona a administração da potencialidade do corpo docente do seu curso, favorecendo a integração e a melhoria contínua.'
      }
    ],
    evidenceSlugs: [
      'regime-trabalho-coordenador',
      'horarios-atendimento-coordenacao',
      'ppc',
      'gestao-curso-recorte-ppc',
      'representatividade-colegiados-superiores',
      'planos-acao',
      'indicadores-desempenho',
      'administracao-potencialidade-corpo-docente'
    ]
  },
  {
    code: '2.5',
    name: 'Corpo docente: titulação',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'O corpo docente apresenta os conteúdos dos componentes curriculares sem abordar a sua relevância para a atuação profissional e acadêmica do discente.'
      },
      {
        concept: '2',
        criterion:
          'O corpo docente descreve os conteúdos dos componentes curriculares, abordando a sua relevância para a atuação profissional e acadêmica do discente, mas não fomenta o raciocínio crítico com base em literatura atualizada.'
      },
      {
        concept: '3',
        criterion:
          'O corpo docente analisa os conteúdos dos componentes curriculares, abordando a sua relevância para a atuação profissional e acadêmica do discente, e fomenta o raciocínio crítico com base em literatura atualizada, para além da bibliografia proposta.'
      },
      {
        concept: '4',
        criterion:
          'O corpo docente analisa os conteúdos dos componentes curriculares, abordando a sua relevância para a atuação profissional e acadêmica do discente, fomenta o raciocínio crítico com base em literatura atualizada, para além da bibliografia proposta, e proporciona o acesso a conteúdos de pesquisa de ponta, relacionando-os aos objetivos das disciplinas e ao perfil do egresso.'
      },
      {
        concept: '5',
        criterion:
          'O corpo docente analisa os conteúdos dos componentes curriculares, abordando a sua relevância para a atuação profissional e acadêmica do discente, fomenta o raciocínio crítico com base em literatura atualizada, para além da bibliografia proposta, proporciona o acesso a conteúdos de pesquisa de ponta, relacionando-os aos objetivos das disciplinas e ao perfil do egresso, e incentiva a produção do conhecimento, por meio de grupos de estudo ou de pesquisa e da publicação.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'ementas-recorte-ppc',
      'pud',
      'bases-dados-periodicos',
      'acesso-conteudos-pesquisa-ponta',
      'perfil-egresso-recorte',
      'autoavaliacao-docente',
      'grupos-pesquisa',
      'publicacoes'
    ]
  },
  {
    code: '2.6',
    name: 'Regime de trabalho do corpo docente do curso',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'O regime de trabalho do corpo docente não permite o atendimento da demanda existente, considerando a dedicação à docência, o atendimento aos discentes, a participação no colegiado, o planejamento didático, a preparação e correção das avaliações de aprendizagem.'
      },
      {
        concept: '2',
        criterion:
          'O regime de trabalho do corpo docente permite um atendimento limitado da demanda existente, considerando a dedicação à docência, o atendimento aos discentes, a participação no colegiado, o planejamento didático e a preparação e correção das avaliações de aprendizagem.'
      },
      {
        concept: '3',
        criterion:
          'O regime de trabalho do corpo docente permite o atendimento integral da demanda existente, considerando a dedicação à docência, o atendimento aos discentes, a participação no colegiado, o planejamento didático e a preparação e correção das avaliações de aprendizagem.'
      },
      {
        concept: '4',
        criterion:
          'O regime de trabalho do corpo docente permite o atendimento integral da demanda existente, considerando a dedicação à docência, o atendimento aos discentes, a participação no colegiado, o planejamento didático e a preparação e correção das avaliações de aprendizagem, havendo documentação sobre as atividades dos professores em registros individuais de atividade docente.'
      },
      {
        concept: '5',
        criterion:
          'O regime de trabalho do corpo docente permite o atendimento integral da demanda existente, considerando a dedicação à docência, o atendimento aos discentes, a participação no colegiado, o planejamento didático e a preparação e correção das avaliações de aprendizagem, havendo documentação sobre as atividades dos professores em registros individuais de atividade docente, utilizados no planejamento e gestão para melhoria contínua.'
      }
    ],
    evidenceSlugs: [
      'pit-rit',
      'regime-trabalho-corpo-docente',
      'planejamento-gestao-melhoria-continua'
    ]
  },
  {
    code: '2.7',
    name: 'Experiência profissional do docente',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O corpo docente não possui experiência profissional no mundo do trabalho, ou a experiência não permite apresentar exemplos contextualizados com relação a problemas práticos.'
      },
      {
        concept: '2',
        criterion:
          'O corpo docente possui experiência profissional no mundo do trabalho, que permite apresentar exemplos contextualizados com relação a problemas práticos, de aplicação da teoria ministrada em diferentes unidades curriculares em relação ao fazer profissional, mas não se atualizar com relação à interação conteúdo e prática.'
      },
      {
        concept: '3',
        criterion:
          'O corpo docente possui experiência profissional no mundo do trabalho, que permite apresentar exemplos contextualizados com relação a problemas práticos, de aplicação da teoria ministrada em diferentes unidades curriculares em relação ao fazer profissional e atualizar-se com relação à interação conteúdo e prática.'
      },
      {
        concept: '4',
        criterion:
          'O corpo docente possui experiência profissional no mundo do trabalho, que permite apresentar exemplos contextualizados com relação a problemas práticos, de aplicação da teoria ministrada em diferentes unidades curriculares em relação ao fazer profissional, atualizar-se com relação à interação conteúdo e prática, e promover compreensão da aplicação da interdisciplinaridade no contexto laboral.'
      },
      {
        concept: '5',
        criterion:
          'O corpo docente possui experiência profissional no mundo do trabalho, que permite apresentar exemplos contextualizados com relação a problemas práticos, de aplicação da teoria ministrada em diferentes unidades curriculares em relação ao fazer profissional, atualizar-se com relação à interação conteúdo e prática, promover compreensão da aplicação da interdisciplinaridade no contexto laboral e analisar as competências previstas no PPC considerando o conteúdo abordado e a profissão.'
      }
    ],
    evidenceSlugs: [
      'experiencia-profissional-mundo-trabalho',
      'pud',
      'ppc',
      'interdisciplinaridade-recorte-ppc',
      'curriculos'
    ]
  },
  {
    code: '2.8',
    name: 'Experiência no exercício da docência na educação básica',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'O corpo docente não possui experiência na docência da educação básica, ou a experiência não permite identificar as dificuldades dos alunos ou expor o conteúdo em linguagem aderente às características da turma.'
      },
      {
        concept: '2',
        criterion:
          'O corpo docente possui experiência na docência da educação básica para promover ações que permitem identificar as dificuldades dos alunos e expor o conteúdo em linguagem aderente às características da turma.'
      },
      {
        concept: '3',
        criterion:
          'O corpo docente possui experiência na docência da educação básica para promover ações que permitem identificar as dificuldades dos alunos, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares e elaborar atividades específicas para a promoção da aprendizagem de alunos com dificuldades.'
      },
      {
        concept: '4',
        criterion:
          'O corpo docente possui experiência na docência da educação básica para promover ações que permitem identificar as dificuldades dos alunos, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, e elaborar atividades específicas para a promoção da aprendizagem de alunos com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período.'
      },
      {
        concept: '5',
        criterion:
          'O corpo docente possui experiência na docência da educação básica para promover ações que permitem identificar as dificuldades dos alunos, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, elaborar atividades específicas para a promoção da aprendizagem de alunos com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período, exerce liderança e é reconhecido pela sua produção.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '2.9',
    name: 'Experiência no exercício da docência superior',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion:
          'O corpo docente não possui experiência na docência superior, ou a experiência não permite identificar as dificuldades dos discentes ou expor o conteúdo em linguagem aderente às características da turma.'
      },
      {
        concept: '2',
        criterion:
          'O corpo docente possui experiência na docência superior para promover ações que permitem identificar as dificuldades dos discentes e expor o conteúdo em linguagem aderente às características da turma, mas não apresentar exemplos contextualizados com os conteúdos dos componentes curriculares ou elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades.'
      },
      {
        concept: '3',
        criterion:
          'O corpo docente possui experiência na docência superior para promover ações que permitem identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares e elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades.'
      },
      {
        concept: '4',
        criterion:
          'O corpo docente possui experiência na docência superior para promover ações que permitem identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, e elaborar atividades específicas para a promoção da aprendizagem de alunos com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período.'
      },
      {
        concept: '5',
        criterion:
          'O corpo docente possui experiência na docência superior para promover ações que permitem identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, e elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período, exerce liderança e é reconhecido pela sua produção.'
      }
    ],
    evidenceSlugs: [
      'declaracao-docencia-superior',
      'pud',
      'avaliacao-cpa',
      'atividades-promocao-aprendizagem-dificuldades',
      'curriculos'
    ]
  },
  {
    code: '2.10',
    name: 'Experiência no exercício da docência na educação a distância',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'A experiência do corpo docente não permite identificar as dificuldades dos discentes ou expor o conteúdo em linguagem aderente às características da turma.'
      },
      {
        concept: '2',
        criterion:
          'A experiência do corpo docente no exercício da docência na educação a distância permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, mas não apresentar exemplos contextualizados com os conteúdos dos componentes curriculares ou elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades.'
      },
      {
        concept: '3',
        criterion:
          'A experiência do corpo docente no exercício da docência na educação a distância permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares e elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades.'
      },
      {
        concept: '4',
        criterion:
          'A experiência do corpo docente no exercício da docência na educação a distância permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, e elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período.'
      },
      {
        concept: '5',
        criterion:
          'A experiência do corpo docente no exercício da docência na educação a distância permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares, e elaborar atividades específicas para a promoção da aprendizagem de discentes com dificuldades e avaliações diagnósticas, formativas e somativas, utilizando os resultados para redefinição de sua prática docente no período, exerce liderança e é reconhecido pela sua produção.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '2.11',
    name: 'Experiência no exercício da tutoria na educação a distância',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'A experiência do corpo tutorial não permite fornecer suporte às atividades dos docentes.'
      },
      {
        concept: '2',
        criterion:
          'A experiência do corpo tutorial permite fornecer suporte às atividades dos docentes, mas não realizar mediação pedagógica junto aos discentes.'
      },
      {
        concept: '3',
        criterion:
          'A experiência do corpo tutorial permite fornecer suporte às atividades dos docentes e realizar mediação pedagógica junto aos discentes.'
      },
      {
        concept: '4',
        criterion:
          'A experiência do corpo tutorial permite fornecer suporte às atividades dos docentes, realizar mediação pedagógica junto aos discentes e demonstrar inequívoca qualidade no relacionamento com os estudantes, incrementando processos de ensino aprendizagem.'
      },
      {
        concept: '5',
        criterion:
          'A experiência do corpo tutorial permite fornecer suporte às atividades dos docentes, realizar mediação pedagógica junto aos discentes, demonstrar inequívoca qualidade no relacionamento com os estudantes, incrementando processos de ensino aprendizagem, e orientar os alunos, sugerindo atividades e leituras complementares que auxiliam sua formação.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '2.12',
    name: 'Atuação do colegiado de curso ou equivalente',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
    criteria: [
      {
        concept: '1',
        criterion: 'A atuação do colegiado não está institucionalizada.'
      },
      {
        concept: '2',
        criterion:
          'O colegiado atua e está institucionalizado, mas não possui representatividade dos segmentos; ou não se reúne com periodicidade determinada; ou as reuniões e as decisões associadas não são devidamente registradas; ou não há fluxo determinado para o encaminhamento das decisões.'
      },
      {
        concept: '3',
        criterion:
          'O colegiado atua, está institucionalizado, possui representatividade dos segmentos, reúne-se com periodicidade determinada, sendo suas reuniões e as decisões associadas devidamente registradas, havendo um fluxo determinado para o encaminhamento das decisões.'
      },
      {
        concept: '4',
        criterion:
          'O colegiado atua, está institucionalizado, possui representatividade dos segmentos, reúne-se com periodicidade determinada, sendo suas reuniões e as decisões associadas devidamente registradas, havendo um fluxo determinado para o encaminhamento das decisões, e dispõe de sistema de suporte ao registro, acompanhamento e execução de seus processos e decisões.'
      },
      {
        concept: '5',
        criterion:
          'O colegiado atua, está institucionalizado, possui representatividade dos segmentos, reúne-se com periodicidade determinada, sendo suas reuniões e as decisões associadas devidamente registradas, havendo um fluxo determinado para o encaminhamento das decisões, dispõe de sistema de suporte ao registro, acompanhamento e execução de seus processos e decisões e realiza avaliação periódica sobre seu desempenho, para implementação ou ajuste de práticas de gestão.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'colegiado-recorte-ppc',
      'atuacao-colegiado',
      'institucionalizacao-colegiado',
      'representatividade-segmentos-portaria-colegiado',
      'periodicidade-reunioes',
      'registro-reunioes-decisoes',
      'fluxo-encaminhamento-decisoes',
      'sistema-suporte-registro-acompanhamento-execucao',
      'avaliacao-periodica-desempenho',
      'implementacao-ajuste-praticas-gestao'
    ]
  },
  {
    code: '2.13',
    name: 'Titulação e formação do corpo de tutores do curso',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
    criteria: [
      {
        concept: '1',
        criterion:
          'Nenhum tutor é graduado na área da disciplina pela qual é responsável.'
      },
      {
        concept: '2',
        criterion:
          'Parte dos tutores é graduada na área da disciplina pelas quais são responsáveis.'
      },
      {
        concept: '3',
        criterion:
          'Todos os tutores são graduados na área da disciplina pelas quais são responsáveis.'
      },
      {
        concept: '4',
        criterion:
          'Todos os tutores são graduados na área da disciplina pelas quais são responsáveis e a maioria possui titulação obtida em pós-graduação lato sensu.'
      },
      {
        concept: '5',
        criterion:
          'Todos os tutores são graduados na área da disciplina pelas quais são responsáveis e a maioria possui titulação obtida em pós-graduação em stricto sensu.'
      }
    ],
    evidenceSlugs: []
  },
  {
    code: '2.14',
    name: 'Experiência do corpo de tutores em educação a distância',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 39]
    criteria: [
      {
        concept: '1',
        criterion:
          'O corpo de tutores não possui experiência em educação a distância não permite identificar as dificuldades dos alunos ou expor o conteúdo em linguagem aderente às características da turma.'
      },
      {
        concept: '2',
        criterion:
          'O corpo de tutores possui experiência em educação a distância, que permite identificar as dificuldades dos discentes e expor o conteúdo em linguagem aderente às características da turma, mas não apresentar exemplos contextualizados com os conteúdos dos componentes curriculares.'
      },
      {
        concept: '3',
        criterion:
          'O corpo de tutores possui experiência em educação a distância que permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma e apresentar exemplos contextualizados com os conteúdos dos componentes curriculares.'
      },
      {
        concept: '4',
        criterion:
          'O corpo de tutores possui experiência em educação a distância que permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares e elaborar atividades específicas, em colaboração com os docentes, para a promoção da aprendizagem de alunos com dificuldades.'
      },
      {
        concept: '5',
        criterion:
          'O corpo de tutores possui experiência em educação a distância que permite identificar as dificuldades dos discentes, expor o conteúdo em linguagem aderente às características da turma, apresentar exemplos contextualizados com os conteúdos dos componentes curriculares e elaborar atividades específicas, em colaboração com os docentes, para a promoção da aprendizagem de alunos com dificuldades, e adota práticas comprovadamente exitosas ou inovadoras no contexto da modalidade a distância.'
      }
    ],
    evidenceSlugs: [] // [cite: 73]
  },
  {
    code: '2.15',
    name: 'Interação entre tutores (presenciais quando for o caso - e a distância), docentes e coordenadores de curso a distância',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 40]
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há interação, explicitada no PPC, para garantir a mediação ou a articulação entre tutores, docentes e coordenador do curso.'
      },
      {
        concept: '2',
        criterion:
          'Há interação, explicitada no PPC, que não garante a mediação ou a articulação entre tutores, docentes e coordenador do curso.'
      },
      {
        concept: '3',
        criterion:
          'Há interação, explicitada no PPC, que garante a mediação e a articulação entre tutores, docentes e coordenador do curso.'
      },
      {
        concept: '4',
        criterion:
          'Há interação, explicitada no PPC, que garante a mediação e a articulação entre tutores, docentes e coordenador do curso e há planejamento devidamente documentado de interação para encaminhamento de questões do curso.'
      },
      {
        concept: '5',
        criterion:
          'Há interação, explicitada no PPC, que garante a mediação e a articulação entre tutores, docentes e coordenador do curso (e, quando for o caso, coordenador do polo), há planejamento devidamente documentado de interação para encaminhamento de questões do curso, e são realizadas avaliações periódicas para a identificação de problemas ou incremento na interação entre os interlocutores.'
      }
    ],
    evidenceSlugs: [] // [cite: 73]
  },
  {
    code: '2.16',
    name: 'Produção científica, cultural, artística ou tecnológica',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 41]
    criteria: [
      {
        concept: '1',
        criterion:
          'Mais de 50% dos docentes não possuem produção nos últimos 3 anos.'
      },
      {
        concept: '2',
        criterion:
          'Pelo menos 50% dos docentes possuem, no mínimo, 1 produção nos últimos 3 anos.'
      },
      {
        concept: '3',
        criterion:
          'Pelo menos 50% dos docentes possuem, no mínimo, 4 produções nos últimos 3 anos.'
      },
      {
        concept: '4',
        criterion:
          'Pelo menos 50% dos docentes possuem, no mínimo, 7 produções nos últimos 3 anos.'
      },
      {
        concept: '5',
        criterion:
          'Pelo menos 50% dos docentes possuem, no mínimo, 9 produções nos últimos 3 anos.'
      }
    ],
    evidenceSlugs: ['relacao-producoes-3-anos', 'curriculos'] // [cite: 73]
  },

  // ----- DIMENSÃO 3 -----
  {
    code: '3.1',
    name: 'Espaço de trabalho para docentes em tempo integral',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 43]
    criteria: [
      {
        concept: '1',
        criterion:
          'Os espaços de trabalho para docentes em Tempo Integral não viabilizam ações acadêmicas, como planejamento didático-pedagógico.'
      },
      {
        concept: '2',
        criterion:
          'Os espaços de trabalho para docentes em Tempo Integral viabilizam ações acadêmicas, como planejamento didático-pedagógico, mas não atendem às necessidades institucionais ou não possuem recursos de tecnologias da informação e comunicação apropriados.'
      },
      {
        concept: '3',
        criterion:
          'Os espaços de trabalho para docentes em Tempo Integral viabilizam ações acadêmicas, como planejamento didático-pedagógico, atendem às necessidades institucionais e possuem recursos de tecnologias da informação e comunicação apropriados.'
      },
      {
        concept: '4',
        criterion:
          'Os espaços de trabalho para docentes em Tempo Integral viabilizam ações acadêmicas, como planejamento didático-pedagógico, atendem às necessidades institucionais, possuem recursos de tecnologias da informação e comunicação apropriados, e garantem privacidade para uso dos recursos e para o atendimento a discentes e orientandos.'
      },
      {
        concept: '5',
        criterion:
          'Os espaços de trabalho para docentes em Tempo Integral viabilizam ações acadêmicas, como planejamento didático-pedagógico, atendem às necessidades institucionais, possuem recursos de tecnologias da informação e comunicação apropriados, garantem privacidade para uso dos recursos, para o atendimento a discentes e orientandos, e para a guarda de material e equipamentos pessoais, com segurança.'
      }
    ],
    evidenceSlugs: ['espacos-trabalho-docentes-ti'] // [cite: 73]
  },
  {
    code: '3.2',
    name: 'Espaço de trabalho para o coordenador',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 44]
    criteria: [
      {
        concept: '1',
        criterion:
          'O espaço de trabalho para o coordenador não viabiliza as ações acadêmico-administrativas.'
      },
      {
        concept: '2',
        criterion:
          'O espaço de trabalho para o coordenador viabiliza as ações acadêmico-administrativas, mas não possui equipamentos adequados ou não atende às necessidades institucionais.'
      },
      {
        concept: '3',
        criterion:
          'O espaço de trabalho para o coordenador viabiliza as ações acadêmico-administrativas, possui equipamentos adequados e atende às necessidades institucionais.'
      },
      {
        concept: '4',
        criterion:
          'O espaço de trabalho para o coordenador viabiliza as ações acadêmico-administrativas, possui equipamentos adequados, atende às necessidades institucionais e permite o atendimento de indivíduos ou grupos com privacidade.'
      },
      {
        concept: '5',
        criterion:
          'O espaço de trabalho para o coordenador viabiliza as ações acadêmico-administrativas, possui equipamentos adequados, atende às necessidades institucionais, permite o atendimento de indivíduos ou grupos com privacidade e dispõe de infraestrutura tecnológica diferenciada, que possibilita formas distintas de trabalho.'
      }
    ],
    evidenceSlugs: ['sala-coordenacao', 'registro-bens-sala-coordenacao'] // [cite: 73]
  },
  {
    code: '3.3',
    name: 'Sala coletiva de professores',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 45]
    criteria: [
      {
        concept: '1',
        criterion:
          'A sala coletiva de professores não viabiliza o trabalho docente.'
      },
      {
        concept: '2',
        criterion:
          'A sala coletiva de professores viabiliza o trabalho docente, mas não possui recursos de tecnologias da informação e comunicação apropriados para o quantitativo de docentes.'
      },
      {
        concept: '3',
        criterion:
          'A sala coletiva de professores viabiliza o trabalho docente, apresenta acessibilidade e possui recursos de tecnologias da informação e comunicação apropriados para o quantitativo de docentes.'
      },
      {
        concept: '4',
        criterion:
          'A sala coletiva de professores viabiliza o trabalho docente, possui recursos de tecnologias da informação e comunicação apropriados para o quantitativo de docentes e permite o descanso e atividades de lazer e integração.'
      },
      {
        concept: '5',
        criterion:
          'A sala coletiva de professores viabiliza o trabalho docente, possui recursos de tecnologias da informação e comunicação apropriados para o quantitativo de docentes, permite o descanso e atividades de lazer e integração e dispõe de apoio técnico-administrativo próprio e espaço para a guarda de equipamentos e materiais.'
      }
    ],
    evidenceSlugs: ['sala-coletiva-professores', 'registro-bens-sala-coletiva'] // [cite: 74]
  },
  {
    code: '3.4',
    name: 'Salas de aula',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 46]
    criteria: [
      {
        concept: '1',
        criterion:
          'As salas de aula não atendem às necessidades institucionais e do curso.'
      },
      {
        concept: '2',
        criterion:
          'As salas de aula atendem às necessidades institucionais e do curso, mas não apresentam manutenção periódica, ou conforto, ou disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas.'
      },
      {
        concept: '3',
        criterion:
          'As salas de aula atendem às necessidades institucionais e do curso, apresentando manutenção periódica, conforto e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas.'
      },
      {
        concept: '4',
        criterion:
          'As salas de aula atendem às necessidades institucionais e do curso, apresentando manutenção periódica, conforto, disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas e flexibilidade relacionada às configurações espaciais, oportunizando distintas situações de ensino-aprendizagem.'
      },
      {
        concept: '5',
        criterion:
          'As salas de aula atendem às necessidades institucionais e do curso, apresentando manutenção periódica, conforto, disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, flexibilidade relacionada às configurações espaciais, oportunizando distintas situações de ensino-aprendizagem, e possuem outros recursos cuja utilização é comprovadamente exitosa.'
      }
    ],
    evidenceSlugs: ['salas-aula', 'manutencao-periodica'] // [cite: 74]
  },
  {
    code: '3.5',
    name: 'Acesso dos alunos a equipamentos de informática',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 47]
    criteria: [
      {
        concept: '1',
        criterion:
          'O laboratório de informática, ou outro meio de acesso a equipamentos de informática pelos discentes, não atende às necessidades institucionais e do curso.'
      },
      {
        concept: '2',
        criterion:
          'O laboratório de informática, ou outro meio de acesso a equipamentos de informática pelos discentes, atende às necessidades institucionais e do curso, mas não em relação à disponibilidade de equipamentos, ao conforto, à estabilidade e velocidade de acesso à internet, à rede sem fio ou à adequação do espaço físico.'
      },
      {
        concept: '3',
        criterion:
          'O laboratório de informática, ou outro meio de acesso a equipamentos de informática pelos discentes, atende às necessidades institucionais e do curso em relação à disponibilidade de equipamentos, ao conforto, à estabilidade e velocidade de acesso à internet, à rede sem fio e à adequação do espaço físico.'
      },
      {
        concept: '4',
        criterion:
          'O laboratório de informática, ou outro meio de acesso a equipamentos de informática pelos discentes, atende às necessidades institucionais e do curso em relação à disponibilidade de equipamentos, ao conforto, à estabilidade e velocidade de acesso à internet, à rede sem fio e à adequação do espaço físico, e possui hardware e software atualizados.'
      },
      {
        concept: '5',
        criterion:
          'O laboratório de informática, ou outro meio de acesso a equipamentos de informática pelos discentes, atende às necessidades institucionais e do curso em relação à disponibilidade de equipamentos, ao conforto, à estabilidade e velocidade de acesso à internet, à rede sem fio e à adequação do espaço físico, possui hardware e software atualizados e passa por avaliação periódica de sua adequação, qualidade e pertinência.'
      }
    ],
    evidenceSlugs: [
      'memorando-criacao-laboratorio',
      'meios-acesso-equipamentos-informatica',
      'normas-uso-laboratorios-informatica',
      'contratacao-internet'
    ] // [cite: 74]
  },
  {
    code: '3.6',
    name: 'Bibliografia básica por Unidade Curricular (UC)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 48]
    criteria: [
      {
        concept: '1',
        criterion:
          'O acervo físico não está tombado e informatizado; ou o virtual não possui contrato que garante o acesso ininterrupto pelos usuários; ou pelo menos um deles não está registrado em nome da IES. Ou o acervo da bibliografia básica não é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC ou não está atualizado, considerando a natureza das UC. Ou, ainda, não está referendado por relatório de adequação, ou não está assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo.'
      },
      {
        concept: '2',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia básica é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Porém, não está referendado por relatório de adequação, ou não está assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Ou, nos casos dos títulos virtuais, não há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, ou de ferramentas de acessibilidade ou de soluções de apoio à leitura, estudo e aprendizagem.'
      },
      {
        concept: '3',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia básica é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem.'
      },
      {
        concept: '4',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia básica é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem. O acervo possui exemplares, ou assinaturas de acesso virtual, de periódicos especializados que suplementam o conteúdo administrado nas UC.'
      },
      {
        concept: '5',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia básica é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem. O acervo possui exemplares, ou assinaturas de acesso virtual, de periódicos especializados que suplementam o conteúdo administrado nas UC. O acervo é gerenciado de modo a atualizar a quantidade de exemplares e/ou assinaturas de acesso mais demandadas, sendo adotado plano de contingência para a garantia do acesso e do serviço.'
      }
    ],
    evidenceSlugs: [
      'evidencias-acervo-tombado',
      'relatorio-adequacao-nde',
      'contratos-bibliotecas-virtuais',
      'bases-dados-periodicos',
      'gerenciamento-acervo',
      'praticas-exitosas',
      'links-acesso',
      'regulamento-guia-usuario',
      'plano-atualizacao-expansao-acervo',
      'memorial-descritivo-biblioteca',
      'portfolio-biblioteca',
      'planta-baixa-biblioteca'
    ] // [cite: 74, 75]
  },
  {
    code: '3.7',
    name: 'Bibliografia complementar por Unidade Curricular (UC)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE, // [cite: 49]
    criteria: [
      {
        concept: '1',
        criterion:
          'O acervo físico não está tombado e informatizado; ou o virtual não possui contrato que garante o acesso ininterrupto pelos usuários; ou pelo menos um deles não está registrado em nome da IES. Ou o acervo da bibliografia complementar não é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC ou não está atualizado, considerando a natureza das UC. Ou, ainda, não está referendado por relatório de adequação, ou não está assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia básica da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo.'
      },
      {
        concept: '2',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia complementar é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Porém, não está referendado por relatório de adequação, ou não está assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia complementar da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Ou, nos casos dos títulos virtuais, não há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, ou de ferramentas de acessibilidade ou de soluções de apoio à leitura, estudo e aprendizagem.'
      },
      {
        concept: '3',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia complementar é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia complementar da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem.'
      },
      {
        concept: '4',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia complementar é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia complementar da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura de acesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem. O acervo possui exemplares, ou assinaturas de acesso virtual, de periódicos especializados que complementam o conteúdo administrado nas UC.'
      },
      {
        concept: '5',
        criterion:
          'O acervo físico está tombado e informatizado, o virtual possui contrato que garante o acesso ininterrupto pelos usuários e ambos estão registrados em nome da IES. O acervo da bibliografia complementar é adequado em relação às unidades curriculares e aos conteúdos descritos no PPC e está atualizado, considerando a natureza das UC. Da mesma forma, está referendado por relatório de adequação, assinado pelo NDE, comprovando a compatibilidade, em cada bibliografia complementar da UC, entre o número de vagas autorizadas (do próprio curso e de outros que utilizem os títulos) e a quantidade de exemplares por título (ou assinatura decesso) disponível no acervo. Nos casos dos títulos virtuais, há garantia de acesso físico na IES, com instalações e recursos tecnológicos que atendem à demanda e à oferta ininterrupta via internet, bem como de ferramentas de acessibilidade e de soluções de apoio à leitura, estudo e aprendizagem. O acervo possui exemplares, ou assinaturas de acesso virtual, de periódicos especializados que complementam o conteúdo administrado nas UC. O acervo é gerenciado de modo a atualizar a quantidade de exemplares e/ou assinaturas de acesso mais demandadas, sendo adotado plano de contingência para a garantia do acesso e do serviço.'
      }
    ],
    evidenceSlugs: [
      'evidencias-acervo-tombado',
      'relatorio-adequacao-nde',
      'contratos-bibliotecas-virtuais',
      'bases-dados-periodicos',
      'gerenciamento-acervo',
      'praticas-exitosas',
      'links-acesso',
      'regulamento-guia-usuario',
      'plano-atualizacao-expansao-acervo',
      'memorial-descritivo-biblioteca',
      'portfolio-biblioteca',
      'planta-baixa-biblioteca'
    ] // [cite: 75]
  },
  {
    code: '3.8',
    name: 'Laboratórios didáticos de formação básica',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 50]
    criteria: [
      {
        concept: '1',
        criterion:
          'Os laboratórios didáticos não atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento.'
      },
      {
        concept: '2',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, mas não apresentam conforto, manutenção periódica, serviços de apoio técnico ou disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, ou não possuem quantidade de insumos, materiais ou equipamentos condizentes com os espaços físicos e o número de vagas.'
      },
      {
        concept: '3',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas.'
      },
      {
        concept: '4',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas, havendo, ainda, avaliação periódica quanto às demandas, aos serviços prestados e à qualidade dos laboratórios.'
      },
      {
        concept: '5',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas, havendo, ainda, avaliação periódica quanto às demandas, aos serviços prestados e à qualidade dos laboratórios, sendo os resultados utilizados pela gestão acadêmica para planejar o incremento da qualidade do atendimento, da demanda existente e futura e das aulas ministradas.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'laboratorios-recorte-ppc',
      'laboratorios-informatica',
      'laboratorio-educacao',
      'manutencao-periodica',
      'resultados'
    ] // [cite: 75]
  },
  {
    code: '3.9',
    name: 'Laboratórios didáticos de formação específica',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 51]
    criteria: [
      {
        concept: '1',
        criterion:
          'Os laboratórios didáticos não atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento.'
      },
      {
        concept: '2',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, mas não apresentam conforto, manutenção periódica, serviços de apoio técnico ou disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, ou não possuem quantidade de insumos, materiais ou equipamentos condizentes com os espaços físicos e o número de vagas.'
      },
      {
        concept: '3',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas.'
      },
      {
        concept: '4',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas, havendo, ainda, avaliação periódica quanto às demandas, aos serviços prestados e à qualidade dos laboratórios.'
      },
      {
        concept: '5',
        criterion:
          'Os laboratórios didáticos atendem às necessidades do curso, de acordo com o PPC e com as respectivas normas de funcionamento, utilização e segurança, apresentam conforto, manutenção periódica, serviços de apoio técnico e disponibilidade de recursos de tecnologias da informação e comunicação adequados às atividades a serem desenvolvidas, e possuem quantidade de insumos, materiais e equipamentos condizentes com os espaços físicos e o número de vagas, havendo, ainda, avaliação periódica quanto às demandas, aos serviços prestados e à qualidade dos laboratórios, sendo os resultados utilizados pela gestão acadêmica para planejar o incremento da qualidade do atendimento, da demanda existente e futura e das aulas ministradas.'
      }
    ],
    evidenceSlugs: [
      'ppc',
      'laboratorios-recorte-ppc',
      'laboratorios-especificos',
      'manutencao-periodica',
      'resultados'
    ] // [cite: 76]
  },
  {
    code: '3.10',
    name: 'Laboratórios de ensino para a área de saúde',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 52]
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há laboratórios específicos e multidisciplinares em conformidade com as DCN.'
      },
      {
        concept: '2',
        criterion:
          'Há laboratórios específicos e multidisciplinares, em conformidade com as DCN, que permitem a abordagem dos diferentes aspectos celulares e moleculares das ciências da vida.'
      },
      {
        concept: '3',
        criterion:
          'Há laboratórios específicos e multidisciplinares, em conformidade com as DCN, que permitem a abordagem dos diferentes aspectos celulares e moleculares das ciências da vida e atendem ao PPC.'
      },
      {
        concept: '4',
        criterion:
          'Há laboratórios específicos e multidisciplinares, em conformidade com as DCN, que permitem a abordagem dos diferentes aspectos celulares e moleculares das ciências da vida, atendem ao PPC e possuem recursos e insumos necessários para atender à demanda discente.'
      },
      {
        concept: '5',
        criterion:
          'Há laboratórios específicos e multidisciplinares, em conformidade com as DCN, que permitem a abordagem dos diferentes aspectos celulares e moleculares das ciências da vida, atendem ao PPC, possuem recursos e insumos necessários para atender à demanda discente e apresentam recursos tecnológicos comprovadamente inovadores.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.11',
    name: 'Laboratórios de habilidades',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 53]
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há laboratórios de habilidades da atividade médica ou de saúde em conformidade com o PPC.'
      },
      {
        concept: '2',
        criterion:
          'Há laboratórios de habilidades da atividade médica ou de saúde em conformidade com o PPC, mas não permitem a capacitação dos discentes nas diversas competências desenvolvidas nas diferentes fases do curso.'
      },
      {
        concept: '3',
        criterion:
          'Há laboratórios de habilidades da atividade médica ou de saúde, em conformidade com o PPC, que permitem a capacitação dos discentes nas diversas competências desenvolvidas nas diferentes fases do curso.'
      },
      {
        concept: '4',
        criterion:
          'Há laboratórios de habilidades da atividade médica ou de saúde, em conformidade com o PPC, que permitem a capacitação dos discentes nas diversas competências desenvolvidas nas diferentes fases do curso, com recursos tecnológicos.'
      },
      {
        concept: '5',
        criterion:
          'Há laboratórios de habilidades da atividade médica ou de saúde, em conformidade com o PPC, que permitem a capacitação dos discentes nas diversas competências desenvolvidas nas diferentes fases do curso, com recursos tecnológicos comprovadamente inovadores.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.12',
    name: 'Unidades hospitalares e complexo assistencial conveniados',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 54]
    criteria: [
      {
        concept: '1',
        criterion:
          'A IES não conta com unidade(s) hospitalar(es), própria(s) ou conveniada(s), garantida(s) legalmente por período determinado.'
      },
      {
        concept: '2',
        criterion:
          'A IES conta com unidade(s) hospitalar(es), própria(s) ou conveniada(s), garantida(s) legalmente por período determinado, mas que não apresenta(m) condições para a formação do estudante da área de saúde.'
      },
      {
        concept: '3',
        criterion:
          'A IES conta com unidade(s) hospitalar(es), própria(s) ou conveniada(s), garantida(s) legalmente por período determinado, que apresenta(m) condições para a formação do estudante da área de saúde.'
      },
      {
        concept: '4',
        criterion:
          'A IES conta com unidade(s) hospitalar(es), própria(s) ou conveniada(s), garantida(s) legalmente por período determinado, que apresenta(m) condições para a formação do estudante da área de saúde e estabelece(m) sistema de referência e contrarreferência.'
      },
      {
        concept: '5',
        criterion:
          'A IES conta com unidade(s) hospitalar(es), própria(s) ou conveniada(s), garantida(s) legalmente por período determinado, que apresenta(m) condições para a formação do estudante da área de saúde, estabelece(m) sistema de referência e contrarreferência e favorece(m) práticas interdisciplinares e interprofissionais na atenção à saúde.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.13',
    name: 'Biotérios',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 55]
    criteria: [
      {
        concept: '1',
        criterion: 'O biotério não atende às necessidades práticas de ensino.'
      },
      {
        concept: '2',
        criterion:
          'O biotério atende às necessidades práticas do ensino, mas não possui insumos necessários à demanda docente e discente ou não apresenta protocolos de experimentos de acordo com as normas internacionais vigentes.'
      },
      {
        concept: '3',
        criterion:
          'O biotério atende às necessidades práticas do ensino, possuindo insumos necessários à demanda docente e discente e apresentando protocolos de experimentos de acordo com as normas internacionais vigentes.'
      },
      {
        concept: '4',
        criterion:
          'O biotério atende às necessidades práticas do ensino, possuindo insumos necessários à demanda docente e discente e apresentando protocolos de experimentos de acordo com as normas internacionais vigentes e suporte técnico e experimental.'
      },
      {
        concept: '5',
        criterion:
          'O biotério atende às necessidades práticas do ensino, possuindo insumos necessários à demanda docente e discente e apresentando protocolos de experimentos de acordo com as normas internacionais vigentes e suporte técnico, experimental e pedagógico.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.14',
    name: 'Processo de controle de produção ou distribuição de material didático (logística)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 56]
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há processo de controle de produção ou distribuição de material didático.'
      },
      {
        concept: '2',
        criterion:
          'O processo de controle de produção ou distribuição de material didático não está formalizado ou não atende à demanda.'
      },
      {
        concept: '3',
        criterion:
          'O processo de controle de produção ou distribuição de material didático está formalizado, atende à demanda e possui plano de contingência para a garantia de continuidade de funcionamento.'
      },
      {
        concept: '4',
        criterion:
          'O processo de controle de produção ou distribuição de material didático está formalizado, atende à demanda e possui plano de contingência para a garantia de continuidade de funcionamento e dispõe de um sistema informatizado de acompanhamento para gerenciamento dos processos.'
      },
      {
        concept: '5',
        criterion:
          'O processo de controle de produção ou distribuição de material didático está formalizado, atende à demanda e possui plano de contingência para a garantia de continuidade de funcionamento e dispõe de um sistema informatizado de acompanhamento para gerenciamento dos processos, com uso de indicadores bem definidos.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.15',
    name: 'Núcleo de práticas jurídicas: atividades básicas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 57]
    criteria: [
      {
        concept: '1',
        criterion:
          'O Núcleo de Práticas Jurídicas não está implantado ou não possui regulamento específico destinado à realização de práticas jurídicas simuladas ou arbitragem, negociação, conciliação, mediação e atividades jurídicas reais.'
      },
      {
        concept: '2',
        criterion:
          'O Núcleo de Práticas Jurídicas possui regulamento específico destinado à realização de práticas jurídicas simuladas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais e oferta visitas orientadas, mas não atende às demandas do curso.'
      },
      {
        concept: '3',
        criterion:
          'O Núcleo de Práticas Jurídicas possui regulamento específico destinado à realização de práticas jurídicas simuladas e de arbitragem, negociação, conciliação, mediação e atividades jurídicas reais e oferta visitas orientadas, atendendo às demandas do curso e buscando a interdisciplinaridade das matérias legais.'
      },
      {
        concept: '4',
        criterion:
          'O Núcleo de Práticas Jurídicas possui regulamento específico destinado à realização de práticas jurídicas simuladas e de arbitragem, negociação, conciliação, mediação e atividades jurídicas reais e oferta visitas orientadas, atendendo às demandas do curso e buscando a interdisciplinaridade das matérias legais, havendo avaliação periódica quanto ao atendimento da demanda do curso pelo Núcleo de Práticas Jurídicas em suas atividades básicas.'
      },
      {
        concept: '5',
        criterion:
          'O Núcleo de Práticas Jurídicas possui regulamento específico destinado à realização de práticas jurídicas simuladas e de arbitragem, negociação, conciliação, mediação e atividades jurídicas reais e oferta visitas orientadas, atendendo às demandas do curso e buscando a interdisciplinaridade das matérias legais, havendo avaliação periódica quanto ao atendimento da demanda do curso pelo Núcleo de Práticas Jurídicas em suas atividades básicas, também utilizada em processos de planejamento para o adequado atendimento da demanda existente.'
      }
    ],
    evidenceSlugs: [] // [cite: 76]
  },
  {
    code: '3.16',
    name: 'Comitê de Ética em Pesquisa (CEP)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 58]
    criteria: [
      { concept: '1', criterion: 'Não há Comitê de Ética em Pesquisa (CEP).' },
      {
        concept: '2',
        criterion:
          'O Comitê de Ética em Pesquisa não está homologado pela CONEP.'
      },
      {
        concept: '3',
        criterion:
          'O Comitê de Ética em Pesquisa (CEP) está homologado pela CONEP e pertence a instituição parceira.'
      },
      {
        concept: '4',
        criterion:
          'O Comitê de Ética em Pesquisa (CEP) está homologado pela CONEP e pertence à própria instituição.'
      },
      {
        concept: '5',
        criterion:
          'O Comitê de Ética em Pesquisa (CEP) está homologado pela CONEP, pertence à própria instituição e presta atendimento a instituições parceiras.'
      }
    ],
    evidenceSlugs: [
      'regimento-interno-cep',
      'membros-cep',
      'pagina-institucional-cep'
    ] // [cite: 76]
  },
  {
    code: '3.17',
    name: 'Comitê de Ética na Utilização de Animais (CEUA)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 59]
    criteria: [
      {
        concept: '1',
        criterion: 'Não há Comitê de Ética na Utilização de Animais (CEUA).'
      },
      {
        concept: '2',
        criterion:
          'O Comitê de Ética na Utilização de Animais (CEUA) não está homologado pela CONEP.'
      },
      {
        concept: '3',
        criterion:
          'O Comitê de Ética na Utilização de Animais (CEUA) está homologado pela CONEP e pertence a instituição parceira.'
      },
      {
        concept: '4',
        criterion:
          'O Comitê de Ética na Utilização de Animais (CEUA) está homologado pela CONEP e pertence à própria instituição.'
      },
      {
        concept: '5',
        criterion:
          'O Comitê de Ética na Utilização de Animais (CEUA) está homologado pela CONEP, pertence à própria instituição e presta atendimento a instituições parceiras.'
      }
    ],
    evidenceSlugs: [] // [cite: 77]
  },
  {
    code: '3.18',
    name: 'Ambientes profissionais vinculados ao curso',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT, // [cite: 60]
    criteria: [
      {
        concept: '1',
        criterion:
          'Não há ambientes profissionais articulados com a sede ou com os polos.'
      },
      {
        concept: '2',
        criterion:
          'Os ambientes profissionais estão articulados com a sede ou com os polos onde há oferta do curso, mas não atendem aos objetivos constantes no PPC.'
      },
      {
        concept: '3',
        criterion:
          'Os ambientes profissionais estão articulados com a sede ou com os polos onde há oferta do curso e atendem aos objetivos constantes no PPC, considerando a função de espaços complementares para práticas laboratoriais e/ou profissionais.'
      },
      {
        concept: '4',
        criterion:
          'Os ambientes profissionais estão articulados com a sede ou com os polos onde há oferta do curso e atendem aos objetivos constantes no PPC, considerando a função de espaços complementares para práticas laboratoriais e/ou profissionais que possibilitam experiências diferenciadas de aprendizagem.'
      },
      {
        concept: '5',
        criterion:
          'Os ambientes profissionais estão articulados com a sede ou com os polos onde há oferta do curso e atendem aos objetivos constantes no PPC, considerando a função de espaços complementares para práticas laboratoriais e/ou profissionais que possibilitam experiências diferenciadas de aprendizagem, as quais passam por avaliações periódicas devidamente documentadas, que resultam em ações de melhoria contínua.'
      }
    ],
    evidenceSlugs: [] // [cite: 77]
  }
];

const instanceDataByCode: Record<
  string,
  { grade: IndicatorGrade; status: IndicatorStatus; lastUpdate: string | null }
> = {
  // ----- Dimensão 1 -----
  '1.1': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-01'
  },
  '1.2': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-28'
  },
  '1.3': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: '2025-05-20'
  },
  '1.4': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '1.5': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-30'
  },
  '1.6': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.7': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.8': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.9': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.10': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.11': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.12': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.13': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.14': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.15': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.16': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.17': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.18': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.19': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.20': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.21': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.22': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.23': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-06-02'
  },
  '1.24': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },

  // ----- Dimensão 2 -----
  '2.1': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-29'
  },
  '2.2': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-25'
  },
  '2.3': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.4': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-30'
  },
  '2.5': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-01'
  },
  '2.6': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-28'
  },
  '2.7': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.8': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-02'
  },
  '2.9': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-27'
  },
  '2.10': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.11': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.12': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-26'
  },
  '2.13': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.14': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '2.15': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-03'
  },
  '2.16': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-02'
  },

  // ----- Dimensão 3 -----
  '3.1': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-28'
  },
  '3.2': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-29'
  },
  '3.3': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-30'
  },
  '3.4': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '3.5': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '3.6': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-27'
  },
  '3.7': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-01'
  },
  '3.8': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-25'
  },
  '3.9': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '3.10': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-02'
  },
  '3.11': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '3.12': {
    grade: IndicatorGrade.G5,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-03'
  },
  '3.13': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-26'
  },
  '3.14': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-05-31'
  },
  '3.15': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  },
  '3.16': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.EM_REVISAO,
    lastUpdate: '2025-05-29'
  },
  '3.17': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    lastUpdate: '2025-06-01'
  },
  '3.18': {
    grade: IndicatorGrade.NSA,
    status: IndicatorStatus.PENDENTE,
    lastUpdate: null
  }
};

async function main() {
  console.log('🌱 Iniciando o processo de seed...');

  // 1. LIMPEZA DO BANCO DE DADOS
  console.log('🗑️  Limpando dados existentes...');
  await prisma.evidenceFile.deleteMany();
  await prisma.evidenceSubmission.deleteMany();
  await prisma.courseIndicator.deleteMany();
  await prisma.indicatorRequirement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.indicatorDefinition.deleteMany();
  await prisma.evidenceRequirement.deleteMany();
  await prisma.dimensionDefinition.deleteMany();
  console.log('✅ Dados limpos.');

  // 2. CRIAÇÃO DAS DIMENSÕES
  console.log('📚 Criando Dimensões...');
  const dim1 = await prisma.dimensionDefinition.upsert({
    where: { number: 1 },
    update: {},
    create: { number: 1, title: 'Dimensão 1 - Organização Didático-Pedagógica' }
  });
  const dim2 = await prisma.dimensionDefinition.upsert({
    where: { number: 2 },
    update: {},
    create: { number: 2, title: 'Dimensão 2 - Corpo docente e tutorial' }
  });
  const dim3 = await prisma.dimensionDefinition.upsert({
    where: { number: 3 },
    update: {},
    create: { number: 3, title: 'Dimensão 3 - Infraestrutura' }
  });
  const dimensions = { 1: dim1, 2: dim2, 3: dim3 };
  console.log('✅ Dimensões criadas.');

  // 3. CRIAÇÃO DE TODOS OS REQUISITOS DE EVIDÊNCIA
  console.log('📄 Criando catálogo de Requisitos de Evidência...');
  await prisma.evidenceRequirement.createMany({
    data: allEvidenceRequirements
  });
  console.log(
    `✅ ${await prisma.evidenceRequirement.count()} Requisitos de Evidência criados.`
  );

  // 4. CRIAÇÃO DAS DEFINIÇÕES DE INDICADORES E SEUS VÍNCULOS COM AS EVIDÊNCIAS
  console.log('📊 Criando Definições de Indicadores e seus vínculos...');
  const allEvidenceReqs = await prisma.evidenceRequirement.findMany({
    select: { id: true, slug: true }
  });
  const evidenceMapBySlug = new Map(allEvidenceReqs.map((e) => [e.slug, e.id]));

  for (const indicatorData of indicatorsData) {
    const createdIndicator = await prisma.indicatorDefinition.create({
      data: {
        code: indicatorData.code,
        name: indicatorData.name,
        dimensionId:
          dimensions[indicatorData.dimensionNumber as keyof typeof dimensions]
            .id,
        nsaPolicy: indicatorData.nsaPolicy,
        criteriaTable: indicatorData.criteria as any // Prisma aceita o formato JSON
      }
    });

    const requirementIds = indicatorData.evidenceSlugs
      .map((slug) => evidenceMapBySlug.get(slug))
      .filter((id): id is string => !!id);

    if (requirementIds.length > 0) {
      await prisma.indicatorRequirement.createMany({
        data: requirementIds.map((reqId, index) => ({
          indicatorId: createdIndicator.id,
          requirementId: reqId,
          order: index + 1
        }))
      });
    }
  }
  console.log(
    `✅ ${await prisma.indicatorDefinition.count()} Definições de Indicadores criadas e vinculadas.`
  );

  // 5. CRIAÇÃO DOS CURSOS
  console.log('🏫 Criando cursos...');
  const courseAds = await prisma.course.create({
    data: {
      name: 'Análise e Desenvolvimento de Sistemas',
      code: 'ads',
      level: 'Tecnólogo',
      modality: 'Presencial'
    }
  });

  const courseEng = await prisma.course.create({
    data: {
      name: 'Engenharia Civil',
      code: 'eng-civil',
      level: 'Bacharelado',
      modality: 'Presencial'
    }
  });
  console.log(`✅ ${await prisma.course.count()} cursos criados.`);

  // 6. INSTANCIAÇÃO DOS INDICADORES PARA CADA CURSO
  console.log('🖇️  Vinculando indicadores aos cursos...');
  const allIndicatorDefs = await prisma.indicatorDefinition.findMany();

  // Para o curso de ADS, usas os dados de instância de indicators.ts
  for (const indicatorDef of allIndicatorDefs) {
    let nsaApplicable = true,
      nsaLocked = false;

    // Lógica de NSA
    if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_APPLICABLE) {
      nsaApplicable = true;
      nsaLocked = true;
    } else if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_NSA) {
      nsaApplicable = false;
      nsaLocked = true;
    } else {
      // COURSE_DEPENDENT
      nsaApplicable = true;
      nsaLocked = false;
    }

    const instance = instanceDataByCode[indicatorDef.code];
    const grade = instance ? instance.grade : IndicatorGrade.NSA;
    const status = instance ? instance.status : IndicatorStatus.PENDENTE;
    const lastUpdate = instance?.lastUpdate
      ? new Date(instance.lastUpdate)
      : null;

    await prisma.courseIndicator.create({
      data: {
        courseId: courseAds.id,
        indicatorDefId: indicatorDef.id,
        nsaApplicable,
        nsaLocked,
        grade: nsaApplicable ? grade : IndicatorGrade.NSA, // Se não aplicável, força a nota NSA
        status,
        lastUpdate
      }
    });
  }

  // Para o curso de Engenharia, criar todos como pendentes
  for (const indicatorDef of allIndicatorDefs) {
    let nsaApplicable = true,
      nsaLocked = false;

    if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_APPLICABLE) {
      nsaApplicable = true;
      nsaLocked = true;
    } else if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_NSA) {
      nsaApplicable = false;
      nsaLocked = true;
    } else {
      nsaApplicable = true;
      nsaLocked = false;
    }

    await prisma.courseIndicator.create({
      data: {
        courseId: courseEng.id,
        indicatorDefId: indicatorDef.id,
        nsaApplicable,
        nsaLocked,
        grade: IndicatorGrade.NSA,
        status: IndicatorStatus.PENDENTE
      }
    });
  }
  console.log(
    `✅ ${await prisma.courseIndicator.count()} instâncias de indicadores de curso criadas.`
  );

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });
