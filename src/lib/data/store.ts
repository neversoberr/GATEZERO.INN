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
  PlatformStats,
  AppNotification
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
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from './initial-data';

const DB_VERSION = 3;

interface DatabaseSchema {
  version: number;
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
  notifications: AppNotification[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'gatezero_db.json');

// In-memory fallback if file system access fails in edge runtimes
function seedDb(): DatabaseSchema {
  return {
    version: DB_VERSION,
    users: [...INITIAL_USERS],
    organizers: [...INITIAL_ORGANIZERS],
    events: [...INITIAL_EVENTS],
    ticketTiers: [...INITIAL_TICKET_TIERS],
    promoCodes: [...INITIAL_PROMO_CODES],
    promoters: [...INITIAL_PROMOTERS],
    orders: [...INITIAL_ORDERS],
    checkIns: [...INITIAL_CHECKINS],
    settlements: [...INITIAL_SETTLEMENTS],
    auditLogs: [...INITIAL_AUDIT_LOGS],
    notifications: [...INITIAL_NOTIFICATIONS]
  };
}

let memoryDb: DatabaseSchema = seedDb();

function mergeById<T extends { id: string }>(current: T[] | undefined, seed: T[]): T[] {
  const list = [...(current || [])];
  seed.forEach((item) => {
    if (!list.some((existing) => existing.id === item.id)) {
      list.push(item);
    }
  });
  return list;
}

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
    const merged: DatabaseSchema = {
      version: DB_VERSION,
      users: mergeById(parsed.users, INITIAL_USERS),
      organizers: mergeById(parsed.organizers, INITIAL_ORGANIZERS),
      events: mergeById(parsed.events, INITIAL_EVENTS),
      ticketTiers: mergeById(parsed.ticketTiers, INITIAL_TICKET_TIERS),
      promoCodes: mergeById(parsed.promoCodes, INITIAL_PROMO_CODES),
      promoters: mergeById(parsed.promoters, INITIAL_PROMOTERS),
      orders: mergeById(parsed.orders, INITIAL_ORDERS),
      checkIns: parsed.checkIns || INITIAL_CHECKINS,
      settlements: mergeById(parsed.settlements, INITIAL_SETTLEMENTS),
      auditLogs: parsed.auditLogs || INITIAL_AUDIT_LOGS,
      notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
    };
    if (parsed.version !== DB_VERSION) {
      writeDb(merged);
    }
    return merged;
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

