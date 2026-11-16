# SisTech — Gestão de assistências técnicas

Projeto desenvolvido para a disciplina de Projeto Integrador I do curso de Tecnologia em Sistemas para a Internet.

## Backend: autenticação e autorização

O backend usa Passport Local no login e JWT nos endpoints autenticados. Copie `.env.example` para `.env` e substitua `JWT_SECRET` por um segredo aleatório privado (com pelo menos 32 caracteres). `JWT_EXPIRES_IN` é a duração do access token em segundos (padrão: 900). O arquivo `.env` não deve ser versionado.

O banco também pode ser configurado com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` e `DB_NAME`. O TypeORM permanece com `synchronize: false`.

### Regras de acesso

- Cadastro público (`POST /usuarios`) sempre cria `CLIENTE`; receber `tipo_usuario` é rejeitado pela validação estrita.
- Somente `ADMIN` pode listar/atualizar usuários ou criar contas com perfil por `POST /usuarios/admin`.
- `GET /usuarios/me` e `GET /auth/profile` retornam somente os dados públicos do usuário autenticado.
- Rotas de ordens de serviço exigem JWT e perfil `ADMIN` ou `FUNCIONARIO`.
- Senhas e hashes não são incluídos nas respostas. A senha é verificada/armazenada com Argon2.

### Limite atual de propriedade das ordens de serviço

As ordens de serviço atuais são mantidas somente em memória e não têm relação persistida com `usuario`; o campo textual `cliente` não comprova identidade. Por isso, clientes não podem consultar OS neste momento, e a API não finge aplicar propriedade usando IDs ou nomes enviados pelo frontend. Para habilitar “minhas ordens”, será necessário persistir as OS e adicionar, por migration, uma chave estrangeira do usuário cliente na entidade/tabela de OS; consultas e alterações deverão filtrar por essa chave no backend. Nenhuma migration foi criada nesta implementação.

### Exemplos

Login:

```http
POST /auth/login
Content-Type: application/json

{"email":"cliente@example.com","senha":"senha-cadastrada"}
```

Resposta: `{"access_token":"...","user":{"id_usuario":1,"email":"cliente@example.com","tipo_usuario":"CLIENTE","ativo":true}}`.

Perfil autenticado:

```http
GET /auth/profile
Authorization: Bearer <access_token>
```

Listar usuários (somente ADMIN):

```http
GET /usuarios
Authorization: Bearer <access_token>
```

Criar OS (ADMIN ou FUNCIONARIO):

```http
POST /ordens-servico
Authorization: Bearer <access_token>
Content-Type: application/json

{"cliente":"Cliente","equipamento":"Notebook","defeitoRelatado":"Não liga"}
```

Consultar OS (ADMIN ou FUNCIONARIO):

```http
GET /ordens-servico/1
Authorization: Bearer <access_token>
```

### Front-end (Angular)

O front-end usa Angular e Tailwind CSS. No terminal, entre na pasta `frontend` e inicie o servidor:

```bash
cd frontend
npm install
npm start
```
