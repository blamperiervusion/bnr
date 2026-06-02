'use client';

import { useMemo, useState } from 'react';

type Audience = 'volunteers' | 'partners';

type Recipient = {
  id: string;
  email: string;
  displayName: string;
};

type PreviewResponse = {
  audience: Audience;
  dryRun: true;
  totalRecipients: number;
  recipients: Recipient[];
};

type SendResponse = {
  audience: Audience;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  failures: { email: string; reason: string }[];
};

const volunteerStatuses = ['PENDING', 'VALIDATED', 'REFUSED'];
const partnerStatuses = ['PENDING', 'CONTACTED', 'VALIDATED', 'REFUSED'];

const volunteerDays = [
  { id: 'montage', label: 'Installation (montage)' },
  { id: 'vendredi', label: 'Vendredi' },
  { id: 'samedi', label: 'Samedi' },
  { id: 'dimanche', label: 'Dimanche' },
  { id: 'demontage', label: 'Démontage' },
];

const volunteerTeams = [
  'Accueil',
  'Bar',
  'Sécurité',
  'Technique',
  'Éco-équipe',
  'Animation',
  'Merchandising',
  'Artistes',
  'Cashless',
];

const volunteerMissions = [
  'accueil',
  'bar',
  'securite',
  'technique',
  'eco',
  'animation',
  'merchandising',
  'artistes',
  'cashless',
];

const partnerTiers = [
  'chaos',
  'headbanger',
  'moshpit',
  'supporter',
  'echange',
  'institutional',
  'media',
  'technical',
];

