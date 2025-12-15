// Content Types
import project from './project'
import service from './service'
import industry from './industry'
import post from './post'

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
