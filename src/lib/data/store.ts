import fs from 'fs';
import path from 'path';
import { 
  Event, 
  TicketTier, 
  OrganizerCompany, 
  User, 
  Order, 
  AttendeeDetail,
  PromoterProfile, 
  PromoCode, 
  CheckInLog, 
  SettlementRecord, 
  AdminAuditLog,
  PlatformStats
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_ORGANIZERS,
  INITIAL_EVENTS,
  INITIAL_TICKET_TIERS,
  INITIAL_PROMO_CODES,
  INITIAL_PROMOTERS,
  INITIAL_ORDERS,
  INITIAL_CHECKINS,
  INITIAL_SETTLEMENTS,
  INITIAL_AUDIT_LOGS
} from './initial-data';

interface DatabaseSchema {
  users: User[];
  organizers: OrganizerCompany[];
  events: Event[];
  ticketTiers: TicketTier[];
  promoCodes: PromoCode[];
  promoters: PromoterProfile[];
  orders: Order[];
  checkIns: CheckInLog[];
  settlements: SettlementRecord[];
  auditLogs: AdminAuditLog[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'gatezero_db.json');

// In-memory fallback if file system access fails in edge runtimes
let memoryDb: DatabaseSchema = {
  users: [...INITIAL_USERS],
  organizers: [...INITIAL_ORGANIZERS],
  events: [...INITIAL_EVENTS],
  ticketTiers: [...INITIAL_TICKET_TIERS],
  promoCodes: [...INITIAL_PROMO_CODES],
  promoters: [...INITIAL_PROMOTERS],
  orders: [...INITIAL_ORDERS],
  checkIns: [...INITIAL_CHECKINS],
  settlements: [...INITIAL_SETTLEMENTS],
  auditLogs: [...INITIAL_AUDIT_LOGS]
};

function readDb(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      writeDb(memoryDb);
      return memoryDb;
    }
    const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content);
    // Ensure all keys exist
    return {
      users: parsed.users || INITIAL_USERS,
      organizers: parsed.organizers || INITIAL_ORGANIZERS,
      events: parsed.events || INITIAL_EVENTS,
      ticketTiers: parsed.ticketTiers || INITIAL_TICKET_TIERS,
      promoCodes: parsed.promoCodes || INITIAL_PROMO_CODES,
      promoters: parsed.promoters || INITIAL_PROMOTERS,
      orders: parsed.orders || INITIAL_ORDERS,
      checkIns: parsed.checkIns || INITIAL_CHECKINS,
      settlements: parsed.settlements || INITIAL_SETTLEMENTS,
      auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
    };
  } catch (err) {
    console.error('Failed reading DB file, using in-memory store', err);
    return memoryDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    memoryDb = data;
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed writing to DB file, updated in-memory store', err);
    memoryDb = data;
  }
}

