/**
 * The toast bus lives in its own module so the host component stays a
 * component-only export (React Fast Refresh requirement) and so anything —
 * including non-React code — can raise a notification without importing JSX.
 */
let listeners = [];
let seq = 0;

export const subscribe = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
  };
};

const emit = (message, tone) => {
  const entry = { id: ++seq, message, tone };
  listeners.forEach((listener) => listener(entry));
};

export const toast = {
  success: (message) => emit(message, 'success'),
  error: (message) => emit(message, 'error'),
  info: (message) => emit(message, 'info')
};
