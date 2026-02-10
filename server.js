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
};

// --- Search players on zerozero.pt ---
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query || String(query).length < 2) {
    return res.json([]);
  }

  try {
    const url = `https://www.zerozero.pt/jogadores?search_txt=${encodeURIComponent(String(query))}`;
    const response = await fetch(url, { headers: HEADERS });

    if (!response.ok) {
      console.error(`ZeroZero search returned ${response.status}`);
      return res.json([]);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const players = [];

    // ZeroZero player search results are typically in a table or list
    // Each row has a link to the player page, name, team, position
    $('a[href*="/jogador/"]').each((_i, el) => {
      const link = $(el).attr('href') || '';
      const match = link.match(/\/jogador\/([^/]+)\/(\d+)/);
      if (!match) return;

      const slug = match[1];
      const id = match[2];
      const name = $(el).text().trim();

      // Skip empty names or navigation links
      if (!name || name.length < 2) return;

      // Try to get the parent row for additional info
      const row = $(el).closest('tr, li, .item, [class*="player"]');
      const teamEl = row.find('a[href*="/equipa/"]').first();
      const team = teamEl.text().trim() || '';

      // Avoid duplicates
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

    // Limit to 15 results
    res.json(players.slice(0, 15));
  } catch (err) {
    console.error('Search error:', err);
    res.json([]);
  }
});

// --- Get player details from zerozero.pt ---
app.get('/api/player/:id', async (req, res) => {
  const { id } = req.params;
  const slug = req.query.slug || 'player';

  try {
    const url = `https://www.zerozero.pt/jogador/${slug}/${id}`;
    const response = await fetch(url, { headers: HEADERS });

    if (!response.ok) {
      console.error(`ZeroZero player page returned ${response.status}`);
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const body = $.text();

    // Extract player name from the page title or header
    const pageTitle = $('title').text() || '';
    // Title format: "Name :: Season - Club - Ficha e Estatísticas do Jogador"
    const titleName = pageTitle.split('::')[0]?.trim() || '';

    // Try to get name from h1 or the main header
    const h1Name = $('h1').first().text().trim();
    const name = h1Name || titleName;

    // Extract photo URL - look for player photo in the header area
    let photoUrl = null;
    $('img').each((_i, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || '';
      // Player photos usually contain the player name or are in a specific container
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
    // ZeroZero renders bio data as label-value pairs in text

    // Date of birth / Age
    let dateOfBirth = '';
    let age = '';
    const birthMatch = body.match(/Nascimento\/Idade\s*(\d{4}-\d{2}-\d{2})\s*\((\d+)\s*anos?\)/);
    if (birthMatch) {
      dateOfBirth = birthMatch[1];
      age = birthMatch[2];
    }

    // Position
    let position = '';
    const posMatch = body.match(/Posição\s*([A-ZÀ-Ú][^·\n]*?)(?:\s*(?:Internac|Pé |Altura|Peso|Situação|Int |Clube))/);
    if (posMatch) {
      position = posMatch[1].trim();
    }

    // Preferred foot
    let preferredFoot = '';
    const footMatch = body.match(/Pé preferencial\s*(Direito|Esquerdo|Direito\/Esquerdo|Ambidestro)/i);
    if (footMatch) {
      preferredFoot = footMatch[1];
    }

    // Height
    let height = 0;
    const heightMatch = body.match(/Altura\s*(\d+)\s*cm/);
    if (heightMatch) {
      height = parseInt(heightMatch[1], 10);
    }

    // Current club
    let club = '';
    const clubMatch = body.match(/Clube atual\s*·?\s*([^·\n]+)/);
    if (clubMatch) {
      club = clubMatch[1].trim();
    }
    // Fallback: try from title
    if (!club && pageTitle.includes(' - ')) {
      const parts = pageTitle.split(' - ');
      if (parts.length >= 2) {
        club = parts[1].trim();
      }
    }

    // Nationality
    let nationality = '';
    const natMatch = body.match(/Nacionalidade\s*([A-ZÀ-Ú][a-zà-ú]+(?:\s[A-ZÀ-Ú][a-zà-ú]+)*)/);
    if (natMatch) {
      nationality = natMatch[1].trim();
    }

    // Full name
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

    res.json(player);
  } catch (err) {
    console.error('Player fetch error:', err);
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
