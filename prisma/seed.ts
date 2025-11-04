import {
  PrismaClient,
  Prisma,
  NsaPolicy,
  IndicatorStatus,
  IndicatorGrade,
  UserRole,
  CourseLevel,
  CourseModality
} from '@prisma/client';
const prisma = new PrismaClient();

const allEvidenceRequirements = [
  // Dimensão 1 — Organização Didático-Pedagógica (Indicador 1.1)
  {
    slug: 'politica-institucional-ensino',
    title: 'Política institucional de ensino'
  },
  {
    slug: 'politica-institucional-extensao',
    title: 'Política institucional de extensão'
  },
  {
    slug: 'politica-institucional-pesquisa',
    title: 'Política institucional de pesquisa'
  },
  { slug: 'pdi', title: 'PDI' },
  {
    slug: 'implantacao-no-ambito-do-curso',
    title: 'Implantação no âmbito do curso'
  },
  {
    slug: 'politicas-promocao-aprendizagem-perfil-egresso',
    title:
      'Políticas institucionais voltadas para a promoção de oportunidades de aprendizagem alinhadas ao perfil do egresso'
  },
  {
    slug: 'praticas-exitosas-ou-inovadoras',
    title: 'Práticas exitosas ou inovadoras'
  },

  // Indicador 1.2 — Objetivos do curso
  { slug: 'objetivos-do-curso', title: 'Objetivos do curso' },
  {
    slug: 'perfil-profissional-do-egresso',
    title: 'Perfil profissional do egresso'
  },
  { slug: 'estrutura-curricular', title: 'Estrutura curricular' },
  { slug: 'contexto-educacional', title: 'Contexto educacional' },
  {
    slug: 'caracteristicas-locais-regionais',
    title: 'Características locais e regionais'
  },
  { slug: 'novas-praticas-emergentes', title: 'Novas práticas emergentes' },

  // Indicador 1.3 — Perfil profissional do egresso
  { slug: 'dcn', title: 'DCN' },
  {
    slug: 'competencias-a-desenvolver',
    title: 'Competências a serem desenvolvidas pelo discente'
  },
  {
    slug: 'necessidades-locais-regionais',
    title: 'Necessidades locais e regionais'
  },
  {
    slug: 'ampliacao-por-demandas-do-trabalho',
    title: 'Ampliação em função de novas demandas pelo mundo do trabalho'
  },

  // Indicador 1.4 — Estrutura curricular
  { slug: 'flexibilidade', title: 'Flexibilidade' },
  { slug: 'interdisciplinaridade', title: 'Interdisciplinaridade' },
  { slug: 'acessibilidade-metodologica', title: 'Acessibilidade metodológica' },
  {
    slug: 'compatibilidade-carga-horaria-total',
    title: 'Compatibilidade da carga horária total (em horas-relógio)'
  },
  {
    slug: 'articulacao-teoria-pratica',
    title: 'Evidência da articulação da teoria com a prática'
  },
  { slug: 'disciplina-libras', title: 'Disciplina de LIBRAS' },
  {
    slug: 'articulacao-componentes-curriculares',
    title: 'Articulação entre os componentes curriculares'
  },
  { slug: 'elementos-inovadores', title: 'Elementos inovadores' },

  // Indicador 1.5 — Conteúdos curriculares
  { slug: 'conteudos-curriculares', title: 'Conteúdos curriculares' },
  { slug: 'atualizacao-da-area', title: 'Atualização da área' },
  {
    slug: 'adequacao-cargas-horarias',
    title: 'Adequação das cargas horárias (em horas-relógio)'
  },
  { slug: 'adequacao-bibliografia', title: 'Adequação da bibliografia' },
  { slug: 'educacao-ambiental', title: 'Educação ambiental' },
  { slug: 'educacao-direitos-humanos', title: 'Educação em direitos humanos' },
  {
    slug: 'educacao-relacoes-etnico-raciais',
    title: 'Educação das relações étnico-raciais'
  },
  {
    slug: 'historia-cultura-afro-africana-indigena',
    title: 'Ensino de história e cultura afro-brasileira, africana e indígena'
  },
  {
    slug: 'diferencial-do-curso',
    title: 'Diferencial do curso dentro da área profissional'
  },
  {
    slug: 'conhecimento-recente-inovador',
    title: 'Conhecimento recente e inovador'
  },

  // Indicador 1.6 — Metodologia
  { slug: 'metodologia', title: 'Metodologia' },
  {
    slug: 'atendimento-desenvolvimento-conteudos',
    title: 'Atendimento ao desenvolvimento de conteúdos'
  },
  {
    slug: 'atendimento-estrategias-aprendizagem',
    title: 'Atendimento às estratégias de aprendizagem'
  },
  {
    slug: 'atendimento-acompanhamento-atividades',
    title: 'Atendimento ao contínuo acompanhamento das atividades'
  },
  {
    slug: 'atendimento-acessibilidade-metodologica',
    title: 'Atendimento à acessibilidade metodológica'
  },
  {
    slug: 'atendimento-autonomia-discente',
    title: 'Atendimento à autonomia do discente'
  },
  {
    slug: 'praticas-pedagogicas-acao-discente',
    title:
      'Práticas pedagógicas que estimulam a ação discente em uma relação teoria-prática'
  },
  { slug: 'metodologias-inovadoras', title: 'Metodologias inovadoras' },
  {
    slug: 'recursos-aprendizagens-diferenciadas',
    title:
      'Recursos que proporcionam aprendizagens diferenciadas dentro da área'
  },

  // Indicador 1.7 — Estágio curricular supervisionado
  {
    slug: 'institucionalizacao-estagio',
    title: 'Institucionalização do estágio curricular supervisionado'
  },
  { slug: 'carga-horaria-estagio', title: 'Carga horária' },
  {
    slug: 'orientacao-coordenacao-supervisao',
    title: 'Orientação compatível com as atividades, coordenação e supervisão'
  },
  { slug: 'convenios-estagios', title: 'Convênios de estágios' },
  {
    slug: 'integracao-ensino-mundo-trabalho',
    title:
      'Estratégias para gestão da integração entre ensino e mundo do trabalho'
  },
  { slug: 'perfil-do-egresso', title: 'Perfil do egresso' },
  {
    slug: 'interlocucao-institucionalizada',
    title:
      'Interlocução institucionalizada da IES com o(s) ambiente(s) de estágio'
  },
  {
    slug: 'insumos',
    title: 'Insumos para atualização das práticas do estágio'
  },

  // Indicadores 1.8 e 1.9 — Não se aplica (NSA)

  // Indicador 1.10 — Atividades complementares
  {
    slug: 'institucionalizacao-atividades-complementares',
    title: 'Institucionalização das atividades complementares'
  },
  {
    slug: 'carga-horaria-atividades-complementares',
    title: 'Carga horária das atividades complementares'
  },
  {
    slug: 'diversidade-atividades-complementares',
    title: 'Diversidade de atividades'
  },
  { slug: 'formas-aproveitamento', title: 'Formas de aproveitamento' },
  {
    slug: 'aderencia-formacao-geral-especifica',
    title: 'Aderência à formação geral e específica do discente'
  },
  {
    slug: 'mecanismos-exitosos-inovadores-gestao-aproveitamento',
    title:
      'Mecanismos exitosos ou inovadores na regulação, gestão e aproveitamento'
  },

  // Indicador 1.11 — Trabalhos de Conclusão de Curso (TCC)
  {
    slug: 'institucionalizacao-tcc',
    title: 'Institucionalização do Trabalho de Conclusão de Curso'
  },
  { slug: 'carga-horaria-tcc', title: 'Carga horária' },
  {
    slug: 'formas-apresentacao-orientacao-coordenacao',
    title: 'Formas de apresentação, orientação e coordenação'
  },
  {
    slug: 'manuais-apoio-tcc',
    title: 'Manuais atualizados de apoio à produção dos trabalhos'
  },
  {
    slug: 'repositorios-institucionais',
    title: 'Repositórios institucionais próprios'
  },

  // Indicador 1.12 — Apoio ao discente
  { slug: 'apoio-ao-discente', title: 'Apoio ao discente' },
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
  {
    slug: 'acoes-exitosas-ou-inovadoras',
    title: 'Ações exitosas ou inovadoras'
  },

  // Indicador 1.13 — Gestão do curso e avaliações interna/externa
  { slug: 'gestao-do-curso', title: 'Gestão do curso' },
  { slug: 'autoavaliacao-institucional', title: 'Autoavaliação institucional' },
  {
    slug: 'aprimoramento-planejamento-avaliacoes-externas',
    title:
      'Aprimoramento do planejamento do curso baseado em avaliações externas'
  },
  {
    slug: 'apropiacao-resultados-avaliacoes',
    title: 'Apropriação dos resultados das avaliações pela comunidade acadêmica'
  },
  {
    slug: 'autoavaliacao-periodica-curso',
    title: 'Autoavaliação periódica do curso'
  },

  // 1.16 — TIC no processo ensino-aprendizagem
  { slug: 'tics', title: 'Tecnologias de informação e comunicação' },
  {
    slug: 'acessibilidade-digital-comunicacional',
    title: 'Acessibilidade digital e comunicacional'
  },
  {
    slug: 'interatividade-docentes-discentes',
    title: 'Interatividade entre docentes e discentes'
  },
  {
    slug: 'acesso-materiais-recursos-didaticos',
    title: 'Acesso a materiais ou recursos didáticos'
  },
  {
    slug: 'experiencias-diferenciadas-aprendizagem',
    title: 'Experiências diferenciadas de aprendizagem'
  },

  // 1.17 e 1.18 — NSA

  // 1.19 — Procedimentos de acompanhamento e avaliação
  {
    slug: 'procedimentos-acompanhamento-avaliacao',
    title:
      'Procedimentos de acompanhamento e de avaliação nos processos de ensino-aprendizagem'
  },
  {
    slug: 'desenvolvimento-autonomia-discente',
    title: 'Desenvolvimento e a autonomia do discente'
  },
  {
    slug: 'informacoes-sistematizadas-estudantes',
    title: 'Informações sistematizadas e disponibilizadas aos estudantes'
  },
  {
    slug: 'mecanismos-natureza-formativa',
    title: 'Mecanismos que garantem a natureza formativa'
  },
  {
    slug: 'acoes-melhoria-aprendizagem',
    title:
      'Ações para a melhoria da aprendizagem em função das avaliações realizadas'
  },

  // 1.20 — Número de vagas
  {
    slug: 'estudo-numero-vagas',
    title: 'Estudo quantitativo e qualitativo do número de vagas'
  },
  {
    slug: 'pesquisas-comunidade-academica',
    title: 'Pesquisas com a comunidade acadêmica'
  },
  {
    slug: 'adequacao-corpo-docente',
    title: 'Adequação à dimensão do corpo docente'
  },
  {
    slug: 'condicoes-infraestrutura-ensino-pesquisa',
    title:
      'Condições de infraestrutura física e tecnológica para o ensino e a pesquisa'
  },

  // 1.21, 1.22, 1.23, 1.24 — Tópicos de integração/atividades práticas (sem detalhamento no quadro)

  // Dimensão 2 — Corpo Docente e Tutorial
  // 2.1 — NDE
  {
    slug: 'nde-minimo-cinco-docentes',
    title: 'NDE possui, no mínimo, 5 docentes do curso'
  },
  { slug: 'regime-trabalho-membros-nde', title: 'Regime de trabalho' },
  { slug: 'titulacao-stricto-sensu', title: 'Titulação stricto sensu' },
  {
    slug: 'coordenador-integrante-nde',
    title: 'Coordenador do curso como integrante'
  },
  {
    slug: 'atuacao-nde-ppc',
    title: 'Atuação no acompanhamento, na consolidação e na atualização do PPC'
  },
  {
    slug: 'estudos-atualizacao-periodica',
    title: 'Realização de estudos e atualização periódica'
  },
  {
    slug: 'verificacao-impacto-avaliacao-aprendizagem',
    title:
      'Verificação do impacto do sistema de avaliação de aprendizagem na formação do estudante'
  },
  {
    slug: 'analise-adequacao-perfil-egresso',
    title: 'Análise da adequação do perfil do egresso'
  },
  { slug: 'consideracao-dcn', title: 'Consideração das DCN' },
  {
    slug: 'consideracao-demandas-trabalho',
    title: 'Consideração das novas demandas do mundo do trabalho'
  },
  {
    slug: 'manutencao-membros-ato-regulatorio',
    title: 'Manutenção de parte dos membros desde o último ato regulatório'
  },

  // 2.2 — Equipe multidisciplinar (NSA)

  // 2.3 — Atuação do coordenador
  { slug: 'atuacao-do-coordenador', title: 'Atuação do coordenador' },
  {
    slug: 'atendimento-demanda-existente',
    title: 'Atendimento à demanda existente'
  },
  {
    slug: 'relacao-docentes-discentes',
    title: 'Relação com os docentes e discentes'
  },
  {
    slug: 'representatividade-colegiados-superiores',
    title: 'Representatividade em colegiados superiores'
  },
  { slug: 'indicadores-de-desempenho', title: 'Indicadores de desempenho' },
  {
    slug: 'administracao-potencialidade-corpo-docente',
    title: 'Administração da potencialidade do corpo docente'
  },
  {
    slug: 'integracao-melhoria-continua',
    title: 'Integração e melhoria contínua'
  },

  // 2.4 — Regime de trabalho do coordenador de curso
  {
    slug: 'regime-trabalho-coordenador',
    title: 'Regime de trabalho do(a) coordenador(a)'
  },
  { slug: 'planos-de-acao', title: 'Planos de ação' },
  { slug: 'indicadores', title: 'Indicadores' },

  // 2.5 — Corpo docente: titulação
  {
    slug: 'analise-conteudos-componentes',
    title: 'Análise dos conteúdos dos componentes curriculares'
  },
  {
    slug: 'relevancia-atuacao-profissional-academica',
    title:
      'Abordagem da relevância para a atuação profissional e acadêmica do discente'
  },
  {
    slug: 'fomento-raciocinio-critico',
    title:
      'Fomento ao raciocínio crítico com base em literatura atualizada, para além da bibliografia proposta'
  },
  {
    slug: 'acesso-conteudos-pesquisa-ponta',
    title: 'Acesso a conteúdos de pesquisa de ponta'
  },
  {
    slug: 'relacao-pesquisa-objetivos-perfil',
    title:
      'Relação dos conteúdos de pesquisa de ponta aos objetivos das disciplinas e ao perfil do egresso'
  },
  {
    slug: 'incentivo-producao-conhecimento',
    title:
      'Incentivo à produção do conhecimento, por meio de grupos de estudo ou de pesquisa e da publicação.'
  },

  // 2.6 — Regime de trabalho do corpo docente
  {
    slug: 'regime-trabalho-corpo-docente',
    title: 'Regime de trabalho do corpo docente'
  },
  {
    slug: 'atendimento-integral-demanda',
    title: 'Atendimento integral da demanda existente'
  },
  {
    slug: 'dedicacao-docencia-atendimento',
    title: 'Dedicação à docência, atendimento aos discentes'
  },
  { slug: 'participacao-colegiado', title: 'Participação no colegiado' },
  {
    slug: 'planejamento-didatico-avaliacoes',
    title:
      'Planejamento didático e a preparação e correção das avaliações de aprendizagem'
  },
  {
    slug: 'documentacao-atividade-docente',
    title: 'Documentação sobre atividade docente'
  },
  {
    slug: 'planejamento-gestao-melhoria-continua',
    title: 'Planejamento e gestão para melhoria contínua'
  },

  // 2.7 — Experiência profissional do docente
  {
    slug: 'experiencia-profissional-mundo-trabalho',
    title: 'Experiência profissional no mundo do trabalho'
  },
  {
    slug: 'contextualizacao-problemas-praticos',
    title:
      'Contextualização com relação a problemas práticos de aplicação da teoria ministrada em diferentes unidades curriculares em relação ao fazer profissional'
  },
  {
    slug: 'atualizacao-interacao-conteudo-pratica',
    title: 'Atualização com relação à interação conteúdo e prática'
  },
  {
    slug: 'compreensao-interdisciplinaridade-laboral',
    title: 'Compreensão da Interdisciplinaridade no contexto laboral'
  },
  {
    slug: 'analise-competencias-ppc-profissao',
    title:
      'Análise das competências previstas no PPC considerando o conteúdo abordado e a profissão'
  },

  // 2.8 — Experiência na educação básica (sem itens detalhados no quadro)

  // 2.9 — Experiência na docência superior
  {
    slug: 'experiencia-docencia-superior',
    title: 'Experiência na docência superior'
  },
  {
    slug: 'acoes-identificacao-dificuldades',
    title: 'Ações que permitem identificar dificuldades dos discentes'
  },
  {
    slug: 'linguagem-aderente-turma',
    title: 'Conteúdo em linguagem aderente às características da turma'
  },
  {
    slug: 'exemplos-contextualizados',
    title:
      'Exemplos contextualizados com conteúdos dos componentes curriculares'
  },
  {
    slug: 'atividades-especificas-dificuldades',
    title: 'Atividades específicas para discentes com dificuldades'
  },
  {
    slug: 'avaliacoes-diagnosticas-formativas-somativas',
    title: 'Avaliações diagnósticas, formativas e somativas'
  },
  {
    slug: 'redefinicao-pratica-docente',
    title: 'Redefinição da prática docente'
  },
  { slug: 'lideranca-producao', title: 'Liderança e produção' },

  // 2.10, 2.11, 2.13, 2.14, 2.15 — Tópicos EAD/tutoria (sem detalhamento no quadro)

  // 2.12 — Atuação do colegiado
  { slug: 'atuacao-colegiado', title: 'Atuação do colegiado' },
  {
    slug: 'institucionalizacao-colegiado',
    title: 'Institucionalização do colegiado'
  },
  {
    slug: 'representatividade-segmentos',
    title: 'Representatividade dos segmentos'
  },
  { slug: 'periodicidade-reunioes', title: 'Periodicidade das reuniões' },
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
      'Sistema de suporte ao registro, acompanhamento e execução de seus processos e decisões'
  },
  {
    slug: 'avaliacao-periodica-desempenho',
    title: 'Avaliação periódica de desempenho'
  },
  {
    slug: 'implementacao-ajuste-praticas-gestao',
    title: 'Implementação ou ajuste de práticas de gestão'
  },

  // 2.16 — Produção científica/cultural/artística/tecnológica
  {
    slug: 'producao-ultimos-3-anos',
    title: 'Percentual de docentes e número de produções nos últimos 3 anos'
  },

  // Dimensão 3 — Infraestrutura
  // 3.1 — Espaço de trabalho para docentes em tempo integral
  {
    slug: 'viabilizacao-acoes-academicas',
    title: 'Viabilização das ações acadêmicas'
  },
  {
    slug: 'atendimento-necessidades-institucionais',
    title: 'Atendimento às necessidades institucionais'
  },
  {
    slug: 'recursos-tic',
    title: 'Recursos de tecnologias da informação e comunicação'
  },
  {
    slug: 'privacidade-atendimento-guardas',
    title:
      'Privacidade para uso dos recursos, atendimento a discentes e orientandos'
  },
  {
    slug: 'guarda-materiais-equipamentos',
    title: 'Guarda de material e equipamentos pessoais'
  },

  // 3.2 — Espaço de trabalho para o coordenador
  {
    slug: 'viabilizacao-acoes-academico-administrativas',
    title: 'Viabilização das ações acadêmico-administrativas'
  },
  { slug: 'equipamentos', title: 'Equipamentos' },
  {
    slug: 'atendimento-individuos-grupos',
    title: 'Atendimento de indivíduos ou grupos'
  },
  {
    slug: 'infraestrutura-tecnologica-diferenciada',
    title: 'Infraestrutura tecnológica diferenciada'
  },
  { slug: 'formas-distintas-trabalho', title: 'Formas distintas de trabalho' },

  // 3.3 — Sala coletiva de professores
  {
    slug: 'viabilizacao-trabalho-docente',
    title: 'Viabilização do trabalho docente'
  },
  { slug: 'quantitativo-docentes', title: 'Quantitativo de docentes' },
  {
    slug: 'descanso-lazer-integracao',
    title: 'Descanso e atividades de lazer e integração'
  },
  {
    slug: 'apoio-tecnico-administrativo',
    title: 'Apoio técnico-administrativo'
  },
  {
    slug: 'espaco-guarda-equipamentos-materiais',
    title: 'Espaço para a guarda de equipamentos e materiais'
  },

  // 3.4 — Salas de aula
  {
    slug: 'atendimento-necessidades-institucionais-curso',
    title: 'Atendimento às necessidades institucionais e do curso'
  },
  { slug: 'manutencao-periodica', title: 'Manutenção periódica' },
  { slug: 'conforto', title: 'Conforto' },
  { slug: 'flexibilidade-espacial', title: 'Flexibilidade espacial' },
  {
    slug: 'distintas-situacoes-ensino-aprendizagem',
    title: 'Distintas situações de ensino-aprendizagem'
  },
  {
    slug: 'recursos-utilizacao-exitosa',
    title: 'Recursos cuja utilização é exitosa'
  },

  // 3.5 — Acesso a equipamentos de informática
  {
    slug: 'laboratorio-ou-meio-acesso-informatica',
    title:
      'Laboratório de informática, ou outro meio de acesso a equipamentos de informática'
  },
  {
    slug: 'disponibilidade-equipamentos',
    title: 'Disponibilidade de equipamentos'
  },
  {
    slug: 'estabilidade-velocidade-internet-wifi',
    title: 'Estabilidade e velocidade de acesso à internet e à rede sem fio'
  },
  { slug: 'espaco-fisico', title: 'Espaço físico' },
  {
    slug: 'atualizacao-hardware-softwares',
    title: 'Atualização de hardware e softwares'
  },
  {
    slug: 'avaliacao-periodica-adequacao-qualidade-pertinencia',
    title: 'Avaliação periódica de sua adequação, qualidade e pertinência'
  },

  // 3.6 — Bibliografia básica por UC
  { slug: 'tombamento-acervo-fisico', title: 'Tombamento do acervo físico' },
  {
    slug: 'informatizacao-acervo-fisico',
    title: 'Informatização do acervo físico'
  },
  { slug: 'contrato-acervo-virtual', title: 'Contrato do acervo virtual' },
  {
    slug: 'registros-acervos-fisico-virtual',
    title: 'Registros dos acervos físico e virtual'
  },
  {
    slug: 'acervo-bibliografia-basica',
    title: 'Acervo da bibliografia básica'
  },
  {
    slug: 'atualizacao-bibliografia-basica',
    title: 'Atualização do acervo da bibliografia básica'
  },
  { slug: 'relatorio-adequacao-nde', title: 'Relatório de adequação do NDE' },
  {
    slug: 'acesso-fisico-titulos-virtuais',
    title: 'Acesso físico aos títulos virtuais na IES'
  },
  {
    slug: 'periodicos-especializados',
    title:
      'Exemplares ou assinaturas de acesso virtual de periódicos especializados'
  },
  { slug: 'gerenciamento-acervo', title: 'Gerenciamento do acervo' },
  { slug: 'plano-contingencia', title: 'Plano de contingência' },

  // 3.7 — Bibliografia complementar por UC
  {
    slug: 'acervo-bibliografia-complementar',
    title: 'Acervo da bibliografia complementar'
  },
  {
    slug: 'atualizacao-bibliografia-complementar',
    title: 'Atualização do acervo da bibliografia complementar'
  },

  // 3.8 — Laboratórios didáticos de formação básica
  {
    slug: 'atendimento-necessidades-curso',
    title: 'Atendimento às necessidades do curso'
  },
  {
    slug: 'normas-funcionamento-seguranca',
    title: 'Normas de funcionamento, utilização e segurança'
  },
  { slug: 'apoio-tecnico', title: 'Apoio técnico' },
  {
    slug: 'quantidade-insumos-materiais-equipamentos',
    title: 'Quantidade de insumos, materiais e equipamentos'
  },
  { slug: 'avaliacao-periodica', title: 'Avaliação periódica' },
  {
    slug: 'uso-resultados-gestao-academica',
    title: 'Utilização dos resultados das avaliações pela gestão acadêmica'
  },

  // 3.9 — Laboratórios didáticos de formação específica

  // 3.10 — Laboratórios de ensino para a área de saúde (sem itens no quadro)
  // 3.11 — Laboratórios de habilidades (sem itens no quadro)
  // 3.12 — Unidades hospitalares/convenios — NSA
  // 3.13 — Biotérios — NSA
  // 3.14 — Logística material didático — NSA
  // 3.15 — Núcleo de práticas jurídicas — NSA

  // 3.16 — Comitê de Ética em Pesquisa (CEP)
  { slug: 'homologacao-cep-conep', title: 'Homologação do CEP pela CONEP' },
  { slug: 'cep-ifma', title: 'CEP do IFMA' },
  {
    slug: 'atendimento-instituicoes-parceiras-cep',
    title: 'Atendimento a instituições parceiras'
  },

  // 3.17 — Comitê de Ética na Utilização de Animais (CEUA)
  { slug: 'homologacao-ceua-conep', title: 'Homologação do CEUA pela CONEP' },
  { slug: 'ceua-ifma', title: 'CEUA do IFMA' },
  {
    slug: 'atendimento-instituicoes-parceiras-ceua',
    title: 'Atendimento a instituições parceiras'
  },

  // 3.18 — Ambientes profissionais vinculados ao curso
  {
    slug: 'ambientes-profissionais-vinculados-ao-curso',
    title: 'Ambientes profissionais vinculados ao curso'
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
      "politica-institucional-ensino",
      "politica-institucional-extensao",
      "politica-institucional-pesquisa",
      "pdi",
      "implantacao-no-ambito-do-curso",
      "politicas-promocao-aprendizagem-perfil-egresso",
      "praticas-exitosas-ou-inovadoras"
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
      'objetivos-do-curso',
      'perfil-profissional-do-egresso',
      'estrutura-curricular',
      'contexto-educacional',
      'caracteristicas-locais-regionais',
      'novas-praticas-emergentes'
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
    evidenceSlugs: [
      'perfil-profissional-do-egresso',
      'dcn',
      'competencias-a-desenvolver',
      'necessidades-locais-regionais',
      'ampliacao-por-demandas-do-trabalho'
    ]
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
      'estrutura-curricular',
      'flexibilidade',
      'interdisciplinaridade',
      'acessibilidade-metodologica',
      'compatibilidade-carga-horaria-total',
      'articulacao-teoria-pratica',
      'disciplina-libras',
      'articulacao-componentes-curriculares',
      'elementos-inovadores'
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
      'conteudos-curriculares',
      'perfil-profissional-do-egresso',
      'atualizacao-da-area',
      'adequacao-cargas-horarias',
      'adequacao-bibliografia',
      'acessibilidade-metodologica',
      'educacao-ambiental',
      'educacao-direitos-humanos',
      'educacao-relacoes-etnico-raciais',
      'historia-cultura-afro-africana-indigena',
      'diferencial-do-curso',
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
      'metodologia',
      'dcn',
      'atendimento-desenvolvimento-conteudos',
      'atendimento-estrategias-aprendizagem',
      'atendimento-acompanhamento-atividades',
      'atendimento-acessibilidade-metodologica',
      'atendimento-autonomia-discente',
      'praticas-pedagogicas-acao-discente',
      'metodologias-inovadoras',
      'recursos-aprendizagens-diferenciadas'
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
      'institucionalizacao-estagio',
      'carga-horaria-estagio',
      'orientacao-coordenacao-supervisao',
      'convenios-estagios',
      'integracao-ensino-mundo-trabalho',
      'perfil-do-egresso',
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
      'institucionalizacao-atividades-complementares',
      'carga-horaria-atividades-complementares',
      'diversidade-atividades-complementares',
      'formas-aproveitamento',
      'aderencia-formacao-geral-especifica',
      'mecanismos-exitosos-inovadores-gestao-aproveitamento'
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
      'institucionalizacao-tcc',
      'carga-horaria-tcc',
      'formas-apresentacao-orientacao-coordenacao',
      'manuais-apoio-tcc',
      'repositorios-institucionais'
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
      'apoio-ao-discente',
      'acoes-acolhimento-permanencia',
      'acessibilidade-metodologica-instrumental',
      'monitoria',
      'nivelamento',
      'estagios-nao-obrigatorios',
      'apoio-psicopedagogico',
      'centros-academicos',
      'intercambios',
      'acoes-exitosas-ou-inovadoras'
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
      'gestao-do-curso',
      'autoavaliacao-institucional',
      'aprimoramento-planejamento-avaliacoes-externas',
      'apropiacao-resultados-avaliacoes',
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
      'tics',
      'acessibilidade-digital-comunicacional',
      'interatividade-docentes-discentes',
      'acesso-materiais-recursos-didaticos',
      'experiencias-diferenciadas-aprendizagem'
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
      'procedimentos-acompanhamento-avaliacao',
      'desenvolvimento-autonomia-discente',
      'informacoes-sistematizadas-estudantes',
      'mecanismos-natureza-formativa',
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
      'pesquisas-comunidade-academica',
      'adequacao-corpo-docente',
      'condicoes-infraestrutura-ensino-pesquisa'
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
      'nde-minimo-cinco-docentes',
      'regime-trabalho-membros-nde',
      'titulacao-stricto-sensu',
      'coordenador-integrante-nde',
      'atuacao-nde-ppc',
      'estudos-atualizacao-periodica',
      'verificacao-impacto-avaliacao-aprendizagem',
      'analise-adequacao-perfil-egresso',
      'consideracao-dcn',
      'consideracao-demandas-trabalho',
      'manutencao-membros-ato-regulatorio'
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
      'atuacao-do-coordenador',
      'atendimento-demanda-existente',
      'gestao-do-curso',
      'relacao-docentes-discentes',
      'representatividade-colegiados-superiores',
      'planos-de-acao',
      'indicadores-de-desempenho',
      'administracao-potencialidade-corpo-docente',
      'integracao-melhoria-continua'
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
      'atendimento-demanda-existente',
      'gestao-do-curso',
      'relacao-docentes-discentes',
      'representatividade-colegiados-superiores',
      'planos-de-acao',
      'indicadores',
      'administracao-potencialidade-corpo-docente',
      'integracao-melhoria-continua'
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
      'analise-conteudos-componentes',
      'relevancia-atuacao-profissional-academica',
      'fomento-raciocinio-critico',
      'acesso-conteudos-pesquisa-ponta',
      'relacao-pesquisa-objetivos-perfil',
      'incentivo-producao-conhecimento'
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
      'regime-trabalho-corpo-docente',
      'atendimento-integral-demanda',
      'dedicacao-docencia-atendimento',
      'participacao-colegiado',
      'planejamento-didatico-avaliacoes',
      'documentacao-atividade-docente',
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
      'contextualizacao-problemas-praticos',
      'atualizacao-interacao-conteudo-pratica',
      'compreensao-interdisciplinaridade-laboral',
      'analise-competencias-ppc-profissao'
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
      'experiencia-docencia-superior',
      'acoes-identificacao-dificuldades',
      'linguagem-aderente-turma',
      'exemplos-contextualizados',
      'atividades-especificas-dificuldades',
      'avaliacoes-diagnosticas-formativas-somativas',
      'redefinicao-pratica-docente',
      'lideranca-producao'
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
      'atuacao-colegiado',
      'institucionalizacao-colegiado',
      'representatividade-segmentos',
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
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '2.15',
    name: 'Interação entre tutores (presenciais quando for o caso - e a distância), docentes e coordenadores de curso a distância',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '2.16',
    name: 'Produção científica, cultural, artística ou tecnológica',
    dimensionNumber: 2,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
    evidenceSlugs: ['producao-ultimos-3-anos']
  },

  // ----- DIMENSÃO 3 -----
  {
    code: '3.1',
    name: 'Espaço de trabalho para docentes em tempo integral',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
    evidenceSlugs: [
      'viabilizacao-acoes-academicas',
      'atendimento-necessidades-institucionais',
      'recursos-tic',
      'privacidade-atendimento-guardas',
      'guarda-materiais-equipamentos'
    ]
  },
  {
    code: '3.2',
    name: 'Espaço de trabalho para o coordenador',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
    evidenceSlugs: [
      'viabilizacao-acoes-academico-administrativas',
      'equipamentos',
      'atendimento-necessidades-institucionais',
      'atendimento-individuos-grupos',
      'infraestrutura-tecnologica-diferenciada',
      'formas-distintas-trabalho'
    ]
  },
  {
    code: '3.3',
    name: 'Sala coletiva de professores',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: [
      'viabilizacao-trabalho-docente',
      'recursos-tic',
      'quantitativo-docentes',
      'descanso-lazer-integracao',
      'apoio-tecnico-administrativo',
      'espaco-guarda-equipamentos-materiais'
    ]
  },
  {
    code: '3.4',
    name: 'Salas de aula',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: [
      'atendimento-necessidades-institucionais-curso',
      'manutencao-periodica',
      'conforto',
      'recursos-tic',
      'flexibilidade-espacial',
      'distintas-situacoes-ensino-aprendizagem',
      'recursos-utilizacao-exitosa'
    ]
  },
  {
    code: '3.5',
    name: 'Acesso dos alunos a equipamentos de informática',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
      'laboratorio-ou-meio-acesso-informatica',
      'atendimento-necessidades-institucionais-curso',
      'disponibilidade-equipamentos',
      'conforto',
      'estabilidade-velocidade-internet-wifi',
      'espaco-fisico',
      'atualizacao-hardware-softwares',
      'avaliacao-periodica-adequacao-qualidade-pertinencia'
    ]
  },
  {
    code: '3.6',
    name: 'Bibliografia básica por Unidade Curricular (UC)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
      'tombamento-acervo-fisico',
      'informatizacao-acervo-fisico',
      'contrato-acervo-virtual',
      'registros-acervos-fisico-virtual',
      'acervo-bibliografia-basica',
      'atualizacao-bibliografia-basica',
      'relatorio-adequacao-nde',
      'acesso-fisico-titulos-virtuais',
      'periodicos-especializados',
      'gerenciamento-acervo',
      'plano-contingencia'
    ]
  },
  {
    code: '3.7',
    name: 'Bibliografia complementar por Unidade Curricular (UC)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.FIXED_APPLICABLE,
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
      'tombamento-acervo-fisico',
      'informatizacao-acervo-fisico',
      'contrato-acervo-virtual',
      'registros-acervos-fisico-virtual',
      'acervo-bibliografia-complementar',
      'atualizacao-bibliografia-complementar',
      'relatorio-adequacao-nde',
      'acesso-fisico-titulos-virtuais',
      'periodicos-especializados',
      'gerenciamento-acervo',
      'plano-contingencia'
    ]
  },
  {
    code: '3.8',
    name: 'Laboratórios didáticos de formação básica',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
      'atendimento-necessidades-curso',
      'normas-funcionamento-seguranca',
      'conforto',
      'manutencao-periodica',
      'apoio-tecnico',
      'recursos-tic',
      'quantidade-insumos-materiais-equipamentos',
      'avaliacao-periodica',
      'uso-resultados-gestao-academica'
    ]
  },
  {
    code: '3.9',
    name: 'Laboratórios didáticos de formação específica',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
      'atendimento-necessidades-curso',
      'normas-funcionamento-seguranca',
      'conforto',
      'manutencao-periodica',
      'apoio-tecnico',
      'recursos-tic',
      'quantidade-insumos-materiais-equipamentos',
      'avaliacao-periodica',
      'uso-resultados-gestao-academica'
    ]
  },
  {
    code: '3.10',
    name: 'Laboratórios de ensino para a área de saúde',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.11',
    name: 'Laboratórios de habilidades',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.12',
    name: 'Unidades hospitalares e complexo assistencial conveniados',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.13',
    name: 'Biotérios',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.14',
    name: 'Processo de controle de produção ou distribuição de material didático (logística)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.15',
    name: 'Núcleo de práticas jurídicas: atividades básicas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: []
  },
  {
    code: '3.16',
    name: 'Comitê de Ética em Pesquisa (CEP)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
      'homologacao-cep-conep',
      'cep-ifma',
      'atendimento-instituicoes-parceiras-cep'
    ]
  },
  {
    code: '3.17',
    name: 'Comitê de Ética na Utilização de Animais (CEUA)',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: [
      'homologacao-ceua-conep',
      'ceua-ifma',
      'atendimento-instituicoes-parceiras-ceua'
    ]
  },
  {
    code: '3.18',
    name: 'Ambientes profissionais vinculados ao curso',
    dimensionNumber: 3,
    nsaPolicy: NsaPolicy.COURSE_DEPENDENT,
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
    evidenceSlugs: [
      'ambientes-profissionais-vinculados-ao-curso'
    ]
  }
];

