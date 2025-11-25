/**
 * Sanity Preview Mode Configuration
 *
 * Enables live preview of draft content while editing in Sanity Studio
 */

import { definePreview } from 'next-sanity/preview';
import { client } from './client';

export const usePreview = definePreview({
  client,
  suspense: true,
});
