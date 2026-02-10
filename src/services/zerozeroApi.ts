import type { Player } from '../types';
import { searchPlayers as searchMock } from '../data/mockPlayers';

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  club: string;
  url: string;
}

interface PlayerApiResponse {
  id: string;
  name: string;
  fullName: string;
  club: string;
  dateOfBirth: string;
  age: number;
  preferredFoot: string;
  height: number;
  position: string;
  photoUrl: string | null;
  nationality: string;
  sourceUrl: string;
}

const API_BASE = '/api';

/**
 * Parse a zerozero.pt URL and extract slug + ID.
 * Supports formats:
 *   https://www.zerozero.pt/jogador/rafael-basto/781893
 *   https://www.zerozero.pt/jogador/rafael-basto/781893?epoca_id=155
 *   https://zerozero.pt/player.php?id=8967
 */
export function parseZerozeroUrl(input: string): { id: string; slug: string } | null {
  const trimmed = input.trim();

  // New format: /jogador/slug/id
  const newMatch = trimmed.match(/zerozero\.pt\/jogador\/([^/?]+)\/(\d+)/);
  if (newMatch) {
    return { slug: newMatch[1], id: newMatch[2] };
  }

  // Old format: /player.php?id=123
  const oldMatch = trimmed.match(/zerozero\.pt\/player\.php\?id=(\d+)/);
  if (oldMatch) {
    return { slug: 'player', id: oldMatch[1] };
  }

  return null;
}

/**
 * Convert a URL slug to a readable name.
 * "rafael-basto" → "Rafael Basto"
 */
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Search players - combines mock data with zerozero API.
 * Also detects zerozero URLs pasted directly.
 */
export async function searchPlayersZerozero(query: string): Promise<Player[]> {
  if (!query || query.length < 2) return [];

  // Check if the query is a zerozero URL
  const urlParsed = parseZerozeroUrl(query);
  if (urlParsed) {
    // Return a single result with the name extracted from the slug
    const nameFromSlug = slugToName(urlParsed.slug);
    return [{
      id: urlParsed.id,
      name: nameFromSlug,
      club: '',
      ageGroup: '',
      dateOfBirth: '',
      preferredFoot: 'Direito' as const,
      height: 0,
      position: '',
      photoUrl: null,
      nationality: '',
      _slug: urlParsed.slug,
    } as Player & { _slug: string }];
  }

  // Text search: start with mock data (always works)
  const mockResults = await searchMock(query);

  // Also try zerozero API in parallel
  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);

    if (response.ok) {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const apiResults: SearchResult[] = await response.json();

        if (apiResults.length > 0) {
          const zerozeroPlayers = apiResults.map((r) => ({
            id: r.id,
            name: r.name,
            club: r.club,
            ageGroup: '',
            dateOfBirth: '',
            preferredFoot: 'Direito' as const,
            height: 0,
            position: '',
            photoUrl: null,
            nationality: '',
            _slug: r.slug,
          } as Player & { _slug: string }));

          // Combine: zerozero results first, then mock data
          return [...zerozeroPlayers, ...mockResults];
        }
      }
    }
  } catch {
    // API not available, use mock data only
  }

  return mockResults;
}

/**
 * Fetch full player details from zerozero.pt via our API proxy.
 */
export async function fetchPlayerDetails(playerId: string, slug?: string): Promise<Player | null> {
  try {
    const params = slug ? `?slug=${encodeURIComponent(slug)}` : '';
    const response = await fetch(`${API_BASE}/player/${playerId}${params}`);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;

    const data: PlayerApiResponse = await response.json();

    let foot: 'Direito' | 'Esquerdo' | 'Ambidestro' = 'Direito';
    if (data.preferredFoot.toLowerCase().includes('esquerdo') && data.preferredFoot.toLowerCase().includes('direito')) {
      foot = 'Ambidestro';
    } else if (data.preferredFoot.toLowerCase().includes('esquerdo')) {
      foot = 'Esquerdo';
    } else if (data.preferredFoot.toLowerCase().includes('ambidestro')) {
      foot = 'Ambidestro';
    }

    return {
      id: data.id,
      name: data.name || slugToName(slug || ''),
      club: data.club,
      ageGroup: '',
      dateOfBirth: data.dateOfBirth,
      preferredFoot: foot,
      height: data.height,
      position: data.position,
      photoUrl: data.photoUrl,
      nationality: data.nationality,
    };
  } catch {
    return null;
  }
}
