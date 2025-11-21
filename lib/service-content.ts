// Comprehensive copywriting content for service pages

export interface ServiceContent {
  overview: {
    headline: string;
    description: string;
  };
  whyChooseUs: {
    title: string;
    reasons: Array<{
      title: string;
      description: string;
    }>;
  };
  approach: {
    title: string;
    description: string;
    methodology: string[];
  };
  benefits: {
    title: string;
    items: string[];
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
}

export const serviceContentData: { [key: string]: ServiceContent } = {
  'fb-restaurants': {
    overview: {
      headline: 'Creating Dining Experiences That Captivate and Convert',
      description: 'In the competitive F&B industry, your restaurant\'s design is more than aesthetics—it\'s your brand story, customer experience, and competitive advantage all rolled into one. We specialize in creating restaurant and bar environments that not only look stunning but drive profitability through strategic space planning, atmosphere creation, and operational efficiency.',
    },
    whyChooseUs: {
      title: 'Why Partner With Us for Your F&B Project',
      reasons: [
        {
          title: 'Industry Expertise',
          description: 'With over 15 years designing successful F&B concepts across Dubai and the Middle East, we understand the unique challenges of restaurant design—from kitchen workflow optimization to creating Instagram-worthy moments that drive social media buzz.',
        },
        {
          title: 'Operational Intelligence',
          description: 'We don\'t just design beautiful spaces; we create functional layouts that improve service flow, reduce staff movement, and maximize table turns without compromising guest comfort.',
        },
        {
          title: 'ROI-Focused Design',
          description: 'Every design decision is made with your bottom line in mind. We optimize seating capacity, create high-value zones, and design flexible spaces that can adapt to different service periods and events.',
        },
        {
          title: 'Brand Storytelling',
          description: 'Your restaurant design should tell your culinary story. We craft cohesive narratives through materiality, lighting, and spatial design that resonate with your target audience and create lasting impressions.',
        },
      ],
    },
    approach: {
      title: 'Our Design Approach',
      description: 'We believe great restaurant design balances three critical elements: ambiance, functionality, and profitability. Our methodology ensures your F&B concept succeeds on all fronts.',
      methodology: [
        'Comprehensive market analysis and competitor research to identify design opportunities',
        'Detailed customer journey mapping to optimize every touchpoint from entrance to exit',
        'Kitchen and BOH planning in collaboration with chefs and operational teams',
        'Lighting design that creates mood while maintaining functionality across day and night service',
        'Material selection focused on durability, maintenance, and aesthetic longevity',
        'Acoustic design to manage noise levels for comfortable dining conversations',
      ],
    },
    benefits: {
      title: 'What You Gain',
      items: [
        'Increased revenue through optimized seating layouts and table configurations',
        'Enhanced guest experience leading to higher customer satisfaction and repeat visits',
        'Reduced operational costs through efficient kitchen and service flow design',
        'Instagram-worthy spaces that generate organic social media marketing',
        'Flexible design that adapts to different dining periods and special events',
        'Streamlined construction process through detailed documentation and contractor coordination',
        'Lower maintenance costs through strategic material selection',
        'Brand differentiation in a crowded market',
      ],
    },
    faq: [
      {
        question: 'How long does a typical restaurant design project take?',
        answer: 'A complete restaurant design project typically takes 3-6 months from initial concept to construction-ready documents, depending on project size and complexity. We work efficiently to meet your opening timeline while maintaining design quality.',
      },
      {
        question: 'Do you work with existing restaurant spaces or only new builds?',
        answer: 'We work on both new construction and renovation projects. In fact, many of our most successful projects involve reimagining existing spaces to maximize their potential while working within structural constraints.',
      },
      {
        question: 'Can you help with kitchen design and equipment planning?',
        answer: 'Absolutely. We collaborate closely with kitchen consultants and equipment suppliers to ensure your kitchen is both efficient and compliant with health and safety regulations. Proper kitchen design is crucial to restaurant success.',
      },
      {
        question: 'How do you handle FF&E procurement?',
        answer: 'We provide comprehensive FF&E services including specification, sourcing, budgeting, and procurement management. We have established relationships with quality suppliers and can source both locally and internationally.',
      },
    ],
  },

  'healthcare-wellness-2': {
    overview: {
      headline: 'Designing Healing Environments That Promote Wellness and Recovery',
      description: 'Healthcare design is about more than clinical efficiency—it\'s about creating spaces that reduce stress, support healing, and improve outcomes for patients and staff alike. Our evidence-based approach combines the latest research in healing environments with practical operational requirements to deliver healthcare spaces that truly make a difference.',
    },
    whyChooseUs: {
      title: 'Why Trust Us With Your Healthcare Project',
      reasons: [
        {
          title: 'Evidence-Based Design',
          description: 'We apply proven research linking physical environment to health outcomes. From natural light optimization to stress-reducing color palettes, every design decision is grounded in scientific evidence.',
        },
        {
          title: 'Regulatory Expertise',
          description: 'Healthcare facilities must meet strict regulatory requirements. We navigate DHA, MOH, and international healthcare design standards to ensure full compliance while maintaining design excellence.',
        },
        {
          title: 'Patient-Centered Approach',
          description: 'We design from the patient\'s perspective, creating calming, dignified environments that reduce anxiety and support the healing process. Comfortable patients recover faster and rate care higher.',
        },
        {
          title: 'Operational Efficiency',
          description: 'Efficient healthcare design saves lives. We optimize clinical workflows, reduce staff fatigue through smart planning, and create flexible spaces that adapt to changing medical needs.',
        },
      ],
    },
    approach: {
      title: 'Our Evidence-Based Methodology',
      description: 'Healthcare design requires a unique blend of empathy, technical knowledge, and regulatory understanding. Our process ensures spaces that heal, inspire, and perform.',
      methodology: [
        'Comprehensive stakeholder consultation with medical staff, administrators, and patients',
        'Evidence-based design research and application of healing environment principles',
        'Detailed infection control and hygiene planning integrated into all design decisions',
        'Accessibility design exceeding ADA and universal design standards',
        'Biophilic design integration bringing nature into healthcare settings',
        'Acoustic and privacy design to protect patient dignity and HIPAA compliance',
        'Flexible planning for future medical technology and practice evolution',
      ],
    },
    benefits: {
      title: 'Measurable Outcomes',
      items: [
        'Reduced patient stress and anxiety through calming, nature-inspired design',
        'Faster recovery times in optimized healing environments',
        'Improved staff satisfaction and reduced burnout through better workplace design',
        'Higher patient satisfaction scores leading to better reputation and referrals',
        'Reduced medical errors through clear wayfinding and organized layouts',
        'Lower infection rates through strategic material selection and hygiene planning',
        'Increased operational efficiency and patient throughput',
        'Future-proof design that adapts to evolving medical practices',
      ],
    },
    faq: [
      {
        question: 'What makes healthcare design different from other commercial projects?',
        answer: 'Healthcare design must balance patient comfort, clinical efficiency, strict regulatory compliance, and infection control. It requires specialized knowledge of medical workflows, equipment needs, and evidence-based design principles that directly impact patient outcomes.',
      },
      {
        question: 'Do you design for specific medical specialties?',
        answer: 'Yes, we have experience across various specialties including general practice clinics, dental facilities, medical spas, physical therapy centers, and specialized treatment facilities. Each specialty has unique requirements that we understand and address.',
      },
      {
        question: 'How do you incorporate infection control into design?',
        answer: 'Infection control is integrated from the start through material selection (non-porous, easily cleanable surfaces), strategic layout planning (separating clean and contaminated zones), proper ventilation design, and touchless technology integration.',
      },
    ],
  },

  'retail-showrooms-2': {
    overview: {
      headline: 'Retail Design That Drives Sales and Brand Loyalty',
      description: 'In an era of e-commerce, physical retail must offer experiences that can\'t be replicated online. We create immersive brand environments that engage customers emotionally, encourage exploration, and convert browsers into buyers. From flagship stores to intimate boutiques, our retail designs drive measurable business results.',
    },
    whyChooseUs: {
      title: 'Why Choose Us for Retail Design',
      reasons: [
        {
          title: 'Conversion-Focused Design',
          description: 'We design with your sales metrics in mind. Every layout decision, lighting choice, and display design is optimized to guide customers through the buying journey and increase conversion rates.',
        },
        {
          title: 'Brand Experience Expertise',
          description: 'Your store is your most powerful brand touchpoint. We create cohesive experiences that communicate brand values, differentiate you from competitors, and build emotional connections with customers.',
        },
        {
          title: 'Omnichannel Integration',
          description: 'Modern retail must seamlessly blend physical and digital experiences. We integrate technology thoughtfully, from interactive displays to mobile checkout, enhancing rather than replacing human interaction.',
        },
        {
          title: 'Retail Psychology',
          description: 'We apply proven principles of consumer behavior and retail psychology to influence purchasing decisions through strategic layout, visual merchandising, and sensory design.',
        },
      ],
    },
    approach: {
      title: 'Our Strategic Retail Process',
      description: 'Successful retail design starts with understanding your customers, brand, and business goals. Our data-driven approach creates spaces that delight shoppers and deliver ROI.',
      methodology: [
        'Customer persona development and shopping behavior analysis',
        'Competitive landscape audit and market positioning strategy',
        'Customer journey mapping from window display to checkout',
        'Strategic layout planning to maximize sales per square foot',
        'Visual merchandising strategy and display system design',
        'Lighting design to highlight products and create ambiance',
        'Sensory branding through materials, scents, and soundscapes',
      ],
    },
    benefits: {
      title: 'Business Impact',
      items: [
        'Increased foot traffic through compelling window displays and storefront design',
        'Higher conversion rates via optimized customer flow and product placement',
        'Increased average transaction value through strategic merchandising',
        'Stronger brand recognition and customer loyalty',
        'Enhanced customer dwell time in comfortable, engaging spaces',
        'Flexible layouts that adapt to seasonal changes and new product launches',
        'Instagram-worthy moments that generate organic social media marketing',
        'Measurable ROI through data-driven design decisions',
      ],
    },
    faq: [
      {
        question: 'How do you balance aesthetics with practical retail requirements?',
        answer: 'Great retail design must be both beautiful and functional. We balance brand expression with practical needs like inventory display, security, traffic flow, and maintenance. Our designs are as practical as they are visually stunning.',
      },
      {
        question: 'Can you help with visual merchandising strategy?',
        answer: 'Yes, we provide visual merchandising consultation as part of our retail design service. This includes display system design, product grouping strategies, and seasonal merchandising guidelines that your team can implement.',
      },
      {
        question: 'Do you design for both luxury and mass-market retail?',
        answer: 'We have experience across the retail spectrum, from luxury flagship stores to accessible mass-market retail. Each segment has different design requirements and customer expectations that we understand deeply.',
      },
    ],
  },

  'commercial-office-2': {
    overview: {
      headline: 'Office Design That Attracts Talent and Drives Productivity',
      description: 'The office is no longer just a place to work—it\'s a strategic tool for attracting talent, fostering collaboration, and embodying company culture. We design workplaces that people actually want to come to, balancing individual focus with team collaboration, and flexibility with efficiency.',
    },
    whyChooseUs: {
      title: 'Why Partner With Us',
      reasons: [
        {
          title: 'Workplace Strategy',
          description: 'We start with understanding how your team actually works. Through workplace analytics and stakeholder interviews, we create environments tailored to your specific work processes and culture.',
        },
        {
          title: 'Productivity Focus',
          description: 'Every design decision considers its impact on employee productivity and wellbeing. From acoustic privacy to ergonomic furniture to biophilic design, we create environments where people thrive.',
        },
        {
          title: 'Future-Ready Design',
          description: 'The workplace is evolving rapidly. We design flexible spaces that adapt to hybrid work, changing technology, and shifting team structures without requiring major renovation.',
        },
        {
          title: 'Brand Embodiment',
          description: 'Your office should reflect who you are as a company. We translate brand values and culture into physical space, creating environments that inspire employees and impress clients.',
        },
      ],
    },
    approach: {
      title: 'Our Workplace Design Process',
      description: 'Great office design requires understanding your business, culture, and people. Our human-centered approach creates workplaces that support success.',
      methodology: [
        'Workplace audit and utilization study of current space',
        'Employee surveys and stakeholder workshops to understand needs',
        'Activity-based planning matching space types to work activities',
        'Collaboration and focus zone balancing for optimal productivity',
        'Technology integration planning for modern work requirements',
        'Wellness and biophilic design for employee health and satisfaction',
        'Change management support to ensure successful transition',
      ],
    },
    benefits: {
      title: 'Organizational Benefits',
      items: [
        'Improved employee satisfaction and retention through better workplace experience',
        'Increased productivity from optimized work settings and reduced distractions',
        'Enhanced collaboration through strategically placed team spaces',
        'Talent attraction advantage in competitive hiring markets',
        'Reduced real estate costs through efficient space planning',
        'Greater flexibility to adapt to business changes',
        'Stronger company culture and brand identity',
        'Improved client impressions and confidence',
      ],
    },
    faq: [
      {
        question: 'How do you approach hybrid work in office design?',
        answer: 'Hybrid work requires rethinking traditional office design. We create flexible booking systems, varied work settings from focus rooms to collaboration spaces, and right-sized offices that accommodate fluctuating occupancy while maintaining quality when teams are together.',
      },
      {
        question: 'What is activity-based working and is it right for us?',
        answer: 'Activity-based working provides diverse space types—quiet focus areas, collaborative zones, social spaces—instead of assigned desks. It works well for organizations with varied work activities and mobile workers. We assess whether it fits your culture and work style.',
      },
      {
        question: 'How do you handle change management during office redesign?',
        answer: 'Change management is crucial for successful workplace projects. We provide employee communication support, pilot programs to test new concepts, training on new space types, and post-occupancy evaluation to ensure smooth transition.',
      },
    ],
  },

  'residential-luxury-2': {
    overview: {
      headline: 'Bespoke Luxury Living Tailored to Your Lifestyle',
      description: 'Your home is your most personal space—a reflection of your taste, your achievements, and your aspirations. We create luxury residences that go beyond trends to capture your unique lifestyle and personality. From contemporary penthouses to classical villas, every project is a one-of-one creation designed specifically for you.',
    },
    whyChooseUs: {
      title: 'The Mouhajer Difference',
      reasons: [
        {
          title: 'Truly Bespoke Design',
          description: 'No templates, no cookie-cutter solutions. We start every project with a blank canvas, deeply understanding your lifestyle, preferences, and dreams to create a home that is unmistakably yours.',
        },
        {
          title: 'Artisanal Craftsmanship',
          description: 'We work with the finest craftspeople and artisans locally and internationally to create custom furniture, millwork, and finishes that you won\'t find anywhere else.',
        },
        {
          title: 'Luxury Without Compromise',
          description: 'From material selection to finish quality, we never compromise on luxury. We source the finest materials globally and maintain exacting quality standards throughout execution.',
        },
        {
          title: 'Lifestyle Integration',
          description: 'Great residential design isn\'t just beautiful—it works perfectly for how you live. We design around your daily routines, entertaining style, and personal preferences.',
        },
      ],
    },
    approach: {
      title: 'Our Bespoke Process',
      description: 'Creating your dream home is a journey we take together. Our collaborative process ensures every detail reflects your vision while benefiting from our expertise.',
      methodology: [
        'In-depth lifestyle consultation to understand how you live and entertain',
        'Inspiration sessions exploring your aesthetic preferences and aspirations',
        'Architectural optimization of space planning and flow',
        'Custom furniture design and artisan selection',
        'Material library curation presenting the finest options',
        'Lighting design creating ambiance for every occasion',
        'Smart home integration for modern luxury living',
        'Art consultation and placement strategy',
      ],
    },
    benefits: {
      title: 'Your Home Benefits',
      items: [
        'A home that perfectly reflects your personality and lifestyle',
        'Exclusive custom pieces you won\'t find in other homes',
        'Timeless design that transcends trends and maintains value',
        'Optimized functionality making daily life easier and more enjoyable',
        'Impressive spaces perfect for entertaining and hosting',
        'Integration of art and collectibles into the design',
        'Smart home technology that enhances rather than complicates',
        'White-glove service and attention to every detail',
      ],
    },
    faq: [
      {
        question: 'How involved will I be in the design process?',
        answer: 'As involved as you want to be. Some clients prefer to review and approve major milestones, while others enjoy being part of every decision. We adapt our process to your preferences and schedule.',
      },
      {
        question: 'Can you work with my existing furniture and art?',
        answer: 'Absolutely. We often design around cherished pieces our clients already own. We\'ll assess what works with the new design and help source complementary pieces that create a cohesive whole.',
      },
      {
        question: 'Do you design individual rooms or complete homes?',
        answer: 'We do both. While we specialize in complete home transformations for the most cohesive results, we\'re happy to design specific rooms like master suites, living rooms, or home offices.',
      },
      {
        question: 'What is your approach to sustainability in luxury design?',
        answer: 'Luxury and sustainability aren\'t mutually exclusive. We source responsibly harvested materials, specify energy-efficient systems, and design timeless spaces that won\'t need replacement. Quality pieces that last are inherently sustainable.',
      },
    ],
  },

  'hospitality-hotels-2': {
    overview: {
      headline: 'Hotel Design That Creates Unforgettable Guest Experiences',
      description: 'In hospitality, design isn\'t decoration—it\'s the experience. From the moment guests arrive to their final checkout, every touchpoint should delight, comfort, and exceed expectations. We create hotel and resort environments that guests remember, review highly, and return to.',
    },
    whyChooseUs: {
      title: 'Why Choose Us for Hospitality Design',
      reasons: [
        {
          title: 'Guest Experience Expertise',
          description: 'We design from the guest\'s perspective, mapping every interaction and emotion throughout their stay. Our spaces create the memorable moments that turn first-time visitors into loyal guests.',
        },
        {
          title: 'Brand Positioning',
          description: 'Your hotel design should clearly communicate your market position and appeal to your target guest. We create distinctive environments that command premium rates and build brand loyalty.',
        },
        {
          title: 'Operational Excellence',
          description: 'Beautiful hotels must also operate efficiently. We optimize layouts for staff productivity, design for easy maintenance, and create flexible spaces that adapt to different guest needs and events.',
        },
        {
          title: 'ROI-Driven Design',
          description: 'Every design decision considers return on investment. We maximize revenue through strategic space allocation, create high-value amenities, and design for long-term durability to protect your investment.',
        },
      ],
    },
    approach: {
      title: 'Our Hospitality Design Process',
      description: 'Successful hotel design requires balancing guest desires, operational realities, and financial goals. Our proven process delivers properties that perform.',
      methodology: [
        'Market analysis and competitive positioning strategy',
        'Guest persona development and journey mapping',
        'Space programming to optimize revenue per square meter',
        'Concept design creating distinctive guest experiences',
        'FF&E specification balancing aesthetics, durability, and budget',
        'Operational flow planning for efficient service delivery',
        'Sustainability integration and energy efficiency design',
        'Construction administration and quality control',
      ],
    },
    benefits: {
      title: 'Business Outcomes',
      items: [
        'Higher ADR (average daily rate) through premium positioning and design',
        'Increased occupancy via distinctive, bookable experiences',
        'Better guest satisfaction scores and online reviews',
        'Reduced operational costs through efficient design',
        'Enhanced F&B revenue from inviting restaurant and bar design',
        'Profitable ancillary spaces like spas and meeting venues',
        'Social media buzz from Instagram-worthy design moments',
        'Strong brand identity that builds repeat business',
      ],
    },
    faq: [
      {
        question: 'Do you design both new builds and renovations?',
        answer: 'Yes, we work on new hotel construction, complete renovations, and phased refurbishments of operating properties. Renovations require special planning to minimize guest disruption while maintaining quality.',
      },
      {
        question: 'Can you help with branding and concept development?',
        answer: 'Absolutely. We often work with hotel owners and operators to develop new concepts, positioning strategies, and brand identities that differentiate in competitive markets.',
      },
      {
        question: 'How do you approach sustainability in hospitality design?',
        answer: 'Sustainability is increasingly important to guests and operators. We integrate energy-efficient systems, water conservation, sustainable materials, and operational efficiency. Many certifications like LEED are achievable without sacrificing luxury.',
      },
      {
        question: 'What about F&B spaces within hotels?',
        answer: 'Hotel F&B requires special consideration—restaurants must appeal to both hotel guests and outside diners. We create destination restaurants and bars that generate significant revenue and enhance the overall hotel experience.',
      },
    ],
  },

  '3d-visualization': {
    overview: {
      headline: 'Bring Your Vision to Life Before Construction Begins',
      description: 'Making design decisions with confidence requires seeing the finished result before it\'s built. Our photorealistic 3D visualization services let you experience your space virtually, make informed choices, and get stakeholder buy-in before construction starts.',
    },
    whyChooseUs: {
      title: 'Why Our Visualization Services Stand Out',
      reasons: [
        {
          title: 'Photorealistic Quality',
          description: 'Our renderings are indistinguishable from photography. We use advanced rendering techniques, accurate materials and lighting, and painstaking detail to create images that truly represent the final space.',
        },
        {
          title: 'Design Decision Support',
          description: 'Visualization isn\'t just pretty pictures—it\'s a design tool. We create multiple options for materials, colors, and layouts so you can make choices confidently, reducing costly changes during construction.',
        },
        {
          title: 'Marketing Ready',
          description: 'Our visualizations are polished enough for marketing campaigns, sales presentations, investor pitches, and public relations. Start marketing your project before the first brick is laid.',
        },
        {
          title: 'Virtual Reality Available',
          description: 'Go beyond static images with immersive VR walkthroughs. Experience your space in 1:1 scale, understand spatial relationships, and make informed design decisions.',
        },
      ],
    },
    approach: {
      title: 'Our Visualization Process',
      description: 'Great visualization requires technical skill and artistic vision. Our process delivers images that wow clients and sell projects.',
      methodology: [
        'Detailed 3D modeling from architectural plans and design drawings',
        'Material specification with real-world textures and finishes',
        'Advanced lighting simulation matching time of day and atmosphere',
        'Strategic camera angle selection to showcase design highlights',
        'Photorealistic rendering using industry-leading software',
        'Post-processing for perfect color, composition, and mood',
        'Multiple revision rounds to capture your vision exactly',
      ],
    },
    benefits: {
      title: 'Project Benefits',
      items: [
        'Make design decisions with confidence seeing realistic results',
        'Secure stakeholder and investor approval faster',
        'Reduce construction changes and associated costs',
        'Start marketing and leasing before construction completion',
        'Coordinate finishes and FF&E with accurate visual reference',
        'Communicate design intent clearly to contractors',
        'Create compelling presentations for board approval',
        'Build excitement with photorealistic marketing materials',
      ],
    },
    faq: [
      {
        question: 'What\'s the difference between rendering and visualization?',
        answer: 'The terms are often used interchangeably. Rendering is the technical process of creating images from 3D models. Visualization is the broader service including modeling, rendering, and sometimes animation—the complete process of bringing designs to life visually.',
      },
      {
        question: 'How long does it take to create visualizations?',
        answer: 'Timeline depends on project complexity and number of views. Typically, we deliver initial renders within 1-2 weeks. More complex projects with multiple spaces or VR walkthroughs take 3-4 weeks.',
      },
      {
        question: 'Can you create virtual reality walkthroughs?',
        answer: 'Yes, we create immersive VR experiences that let you walk through your space at 1:1 scale. This is especially valuable for large projects like hotels, offices, or restaurants where understanding spatial relationships is crucial.',
      },
    ],
  },

  'turnkey-solutions': {
    overview: {
      headline: 'Complete Project Delivery from Vision to Reality',
      description: 'Managing a design and construction project is complex, time-consuming, and requires coordinating multiple vendors and contractors. Our turnkey solutions handle everything—from initial concept through final installation—delivering your completed space ready for use.',
    },
    whyChooseUs: {
      title: 'The Turnkey Advantage',
      reasons: [
        {
          title: 'Single Point of Responsibility',
          description: 'No more coordinating between architects, designers, contractors, and suppliers. We manage everything, taking full responsibility for on-time, on-budget delivery of your complete project.',
        },
        {
          title: 'Seamless Execution',
          description: 'Because we control the entire process, design intent translates perfectly to built reality. No miscommunication between designers and builders—we speak the same language.',
        },
        {
          title: 'Time Savings',
          description: 'Turnkey projects move faster. We overlap design and procurement, pre-qualify contractors, and manage construction efficiently. Your project opens sooner with less hassle.',
        },
        {
          title: 'Cost Certainty',
          description: 'Fixed-price turnkey contracts eliminate budget surprises. You know the total cost upfront, with complete transparency on where every dirham is spent.',
        },
      ],
    },
    approach: {
      title: 'Our Turnkey Process',
      description: 'Delivering turnkey projects requires tight integration between design, procurement, and construction. Our proven process ensures smooth execution.',
      methodology: [
        'Comprehensive design development and documentation',
        'Detailed cost estimation and value engineering',
        'Contractor pre-qualification and competitive bidding',
        'Procurement of all FF&E, finishes, and equipment',
        'Construction management and quality control',
        'Regular progress reporting and budget tracking',
        'Final installation and styling',
        'Post-completion support and warranty management',
      ],
    },
    benefits: {
      title: 'Client Benefits',
      items: [
        'Peace of mind with single-source accountability',
        'Faster project completion through efficient coordination',
        'Budget certainty with fixed-price contracts',
        'Superior quality with design-build integration',
        'Reduced client time commitment—we handle the details',
        'Design intent preserved through to final execution',
        'Streamlined communication and decision-making',
        'Warranty coverage for entire project scope',
      ],
    },
    faq: [
      {
        question: 'What does "turnkey" actually include?',
        answer: 'Everything needed for a ready-to-use space: design, permits, construction, finishes, furniture, lighting, accessories, artwork installation—even plants. We hand you the keys to a complete, styled, functioning space.',
      },
      {
        question: 'How is pricing structured for turnkey projects?',
        answer: 'After initial design concepts are approved, we provide a detailed fixed-price proposal covering all costs. This includes design fees, construction, FF&E, and project management. You know the total investment upfront.',
      },
      {
        question: 'Can I choose specific contractors or suppliers?',
        answer: 'Yes, if you have preferred vendors, we can integrate them into the project team. However, we typically recommend our pre-qualified partners who we know deliver quality on time and budget.',
      },
      {
        question: 'What happens if I want to make changes during construction?',
        answer: 'Change requests are normal. We provide quick cost and schedule impact analysis for any requested changes, get your approval, and integrate them smoothly into the project timeline.',
      },
    ],
  },

  'project-management': {
    overview: {
      headline: 'Expert Oversight Ensuring Your Design Vision Becomes Reality',
      description: 'Already have a design but need expert management through construction? Our project management services ensure your vision is executed flawlessly, on time, and on budget. We bring order to construction chaos, advocate for quality, and handle the countless details that make or break a project.',
    },
    whyChooseUs: {
      title: 'Why Hire Us to Manage Your Project',
      reasons: [
        {
          title: 'Design Protection',
          description: 'Contractors often make substitutions or changes that compromise design intent. We vigilantly protect your design vision, ensuring what was drawn gets built exactly as intended.',
        },
        {
          title: 'Quality Advocacy',
          description: 'We\'re your quality representative on site, inspecting workmanship, verifying materials, and ensuring standards are met. Our presence raises contractor performance.',
        },
        {
          title: 'Budget Management',
          description: 'We review all costs, prevent contractor overcharges, manage change orders fairly, and keep projects on budget through active cost control.',
        },
        {
          title: 'Schedule Control',
          description: 'Construction delays cost money and opportunity. We develop realistic schedules, monitor progress daily, and address issues before they impact completion dates.',
        },
      ],
    },
    approach: {
      title: 'Our Project Management Methodology',
      description: 'Successful construction requires proactive management, clear communication, and attention to detail. Our systematic approach delivers projects that meet expectations.',
      methodology: [
        'Pre-construction planning and contractor onboarding',
        'Detailed project schedule development and tracking',
        'Budget management and cost control processes',
        'Weekly site inspections and progress monitoring',
        'Quality control inspections at key milestones',
        'Coordination of all trades and suppliers',
        'Change order management and documentation',
        'Regular client reporting and communication',
        'Final punch-list management and project closeout',
      ],
    },
    benefits: {
      title: 'Client Advantages',
      items: [
        'Peace of mind knowing experts are protecting your interests',
        'Better quality through professional oversight and inspection',
        'On-time completion with proactive schedule management',
        'Budget protection through cost control and change order management',
        'Design intent preserved through construction',
        'Time savings—we handle contractor coordination and site visits',
        'Reduced project risk and fewer construction problems',
        'Complete documentation for warranty and maintenance',
      ],
    },
    faq: [
      {
        question: 'When should I hire a project manager?',
        answer: 'Ideally during or immediately after design completion, before construction bidding. Early involvement allows us to review designs for constructability, assist with contractor selection, and establish clear project expectations.',
      },
      {
        question: 'Do I still need to be involved if you\'re managing the project?',
        answer: 'Yes, but minimally. We handle day-to-day coordination and problems, but you\'ll need to make decisions on selections, approve changes, and review progress. We streamline your involvement to key decisions only.',
      },
      {
        question: 'How do you charge for project management services?',
        answer: 'We typically charge a percentage of construction cost (usually 5-10% depending on project complexity) or a fixed fee for defined scope. We can discuss the best approach for your specific project.',
      },
      {
        question: 'What if problems arise during construction?',
        answer: 'Construction issues are normal—our job is identifying and resolving them quickly. We assess problems, develop solutions, manage contractor resolution, and keep you informed throughout.',
      },
    ],
  },

  'custom-furniture': {
    overview: {
      headline: 'Bespoke Furniture Design That Defines Your Space',
      description: 'Off-the-shelf furniture can never capture your exact vision or fit your unique space perfectly. Our custom furniture design service creates one-of-a-kind pieces tailored to your specific needs, style preferences, and spatial requirements. From statement pieces to complete furnishing packages, we design and manufacture furniture that\'s unmistakably yours.',
    },
    whyChooseUs: {
      title: 'Why Commission Custom Furniture',
      reasons: [
        {
          title: 'Perfect Fit',
          description: 'Custom furniture maximizes your space efficiency. We design to exact dimensions, work around architectural features, and create solutions impossible with standard furniture.',
        },
        {
          title: 'Unique Design',
          description: 'Your furniture should be as individual as you are. We create original designs that reflect your personality and complement your interior design perfectly.',
        },
        {
          title: 'Superior Quality',
          description: 'Custom furniture is built to last. We use premium materials, traditional joinery techniques, and skilled craftsmanship that far exceeds mass-produced alternatives.',
        },
        {
          title: 'Design Cohesion',
          description: 'Custom pieces integrate seamlessly with your overall design scheme. Materials, proportions, and details are coordinated for perfect harmony.',
        },
      ],
    },
    approach: {
      title: 'Our Furniture Design Process',
      description: 'Creating custom furniture is a collaborative journey from concept sketches to finished pieces installed in your space.',
      methodology: [
        'Detailed consultation on functional needs and aesthetic preferences',
        'Conceptual design sketches and mood boards',
        'Technical drawings and 3D visualization',
        'Material and finish selection from our curated library',
        'Prototype or sample review for key pieces',
        'Manufacturing supervision ensuring quality standards',
        'White-glove delivery and professional installation',
        'Final styling and placement in your space',
      ],
    },
    benefits: {
      title: 'Custom Furniture Benefits',
      items: [
        'Furniture that fits your space and needs exactly',
        'Exclusive designs you won\'t see elsewhere',
        'Heirloom quality that lasts generations',
        'Perfect material and finish matches to your design',
        'Functional solutions to unique spatial challenges',
        'Investment pieces that retain value',
        'Pride of ownership in bespoke craftsmanship',
        'Coordinated design from a single creative vision',
      ],
    },
    faq: [
      {
        question: 'How long does custom furniture take?',
        answer: 'Timeline varies by complexity. Simple pieces like dining tables might take 6-8 weeks. Complex items like upholstered sofas or detailed millwork can take 10-14 weeks. We provide specific timelines for each piece.',
      },
      {
        question: 'Is custom furniture more expensive than retail?',
        answer: 'Custom furniture represents better value than premium retail. You get perfect fit, superior quality, and unique design. While initial cost may be higher than mass-produced furniture, the longevity and quality justify the investment.',
      },
      {
        question: 'Can you replicate or modify existing furniture designs?',
        answer: 'We can create pieces inspired by existing furniture with modifications for your needs, materials, or dimensions. However, we focus on original designs that are unique to you.',
      },
      {
        question: 'Do you manufacture locally or internationally?',
        answer: 'We work with skilled craftspeople both locally in the UAE and internationally in Italy, Portugal, and Asia. Manufacturing location depends on the piece type, required skills, and materials—we choose the best craftspeople for each project.',
      },
    ],
  },

  architecture: {
    overview: {
      headline: 'Architectural Design That Shapes Extraordinary Spaces',
      description: 'Architecture is the foundation of great design. Whether you\'re building new or transforming existing structures, our architectural services create spaces that are beautiful, functional, and timeless. We don\'t just design buildings—we craft experiences, solve problems, and create value through thoughtful architectural design.',
    },
    whyChooseUs: {
      title: 'Our Architectural Approach',
      reasons: [
        {
          title: 'Contextual Design',
          description: 'Great architecture responds to its context—climate, culture, site conditions, and surroundings. We design buildings that belong to their place while making bold statements.',
        },
        {
          title: 'Functional Excellence',
          description: 'Beauty without functionality is sculpture. Our buildings work perfectly for their intended use, with efficient layouts, optimal circulation, and spaces that adapt to changing needs.',
        },
        {
          title: 'Sustainable Thinking',
          description: 'Sustainable architecture isn\'t a trend—it\'s responsible design. We integrate passive strategies, energy efficiency, and environmental sensitivity without compromising aesthetics.',
        },
        {
          title: 'Design Integration',
          description: 'Having architecture and interiors from the same design team ensures perfect integration. Spaces flow seamlessly, systems coordinate efficiently, and vision remains consistent.',
        },
      ],
    },
    approach: {
      title: 'Our Architectural Process',
      description: 'Architectural projects require careful planning, technical expertise, and creative vision. Our process delivers buildings that delight and perform.',
      methodology: [
        'Site analysis and programming',
        'Conceptual design and massing studies',
        'Schematic design development',
        'Design development and system coordination',
        'Construction documentation',
        'Authority approval and permitting',
        'Construction administration',
        'Post-occupancy evaluation',
      ],
    },
    benefits: {
      title: 'Project Benefits',
      items: [
        'Buildings that enhance property value',
        'Functional spaces optimized for their use',
        'Energy-efficient, sustainable design',
        'Regulatory compliance and authority approval',
        'Coordinated architecture and interior design',
        'Timeless aesthetics that age well',
        'Flexible spaces that adapt to change',
        'Pride of ownership in distinctive architecture',
      ],
    },
    faq: [
      {
        question: 'Do you do both commercial and residential architecture?',
        answer: 'Yes, we design across sectors including commercial offices, retail, hospitality, healthcare, and residential from villas to multi-unit developments. Each building type requires specialized knowledge that our team possesses.',
      },
      {
        question: 'Can you work on renovation and addition projects?',
        answer: 'Absolutely. Many of our projects involve renovating, expanding, or adaptive reuse of existing buildings. Working with existing structures requires special skills and creativity that we bring to every project.',
      },
      {
        question: 'How do you handle authority approvals and permits?',
        answer: 'We manage the entire approval process including municipality submissions, consultations with authorities, and coordination with specialized consultants (MEP, structural, etc.). We ensure designs meet all codes and regulations.',
      },
    ],
  },

  'interior-design': {
    overview: {
      headline: 'Interior Design That Transforms Spaces into Experiences',
      description: 'Interior design is where architecture meets life. It\'s the difference between a building and a home, an office and a workplace, a hotel and a destination. Our interior design services transform ordinary spaces into extraordinary environments that inspire, function beautifully, and stand the test of time.',
    },
    whyChooseUs: {
      title: 'Why Choose Mouhajer for Interior Design',
      reasons: [
        {
          title: 'Award-Winning Design',
          description: 'Our work has been recognized internationally for design excellence. We bring creativity, technical expertise, and proven results to every project regardless of size.',
        },
        {
          title: 'Full-Service Capability',
          description: 'From concept through installation, we handle everything. Space planning, custom furniture, lighting design, art curation, styling—complete end-to-end service.',
        },
        {
          title: 'Material Mastery',
          description: 'Our extensive material library and global supplier relationships give you access to the finest finishes, fabrics, and furnishings. We source what others can\'t.',
        },
        {
          title: 'Timeless Approach',
          description: 'We design spaces that transcend trends, combining classic principles with contemporary expression. Our interiors remain relevant and beautiful for years.',
        },
      ],
    },
    approach: {
      title: 'Our Design Process',
      description: 'Great interior design requires understanding people, space, and purpose. Our collaborative process ensures results that exceed expectations.',
      methodology: [
        'Discovery consultation and brief development',
        'Space planning and functional layout',
        'Concept design and mood board development',
        'Material and finish selection',
        'Custom furniture and millwork design',
        'Lighting design and specification',
        'FF&E procurement and coordination',
        'Installation supervision and styling',
      ],
    },
    benefits: {
      title: 'Design Benefits',
      items: [
        'Spaces that reflect your identity and values',
        'Functional layouts optimized for how you live or work',
        'Distinctive interiors that impress and inspire',
        'Coordinated design from a single creative vision',
        'Access to exclusive materials and furnishings',
        'Value-engineered solutions maximizing budget impact',
        'Professional project management and quality control',
        'Timeless design that maintains relevance and value',
      ],
    },
    faq: [
      {
        question: 'Do you charge for initial consultations?',
        answer: 'Initial consultations are complimentary. We meet to understand your project, discuss your vision, explain our process, and provide preliminary recommendations. This allows us both to determine if we\'re a good fit.',
      },
      {
        question: 'How are design fees structured?',
        answer: 'We offer flexible fee structures including fixed fees, hourly rates, or percentage of project cost depending on project scope and complexity. We discuss options and recommend the best approach for your specific project.',
      },
      {
        question: 'Can you work with my existing furniture?',
        answer: 'Yes, we often integrate existing pieces clients love into new designs. We assess what works, recommend what to keep, and design new elements that complement and enhance your existing furniture and art.',
      },
      {
        question: 'Do you work on projects outside Dubai?',
        answer: 'Yes, we work throughout the UAE, GCC, and internationally. For projects outside Dubai, we assess scope and confirm our ability to provide the same level of service and quality control.',
      },
    ],
  },
};

export function getServiceContent(slug: string): ServiceContent | undefined {
  return serviceContentData[slug];
}
