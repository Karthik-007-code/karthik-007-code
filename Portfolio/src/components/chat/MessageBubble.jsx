/**
 * MessageBubble.jsx
 * Renders individual user and assistant chat bubbles with markdown formatting,
 * syntax code blocks, copy-to-clipboard, and streaming cursors.
 */

import { useState } from 'react';
import { BotIcon, UserIcon, CopyIcon, CheckIcon, AlertCircleIcon } from '../Icons';

/**
 * Lightweight, safe parser for assistant response text.
 * Handles:
 * - Fenced code blocks (```code```)
 * - Inline code (`code`)
 * - Bold (**text**) and Italics (*text*)
 * - Markdown links ([text](url))
 * - Bullet lists (* or -)
 */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="prose-content">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code block
          const lines = part.slice(3, -3).trim().split('\n');
          let language = 'code';
          let codeContent = part.slice(3, -3);

          if (lines.length > 0 && /^[a-zA-Z0-9_-]+$/.test(lines[0].trim())) {
            language = lines[0].trim();
            codeContent = lines.slice(1).join('\n');
          }

          return (
            <CodeBlock
              key={index}
              language={language}
              code={codeContent.trim()}
            />
          );
        }

        // Regular prose text (paragraphs and lists)
        return <ProseBlock key={index} text={part} />;
      })}
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="code-copy-btn"
          title="Copy code"
        >
          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function ProseBlock({ text }) {
  // Normalize paragraphs
  const paragraphs = text.split(/\n{2,}/);

  return (
    <>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');
        const isBulletList = lines.every((line) => line.trim().startsWith('* ') || line.trim().startsWith('- '));

        if (isBulletList && lines.length > 0) {
          return (
            <ul key={pIdx}>
              {lines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[\*\-]\s+/, '');
                return <li key={lIdx}>{formatInlineText(itemText)}</li>;
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx}>
            {lines.map((line, lIdx) => (
              <span key={lIdx}>
                {formatInlineText(line)}
                {lIdx < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

/**
 * Format inline elements: links, bold, italics, inline code
 */
function formatInlineText(text) {
  if (!text) return null;

  // Split into inline code tokens first
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((segment, cIdx) => {
    if (segment.startsWith('`') && segment.endsWith('`') && segment.length >= 2) {
      return (
        <code key={cIdx} className="inline-code">
          {segment.slice(1, -1)}
        </code>
      );
    }

    // Parse links, bold and italic inside non-code text
    return parseFormattedSpans(segment, cIdx);
  });
}

function parseFormattedSpans(text, baseKey) {
  // Replace links [label](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`link-${match.index}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  // Parse bold and italics for each string slice
  return parts.map((part, pIdx) => {
    if (typeof part !== 'string') return part;

    // Bold (**text**)
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bSegment, bIdx) => {
      if (bSegment.startsWith('**') && bSegment.endsWith('**')) {
        return <strong key={`${baseKey}-${pIdx}-${bIdx}`}>{bSegment.slice(2, -2)}</strong>;
      }
      return bSegment;
    });
  });
}

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isStreaming = message.status === 'streaming';
  const isInterrupted = message.status === 'interrupted';

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <div className="message-avatar assistant" aria-label="Ask Karthik Avatar">
          <BotIcon size={18} />
        </div>
      )}

      <div className="message-bubble-wrapper">
        <div className={isUser ? 'bubble-user' : `bubble-assistant ${isInterrupted ? 'is-interrupted' : ''}`}>
          {isUser ? (
            message.content
          ) : (
            <>
              <MarkdownRenderer content={message.content} />
              {isStreaming && <span className="streaming-cursor" aria-hidden="true" />}
            </>
          )}

          {isInterrupted && (
            <div className="interrupted-badge">
              <AlertCircleIcon size={13} />
              <span>Response interrupted</span>
            </div>
          )}
        </div>

        {/* Message Actions / Meta */}
        <div className="message-meta-bar">
          <span className="message-timestamp">{formatTime(message.timestamp)}</span>

          {!isUser && !isStreaming && (
            <button
              type="button"
              onClick={handleCopyResponse}
              className="copy-response-btn"
              title="Copy message"
            >
              {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      {isUser && (
        <div
          className="message-avatar"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
          aria-label="User Avatar"
        >
          <UserIcon size={18} />
        </div>
      )}
    </div>
  );
}

