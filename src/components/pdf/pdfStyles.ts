import { StyleSheet } from '@react-pdf/renderer';

export const COLORS = {
  primary: '#0EA5E9',
  primaryLight: '#E0F2FE',
  primaryDark: '#0369A1',
  primaryMid: '#7DD3FC',
  text: '#1E293B',
  textLight: '#64748B',
  white: '#FFFFFF',
  gradeA: '#22C55E',
  gradeB: '#84CC16',
  gradeC: '#EAB308',
  gradeD: '#F97316',
  gradeE: '#EF4444',
};

export const GRADE_PDF_COLORS: Record<string, string> = {
  A: COLORS.gradeA,
  B: COLORS.gradeB,
  C: COLORS.gradeC,
  D: COLORS.gradeD,
  E: COLORS.gradeE,
};

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: COLORS.white,
  },
  // Decorative top bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: COLORS.primary,
  },
  // Left decorative line
  leftLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: COLORS.primaryLight,
  },
  // Header section
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  playerName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  clubInfo: {
    fontSize: 11,
    color: COLORS.primary,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  playerMeta: {
    fontSize: 10,
    color: COLORS.primary,
  },
  photoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    border: `3px solid ${COLORS.primaryMid}`,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    border: `3px solid ${COLORS.primaryMid}`,
  },
  photoInitials: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.primaryLight,
    marginVertical: 12,
  },
  // Grades section
  gradesContainer: {
    marginBottom: 16,
  },
  gradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gradeLabel: {
    width: 200,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  gradeValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  followUpLabel: {
    width: 200,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  followUpValue: {
    fontSize: 11,
    color: COLORS.text,
  },
  // Description sections
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-BoldOblique',
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 12,
  },
  mainSectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  sectionBody: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'justify',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerAuthor: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: 'Helvetica-Bold',
  },
  footerBrand: {
    fontSize: 8,
    color: COLORS.textLight,
  },
  // Match info
  matchInfo: {
    fontSize: 9,
    color: COLORS.textLight,
    marginBottom: 4,
  },
});
