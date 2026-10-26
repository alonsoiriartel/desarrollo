// Comprobar uno o varios repositorios: TEST_PROVIDERS=memory,mysql,mongo
import assert from 'node:assert/strict';
const base = process.env.API_URL || 'http://localhost:3000/api';
const targets = (process.env.TEST_PROVIDERS || 'memory').split(',').map(x => x.trim()).filter(Boolean);
async function request(db, path, method = 'GET', body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { 'X-DB-Provider': db, ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const result = res.status === 204 ? null : await res.json();
  return { status: res.status, data: result };
}
for (const db of targets) {
  console.log(`Probando motor ${db}`);
  const name = `Prueba_${db}_${Date.now()}`;
  const created = await request(db, '/items', 'POST', { nombre: name, cantidad: 2, activo: true });
  assert.equal(created.status, 201, JSON.stringify(created.data));
  const id = created.data.id;
  const listed = await request(db, '/items');
  assert.ok(listed.data.some(x => x.id === id));
  const one = await request(db, `/items/${id}`);
  assert.equal(one.status, 200);
  const modified = await request(db, `/items/${id}`, 'PATCH', { cantidad: 9, activo: false });
  assert.equal(modified.status, 200);
  assert.equal(modified.data.cantidad, 9);
  if (targets.length > 1) {
    const other = targets.find(x => x !== db);
    assert.equal((await request(other, `/items/${id}`)).status, 404);
  }
  assert.equal((await request(db, `/items/${id}`, 'DELETE')).status, 204);
  assert.equal((await request(db, `/items/${id}`)).status, 404);
  assert.equal((await request(db, '/items', 'POST', { nombre: '', cantidad: -1, activo: 'sí' })).status, 400);
  console.log(`OK: CRUD + validaciones + aislamiento de ${db}`);
}
console.log('PRUEBAS FINALIZADAS');
