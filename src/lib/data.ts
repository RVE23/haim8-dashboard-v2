import { supabase } from './supabase';

export interface Director {
    id: string;
    name: string;
    dob: string;
    address: string;
    role: string;
    status: string;
    appointment_date: string;
    resignation_date: string;
    linkedin_url: string;
    linkedin_found: boolean;
    linkedin_confidence_score: number | null;
    updated_at: string;
    company_id: string;
    company_name: string;
    company_number: string;
    registered_address: string;
    property_owned: boolean;
    phone: string;
    email: string;
    contact_enriched: boolean;
    notice_type: string;
    notice_date: string;
    notice_url: string;
    region: string;
    dateFound: string;
    directorStatus: 'Active' | 'Resigned';
}

export interface DashboardStats {
    totalDirectors: number;
    totalCompanies: number;
    activeDirectors: number;
    resignedDirectors: number;
    fullyEnriched: number;
    partialEnriched: number;
    noEnrichment: number;
    linkedInFound: number;
    withAddress: number;
    daysRunning: number;
    pipelineValue: number;
    totalNotices: number;
    noticeTypeCounts: Record<string, number>;
    regionCounts: Record<string, number>;
    roleCounts: Record<string, number>;
    propertyOwnedCount: number;
    pipelineHistory: { date: string; success: number; total: number }[];
    leadQualityTrend: { date: string; avgScore: number }[];
}

// Region mapping logic from original HTML
const PC_MAP: Record<string, string> = {
    EC: 'London', WC: 'London', E: 'London', N: 'London', NW: 'London', SE: 'London', SW: 'London', W: 'London',
    BR: 'London', CR: 'London', DA: 'London', EN: 'London', HA: 'London', IG: 'London', KT: 'London',
    RM: 'London', SM: 'London', TW: 'London', UB: 'London', WD: 'London',
    RH: 'South East', GU: 'South East', BN: 'South East', TN: 'South East', CT: 'South East',
    ME: 'South East', SO: 'South East', PO: 'South East', SP: 'South East',
    M: 'North West', WA: 'North West', SK: 'North West', WN: 'North West', BL: 'North West',
    OL: 'North West', PR: 'North West', BB: 'North West', FY: 'North West', LA: 'North West',
    CH: 'North West', CW: 'North West',
    B: 'West Midlands', CV: 'West Midlands', WV: 'West Midlands', WS: 'West Midlands',
    DY: 'West Midlands', ST: 'West Midlands', TF: 'West Midlands',
    S: 'Yorkshire', LS: 'Yorkshire', BD: 'Yorkshire', HX: 'Yorkshire', WF: 'Yorkshire',
    HG: 'Yorkshire', YO: 'Yorkshire', DN: 'Yorkshire', HU: 'Yorkshire',
    NG: 'East Midlands', DE: 'East Midlands', LE: 'East Midlands', NN: 'East Midlands',
    MK: 'East Midlands', LN: 'East Midlands',
    PE: 'East of England', CB: 'East of England', CO: 'East of England', IP: 'East of England',
    NR: 'East of England', CM: 'East of England', SS: 'East of England', SG: 'East of England',
    HP: 'East of England', AL: 'East of England', LU: 'East of England',
    OX: 'South West', SN: 'South West', BA: 'South West', BS: 'South West', GL: 'South West',
    HR: 'South West', WR: 'South West', DT: 'South West', BH: 'South West', EX: 'South West',
    PL: 'South West', TQ: 'South West', TR: 'South West', TA: 'South West',
    NE: 'North East', SR: 'North East', DH: 'North East', DL: 'North East', TS: 'North East',
    EH: 'Scotland', G: 'Scotland', KA: 'Scotland', ML: 'Scotland', PA: 'Scotland',
    KY: 'Scotland', DD: 'Scotland', PH: 'Scotland', AB: 'Scotland', IV: 'Scotland', KW: 'Scotland',
    CF: 'Wales', SA: 'Wales', NP: 'Wales', LD: 'Wales', LL: 'Wales', SY: 'Wales',
    BT: 'Northern Ireland'
};

export function getRegionFromAddress(addr: string): string {
    if (!addr) return 'Unknown';
    const m = addr.toUpperCase().match(/\b([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})\b/);
    if (!m) return 'Unknown';
    const pc = m[1].replace(/\s/g, '').slice(0, -3);
    const keys = Object.keys(PC_MAP).sort((a, b) => b.length - a.length);
    for (const k of keys) if (pc.startsWith(k)) return PC_MAP[k];
    return 'Unknown';
}

interface Company {
    company_name: string;
    company_number: string;
    registered_address: string;
    property_owned: boolean;
}

interface DirectorContact {
    phone: string;
    email: string;
    contact_enriched: boolean;
}

interface Notice {
    company_id: string;
    notice_type: string;
    notice_date: string;
    notice_url: string;
}

interface RawDirectorRecord {
    id: string;
    name: string;
    dob: string;
    address: string;
    role: string;
    status: string;
    appointment_date: string;
    resignation_date: string;
    linkedin_url: string;
    linkedin_found: boolean;
    linkedin_confidence_score: number | null;
    updated_at: string;
    company_id: string;
    companies: Company;
    director_contacts: DirectorContact[];
}

