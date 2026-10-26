import { useEffect, useState } from 'react';

const EMPTY = { nombre: '', cantidad: '0', activo: true };

export default function ItemForm({ selected, onSave, onCancel, busy }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(selected ? {
      nombre: selected.nombre,
      cantidad: String(selected.cantidad),
      activo: selected.activo,
    } : { ...EMPTY });
  }, [selected]);

  async function submit(e) {
    e.preventDefault();
    const cantidad = Number(form.cantidad);
    if (!form.nombre.trim() || !Number.isInteger(cantidad) || cantidad < 0) {
      alert('Escribe un nombre y una cantidad entera mayor o igual a cero.');
      return;
    }
    await onSave({ nombre: form.nombre.trim(), cantidad, activo: form.activo });
  }

  return (
    <form onSubmit={submit} className="panel form" aria-label="Formulario de ítem">
      <h2>{selected ? 'Editar registro' : 'Agregar registro'}</h2>
      <label>Nombre
        <input required maxLength={100} value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
      </label>
      <label>Cantidad
        <input required type="number" min="0" step="1" value={form.cantidad}
          onChange={(e) => setForm({ ...form, cantidad: e.target.value })} />
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={form.activo}
          onChange={(e) => setForm({ ...form, activo: e.target.checked })} />
        Registro activo
      </label>
      <div className="actions">
        <button disabled={busy} type="submit">{busy ? 'Guardando…' : selected ? 'Guardar cambios' : 'Registrar'}</button>
        {selected && <button disabled={busy} type="button" className="secondary" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
