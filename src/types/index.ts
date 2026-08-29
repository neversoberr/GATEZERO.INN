export type UserRole = 
  | 'guest'
  | 'customer'
  | 'organizer'
  | 'promoter'
  | 'door_staff'
  | 'admin'
  | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city: string;
  savedEventIds: string[];
  followedOrganizerIds: string[];
  createdAt: string;
  isVerified?: boolean;
  organizerCompanyId?: string;
  promoterCode?: string;
}

export type EventCategory = 
  | 'underground'
  | 'music'
  | 'nightlife'
  | 'festivals'
  | 'concerts'
  | 'comedy'
  | 'workshops'
  | 'conferences'
  | 'sports'
  | 'food_drink'
  | 'art_culture'
  | 'fashion'
  | 'networking'
  | 'invite_only';

export type EventFormat = 'physical' | 'secret_location' | 'outdoor' | 'warehouse' | 'rooftop' | 'hybrid';

export type EventStatus = 'draft' | 'under_review' | 'published' | 'paused' | 'sold_out' | 'cancelled' | 'ended';

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  type: 'free' | 'rsvp' | 'early_bird' | 'phase_1' | 'phase_2' | 'phase_3' | 'general' | 'vip' | 'backstage' | 'couple' | 'group' | 'invite_only';
  price: number; // in INR
  originalPrice?: number;
  totalQuantity: number;
  soldQuantity: number;
  reservedQuantity: number;
  description: string;
  perks: string[];
  minPerOrder: number;
  maxPerOrder: number;
  salesStartDate: string;
  salesEndDate: string;
  entryValidity: string; // e.g. "Valid before 11:00 PM"
  isSecret?: boolean;
  accessCode?: string; // e.g. "VIPGUEST"
  refundEligibility: 'non_refundable' | 'refundable_48h' | 'refundable_7d' | 'full_refund';
}

export interface LineupArtist {
  id: string;
  name: string;
  role: string; // "Headliner", "Live Modular Synth", "Support", "Visual Artist"
  setTime?: string; // "23:00 - 01:30"
  imageUrl?: string;
  spotifyOrSoundcloud?: string;
}

