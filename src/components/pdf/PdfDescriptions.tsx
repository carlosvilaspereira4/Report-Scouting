import { View, Text } from '@react-pdf/renderer';
import { styles } from './pdfStyles';

interface Props {
  physicality: string;
  offensively: string;
  defensively: string;
  conclusion: string;
}

export function PdfDescriptions({ physicality, offensively, defensively, conclusion }: Props) {
  return (
    <View>
      <Text style={styles.mainSectionTitle}>Descrição do jogador</Text>

      {physicality && (
        <View>
          <Text style={styles.sectionTitle}>Fisicalidade</Text>
          <Text style={styles.sectionBody}>{physicality}</Text>
        </View>
      )}

      {offensively && (
        <View>
          <Text style={styles.sectionTitle}>Ofensivamente</Text>
          <Text style={styles.sectionBody}>{offensively}</Text>
        </View>
      )}

      {defensively && (
        <View>
          <Text style={styles.sectionTitle}>Defensivamente</Text>
          <Text style={styles.sectionBody}>{defensively}</Text>
        </View>
      )}

      {conclusion && (
        <View>
          <Text style={styles.sectionTitle}>Conclusão</Text>
          <Text style={styles.sectionBody}>{conclusion}</Text>
        </View>
      )}
    </View>
  );
}
