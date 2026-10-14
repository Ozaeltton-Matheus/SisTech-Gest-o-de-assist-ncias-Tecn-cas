# SisTech — Gestão de assistências técnicas

Projeto desenvolvido para a disciplina de Projeto Integrador I do curso de Tecnologia em Sistemas para a Internet.

## Como executar o site

O front-end foi criado com Angular e Tailwind CSS. No terminal, entre na pasta `frontend` e inicie o servidor:

```bash
cd frontend
npm install
npm start
```

Abra <http://localhost:4200/> no navegador. Para acessar a demonstração, use um e-mail válido e uma senha com pelo menos 6 caracteres.

## Telas

- Login e recuperação de acesso.
- Dashboard administrativo.
- Clientes, aparelhos, técnicos e serviços.
- Ordens de serviço e detalhes do atendimento.
- Agendamentos e calendário semanal.
- Orçamentos e pagamentos.
- Portal do cliente.

As telas incluem navegação, busca, filtros e formulários com interações demonstrativas. O projeto é somente front-end: os dados são fictícios, as alterações não são persistidas, e não há servidor, autenticação real, envio de e-mails ou processamento de pagamentos.

## Compilar e testar

Execute estes comandos dentro da pasta `frontend`:

```bash
npm run build
npm test -- --watch=false
```