// Dados de instância para o ciclo de 2024 do curso de ADS
const instanceDataFor2024: Record<
  string,
  {
    grade: IndicatorGrade;
    status: IndicatorStatus;
    justification?: string;
    correctiveAction?: string;
    responsible?: string;
  }
> = {
  // --- Dimensão 1 ---
  '1.1': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'A implantação das políticas no PPC está adequada, mas a divulgação para os discentes pode ser melhorada.',
    correctiveAction:
      'Criar campanha de divulgação semestral sobre as políticas institucionais nos canais de comunicação do curso.',
    responsible: 'Coordenação de Curso e NDE'
  },
  '1.2': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.3': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.EM_EDICAO,
    justification:
      'O perfil do egresso está alinhado com as DCNs, mas não articula claramente as necessidades locais.',
    correctiveAction:
      'Realizar reunião com o NDE para incluir as necessidades do mercado de trabalho local no perfil do egresso.',
    responsible: 'NDE'
  },
  '1.4': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.5': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'Os conteúdos estão atualizados, mas a bibliografia complementar precisa de mais títulos recentes.',
    correctiveAction:
      'Solicitar à biblioteca a aquisição de 5 novos títulos para a bibliografia complementar.',
    responsible: 'Coordenação e Colegiado de Curso'
  },
  '1.6': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.7': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.8': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.9': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.NAO_ATINGIDO,
    justification: 'Pendente de revisão pelo NDE.'
  },
  '1.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.12': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.13': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'O apoio ao discente é bom, mas a divulgação dos programas de intercâmbio é baixa.'
  },
  '1.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.16': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.17': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.18': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.19': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'Os procedimentos de avaliação são claros, mas precisam ser digitalizados.'
  },
  '1.20': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '1.21': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.22': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.23': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '1.24': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },

  // --- Dimensão 2 ---
  '2.1': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '2.2': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.3': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.EM_EDICAO,
    justification:
      'A gestão do curso é eficiente, mas a comunicação com os discentes pode ser mais proativa.',
    correctiveAction:
      'Implementar um boletim informativo mensal para os alunos.',
    responsible: 'Coordenação de Curso'
  },
  '2.4': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '2.5': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'O corpo docente é qualificado, mas precisa de mais experiência em projetos de extensão.'
  },
  '2.6': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '2.7': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.8': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '2.9': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '2.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '2.12': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.EM_EDICAO,
    justification:
      'A atuação do colegiado é boa, mas as atas precisam ser publicadas com mais agilidade.'
  },
  '2.13': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '2.16': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.NAO_ATINGIDO,
    justification:
      'A produção científica do corpo docente está abaixo do esperado para a área.',
    correctiveAction:
      'Criar um programa de incentivo à publicação de artigos, com workshops e apoio na revisão.',
    responsible: 'Direção de Pesquisa e Coordenação'
  },

  // --- Dimensão 3 ---
  '3.1': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.2': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'O espaço do coordenador é adequado, mas precisa de um computador mais moderno.',
    correctiveAction:
      'Solicitar ao departamento de TI a troca do equipamento de informática da coordenação.',
    responsible: 'Coordenação de Curso'
  },
  '3.3': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '3.4': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.5': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'O acesso à internet nos laboratórios é bom, mas a velocidade poderia ser maior.'
  },
  '3.6': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.7': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.EM_EDICAO,
    justification:
      'A bibliografia complementar é boa, mas alguns títulos estão desatualizados.'
  },
  '3.8': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.9': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.12': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '3.13': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '3.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '3.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.NAO_ATINGIDO },
  '3.16': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.17': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO },
  '3.18': { grade: IndicatorGrade.G5, status: IndicatorStatus.CONCLUIDO }
};

