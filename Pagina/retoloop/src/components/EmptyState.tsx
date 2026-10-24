import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  title: string;
  text?: string;
  level?: 1 | 2;
  children?: ReactNode;
}

export function EmptyState({ emoji, title, text, level = 2, children }: Props) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <div className="empty">
      <div className="empty__emoji" aria-hidden="true">
        {emoji}
      </div>
      <Heading className="empty__title">{title}</Heading>
      {text && <p className="empty__text">{text}</p>}
      {children && <div className="empty__actions">{children}</div>}
    </div>
  );
}
