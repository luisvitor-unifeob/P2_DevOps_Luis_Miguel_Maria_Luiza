# P2_Dev_OPS_Luis_Miguel_Vitor_Maria_Luiza_Tavares
# Avaliação Prática de DevOps — Prova B

## Sistema de Cadastro de Livros

**Integrantes:**
- Luis Miguel Vitor RA:24000174
- Maria Luiza Tvavares Procopio Ra:24000174

## Descrição

Aplicação distribuída para cadastro e listagem de livros, desenvolvida para a avaliação prática de DevOps.

O projeto utiliza duas máquinas virtuais provisionadas com OpenTofu, configuradas com Ansible e executa os serviços em containers Docker.

## Tecnologias utilizadas

- OpenTofu e libvirt
- Cloud-init
- Ansible
- Docker e Docker Compose
- Nginx
- HTML e JavaScript
- Node.js e Express
- MySQL 8.0

## Estrutura do projeto

```text
├── ansible/
│   ├── inventory.ini
│   └── playbook.yml
├── iac/
│   ├── cloud_init.cfg#Luis Miguel Vitor RA:24000174
#Maria Luiza Tvavares Procopio Ra:24000174
│   └── main.tf
├── app/
│   ├── Dockerfile
│   └── index.html
├── api/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── server.js
└── README.md
```

## Arquitetura

### VM1 — Aplicação Web
- **IP:** `192.168.122.132`
- **Porta:** `80`
- **Serviço:** Nginx em container Docker
- **Função:** Formulário de cadastro e listagem de livros

### VM2 — API e Banco de Dados
- **IP:** `192.168.122.7`
- **Porta da API:** `3000`
- **Serviços:** Node.js e MySQL em containers separados
- **Função:** Receber requisições HTTP e armazenar os livros

## Como executar

### 1. Criar as máquinas virtuais

```bash
cd iac
tofu init
tofu validate
tofu plan
tofu apply
```

### 2. Configurar o Ansible

Atualizar os IPs no arquivo `ansible/inventory.ini` conforme os endereços apresentados pelo OpenTofu.

Se os IPs mudarem, atualizar também:
- `API_URL` em `app/index.html`
- `origin` do CORS em `api/server.js`

### 3. Executar o playbook

Na pasta principal do projeto:

```bash
ansible -i ansible/inventory.ini Servidores -m ping --private-key ~/.ssh/devops_lab

ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --private-key ~/.ssh/devops_lab
```

O playbook instala os pacotes necessários, configura o Docker e inicia os serviços nas duas VMs.

## Funcionalidades

A aplicação permite:

- Cadastrar livros com título, autor, preço e quantidade em estoque.
- Consultar todos os livros cadastrados.
- Armazenar os registros no MySQL.
- Realizar a comunicação entre VM1 e VM2 por requisições HTTP.

## API REST

### POST /livro

Cadastra um livro no banco de dados.

```bash
curl -X POST http://192.168.122.7:3000/livro \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Dom Casmurro","autor":"Machado de Assis","preco":39.90,"quantidade":10}'
```

### GET /livros

Retorna os livros cadastrados em formato JSON.

```bash
curl http://192.168.122.7:3000/livros
```

## Acesso à aplicação

**Site:** http://192.168.122.132

**API:** http://192.168.122.7:3000/livros

## Testes realizados

- OpenTofu: infraestrutura criada com sucesso.
- Ansible: playbook executado sem falhas.
- Docker: containers iniciados nas duas VMs.
- API: POST `/livro` retornando HTTP 201.
- API: GET `/livros` retornando HTTP 200.
- Interface web: cadastro e listagem funcionando.
- MySQL: registros armazenados e consultados corretamente.
```
