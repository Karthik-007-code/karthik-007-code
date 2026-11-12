/**
 * FloatingChatButton.jsx
 * Floating launcher trigger rendered on the main portfolio view.
 */

import { SparklesIcon } from '../Icons';

export default function FloatingChatButton({ onClick }) {
  return (
    <button
      type="button"
      className="floating-chat-trigger"
      onClick={onClick}
      aria-label="Open Ask Karthik AI Chatbot"
    >
      <span className="floating-icon-glow">
        <SparklesIcon size={18} />
      </span>
      <span>Ask Karthik</span>
    </button>
  );
}

