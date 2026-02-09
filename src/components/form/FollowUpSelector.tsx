import type { FollowUp } from '../../types';
import { FOLLOW_UP_OPTIONS } from '../../constants/reportOptions';

interface Props {
  value: FollowUp | undefined;
  onChange: (option: FollowUp) => void;
  error?: string;
}

const FOLLOW_UP_STYLES: Record<FollowUp, { bg: string; border: string; text: string; selectedBg: string }> = {
  'Passar à frente': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', selectedBg: 'bg-green-100' },
  'Acompanhar': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', selectedBg: 'bg-blue-100' },
  'Acompanhar com reservas': { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700', selectedBg: 'bg-yellow-100' },
  'Descartar': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', selectedBg: 'bg-red-100' },
};

export function FollowUpSelector({ value, onChange, error }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        Recomendação de acompanhamento
      </label>
      <div className="grid grid-cols-2 gap-2">
        {FOLLOW_UP_OPTIONS.map((option) => {
          const isSelected = value === option;
          const styles = FOLLOW_UP_STYLES[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? `${styles.selectedBg} ${styles.border} ${styles.text}`
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
