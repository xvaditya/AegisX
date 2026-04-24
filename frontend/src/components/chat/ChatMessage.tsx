/* ── ChatMessage Component ── */

import type { ChatMessage as ChatMessageType } from '../../types';
import styles from './chat.module.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const cls =
    message.role === 'user'
      ? styles.messageUser
      : message.role === 'assistant'
        ? styles.messageAssistant
        : styles.messageSystem;

  return (
    <div className={`${styles.message} ${cls}`}>
      {message.content}
    </div>
  );
}
