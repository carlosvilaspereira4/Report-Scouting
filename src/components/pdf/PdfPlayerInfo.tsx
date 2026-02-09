import { View, Text } from '@react-pdf/renderer';
import type { Player } from '../../types';
import { formatDate, calculateAge } from '../../utils/formatDate';
import { styles } from './pdfStyles';

interface Props {
  player: Player;
}

export function PdfPlayerInfo({ player }: Props) {
  const age = calculateAge(player.dateOfBirth);
  const initials = player.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={styles.playerName}>
          {player.name}
        </Text>
        <Text style={styles.clubInfo}>
          {player.club} ({player.ageGroup})
        </Text>
        <Text style={styles.playerMeta}>
          {formatDate(player.dateOfBirth)} ({age} anos) - Pé {player.preferredFoot.toLowerCase()} - {player.height} cm
        </Text>
      </View>
      <View style={styles.photoPlaceholder}>
        <Text style={styles.photoInitials}>{initials}</Text>
      </View>
    </View>
  );
}
