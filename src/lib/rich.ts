const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
const HTML_SPECIAL = /[&<>"']/g;
const BOLD_RUN = /\*\*(.+?)\*\*/g;

// Escapes text, then turns **metric** into <b>metric</b>. Use with set:html.
export function rich(text: string): string {
  return text.replace(HTML_SPECIAL, (char) => HTML_ESCAPES[char]).replace(BOLD_RUN, '<b>$1</b>');
}

// Plain-text version, for meta descriptions.
export function plain(text: string): string {
  return text.replace(BOLD_RUN, '$1');
}
