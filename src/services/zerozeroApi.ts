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

// In production with Express, the API is served by the same server
// In dev, Vite proxies /api to localhost:3001
// On static hosting (GitHub Pages), falls back to mock data
const API_BASE = '/api';

export async function searchPlayersZerozero(query: string): Promise<Player[]> {
  if (!query || query.length < 2) return [];

  try {
    const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);

    // If API not available (static hosting), fall back to mock data
    if (!response.ok) {
      console.warn('ZeroZero API not available, using mock data');
      return searchMock(query);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      // Got HTML back instead of JSON (static hosting returns index.html)
      console.warn('ZeroZero API not available, using mock data');
      return searchMock(query);
    }

    const results: SearchResult[] = await response.json();

    return results.map((r) => ({
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
    }));
  } catch {
    // Network error - fall back to mock data
    console.warn('ZeroZero API unreachable, using mock data');
    return searchMock(query);
  }
}

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
      name: data.name,
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
