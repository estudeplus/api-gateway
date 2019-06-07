# API Gateway

Serviço responsável por fazer um proxy para os demais microsserviços que compõem a solução Estude+.

## Desenho arquitetural 

- [Diagrama de Classe](https://github.com/estudeplus/docs/wiki/Diagrama-de-classes#api-gateway)
- [Diagrama de Sequência](https://github.com/estudeplus/docs/wiki/Diagrama-de-sequencia#api-gateway)

## Configuração e execução

1. Crie o arquivo `.env` no diretório raiz do projeto para carregar as variáveis de ambiente:
```bash
$ cp env.tmpl .env
```

2. As seguintes variáveis de ambiente precisam ser definidas no arquivo `.env` :
```
# Porta na qual a aplicação será disponibilizada
PORT=3000

# Chave secreta para geração de token de autenticação
KEY=secretkey

# URL do banco de dados MongoDB na qual a aplicação será conectada
MONGO_URL=mongodb://mongo:27017/gateway

```

3. Execute a aplicação com:
```
$(sudo) docker-compose up
```
