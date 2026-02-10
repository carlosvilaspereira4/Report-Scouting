import type { Grade } from '../../types';
import { GRADES, GRADE_COLORS, GRADE_LABELS } from '../../constants/reportOptions';

interface Props {
  label: string;
  value: Grade | undefined;
  onChange: (grade: Grade) => void;
  error?: string;
}

export function GradeSelector({ label, value, onChange, error }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="flex gap-2">
        {GRADES.map((grade) => {
          const isSelected = value === grade;
          return (
            <button
              key={grade}
              type="button"
              onClick={() => onChange(grade)}
              title={GRADE_LABELS[grade]}
              className="flex h-12 w-12 items-center justify-center rounded-lg border-2 text-lg font-bold transition-all"
              style={{
                borderColor: isSelected ? GRADE_COLORS[grade] : '#e2e8f0',
                backgroundColor: isSelected ? GRADE_COLORS[grade] : 'white',
                color: isSelected ? 'white' : '#94a3b8',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {grade}
            </button>
          );
        })}
      </div>
      {value && (
        <p className="mt-1 text-xs text-gray-500">{GRADE_LABELS[value]}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
