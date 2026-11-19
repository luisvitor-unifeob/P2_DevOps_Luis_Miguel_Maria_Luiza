
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const porta = 3000;

// Permitir requisições da aplicação web da VM1
app.use(cors({
    origin: "http://192.168.122.132",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

// Conexão com o banco MySQL
const banco = mysql.createPool({
    host: "mysql",
    user: "root",
    password: "root123",
    database: "livraria",
    waitForConnections: true,
    connectionLimit: 10
});

// Criar tabela de livros, caso não exista
banco.query(`
    CREATE TABLE IF NOT EXISTS livros (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        quantidade INT NOT NULL
    )
`, (erro) => {
    if (erro) {
        console.error("Erro ao criar tabela:", erro.message);
    } else {
        console.log("Tabela de livros pronta!");
    }
});

// Rota para cadastrar um livro
app.post("/livro", (req, res) => {
    const { titulo, autor, preco, quantidade } = req.body;

    if (
        typeof titulo !== "string" || !titulo.trim() ||
        typeof autor !== "string" || !autor.trim() ||
        typeof preco !== "number" || !Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(quantidade) || quantidade < 0
    ) {
        return res.status(400).json({
            erro: "Dados do livro inválidos"
        });
    }

    const sql = `
        INSERT INTO livros (titulo, autor, preco, quantidade)
        VALUES (?, ?, ?, ?)
    `;

    banco.query(
        sql,
        [titulo, autor, preco, quantidade],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar livro"
                });
            }

            res.status(201).json({
                mensagem: "Livro cadastrado com sucesso!",
                id: resultado.insertId
            });
        }
    );
});

// Rota para listar todos os livros
app.get("/livros", (req, res) => {
    banco.query("SELECT * FROM livros", (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao listar livros"
            });
        }

        res.json(resultados);
    });
});

// Iniciar servidor
app.listen(porta, "0.0.0.0", () => {
    console.log(`API rodando na porta ${porta}`);
});
