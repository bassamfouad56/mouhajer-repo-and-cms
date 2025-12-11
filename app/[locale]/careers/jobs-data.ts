export interface JobPosition {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
}

export const jobPositions: JobPosition[] = [
  {
    id: 'senior-architect',
    slug: 'senior-architect',
    title: 'Senior Architect',
    department: 'Architecture',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '5+ years',
    salary: 'Competitive',
    postedDate: '2024-11-15',
    description:
      'Lead architectural projects from concept to completion, working with luxury residential and commercial clients across the UAE. You will be responsible for driving design excellence and mentoring junior team members.',
    responsibilities: [
      'Lead design development for high-end residential and commercial projects',
      'Collaborate with clients to understand vision and requirements',
      'Manage project teams and coordinate with consultants',
      'Ensure design quality and adherence to regulations',
      'Present concepts and designs to clients and stakeholders',
      'Mentor junior architects and provide design guidance',
      'Review and approve construction documents',
      'Conduct site visits to ensure design intent is maintained',
    ],
    requirements: [
      "Bachelor's or Master's degree in Architecture",
      '5+ years of experience in luxury residential/commercial projects',
      'Proficiency in AutoCAD, Revit, SketchUp, and Adobe Creative Suite',
      'Strong portfolio demonstrating high-end design work',
      'Excellent communication and presentation skills',
      'UAE experience preferred',
      'Knowledge of local building codes and regulations',
      'Strong leadership and team management skills',
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance for you and family',
      'Annual performance bonuses',
      'Professional development opportunities',
      'Work on award-winning projects',
      'Collaborative studio environment',
      'Annual leave and flight tickets',
      'Career advancement opportunities',
    ],
  },
  {
    id: 'interior-designer',
    slug: 'interior-designer',
    title: 'Interior Designer',
    department: 'Interior Design',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '3+ years',
    salary: 'Competitive',
    postedDate: '2024-11-20',
    description:
      'Create exceptional interior spaces for luxury residential, hospitality, and commercial projects with a focus on materiality and detail. Join our award-winning team and work on some of the most prestigious projects in the UAE.',
    responsibilities: [
      'Develop interior design concepts and mood boards',
      'Select finishes, furniture, and FF&E specifications',
      'Create detailed design documentation and drawings',
      'Coordinate with contractors and suppliers',
      'Conduct site visits and quality inspections',
      'Present design concepts to clients',
      'Manage multiple projects simultaneously',
      'Stay updated on latest design trends and materials',
    ],
    requirements: [
      "Bachelor's degree in Interior Design or Architecture",
      '3+ years of experience in high-end interior design',
      'Strong skills in 3D visualization (3ds Max, V-Ray, or similar)',
      'Knowledge of FF&E specification and procurement',
      'Excellent taste in luxury finishes and materials',
      'Strong attention to detail',
      'Ability to work under pressure and meet deadlines',
      'Portfolio demonstrating residential and hospitality projects',
    ],
    benefits: [
      'Competitive salary',
      'Health insurance coverage',
      'Creative freedom on projects',
      'Access to premium suppliers and showrooms',
      'Annual leave and flight tickets',
      'Growth opportunities',
      'Training and skill development programs',
      'Work-life balance initiatives',
    ],
  },
  {
    id: 'project-manager',
    slug: 'project-manager',
    title: 'Project Manager',
    department: 'Project Management',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '5+ years',
    salary: 'Competitive + Vehicle Allowance',
    postedDate: '2024-11-10',
    description:
      'Oversee project delivery from inception to handover, ensuring timelines, budgets, and quality standards are met for luxury developments. You will be the key point of contact between clients, design teams, and contractors.',
    responsibilities: [
      'Manage multiple projects simultaneously from start to finish',
      'Coordinate with design teams, contractors, and clients',
      'Monitor project budgets and schedules',
      'Conduct regular site inspections and progress meetings',
      'Resolve project issues and conflicts proactively',
      'Ensure quality control and compliance with specifications',
      'Prepare progress reports and presentations for clients',
      'Manage procurement and contractor relationships',
    ],
    requirements: [
      "Bachelor's degree in Architecture, Engineering, or Construction Management",
      '5+ years of project management experience in luxury fit-out',
      'PMP or similar certification preferred',
      'Strong knowledge of UAE building codes and regulations',
      'Excellent organizational and leadership skills',
      'Proficiency in MS Project or similar tools',
      'Experience with luxury residential and hospitality projects',
      'Strong negotiation and conflict resolution skills',
    ],
    benefits: [
      'Competitive salary package',
      'Health and life insurance',
      'Performance-based incentives',
      'Company vehicle or allowance',
      'Professional certifications sponsored',
      'Career advancement opportunities',
      'Annual leave and flight tickets',
      'End of service benefits',
    ],
  },
  {
    id: 'junior-architect',
    slug: 'junior-architect',
    title: 'Junior Architect',
    department: 'Architecture',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '1-3 years',
    salary: 'Entry Level',
    postedDate: '2024-11-25',
    description:
      "Join our dynamic team as a Junior Architect and contribute to award-winning projects while developing your skills under experienced mentors. This is an excellent opportunity for passionate architects looking to grow their career in luxury design.",
    responsibilities: [
      'Assist in developing architectural drawings and models',
      'Support senior architects in design development',
      'Prepare presentation materials and renderings',
      'Coordinate with consultants and contractors',
      'Conduct site surveys and measurements',
      'Research materials, products, and design solutions',
      'Assist in preparing construction documents',
      'Participate in design reviews and client meetings',
    ],
    requirements: [
      "Bachelor's degree in Architecture",
      '1-3 years of experience in architectural practice',
      'Proficiency in AutoCAD, Revit, and 3D modeling software',
      'Strong visualization and rendering skills',
      'Passion for luxury and high-end design',
      'Eagerness to learn and grow',
      'Good communication skills in English',
      'Attention to detail and problem-solving abilities',
    ],
    benefits: [
      'Competitive entry-level salary',
      'Health insurance',
      'Mentorship from senior architects',
      'Exposure to luxury projects',
      'Skills development programs',
      'Annual leave',
      'Career growth path',
      'Collaborative team environment',
    ],
  },
  {
    id: 'mep-engineer',
    slug: 'mep-engineer',
    title: 'MEP Engineer',
    department: 'Engineering',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '4+ years',
    salary: 'Competitive',
    postedDate: '2024-11-18',
    description:
      'Design and coordinate MEP systems for luxury residential and commercial projects. Work closely with architects and interior designers to integrate building systems seamlessly into high-end spaces.',
    responsibilities: [
      'Design HVAC, electrical, and plumbing systems for luxury projects',
      'Coordinate MEP systems with architectural and structural designs',
      'Prepare technical specifications and drawings',
      'Review contractor submittals and shop drawings',
      'Conduct site inspections and resolve technical issues',
      'Ensure compliance with local codes and standards',
      'Collaborate with consultants and authorities',
      'Optimize systems for energy efficiency and sustainability',
    ],
    requirements: [
      "Bachelor's degree in Mechanical or Electrical Engineering",
      '4+ years of MEP design experience in construction',
      'Proficiency in AutoCAD MEP, Revit MEP, or similar',
      'Knowledge of UAE building codes and standards',
      'Experience with luxury residential and hospitality projects',
      'Strong analytical and problem-solving skills',
      'Excellent coordination and communication abilities',
      'Professional engineering license preferred',
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Annual performance bonus',
      'Professional development support',
      'Work on prestigious projects',
      'Annual leave and flight tickets',
      'Career advancement opportunities',
      'Collaborative work environment',
    ],
  },
  {
    id: '3d-visualizer',
    slug: '3d-visualizer',
    title: '3D Visualizer',
    department: 'Visualization',
    location: 'Dubai, UAE',
    type: 'Full-time',
    experience: '2+ years',
    salary: 'Competitive',
    postedDate: '2024-11-22',
    description:
      'Create photorealistic 3D visualizations and animations for luxury interior and architectural projects. Your work will be crucial in communicating design intent to clients and winning new projects.',
    responsibilities: [
      'Create high-quality 3D models from architectural drawings',
      'Produce photorealistic renders for client presentations',
      'Develop walkthrough animations and virtual tours',
      'Collaborate with designers to achieve desired visual outcomes',
      'Manage multiple visualization projects simultaneously',
      'Stay updated on latest visualization techniques and software',
      'Maintain render farm and optimize workflows',
      'Assist in developing marketing materials',
    ],
    requirements: [
      "Bachelor's degree in Architecture, Design, or related field",
      '2+ years of experience in architectural visualization',
      'Expert proficiency in 3ds Max, V-Ray, and Corona',
      'Strong understanding of lighting, materials, and composition',
      'Experience with post-production in Photoshop',
      'Portfolio demonstrating high-quality interior renders',
      'Ability to work under pressure and meet tight deadlines',
      'Knowledge of Unreal Engine or Enscape is a plus',
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      'Creative work environment',
      'Latest software and hardware',
      'Professional development',
      'Annual leave',
      'Flexible working arrangements',
      'Career growth opportunities',
    ],
  },
];

export function getJobBySlug(slug: string): JobPosition | undefined {
  return jobPositions.find((job) => job.slug === slug);
}

export function getAllJobSlugs(): string[] {
  return jobPositions.map((job) => job.slug);
}
