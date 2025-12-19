// Design Style Quiz Data

export interface QuizOption {
  id: string;
  text: string;
  image?: string;
  styles: string[]; // Which design styles this option contributes to
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
}

export interface DesignStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  characteristics: string[];
  colors: string[];
  materials: string[];
  image: string;
  projectSlug?: string; // Link to a relevant project
  serviceSlug?: string; // Link to a relevant service
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "mood",
    question: "How do you want your space to feel?",
    description: "Think about the atmosphere you want to create",
    options: [
      {
        id: "serene",
        text: "Calm & Serene",
        styles: ["minimalist", "contemporary"],
      },
      {
        id: "luxurious",
        text: "Luxurious & Grand",
        styles: ["classic", "arabesque"],
      },
      {
        id: "warm",
        text: "Warm & Inviting",
        styles: ["transitional", "contemporary"],
      },
      {
        id: "bold",
        text: "Bold & Dramatic",
        styles: ["modern", "arabesque"],
      },
    ],
  },
  {
    id: "colors",
    question: "Which color palette speaks to you?",
    options: [
      {
        id: "neutral",
        text: "Soft neutrals & earth tones",
        styles: ["minimalist", "transitional"],
      },
      {
        id: "monochrome",
        text: "Black, white & grey",
        styles: ["modern", "minimalist"],
      },
      {
        id: "rich",
        text: "Rich jewel tones",
        styles: ["classic", "arabesque"],
      },
      {
        id: "mixed",
        text: "Warm metallics with neutral base",
        styles: ["contemporary", "transitional"],
      },
    ],
  },
  {
    id: "furniture",
    question: "What furniture style do you prefer?",
    options: [
      {
        id: "clean",
        text: "Clean lines, simple forms",
        styles: ["minimalist", "modern"],
      },
      {
        id: "ornate",
        text: "Ornate details, carved wood",
        styles: ["classic", "arabesque"],
      },
      {
        id: "sculptural",
        text: "Sculptural, statement pieces",
        styles: ["contemporary", "modern"],
      },
      {
        id: "comfortable",
        text: "Comfortable, timeless classics",
        styles: ["transitional", "classic"],
      },
    ],
  },
  {
    id: "materials",
    question: "Which materials do you gravitate towards?",
    options: [
      {
        id: "natural",
        text: "Natural wood & stone",
        styles: ["minimalist", "transitional"],
      },
      {
        id: "marble",
        text: "Marble & precious metals",
        styles: ["classic", "arabesque"],
      },
      {
        id: "mixed",
        text: "Glass, metal & concrete",
        styles: ["modern", "contemporary"],
      },
      {
        id: "textured",
        text: "Rich fabrics & textures",
        styles: ["transitional", "arabesque"],
      },
    ],
  },
  {
    id: "artwork",
    question: "What type of art or decor do you prefer?",
    options: [
      {
        id: "minimal",
        text: "Minimal, one statement piece",
        styles: ["minimalist", "modern"],
      },
      {
        id: "gallery",
        text: "Gallery walls & collections",
        styles: ["transitional", "contemporary"],
      },
      {
        id: "traditional",
        text: "Traditional art & antiques",
        styles: ["classic", "arabesque"],
      },
      {
        id: "sculptural",
        text: "Sculptural & contemporary art",
        styles: ["contemporary", "modern"],
      },
    ],
  },
  {
    id: "lifestyle",
    question: "How do you use your living space?",
    options: [
      {
        id: "entertain",
        text: "Frequent entertaining & hosting",
        styles: ["classic", "contemporary"],
      },
      {
        id: "retreat",
        text: "Private retreat & relaxation",
        styles: ["minimalist", "transitional"],
      },
      {
        id: "family",
        text: "Active family living",
        styles: ["transitional", "contemporary"],
      },
      {
        id: "showcase",
        text: "Showcase for collections/art",
        styles: ["modern", "arabesque"],
      },
    ],
  },
];

