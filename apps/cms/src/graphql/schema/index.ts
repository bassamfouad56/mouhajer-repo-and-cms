import { gql } from 'graphql-tag';
import { scalarTypeDefs } from './scalars';
import { projectTypeDefs } from './projects';
import { serviceTypeDefs } from './services';
import { blogTypeDefs } from './blog';
import { settingsTypeDefs } from './settings';
import { leadsTypeDefs } from './crm-leads';
import { contactsTypeDefs } from './crm-contacts';
import { crmTypeDefs } from './crm';
import { pageTypeDefs } from './pages';
import { mediaTypeDefs } from './media';
import { navigationTypeDefs } from './navigation';
import { userTypeDefs } from './users';
import { adTypeDefs } from './ads';
import { roomRedesignTypeDefs } from './room-redesign';
import { activityTypeDefs } from './activity';
import { testimonialTypeDefs } from './testimonials';
import { faqTypeDefs } from './faq';
import { teamTypeDefs } from './team';
import { pricingTypeDefs } from './pricing';
import { caseStudyTypeDefs } from './case-studies';

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  scalarTypeDefs,
  userTypeDefs, // Must be before CRM schemas that reference User
  projectTypeDefs,
  serviceTypeDefs,
  blogTypeDefs,
  settingsTypeDefs,
  leadsTypeDefs,
  contactsTypeDefs,
  crmTypeDefs,
  pageTypeDefs,
  mediaTypeDefs,
  navigationTypeDefs,
  adTypeDefs,
  roomRedesignTypeDefs,
  activityTypeDefs,
  testimonialTypeDefs,
  faqTypeDefs,
  teamTypeDefs,
  pricingTypeDefs,
  caseStudyTypeDefs,
];
