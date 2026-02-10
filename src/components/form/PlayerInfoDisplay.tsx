import { useRef } from 'react';
import { Upload, User, X } from 'lucide-react';
import type { Player } from '../../types';

interface Props {
  player: Player;
  onUpdate: (player: Player) => void;
}

export function PlayerInfoDisplay({ player, onUpdate }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof Player>(key: K, value: Player[K]) {
    onUpdate({ ...player, [key]: value });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      update('photoUrl', ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    update('photoUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 p-5 border border-brand-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Dados do jogador</h3>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Photo upload */}
        <div className="flex flex-col items-center gap-2 self-center sm:self-start">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-full border-3 border-brand-400 bg-white text-brand-400 hover:border-brand-500 hover:text-brand-500 transition-colors overflow-hidden"
          >
            {player.photoUrl ? (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 rounded-full transition-colors">
              <Upload className="h-5 w-5 text-white opacity-0 hover:opacity-100" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          {player.photoUrl ? (
            <button
              type="button"
              onClick={removePhoto}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
            >
              <X className="h-3 w-3" />
              Remover foto
            </button>
          ) : (
            <span className="text-xs text-brand-400">Carregar foto</span>
          )}
        </div>

        {/* Fields */}
        <div className="flex-1 w-full space-y-3">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-brand-500 mb-1">Nome</label>
            <input
              type="text"
              value={player.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Nome completo do jogador"
              className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-lg font-bold text-brand-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Club */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Clube</label>
              <input
                type="text"
                value={player.club}
                onChange={(e) => update('club', e.target.value)}
                placeholder="Ex: FC Porto"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Number */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Número</label>
              <input
                type="text"
                value={player.number}
                onChange={(e) => update('number', e.target.value)}
                placeholder="Ex: 10"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-medium text-brand-500 mb-1">Ano de nascimento</label>
              <input
                type="text"
                value={player.year}
                onChange={(e) => update('year', e.target.value)}
                placeholder="Ex: 2005"
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
                placeholder="Ex: Médio Centro"
                className="w-full rounded-md border border-brand-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
