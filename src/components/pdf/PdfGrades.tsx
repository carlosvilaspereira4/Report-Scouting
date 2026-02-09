import { View, Text } from '@react-pdf/renderer';
import type { Grade, FollowUp } from '../../types';
import { styles, GRADE_PDF_COLORS } from './pdfStyles';

interface Props {
  performanceGrade?: Grade;
  potentialGrade?: Grade;
  followUp?: FollowUp;
}

export function PdfGrades({ performanceGrade, potentialGrade, followUp }: Props) {
  return (
    <View style={styles.gradesContainer}>
      <View style={styles.gradeRow}>
        <Text style={styles.gradeLabel}>Rendimento no jogo</Text>
        <Text
          style={{
            ...styles.gradeValue,
            color: performanceGrade ? GRADE_PDF_COLORS[performanceGrade] : '#94a3b8',
          }}
        >
          {performanceGrade ?? '-'}
        </Text>
      </View>

      <View style={styles.gradeRow}>
        <Text style={styles.gradeLabel}>Nível de potencial</Text>
        <Text
          style={{
            ...styles.gradeValue,
            color: potentialGrade ? GRADE_PDF_COLORS[potentialGrade] : '#94a3b8',
          }}
        >
          {potentialGrade ?? '-'}
        </Text>
      </View>

      <View style={styles.followUpRow}>
        <Text style={styles.followUpLabel}>Recomendação de acompanhamento</Text>
        <Text style={styles.followUpValue}>
          {followUp ?? '-'}
        </Text>
      </View>
    </View>
  );
}
