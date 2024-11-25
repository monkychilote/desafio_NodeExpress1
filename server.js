const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Servir la carpeta "public" con el archivo index.html
app.use(express.static("public"));

const PORT = 3000;
const FILE = "repertorio.json";

// Middleware para leer el archivo JSON
const readJson = () => {
  try {
    const data = fs.readFileSync(FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
};

// Middleware para escribir en el archivo JSON
const writeJson = (data) => {
  try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error al escribir en el archivo:", error);
  }
};

// Ruta GET: Leer las canciones
app.get("/canciones", (req, res) => {
  const canciones = readJson();
  res.json(canciones);
});

// Ruta POST: Agregar una canción
app.post("/canciones", (req, res) => {
  const canciones = readJson();
  const nuevaCancion = req.body;
  canciones.push(nuevaCancion);
  writeJson(canciones);
  res.status(201).send("Canción agregada");
});

// Ruta PUT: Actualizar una canción
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = readJson();
  const index = canciones.findIndex((c) => c.id == id);

  if (index !== -1) {
    canciones[index] = { ...canciones[index], ...req.body };
    writeJson(canciones);
    res.send("Canción actualizada");
  } else {
    res.status(404).send("Canción no encontrada");
  }
});

// Ruta DELETE: Eliminar una canción
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const canciones = readJson();
  const index = canciones.findIndex((c) => c.id == id);

  if (index !== -1) {
    canciones.splice(index, 1);
    writeJson(canciones);
    res.send("Canción eliminada");
  } else {
    res.status(404).send("Canción no encontrada");
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
