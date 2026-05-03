// Runs once on first start — seeds initial courses
db = db.getSiblingDB('skillpath');

db.courses.insertMany([
  {
    slug: 'react-pro',
    title: 'React Pro: от основ до продакшна',
    category: 'dev',
    tags: ['React', 'Frontend'],
    description: 'Хуки, Redux Toolkit, React Query, тестирование и деплой',
    lessonsCount: 48,
    projectsCount: 4,
    videoUrl: '',           // заполнить позже
    previewUrl: '',
    duration: '4 месяца',
    level: 'intermediate',
    createdAt: new Date()
  },
  {
    slug: 'ml-from-scratch',
    title: 'Machine Learning с нуля',
    category: 'data',
    tags: ['Python', 'ML'],
    description: 'Sklearn, нейросети, компьютерное зрение, NLP',
    lessonsCount: 60,
    projectsCount: 6,
    videoUrl: '',
    previewUrl: '',
    duration: '5 месяцев',
    level: 'beginner',
    createdAt: new Date()
  },
  {
    slug: 'figma-ux',
    title: 'UI/UX: Дизайн в Figma',
    category: 'design',
    tags: ['Figma', 'UX'],
    description: 'Компонентная система, автолейаут, прототипирование',
    lessonsCount: 36,
    projectsCount: 3,
    videoUrl: '',
    previewUrl: '',
    duration: '3 месяца',
    level: 'beginner',
    createdAt: new Date()
  },
  {
    slug: 'nodejs-backend',
    title: 'Node.js: Серверная разработка',
    category: 'dev',
    tags: ['Node.js', 'Backend'],
    description: 'Express, REST API, GraphQL, PostgreSQL, Docker',
    lessonsCount: 52,
    projectsCount: 5,
    videoUrl: '',
    previewUrl: '',
    duration: '4 месяца',
    level: 'intermediate',
    createdAt: new Date()
  },
  {
    slug: 'docker-k8s',
    title: 'Docker & Kubernetes',
    category: 'dev',
    tags: ['Docker', 'DevOps'],
    description: 'Контейнеризация, оркестрация, CI/CD пайплайны',
    lessonsCount: 44,
    projectsCount: 4,
    videoUrl: '',
    previewUrl: '',
    duration: '3 месяца',
    level: 'intermediate',
    createdAt: new Date()
  },
  {
    slug: 'career-it',
    title: 'Карьера в IT: как получить оффер',
    category: 'soft',
    tags: ['Soft Skills', 'Карьера'],
    description: 'Резюме, собеседования, нетворкинг, переговоры о зарплате',
    lessonsCount: 20,
    projectsCount: 2,
    videoUrl: '',
    previewUrl: '',
    duration: '1.5 месяца',
    level: 'beginner',
    createdAt: new Date()
  }
]);

print('[SkillPath] Seed complete — 6 courses inserted');
