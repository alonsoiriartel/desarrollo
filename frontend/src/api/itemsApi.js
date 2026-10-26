// El mismo contrato HTTP sirve para ambos motores.
// Vite redirige /api a localhost:3000 mientras desarrollamos.
export async function apiRequest(provider, path = '/items', options = {}) {
  const { method = 'GET', body, signal } = options;
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      signal,
      headers: {
        'X-DB-Provider': provider,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('No hay conexión con NestJS. Revisa el puerto 3000.');
  }
  const result = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const message = Array.isArray(result?.message)
      ? result.message.join(' · ')
      : (result?.message || `Error HTTP ${response.status}`);
    throw new Error(message);
  }
  return result;
}

export const itemsApi = {
  listar: (db, signal) => apiRequest(db, '/items', { signal }),
  consultar: (db, id) => apiRequest(db, `/items/${id}`),
  crear: (db, data) => apiRequest(db, '/items', { method: 'POST', body: data }),
  editar: (db, id, data) => apiRequest(db, `/items/${id}`, { method: 'PATCH', body: data }),
  eliminar: (db, id) => apiRequest(db, `/items/${id}`, { method: 'DELETE' }),
};