// Dados de instância para o ciclo de 2021 do curso de ADS
const instanceDataFor2021: Record<
  string,
  {
    grade: IndicatorGrade;
    status: IndicatorStatus;
    justification?: string;
    correctiveAction?: string;
    responsible?: string;
  }
> = {
  // --- Dimensão 1 ---
  '1.1': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'As políticas institucionais não estavam bem implantadas no PPC.',
    correctiveAction:
      'Revisar o PPC para alinhar com as políticas institucionais do PDI.',
    responsible: 'NDE'
  },
  '1.2': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.3': {
    grade: IndicatorGrade.G4,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'O perfil do egresso estava alinhado com as DCNs, mas não com as demandas locais.'
  },
  '1.4': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.5': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Conteúdos curriculares precisavam de atualização.',
    correctiveAction: 'Revisão dos conteúdos e bibliografia pelo NDE.',
    responsible: 'NDE e Corpo Docente'
  },
  '1.6': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.7': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.8': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.9': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Processos de estágio não estavam bem definidos.'
  },
  '1.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.12': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.13': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Apoio psicopedagógico inexistente.'
  },
  '1.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.16': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.17': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.18': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.19': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Procedimentos de avaliação confusos.'
  },
  '1.20': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '1.21': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.22': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.23': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '1.24': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },

  // --- Dimensão 2 ---
  '2.1': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '2.2': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.3': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'Gestão do curso centralizada na coordenação, sem participação efetiva do colegiado.'
  },
  '2.4': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '2.5': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification:
      'Corpo docente com baixa qualificação (poucos mestres e doutores).'
  },
  '2.6': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '2.7': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.8': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.9': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '2.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.12': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Colegiado de curso pouco atuante.'
  },
  '2.13': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '2.16': {
    grade: IndicatorGrade.G2,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Produção científica quase inexistente.'
  },

  // --- Dimensão 3 ---
  '3.1': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.2': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Coordenação não possuía espaço físico próprio.'
  },
  '3.3': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.4': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.5': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Poucos computadores disponíveis para os alunos.'
  },
  '3.6': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.7': {
    grade: IndicatorGrade.G3,
    status: IndicatorStatus.CONCLUIDO,
    justification: 'Acervo bibliográfico desatualizado.'
  },
  '3.8': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.9': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.10': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.11': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.12': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.13': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.14': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.15': { grade: IndicatorGrade.NSA, status: IndicatorStatus.CONCLUIDO },
  '3.16': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.17': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO },
  '3.18': { grade: IndicatorGrade.G4, status: IndicatorStatus.CONCLUIDO }
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
  await prisma.user.deleteMany();
  await prisma.indicatorDefinition.deleteMany();
  await prisma.evidenceRequirement.deleteMany();
  await prisma.dimensionDefinition.deleteMany();
  console.log('✅ Dados limpos.');

  // 2. CRIAÇÃO DE USUÁRIOS
  console.log('👤 Criando usuários...');
  await prisma.user.create({
    data: {
      email: 'direcao@instituicao.edu.br',
      name: 'Ana Direção',
      role: UserRole.DIRECTOR
    }
  });

  const coordAdsUser = await prisma.user.create({
    data: {
      email: 'coord.ads@instituicao.edu.br',
      name: 'Carlos Coordenador ADS',
      role: UserRole.COORDINATOR
    }
  });

  const coordEngUser = await prisma.user.create({
    data: {
      email: 'coord.eng@instituicao.edu.br',
      name: 'Beatriz Coordenadora ENG',
      role: UserRole.COORDINATOR
    }
  });
  console.log(`✅ ${await prisma.user.count()} usuários criados.`);

  // 3. CRIAÇÃO DAS DIMENSÕES E EVIDÊNCIAS (Como antes)
  console.log('📚 Criando Dimensões e Requisitos de Evidência...');
  const dim1 = await prisma.dimensionDefinition.create({
    data: {
      number: 1,
      title: 'Organização Didático-Pedagógica',
      description:
        'Avalia o PPC, conteúdos, metodologias e práticas pedagógicas.'
    }
  });
  const dim2 = await prisma.dimensionDefinition.create({
    data: {
      number: 2,
      title: 'Corpo docente e tutorial',
      description:
        'Analisa a qualificação, experiência e atuação do corpo docente e NDE.'
    }
  });
  const dim3 = await prisma.dimensionDefinition.create({
    data: {
      number: 3,
      title: 'Infraestrutura',
      description:
        'Verifica a qualidade de laboratórios, biblioteca e espaços de trabalho.'
    }
  });
  const dimensions = { 1: dim1, 2: dim2, 3: dim3 };

  await prisma.evidenceRequirement.createMany({
    data: allEvidenceRequirements
  });
  console.log('✅ Dimensões e Evidências criadas.');

  // 4. CRIAÇÃO DAS DEFINIÇÕES DE INDICADORES (Como antes)
  console.log('📊 Criando Definições de Indicadores...');
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
        criteriaTable: indicatorData.criteria as Prisma.InputJsonValue
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
    `✅ ${await prisma.indicatorDefinition.count()} Definições de Indicadores criadas.`
  );

  // 5. CRIAÇÃO DOS CURSOS COM OS NOVOS CAMPOS
  console.log('🏫 Criando cursos...');
  const courseAds = await prisma.course.create({
    data: {
      name: 'Análise e Desenvolvimento de Sistemas',
      slug: 'ads',
      emecCode: 12345,
      level: CourseLevel.BACHARELADO,
      modality: CourseModality.PRESENCIAL,
      coordinatorId: coordAdsUser.id
    }
  });

  const courseEng = await prisma.course.create({
    data: {
      name: 'Engenharia Civil',
      slug: 'eng-civil',
      emecCode: 67890,
      level: CourseLevel.BACHARELADO,
      modality: CourseModality.PRESENCIAL,
      coordinatorId: coordEngUser.id
    }
  });
  console.log(`✅ ${await prisma.course.count()} cursos criados.`);

  // 6. INSTANCIAÇÃO DOS INDICADORES COM HISTÓRICO POR ANO
  console.log('🖇️  Criando histórico de avaliações para os cursos...');
  const allIndicatorDefs = await prisma.indicatorDefinition.findMany();
  const allCourses = [courseAds, courseEng];
  const evaluationYears = [2024, 2021]; // Anos que queremos popular

  for (const course of allCourses) {
    for (const year of evaluationYears) {
      for (const indicatorDef of allIndicatorDefs) {
        let nsaApplicable = true,
          nsaLocked = false;
        if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_APPLICABLE) {
          nsaLocked = true;
        }
        if (indicatorDef.nsaPolicy === NsaPolicy.FIXED_NSA) {
          nsaApplicable = false;
          nsaLocked = true;
        }

        // Dados padrão
        let data: {
          grade: IndicatorGrade;
          status: IndicatorStatus;
          justification?: string;
          correctiveAction?: string;
          responsible?: string;
        } = {
          grade: IndicatorGrade.NSA,
          status: IndicatorStatus.NAO_ATINGIDO
        };

        // Aplica dados detalhados para o curso de ADS
        if (course.slug === 'ads') {
          let instanceData;
          if (year === 2024) {
            instanceData = instanceDataFor2024[indicatorDef.code];
          } else if (year === 2021) {
            instanceData = instanceDataFor2021[indicatorDef.code];
          }

          if (instanceData) {
            data = {
              grade: instanceData.grade,
              status: instanceData.status,
              justification: instanceData.justification,
              correctiveAction: instanceData.correctiveAction,
              responsible: instanceData.responsible
            };
          }
        }

        // Cria o registro da avaliação para o ano específico
        await prisma.courseIndicator.create({
          data: {
            courseId: course.id,
            indicatorDefId: indicatorDef.id,
            evaluationYear: year,
            nsaApplicable,
            nsaLocked,
            ...data
          }
        });
      }
    }
  }
  console.log(
    `✅ ${await prisma.courseIndicator.count()} registros de avaliações (histórico) criados.`
  );
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
