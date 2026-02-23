const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao MySQL 🚀");
  }
});

// Criar tabela automaticamente
connection.query(`
  CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    raca VARCHAR(100),
    tipo VARCHAR(100),
    idade INT,
    peso FLOAT,
    preco FLOAT,
    foto TEXT
  )
`);

// Listar animais
app.get("/animais", (req, res) => {
  connection.query("SELECT * FROM animais", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Adicionar animal
app.post("/animais", (req, res) => {
  const { nome, raca, tipo, idade, peso, preco, foto } = req.body;

  connection.query(
    "INSERT INTO animais (nome, raca, tipo, idade, peso, preco, foto) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [nome, raca, tipo, idade, peso, preco, foto],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Animal cadastrado com sucesso 🐂");
    }
  );
});

// Relatório total
app.get("/relatorio", (req, res) => {
  connection.query(
    "SELECT COUNT(*) as total FROM animais",
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results[0]);
    }
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando 🔥");
});