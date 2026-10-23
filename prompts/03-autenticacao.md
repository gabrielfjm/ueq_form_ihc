# 03 · Cadastro e login do pesquisador

```
Implemente cadastro, login e logout do pesquisador.

- Páginas /entrar e /cadastrar, seguindo docs/design.md: formulário estreito alinhado à esquerda, rótulo acima do campo, sem card flutuando no meio da tela, sem ilustração
- Siga docs/ihc.md seção 4.2: rótulo visível ligado ao campo, `autocomplete` correto (name, email, current-password, new-password), botão "Mostrar senha" acessível (aria-pressed), colar senha permitido, regras de senha visíveis ANTES de digitar e não só no erro
- Erro: resumo no topo com links para os campos, foco no resumo, mensagem também abaixo de cada campo ligada por aria-describedby. Campo inválido com aria-invalid
- Senha com bcrypt, sessão em cookie httpOnly, sameSite lax, secure em produção
- Validação com Zod no servidor. Mensagens de erro específicas e em português, abaixo do campo ("Esse e-mail já tem conta. Entre por aqui.")
- Middleware protegendo tudo dentro de (pesquisador). Quem não tem sessão vai para /entrar com redirect de volta
- Rotas do participante (/r/...) nunca exigem sessão

Página /conta ("Minha conta"), link na barra superior entre "Criar estudo" e "Sair":
- Dados cadastrais (nome e e-mail) em um formulário com "Salvar alterações". E-mail novo não pode já ter conta ("Esse e-mail já é de outra conta.")
- Senha em um formulário separado: senha atual + nova senha, regras visíveis antes de digitar, "Mostrar senha" em cada campo, autocomplete current-password e new-password (com um campo username escondido para o gerenciador de senhas). Trocar a senha encerra as outras sessões
- Excluir conta: confirmação em linha digitando o e-mail, dizendo quantos estudos e respostas vão junto. Apaga em cascata
- Ficha lateral com número de estudos, respostas coletadas e data de criação
- Toda ação confirma o resultado em role="status" ("Dados salvos.", "Senha trocada.")

Sem "esqueci minha senha", sem login social, sem confirmação por e-mail (fora do escopo da proposta).

Crie no seed de desenvolvimento um pesquisador de teste com e-mail e senha lidos de variáveis do .env.

Teste e2e: cadastrar, sair, entrar, acessar rota protegida sem sessão e ser redirecionado. Fazer o cadastro e o login só com teclado. Rodar verificarAcessibilidade nas duas páginas, inclusive no estado com erro.

Depois rode /revisar-ihc em /entrar e /cadastrar.
```