export interface EventScheduleItem {
  time: string;
  title: string;
  description?: string;
  stage?: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface CustomAttendeeQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface Event {
  id: string;
  code: string; // e.g. "GZ-MUM-001"
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  subcategory?: string;
  tags: string[];
  format: EventFormat;
  status: EventStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSellingFast?: boolean;
  isVerifiedOrganizer?: boolean;
  accentColor: string; // Hex e.g. "#D4F00D", "#FF314A", "#D4F00D"
  
  // Imagery
  posterUrl: string;
  coverBannerUrl: string;
  galleryUrls?: string[];
  
  // Date & Times
  startDate: string; // ISO date
  endDate: string; // ISO date
  doorsOpenTime: string; // "20:00"
  timezone: string; // "IST (UTC+05:30)"
  
  // Venue & Location
  city: string; // "Mumbai", "Bengaluru", "Delhi", "Goa", "Pune"
  venueName: string;
  venueAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  secretLocationInstructions?: string;
  
  // Rules & Policies
  ageRestriction: 'All Ages' | '18+' | '21+';
  dressCode?: string;
  phonePolicy?: string; // "No flash photography / Lens stickers provided at door"
  entryRules?: string[];
  parkingInfo?: string;
  accessibilityInfo?: string;
  safetyInfo?: string;
  refundPolicyText: string;
  
  // Relationships
  organizerId: string;
  organizerName: string;
  organizerLogo: string;
  organizerSlug: string;
  
  // Program
  lineup: LineupArtist[];
  schedule: EventScheduleItem[];
  faqs: EventFAQ[];
  customQuestions?: CustomAttendeeQuestion[];
  
  // Stats
  viewsCount: number;
  savedCount: number;
  totalCapacity: number;
  totalTicketsSold: number;
  minPrice: number;
  maxPrice: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerCompany {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  isVerified: boolean;
  verifiedAt?: string;
  city: string;
  country: string;
  website?: string;
  instagram?: string;
  email: string;
  phone: string;
  followersCount: number;
  totalEventsHosted: number;
  rating: number;
  totalReviews: number;
  categories: EventCategory[];
  kycStatus: 'pending' | 'verified' | 'rejected' | 'in_review';
  gstin?: string;
  panNumber?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  teamMembers: {
    userId: string;
    name: string;
    email: string;
    role: 'owner' | 'manager' | 'door_staff';
  }[];
}

export interface OrderItem {
  ticketTierId: string;
  tierName: string;
  pricePerUnit: number;
  quantity: number;
  subtotal: number;
}

export interface AttendeeDetail {
  id: string;
  ticketCode: string; // "GZ-TCK-784912"
  tierName: string;
  fullName: string;
  email: string;
  phone: string;
  customAnswers?: Record<string, string>;
  isCheckedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  gateAssigned?: string;
  qrPayload: string;
  securityHash: string;
}

export interface Order {
  id: string;
  orderNumber: string; // "GZ-ORD-2026-94812"
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  eventCity: string;
  eventPosterUrl: string;
  items: OrderItem[];
  attendees: AttendeeDetail[];
  
  // Financial breakdown
  subtotal: number;
  discountAmount: number;
  promoCodeApplied?: string;
  platformFee: number;
  gstAmount: number; // 18% on platform fee or total as applicable
  totalAmount: number;
  currency: 'INR' | 'USD';
  
  // Payment info
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'Razorpay' | 'Stripe';
  paymentGatewayRef: string;
  paidAt: string;
  
  // Promoter Attribution
  promoterId?: string;
  promoterCode?: string;
  commissionEarned?: number;
  
  // Refund status
  refundRequested?: boolean;
  refundReason?: string;
  refundStatus?: 'none' | 'pending' | 'approved' | 'rejected' | 'completed';
  refundAmount?: number;
  
  createdAt: string;
}

export interface PromoCode {
  id: string;
  eventId?: string; // specific event or all if null
  code: string; // "GATEZERO10"
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 15 for 15% or 500 for ₹500
  minOrderValue?: number;
  maxDiscount?: number;
  totalLimit: number;
  usedCount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface PromoterProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  code: string; // "PRIYA_DELHI"
  commissionRate: number; // e.g. 10%
  totalClicks: number;
  totalSalesCount: number;
  totalGrossSales: number;
  totalCommissionEarned: number;
  pendingPayout: number;
  paidPayout: number;
  activeEvents: string[]; // eventIds
  createdAt: string;
}

export interface CheckInLog {
  id: string;
  eventId: string;
  orderId: string;
  ticketCode: string;
  attendeeName: string;
  tierName: string;
  timestamp: string;
  staffName: string;
  gate: string;
  status: 'valid' | 'duplicate_prevented' | 'invalid_cancelled' | 'undone';
  note?: string;
}

export interface SettlementRecord {
  id: string;
  organizerId: string;
  organizerName: string;
  eventId: string;
  eventTitle: string;
  grossSales: number;
  platformCommission: number;
  paymentGatewaysFee: number;
  taxesDeducted: number;
  netPayoutAmount: number;
  status: 'scheduled' | 'processing' | 'settled' | 'on_hold';
  scheduledDate: string;
  settledAt?: string;
  bankReferenceNumber?: string;
  invoiceNumber: string;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'event' | 'organizer' | 'order' | 'user' | 'settlement' | 'promo';
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface PlatformStats {
  totalGMV: number;
  totalPlatformRevenue: number;
  totalTicketsSold: number;
  totalActiveEvents: number;
  totalOrganizers: number;
  totalAttendees: number;
  pendingEventApprovals: number;
  pendingKycApprovals: number;
  pendingRefunds: number;
  activePromoters: number;
}