export async function fetchDashboardData() {
    const [dirsRes, noticesRes, runsRes] = await Promise.all([
        supabase.from('directors').select(`
      *,
      companies (*),
      director_contacts (*)
    `).limit(5000),
        supabase.from('notices').select('*').order('notice_date', { ascending: false }).limit(10000),
        supabase.from('pipeline_runs').select('*').order('started_at', { ascending: false }).limit(60)
    ]);

    if (dirsRes.error) throw dirsRes.error;
    if (noticesRes.error) throw noticesRes.error;

    const rawDirs = (dirsRes.data as unknown as RawDirectorRecord[]) || [];
    const rawNotices = (noticesRes.data as unknown as Notice[]) || [];
    const rawRuns = runsRes.data || [];

    const noticeMap: Record<string, Notice> = {};
    rawNotices.forEach(n => {
        if (n.company_id && !noticeMap[n.company_id]) noticeMap[n.company_id] = n;
    });

    const directors: Director[] = rawDirs.map(d => {
        const co = d.companies || {} as Company;
        const dc = (d.director_contacts && d.director_contacts.length > 0) ? d.director_contacts[0] : {} as DirectorContact;
        const not = noticeMap[d.company_id] || {} as Notice;
        const addr = d.address || '';

        return {
            id: d.id,
            name: d.name,
            dob: d.dob,
            address: d.address,
            role: d.role,
            status: d.status,
            appointment_date: d.appointment_date,
            resignation_date: d.resignation_date,
            linkedin_url: d.linkedin_url,
            linkedin_found: d.linkedin_found,
            linkedin_confidence_score: d.linkedin_confidence_score,
            updated_at: d.updated_at,
            company_id: d.company_id,
            company_name: co.company_name || '',
            company_number: co.company_number || '',
            registered_address: co.registered_address || '',
            property_owned: !!co.property_owned,
            phone: dc.phone || '',
            email: dc.email || '',
            contact_enriched: !!dc.contact_enriched,
            notice_type: not.notice_type || '',
            notice_date: not.notice_date || '',
            notice_url: not.notice_url || '',
            region: getRegionFromAddress(addr) || getRegionFromAddress(co.registered_address),
            dateFound: (d.updated_at || '').slice(0, 10),
            directorStatus: String(d.status || '').toLowerCase() === 'active' ? 'Active' : 'Resigned',
        };
    });

    // Calculate Summary
    const allCos = new Set(directors.map(d => d.company_number).filter(Boolean));
    const fullyEnriched = directors.filter(d => d.phone || d.email);
    const partial = directors.filter(d => (d.address || d.linkedin_found) && !d.phone && !d.email);
    const noEnrich = directors.filter(d => !d.address && !d.linkedin_found && !d.phone && !d.email);

    const dates = directors.map(d => d.dateFound).filter(Boolean).sort();
    let daysRunning = 0;
    if (dates.length) {
        daysRunning = Math.round((new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / 86400000) + 1;
    }

    const noticeTypeCounts: Record<string, number> = {};
    const regionCounts: Record<string, number> = {};
    const roleCounts: Record<string, number> = {};
    const dailyCounts: Record<string, { success: number; total: number }> = {};
    const dailyScores: Record<string, { sum: number; count: number }> = {};

    directors.forEach(d => {
        if (d.notice_type) noticeTypeCounts[d.notice_type] = (noticeTypeCounts[d.notice_type] || 0) + 1;
        if (d.region && d.region !== 'Unknown') regionCounts[d.region] = (regionCounts[d.region] || 0) + 1;
        if (d.role) roleCounts[d.role] = (roleCounts[d.role] || 0) + 1;

        if (d.dateFound) {
            if (!dailyCounts[d.dateFound]) dailyCounts[d.dateFound] = { success: 0, total: 0 };
            dailyCounts[d.dateFound].total++;
            if (d.phone || d.email) dailyCounts[d.dateFound].success++;

            if (d.linkedin_confidence_score !== null) {
                if (!dailyScores[d.dateFound]) dailyScores[d.dateFound] = { sum: 0, count: 0 };
                dailyScores[d.dateFound].sum += d.linkedin_confidence_score;
                dailyScores[d.dateFound].count++;
            }
        }
    });

    const pipelineHistory = Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, counts]) => ({ date, ...counts }))
        .slice(-14); // Last 14 days

    const leadQualityTrend = Object.entries(dailyScores)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, scores]) => ({ date, avgScore: Math.round(scores.sum / scores.count) }))
        .slice(-14);

    const stats: DashboardStats = {
        totalDirectors: directors.length,
        totalCompanies: allCos.size,
        activeDirectors: directors.filter(d => d.directorStatus === 'Active').length,
        resignedDirectors: directors.filter(d => d.directorStatus === 'Resigned').length,
        fullyEnriched: fullyEnriched.length,
        partialEnriched: partial.length,
        noEnrichment: noEnrich.length,
        linkedInFound: directors.filter(d => d.linkedin_found).length,
        withAddress: directors.filter(d => d.address).length,
        daysRunning,
        pipelineValue: fullyEnriched.length * 50,
        totalNotices: rawNotices.length || allCos.size,
        noticeTypeCounts,
        regionCounts,
        roleCounts,
        propertyOwnedCount: directors.filter(d => d.property_owned).length,
        pipelineHistory,
        leadQualityTrend,
    };

    return {
        directors,
        stats,
        pipelineLog: rawRuns.map(r => ({
            timestamp: (r.started_at || '').slice(0, 19).replace('T', ' '),
            status: r.status || '',
        })),
    };
}
