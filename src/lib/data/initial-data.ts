import { 
  Event, 
  TicketTier, 
  OrganizerCompany, 
  User, 
  Order, 
  PromoterProfile, 
  PromoCode, 
  CheckInLog, 
  SettlementRecord, 
  AdminAuditLog 
} from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex.chen@gatezero.in',
    phone: '+91 98201 44520',
    role: 'customer',
    city: 'Mumbai',
    savedEventIds: ['ev_steelworks', 'ev_offgrid_goa', 'ev_fifth_room'],
    followedOrganizerIds: ['org_subkulture', 'org_anomaly'],
    createdAt: '2026-01-15T10:00:00Z',
    isVerified: true
  },
  {
    id: 'user_karan',
    name: 'Karan Mehra',
    email: 'karan@subkulture.in',
    phone: '+91 98110 33219',
    role: 'organizer',
    city: 'Mumbai',
    savedEventIds: [],
    followedOrganizerIds: [],
    organizerCompanyId: 'org_subkulture',
    createdAt: '2025-11-20T08:30:00Z',
    isVerified: true
  },
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.affiliate@gatezero.in',
    phone: '+91 99302 88471',
    role: 'promoter',
    city: 'Delhi',
    savedEventIds: ['ev_khaos_delhi'],
    followedOrganizerIds: ['org_subkulture', 'org_darkroom'],
    promoterCode: 'PRIYA_SCENE',
    createdAt: '2026-02-01T11:20:00Z',
    isVerified: true
  },
  {
    id: 'user_staff_reay',
    name: 'Rajesh Shinde (Door Lead)',
    email: 'staff.reayroad@gatezero.in',
    phone: '+91 97690 12890',
    role: 'door_staff',
    city: 'Mumbai',
    savedEventIds: [],
    followedOrganizerIds: [],
    createdAt: '2026-02-10T14:00:00Z',
    isVerified: true
  },
  {
    id: 'user_super_admin',
    name: 'Dev Malik (Chief Controller)',
    email: 'admin@gatezero.in',
    phone: '+91 98200 00000',
    role: 'super_admin',
    city: 'Mumbai',
    savedEventIds: [],
    followedOrganizerIds: [],
    createdAt: '2025-09-01T00:00:00Z',
    isVerified: true
  }
];

export const INITIAL_ORGANIZERS: OrganizerCompany[] = [
  {
    id: 'org_subkulture',
    slug: 'subkulture-india',
    name: 'SubKulture India',
    tagline: 'Architects of India’s Industrial & Warehouse Sound',
    description: 'Pioneering heavy industrial techno, modular synthesis, and raw warehouse experiences across Mumbai, Bengaluru, and Berlin. Curating safe, boundary-pushing audio-visual environments since 2021.',
    logoUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1200&auto=format&fit=crop',
    isVerified: true,
    verifiedAt: '2025-12-01T00:00:00Z',
    city: 'Mumbai',
    country: 'India',
    website: 'https://subkulture.in',
    instagram: '@subkulture_in',
    email: 'contact@subkulture.in',
    phone: '+91 98110 33219',
    followersCount: 18450,
    totalEventsHosted: 48,
    rating: 4.96,
    totalReviews: 890,
    categories: ['underground', 'music', 'nightlife'],
    kycStatus: 'verified',
    gstin: '27AABCS1429M1ZB',
    panNumber: 'AABCS1429M',
    bankDetails: {
      accountName: 'SUBKULTURE EXPERIENCES LLP',
      accountNumber: '50200049281920',
      ifscCode: 'HDFC0000128',
      bankName: 'HDFC Bank, Fort Branch Mumbai'
    },
    teamMembers: [
      { userId: 'user_karan', name: 'Karan Mehra', email: 'karan@subkulture.in', role: 'owner' },
      { userId: 'user_staff_reay', name: 'Rajesh Shinde', email: 'staff.reayroad@gatezero.in', role: 'door_staff' }
    ]
  },
  {
    id: 'org_anomaly',
    slug: 'anomaly-sound-labs',
    name: 'Anomaly Sound Labs',
    tagline: 'Immersive Audiovisual & Spatial Sound Systems',
    description: 'Bengaluru-based sonic laboratory pushing experimental electronics, ambient drone, quadraphonic soundscapes, and hardware synthesizer showcases.',
    logoUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=300&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    isVerified: true,
    verifiedAt: '2026-01-10T00:00:00Z',
    city: 'Bengaluru',
    country: 'India',
    website: 'https://anomalysound.in',
    instagram: '@anomalysoundlabs',
    email: 'lab@anomalysound.in',
    phone: '+91 98450 77123',
    followersCount: 12200,
    totalEventsHosted: 31,
    rating: 4.92,
    totalReviews: 540,
    categories: ['music', 'underground', 'workshops'],
    kycStatus: 'verified',
    gstin: '29AAACA9921K1ZW',
    panNumber: 'AAACA9921K',
    bankDetails: {
      accountName: 'ANOMALY AUDIO PRIVATE LIMITED',
      accountNumber: '91802004819201',
      ifscCode: 'ICIC0000002',
      bankName: 'ICICI Bank, MG Road Bengaluru'
    },
    teamMembers: [
      { userId: 'user_anomaly_owner', name: 'Nikhil Roy', email: 'nikhil@anomalysound.in', role: 'owner' }
    ]
  },
  {
    id: 'org_offgrid',
    slug: 'offgrid-collective',
    name: 'OFF/GRID Collective',
    tagline: 'Coastal Multi-Day Sound & Art Expeditions',
    description: 'Curating open-air coastal gatherings, sunset rituals, and avant-garde art installations on Goa’s northern shores.',
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
    isVerified: true,
    verifiedAt: '2025-10-14T00:00:00Z',
    city: 'Goa',
    country: 'India',
    website: 'https://offgridgoa.in',
    instagram: '@offgrid_goa',
    email: 'crew@offgridgoa.in',
    phone: '+91 83224 59102',
    followersCount: 29800,
    totalEventsHosted: 19,
    rating: 4.98,
    totalReviews: 1420,
    categories: ['festivals', 'music', 'art_culture'],
    kycStatus: 'verified',
    gstin: '30AACCO4921P1Z9',
    panNumber: 'AACCO4921P',
    teamMembers: [
      { userId: 'user_offgrid_lead', name: 'Maya D’Souza', email: 'maya@offgridgoa.in', role: 'owner' }
    ]
  },
  {
    id: 'org_darkroom',
    slug: 'darkroom-media',
    name: 'DarkRoom Media & Culture',
    tagline: 'Brutalist Design, Visual Arts & Bass Dispatches',
    description: 'A multidisciplinary collective staging underground exhibitions, late-night typography installations, and cutting-edge bass gatherings in industrial Delhi.',
    logoUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
    isVerified: true,
    verifiedAt: '2026-01-20T00:00:00Z',
    city: 'Delhi',
    country: 'India',
    website: 'https://darkroom.media',
    instagram: '@darkroom_media',
    email: 'info@darkroom.media',
    phone: '+91 98101 22849',
    followersCount: 15400,
    totalEventsHosted: 24,
    rating: 4.88,
    totalReviews: 410,
    categories: ['art_culture', 'nightlife', 'fashion'],
    kycStatus: 'verified',
    teamMembers: [
      { userId: 'user_darkroom_owner', name: 'Arjun Bhasin', email: 'arjun@darkroom.media', role: 'owner' }
    ]
  },
  {
    id: 'org_indiepunch',
    slug: 'indiepunch-studios',
    name: 'IndiePunch Studios',
    tagline: 'Late Night Comedy, Spoken Word & Raw Dialogues',
    description: 'The underground home of unfiltered standup comedy, intimate storytelling, and intellectual roasts across Mumbai & Pune.',
    logoUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=300&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1200&auto=format&fit=crop',
    isVerified: true,
    verifiedAt: '2026-02-05T00:00:00Z',
    city: 'Mumbai',
    country: 'India',
    website: 'https://indiepunch.live',
    instagram: '@indiepunchlive',
    email: 'contact@indiepunch.live',
    phone: '+91 98204 90112',
    followersCount: 8900,
    totalEventsHosted: 62,
    rating: 4.85,
    totalReviews: 690,
    categories: ['comedy', 'art_culture'],
    kycStatus: 'verified',
    teamMembers: [
      { userId: 'user_indiepunch_lead', name: 'Rohan Gupta', email: 'rohan@indiepunch.live', role: 'owner' }
    ]
  }
];