export const db = {
  // USERS
  getUsers(): User[] {
    return readDb().users;
  },
  getUserById(id: string): User | undefined {
    return readDb().users.find(u => u.id === id);
  },
  getUserByEmail(email: string): User | undefined {
    return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  saveUser(user: User): User {
    const data = readDb();
    const index = data.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      data.users.push(user);
    }
    writeDb(data);
    return user;
  },
  toggleSaveEvent(userId: string, eventId: string): boolean {
    const data = readDb();
    const user = data.users.find(u => u.id === userId);
    if (!user) return false;
    
    if (user.savedEventIds.includes(eventId)) {
      user.savedEventIds = user.savedEventIds.filter(id => id !== eventId);
    } else {
      user.savedEventIds.push(eventId);
    }
    writeDb(data);
    return true;
  },
  toggleFollowOrganizer(userId: string, organizerId: string): boolean {
    const data = readDb();
    const user = data.users.find(u => u.id === userId);
    const org = data.organizers.find(o => o.id === organizerId);
    if (!user || !org) return false;

    if (user.followedOrganizerIds.includes(organizerId)) {
      user.followedOrganizerIds = user.followedOrganizerIds.filter(id => id !== organizerId);
      org.followersCount = Math.max(0, org.followersCount - 1);
    } else {
      user.followedOrganizerIds.push(organizerId);
      org.followersCount += 1;
    }
    writeDb(data);
    return true;
  },

  // EVENTS
  getEvents(filters?: {
    city?: string;
    category?: string;
    query?: string;
    status?: string;
    format?: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    maxPrice?: number;
    age?: string;
    verifiedOnly?: boolean;
    availableOnly?: boolean;
    sort?: string;
  }): Event[] {
    const data = readDb();
    let list = [...data.events];

    if (filters?.status) {
      list = list.filter(e => e.status === filters.status);
    } else {
      list = list.filter(e => e.status === 'published' || e.status === 'sold_out');
    }

    if (filters?.city && filters.city !== 'all') {
      list = list.filter(e => e.city.toLowerCase() === filters.city!.toLowerCase());
    }

    if (filters?.category && filters.category !== 'all') {
      list = list.filter(e => e.category === filters.category);
    }

    if (filters?.format && filters.format !== 'all') {
      list = list.filter(e => e.format === filters.format);
    }

    if (filters?.age && filters.age !== 'all') {
      list = list.filter(e => e.ageRestriction === filters.age);
    }

    if (filters?.verifiedOnly) {
      list = list.filter(e => e.isVerifiedOrganizer);
    }

    if (filters?.availableOnly) {
      list = list.filter(e => e.totalTicketsSold < e.totalCapacity);
    }

    if (filters?.maxPrice) {
      list = list.filter(e => e.minPrice <= filters.maxPrice!);
    }

    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      list = list.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.tagline.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.organizerName.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q)) ||
        e.lineup.some(a => a.name.toLowerCase().includes(q))
      );
    }

    if (filters?.isFeatured) {
      list = list.filter(e => e.isFeatured);
    }

    if (filters?.isTrending) {
      list = list.filter(e => e.isTrending);
    }

    // Sort
    if (filters?.sort === 'price_asc') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    } else if (filters?.sort === 'price_desc') {
      list.sort((a, b) => b.minPrice - a.minPrice);
    } else if (filters?.sort === 'popularity') {
      list.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (filters?.sort === 'date_asc') {
      list.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else {
      // Default: featured first, then soonest
      list.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });
    }

    return list;
  },

  getEventBySlug(slug: string): Event | undefined {
    return readDb().events.find(e => e.slug === slug || e.id === slug);
  },

  getEventById(id: string): Event | undefined {
    return readDb().events.find(e => e.id === id);
  },

  createEvent(event: Event, tiers: TicketTier[]): Event {
    const data = readDb();
    data.events.unshift(event);
    data.ticketTiers.push(...tiers);

    // Audit log
    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: 'system@gatezero.in',
      action: 'EVENT_CREATED',
      targetType: 'event',
      targetId: event.id,
      details: `Created event "${event.title}" with ${tiers.length} ticket tiers.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    writeDb(data);
    return event;
  },

  updateEvent(id: string, updates: Partial<Event>): Event | null {
    const data = readDb();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return null;

    data.events[index] = { ...data.events[index], ...updates, updatedAt: new Date().toISOString() };
    writeDb(data);
    return data.events[index];
  },

  deleteEvent(id: string): boolean {
    const data = readDb();
    data.events = data.events.filter(e => e.id !== id);
    data.ticketTiers = data.ticketTiers.filter(t => t.eventId !== id);
    writeDb(data);
    return true;
  },

  // TICKET TIERS
  getTicketTiers(eventId: string): TicketTier[] {
    return readDb().ticketTiers.filter(t => t.eventId === eventId);
  },

  saveTicketTier(tier: TicketTier): TicketTier {
    const data = readDb();
    const idx = data.ticketTiers.findIndex(t => t.id === tier.id);
    if (idx >= 0) {
      data.ticketTiers[idx] = tier;
    } else {
      data.ticketTiers.push(tier);
    }
    writeDb(data);
    return tier;
  },

  // ORGANIZERS
  getOrganizers(): OrganizerCompany[] {
    return readDb().organizers;
  },

  getOrganizerBySlug(slug: string): OrganizerCompany | undefined {
    return readDb().organizers.find(o => o.slug === slug || o.id === slug);
  },

  getOrganizerById(id: string): OrganizerCompany | undefined {
    return readDb().organizers.find(o => o.id === id);
  },

  updateOrganizer(id: string, updates: Partial<OrganizerCompany>): OrganizerCompany | null {
    const data = readDb();
    const idx = data.organizers.findIndex(o => o.id === id);
    if (idx === -1) return null;

    data.organizers[idx] = { ...data.organizers[idx], ...updates };
    writeDb(data);
    return data.organizers[idx];
  },

  // ORDERS
  getOrders(filters?: { userId?: string; eventId?: string; orderNumber?: string }): Order[] {
    const data = readDb();
    let list = [...data.orders];
    if (filters?.userId) {
      list = list.filter(o => o.userId === filters.userId);
    }
    if (filters?.eventId) {
      list = list.filter(o => o.eventId === filters.eventId);
    }
    if (filters?.orderNumber) {
      list = list.filter(o => o.orderNumber === filters.orderNumber);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrderById(id: string): Order | undefined {
    return readDb().orders.find(o => o.id === id || o.orderNumber === id);
  },

  createOrder(order: Order): Order {
    const data = readDb();
    data.orders.unshift(order);

    // Update event tickets sold and tier quantities
    const event = data.events.find(e => e.id === order.eventId);
    let totalItems = 0;
    
    order.items.forEach(item => {
      totalItems += item.quantity;
      const tier = data.ticketTiers.find(t => t.id === item.ticketTierId);
      if (tier) {
        tier.soldQuantity += item.quantity;
      }
    });

    if (event) {
      event.totalTicketsSold += totalItems;
      if (event.totalTicketsSold >= event.totalCapacity) {
        event.status = 'sold_out';
      }
    }

    // If promoter code applied, attribute stats
    if (order.promoterCode) {
      const promoter = data.promoters.find(p => p.code.toLowerCase() === order.promoterCode?.toLowerCase());
      if (promoter) {
        promoter.totalSalesCount += totalItems;
        promoter.totalGrossSales += order.subtotal;
        const commission = (order.subtotal * promoter.commissionRate) / 100;
        promoter.totalCommissionEarned += commission;
        promoter.pendingPayout += commission;
      }
    }

    // Update promo code usage count
    if (order.promoCodeApplied) {
      const promo = data.promoCodes.find(p => p.code.toLowerCase() === order.promoCodeApplied?.toLowerCase());
      if (promo) {
        promo.usedCount += 1;
      }
    }

    writeDb(data);
    return order;
  },

  // TICKET ACTIONS (Transfer, Refund)
  transferTicket(ticketCode: string, newFullName: string, newEmail: string, newPhone: string): boolean {
    const data = readDb();
    let found = false;

    data.orders.forEach(order => {
      order.attendees.forEach(att => {
        if (att.ticketCode === ticketCode) {
          att.fullName = newFullName;
          att.email = newEmail;
          att.phone = newPhone;
          att.qrPayload = `GZ::${order.eventId}::${att.tierName}::${att.ticketCode}::${newEmail}`;
          found = true;
        }
      });
    });

    if (found) {
      data.auditLogs.unshift({
        id: `log_${Date.now()}`,
        adminEmail: 'customer@gatezero.in',
        action: 'TICKET_TRANSFERRED',
        targetType: 'order',
        targetId: ticketCode,
        details: `Transferred ticket ${ticketCode} to ${newFullName} (${newEmail})`,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
      });
      writeDb(data);
    }

    return found;
  },

  requestRefund(orderId: string, reason: string): boolean {
    const data = readDb();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return false;

    order.refundRequested = true;
    order.refundReason = reason;
    order.refundStatus = 'pending';
    order.refundAmount = order.totalAmount;

    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: order.customerEmail,
      action: 'REFUND_REQUESTED',
      targetType: 'order',
      targetId: order.id,
      details: `Refund requested for order ${order.orderNumber}. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    writeDb(data);
    return true;
  },

  processRefund(orderId: string, approved: boolean): boolean {
    const data = readDb();
    const order = data.orders.find(o => o.id === orderId);
    if (!order) return false;

    if (approved) {
      order.refundStatus = 'approved';
      order.paymentStatus = 'refunded';
      
      // Release ticket inventory
      order.items.forEach(item => {
        const tier = data.ticketTiers.find(t => t.id === item.ticketTierId);
        if (tier) {
          tier.soldQuantity = Math.max(0, tier.soldQuantity - item.quantity);
        }
      });
      const event = data.events.find(e => e.id === order.eventId);
      if (event) {
        event.totalTicketsSold = Math.max(0, event.totalTicketsSold - order.attendees.length);
        if (event.status === 'sold_out') {
          event.status = 'published';
        }
      }
    } else {
      order.refundStatus = 'rejected';
    }

    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: 'admin@gatezero.in',
      action: approved ? 'REFUND_APPROVED' : 'REFUND_REJECTED',
      targetType: 'order',
      targetId: order.id,
      details: `${approved ? 'Approved' : 'Rejected'} refund for order ${order.orderNumber}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    writeDb(data);
    return true;
  },

  // DOOR CHECK-IN ENGINE
  findAttendeeInDb(data: DatabaseSchema, ticketCode: string): { order: Order; attendee: AttendeeDetail } | null {
    const cleanCode = ticketCode.trim().toUpperCase();

    for (const order of data.orders) {
      const attendee = order.attendees.find(a => a.ticketCode.toUpperCase() === cleanCode);
      if (attendee) {
        return { order, attendee };
      }
    }
    return null;
  },

  checkInTicket(ticketCode: string, staffName: string = 'Door Controller', gate: string = 'GATE 01'): {
    success: boolean;
    status: 'valid' | 'duplicate_prevented' | 'invalid_cancelled' | 'not_found';
    message: string;
    attendee?: any;
    order?: Order;
  } {
    const data = readDb();
    const record = this.findAttendeeInDb(data, ticketCode);

    if (!record) {
      return {
        success: false,
        status: 'not_found',
        message: `NO TICKET FOUND FOR CODE: ${ticketCode}`
      };
    }

    const { order, attendee } = record;

    if (order.paymentStatus === 'refunded' || order.paymentStatus === 'failed') {
      const log: CheckInLog = {
        id: `chk_${Date.now()}`,
        eventId: order.eventId,
        orderId: order.id,
        ticketCode: attendee.ticketCode,
        attendeeName: attendee.fullName,
        tierName: attendee.tierName,
        timestamp: new Date().toISOString(),
        staffName,
        gate,
        status: 'invalid_cancelled',
        note: 'Ticket was refunded or cancelled'
      };
      data.checkIns.unshift(log);
      writeDb(data);

      return {
        success: false,
        status: 'invalid_cancelled',
        message: `ENTRY DENIED — PASS CANCELLED / REFUNDED`,
        attendee,
        order
      };
    }

    if (attendee.isCheckedIn) {
      const log: CheckInLog = {
        id: `chk_${Date.now()}`,
        eventId: order.eventId,
        orderId: order.id,
        ticketCode: attendee.ticketCode,
        attendeeName: attendee.fullName,
        tierName: attendee.tierName,
        timestamp: new Date().toISOString(),
        staffName,
        gate,
        status: 'duplicate_prevented',
        note: `Already checked in at ${attendee.checkedInAt}`
      };
      data.checkIns.unshift(log);
      writeDb(data);

      return {
        success: false,
        status: 'duplicate_prevented',
        message: `ENTRY DENIED — ALREADY CHECKED IN AT ${new Date(attendee.checkedInAt!).toLocaleTimeString()}`,
        attendee,
        order
      };
    }

    // Grant access
    attendee.isCheckedIn = true;
    attendee.checkedInAt = new Date().toISOString();
    attendee.checkedInBy = staffName;
    attendee.gateAssigned = gate;

    const log: CheckInLog = {
      id: `chk_${Date.now()}`,
      eventId: order.eventId,
      orderId: order.id,
      ticketCode: attendee.ticketCode,
      attendeeName: attendee.fullName,
      tierName: attendee.tierName,
      timestamp: new Date().toISOString(),
      staffName,
      gate,
      status: 'valid'
    };
    data.checkIns.unshift(log);
    writeDb(data);

    return {
      success: true,
      status: 'valid',
      message: `ENTRY GRANTED // 01 PASS`,
      attendee,
      order
    };
  },

  undoCheckIn(ticketCode: string): boolean {
    const data = readDb();
    const record = this.findAttendeeInDb(data, ticketCode);
    if (!record || !record.attendee.isCheckedIn) return false;

    record.attendee.isCheckedIn = false;
    record.attendee.checkedInAt = undefined;
    record.attendee.checkedInBy = undefined;

    const log: CheckInLog = {
      id: `chk_${Date.now()}`,
      eventId: record.order.eventId,
      orderId: record.order.id,
      ticketCode: record.attendee.ticketCode,
      attendeeName: record.attendee.fullName,
      tierName: record.attendee.tierName,
      timestamp: new Date().toISOString(),
      staffName: 'Supervisor',
      gate: 'CONTROL CONSOLE',
      status: 'undone',
      note: 'Door check-in manually reversed by staff'
    };
    data.checkIns.unshift(log);
    writeDb(data);
    return true;
  },

  getCheckIns(eventId?: string): CheckInLog[] {
    const data = readDb();
    if (eventId) {
      return data.checkIns.filter(c => c.eventId === eventId);
    }
    return data.checkIns;
  },

  // PROMOTERS
  getPromoters(): PromoterProfile[] {
    return readDb().promoters;
  },

  getPromoterByCode(code: string): PromoterProfile | undefined {
    return readDb().promoters.find(p => p.code.toLowerCase() === code.toLowerCase());
  },

  getPromoterByUserId(userId: string): PromoterProfile | undefined {
    return readDb().promoters.find(p => p.userId === userId);
  },

  createPromoter(promoter: PromoterProfile): PromoterProfile {
    const data = readDb();
    data.promoters.push(promoter);
    writeDb(data);
    return promoter;
  },

  // PROMO CODES
  getPromoCodes(): PromoCode[] {
    return readDb().promoCodes;
  },

  validatePromoCode(code: string, eventId: string, subtotal: number): {
    valid: boolean;
    message: string;
    discountAmount: number;
    promo?: PromoCode;
  } {
    const data = readDb();
    const cleanCode = code.trim().toUpperCase();
    const promo = data.promoCodes.find(p => p.code.toUpperCase() === cleanCode);

    if (!promo || !promo.isActive) {
      return { valid: false, message: 'INVALID PROMO CODE', discountAmount: 0 };
    }

    if (promo.eventId && promo.eventId !== eventId) {
      return { valid: false, message: 'CODE NOT APPLICABLE TO THIS EVENT', discountAmount: 0 };
    }

    if (new Date(promo.expiryDate) < new Date()) {
      return { valid: false, message: 'PROMO CODE EXPIRED', discountAmount: 0 };
    }

    if (promo.totalLimit && promo.usedCount >= promo.totalLimit) {
      return { valid: false, message: 'CODE USAGE LIMIT REACHED', discountAmount: 0 };
    }

    if (promo.minOrderValue && subtotal < promo.minOrderValue) {
      return { valid: false, message: `MINIMUM ORDER OF ₹${promo.minOrderValue} REQUIRED`, discountAmount: 0 };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = (subtotal * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = Math.min(subtotal, promo.discountValue);
    }

    return {
      valid: true,
      message: `PROMO APPLIED: ₹${discount.toFixed(0)} SAVINGS`,
      discountAmount: discount,
      promo
    };
  },

  // SETTLEMENTS
  getSettlements(organizerId?: string): SettlementRecord[] {
    const data = readDb();
    if (organizerId) {
      return data.settlements.filter(s => s.organizerId === organizerId);
    }
    return data.settlements;
  },

  releaseSettlement(id: string, bankRef?: string): boolean {
    const data = readDb();
    const item = data.settlements.find(s => s.id === id);
    if (!item) return false;

    item.status = 'settled';
    item.settledAt = new Date().toISOString();
    item.bankReferenceNumber = bankRef || `UTR${Date.now()}`;

    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: 'admin@gatezero.in',
      action: 'SETTLEMENT_RELEASED',
      targetType: 'settlement',
      targetId: id,
      details: `Released payout of ₹${item.netPayoutAmount.toLocaleString('en-IN')} to ${item.organizerName}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });

    writeDb(data);
    return true;
  },

  // AUDIT LOGS
  getAuditLogs(): AdminAuditLog[] {
    return readDb().auditLogs;
  },

  // PLATFORM STATS
  getPlatformStats(): PlatformStats {
    const data = readDb();
    const totalGMV = data.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const totalPlatformRevenue = data.orders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.platformFee + (o.subtotal * 0.05), 0);

    const totalTicketsSold = data.events.reduce((sum, e) => sum + e.totalTicketsSold, 0);

    return {
      totalGMV,
      totalPlatformRevenue,
      totalTicketsSold,
      totalActiveEvents: data.events.filter(e => e.status === 'published').length,
      totalOrganizers: data.organizers.length,
      totalAttendees: data.users.length + 1200,
      pendingEventApprovals: data.events.filter(e => e.status === 'under_review').length,
      pendingKycApprovals: data.organizers.filter(o => o.kycStatus === 'pending' || o.kycStatus === 'in_review').length,
      pendingRefunds: data.orders.filter(o => o.refundStatus === 'pending').length,
      activePromoters: data.promoters.length
    };
  }
};
