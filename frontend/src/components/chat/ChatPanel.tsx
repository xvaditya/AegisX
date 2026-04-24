/* ── ChatPanel Component ── */

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import styles from './chat.module.css';

const INITIAL_MESSAGES: ChatMessageType[] = [
  {
    id: 'welcome',
    role: 'system',
    content: '🛡️ AegisX Online — Type a command or ask about incidents',
    timestamp: new Date().toISOString(),
  },
];

const COMMAND_RESPONSES: Record<string, string> = {
  help: '📋 Commands: status, scan, incidents, metrics, block <ip>, restart <service>, kill <pid>',
  status: '✅ All systems operational. Monitoring 5 services across 3 regions.',
  scan: '🔍 Initiating full security scan... Results will appear in the incident feed.',
  incidents: '📊 Last hour: 12 incidents (3 critical, 4 high, 5 medium). Top threat: brute force attacks.',
  metrics: '📈 CPU: 45% | Memory: 62% | Disk: 71% | Network: 2.4 GB sent, 5.1 GB received',
};

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate response
    setTimeout(() => {
      const cmd = text.toLowerCase().split(' ')[0];
      const response = COMMAND_RESPONSES[cmd] ||
        `🧠 Analyzing "${text}"... I can help with incident analysis, system monitoring, and auto-response actions. Type "help" for available commands.`;

      const assistantMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.messages} ref={messagesRef}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          placeholder="Type a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
