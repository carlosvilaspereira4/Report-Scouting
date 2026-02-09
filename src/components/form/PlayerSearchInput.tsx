import { useState, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import type { Player } from '../../types';
import { usePlayerSearch } from '../../hooks/usePlayerSearch';

interface Props {
  searchPlayers: (query: string) => Promise<Player[]>;
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
  onClear: () => void;
}

export function PlayerSearchInput({ searchPlayers, selectedPlayer, onSelect, onClear }: Props) {
  const { query, setQuery, results, isLoading } = usePlayerSearch(searchPlayers);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (results.length > 0 && query.length >= 2) {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  }, [results, query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  function handleSelect(player: Player) {
    onSelect(player);
    setQuery(player.name);
    setIsOpen(false);
  }

  function handleClear() {
    setQuery('');
    onClear();
    inputRef.current?.focus();
  }

  if (selectedPlayer) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
        <Search className="h-5 w-5 text-brand-400" />
        <span className="flex-1 font-medium text-brand-700">
          {selectedPlayer.name} ({selectedPlayer.club} {selectedPlayer.ageGroup})
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full p-1 text-brand-400 hover:bg-brand-100 hover:text-brand-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar jogador por nome ou clube..."
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brand-400" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {results.map((player, index) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm ${
                index === highlightedIndex ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                {player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-gray-500">
                  {player.club} {player.ageGroup} &middot; {player.position}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
          Nenhum jogador encontrado
        </div>
      )}
    </div>
  );
}
