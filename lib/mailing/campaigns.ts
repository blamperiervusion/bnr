import { PartnerStatus, VolunteerStatus, type Prisma } from '@prisma/client';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';

export const VOLUNTEER_DAY_OPTIONS = [
  'montage',
  'vendredi',
  'samedi',
  'dimanche',
  'demontage',
] as const;

export const VOLUNTEER_TEAM_OPTIONS = [
  'Accueil',
  'Bar',
  'Sécurité',
  'Technique',
  'Éco-équipe',
  'Animation',
  'Merchandising',
  'Artistes',
  'Cashless',
] as const;

const VOLUNTEER_DAY_ALIASES: Record<string, (typeof VOLUNTEER_DAY_OPTIONS)[number]> = {
  installation: 'montage',
  montage: 'montage',
  vendredi: 'vendredi',
  saturday: 'samedi',
  samedi: 'samedi',
  sunday: 'dimanche',
  dimanche: 'dimanche',
  desinstallation: 'demontage',
  démontage: 'demontage',
  demontage: 'demontage',
};

let resend: Resend | null = null;

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export interface VolunteerCampaignFilters {
  teams?: string[];
  days?: string[];
  statuses?: VolunteerStatus[];
  missions?: string[];
  includeUnassignedTeam?: boolean;
  search?: string;
}

export interface PartnerCampaignFilters {
  statuses?: PartnerStatus[];
  tiers?: string[];
  assignedToId?: string;
  search?: string;
}

export interface CampaignMessageInput {
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export interface CampaignRecipient {
  id: string;
  email: string;
  displayName: string;
}

export interface CampaignSendResult {
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  failures: { email: string; reason: string }[];
}

export interface CampaignPreviewResult {
  totalRecipients: number;
  recipients: CampaignRecipient[];
}

function normalizeDayFilters(days: string[] | undefined): (typeof VOLUNTEER_DAY_OPTIONS)[number][] {
  if (!days || days.length === 0) return [];

  const normalized = new Set<(typeof VOLUNTEER_DAY_OPTIONS)[number]>();
  for (const day of days) {
    const cleaned = day.trim().toLowerCase();
    const alias = VOLUNTEER_DAY_ALIASES[cleaned];
    if (alias) normalized.add(alias);
  }

  return Array.from(normalized);
}

function buildVolunteerWhere(filters: VolunteerCampaignFilters): Prisma.VolunteerWhereInput {
  const where: Prisma.VolunteerWhereInput = {};
  const normalizedDays = normalizeDayFilters(filters.days);

  if (filters.statuses && filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  } else {
    where.status = VolunteerStatus.VALIDATED;
  }

  if (filters.teams && filters.teams.length > 0) {
    if (filters.includeUnassignedTeam) {
      where.OR = [{ team: { in: filters.teams } }, { team: null }];
    } else {
      where.team = { in: filters.teams };
    }
  } else if (filters.includeUnassignedTeam) {
    where.team = null;
  }

  if (normalizedDays.length > 0) {
    where.disponibilites = { hasSome: normalizedDays };
  }

  if (filters.missions && filters.missions.length > 0) {
    where.missions = { hasSome: filters.missions };
  }

  if (filters.search && filters.search.trim()) {
    const query = filters.search.trim();
    where.AND = [
      ...(where.AND ?? []),
      {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
    ];
  }

  return where;
}

function buildPartnerWhere(filters: PartnerCampaignFilters): Prisma.PartnerWhereInput {
  const where: Prisma.PartnerWhereInput = {};

  if (filters.statuses && filters.statuses.length > 0) {
    where.status = { in: filters.statuses };
  }

  if (filters.tiers && filters.tiers.length > 0) {
    where.tier = { in: filters.tiers };
  }

  if (filters.assignedToId && filters.assignedToId.trim()) {
    where.assignedToId = filters.assignedToId.trim();
  }

  if (filters.search && filters.search.trim()) {
    const query = filters.search.trim();
    where.OR = [
      { company: { contains: query, mode: 'insensitive' } },
      { contact: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ];
  }

  return where;
}

function deduplicateRecipients(recipients: CampaignRecipient[]): CampaignRecipient[] {
  const byEmail = new Map<string, CampaignRecipient>();

  for (const recipient of recipients) {
    const email = recipient.email.trim().toLowerCase();
    if (!email) continue;
    if (!byEmail.has(email)) {
      byEmail.set(email, { ...recipient, email });
    }
  }

  return Array.from(byEmail.values());
}

export async function getVolunteerCampaignRecipients(
  filters: VolunteerCampaignFilters,
): Promise<CampaignRecipient[]> {
  const volunteers = await prisma.volunteer.findMany({
    where: buildVolunteerWhere(filters),
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: [{ team: 'asc' }, { name: 'asc' }],
  });

  return deduplicateRecipients(
    volunteers.map((volunteer) => ({
      id: volunteer.id,
      email: volunteer.email,
      displayName: volunteer.name,
    })),
  );
}

export async function getPartnerCampaignRecipients(
  filters: PartnerCampaignFilters,
): Promise<CampaignRecipient[]> {
  const partners = await prisma.partner.findMany({
    where: buildPartnerWhere(filters),
    select: {
      id: true,
      contact: true,
      email: true,
    },
    orderBy: [{ company: 'asc' }],
  });

  return deduplicateRecipients(
    partners.map((partner) => ({
      id: partner.id,
      email: partner.email,
      displayName: partner.contact,
    })),
  );
}

export async function sendCampaign(
  recipients: CampaignRecipient[],
  message: CampaignMessageInput,
): Promise<CampaignSendResult> {
  const sender = message.from || process.env.EMAIL_FROM || "Barb'n'Rock Festival <noreply@barbnrock-festival.fr>";
  const uniqueRecipients = deduplicateRecipients(recipients);

  if (uniqueRecipients.length === 0) {
    return {
      totalRecipients: 0,
      sentCount: 0,
      failedCount: 0,
      failures: [],
    };
  }

  const r = getResend();
  const failures: { email: string; reason: string }[] = [];
  let sentCount = 0;

  for (const recipient of uniqueRecipients) {
    try {
      const { error } = await r.emails.send({
        from: sender,
        to: recipient.email,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
      });

      if (error) {
        failures.push({ email: recipient.email, reason: error.message || 'Unknown resend error' });
      } else {
        sentCount += 1;
      }
    } catch (error) {
      failures.push({
        email: recipient.email,
        reason: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return {
    totalRecipients: uniqueRecipients.length,
    sentCount,
    failedCount: failures.length,
    failures,
  };
}

export async function previewVolunteerCampaign(
  filters: VolunteerCampaignFilters,
): Promise<CampaignPreviewResult> {
  const recipients = await getVolunteerCampaignRecipients(filters);
  return { totalRecipients: recipients.length, recipients };
}

export async function previewPartnerCampaign(
  filters: PartnerCampaignFilters,
): Promise<CampaignPreviewResult> {
  const recipients = await getPartnerCampaignRecipients(filters);
  return { totalRecipients: recipients.length, recipients };
}
