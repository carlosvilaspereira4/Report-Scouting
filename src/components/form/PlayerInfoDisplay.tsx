import { Pencil } from 'lucide-react';
import type { Player } from '../../types';
import { formatDate, calculateAge } from '../../utils/formatDate';

interface Props {
  player: Player;
  onUpdate: (player: Player) => void;
}

export function PlayerInfoDisplay({ player, onUpdate }: Props) {
  const age = player.dateOfBirth ? calculateAge(player.dateOfBirth) : null;

  function update<K extends keyof Player>(key: K, value: Player[K]) {
    onUpdate({ ...player, [key]: value });
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 p-5 border border-brand-200">
      <div className="flex items-center gap-2 mb-4">
        <Pencil className="h-4 w-4 text-brand-400" />
        <span className="text-xs font-medium text-brand-500">Dados do jogador (editáveis)</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Photo */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-3 border-brand-400 bg-white text-2xl font-bold text-brand-500 self-center sm:self-start">
          {player.photoUrl ? (
            <img
              src={player.photoUrl}
              alt={player.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            player.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
          )}
        </div>

        {/* Editable fields */}
        <div className="flex-1 w-full space-y-3">
          {/* Name */}
          <input
            type="text"
            value={player.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-lg font-bold text-brand-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Club */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Clube</label>
              <input
                type="text"
                value={player.club}
                onChange={(e) => update('club', e.target.value)}
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Escalão</label>
              <input
                type="text"
                value={player.ageGroup}
                onChange={(e) => update('ageGroup', e.target.value)}
                placeholder="Ex: Sub-19"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">
                Data de nascimento
                {age !== null && age > 0 ? ` (${age} anos)` : ''}
              </label>
              <input
                type="date"
                value={player.dateOfBirth}
                onChange={(e) => update('dateOfBirth', e.target.value)}
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Preferred Foot */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Pé preferencial</label>
              <select
                value={player.preferredFoot}
                onChange={(e) => update('preferredFoot', e.target.value as Player['preferredFoot'])}
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              >
                <option value="Direito">Direito</option>
                <option value="Esquerdo">Esquerdo</option>
                <option value="Ambidestro">Ambidestro</option>
              </select>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Altura (cm)</label>
              <input
                type="number"
                value={player.height || ''}
                onChange={(e) => update('height', parseInt(e.target.value, 10) || 0)}
                placeholder="Ex: 190"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Posição</label>
              <input
                type="text"
                value={player.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder="Ex: Defesa Central"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Nationality */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brand-500 mb-1">Nacionalidade</label>
              <input
                type="text"
                value={player.nationality}
                onChange={(e) => update('nationality', e.target.value)}
                placeholder="Ex: Portugal"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>
          </div>

          {player.dateOfBirth && (
            <p className="text-xs text-brand-400">
              {formatDate(player.dateOfBirth)} - {player.preferredFoot.toLowerCase()} - {player.height ? `${player.height} cm` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
