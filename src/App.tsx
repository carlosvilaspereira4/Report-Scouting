import { useState } from 'react';
import { Download, Loader2, Eye, PenLine } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { AppShell } from './components/layout/AppShell';
import { ReportForm } from './components/form/ReportForm';
import { ReportPreview } from './components/preview/ReportPreview';
import { ReportDocument } from './components/pdf/ReportDocument';
import type { ReportFormData } from './components/form/ReportForm';

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

function validateForm(data: ReportFormData): Partial<Record<keyof ReportFormData, string>> {
  const errors: Partial<Record<keyof ReportFormData, string>> = {};

  if (!data.player) errors.player = 'Selecione um jogador';
  if (!data.matchDate) errors.matchDate = 'Data obrigatória';
  if (!data.matchDescription) errors.matchDescription = 'Jogo observado obrigatório';
  if (!data.performanceGrade) errors.performanceGrade = 'Selecione uma nota';
  if (!data.potentialGrade) errors.potentialGrade = 'Selecione uma nota';
  if (!data.followUp) errors.followUp = 'Selecione uma recomendação';
  if (data.physicality.length < 10) errors.physicality = 'Mínimo 10 caracteres';
  if (data.offensively.length < 10) errors.offensively = 'Mínimo 10 caracteres';
  if (data.defensively.length < 10) errors.defensively = 'Mínimo 10 caracteres';
  if (data.conclusion.length < 10) errors.conclusion = 'Mínimo 10 caracteres';
  if (data.authorName.length < 2) errors.authorName = 'Nome obrigatório';

  return errors;
}

export default function App() {
  const [formData, setFormData] = useState<ReportFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');

  async function handleSubmit() {
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsGenerating(true);
    try {
      const blob = await pdf(
        <ReportDocument data={formData} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${formData.player?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'scout'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <AppShell>
      {/* Mobile view toggle */}
      <div className="mb-4 flex gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('form')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            mobileView === 'form'
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <PenLine className="h-4 w-4" />
          Formulário
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            mobileView === 'preview'
              ? 'bg-brand-500 text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form Column */}
        <div className={`${mobileView === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Novo Relatório de Observação
            </h2>
            <ReportForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              errors={errors}
            />
          </div>
        </div>

        {/* Preview Column */}
        <div className={`${mobileView === 'form' ? 'hidden lg:block' : ''}`}>
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
    </AppShell>
  );
}