export const designStyles: DesignStyle[] = [
  {
    id: "minimalist",
    name: "Modern Minimalist",
    tagline: "Less is More",
    description:
      "Your style embraces simplicity and functionality. Clean lines, uncluttered spaces, and a 'less is more' philosophy define your aesthetic. You appreciate quality over quantity and believe that every piece should serve a purpose.",
    characteristics: [
      "Clean, uncluttered spaces",
      "Neutral color palettes",
      "Functional furniture",
      "Natural light emphasis",
      "Hidden storage solutions",
    ],
    colors: ["White", "Cream", "Soft Grey", "Warm Beige"],
    materials: ["Natural Oak", "Linen", "Concrete", "Glass"],
    image: "/placeholder.jpg",
    serviceSlug: "interior-architecture",
  },
  {
    id: "modern",
    name: "Bold Modern",
    tagline: "Striking & Contemporary",
    description:
      "You're drawn to bold statements and cutting-edge design. Your style is characterized by dramatic contrasts, innovative materials, and furniture that doubles as art. You're not afraid to make a statement.",
    characteristics: [
      "High contrast combinations",
      "Statement lighting",
      "Geometric patterns",
      "Innovative materials",
      "Open floor plans",
    ],
    colors: ["Black", "White", "Chrome", "Accent Colors"],
    materials: ["Polished Concrete", "Steel", "Glass", "Lacquer"],
    image: "/placeholder.jpg",
    serviceSlug: "fit-out-execution",
  },
  {
    id: "classic",
    name: "Timeless Classic",
    tagline: "Elegant & Refined",
    description:
      "Your style speaks of timeless elegance and refined taste. Rich materials, symmetrical arrangements, and classic proportions create spaces that feel both luxurious and welcoming. You appreciate heritage and craftsmanship.",
    characteristics: [
      "Symmetrical layouts",
      "Crown moldings & paneling",
      "Antique accents",
      "Layered lighting",
      "Quality textiles",
    ],
    colors: ["Ivory", "Gold", "Deep Blue", "Burgundy"],
    materials: ["Marble", "Silk", "Walnut", "Brass"],
    image: "/placeholder.jpg",
    serviceSlug: "manufacturing-joinery",
  },
  {
    id: "contemporary",
    name: "Sophisticated Contemporary",
    tagline: "Current & Curated",
    description:
      "Your style is fresh, current, and carefully curated. You blend different eras and influences with a discerning eye, creating spaces that feel both of-the-moment and personal. Comfort and style go hand in hand.",
    characteristics: [
      "Mixed materials",
      "Curated collections",
      "Statement furniture",
      "Thoughtful lighting",
      "Artistic accents",
    ],
    colors: ["Warm Greys", "Soft Gold", "Emerald", "Blush"],
    materials: ["Velvet", "Terrazzo", "Brushed Brass", "Natural Stone"],
    image: "/placeholder.jpg",
    serviceSlug: "interior-architecture",
  },
  {
    id: "transitional",
    name: "Warm Transitional",
    tagline: "Balanced & Inviting",
    description:
      "Your style beautifully bridges traditional and contemporary. You create spaces that are comfortable yet sophisticated, combining classic elements with modern simplicity. Your home feels effortlessly put-together.",
    characteristics: [
      "Comfortable seating",
      "Neutral foundations",
      "Mixed textures",
      "Classic with modern twist",
      "Layered accessories",
    ],
    colors: ["Warm White", "Taupe", "Soft Blue", "Natural Wood"],
    materials: ["Linen", "Natural Wood", "Woven Textures", "Leather"],
    image: "/placeholder.jpg",
    serviceSlug: "fit-out-execution",
  },
  {
    id: "arabesque",
    name: "Luxury Arabesque",
    tagline: "Opulent & Cultural",
    description:
      "Your style celebrates the rich heritage of Arabic design with a contemporary twist. Intricate patterns, rich materials, and a sense of grandeur define your spaces. You appreciate the art of craftsmanship and storytelling through design.",
    characteristics: [
      "Intricate geometric patterns",
      "Rich color palettes",
      "Ornate lighting fixtures",
      "Handcrafted details",
      "Statement ceilings",
    ],
    colors: ["Deep Teal", "Gold", "Burgundy", "Ivory"],
    materials: ["Mother of Pearl", "Carved Wood", "Silk", "Copper"],
    image: "/placeholder.jpg",
    serviceSlug: "manufacturing-joinery",
  },
];

// Calculate the winning style based on answers
export function calculateStyle(answers: Record<string, string>): DesignStyle {
  const styleScores: Record<string, number> = {};

  // Initialize scores
  designStyles.forEach((style) => {
    styleScores[style.id] = 0;
  });

  // Calculate scores from answers
  Object.entries(answers).forEach(([questionId, optionId]) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    const option = question?.options.find((o) => o.id === optionId);

    if (option) {
      option.styles.forEach((styleId) => {
        styleScores[styleId] = (styleScores[styleId] || 0) + 1;
      });
    }
  });

  // Find the winning style
  let winningStyleId = "contemporary";
  let maxScore = 0;

  Object.entries(styleScores).forEach(([styleId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      winningStyleId = styleId;
    }
  });

  return designStyles.find((s) => s.id === winningStyleId) || designStyles[3];
}
