import { useState } from 'react';
import type { Player, Grade, FollowUp } from '../../types';
import { DESCRIPTION_SECTIONS } from '../../constants/reportOptions';
import { searchPlayersZerozero } from '../../services/zerozeroApi';
import { PlayerSearchInput } from './PlayerSearchInput';
import { PlayerInfoDisplay } from './PlayerInfoDisplay';
import { GradeSelector } from './GradeSelector';
import { FollowUpSelector } from './FollowUpSelector';
import { DescriptionField } from './DescriptionField';

export interface ReportFormData {
  player: Player | null;
  matchDate: string;
  matchDescription: string;
  performanceGrade: Grade | undefined;
  potentialGrade: Grade | undefined;
  followUp: FollowUp | undefined;
  physicality: string;
  offensively: string;
  defensively: string;
  conclusion: string;
  authorName: string;
}

interface Props {
  formData: ReportFormData;
  onChange: (data: ReportFormData) => void;
  onSubmit: () => void;
  searchPlayersFn?: (query: string) => Promise<Player[]>;
  errors?: Partial<Record<keyof ReportFormData, string>>;
}

export function ReportForm({ formData, onChange, onSubmit, searchPlayersFn, errors }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const searchFn = searchPlayersFn ?? searchPlayersZerozero;

  function update<K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) {
    onChange({ ...formData, [key]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    onSubmit();
  }

  const showErrors = submitted;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Player Search */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-gray-800">Jogador</h3>
        <PlayerSearchInput
          searchPlayers={searchFn}
          selectedPlayer={formData.player}
          onSelect={(player) => update('player', player)}
          onClear={() => update('player', null)}
        />
        {showErrors && errors?.player && (
          <p className="mt-1 text-xs text-red-500">{errors.player}</p>
        )}
      </section>

      {/* Player Info Display (editable) */}
      {formData.player && (
        <PlayerInfoDisplay
          player={formData.player}
          onUpdate={(updatedPlayer) => update('player', updatedPlayer)}
        />
      )}

      {/* Match Context */}
      {formData.player && (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Data do jogo
              </label>
              <input
                type="date"
                value={formData.matchDate}
                onChange={(e) => update('matchDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
              />
              {showErrors && errors?.matchDate && (
                <p className="mt-1 text-xs text-red-500">{errors.matchDate}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Jogo observado
              </label>
              <input
                type="text"
                value={formData.matchDescription}
                onChange={(e) => update('matchDescription', e.target.value)}
                placeholder="Ex: Benfica Sub-19 vs Porto Sub-19"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
              />
              {showErrors && errors?.matchDescription && (
                <p className="mt-1 text-xs text-red-500">{errors.matchDescription}</p>
              )}
            </div>
          </section>

          {/* Grades */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <GradeSelector
              label="Rendimento no jogo"
              value={formData.performanceGrade}
              onChange={(g) => update('performanceGrade', g)}
              error={showErrors ? errors?.performanceGrade : undefined}
            />
            <GradeSelector
              label="Nível de potencial"
              value={formData.potentialGrade}
              onChange={(g) => update('potentialGrade', g)}
              error={showErrors ? errors?.potentialGrade : undefined}
            />
          </section>

          {/* Follow Up */}
          <section>
            <FollowUpSelector
              value={formData.followUp}
              onChange={(f) => update('followUp', f)}
              error={showErrors ? errors?.followUp : undefined}
            />
          </section>

          {/* Description Sections */}
          <section className="space-y-5">
            <h3 className="text-lg font-bold text-gray-800">Descrição do jogador</h3>
            {DESCRIPTION_SECTIONS.map((section) => (
              <DescriptionField
                key={section.name}
                label={section.label}
                placeholder={section.placeholder}
                value={formData[section.name]}
                onChange={(v) => update(section.name, v)}
                error={showErrors ? errors?.[section.name] : undefined}
              />
            ))}
          </section>

          {/* Author */}
          <section>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nome do observador
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => update('authorName', e.target.value)}
              placeholder="Ex: Marco van der Heide"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
            />
            {showErrors && errors?.authorName && (
              <p className="mt-1 text-xs text-red-500">{errors.authorName}</p>
            )}
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 focus:outline-none"
          >
            Gerar Relatório PDF
          </button>
        </>
      )}
    </form>
  );
}
