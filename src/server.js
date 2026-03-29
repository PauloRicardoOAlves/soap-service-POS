const express = require('express');
const soap = require('soap');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

let solicitacoes = [];
let contadorProtocolo = 1;

const service = {
  AtendimentoService: {
    AtendimentoPort: {
      registrarSolicitacao(args) {
        const novaSolicitacao = {
          protocolo: contadorProtocolo++,
          idUsuario: Number(args.idUsuario),
          nomeUsuario: args.nomeUsuario,
          descricao: args.descricao,
          categoria: args.categoria,
          status: 'ABERTA',
          dataCriacao: new Date().toISOString()
        };

        solicitacoes.push(novaSolicitacao);
        return novaSolicitacao;
      },

      consultarStatus(args) {
        const protocolo = Number(args.protocolo);

        const solicitacao = solicitacoes.find(s => s.protocolo === protocolo);

        if (!solicitacao) {
          return { status: 'SOLICITACAO_NAO_ENCONTRADA' };
        }

        return { status: solicitacao.status };
      },

      listarSolicitacoesPorUsuario(args) {
        const idUsuario = Number(args.idUsuario);

        const resultado = solicitacoes.filter(s => s.idUsuario === idUsuario);

        return { solicitacoes: resultado };
      }
    }
  }
};

const wsdlXml = fs.readFileSync('atendimento.wsdl', 'utf8');

app.get('/', (req, res) => {
  res.send('Servidor SOAP rodando. Acesse /wsdl?wsdl');
});

soap.listen(server, '/wsdl', service, wsdlXml);

server.listen(8000, () => {
  console.log('Servidor rodando em http://localhost:8000');
  console.log('WSDL em http://localhost:8000/wsdl?wsdl');
});