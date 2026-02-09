import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import type { ScoutingReportWidgetProps } from '../types';
import { searchPlayers as defaultSearch } from '../data/mockPlayers';
import { ReportForm } from '../components/form/ReportForm';
import { ReportPreview } from '../components/preview/ReportPreview';
import { ReportDocument } from '../components/pdf/ReportDocument';
import type { ReportFormData } from '../components/form/ReportForm';

const INITIAL_DATA: ReportFormData = {
  player: null,
  matchDate: '',
  matchDescription: '',
  performanceGrade: undefined,
  potentialGrade: undefined,
  followUp: undefined,
  physicality: '',
  offensively: '',
  defensively: '',
  conclusion: '',
  authorName: '',
};

/**
 * Integration-ready widget for scouting reports.
 *
 * Usage in an existing platform:
 * ```tsx
 * <ScoutingReportWidget
 *   searchPlayers={api.searchPlayers}
 *   onSubmit={(report) => api.saveReport(report)}
 *   embedded={true}
 * />
 * ```
 */
export function ScoutingReportWidget({
  initialPlayer,
  onSubmit,
  searchPlayers = defaultSearch,
  embedded = false,
}: ScoutingReportWidgetProps) {
  const [formData, setFormData] = useState<ReportFormData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialPlayer) {
      setFormData((prev) => ({ ...prev, player: initialPlayer }));
    }
  }, [initialPlayer]);

  async function handleSubmit() {
    if (!formData.player) return;

    setIsGenerating(true);
    try {
      // Generate PDF
      const blob = await pdf(
        <ReportDocument data={formData} />
      ).toBlob();

      // If parent provided an onSubmit callback, call it
      if (onSubmit) {
        await onSubmit({
          playerId: formData.player.id,
          player: formData.player,
          matchDate: formData.matchDate,
          matchDescription: formData.matchDescription,
          performanceGrade: formData.performanceGrade!,
          potentialGrade: formData.potentialGrade!,
          followUp: formData.followUp!,
          physicality: formData.physicality,
          offensively: formData.offensively,
          defensively: formData.defensively,
          conclusion: formData.conclusion,
          authorName: formData.authorName,
          createdAt: new Date().toISOString(),
        });
      }

      // Download PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${formData.player.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className={embedded ? '' : 'mx-auto max-w-7xl p-6'}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          {!embedded && (
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Novo Relatório de Observação
            </h2>
          )}
          <ReportForm
            formData={formData}
            onChange={setFormData}
            onSubmit={handleSubmit}
            searchPlayersFn={searchPlayers}
          />
        </div>

        <div className="sticky top-4 space-y-4">
          <ReportPreview data={formData} />
          {formData.player && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isGenerating}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A gerar PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Descarregar PDF
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
