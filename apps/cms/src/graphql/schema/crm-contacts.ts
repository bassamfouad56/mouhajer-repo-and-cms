export const contactsTypeDefs = `#graphql
  # Contact - Individual Client
  type Contact {
    id: ID!
    firstName: String!
    lastName: String!
    fullNameAr: String
    email: String
    phone: String!
    whatsapp: String
    companyId: String
    company: Company
    position: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    country: String!
    type: String!
    status: String!
    source: String
    vip: Boolean!
    tags: [String!]!
    preferredStyle: [String!]!
    budgetRange: String
    projectType: [String!]!
    propertySize: String
    timeline: String
    linkedin: String
    instagram: String
    facebook: String
    preferredLanguage: String!
    notesEn: String
    notesAr: String
    assignedTo: String
    assignedUser: User
    deals: [Deal!]!
    tasks: [Task!]!
    activities: [CrmActivity!]!
    createdAt: String!
    updatedAt: String!
    lastContactedAt: String
  }

  type ContactsResponse {
    contacts: [Contact!]!
    total: Int!
    hasMore: Boolean!
  }

  input CreateContactInput {
    firstName: String!
    lastName: String!
    fullNameAr: String
    email: String
    phone: String!
    whatsapp: String
    companyId: String
    position: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    type: String
    source: String
    vip: Boolean
    tags: [String!]
    preferredStyle: [String!]
    budgetRange: String
    projectType: [String!]
    propertySize: String
    timeline: String
    linkedin: String
    instagram: String
    facebook: String
    preferredLanguage: String
    notesEn: String
    notesAr: String
    assignedTo: String
  }

  input UpdateContactInput {
    firstName: String
    lastName: String
    fullNameAr: String
    email: String
    phone: String
    whatsapp: String
    companyId: String
    position: String
    addressEn: String
    addressAr: String
    city: String
    area: String
    type: String
    status: String
    source: String
    vip: Boolean
    tags: [String!]
    preferredStyle: [String!]
    budgetRange: String
    projectType: [String!]
    propertySize: String
    timeline: String
    linkedin: String
    instagram: String
    facebook: String
    preferredLanguage: String
    notesEn: String
    notesAr: String
    assignedTo: String
    lastContactedAt: String
  }

  input ContactFilterInput {
    type: String
    status: String
    vip: Boolean
    city: String
    assignedTo: String
    companyId: String
    search: String
  }

  extend type Query {
    contacts(
      filter: ContactFilterInput
      limit: Int
      offset: Int
      orderBy: String
    ): ContactsResponse!

    contact(id: ID!): Contact

    myContacts: [Contact!]!

    vipContacts: [Contact!]!

    contactStats: ContactStats!
  }

  extend type Mutation {
    createContact(input: CreateContactInput!): Contact!

    updateContact(id: ID!, input: UpdateContactInput!): Contact!

    deleteContact(id: ID!): Boolean!

    markVip(id: ID!, vip: Boolean!): Contact!

    assignContact(id: ID!, userId: String!): Contact!
  }

  type ContactStats {
    total: Int!
    active: Int!
    inactive: Int!
    vip: Int!
    byCity: [ContactCityStat!]!
    byType: [ContactTypeStat!]!
  }

  type ContactCityStat {
    city: String!
    count: Int!
  }

  type ContactTypeStat {
    type: String!
    count: Int!
  }
`;
