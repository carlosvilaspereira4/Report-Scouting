import express from 'express';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-PT,pt;q=0.9,en;q=0.8',
  'Cache-Control': 'no-cache',
};

// --- Search players on zerozero.pt ---
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query || String(query).length < 2) {
    return res.json([]);
  }

  try {
    const url = `https://www.zerozero.pt/jogadores?search_txt=${encodeURIComponent(String(query))}`;
    console.log(`[search] Fetching: ${url}`);
    const response = await fetch(url, { headers: HEADERS, redirect: 'follow' });

    console.log(`[search] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      return res.json([]);
    }

    const html = await response.text();
    console.log(`[search] HTML length: ${html.length}`);
    const $ = cheerio.load(html);
    const players = [];

    // ZeroZero player search results - look for links to player pages
    $('a[href*="/jogador/"]').each((_i, el) => {
      const link = $(el).attr('href') || '';
      const match = link.match(/\/jogador\/([^/]+)\/(\d+)/);
      if (!match) return;

      const slug = match[1];
      const id = match[2];
      const name = $(el).text().trim();

      if (!name || name.length < 2) return;

      // Try to get team info from parent row
      const row = $(el).closest('tr, li, .item, [class*="player"], div');
      const teamEl = row.find('a[href*="/equipa/"]').first();
      const team = teamEl.text().trim() || '';

      if (!players.find((p) => p.id === id)) {
        players.push({
          id,
          slug,
          name,
          club: team,
          url: `https://www.zerozero.pt/jogador/${slug}/${id}`,
        });
      }
    });

    console.log(`[search] Found ${players.length} players`);
    res.json(players.slice(0, 15));
  } catch (err) {
    console.error('[search] Error:', err.message);
    res.json([]);
  }
});

// --- Get player details from zerozero.pt ---
app.get('/api/player/:id', async (req, res) => {
  const { id } = req.params;
  const slug = req.query.slug || 'player';

  try {
    const url = `https://www.zerozero.pt/jogador/${slug}/${id}`;
    console.log(`[player] Fetching: ${url}`);
    const response = await fetch(url, { headers: HEADERS, redirect: 'follow' });

    console.log(`[player] Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    const html = await response.text();
    console.log(`[player] HTML length: ${html.length}`);
    const $ = cheerio.load(html);
    const body = $.text();

    // Extract player name from h1 or title
    const pageTitle = $('title').text() || '';
    const titleName = pageTitle.split('::')[0]?.trim() || '';
    const h1Name = $('h1').first().text().trim();
    const name = h1Name || titleName;

    console.log(`[player] Name: "${name}"`);

    // Extract photo URL
    let photoUrl = null;
    $('img').each((_i, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || '';
      if (
        (alt.toLowerCase().includes(name.toLowerCase().split(' ')[0]) ||
         src.includes('/img/jogadores/') ||
         src.includes('/fotos/jogadores/') ||
         src.includes('player')) &&
        !src.includes('logo') &&
        !src.includes('escudo') &&
        !src.includes('flag') &&
        !src.includes('icon')
      ) {
        photoUrl = src.startsWith('http') ? src : `https://www.zerozero.pt${src}`;
      }
    });

    // Extract bio fields using text pattern matching
    let dateOfBirth = '';
    let age = '';
    const birthMatch = body.match(/Nascimento\/Idade\s*(\d{4}-\d{2}-\d{2})\s*\((\d+)\s*anos?\)/);
    if (birthMatch) {
      dateOfBirth = birthMatch[1];
      age = birthMatch[2];
    }

    let position = '';
    const posMatch = body.match(/Posição\s*([A-ZÀ-Ú][^·\n]*?)(?:\s*(?:Internac|Pé |Altura|Peso|Situação|Int |Clube))/);
    if (posMatch) {
      position = posMatch[1].trim();
    }

    let preferredFoot = '';
    const footMatch = body.match(/Pé preferencial\s*(Direito|Esquerdo|Direito\/Esquerdo|Ambidestro)/i);
    if (footMatch) {
      preferredFoot = footMatch[1];
    }

    let height = 0;
    const heightMatch = body.match(/Altura\s*(\d+)\s*cm/);
    if (heightMatch) {
      height = parseInt(heightMatch[1], 10);
    }

    let club = '';
    const clubMatch = body.match(/Clube atual\s*·?\s*([^·\n]+)/);
    if (clubMatch) {
      club = clubMatch[1].trim();
    }
    if (!club && pageTitle.includes(' - ')) {
      const parts = pageTitle.split(' - ');
      if (parts.length >= 2) {
        club = parts[1].trim();
      }
    }

    let nationality = '';
    const natMatch = body.match(/Nacionalidade\s*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/);
    if (natMatch) {
      nationality = natMatch[1].trim();
    }

    let fullName = '';
    const fnMatch = body.match(/Nome\s+([A-ZÀ-Ú][^·\n]*?)(?:\s*(?:Nascimento|Posição|País))/);
    if (fnMatch) {
      fullName = fnMatch[1].trim();
    }

    const player = {
      id,
      name: name || fullName,
      fullName: fullName || name,
      club,
      dateOfBirth,
      age: age ? parseInt(age, 10) : 0,
      preferredFoot: preferredFoot || 'Desconhecido',
      height,
      position: position || 'Desconhecida',
      photoUrl,
      nationality,
      sourceUrl: url,
    };

    console.log(`[player] Result:`, JSON.stringify(player, null, 2));
    res.json(player);
  } catch (err) {
    console.error('[player] Error:', err.message);
    res.status(500).json({ error: 'Erro ao obter dados do jogador' });
  }
});

// --- Serve static files in production ---
app.use(express.static(join(__dirname, 'dist')));
app.get('/{*splat}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