export const INITIAL_EVENTS: Event[] = [
  {
    id: 'ev_steelworks',
    code: 'GZ-MUM-001',
    slug: 'steelworks-after-dark',
    title: 'Steelworks: After Dark',
    tagline: 'Raw Industrial Techno & Modular Visuals inside a Disused Forging Mill',
    description: `Enter the steelworks. A 12-hour relentless industrial techno assembly featuring modular live rigs, monolithic Funktion-One sound, and 360-degree laser architectural mapping.

Strict no-photo policy enforced. Camera stickers provided at the gate. Zero tolerance for harassment or discrimination. Enter with an open mind and prepare for total sonic immersion.

Doors open at 21:00 IST. Strict entry cutoff at 00:30. Water stations, chillout container yard, and medical response team on site.`,
    category: 'underground',
    subcategory: 'Industrial Techno & Dark Modular',
    tags: ['Techno', 'Industrial', 'Warehouse', 'Funktion-One', 'Secret Location', 'Mumbai Nightlife'],
    format: 'warehouse',
    status: 'published',
    isFeatured: true,
    isTrending: true,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1600&auto=format&fit=crop',
    galleryUrls: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop'
    ],
    
    startDate: '2026-09-05T21:00:00+05:30',
    endDate: '2026-09-06T08:00:00+05:30',
    doorsOpenTime: '21:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Mumbai',
    venueName: 'The Mill Compound / Secret Industrial Shed',
    venueAddress: 'Reay Road East, Industrial Docklands, Mumbai 400010',
    coordinates: {
      lat: 18.9744,
      lng: 72.8488
    },
    secretLocationInstructions: 'Exact gate coordinates and entry password will be dispatched via WhatsApp/SMS to confirmed pass holders 4 hours before doors open.',
    
    ageRestriction: '21+',
    dressCode: 'All-black industrial, tactical, or avant-garde. High heels strictly discouraged due to textured steel floor.',
    phonePolicy: 'Strict no-photography policy. Camera lenses sealed with acid-lime tamper tape at security control.',
    entryRules: [
      'Original Govt ID (Aadhaar/Passport/Driving License) mandatory at check-in.',
      'No entry without valid Gate Zero QR pass.',
      'Strict entry cutoff at 00:30 midnight.',
      'Right of admission reserved. Any breach of safe space policy results in immediate ejection without refund.'
    ],
    parkingInfo: 'Valet strictly unavailable. Use public transit (Reay Road Station 400m) or ride-sharing cabs.',
    accessibilityInfo: 'Ground floor warehouse with ramp access. Dedicated low-sensory rest zone in container sector.',
    safetyInfo: 'Licensed paramedics, free electrolyte hydration stations, and security personnel stationed at all perimeter gates.',
    refundPolicyText: 'Refundable up to 72 hours before doors open. Non-refundable within 72 hours of event start.',
    
    organizerId: 'org_subkulture',
    organizerName: 'SubKulture India',
    organizerLogo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'subkulture-india',
    
    lineup: [
      { id: 'art_1', name: 'KASST [Live Berlin]', role: 'Headliner / Modular Live', setTime: '01:30 - 04:30', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_2', name: 'NØID (IN)', role: 'Direct Support / Hypnotic Techno', setTime: '23:30 - 01:30', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_3', name: 'VALV (Modular Live)', role: 'Opening Ritual', setTime: '21:00 - 23:30', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_4', name: 'KROM [Visuals]', role: 'Live Laser Architecture', setTime: 'All Night', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop' }
    ],
    schedule: [
      { time: '21:00', title: 'Gate Access Opens // Soundcheck Ritual', stage: 'Main Shed' },
      { time: '23:30', title: 'Phase II // Hypnotic Acceleration', stage: 'Main Shed' },
      { time: '01:30', title: 'KASST Headline Modular Live 3-Hour Descent', stage: 'Main Shed' },
      { time: '04:30', title: 'Closing Horizon // Industrial Ambient & Hardgroove', stage: 'Main Shed' },
      { time: '08:00', title: 'Curfew & Exit Protocol', stage: 'Main Shed' }
    ],
    faqs: [
      { question: 'What is the dress code?', answer: 'We encourage utilitarian, black, architectural, or expressive apparel. Comfortable footwear is essential.' },
      { question: 'Will there be food and alcohol?', answer: 'Craft beers, botanical cocktails, and a late-night artisanal food pop-up will operate until 05:00.' },
      { question: 'Can I transfer my ticket to a friend?', answer: 'Yes! Tickets can be transferred 1-click directly inside your Gate Zero ticket wallet up to 6 hours before showtime.' }
    ],
    customQuestions: [
      { id: 'q_emergency', question: 'Emergency Contact Number', type: 'text', required: true },
      { id: 'q_age_confirm', question: 'Confirm you are 21 years of age or older', type: 'checkbox', required: true }
    ],
    
    viewsCount: 14280,
    savedCount: 2190,
    totalCapacity: 850,
    totalTicketsSold: 712,
    minPrice: 1499,
    maxPrice: 4499,
    
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z'
  },
  {
    id: 'ev_fifth_room',
    code: 'GZ-BLR-002',
    slug: 'the-fifth-room-sonic-lab',
    title: 'The Fifth Room: Immersive Sonic Lab',
    tagline: '32-Channel Spatial Audio, Modular Synthesizers & Reactive Lighting',
    description: `A boundary-dissolving encounter with sound in three dimensions. The Fifth Room transforms an acoustic hangar in Indiranagar into an experimental spatial dome.

Artists perform in the round on hardware analog synthesizers, routing quadraphonic and ambisonic frequencies through our custom 32-speaker array.

Experience the visceral physical weight of deep sub-bass frequencies and ethereal spatial textures.`,
    category: 'music',
    subcategory: 'Spatial Sound & Modular Electronics',
    tags: ['Spatial Audio', 'Modular Synth', 'Bengaluru', 'Ambient', 'Experimental', 'Audiophile'],
    format: 'physical',
    status: 'published',
    isFeatured: true,
    isTrending: true,
    isSellingFast: false,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-12T19:30:00+05:30',
    endDate: '2026-09-13T01:30:00+05:30',
    doorsOpenTime: '19:30 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Bengaluru',
    venueName: 'The Acoustic Hangar // Indiranagar Stage 2',
    venueAddress: '100 Feet Road, 2nd Stage, Indiranagar, Bengaluru 560038',
    coordinates: {
      lat: 12.9784,
      lng: 77.6408
    },
    
    ageRestriction: '18+',
    dressCode: 'Smart casual / Creative attire.',
    phonePolicy: 'Silent mode requested during spatial acoustic sets. Photography allowed without flash.',
    refundPolicyText: 'Refundable up to 48 hours prior to start.',
    
    organizerId: 'org_anomaly',
    organizerName: 'Anomaly Sound Labs',
    organizerLogo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'anomaly-sound-labs',
    
    lineup: [
      { id: 'art_201', name: 'CYLINDER (Tokyo / Live)', role: 'Spatial Modular Set', setTime: '22:00 - 00:00', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_202', name: 'AAVARTAN', role: 'Granular Synthesizer Exploration', setTime: '20:30 - 22:00', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop' }
    ],
    schedule: [
      { time: '19:30', title: 'Doors Open // Spatial Ambient Tuning', stage: 'Dome' },
      { time: '20:30', title: 'AAVARTAN: Granular Synthesis Live', stage: 'Dome' },
      { time: '22:00', title: 'CYLINDER 32-Channel Ambisonic Experience', stage: 'Dome' },
      { time: '00:00', title: 'Open Hardware Jam & Artist Q&A', stage: 'Dome' }
    ],
    faqs: [
      { question: 'Is seating provided?', answer: 'Yes, ergonomic floor cushions and tiered seating are available on a first-come, first-served basis.' }
    ],
    
    viewsCount: 9420,
    savedCount: 1680,
    totalCapacity: 350,
    totalTicketsSold: 284,
    minPrice: 999,
    maxPrice: 2499,
    
    createdAt: '2026-07-10T12:00:00Z',
    updatedAt: '2026-08-25T14:00:00Z'
  },
  {
    id: 'ev_offgrid_goa',
    code: 'GZ-GOA-003',
    slug: 'off-grid-goa-festival-2026',
    title: 'OFF/GRID Goa: 3-Day Coastal Festival',
    tagline: 'Sunset to Sunrise Electronic Gathering on the Red Cliffs of Vagator',
    description: `Three days of uninterrupted underground electronic music, kinetic stage design, ocean breeze, and cultural connection.

Featuring 3 stages: The Monolith (Mainstage Heavy Techno & House), The Cove (Downbeat, Ambient & Dub), and The Forest (Psychedelic & Hypnotic Grooves).

Full eco-conscious infrastructure, artisan food markets, wellness programming, and 48 hours of curated world-class sound.`,
    category: 'festivals',
    subcategory: '3-Day Music & Art Gathering',
    tags: ['Goa Festival', 'Vagator', 'Open Air', 'Techno', 'House', 'Sunset', 'Multi-day Pass'],
    format: 'outdoor',
    status: 'published',
    isFeatured: true,
    isTrending: true,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#FF314A',
    
    posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-10-02T16:00:00+05:30',
    endDate: '2026-10-05T06:00:00+05:30',
    doorsOpenTime: '16:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Goa',
    venueName: 'The Red Cliffs Sanctuary // Vagator Beach',
    venueAddress: 'Vagator Beach Road, Anjuna / Vagator, North Goa 403509',
    coordinates: {
      lat: 15.6015,
      lng: 73.7389
    },
    
    ageRestriction: '21+',
    dressCode: 'Bohemian / Coastal Cyberpunk / Swimwear & Lightweight Linens.',
    phonePolicy: 'Photography permitted. Respect crowd privacy.',
    refundPolicyText: 'Refundable up to 7 days before festival gates open.',
    
    organizerId: 'org_offgrid',
    organizerName: 'OFF/GRID Collective',
    organizerLogo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'offgrid-collective',
    
    lineup: [
      { id: 'art_301', name: 'TALE OF MIRRORS', role: 'Headliner (Melodic Techno)', setTime: 'Sat 02:00 - 05:30', imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_302', name: 'DESERT DRONE [Live]', role: 'Sunset Ceremony', setTime: 'Fri 17:30 - 20:00', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_303', name: 'SOUL SURFER', role: 'The Cove Stage Host', setTime: 'Sun All Day', imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop' }
    ],
    schedule: [
      { time: 'Fri 16:00', title: 'Gates Open // Ocean Sunset Welcome', stage: 'The Cove' },
      { time: 'Sat 18:00', title: 'Mainstage Monolith Ignition', stage: 'The Monolith' },
      { time: 'Sun 20:00', title: 'Grand Closing Ritual & Drone Fireworks', stage: 'The Monolith' }
    ],
    faqs: [
      { question: 'Is camping allowed on site?', answer: 'Luxury bell tents and eco-camps are available as add-ons after checkout.' },
      { question: 'What payment modes work at the festival bars?', answer: '100% cashless RFID wristbands top up with UPI, Credit Cards, or Apple Pay at all festival gate kiosks.' }
    ],
    
    viewsCount: 38920,
    savedCount: 5410,
    totalCapacity: 2500,
    totalTicketsSold: 1980,
    minPrice: 3499,
    maxPrice: 8999,
    
    createdAt: '2026-06-15T09:00:00Z',
    updatedAt: '2026-08-27T18:00:00Z'
  },
  {
    id: 'ev_khaos_delhi',
    code: 'GZ-DEL-004',
    slug: 'khaos-delhi-brutalist-bass',
    title: 'KHAOS Delhi: Brutalist Design & Bass',
    tagline: 'Heavy Low-End Frequencies & Concrete Architecture in Chhatarpur',
    description: `A synthesis of brutalist physical structures, stark typography installations, and unrelenting low-end bass music (Dubstep, Drum & Bass, UK Garage, and Footwork).

Held inside an open-air concrete courtyard at Dhan Mill Compound. Featuring custom sub-bass towers and audio-reactive projection mapping.`,
    category: 'art_culture',
    subcategory: 'Bass Music & Visual Arts',
    tags: ['Bass', 'DnB', 'UKG', 'Delhi Nightlife', 'Design Exhibition', 'Brutalist'],
    format: 'outdoor',
    status: 'published',
    isFeatured: true,
    isTrending: false,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-18T20:00:00+05:30',
    endDate: '2026-09-19T03:00:00+05:30',
    doorsOpenTime: '20:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Delhi',
    venueName: 'The Concrete Yard // Dhan Mill Compound',
    venueAddress: '100 Feet Road, SSN Marg, Chhatarpur, New Delhi 110074',
    coordinates: {
      lat: 28.5024,
      lng: 77.1729
    },
    
    ageRestriction: '18+',
    dressCode: 'Industrial streetwear, oversized silhouettes, dark tones.',
    refundPolicyText: 'Refundable up to 48 hours before event.',
    
    organizerId: 'org_darkroom',
    organizerName: 'DarkRoom Media & Culture',
    organizerLogo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'darkroom-media',
    
    lineup: [
      { id: 'art_401', name: 'SUB-ZERO SOUNDSYSTEM', role: 'Bassline & UK Garage 140', setTime: '23:30 - 02:00', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop' },
      { id: 'art_402', name: 'VOID RUNNER', role: 'Halftime Drum & Bass', setTime: '21:30 - 23:30', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' }
    ],
    schedule: [
      { time: '20:00', title: 'Brutalist Print Exhibition & Warm-up', stage: 'Courtyard' },
      { time: '21:30', title: 'VOID RUNNER: 170 BPM Halftime Set', stage: 'Main Yard' },
      { time: '23:30', title: 'SUB-ZERO: Sub-bass Assault', stage: 'Main Yard' }
    ],
    faqs: [
      { question: 'Is ear protection recommended?', answer: 'Yes! Complimentary high-fidelity acoustic earplugs will be handed out at the welcome console.' }
    ],
    
    viewsCount: 11200,
    savedCount: 1450,
    totalCapacity: 600,
    totalTicketsSold: 490,
    minPrice: 799,
    maxPrice: 1999,
    
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-08-26T10:00:00Z'
  },
  {
    id: 'ev_decibel_pune',
    code: 'GZ-PNE-005',
    slug: 'decibel-underground-pune',
    title: 'Decibel Underground: Warehouse Series',
    tagline: 'Hard Techno, Schranz & Acid inside Koregaon Park Industrial Lot',
    description: `High-octane BPMs, strobes, and pure acid energy. Decibel Underground brings fast, unapologetic European hard techno to Pune for an intense 8-hour session.`,
    category: 'underground',
    subcategory: 'Hard Techno & Acid',
    tags: ['Hard Techno', 'Acid', 'Pune', 'Warehouse', 'Nightlife'],
    format: 'warehouse',
    status: 'published',
    isFeatured: false,
    isTrending: true,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#FF314A',
    
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-26T21:00:00+05:30',
    endDate: '2026-09-27T05:00:00+05:30',
    doorsOpenTime: '21:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Pune',
    venueName: 'The High Voltage Lot // KP Industrial Zone',
    venueAddress: 'Lane 7, Koregaon Park North, Pune 411001',
    coordinates: {
      lat: 18.5362,
      lng: 73.8958
    },
    
    ageRestriction: '21+',
    refundPolicyText: 'Refundable up to 48 hours before start.',
    
    organizerId: 'org_subkulture',
    organizerName: 'SubKulture India',
    organizerLogo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'subkulture-india',
    
    lineup: [
      { id: 'art_501', name: 'HEXAGON ACID [Live 303]', role: 'Live Hardware Acid', setTime: '01:00 - 03:30' },
      { id: 'art_502', name: 'VALKYRIE', role: '150BPM Hard Techno', setTime: '22:30 - 01:00' }
    ],
    schedule: [
      { time: '21:00', title: 'Doors Open', stage: 'Main Floor' },
      { time: '22:30', title: 'VALKYRIE Fast Hardgroove', stage: 'Main Floor' },
      { time: '01:00', title: 'HEXAGON ACID Roland TB-303 Live Rig', stage: 'Main Floor' }
    ],
    faqs: [],
    
    viewsCount: 7800,
    savedCount: 920,
    totalCapacity: 500,
    totalTicketsSold: 410,
    minPrice: 899,
    maxPrice: 2199,
    
    createdAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-08-28T09:00:00Z'
  },
  {
    id: 'ev_unfiltered_comedy',
    code: 'GZ-MUM-006',
    slug: 'unfiltered-late-night-standup',
    title: 'Unfiltered: Late Night Stand-Up Showcase',
    tagline: 'Raw, Intimate & Uncensored Jokes in a Speakeasy Basement',
    description: `No camera recording, no sponsors, no political correctness. 5 of the sharpest comics in the country test their darkest and freshest material in an intimate 80-seat basement room.`,
    category: 'comedy',
    subcategory: 'Raw Stand-up & Dark Comedy',
    tags: ['Standup Comedy', 'Bandra', 'Intimate', 'Late Night', 'Mumbai'],
    format: 'physical',
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-04T22:30:00+05:30',
    endDate: '2026-09-05T00:30:00+05:30',
    doorsOpenTime: '22:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Mumbai',
    venueName: 'The Vault Basement // Bandra West',
    venueAddress: 'Hill Road, Near Mehboob Studio, Bandra West, Mumbai 400050',
    coordinates: {
      lat: 19.0544,
      lng: 72.8288
    },
    
    ageRestriction: '18+',
    refundPolicyText: 'Refundable up to 24 hours prior to showtime.',
    
    organizerId: 'org_indiepunch',
    organizerName: 'IndiePunch Studios',
    organizerLogo: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'indiepunch-studios',
    
    lineup: [
      { id: 'art_601', name: 'Secret Headliner (Amazon Special)', role: 'Headliner', setTime: '23:30 - 00:30' },
      { id: 'art_602', name: 'Kavya Rao', role: 'Support Comic', setTime: '22:45 - 23:15' },
      { id: 'art_603', name: 'Aditya Sen (Host)', role: 'MC / Host', setTime: '22:30' }
    ],
    schedule: [
      { time: '22:00', title: 'Bar Service & Seating', stage: 'Vault Stage' },
      { time: '22:30', title: 'Show Begins // No entry past 22:45', stage: 'Vault Stage' }
    ],
    faqs: [
      { question: 'Is seating guaranteed?', answer: 'Yes, all tickets include guaranteed table or amphitheater seating.' }
    ],
    
    viewsCount: 6540,
    savedCount: 810,
    totalCapacity: 85,
    totalTicketsSold: 78,
    minPrice: 499,
    maxPrice: 899,
    
    createdAt: '2026-08-01T15:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z'
  },
  {
    id: 'ev_synthex_workshop',
    code: 'GZ-BLR-007',
    slug: 'synthex-modular-synth-masterclass',
    title: 'SYNTHEX: Modular Synthesizer Workshop',
    tagline: 'Hands-on Eurorack Patching, Control Voltage & Sound Design',
    description: `A 6-hour deep dive into Eurorack modular synthesis, custom sound design, CV routing, filters, and generative sequencing.

Every participant receives access to an individual Eurorack demo rig supplied with Make Noise, Mutable Instruments, and Moog modules. Led by master audio engineers.`,
    category: 'workshops',
    subcategory: 'Hardware Electronics & Audio Production',
    tags: ['Workshop', 'Eurorack', 'Synthesizers', 'Music Production', 'Bengaluru'],
    format: 'physical',
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isSellingFast: false,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-20T11:00:00+05:30',
    endDate: '2026-09-20T17:00:00+05:30',
    doorsOpenTime: '10:30 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Bengaluru',
    venueName: 'Anomaly Lab 01 // Koramangala 4th Block',
    venueAddress: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    coordinates: {
      lat: 12.9352,
      lng: 77.6245
    },
    
    ageRestriction: 'All Ages',
    refundPolicyText: 'Refundable up to 5 days prior to workshop.',
    
    organizerId: 'org_anomaly',
    organizerName: 'Anomaly Sound Labs',
    organizerLogo: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'anomaly-sound-labs',
    
    lineup: [
      { id: 'art_701', name: 'Nikhil Roy (Lead Instructor)', role: 'Sound Designer / Hardware Specialist' }
    ],
    schedule: [
      { time: '11:00', title: 'Part 1: CV, Voltage Oscillators & Filter Topology', stage: 'Lab A' },
      { time: '13:30', title: 'Artisanal Lunch & Coffee Break', stage: 'Café' },
      { time: '14:30', title: 'Part 2: Generative Sequencing & Live Patch Jam', stage: 'Lab A' }
    ],
    faqs: [
      { question: 'Do I need prior synthesizer experience?', answer: 'No! The workshop begins with core fundamentals and moves progressively into hands-on patching.' }
    ],
    
    viewsCount: 4210,
    savedCount: 590,
    totalCapacity: 30,
    totalTicketsSold: 22,
    minPrice: 2999,
    maxPrice: 4999,
    
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-27T11:00:00Z'
  },
  {
    id: 'ev_future_culture_summit',
    code: 'GZ-MUM-008',
    slug: 'future-culture-summit-2026',
    title: 'Future Culture Summit 2026',
    tagline: 'Where AI, Independent Music, Fashion & Web3 Collide',
    description: `A 2-day conference bringing together 40+ culture founders, generative artists, independent label heads, and fashion disruptors from Asia and Europe. Keynotes, masterclasses, roundtables, and VIP evening networking mixers.`,
    category: 'conferences',
    subcategory: 'Creative Technology & Cultural Economy',
    tags: ['Conference', 'Culture Tech', 'AI Music', 'Fashion Tech', 'BKC', 'Mumbai'],
    format: 'physical',
    status: 'published',
    isFeatured: true,
    isTrending: false,
    isSellingFast: false,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-10-16T09:00:00+05:30',
    endDate: '2026-10-17T20:00:00+05:30',
    doorsOpenTime: '08:30 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Mumbai',
    venueName: 'The Nexus Pavilion // BKC',
    venueAddress: 'G Block, Bandra Kurla Complex, Mumbai 400051',
    coordinates: {
      lat: 19.0657,
      lng: 72.8687
    },
    
    ageRestriction: 'All Ages',
    refundPolicyText: 'Refundable up to 7 days before summit.',
    
    organizerId: 'org_subkulture',
    organizerName: 'SubKulture India',
    organizerLogo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'subkulture-india',
    
    lineup: [
      { id: 'art_801', name: 'Dr. Elena Vance (Tokyo)', role: 'Keynote: Generative Acoustics in 2030' },
      { id: 'art_802', name: 'Kavita Choksi', role: 'Panel: Monetizing Underground Scene IP' }
    ],
    schedule: [
      { time: '09:00', title: 'Registration & Welcome Keynote', stage: 'Main Auditorium' },
      { time: '14:00', title: 'Breakout Masterclasses', stage: 'Stage B' },
      { time: '18:00', title: 'Sunset Rooftop Networking Cocktail', stage: 'Sky Terrace' }
    ],
    faqs: [],
    
    viewsCount: 8900,
    savedCount: 1120,
    totalCapacity: 450,
    totalTicketsSold: 310,
    minPrice: 3999,
    maxPrice: 8500,
    
    createdAt: '2026-08-08T09:00:00Z',
    updatedAt: '2026-08-28T14:00:00Z'
  },
  {
    id: 'ev_blackout_session',
    code: 'GZ-MUM-009',
    slug: 'blackout-session-invite-only',
    title: 'Blackout Session: Private Rooftop',
    tagline: 'Private Invite-Only Listening & Analog Vinyl Session',
    description: `An unadvertised gathering of 60 selected listeners atop a heritage art deco rooftop in Colaba overlooking the Arabian Sea. Strict password required for access pass unlocking.`,
    category: 'invite_only',
    subcategory: 'Secret Vinyl Session',
    tags: ['Invite Only', 'Vinyl', 'Rooftop', 'Private', 'Colaba'],
    format: 'rooftop',
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isSellingFast: true,
    isVerifiedOrganizer: true,
    accentColor: '#D4F00D',
    
    posterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    coverBannerUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1600&auto=format&fit=crop',
    
    startDate: '2026-09-19T22:00:00+05:30',
    endDate: '2026-09-20T04:00:00+05:30',
    doorsOpenTime: '22:00 IST',
    timezone: 'IST (UTC+05:30)',
    
    city: 'Mumbai',
    venueName: 'The Colaba Lookout // Secret Address',
    venueAddress: 'Colaba Waterfront, Mumbai 400005',
    coordinates: {
      lat: 18.9067,
      lng: 72.8147
    },
    secretLocationInstructions: 'Access granted only with verified ticket hash and passcode.',
    
    ageRestriction: '21+',
    refundPolicyText: 'Non-refundable.',
    
    organizerId: 'org_subkulture',
    organizerName: 'SubKulture India',
    organizerLogo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
    organizerSlug: 'subkulture-india',
    
    lineup: [
      { id: 'art_901', name: 'MYSTERIA [Vinyl Only]', role: 'All Night Rare Grooves' }
    ],
    schedule: [
      { time: '22:00', title: 'Curated Vinyl Listening', stage: 'Sky Deck' }
    ],
    faqs: [],
    
    viewsCount: 3100,
    savedCount: 420,
    totalCapacity: 60,
    totalTicketsSold: 54,
    minPrice: 1999,
    maxPrice: 3499,
    
    createdAt: '2026-08-12T16:00:00Z',
    updatedAt: '2026-08-28T10:00:00Z'
  }
];

export const INITIAL_TICKET_TIERS: TicketTier[] = [
  // Steelworks: After Dark tiers
  {
    id: 'tier_steel_early',
    eventId: 'ev_steelworks',
    name: 'Early Access Pass',
    type: 'early_bird',
    price: 1499,
    originalPrice: 1999,
    totalQuantity: 150,
    soldQuantity: 150,
    reservedQuantity: 0,
    description: 'Guaranteed entry before 22:30. Includes 1 complimentary craft beverage.',
    perks: ['Entry before 22:30', '1x Welcome Drink', 'Queue bypass until 22:30'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-07-01T00:00:00Z',
    salesEndDate: '2026-08-01T00:00:00Z',
    entryValidity: 'Entry strictly before 22:30',
    refundEligibility: 'refundable_7d'
  },
  {
    id: 'tier_steel_p1',
    eventId: 'ev_steelworks',
    name: 'Phase 1 Access Pass',
    type: 'phase_1',
    price: 1899,
    originalPrice: 2299,
    totalQuantity: 250,
    soldQuantity: 250,
    reservedQuantity: 0,
    description: 'General admission pass. Valid for entry anytime before 00:30 midnight.',
    perks: ['Full all-night access', 'Access to Main Shed and Container Yard'],
    minPerOrder: 1,
    maxPerOrder: 6,
    salesStartDate: '2026-08-01T00:00:00Z',
    salesEndDate: '2026-08-20T00:00:00Z',
    entryValidity: 'Valid until 00:30 midnight',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_steel_p2',
    eventId: 'ev_steelworks',
    name: 'Phase 2 Access Pass (Current)',
    type: 'phase_2',
    price: 2299,
    originalPrice: 2699,
    totalQuantity: 300,
    soldQuantity: 258,
    reservedQuantity: 12,
    description: 'Current general admission tier. High demand — selling fast.',
    perks: ['Full all-night access', 'Express security lane'],
    minPerOrder: 1,
    maxPerOrder: 6,
    salesStartDate: '2026-08-20T00:00:00Z',
    salesEndDate: '2026-09-05T21:00:00Z',
    entryValidity: 'Valid all night',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_steel_vip',
    eventId: 'ev_steelworks',
    name: 'VIP / Backstage Industrial Deck',
    type: 'vip',
    price: 4499,
    totalQuantity: 100,
    soldQuantity: 54,
    reservedQuantity: 4,
    description: 'Elevated mezzanine viewing deck behind the modular booth, private bar, premium restrooms & 2 craft drinks included.',
    perks: ['Elevated DJ booth mezzanine', 'Private VIP bar & fast-track pass', '2x Premium Drinks', 'Dedicated luxury washrooms'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-07-15T00:00:00Z',
    salesEndDate: '2026-09-05T20:00:00Z',
    entryValidity: 'Valid all night',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_steel_secret',
    eventId: 'ev_steelworks',
    name: 'SubKulture Black Pass (Secret Tier)',
    type: 'invite_only',
    price: 3200,
    totalQuantity: 50,
    soldQuantity: 0,
    reservedQuantity: 0,
    description: 'Special access for SubKulture family and vinyl collectors. Unlock with secret code.',
    perks: ['Backstage access', 'Exclusive Gate Zero enamel pin', 'Limited edition poster signed by KASST'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-08-01T00:00:00Z',
    salesEndDate: '2026-09-05T20:00:00Z',
    entryValidity: 'Valid all night',
    isSecret: true,
    accessCode: 'VIPACCESS',
    refundEligibility: 'non_refundable'
  },

  // The Fifth Room tiers
  {
    id: 'tier_fifth_gen',
    eventId: 'ev_fifth_room',
    name: 'General Spatial Pass',
    type: 'general',
    price: 999,
    totalQuantity: 250,
    soldQuantity: 210,
    reservedQuantity: 0,
    description: 'Full immersive audio experience in the 32-channel dome.',
    perks: ['Access to spatial audio hangar', 'Ergonomic floor & amphitheater seating'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-07-10T00:00:00Z',
    salesEndDate: '2026-09-12T19:00:00Z',
    entryValidity: 'Entry before 20:30',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_fifth_vip',
    eventId: 'ev_fifth_room',
    name: 'Sweet-Spot VIP Listening Pod',
    type: 'vip',
    price: 2499,
    totalQuantity: 100,
    soldQuantity: 74,
    reservedQuantity: 2,
    description: 'Acoustically calibrated central listening zone with dedicated analog headphones & artist Q&A access.',
    perks: ['Calibrated acoustic center sweet-spot', 'Artist meet & gear breakdown', 'Complimentary craft beverage & snack'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-07-10T00:00:00Z',
    salesEndDate: '2026-09-12T19:00:00Z',
    entryValidity: 'All night',
    refundEligibility: 'refundable_48h'
  },

  // OFF/GRID Goa Festival tiers
  {
    id: 'tier_offgrid_ga3d',
    eventId: 'ev_offgrid_goa',
    name: '3-Day Full Festival Pass',
    type: 'general',
    price: 3499,
    originalPrice: 4200,
    totalQuantity: 1800,
    soldQuantity: 1540,
    reservedQuantity: 20,
    description: 'Full 3-day wristband access to all 3 stages, ocean access, and night performances.',
    perks: ['Access all 3 festival days', 'All 3 music stages', 'RFID wristband for cashless purchase'],
    minPerOrder: 1,
    maxPerOrder: 6,
    salesStartDate: '2026-06-15T00:00:00Z',
    salesEndDate: '2026-10-02T16:00:00Z',
    entryValidity: 'Valid Oct 2-5',
    refundEligibility: 'refundable_7d'
  },
  {
    id: 'tier_offgrid_vip',
    eventId: 'ev_offgrid_goa',
    name: '3-Day VIP Sunset Lounge & Backstage',
    type: 'vip',
    price: 8999,
    totalQuantity: 400,
    soldQuantity: 320,
    reservedQuantity: 10,
    description: 'Private clifftop infinity lounge, dedicated express bars, elevated stage viewing, luxury restrooms & festival welcome pack.',
    perks: ['Clifftop VIP lounge with sunset view', 'Fast track festival gate entry', 'Dedicated cocktail bar', 'Exclusive merchandise kit'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-06-15T00:00:00Z',
    salesEndDate: '2026-10-02T16:00:00Z',
    entryValidity: 'Valid Oct 2-5',
    refundEligibility: 'refundable_7d'
  },
  {
    id: 'tier_offgrid_group',
    eventId: 'ev_offgrid_goa',
    name: 'Squad Pass (4 People - 3 Days)',
    type: 'group',
    price: 11999,
    originalPrice: 13996,
    totalQuantity: 300,
    soldQuantity: 120,
    reservedQuantity: 4,
    description: 'Group bundle for 4 friends at a discounted rate. 3-day full access for 4 attendees.',
    perks: ['4x Full 3-day passes', 'Free festival merchandise pack', 'Dedicated squad check-in gate'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-07-01T00:00:00Z',
    salesEndDate: '2026-10-01T00:00:00Z',
    entryValidity: 'Valid Oct 2-5',
    refundEligibility: 'refundable_7d'
  },

  // KHAOS Delhi tiers
  {
    id: 'tier_khaos_gen',
    eventId: 'ev_khaos_delhi',
    name: 'General Admission',
    type: 'general',
    price: 799,
    totalQuantity: 450,
    soldQuantity: 390,
    reservedQuantity: 0,
    description: 'Entry to concrete courtyard, bass arena & art installations.',
    perks: ['All arena access', 'Free acoustic earplugs'],
    minPerOrder: 1,
    maxPerOrder: 6,
    salesStartDate: '2026-07-20T00:00:00Z',
    salesEndDate: '2026-09-18T20:00:00Z',
    entryValidity: 'Valid before 23:00',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_khaos_vip',
    eventId: 'ev_khaos_delhi',
    name: 'Deck Access & 2 Drinks',
    type: 'vip',
    price: 1999,
    totalQuantity: 150,
    soldQuantity: 100,
    reservedQuantity: 0,
    description: 'Elevated steel platform with prime bass audio calibration and 2 drink tokens.',
    perks: ['Mezzanine platform', '2x Drinks included', 'Fast track entry'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-07-20T00:00:00Z',
    salesEndDate: '2026-09-18T20:00:00Z',
    entryValidity: 'Valid all night',
    refundEligibility: 'refundable_48h'
  },

  // Decibel Pune tiers
  {
    id: 'tier_decibel_gen',
    eventId: 'ev_decibel_pune',
    name: 'Single Entry Pass',
    type: 'general',
    price: 899,
    totalQuantity: 350,
    soldQuantity: 300,
    reservedQuantity: 0,
    description: 'Full warehouse access to Decibel Underground.',
    perks: ['Full night access'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-07-28T00:00:00Z',
    salesEndDate: '2026-09-26T21:00:00Z',
    entryValidity: 'Valid all night',
    refundEligibility: 'refundable_48h'
  },

  // Unfiltered Comedy tiers
  {
    id: 'tier_comedy_gen',
    eventId: 'ev_unfiltered_comedy',
    name: 'Standard Seat',
    type: 'general',
    price: 499,
    totalQuantity: 65,
    soldQuantity: 62,
    reservedQuantity: 0,
    description: 'Seated auditorium entry. First-come first-served seating.',
    perks: ['Reserved seating', 'Includes 1 craft soft beverage'],
    minPerOrder: 1,
    maxPerOrder: 4,
    salesStartDate: '2026-08-01T00:00:00Z',
    salesEndDate: '2026-09-04T22:00:00Z',
    entryValidity: 'Entry before 22:30',
    refundEligibility: 'refundable_48h'
  },
  {
    id: 'tier_comedy_front',
    eventId: 'ev_unfiltered_comedy',
    name: 'Front Row Roast Table',
    type: 'vip',
    price: 899,
    totalQuantity: 20,
    soldQuantity: 16,
    reservedQuantity: 0,
    description: 'Front row seats directly in comic eye-line with table service.',
    perks: ['Front-row seating', 'Table service', '1x Craft Beer or Mocktail'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-08-01T00:00:00Z',
    salesEndDate: '2026-09-04T22:00:00Z',
    entryValidity: 'Entry before 22:30',
    refundEligibility: 'refundable_48h'
  },

  // Synthex Workshop tiers
  {
    id: 'tier_synth_single',
    eventId: 'ev_synthex_workshop',
    name: 'Workshop Seat & Eurorack Rig Access',
    type: 'general',
    price: 2999,
    totalQuantity: 30,
    soldQuantity: 22,
    reservedQuantity: 0,
    description: 'Individual modular synthesizer station, patch cables, headphones, course material & lunch.',
    perks: ['Dedicated hardware modular rig', 'Curated course notebook & sample pack', 'Artisanal lunch & beverages'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-08-05T00:00:00Z',
    salesEndDate: '2026-09-20T10:00:00Z',
    entryValidity: 'Full day session',
    refundEligibility: 'refundable_7d'
  },

  // Future Culture Summit tiers
  {
    id: 'tier_summit_delegate',
    eventId: 'ev_future_culture_summit',
    name: '2-Day Delegate Pass',
    type: 'general',
    price: 3999,
    totalQuantity: 350,
    soldQuantity: 240,
    reservedQuantity: 10,
    description: 'Access to all keynotes, panels, and exhibition hall for both summit days.',
    perks: ['2-day all sessions access', 'Buffet lunch & coffee bar', 'Conference networking app access'],
    minPerOrder: 1,
    maxPerOrder: 5,
    salesStartDate: '2026-08-08T00:00:00Z',
    salesEndDate: '2026-10-16T09:00:00Z',
    entryValidity: 'Valid Oct 16-17',
    refundEligibility: 'refundable_7d'
  },

  // Blackout Session tier
  {
    id: 'tier_blackout_pass',
    eventId: 'ev_blackout_session',
    name: 'Private Listening Pass',
    type: 'invite_only',
    price: 1999,
    totalQuantity: 60,
    soldQuantity: 54,
    reservedQuantity: 0,
    description: 'Includes rare cocktail flight and private rooftop access.',
    perks: ['Secret rooftop access', 'Curated cocktail flight', 'Vinyl tracklist booklet'],
    minPerOrder: 1,
    maxPerOrder: 2,
    salesStartDate: '2026-08-12T00:00:00Z',
    salesEndDate: '2026-09-19T22:00:00Z',
    entryValidity: 'Valid all night',
    isSecret: true,
    accessCode: 'BLACKOUT',
    refundEligibility: 'non_refundable'
  }
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: 'promo_gatezero10',
    code: 'GATEZERO10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 1000,
    totalLimit: 500,
    usedCount: 142,
    expiryDate: '2026-12-31T23:59:59Z',
    isActive: true
  },
  {
    id: 'promo_underground',
    code: 'UNDERGROUND',
    discountType: 'flat',
    discountValue: 300,
    minOrderValue: 1500,
    totalLimit: 200,
    usedCount: 68,
    expiryDate: '2026-10-31T23:59:59Z',
    isActive: true
  },
  {
    id: 'promo_blrtechno',
    eventId: 'ev_fifth_room',
    code: 'BLRTECHNO',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 900,
    totalLimit: 100,
    usedCount: 38,
    expiryDate: '2026-09-12T20:00:00Z',
    isActive: true
  },
  {
    id: 'promo_priya_scene',
    code: 'PRIYA10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 500,
    totalLimit: 1000,
    usedCount: 142,
    expiryDate: '2026-12-31T23:59:59Z',
    isActive: true
  }
];

export const INITIAL_PROMOTERS: PromoterProfile[] = [
  {
    id: 'prom_priya',
    userId: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.affiliate@gatezero.in',
    phone: '+91 99302 88471',
    code: 'PRIYA10',
    commissionRate: 10,
    totalClicks: 1420,
    totalSalesCount: 142,
    totalGrossSales: 384000,
    totalCommissionEarned: 38400,
    pendingPayout: 12400,
    paidPayout: 26000,
    activeEvents: ['ev_steelworks', 'ev_khaos_delhi', 'ev_offgrid_goa'],
    createdAt: '2026-02-01T11:20:00Z'
  },
  {
    id: 'prom_karan_m',
    userId: 'user_karan_prom',
    name: 'Karan Joshi (Mumbai Nightlife)',
    email: 'karan.j@gatezero.in',
    phone: '+91 98201 99281',
    code: 'MUMBAIBASS',
    commissionRate: 8,
    totalClicks: 980,
    totalSalesCount: 88,
    totalGrossSales: 212000,
    totalCommissionEarned: 16960,
    pendingPayout: 6960,
    paidPayout: 10000,
    activeEvents: ['ev_steelworks', 'ev_decibel_pune'],
    createdAt: '2026-02-15T09:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_sample_001',
    orderNumber: 'GZ-ORD-2026-98124',
    userId: 'user_alex',
    customerName: 'Alex Chen',
    customerEmail: 'alex.chen@gatezero.in',
    customerPhone: '+91 98201 44520',
    eventId: 'ev_steelworks',
    eventTitle: 'Steelworks: After Dark',
    eventDate: '2026-09-05T21:00:00+05:30',
    eventVenue: 'The Mill Compound / Secret Industrial Shed, Mumbai',
    eventCity: 'Mumbai',
    eventPosterUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        ticketTierId: 'tier_steel_p2',
        tierName: 'Phase 2 Access Pass',
        pricePerUnit: 2299,
        quantity: 2,
        subtotal: 4598
      }
    ],
    attendees: [
      {
        id: 'att_001_1',
        ticketCode: 'GZ-TCK-948121',
        tierName: 'Phase 2 Access Pass',
        fullName: 'Alex Chen',
        email: 'alex.chen@gatezero.in',
        phone: '+91 98201 44520',
        isCheckedIn: false,
        gateAssigned: 'GATE 01 - NORTH DOCK',
        qrPayload: 'GZ::ev_steelworks::tier_steel_p2::GZ-TCK-948121::alex.chen@gatezero.in',
        securityHash: 'a8f94c1e78b234d092'
      },
      {
        id: 'att_001_2',
        ticketCode: 'GZ-TCK-948122',
        tierName: 'Phase 2 Access Pass',
        fullName: 'Zoya Merchant',
        email: 'zoya.m@example.com',
        phone: '+91 98201 99882',
        isCheckedIn: false,
        gateAssigned: 'GATE 01 - NORTH DOCK',
        qrPayload: 'GZ::ev_steelworks::tier_steel_p2::GZ-TCK-948122::zoya.m@example.com',
        securityHash: 'c129e083ba499d12a7'
      }
    ],
    subtotal: 4598,
    discountAmount: 459.8,
    promoCodeApplied: 'GATEZERO10',
    platformFee: 49,
    gstAmount: 745.0,
    totalAmount: 4932.2,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    paymentGatewayRef: 'pay_rzp_mock_98124401',
    paidAt: '2026-08-25T14:22:10Z',
    promoterId: 'prom_priya',
    promoterCode: 'PRIYA10',
    commissionEarned: 413.8,
    refundStatus: 'none',
    createdAt: '2026-08-25T14:20:00Z'
  },
  {
    id: 'ord_sample_002',
    orderNumber: 'GZ-ORD-2026-89145',
    userId: 'user_alex',
    customerName: 'Alex Chen',
    customerEmail: 'alex.chen@gatezero.in',
    customerPhone: '+91 98201 44520',
    eventId: 'ev_fifth_room',
    eventTitle: 'The Fifth Room: Immersive Sonic Lab',
    eventDate: '2026-09-12T19:30:00+05:30',
    eventVenue: 'The Acoustic Hangar // Indiranagar Stage 2, Bengaluru',
    eventCity: 'Bengaluru',
    eventPosterUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        ticketTierId: 'tier_fifth_vip',
        tierName: 'Sweet-Spot VIP Listening Pod',
        pricePerUnit: 2499,
        quantity: 1,
        subtotal: 2499
      }
    ],
    attendees: [
      {
        id: 'att_002_1',
        ticketCode: 'GZ-TCK-771923',
        tierName: 'Sweet-Spot VIP Listening Pod',
        fullName: 'Alex Chen',
        email: 'alex.chen@gatezero.in',
        phone: '+91 98201 44520',
        isCheckedIn: false,
        gateAssigned: 'GATE VIP - MAIN DOME',
        qrPayload: 'GZ::ev_fifth_room::tier_fifth_vip::GZ-TCK-771923::alex.chen@gatezero.in',
        securityHash: '89cb01ef432d9081e2'
      }
    ],
    subtotal: 2499,
    discountAmount: 0,
    platformFee: 49,
    gstAmount: 458.6,
    totalAmount: 3006.6,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    paymentGatewayRef: 'pay_card_mock_8914552',
    paidAt: '2026-08-20T18:10:00Z',
    refundStatus: 'none',
    createdAt: '2026-08-20T18:08:00Z'
  },
  {
    id: 'ord_sample_003',
    orderNumber: 'GZ-ORD-2026-67210',
    userId: 'user_alex',
    customerName: 'Alex Chen',
    customerEmail: 'alex.chen@gatezero.in',
    customerPhone: '+91 98201 44520',
    eventId: 'ev_unfiltered_comedy',
    eventTitle: 'Unfiltered: Late Night Stand-Up Showcase',
    eventDate: '2026-09-04T22:30:00+05:30',
    eventVenue: 'The Vault Basement // Bandra West, Mumbai',
    eventCity: 'Mumbai',
    eventPosterUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800&auto=format&fit=crop',
    items: [
      {
        ticketTierId: 'tier_comedy_front',
        tierName: 'Front Row Roast Table',
        pricePerUnit: 899,
        quantity: 1,
        subtotal: 899
      }
    ],
    attendees: [
      {
        id: 'att_003_1',
        ticketCode: 'GZ-TCK-349811',
        tierName: 'Front Row Roast Table',
        fullName: 'Alex Chen',
        email: 'alex.chen@gatezero.in',
        phone: '+91 98201 44520',
        isCheckedIn: true,
        checkedInAt: '2026-08-28T22:15:00Z',
        checkedInBy: 'IndiePunch Door Staff',
        gateAssigned: 'VAULT ENTRANCE',
        qrPayload: 'GZ::ev_unfiltered_comedy::tier_comedy_front::GZ-TCK-349811::alex.chen@gatezero.in',
        securityHash: '5610ea982bc44109fa'
      }
    ],
    subtotal: 899,
    discountAmount: 0,
    platformFee: 49,
    gstAmount: 170.6,
    totalAmount: 1118.6,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    paymentGatewayRef: 'pay_rzp_mock_349811',
    paidAt: '2026-08-15T10:00:00Z',
    refundStatus: 'none',
    createdAt: '2026-08-15T09:58:00Z'
  }
];

export const INITIAL_CHECKINS: CheckInLog[] = [
  {
    id: 'chk_log_001',
    eventId: 'ev_unfiltered_comedy',
    orderId: 'ord_sample_003',
    ticketCode: 'GZ-TCK-349811',
    attendeeName: 'Alex Chen',
    tierName: 'Front Row Roast Table',
    timestamp: '2026-08-28T22:15:00Z',
    staffName: 'Rajesh Shinde (Door Lead)',
    gate: 'VAULT ENTRANCE',
    status: 'valid'
  },
  {
    id: 'chk_log_002',
    eventId: 'ev_steelworks',
    orderId: 'ord_sample_prev',
    ticketCode: 'GZ-TCK-112901',
    attendeeName: 'Devika Singhania',
    tierName: 'Phase 1 Access Pass',
    timestamp: '2026-08-28T21:42:15Z',
    staffName: 'Rajesh Shinde (Door Lead)',
    gate: 'GATE 01 - NORTH DOCK',
    status: 'valid'
  }
];

export const INITIAL_SETTLEMENTS: SettlementRecord[] = [
  {
    id: 'set_subkulture_01',
    organizerId: 'org_subkulture',
    organizerName: 'SubKulture India',
    eventId: 'ev_steelworks',
    eventTitle: 'Steelworks: After Dark',
    grossSales: 1624500,
    platformCommission: 81225, // 5%
    paymentGatewaysFee: 32490, // 2%
    taxesDeducted: 20468,
    netPayoutAmount: 1490317,
    status: 'scheduled',
    scheduledDate: '2026-09-08T12:00:00Z',
    invoiceNumber: 'GZ-INV-2026-0841'
  },
  {
    id: 'set_anomaly_01',
    organizerId: 'org_anomaly',
    organizerName: 'Anomaly Sound Labs',
    eventId: 'ev_fifth_room',
    eventTitle: 'The Fifth Room: Immersive Sonic Lab',
    grossSales: 394500,
    platformCommission: 19725,
    paymentGatewaysFee: 7890,
    taxesDeducted: 4970,
    netPayoutAmount: 361915,
    status: 'scheduled',
    scheduledDate: '2026-09-15T12:00:00Z',
    invoiceNumber: 'GZ-INV-2026-0842'
  },
  {
    id: 'set_offgrid_prev',
    organizerId: 'org_offgrid',
    organizerName: 'OFF/GRID Collective',
    eventId: 'ev_offgrid_prev',
    eventTitle: 'OFF/GRID Monsoon Sanctuary 2026',
    grossSales: 4890000,
    platformCommission: 244500,
    paymentGatewaysFee: 97800,
    taxesDeducted: 61614,
    netPayoutAmount: 4486086,
    status: 'settled',
    scheduledDate: '2026-08-10T12:00:00Z',
    settledAt: '2026-08-10T14:30:00Z',
    bankReferenceNumber: 'HDFCN26081048190',
    invoiceNumber: 'GZ-INV-2026-0799'
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_01',
    adminEmail: 'admin@gatezero.in',
    action: 'EVENT_APPROVED',
    targetType: 'event',
    targetId: 'ev_steelworks',
    details: 'Approved event "Steelworks: After Dark" with 5 ticket tiers after venue permit check.',
    timestamp: '2026-07-01T10:15:00Z',
    ipAddress: '103.21.124.9'
  },
  {
    id: 'log_02',
    adminEmail: 'admin@gatezero.in',
    action: 'KYC_VERIFIED',
    targetType: 'organizer',
    targetId: 'org_subkulture',
    details: 'Verified GSTIN 27AABCS1429M1ZB and HDFC Bank account for SubKulture Experiences LLP.',
    timestamp: '2025-12-01T00:00:00Z',
    ipAddress: '103.21.124.9'
  },
  {
    id: 'log_03',
    adminEmail: 'admin@gatezero.in',
    action: 'FEATURED_EVENT_SET',
    targetType: 'event',
    targetId: 'ev_offgrid_goa',
    details: 'Promoted "OFF/GRID Goa" to primary national billboard slot.',
    timestamp: '2026-08-20T09:00:00Z',
    ipAddress: '103.21.124.9'
  }
];

export const CITIES = [
  { id: 'all', name: 'All Cities', code: 'ALL', count: 9 },
  { id: 'mumbai', name: 'Mumbai', code: 'MUM', count: 4, coords: { lat: 18.922, lng: 72.834 } },
  { id: 'bengaluru', name: 'Bengaluru', code: 'BLR', count: 2, coords: { lat: 12.971, lng: 77.594 } },
  { id: 'delhi', name: 'Delhi NCR', code: 'DEL', count: 1, coords: { lat: 28.613, lng: 77.209 } },
  { id: 'goa', name: 'Goa', code: 'GOA', count: 1, coords: { lat: 15.299, lng: 74.124 } },
  { id: 'pune', name: 'Pune', code: 'PNE', count: 1, coords: { lat: 18.520, lng: 73.856 } },
  { id: 'hyderabad', name: 'Hyderabad', code: 'HYD', count: 0, coords: { lat: 17.385, lng: 78.486 } },
  { id: 'dubai', name: 'Dubai', code: 'DXB', count: 0, coords: { lat: 25.204, lng: 55.270 } }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', slug: 'all', icon: 'Sparkles' },
  { id: 'underground', name: 'Underground & Techno', slug: 'underground', icon: 'Radio' },
  { id: 'music', name: 'Immersive Music', slug: 'music', icon: 'Music' },
  { id: 'festivals', name: 'Festivals', slug: 'festivals', icon: 'Tent' },
  { id: 'nightlife', name: 'Nightlife & Clubs', slug: 'nightlife', icon: 'Moon' },
  { id: 'comedy', name: 'Comedy & Standup', slug: 'comedy', icon: 'Mic' },
  { id: 'art_culture', name: 'Art & Design', slug: 'art_culture', icon: 'Palette' },
  { id: 'workshops', name: 'Workshops & Labs', slug: 'workshops', icon: 'Cpu' },
  { id: 'conferences', name: 'Conferences & Summits', slug: 'conferences', icon: 'Globe' },
  { id: 'invite_only', name: 'Private & Invite-Only', slug: 'invite_only', icon: 'Lock' }
];
