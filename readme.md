
# Programação Orientada a serviços

*Paulo Ricardo de Oliveira Alves*

O objetivo do sistema é:

- Registrar solicitações de atendimento;
- Consultar o status de uma solicitação;
- Listar solicitações de um usuário.

## Principais atores
- Sistema cliente;
- Administrador;
- Serviço SOAP

## Testes realizados

Foram realizados os testes usando as funções com o auxilio do software Postman

- RegistrarSolicitacao: cadastrou uma nova solicitação e retornou protocolo e status inicial;
- ConsultarStatus: retornou corretamente o status de uma solicitação existente;
- ListarSolicitacoesPorUsuario: retornou a lista de solicitações vinculadas ao usuário informado.

## Instruções de execução

Executar 

```
npm init -y
npm install soap express
node server.js
```

Depois, fazer as requisições para o endereço:
 ```
 http://localhost:8000/wsdl?wsdl
 ```

 Se tiver tudo certo no seu terminal vai aparecer:

 ```
 Servidor rodando em http://localhost:8000
WSDL em http://localhost:8000/wsdl?wsdl
```

Lembrando que as requisições serão enviadas utilizando o método **POST**