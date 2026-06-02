import { PartnerStatus, VolunteerStatus } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import {
  type CampaignMessageInput,
  type PartnerCampaignFilters,
  type VolunteerCampaignFilters,
  VOLUNTEER_DAY_OPTIONS,
  VOLUNTEER_TEAM_OPTIONS,
  getPartnerCampaignRecipients,
  getVolunteerCampaignRecipients,
  sendCampaign,
} from '@/lib/mailing/campaigns';

type Audience = 'volunteers' | 'partners';

interface SendCampaignBody {
  audience: Audience;
  filters?: VolunteerCampaignFilters | PartnerCampaignFilters;
  message?: CampaignMessageInput;
  dryRun?: boolean;
}

async function checkAuth(request: NextRequest): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (session) return true;
  const token = await getToken({ req: request });
  return !!token;
}

function isCampaignMessageInput(value: unknown): value is CampaignMessageInput {
  if (!value || typeof value !== 'object') return false;
  const msg = value as Record<string, unknown>;
  return typeof msg.subject === 'string' && typeof msg.html === 'string';
}

function cleanVolunteerFilters(raw: unknown): VolunteerCampaignFilters {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    teams: Array.isArray(value.teams) ? value.teams.filter((entry): entry is string => typeof entry === 'string') : undefined,
    days: Array.isArray(value.days) ? value.days.filter((entry): entry is string => typeof entry === 'string') : undefined,
    missions: Array.isArray(value.missions)
      ? value.missions.filter((entry): entry is string => typeof entry === 'string')
      : undefined,
    statuses: Array.isArray(value.statuses)
      ? value.statuses.filter(
          (entry): entry is VolunteerStatus =>
            typeof entry === 'string' && Object.values(VolunteerStatus).includes(entry as VolunteerStatus),
        )
      : undefined,
    includeUnassignedTeam: typeof value.includeUnassignedTeam === 'boolean' ? value.includeUnassignedTeam : false,
    search: typeof value.search === 'string' ? value.search : undefined,
  };
}

function cleanPartnerFilters(raw: unknown): PartnerCampaignFilters {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    tiers: Array.isArray(value.tiers) ? value.tiers.filter((entry): entry is string => typeof entry === 'string') : undefined,
    statuses: Array.isArray(value.statuses)
      ? value.statuses.filter(
          (entry): entry is PartnerStatus =>
            typeof entry === 'string' && Object.values(PartnerStatus).includes(entry as PartnerStatus),
        )
      : undefined,
    assignedToId: typeof value.assignedToId === 'string' ? value.assignedToId : undefined,
    search: typeof value.search === 'string' ? value.search : undefined,
  };
}

export async function GET(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  return NextResponse.json({
    volunteer: {
      teams: VOLUNTEER_TEAM_OPTIONS,
      days: VOLUNTEER_DAY_OPTIONS,
      statuses: Object.values(VolunteerStatus),
    },
    partner: {
      statuses: Object.values(PartnerStatus),
    },
  });
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SendCampaignBody;
    const { audience, dryRun = false } = body;

    if (audience !== 'volunteers' && audience !== 'partners') {
      return NextResponse.json({ error: "audience doit être 'volunteers' ou 'partners'" }, { status: 400 });
    }

    if (!dryRun && !isCampaignMessageInput(body.message)) {
      return NextResponse.json({ error: 'message.subject et message.html sont requis' }, { status: 400 });
    }

    if (audience === 'volunteers') {
      const filters = cleanVolunteerFilters(body.filters);
      const recipients = await getVolunteerCampaignRecipients(filters);

      if (dryRun) {
        return NextResponse.json({
          audience,
          dryRun: true,
          totalRecipients: recipients.length,
          recipients,
        });
      }

      const result = await sendCampaign(recipients, body.message!);
      return NextResponse.json({ audience, ...result });
    }

    const filters = cleanPartnerFilters(body.filters);
    const recipients = await getPartnerCampaignRecipients(filters);

    if (dryRun) {
      return NextResponse.json({
        audience,
        dryRun: true,
        totalRecipients: recipients.length,
        recipients,
      });
    }

    const result = await sendCampaign(recipients, body.message!);
    return NextResponse.json({ audience, ...result });
  } catch (error) {
    console.error('Erreur mailing admin:', error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}
