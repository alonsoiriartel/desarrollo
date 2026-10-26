// Ejecutar dentro de mongosh: load('mongo/consultas-verificacion.js')
// También es posible copiar estas expresiones a la consola de Compass.
const database = db.getSiblingDB('crud_dual');
print('Colecciones de crud_dual:');
printjson(database.getCollectionNames());
print('Documentos de items:');
printjson(database.items.find({}, { nombre: 1, cantidad: 1, activo: 1 }).toArray());
print('Cantidad de documentos:');
print(database.items.countDocuments({}));
print('Ejemplo de filtro:');
printjson(database.items.find({ nombre: 'Cuaderno' }).toArray());
