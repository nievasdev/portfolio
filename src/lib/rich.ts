const escapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Escapes text, then turns **metric** into <b>metric</b>. Use with set:html.
export function rich(text: string): string {
  return text
    .replace(/[&<>"']/g, (c) => escapes[c])
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

// Plain-text version, for meta descriptions.
export function plain(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1');
}
