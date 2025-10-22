export const crmTypeDefs = `#graphql
  # ==========================================
  # COMPANY
  # ==========================================
  type Company {
    id: ID!
    nameEn: String!
    nameAr: String
    industry: String
    size: String
    website: String
    logo: String
    email: String
    phone: String
    whatsapp: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    country: String!
    type: String!
    vip: Boolean!
    tags: [String!]!
    linkedin: String
    instagram: String
    facebook: String
    notesEn: String
    notesAr: String
    assignedTo: String
    contacts: [Contact!]!
    deals: [Deal!]!
    leads: [Lead!]!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCompanyInput {
    nameEn: String!
    nameAr: String
    industry: String
    size: String
    website: String
    logo: String
    email: String
    phone: String
    whatsapp: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    type: String
    vip: Boolean
    tags: [String!]
    linkedin: String
    instagram: String
    facebook: String
    notesEn: String
    notesAr: String
    assignedTo: String
  }

  input UpdateCompanyInput {
    nameEn: String
    nameAr: String
    industry: String
    size: String
    website: String
    logo: String
    email: String
    phone: String
    whatsapp: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    type: String
    vip: Boolean
    tags: [String!]
    linkedin: String
    instagram: String
    facebook: String
    notesEn: String
    notesAr: String
    assignedTo: String
  }

  # ==========================================
  # DEAL (Sales Pipeline)
  # ==========================================
  type Deal {
    id: ID!
    titleEn: String!
    titleAr: String
    contactId: String!
    contact: Contact!
    companyId: String
    company: Company
    value: Float!
    currency: String!
    stage: String!
    probability: Int!
    source: String
    projectType: String!
    propertySize: String
    location: String
    city: String
    area: String
    expectedCloseDate: String
    actualCloseDate: String
    wonReason: String
    lostReason: String
    competitors: [String!]!
    notesEn: String
    notesAr: String
    quotationIds: [String!]!
    proposalIds: [String!]!
    contractIds: [String!]!
    assignedTo: String
    tags: [String!]!
    tasks: [Task!]!
    activities: [CrmActivity!]!
    createdAt: String!
    updatedAt: String!
  }

  type DealsResponse {
    deals: [Deal!]!
    total: Int!
    totalValue: Float!
    hasMore: Boolean!
  }

  input CreateDealInput {
    titleEn: String!
    titleAr: String
    contactId: String!
    companyId: String
    value: Float!
    stage: String
    probability: Int
    source: String
    projectType: String!
    propertySize: String
    location: String
    city: String
    area: String
    expectedCloseDate: String
    notesEn: String
    notesAr: String
    assignedTo: String
    tags: [String!]
  }

  input UpdateDealInput {
    titleEn: String
    titleAr: String
    contactId: String
    companyId: String
    value: Float
    stage: String
    probability: Int
    source: String
    projectType: String
    propertySize: String
    location: String
    city: String
    area: String
    expectedCloseDate: String
    actualCloseDate: String
    wonReason: String
    lostReason: String
    competitors: [String!]
    notesEn: String
    notesAr: String
    quotationIds: [String!]
    proposalIds: [String!]
    contractIds: [String!]
    assignedTo: String
    tags: [String!]
  }

  # ==========================================
  # TASK
  # ==========================================
  type Task {
    id: ID!
    title: String!
    description: String
    type: String!
    relatedTo: String!
    relatedId: String!
    leadId: String
    contactId: String
    dealId: String
    lead: Lead
    contact: Contact
    deal: Deal
    assignedTo: String!
    dueDate: String!
    dueTime: String
    completedAt: String
    priority: String!
    status: String!
    reminder: Boolean!
    reminderMinutes: Int
    notes: String
    completionNotes: String
    createdAt: String!
    updatedAt: String!
  }

  input CreateTaskInput {
    title: String!
    description: String
    type: String!
    relatedTo: String!
    relatedId: String!
    assignedTo: String!
    dueDate: String!
    dueTime: String
    priority: String
    reminder: Boolean
    reminderMinutes: Int
    notes: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    type: String
    dueDate: String
    dueTime: String
    priority: String
    status: String
    completedAt: String
    reminder: Boolean
    reminderMinutes: Int
    notes: String
    completionNotes: String
  }

  # ==========================================
  # CRM ACTIVITY
  # ==========================================
  type ActivityUser {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type CrmActivity {
    id: ID!
    type: String!
    title: String!
    description: String
    relatedTo: String!
    relatedId: String!
    leadId: String
    contactId: String
    dealId: String
    userId: String!
    user: ActivityUser!
    stage: String
    metadata: JSON
    duration: Int
    outcome: String
    activityDate: String!
    createdAt: String!
  }

  input CreateActivityInput {
    type: String!
    title: String!
    description: String
    relatedTo: String!
    relatedId: String!
    stage: String
    metadata: JSON
    duration: Int
    outcome: String
  }

  input AddDealNoteInput {
    dealId: ID!
    stage: String!
    note: String!
  }

  # ==========================================
  # QUERIES
  # ==========================================
  type Query {
    # Companies
    companies(limit: Int, offset: Int): [Company!]!
    company(id: ID!): Company

    # Deals
    deals(stage: String, assignedTo: String, limit: Int, offset: Int): DealsResponse!
    deal(id: ID!): Deal
    dealsByStage(stage: String!): [Deal!]!
    pipelineStats: PipelineStats!

    # Tasks
    tasks(status: String, assignedTo: String, relatedTo: String, limit: Int, offset: Int): [Task!]!
    task(id: ID!): Task
    myTasks(status: String): [Task!]!
    upcomingTasks(days: Int): [Task!]!

    # Activities
    activities(relatedTo: String!, relatedId: String!, limit: Int): [CrmActivity!]!
    recentActivities(limit: Int): [CrmActivity!]!

    # Unified CRM Stats
    crmStats: CRMStats!

    # CRM Analytics
    crmAnalytics: CRMAnalytics!
  }

  # ==========================================
  # MUTATIONS
  # ==========================================
  type Mutation {
    # Companies
    createCompany(input: CreateCompanyInput!): Company!
    updateCompany(id: ID!, input: UpdateCompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!

    # Deals
    createDeal(input: CreateDealInput!): Deal!
    updateDeal(id: ID!, input: UpdateDealInput!): Deal!
    deleteDeal(id: ID!): Boolean!
    moveDealStage(id: ID!, stage: String!): Deal!
    closeDeal(id: ID!, won: Boolean!, reason: String): Deal!

    # Tasks
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Boolean!
    completeTask(id: ID!, notes: String): Task!

    # Activities
    createActivity(input: CreateActivityInput!): CrmActivity!
    addDealNote(input: AddDealNoteInput!): CrmActivity!
    logCall(contactId: String, leadId: String, dealId: String, duration: Int, notes: String!): CrmActivity!
    logEmail(contactId: String, leadId: String, dealId: String, subject: String!, body: String): CrmActivity!
    logMeeting(contactId: String, leadId: String, dealId: String, duration: Int, notes: String!): CrmActivity!
  }

  # ==========================================
  # STATISTICS
  # ==========================================
  type PipelineStats {
    totalValue: Float!
    dealCount: Int!
    wonValue: Float!
    wonCount: Int!
    lostCount: Int!
    winRate: Float!
    averageDealSize: Float!
    byStage: [DealStageStat!]!
  }

  type DealStageStat {
    stage: String!
    count: Int!
    value: Float!
    probability: Int!
  }

  type CRMStats {
    totalLeads: Int!
    totalContacts: Int!
    totalDeals: Int!
    pipelineValue: Float!
    wonDeals: Int!
    conversionRate: Float!
  }

  # ==========================================
  # ANALYTICS
  # ==========================================
  type LeadDataPoint {
    date: String!
    leads: Int!
    converted: Int!
  }

  type PipelineDataPoint {
    stage: String!
    count: Int!
    value: Float!
  }

  type ConversionDataPoint {
    name: String!
    value: Int!
  }

  type RevenueDataPoint {
    month: String!
    revenue: Float!
  }

  type CRMAnalytics {
    leadsOverTime: [LeadDataPoint!]!
    pipelineByStage: [PipelineDataPoint!]!
    conversionStats: [ConversionDataPoint!]!
    revenueOverTime: [RevenueDataPoint!]!
  }
`;
