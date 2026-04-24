/* ── AnalysisPanel Component ── */

import { motion } from 'framer-motion';
import type { AIAnalysis } from '../../types';
import styles from './analysis.module.css';

interface AnalysisPanelProps {
  analysis: AIAnalysis | null;
  loading: boolean;
}

export function AnalysisPanel({ analysis, loading }: AnalysisPanelProps) {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Aegis is analyzing...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.empty}>
        <span style={{ fontSize: 28 }}>🔍</span>
        <span>Select an incident to analyze</span>
        <span style={{ fontSize: 11 }}>AI-powered root cause analysis</span>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <span className={styles.title}>🧠 AI Analysis</span>
        <span className={styles.confidence}>
          {Math.round(analysis.confidence * 100)}% confidence
        </span>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>What Happened</div>
        <div className={styles.sectionContent}>{analysis.what_happened}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Root Cause</div>
        <div className={styles.sectionContent}>{analysis.why_it_happened}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Severity Assessment</div>
        <div className={styles.sectionContent}>{analysis.severity_assessment}</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Responsible Team</div>
        <span className={styles.teamBadge}>👥 {analysis.responsible_team}</span>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Suggested Action</div>
        <div className={styles.actionSuggestion}>
          💡 {analysis.suggested_action}
        </div>
      </div>
    </motion.div>
  );
}
