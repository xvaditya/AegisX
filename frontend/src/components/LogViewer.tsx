import type { LogEntry, LogLevel } from '../types';

interface LogViewerProps {
  logs: LogEntry[];
  level: LogLevel | 'ALL';
  onLevelChange: (level: LogLevel | 'ALL') => void;
}

const levels: Array<LogLevel | 'ALL'> = ['ALL', 'SECURITY', 'ERROR', 'WARN', 'INFO', 'DEBUG'];

export function LogViewer({ logs, level, onLevelChange }: LogViewerProps) {
  const visible = level === 'ALL' ? logs : logs.filter((log) => log.level === level);

  return (
    <div className="log-viewer">
      <div className="aegis-segmented">
        {levels.map((item) => (
          <button key={item} className={`motion-tab log-tab-${item.toLowerCase()} ${level === item ? 'is-active' : ''}`} onClick={() => onLevelChange(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="log-stream">
        {visible.map((log) => (
          <div key={log.id} className={`log-line ${log.level.toLowerCase()}`}>
            <span>{log.timestamp}</span>
            <strong>{log.level}</strong>
            <code>{log.service}</code>
            <p>{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
