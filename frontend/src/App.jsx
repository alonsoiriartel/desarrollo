import { useEffect, useState } from 'react';
import { itemsApi } from './api/itemsApi.js';
import ItemForm from './components/ItemForm.jsx';
import ItemTable from './components/ItemTable.jsx';

const OPTIONS = [
  { value: 'memory', label: 'Memoria (etapa 1)' },
  { value: 'mysql', label: 'MySQL (etapa 2)' },
  { value: 'mongo', label: 'MongoDB (etapa 3)' },
];
export default function App() {
  const [enabled, setEnabled] = useState(['memory']);
  const [provider, setProvider] = useState('memory');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(data => {
      if (Array.isArray(data.providers)) {
        setEnabled(data.providers);
        setProvider(old => data.providers.includes(old) ? old : data.providers[0]);
      }
    }).catch(() => setError('No se puede consultar la API NestJS (puerto 3000).'));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setItems([]);
    itemsApi.listar(provider, controller.signal)
      .then(setItems)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [provider]);

  function changeProvider(event) {
    setSelected(null); setNotice(''); setProvider(event.target.value);
  }
  async function refresh() { setItems(await itemsApi.listar(provider)); }
  async function save(data) {
    setBusy(true); setError(''); setNotice('');
    try {
      if (selected) {
        await itemsApi.editar(provider, selected.id, data);
        setNotice('Registro actualizado.');
      } else {
        await itemsApi.crear(provider, data);
        setNotice('Registro creado.');
      }
      setSelected(null); await refresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  async function remove(item) {
    if (!window.confirm(`¿Eliminar «${item.nombre}» de ${provider}?`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await itemsApi.eliminar(provider, item.id);
      if (selected?.id === item.id) setSelected(null);
      await refresh(); setNotice('Registro eliminado.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <main className="shell">
    <header className="hero">
      <div className="eyebrow">DESARROLLO WEB Y MÓVIL · PROYECTO POR ETAPAS</div>
      <h1>React + NestJS · CRUD progresivo</h1>
      <p>Primero sin base de datos; luego MySQL y MongoDB, locales o con Docker.</p>
    </header>
    <section className="panel toolbar">
      <div>
        <label htmlFor="provider">Almacenamiento activo</label>
        <select id="provider" value={provider} disabled={busy} onChange={changeProvider}>
          {OPTIONS.filter(option => enabled.includes(option.value)).map(option =>
            <option key={option.value} value={option.value}>{option.label}</option>
          )}
        </select>
      </div>
      <div className="summary">
        <span className="dot" /> {provider === 'memory' ? 'Temporal, sin BD' : provider === 'mysql' ? 'TypeORM → MySQL' : 'Mongoose → MongoDB'}
        <strong>{items.length} registro(s)</strong>
      </div>
    </section>
    <p className="hint">Cada motor guarda su propia información. Memoria se vacía al reiniciar NestJS.</p>
    {error && <p role="alert" className="alert error">{error}</p>}
    {notice && <p role="status" className="alert success">{notice}</p>}
    <section className="layout">
      <ItemForm key={`${provider}-${selected?.id || 'nuevo'}`} selected={selected} onSave={save} onCancel={() => setSelected(null)} busy={busy} />
      <div className="panel listing">
        <div className="listing-head"><h2>Registros: {provider}</h2>
          <button className="secondary" disabled={busy || loading} onClick={() => refresh().catch(err => setError(err.message))}>Actualizar</button>
        </div>
        {loading ? <p>Cargando registros…</p> : <ItemTable items={items} onEdit={setSelected} onRemove={remove} busy={busy} />}
      </div>
    </section>
    <footer><code>React → /api/items → NestJS → {provider}</code></footer>
  </main>;
}
