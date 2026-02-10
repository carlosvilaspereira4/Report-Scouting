import { Document, Page, View } from '@react-pdf/renderer';
import type { ReportFormData } from '../form/ReportForm';
import { styles } from './pdfStyles';
import { PdfPlayerInfo } from './PdfPlayerInfo';
import { PdfGrades } from './PdfGrades';
import { PdfDescriptions } from './PdfDescriptions';
import { PdfFooter } from './PdfFooter';

interface Props {
  data: ReportFormData;
}

export function ReportDocument({ data }: Props) {
  if (!data.player) return null;

  return (
    <Document
      title={`Relatório - ${data.player.name}`}
      author={data.authorName}
    >
      <Page size="A4" style={styles.page}>
        {/* Decorative top bar */}
        <View style={styles.topBar} fixed />
        <View style={styles.leftLine} fixed />

        {/* Player Info Header */}
        <PdfPlayerInfo player={data.player} />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Grades & Recommendation */}
        <PdfGrades
          performanceGrade={data.performanceGrade}
          potentialGrade={data.potentialGrade}
          followUp={data.followUp}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Description Sections */}
        <PdfDescriptions
          physicality={data.physicality}
          offensively={data.offensively}
          defensively={data.defensively}
          conclusion={data.conclusion}
        />

        {/* Footer */}
        <PdfFooter authorName={data.authorName} />
      </Page>
    </Document>
  );
}
