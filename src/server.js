const express = require('express');
const soap = require('soap');
const http = require('http');
const dotenv = require('dotenv');
const fs = require('fs');

const pool = require('./database/db');
const logger = require('./logger');
const { gerarToken, validarToken } = require('./auth');

dotenv.config();

const app = express();
const server = http.createServer(app);

function obterTokenSOAP(headers) {
    return headers?.AuthHeader?.Token || null;
}

const service = {
    AtendimentoService: {
        AtendimentoPort: {

            async gerarToken() {
                const token = gerarToken();
                logger.info('Token gerado');
                return { token };
            },

            async registrarSolicitacao(args) {

                const data = args.parameters || args;

                const result = await pool.query(
                    `INSERT INTO solicitacoes (id_usuario, nome_usuario, descricao, categoria)
         VALUES ($1,$2,$3,$4) RETURNING *`,
                    [
                        Number(data.idUsuario),
                        data.nomeUsuario,
                        data.descricao,
                        data.categoria
                    ]
                );

                const s = result.rows[0];

                console.log({
                    protocolo: s.protocolo,
                    idUsuario: s.id_usuario,
                    nomeUsuario: s.nome_usuario,
                    descricao: s.descricao,
                    categoria: s.categoria,
                    status: s.status,
                    dataCriacao: s.data_criacao.toISOString()
                })
                
                return {
                    protocolo: s.protocolo,
                    idUsuario: s.id_usuario,
                    nomeUsuario: s.nome_usuario,
                    descricao: s.descricao,
                    categoria: s.categoria,
                    status: s.status,
                    dataCriacao: s.data_criacao.toISOString()
                };
            },

            async consultarStatus(args) {
                const result = await pool.query(
                    'SELECT status FROM solicitacoes WHERE protocolo=$1',
                    [Number(args.protocolo)]
                );

                return {
                    status: result.rows[0]?.status || 'NAO_ENCONTRADO'
                };
            },

            async listarSolicitacoesPorUsuario(args) {
                const result = await pool.query(
                    `SELECT * FROM solicitacoes WHERE id_usuario=$1 ORDER BY protocolo`,
                    [Number(args.idUsuario)]
                );

                return {
                    solicitacoes: result.rows.map(s => ({
                        protocolo: s.protocolo,
                        idUsuario: s.id_usuario,
                        nomeUsuario: s.nome_usuario,
                        descricao: s.descricao,
                        categoria: s.categoria,
                        status: s.status,
                        dataCriacao: s.data_criacao.toISOString()
                    }))
                };
            },

            async atualizarStatus(args, _cb, headers) {
                const token = obterTokenSOAP(headers);

                if (!token) throw new Error('TOKEN_OBRIGATORIO');
                validarToken(token);

                const result = await pool.query(
                    `UPDATE solicitacoes
                     SET status=$1
                     WHERE protocolo=$2
                     RETURNING *`,
                    [args.status, Number(args.protocolo)]
                );

                return {
                    status: result.rows[0]?.status || 'NAO_ENCONTRADO'
                };
            },

            async removerSolicitacao(args, _cb, headers) {
                const token = obterTokenSOAP(headers);

                if (!token) throw new Error('TOKEN_OBRIGATORIO');
                validarToken(token);

                const result = await pool.query(
                    `DELETE FROM solicitacoes
                     WHERE protocolo=$1
                     RETURNING protocolo`,
                    [Number(args.protocolo)]
                );

                return {
                    resultado: result.rows.length
                        ? 'REMOVIDA_COM_SUCESSO'
                        : 'NAO_ENCONTRADA'
                };
            }
        }
    }
};

app.get('/', (req, res) => {
    res.send('SOAP ativo');
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'UP', database: 'OK' });
    } catch {
        res.status(500).json({ status: 'DOWN' });
    }
});

const wsdlXml = fs.readFileSync('atendimento.wsdl', 'utf8');

soap.listen(server, {
    path: '/wsdl',
    services: service,
    xml: wsdlXml
});

server.listen(process.env.PORT || 8000, () => {
    console.log(`Servidor: http://localhost:${process.env.PORT || 8000}`);
    console.log(`WSDL: http://localhost:${process.env.PORT || 8000}/wsdl?wsdl`);
});