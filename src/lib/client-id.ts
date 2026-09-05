export function createClientId() {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();

    if (typeof crypto.getRandomValues === 'function') {
      const bytes = crypto.getRandomValues(new Uint32Array(4));
      return Array.from(bytes, (value) => value.toString(36)).join('-');
    }
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
