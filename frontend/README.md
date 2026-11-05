# Front-end Sistecnica

Interface demonstrativa desenvolvida com Angular e Tailwind CSS.

## Executar

```bash
npm install
npm start
```

Abra `http://localhost:4200/`. Para entrar, informe um e-mail válido e uma senha de pelo menos 6 caracteres. A autenticação é simulada e direciona ao dashboard.

## Telas

Dashboard; clientes; aparelhos; técnicos; serviços; ordens de serviço e detalhes; agendamentos; orçamentos; pagamentos; portal do cliente; login e recuperação de acesso.

## Interações

Navegação entre módulos, pesquisa e filtros nas listas, inclusão local de registros, alteração demonstrativa de etapas e status, ações de orçamento e pagamento, consentimento no portal do cliente e impressão/visualização de arquivos.

Todos os dados são fictícios e as alterações são mantidas apenas enquanto a aplicação está aberta. Não há integração de autenticação, servidor, envio de e-mail ou processamento de pagamentos. A opção de lembrar e-mail guarda somente esse endereço no armazenamento local do navegador.

## Compilar e testar

```bash
npm run build
npm test -- --watch=false
```
