const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// conexão Railway
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao MySQL 🚀");
  }
});

// criar tabela
connection.query(
CREATE TABLE IF NOT EXISTS animais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255),
  tipo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
);

// listar animais
app.get("/animais", (req, res) => {
  connection.query("SELECT * FROM animais", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// adicionar animal
app.post("/animais", (req, res) => {
  const { nome, tipo } = req.body;

  connection.query(
    "INSERT INTO animais (nome, tipo) VALUES (?, ?)",
    [nome, tipo],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Animal cadastrado com sucesso 🐄");
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