    if (filters?.status && filters.status !== 'all') {
      list = list.filter(e => e.status === filters.status);
    } else if (!filters?.status) {
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

  getAllEvents(): Event[] {
    return [...readDb().events];
  },

  incrementEventViews(id: string): void {
    const data = readDb();
    const event = data.events.find(e => e.id === id);
    if (!event) return;
    event.viewsCount += 1;
    writeDb(data);
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

  createOrganizer(organizer: OrganizerCompany, ownerUserId?: string): OrganizerCompany {
    const data = readDb();
    data.organizers.unshift(organizer);
    if (ownerUserId) {
      const user = data.users.find(u => u.id === ownerUserId);
      if (user) {
        user.role = 'organizer';
        user.organizerCompanyId = organizer.id;
        user.isVerified = true;
      }
    }
    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: organizer.email,
      action: 'ORGANIZER_ONBOARDED',
      targetType: 'organizer',
      targetId: organizer.id,
      details: `KYC application received for ${organizer.name} (${organizer.city}).`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });
    data.notifications.unshift({
      id: `ntf_${Date.now()}`,
      userId: 'user_super_admin',
      title: 'NEW ORGANIZER KYC',
      body: `${organizer.name} submitted verification documents for review.`,
      type: 'system',
      read: false,
      href: '/admin',
      createdAt: new Date().toISOString()
    });
    writeDb(data);
    return organizer;
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

    data.notifications.unshift({
      id: `ntf_${Date.now()}`,
      userId: order.userId,
      title: 'ACCESS CONFIRMED',
      body: `Order ${order.orderNumber} is live. ${order.attendees.length} pass${order.attendees.length === 1 ? '' : 'es'} for ${order.eventTitle}.`,
      type: 'order',
      read: false,
      href: '/tickets',
      createdAt: new Date().toISOString()
    });

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

    data.notifications.unshift({
      id: `ntf_${Date.now()}`,
      userId: order.userId,
      title: 'REFUND CLAIM FILED',
      body: `Refund for ${order.orderNumber} is with Gate Zero compliance.`,
      type: 'refund',
      read: false,
      href: '/tickets?tab=refunds',
      createdAt: new Date().toISOString()
    });
    data.notifications.unshift({
      id: `ntf_admin_${Date.now()}`,
      userId: 'user_super_admin',
      title: 'REFUND QUEUE',
      body: `${order.customerName} requested a refund on ${order.orderNumber}.`,
      type: 'refund',
      read: false,
      href: '/admin',
      createdAt: new Date().toISOString()
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

    data.notifications.unshift({
      id: `ntf_${Date.now()}`,
      userId: order.userId,
      title: approved ? 'REFUND RELEASED' : 'REFUND DECLINED',
      body: approved
        ? `₹${order.totalAmount.toLocaleString('en-IN')} will return to the original payment rail for ${order.orderNumber}.`
        : `Refund claim for ${order.orderNumber} was declined. Pass remains valid.`,
      type: 'refund',
      read: false,
      href: '/tickets?tab=refunds',
      createdAt: new Date().toISOString()
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

    const needle = ticketCode.trim().toLowerCase();
    if (needle.length >= 3) {
      for (const order of data.orders) {
        const attendee = order.attendees.find(a =>
          a.fullName.toLowerCase().includes(needle) || a.email.toLowerCase().includes(needle)
        );
        if (attendee) {
          return { order, attendee };
        }
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

  addAuditLog(entry: Omit<AdminAuditLog, 'id' | 'timestamp' | 'ipAddress'> & Partial<Pick<AdminAuditLog, 'id' | 'timestamp' | 'ipAddress'>>): void {
    const data = readDb();
    data.auditLogs.unshift({
      id: entry.id || `log_${Date.now()}`,
      adminEmail: entry.adminEmail,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      details: entry.details,
      timestamp: entry.timestamp || new Date().toISOString(),
      ipAddress: entry.ipAddress || '127.0.0.1'
    });
    writeDb(data);
  },

  savePromoCode(promo: PromoCode): PromoCode {
    const data = readDb();
    const idx = data.promoCodes.findIndex(p => p.id === promo.id || p.code.toUpperCase() === promo.code.toUpperCase());
    if (idx >= 0) {
      data.promoCodes[idx] = promo;
    } else {
      data.promoCodes.unshift(promo);
    }
    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: 'organizer@gatezero.in',
      action: 'PROMO_CREATED',
      targetType: 'promo',
      targetId: promo.id,
      details: `Promo ${promo.code} (${promo.discountType} ${promo.discountValue}) is live.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    });
    writeDb(data);
    return promo;
  },

  incrementPromoterClicks(code: string): PromoterProfile | undefined {
    const data = readDb();
    const promoter = data.promoters.find(p => p.code.toLowerCase() === code.toLowerCase());
    if (!promoter) return undefined;
    promoter.totalClicks += 1;
    writeDb(data);
    return promoter;
  },

  loginUser(emailOrPhone: string): User | undefined {
    const needle = emailOrPhone.trim().toLowerCase();
    return readDb().users.find(u =>
      u.email.toLowerCase() === needle ||
      u.phone.replace(/\s/g, '').includes(needle.replace(/\s/g, ''))
    );
  },

  signupUser(input: { name: string; email: string; phone: string; city?: string }): { user: User; created: boolean } {
    const existing = this.loginUser(input.email) || this.loginUser(input.phone);
    if (existing) {
      return { user: existing, created: false };
    }
    const user: User = {
      id: `user_${Date.now()}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      role: 'customer',
      city: input.city || 'Mumbai',
      savedEventIds: [],
      followedOrganizerIds: [],
      createdAt: new Date().toISOString(),
      isVerified: true,
      notificationPrefs: { email: true, sms: true, drops: true }
    };
    const data = readDb();
    data.users.unshift(user);
    data.notifications.unshift({
      id: `ntf_welcome_${user.id}`,
      userId: user.id,
      title: 'WELCOME THROUGH THE GATE',
      body: 'Your identity is live. Save events, buy passes, and keep QR tickets in your wallet.',
      type: 'system',
      read: false,
      href: '/events',
      createdAt: new Date().toISOString()
    });
    writeDb(data);
    return { user, created: true };
  },

  getNotifications(userId: string): AppNotification[] {
    return readDb().notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  markNotificationsRead(userId: string, notificationId?: string): void {
    const data = readDb();
    data.notifications.forEach(n => {
      if (n.userId === userId && (!notificationId || n.id === notificationId)) {
        n.read = true;
      }
    });
    writeDb(data);
  },

  createNotification(notification: AppNotification): AppNotification {
    const data = readDb();
    data.notifications.unshift(notification);
    writeDb(data);
    return notification;
  },

  broadcastToEvent(eventId: string, title: string, body: string): number {
    const data = readDb();
    const recipients = new Set<string>();
    data.orders
      .filter(o => o.eventId === eventId && o.paymentStatus === 'paid')
      .forEach(order => {
        recipients.add(order.userId);
        order.attendees.forEach(att => {
          const match = data.users.find(u => u.email.toLowerCase() === att.email.toLowerCase());
          if (match) recipients.add(match.id);
        });
      });

    const timestamp = new Date().toISOString();
    recipients.forEach(userId => {
      data.notifications.unshift({
        id: `ntf_bc_${Date.now()}_${userId}`,
        userId,
        title,
        body,
        type: 'broadcast',
        read: false,
        href: '/tickets',
        createdAt: timestamp
      });
    });

    data.auditLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail: 'organizer@gatezero.in',
      action: 'ATTENDEE_BROADCAST',
      targetType: 'event',
      targetId: eventId,
      details: `Broadcast "${title}" sent to ${recipients.size} attendees.`,
      timestamp,
      ipAddress: '127.0.0.1'
    });

    writeDb(data);
    return recipients.size;
  },

  getReports() {
    const data = readDb();
    const paid = data.orders.filter(o => o.paymentStatus === 'paid' || o.paymentStatus === 'partially_refunded');
    const gmvByCity: Record<string, number> = {};
    const ticketsByCategory: Record<string, number> = {};
    paid.forEach(order => {
      gmvByCity[order.eventCity] = (gmvByCity[order.eventCity] || 0) + order.totalAmount;
      const event = data.events.find(e => e.id === order.eventId);
      const cat = event?.category || 'other';
      ticketsByCategory[cat] = (ticketsByCategory[cat] || 0) + order.attendees.length;
    });
    const refunded = data.orders.filter(o => o.paymentStatus === 'refunded' || o.refundStatus === 'pending' || o.refundStatus === 'approved');
    const topEvents = [...data.events]
      .sort((a, b) => b.totalTicketsSold - a.totalTicketsSold)
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        title: e.title,
        city: e.city,
        ticketsSold: e.totalTicketsSold,
        capacity: e.totalCapacity,
        status: e.status
      }));

    return {
      gmvByCity,
      ticketsByCategory,
      refundCount: refunded.length,
      paidOrderCount: paid.length,
      refundRate: paid.length ? Number(((refunded.length / data.orders.length) * 100).toFixed(2)) : 0,
      topEvents,
      pendingKyc: data.organizers.filter(o => o.kycStatus === 'pending' || o.kycStatus === 'in_review').length,
      pendingApprovals: data.events.filter(e => e.status === 'under_review').length
    };
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
