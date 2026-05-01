// Script de inicialización de MongoDB
// Este script se ejecuta solo la primera vez que se inicia el contenedor

// Cambiar a la base de datos
db = db.getSiblingDB('innovasoft_db');

// Crear usuario de aplicación (si no existe)
try {
  db.createUser({
    user: 'innovasoft_app',
    pwd: 'app_password_2024',
    roles: [
      {
        role: 'readWrite',
        db: 'innovasoft_db'
      }
    ]
  });
  print('✅ Usuario innovasoft_app creado');
} catch (e) {
  if (e.code === 51003) {
    print('⚠️ El usuario innovasoft_app ya existe');
  } else {
    print('❌ Error creando usuario: ' + e);
  }
}

// Crear índices (usando try-catch para evitar errores si ya existen)
try {
  // Índice único para username en sesiones
  db.sesiones.createIndex({ "username": 1 }, { unique: true });
  print('✅ Índice username_1 creado');
} catch (e) {
  print('⚠️ Índice username_1 ya existe o error: ' + e);
}

try {
  // Índice TTL para expiración automática (24 horas)
  db.sesiones.createIndex(
    { "login_timestamp": 1 }, 
    { expireAfterSeconds: 86400 }
  );
  print('✅ Índice login_timestamp_1 con TTL creado');
} catch (e) {
  print('⚠️ Índice login_timestamp_1 ya existe o error: ' + e);
}

try {
  // Índices para operaciones
  db.operaciones.createIndex({ "timestamp": -1 });
  print('✅ Índice timestamp_-1 creado');
} catch (e) {
  print('⚠️ Índice timestamp_-1 ya existe o error: ' + e);
}

try {
  db.operaciones.createIndex({ "usuario": 1 });
  print('✅ Índice usuario_1 creado');
} catch (e) {
  print('⚠️ Índice usuario_1 ya existe o error: ' + e);
}

try {
  db.operaciones.createIndex({ "accion": 1 });
  print('✅ Índice accion_1 creado');
} catch (e) {
  print('⚠️ Índice accion_1 ya existe o error: ' + e);
}

// Verificar que las colecciones existen
const collections = db.getCollectionNames();
print('📁 Colecciones en innovasoft_db: ' + collections.join(', '));

print('✅ Inicialización completada');