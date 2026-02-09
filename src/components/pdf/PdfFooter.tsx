import { View, Text } from '@react-pdf/renderer';
import { styles } from './pdfStyles';

interface Props {
  authorName: string;
}

export function PdfFooter({ authorName }: Props) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerAuthor}>
        Relatório por {authorName || '—'}
      </Text>
      <Text style={styles.footerBrand}>360 Scouting</Text>
    </View>
  );
}