function toggleArrayValue(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values.filter((entry) => entry !== value);
  }
  return [...values, value];
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildSimpleHtmlFromText(text: string): string {
  const safe = escapeHtml(text.trim());
  if (!safe) return '<p></p>';

  const paragraphs = safe
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replaceAll('\n', '<br />'))
    .map((paragraph) => `<p style="margin: 0 0 14px 0;">${paragraph}</p>`)
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
      ${paragraphs}
    </div>
  `;
}

export default function MailingPage() {
  const [messageMode, setMessageMode] = useState<'simple' | 'html'>('simple');
  const [audience, setAudience] = useState<Audience>('volunteers');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [volunteerFilters, setVolunteerFilters] = useState({
    statuses: ['VALIDATED'],
    teams: [] as string[],
    days: [] as string[],
    missions: [] as string[],
    includeUnassignedTeam: false,
    search: '',
  });

  const [partnerFilters, setPartnerFilters] = useState({
    statuses: ['VALIDATED'],
    tiers: [] as string[],
    search: '',
  });

  const [message, setMessage] = useState({
    subject: '',
    simpleText: 'Bonjour,\n\n',
    html: '<p>Bonjour,</p><p></p><p>L’équipe Barb\'n\'Rock</p>',
    text: '',
    replyTo: '',
  });

  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [sendResult, setSendResult] = useState<SendResponse | null>(null);

  const currentFilters = useMemo(() => {
    if (audience === 'volunteers') {
      return volunteerFilters;
    }
    return partnerFilters;
  }, [audience, volunteerFilters, partnerFilters]);

  const runPreview = async () => {
    setIsLoading(true);
    setFeedback(null);
    setSendResult(null);

    try {
      const response = await fetch('/api/admin/mailing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience,
          dryRun: true,
          filters: currentFilters,
        }),
      });

      const data = (await response.json()) as PreviewResponse | { error?: string };
      if (!response.ok) {
        setFeedback({
          type: 'error',
          text: ('error' in data ? data.error : undefined) || "Impossible de générer l'aperçu",
        });
        return;
      }

      setPreview(data as PreviewResponse);
      setFeedback({
        type: 'success',
        text: `Aperçu prêt : ${(data as PreviewResponse).totalRecipients} destinataire(s).`,
      });
    } catch {
      setFeedback({ type: 'error', text: "Erreur réseau pendant l'aperçu" });
    } finally {
      setIsLoading(false);
    }
  };

  const runSend = async () => {
    const computedHtml =
      messageMode === 'simple'
        ? buildSimpleHtmlFromText(message.simpleText)
        : message.html.trim();

    if (!message.subject.trim() || !computedHtml.trim()) {
      setFeedback({ type: 'error', text: 'Sujet et contenu requis pour envoyer.' });
      return;
    }

    if (!confirm('Confirmer l’envoi de cette campagne ?')) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    setSendResult(null);

    try {
      const response = await fetch('/api/admin/mailing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience,
          filters: currentFilters,
          message: {
            subject: message.subject,
            html: computedHtml,
            text: message.text || undefined,
            replyTo: message.replyTo || undefined,
          },
        }),
      });

      const data = (await response.json()) as SendResponse | { error?: string };
      if (!response.ok) {
        setFeedback({
          type: 'error',
          text: ('error' in data ? data.error : undefined) || "Impossible d'envoyer la campagne",
        });
        return;
      }

      setSendResult(data as SendResponse);
      setFeedback({
        type: 'success',
        text: `Envoi terminé : ${(data as SendResponse).sentCount}/${(data as SendResponse).totalRecipients} envoyés.`,
      });
    } catch {
      setFeedback({ type: 'error', text: "Erreur réseau pendant l'envoi" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white">Mailing</h1>
          <p className="text-gray-400 text-sm mt-1">
            Cibler des bénévoles ou partenaires, prévisualiser, puis envoyer.
          </p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg p-4">
        <p className="text-sm text-gray-400 mb-3">Audience</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAudience('volunteers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              audience === 'volunteers'
                ? 'bg-[#e53e3e]/20 text-[#e53e3e] border border-[#e53e3e]/50'
                : 'bg-[#0a0a0a] text-gray-400 border border-[#333] hover:text-white'
            }`}
          >
            🙋 Bénévoles
          </button>
          <button
            type="button"
            onClick={() => setAudience('partners')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              audience === 'partners'
                ? 'bg-[#e53e3e]/20 text-[#e53e3e] border border-[#e53e3e]/50'
                : 'bg-[#0a0a0a] text-gray-400 border border-[#333] hover:text-white'
            }`}
          >
            🤝 Partenaires
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-5">
          <h2 className="text-white font-semibold">Filtres</h2>

          {audience === 'volunteers' ? (
            <>
              <div>
                <p className="text-sm text-gray-400 mb-2">Statuts</p>
                <div className="flex flex-wrap gap-2">
                  {volunteerStatuses.map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={volunteerFilters.statuses.includes(status)}
                        onChange={() =>
                          setVolunteerFilters((prev) => ({
                            ...prev,
                            statuses: toggleArrayValue(prev.statuses, status),
                          }))
                        }
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Équipes</p>
                <div className="grid grid-cols-2 gap-2">
                  {volunteerTeams.map((team) => (
                    <label key={team} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={volunteerFilters.teams.includes(team)}
                        onChange={() =>
                          setVolunteerFilters((prev) => ({
                            ...prev,
                            teams: toggleArrayValue(prev.teams, team),
                          }))
                        }
                      />
                      {team}
                    </label>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-400 mt-3">
                  <input
                    type="checkbox"
                    checked={volunteerFilters.includeUnassignedTeam}
                    onChange={(e) =>
                      setVolunteerFilters((prev) => ({ ...prev, includeUnassignedTeam: e.target.checked }))
                    }
                  />
                  Inclure aussi les non attribués
                </label>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Jours</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {volunteerDays.map((day) => (
                    <label key={day.id} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={volunteerFilters.days.includes(day.id)}
                        onChange={() =>
                          setVolunteerFilters((prev) => ({
                            ...prev,
                            days: toggleArrayValue(prev.days, day.id),
                          }))
                        }
                      />
                      {day.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Missions</p>
                <div className="grid grid-cols-2 gap-2">
                  {volunteerMissions.map((mission) => (
                    <label key={mission} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={volunteerFilters.missions.includes(mission)}
                        onChange={() =>
                          setVolunteerFilters((prev) => ({
                            ...prev,
                            missions: toggleArrayValue(prev.missions, mission),
                          }))
                        }
                      />
                      {mission}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Recherche (nom/email)</label>
                <input
                  value={volunteerFilters.search}
                  onChange={(e) => setVolunteerFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
                  placeholder="Ex: artiste, @gmail.com ..."
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-400 mb-2">Statuts</p>
                <div className="flex flex-wrap gap-2">
                  {partnerStatuses.map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={partnerFilters.statuses.includes(status)}
                        onChange={() =>
                          setPartnerFilters((prev) => ({
                            ...prev,
                            statuses: toggleArrayValue(prev.statuses, status),
                          }))
                        }
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Niveaux</p>
                <div className="grid grid-cols-2 gap-2">
                  {partnerTiers.map((tier) => (
                    <label key={tier} className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={partnerFilters.tiers.includes(tier)}
                        onChange={() =>
                          setPartnerFilters((prev) => ({
                            ...prev,
                            tiers: toggleArrayValue(prev.tiers, tier),
                          }))
                        }
                      />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Recherche (entreprise/contact/email)</label>
                <input
                  value={partnerFilters.search}
                  onChange={(e) => setPartnerFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
                  placeholder="Ex: mairie, média, .fr ..."
                />
              </div>
            </>
          )}
        </section>

        <section className="bg-[#111] border border-[#222] rounded-lg p-5 space-y-4">
          <h2 className="text-white font-semibold">Message</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Sujet</label>
            <input
              value={message.subject}
              onChange={(e) => setMessage((prev) => ({ ...prev, subject: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
              placeholder="Sujet du mail"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Reply-to (optionnel)</label>
            <input
              value={message.replyTo}
              onChange={(e) => setMessage((prev) => ({ ...prev, replyTo: e.target.value }))}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
              placeholder="barbnrock.festival@gmail.com"
            />
          </div>

          <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-2">Mode de rédaction</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMessageMode('simple')}
                className={`px-3 py-1.5 rounded text-sm border ${
                  messageMode === 'simple'
                    ? 'border-[#e53e3e]/50 text-[#e53e3e] bg-[#e53e3e]/10'
                    : 'border-[#333] text-gray-300 hover:text-white'
                }`}
              >
                Texte libre (simple)
              </button>
              <button
                type="button"
                onClick={() => setMessageMode('html')}
                className={`px-3 py-1.5 rounded text-sm border ${
                  messageMode === 'html'
                    ? 'border-[#e53e3e]/50 text-[#e53e3e] bg-[#e53e3e]/10'
                    : 'border-[#333] text-gray-300 hover:text-white'
                }`}
              >
                HTML avancé
              </button>
            </div>
          </div>

          {messageMode === 'simple' ? (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Texte du message</label>
              <textarea
                value={message.simpleText}
                onChange={(e) => setMessage((prev) => ({ ...prev, simpleText: e.target.value }))}
                rows={10}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
                placeholder={'Bonjour,\n\nVoici les informations importantes...\n\nL’équipe Barb\'n\'Rock'}
              />
              <p className="text-xs text-gray-500 mt-2">
                Le texte est automatiquement transformé en email HTML propre (paragraphes + sauts de ligne).
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-gray-400 mb-1">HTML</label>
              <textarea
                value={message.html}
                onChange={(e) => setMessage((prev) => ({ ...prev, html: e.target.value }))}
                rows={10}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white font-mono text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">Texte brut (optionnel)</label>
            <textarea
              value={message.text}
              onChange={(e) => setMessage((prev) => ({ ...prev, text: e.target.value }))}
              rows={4}
              className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={runPreview}
              disabled={isLoading}
              className="px-4 py-2 bg-[#0a0a0a] border border-[#333] text-white rounded-lg hover:border-[#666] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Chargement...' : 'Prévisualiser les destinataires'}
            </button>
            <button
              type="button"
              onClick={runSend}
              disabled={isLoading}
              className="px-4 py-2 bg-[#e53e3e] text-white rounded-lg hover:bg-[#c53030] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Envoi...' : 'Envoyer la campagne'}
            </button>
          </div>
        </section>
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-lg border ${
            feedback.type === 'success'
              ? 'bg-green-500/10 border-green-500/40 text-green-400'
              : 'bg-red-500/10 border-red-500/40 text-red-400'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {preview && (
        <div className="bg-[#111] border border-[#222] rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Aperçu des destinataires</h3>
            <span className="text-sm text-gray-400">{preview.totalRecipients} contact(s)</span>
          </div>
          {preview.recipients.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun destinataire avec ces filtres.</p>
          ) : (
            <div className="max-h-80 overflow-auto space-y-2">
              {preview.recipients.slice(0, 200).map((recipient) => (
                <div key={recipient.id} className="p-2 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                  <p className="text-sm text-white">{recipient.displayName}</p>
                  <p className="text-xs text-gray-400">{recipient.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {sendResult && (
        <div className="bg-[#111] border border-[#222] rounded-lg p-5">
          <h3 className="text-white font-semibold mb-3">Résultat d&apos;envoi</h3>
          <p className="text-sm text-gray-300">
            Envoyés: <span className="text-green-400">{sendResult.sentCount}</span> / {sendResult.totalRecipients}
          </p>
          {sendResult.failedCount > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-red-400">{sendResult.failedCount} échec(s):</p>
              <div className="max-h-64 overflow-auto space-y-2">
                {sendResult.failures.map((failure) => (
                  <div key={`${failure.email}-${failure.reason}`} className="p-2 rounded bg-[#0a0a0a] border border-[#331919]">
                    <p className="text-sm text-white">{failure.email}</p>
                    <p className="text-xs text-red-400">{failure.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
