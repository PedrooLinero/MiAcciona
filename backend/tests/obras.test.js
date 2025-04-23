const request = require("supertest");
const app = require("../index"); // Se asume que index.js exporta la app
const sequelize = require("../config/sequelize"); // Exportación directa

describe("📝 Pruebas sobre la API de Obras", () => {
  let obraId;

  // Test: Crear una nueva obra
  test("✅ POST /api/obras → Crear una nueva obra", async () => {
    const res = await request(app).post("/api/obras").send({
      nombre: "Obra de prueba",
      descripcion: "Una obra de prueba para crear",
      fecha: "2025-02-19",            
      precio: 1000.00,                
      idartista: 1,                   
      imagen_url: "http://example.com/obra.jpg" 
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);
    obraId = res.body.datos.idobra;
  });

  // Test: Obtener todas las obras
  test("✅ GET /api/obras → Obtener todas las obras", async () => {
    const res = await request(app).get("/api/obras");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.datos)).toBe(true);
  });

  // Test: Obtener una obra por ID
  test("✅ GET /api/obras/:idobra → Obtener una obra por ID", async () => {
    const res = await request(app).get(`/api/obras/${obraId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.datos.idobra).toBe(obraId);
  });

  // Test: Actualizar una obra por ID
  test("✅ PUT /api/obras/:idobra → Actualizar una obra", async () => {
    const res = await request(app).put(`/api/obras/${obraId}`).send({
      idobra: obraId, // Se agrega el idobra para cumplir la validación
      nombre: "Obra actualizada",
      descripcion: "Descripción actualizada",
      fecha: "2025-02-19",
      precio: 1000.00,
      idartista: 1,
      imagen_url: "http://example.com/obra.jpg"
    });
    // El controlador devuelve 204 (No Content) en una actualización exitosa
    expect(res.statusCode).toBe(204);
  });

  // Test: Eliminar una obra por ID
  test("✅ DELETE /api/obras/:idobra → Eliminar una obra", async () => {
    const res = await request(app).delete(`/api/obras/${obraId}`);
    expect(res.statusCode).toBe(204);
  });

  // Test: Buscar una obra eliminada debe devolver 404
  test("✅ GET /api/obras/:idobra → Buscar una obra eliminada debe devolver 404", async () => {
    const res = await request(app).get(`/api/obras/${obraId}`);
    expect(res.statusCode).toBe(404);
  });

  // Cerrar la conexión a la base de datos al finalizar los tests
  afterAll(async () => {
    await sequelize.close();
  });
});
