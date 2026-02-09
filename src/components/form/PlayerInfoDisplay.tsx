import { Calendar, Ruler, Footprints, MapPin, Flag } from 'lucide-react';
import type { Player } from '../../types';
import { formatDate, calculateAge } from '../../utils/formatDate';

interface Props {
  player: Player;
}

export function PlayerInfoDisplay({ player }: Props) {
  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 p-5 border border-brand-200">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-3 border-brand-400 bg-white text-2xl font-bold text-brand-500">
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

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-xl font-bold text-brand-800">{player.name}</h2>
        <p className="text-sm font-medium text-brand-600">
          {player.club} ({player.ageGroup})
        </p>

        <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-brand-400" />
            {formatDate(player.dateOfBirth)} ({age} anos)
          </span>
          <span className="flex items-center gap-1.5">
            <Footprints className="h-4 w-4 text-brand-400" />
            {player.preferredFoot}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-brand-400" />
            {player.height} cm
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-brand-400" />
            {player.position}
          </span>
          <span className="flex items-center gap-1.5">
            <Flag className="h-4 w-4 text-brand-400" />
            {player.nationality}
          </span>
        </div>
      </div>
    </div>
  );
}
