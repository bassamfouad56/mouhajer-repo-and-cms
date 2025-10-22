export const leadsTypeDefs = `#graphql
  # Lead - Potential Client
  type Lead {
    id: ID!
    name: String!
    email: String
    phone: String!
    companyId: String
    companyName: String
    company: Company
    source: String!
    status: String!
    score: Int!
    projectType: String!
    budgetRange: String
    propertySize: String
    timeline: String
    city: String
    area: String
    interestedIn: [String!]!
    stylePreference: [String!]!
    message: String
    notesEn: String
    notesAr: String
    qualified: Boolean!
    qualifiedAt: String
    disqualifiedReason: String
    nextFollowUpDate: String
    lastContactedAt: String
    convertedToContact: Boolean!
    convertedToDeal: Boolean!
    convertedAt: String
    assignedTo: String
    assignedUser: User
    tasks: [Task!]!
    activities: [CrmActivity!]!
    createdAt: String!
    updatedAt: String!
  }

  # Lead List Response
  type LeadsResponse {
    leads: [Lead!]!
    total: Int!
    hasMore: Boolean!
  }

  # Lead Input for Creation
  input CreateLeadInput {
    name: String!
    email: String
    phone: String!
    companyId: String
    companyName: String
    source: String!
    projectType: String!
    budgetRange: String
    propertySize: String
    timeline: String
    city: String
    area: String
    interestedIn: [String!]
    stylePreference: [String!]
    message: String
    notesEn: String
    notesAr: String
    assignedTo: String
  }

  # Lead Input for Update
  input UpdateLeadInput {
    name: String
    email: String
    phone: String
    companyId: String
    companyName: String
    source: String
    status: String
    score: Int
    projectType: String
    budgetRange: String
    propertySize: String
    timeline: String
    city: String
    area: String
    interestedIn: [String!]
    stylePreference: [String!]
    message: String
    notesEn: String
    notesAr: String
    qualified: Boolean
    qualifiedAt: String
    disqualifiedReason: String
    nextFollowUpDate: String
    lastContactedAt: String
    assignedTo: String
  }

  # Lead Filter Input
  input LeadFilterInput {
    status: String
    source: String
    qualified: Boolean
    projectType: String
    budgetRange: String
    city: String
    assignedTo: String
    minScore: Int
    maxScore: Int
    search: String
  }

  # Lead Conversion Result
  type LeadConversionResult {
    contact: Contact!
    deal: Deal
    success: Boolean!
    message: String
  }

  extend type Query {
    # Get all leads with optional filtering
    leads(
      filter: LeadFilterInput
      limit: Int
      offset: Int
      orderBy: String
    ): LeadsResponse!

    # Get single lead by ID
    lead(id: ID!): Lead

    # Get leads by status
    leadsByStatus(status: String!): [Lead!]!

    # Get my assigned leads
    myLeads: [Lead!]!

    # Get lead statistics
    leadStats: LeadStats!
  }

  extend type Mutation {
    # Create new lead
    createLead(input: CreateLeadInput!): Lead!

    # Update lead
    updateLead(id: ID!, input: UpdateLeadInput!): Lead!

    # Delete lead
    deleteLead(id: ID!): Boolean!

    # Qualify lead
    qualifyLead(id: ID!): Lead!

    # Disqualify lead
    disqualifyLead(id: ID!, reason: String!): Lead!

    # Update lead score
    updateLeadScore(id: ID!, score: Int!): Lead!

    # Update lead status
    updateLeadStatus(id: ID!, status: String!): Lead!

    # Assign lead to user
    assignLead(id: ID!, userId: String!): Lead!

    # Convert lead to contact and optionally create deal
    convertLead(
      id: ID!
      createDeal: Boolean
      dealValue: Float
    ): LeadConversionResult!

    # Bulk import leads
    importLeads(leads: [CreateLeadInput!]!): [Lead!]!
  }

  # Lead Statistics
  type LeadStats {
    total: Int!
    new: Int!
    contacted: Int!
    qualified: Int!
    converted: Int!
    lost: Int!
    averageScore: Float!
    conversionRate: Float!
    bySource: [LeadSourceStat!]!
    byStatus: [LeadStatusStat!]!
  }

  type LeadSourceStat {
    source: String!
    count: Int!
    percentage: Float!
  }

  type LeadStatusStat {
    status: String!
    count: Int!
    percentage: Float!
  }
`;
