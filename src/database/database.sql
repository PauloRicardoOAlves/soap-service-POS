CREATE DATABASE atendimento_db;

CREATE TABLE solicitacoes (
    protocolo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTA',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);