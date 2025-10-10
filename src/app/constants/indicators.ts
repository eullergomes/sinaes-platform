type IndicatorStatus = 'Concluído' | 'Em edição' | 'Não preenchido';
type IndicatorGrade = 'NSA' | '1' | '2' | '3' | '4' | '5';

export type Indicator = {
  code: string;
  dimension: '1' | '2' | '3';
  name: string;
  grade: IndicatorGrade;
  status: IndicatorStatus;
  lastUpdate: string;
};

export const indicators: Indicator[] = [
  // ----- Dimensão 1 -----
  { dimension: '1', code: '1.1',  name: 'Políticas institucionais no âmbito do curso', grade: '3',  status: 'Concluído', lastUpdate: '2025-06-01' },
  { dimension: '1', code: '1.2',  name: 'Objetivos do curso', grade: '4', status: 'Em edição', lastUpdate: '2025-05-28' },
  { dimension: '1', code: '1.3',  name: 'Perfil profissional do egresso', grade: '3', status: 'Não preenchido', lastUpdate: '2025-05-20' },
  { dimension: '1', code: '1.4',  name: 'Estrutura curricular', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '1', code: '1.5',  name: 'Conteúdos curriculares', grade: '5', status: 'Concluído', lastUpdate: '2025-05-30' },
  { dimension: '1', code: '1.6',  name: 'Metodologia', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.7',  name: 'Estágio curricular supervisionado', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.8',  name: 'Estágio curricular supervisionado – relação com a rede de escolas da educação básica', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.9',  name: 'Estágio curricular supervisionado – relação teoria e prática', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.10', name: 'Atividades complementares', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.11', name: 'Trabalhos de Conclusão de Curso (TCC)', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.12', name: 'Apoio ao discente', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.13', name: 'Gestão do curso e os processos de avaliação interna e externa', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.14', name: 'Atividades de tutoria', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.15', name: 'Conhecimentos, habilidades e atitudes necessárias às atividades de tutoria', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.16', name: 'Tecnologias de Informação e comunicação (TIC) no processo ensino-aprendizagem', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.17', name: 'Ambiente Virtual de Aprendizagem (AVA)', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.18', name: 'Material didático', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.19', name: 'Procedimentos de acompanhamento e de avaliação dos processos de ensino-aprendizagem', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.20', name: 'Número de vagas', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.21', name: 'Integração com as redes públicas de ensino', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.22', name: 'Integração do curso com o sistema local e regional de saúde (SUS)', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.23', name: 'Atividades práticas de ensino para áreas da saúde', grade: '2', status: 'Em edição', lastUpdate: '2025-06-02' },
  { dimension: '1', code: '1.24', name: 'Atividades práticas de ensino para licenciaturas', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },

  // ----- Dimensão 2 -----
  { dimension: '2', code: '2.1',  name: 'Núcleo Docente Estruturante – NDE', grade: '4', status: 'Concluído', lastUpdate: '2025-05-29' },
  { dimension: '2', code: '2.2',  name: 'Equipe multidisciplinar', grade: '3', status: 'Em edição', lastUpdate: '2025-05-25' },
  { dimension: '2', code: '2.3',  name: 'Atuação do coordenador', grade: '2', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.4',  name: 'Regime de trabalho do coordenador de curso', grade: '5', status: 'Concluído', lastUpdate: '2025-05-30' },
  { dimension: '2', code: '2.5',  name: 'Corpo docente: titulação', grade: '4', status: 'Concluído', lastUpdate: '2025-06-01' },
  { dimension: '2', code: '2.6',  name: 'Regime de trabalho do corpo docente do curso', grade: '3', status: 'Em edição', lastUpdate: '2025-05-28' },
  { dimension: '2', code: '2.7',  name: 'Experiência profissional do docente', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.8',  name: 'Experiência no exercício da docência na educação básica', grade: '5', status: 'Concluído', lastUpdate: '2025-06-02' },
  { dimension: '2', code: '2.9',  name: 'Experiência no exercício da docência superior', grade: '4', status: 'Concluído', lastUpdate: '2025-05-27' },
  { dimension: '2', code: '2.10', name: 'Experiência no exercício da docência na educação a distância', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.11', name: 'Experiência no exercício da tutoria na educação a distância', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.12', name: 'Atuação do colegiado de curso ou equivalente', grade: '3', status: 'Em edição', lastUpdate: '2025-05-26' },
  { dimension: '2', code: '2.13', name: 'Titulação e formação do corpo de tutores do curso', grade: '2', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.14', name: 'Experiência do corpo de tutores em educação a distância', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '2', code: '2.15', name: 'Interação entre tutores (presenciais – quando for o caso – e a distância), docentes e coordenadores de curso a distância', grade: '4', status: 'Concluído', lastUpdate: '2025-06-03' },
  { dimension: '2', code: '2.16', name: 'Produção científica, cultural, artística ou tecnológica', grade: '5', status: 'Concluído', lastUpdate: '2025-06-02' },

  // ----- Dimensão 3 -----
  { dimension: '3', code: '3.1',  name: 'Espaço de trabalho para docentes em tempo integral', grade: '4', status: 'Concluído', lastUpdate: '2025-05-28' },
  { dimension: '3', code: '3.2',  name: 'Espaço de trabalho para o coordenador', grade: '5', status: 'Concluído', lastUpdate: '2025-05-29' },
  { dimension: '3', code: '3.3',  name: 'Sala coletiva de professores', grade: '3', status: 'Em edição', lastUpdate: '2025-05-30' },
  { dimension: '3', code: '3.4',  name: 'Salas de aula', grade: '2', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '3', code: '3.5',  name: 'Acesso dos alunos a equipamentos de informática', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '3', code: '3.6',  name: 'Bibliografia básica por Unidade Curricular (UC)', grade: '4', status: 'Concluído', lastUpdate: '2025-05-27' },
  { dimension: '3', code: '3.7',  name: 'Bibliografia complementar por Unidade Curricular (UC)', grade: '5', status: 'Concluído', lastUpdate: '2025-06-01' },
  { dimension: '3', code: '3.8',  name: 'Laboratórios didáticos de formação básica', grade: '3', status: 'Em edição', lastUpdate: '2025-05-25' },
  { dimension: '3', code: '3.9',  name: 'Laboratórios didáticos de formação específica', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '3', code: '3.10', name: 'Laboratórios de ensino para a área de saúde', grade: '4', status: 'Concluído', lastUpdate: '2025-06-02' },
  { dimension: '3', code: '3.11', name: 'Laboratórios de habilidades', grade: '2', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '3', code: '3.12', name: 'Unidades hospitalares e complexo assistencial conveniados', grade: '5', status: 'Concluído', lastUpdate: '2025-06-03' },
  { dimension: '3', code: '3.13', name: 'Biotérios', grade: '3', status: 'Em edição', lastUpdate: '2025-05-26' },
  { dimension: '3', code: '3.14', name: 'Processo de controle de produção ou distribuição de material didático (logística)', grade: '4', status: 'Concluído', lastUpdate: '2025-05-31' },
  { dimension: '3', code: '3.15', name: 'Núcleo de práticas jurídicas: atividades básicas e arbitragem, negociação, conciliação, mediação e atividades jurídicas reais', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' },
  { dimension: '3', code: '3.16', name: 'Comitê de Ética em Pesquisa (CEP)', grade: '3', status: 'Em edição', lastUpdate: '2025-05-29' },
  { dimension: '3', code: '3.17', name: 'Comitê de Ética na Utilização de Animais (CEUA)', grade: '4', status: 'Concluído', lastUpdate: '2025-06-01' },
  { dimension: '3', code: '3.18', name: 'Ambientes profissionais vinculados ao curso', grade: 'NSA', status: 'Não preenchido', lastUpdate: '-' }
];
