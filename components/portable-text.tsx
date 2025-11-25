/**
 * Portable Text Renderer
 *
 * Rich text content renderer for Sanity CMS
 * Handles blocks, marks, lists, and embedded images
 */

import { PortableText, PortableTextComponents } from '@portabletext/react';
import { SafeImage } from './safe-image';
import { urlFor } from '@/sanity/lib/image';

// Custom components for rendering Portable Text blocks
const components: PortableTextComponents = {
  block: {
    // Headings
    h1: ({ children }) => (
      <h1 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-5 text-3xl font-light tracking-tight text-neutral-950 lg:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-3 text-xl font-light text-neutral-950 lg:text-2xl">
        {children}
      </h4>
    ),

    // Paragraphs
    normal: ({ children }) => (
      <p className="mb-4 text-lg leading-relaxed text-neutral-700">
        {children}
      </p>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-neutral-300 pl-6 italic text-neutral-600">
        {children}
      </blockquote>
    ),
  },

  list: {
    // Bulleted lists
    bullet: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-neutral-700">
        {children}
      </ul>
    ),

    // Numbered lists
    number: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-lg text-neutral-700">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },

  marks: {
    // Bold
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-950">{children}</strong>
    ),

    // Italic
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),

    // Links
    link: ({ children, value }) => {
      const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
      const target = !value?.href?.startsWith('/') ? '_blank' : undefined;

      return (
        <a
          href={value?.href}
          rel={rel}
          target={target}
          className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-950"
        >
          {children}
        </a>
      );
    },

    // Code
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-2 py-1 font-mono text-sm text-neutral-800">
        {children}
      </code>
    ),
  },

  types: {
    // Embedded images
    image: ({ value }) => {
      if (!value?.asset) return null;

      const imageUrl = urlFor(value)
        .width(1200)
        .height(800)
        .auto('format')
        .url();

      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-sm bg-neutral-100">
            <SafeImage
              src={imageUrl}
              alt={value?.alt || 'Image'}
              fill
              className="object-cover"
            />
          </div>
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-neutral-600">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface PortableTextRendererProps {
  value: any;
  className?: string;
}

export function PortableTextRenderer({ value, className = '' }: PortableTextRendererProps) {
  if (!value) return null;

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
