import type { ReportFormData } from '../form/ReportForm';
import type { Grade } from '../../types';
import { GRADE_COLORS } from '../../constants/reportOptions';

interface Props {
  data: ReportFormData;
}

export function ReportPreview({ data }: Props) {
  const { player } = data;

  if (!player || !player.name) {
    return (
      <div className="flex aspect-[1/1.414] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
        Preencha os dados do jogador para ver o preview
      </div>
    );
  }

  const initials = player.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  function gradeColor(grade?: Grade) {
    return grade ? GRADE_COLORS[grade] : '#cbd5e1';
  }

  return (
    <div className="aspect-[1/1.414] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="h-full origin-top-left scale-[0.48] sm:scale-[0.55] md:scale-[0.48] lg:scale-[0.52]" style={{ width: '190%' }}>
        <div className="relative p-8 font-sans" style={{ minHeight: '297mm' }}>
          {/* Top decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-500" />
          <div className="absolute top-0 left-0 h-full w-0.5 bg-brand-100" />

          {/* Header with logo */}
          <div className="flex items-start justify-between pt-2">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="AC" className="h-14 w-auto" />
              <div>
                <p className="text-xs font-bold text-brand-500">Scouting Atlético Cabeceirense</p>
                <p className="text-xs text-gray-400">Relatório de Observação</p>
              </div>
            </div>
          </div>

          {/* Player info */}
          <div className="mt-4 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{player.name}</h1>
              <p className="text-base font-bold text-brand-500">
                {player.club}{player.number ? ` | #${player.number}` : ''}
              </p>
              <p className="text-sm text-brand-500">
                {player.position}{player.year ? ` | Nascimento: ${player.year}` : ''}
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-[3px] border-brand-300 bg-brand-50 text-2xl font-bold text-brand-500 overflow-hidden">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} className="h-full w-full object-cover" />
              ) : (
                initials || '?'
              )}
            </div>
          </div>

          {/* Match info */}
          {data.matchDescription && (
            <p className="mt-1 text-xs text-gray-400">
              {data.matchDescription}{data.matchDate ? ` | ${data.matchDate}` : ''}
            </p>
          )}

          {/* Divider */}
          <div className="my-4 h-px bg-brand-100" />

          {/* Grades */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="w-52 text-sm font-bold text-gray-800">Rendimento no jogo</span>
              <span className="text-base font-bold" style={{ color: gradeColor(data.performanceGrade) }}>
                {data.performanceGrade ?? '—'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-52 text-sm font-bold text-gray-800">Nível de potencial</span>
              <span className="text-base font-bold" style={{ color: gradeColor(data.potentialGrade) }}>
                {data.potentialGrade ?? '—'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-52 text-sm font-bold text-gray-800">Recomendação</span>
              <span className="text-sm text-gray-700">{data.followUp ?? '—'}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-brand-100" />

          {/* Descriptions */}
          <h2 className="mb-3 text-lg font-bold text-gray-800">Descrição do jogador</h2>

          {data.physicality && (
            <div className="mb-3">
              <h3 className="mb-1 text-base font-bold italic text-gray-800">Fisicalidade</h3>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.physicality}</p>
            </div>
          )}

          {data.offensively && (
            <div className="mb-3">
              <h3 className="mb-1 text-base font-bold italic text-gray-800">Ofensivamente</h3>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.offensively}</p>
            </div>
          )}

          {data.defensively && (
            <div className="mb-3">
              <h3 className="mb-1 text-base font-bold italic text-gray-800">Defensivamente</h3>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.defensively}</p>
            </div>
          )}

          {data.conclusion && (
            <div className="mb-3">
              <h3 className="mb-1 text-base font-bold italic text-gray-800">Conclusão</h3>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">{data.conclusion}</p>
            </div>
          )}

          {/* Footer */}
          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
            <span className="text-sm font-bold text-brand-500">
              Relatório por {data.authorName || '—'}
            </span>
            <span className="text-xs text-gray-400">Scouting Atlético Cabeceirense</span>
          </div>
        </div>
      </div>
    </div>
  );
}
