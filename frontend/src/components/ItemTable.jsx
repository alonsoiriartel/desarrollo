export default function ItemTable({ items, onEdit, onRemove, busy }) {
  if (items.length === 0) {
    return <div className="empty">Aún no hay registros en esta base de datos.</div>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Nombre</th><th>Cantidad</th><th>Estado</th><th>ID</th><th>Acciones</th></tr></thead>
        <tbody>
          {items.map((item) => <tr key={item.id}>
            <td><strong>{item.nombre}</strong></td>
            <td>{item.cantidad}</td>
            <td><span className={item.activo ? 'tag on' : 'tag off'}>{item.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td><code title={item.id}>{item.id.slice(0, 8)}…</code></td>
            <td className="buttons">
              <button type="button" className="small secondary" disabled={busy} onClick={() => onEdit(item)}>Editar</button>
              <button type="button" className="small danger" disabled={busy} onClick={() => onRemove(item)}>Eliminar</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
  );
}
