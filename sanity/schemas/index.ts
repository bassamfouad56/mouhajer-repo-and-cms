// Content Types
import project from './project'
import service from './service'
import industry from './industry'
import post from './post'

// Object Types
import imageSeparator from './objects/imageSeparator'

// Homepage Section Types
import heroSection from './objects/sections/heroSection'
import showcaseSection from './objects/sections/showcaseSection'
import statsSection from './objects/sections/statsSection'
import logoMarqueeSection from './objects/sections/logoMarqueeSection'
import founderSection from './objects/sections/founderSection'
import capabilitiesSection from './objects/sections/capabilitiesSection'
import portfolioSection from './objects/sections/portfolioSection'
import industriesSection from './objects/sections/industriesSection'
import partnersSection from './objects/sections/partnersSection'
import certificationsSection from './objects/sections/certificationsSection'
import faqSection from './objects/sections/faqSection'
import contactSection from './objects/sections/contactSection'

// Page Types
import homepage from './homepage'

// Taxonomy Types
import projectType from './projectType'
import location from './location'
import tag from './tag'

// Supporting Types
import award from './award'
import testimonial from './testimonial'
import team from './team'
import faq from './faq'
import client from './client'
import partner from './partner'

// Site Configuration
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Content
  project,
  service,
  industry,
  post,

  // Object Types
  imageSeparator,

  // Homepage Sections (object types)
  heroSection,
  showcaseSection,
  statsSection,
  logoMarqueeSection,
  founderSection,
  capabilitiesSection,
  portfolioSection,
  industriesSection,
  partnersSection,
  certificationsSection,
  faqSection,
  contactSection,

  // Pages
  homepage,

  // Taxonomy
  projectType,
  location,
  tag,

  // Supporting
  award,
  testimonial,
  team,
  faq,
  client,
  partner,

  // Configuration
  siteSettings,
]
