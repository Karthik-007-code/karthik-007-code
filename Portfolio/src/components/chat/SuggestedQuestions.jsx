/**
 * SuggestedQuestions.jsx
 * Configurable 1-click prompt pills for visitors.
 */

import { CHAT_CONFIG } from '../../config/chatConfig';

export default function SuggestedQuestions({ onSelect, disabled = false }) {
  const questions = CHAT_CONFIG.suggestedQuestions;

  return (
    <div className="suggested-section">
      <p className="suggested-title">Suggested Inquiries</p>
      <div className="suggested-grid">
        {questions.map((question, index) => (
          <button
            key={index}
            type="button"
            className="suggested-btn"
            disabled={disabled}
            onClick={() => onSelect(question)}
            aria-label={`Ask: ${question}`}
          >
            <span>{question}</span>
            <span className="suggested-btn-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

