<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para andrelobo55:

Nota final: **50.9/100**

```markdown
# Feedback para andrelobo55 🚓🔐

Olá André! Primeiro, quero te parabenizar pela dedicação e pelo progresso no seu projeto! 🎉 Você conseguiu implementar várias funcionalidades essenciais, e isso é um grande mérito. Vamos juntos destrinchar o que está indo bem e onde podemos melhorar para deixar sua API ainda mais profissional e segura! 💪

---

## 🎉 Pontos Fortes e Conquistas Bônus

- Sua API está protegendo bem as rotas de agentes e casos com o middleware de autenticação JWT. Isso é fundamental e você acertou a aplicação do middleware nas rotas.
- O login está funcionando corretamente, gerando JWT com expiração válida e armazenando o token no cookie com boas práticas (httpOnly, secure, sameSite).
- O logout limpa o cookie e responde com status 200, o que é ótimo para a experiência do usuário.
- Você já implementou o endpoint de exclusão de usuários com resposta correta.
- O registro de usuários funciona e impede duplicidade de emails.
- A documentação no `INSTRUCTIONS.md` está clara e explica bem o uso do JWT no header `Authorization`.
- Parabéns por ter passado todos os testes base essenciais para autenticação, agentes e casos, além de alguns bônus! Isso mostra que seu projeto está no caminho certo.

---

## ⚠️ Análise dos Testes que Falharam e Pontos de Melhoria

### 1. Falhas nas validações de criação de usuários (muitos erros 400)

Os testes que falharam indicam que sua API não está validando corretamente os dados de entrada no cadastro de usuários. Veja os testes que falharam:

- `USERS: Recebe erro 400 ao tentar criar um usuário com nome vazio`
- `USERS: Recebe erro 400 ao tentar criar um usuário com email vazio`
- `USERS: Recebe erro 400 ao tentar criar um usuário com email nulo`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha curta de mais`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha sem números`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha sem caractere especial`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha sem letra maiúscula`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha sem letras`
- `USERS: Recebe erro 400 ao tentar criar um usuário com senha nula`
- `USERS: Recebe erro 400 ao tentar criar um usuário com campo faltante`

#### Por que isso está acontecendo?

No seu `authController.js`, o método `register` não possui nenhuma validação explícita para os campos `nome`, `email` e principalmente para os critérios complexos da senha (mínimo de 8 caracteres, ao menos uma letra minúscula, uma maiúscula, um número e um caractere especial).

Veja trecho do seu código:

```js
const register = async (req, res, next) => {
    try {
        const { nome, email, senha } = req.body;
        const user = await usuariosRepository.readByEmail(email);

        if (user) {
            return next(new APIError(400, 'Email already exists.'));
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const newUser = await usuariosRepository.create({ nome, email, senha: hashedPassword });

        const { senha: _, ...safeUser } = newUser;

        res.status(201).json({ message: 'User created successfully', user: safeUser });
    } catch (error) {
        console.log(error);
        return next(new APIError(500, 'Error register new user.'));
    }
}
```

Você está assumindo que o corpo da requisição está correto, sem validar nada antes de criar o usuário.

#### Como corrigir?

Você precisa implementar validações robustas para:

- Verificar se `nome`, `email` e `senha` estão presentes e não são vazios/nulos.
- Validar o formato do email (pode usar regex simples ou libs como `validator`).
- Validar a senha conforme os requisitos mínimos (8 caracteres, letras maiúsculas/minúsculas, número e caractere especial).

Exemplo simples de validação de senha com regex:

```js
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}
```

Você pode usar isso no início do seu `register`:

```js
if (!nome || nome.trim() === '') {
  return next(new APIError(400, "Campo 'nome' é obrigatório."));
}

if (!email || email.trim() === '') {
  return next(new APIError(400, "Campo 'email' é obrigatório."));
}

// Validação simples de email (pode melhorar com libs)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return next(new APIError(400, "Email inválido."));
}

if (!senha) {
  return next(new APIError(400, "Campo 'senha' é obrigatório."));
}

if (!validatePassword(senha)) {
  return next(new APIError(400, "Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."));
}
```

Assim, você garante que as regras de negócio da senha e dos dados do usuário estão sendo respeitadas antes de tentar salvar no banco.

---

### 2. Estrutura do projeto e arquivos faltantes

Você tem quase toda a estrutura correta, mas reparei que o arquivo `usuariosRoutes.js` está sendo usado no `server.js`:

```js
const usuariosRoutes = require('./routes/usuariosRoutes');
app.use("/usuarios", usuariosRoutes);
```

Porém, você não enviou o conteúdo desse arquivo na submissão. Além disso, o enunciado pede que as rotas sensíveis de agentes e casos sejam protegidas, e que as rotas de usuários tenham endpoints como `/usuarios/me` (bônus) e exclusão de usuários.

**Se esse arquivo não existir ou não estiver implementado corretamente, pode causar erros ou falhas em testes relacionados a usuários.**

**Verifique se:**

- Você criou o arquivo `routes/usuariosRoutes.js`.
- Este arquivo exporta as rotas necessárias, incluindo `DELETE /usuarios/:id` (que está implementado no controller `authController.deleteUser`).
- Se quiser fazer o bônus, implemente o `/usuarios/me` que retorna os dados do usuário autenticado.

---

### 3. Middleware de autenticação: uso de token

No seu `middlewares/authMiddleware.js`, você tem:

```js
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.token;
    const headerToken = authHeader || cookieToken;
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return next(new APIError(401, "Token necessary."));
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err) => {
        if (err) {
            return next(new APIError(400, "Invalid token."));
        }
        next();
    });
}
```

Aqui, você tenta pegar o token do header `Authorization` e, se não existir, do cookie. Porém, a variável `token` está sendo extraída **apenas do header**, ignorando o token do cookie.

Ou seja, se o token estiver só no cookie, o middleware não vai conseguir validar e vai retornar erro.

**Sugestão para corrigir:**

```js
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.token;

    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    } else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return next(new APIError(401, "Token necessary."));
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) {
            return next(new APIError(401, "Invalid token."));
        }
        req.user = decoded; // importante para acessar dados do usuário em rotas protegidas
        next();
    });
}
```

Além disso, note que você não está adicionando `req.user = decoded`, o que pode ser importante para acessar o usuário autenticado dentro dos controllers.

---

### 4. Status code e mensagens de erro

No seu `authController.js` no método `login`, você retorna erros 404 para usuário não encontrado e 400 para senha inválida:

```js
if (!user) {
    return next(new APIError(404, 'User not found.'));
}

if (!isPasswordValid) {
    return next(new APIError(400, 'Invalid password.'));
}
```

Porém, o enunciado pede que o endpoint de login retorne status 400 para email já em uso (no registro) e 401 Unauthorized para token inválido.

No login, a resposta para credenciais inválidas normalmente é 401 Unauthorized para ambos casos (usuário não encontrado ou senha inválida), para não dar pistas de qual dado está errado.

**Recomendo ajustar para:**

```js
if (!user) {
    return next(new APIError(401, 'Invalid credentials.'));
}

if (!isPasswordValid) {
    return next(new APIError(401, 'Invalid credentials.'));
}
```

Assim, fica mais seguro e alinhado com boas práticas.

---

### 5. Validação da senha no registro

Você não está validando o formato da senha, conforme o requisito do desafio:

> A senha deve ter no mínimo 8 caracteres, sendo pelo menos uma letra minúscula, uma letra maiúscula, um número e um caractere especial.

Essa validação é fundamental para segurança e para passar os testes.

---

## 📚 Recomendações de Aprendizado

Para ajudar você a corrigir e aprimorar seu projeto, recomendo fortemente os seguintes vídeos:

- **Validação e autenticação com JWT e bcrypt:**  
  https://www.youtube.com/watch?v=L04Ln97AwoY  
  *Esse vídeo, feito pelos meus criadores, explica muito bem como usar JWT e bcrypt juntos para autenticação segura.*

- **Conceitos básicos de autenticação e segurança:**  
  https://www.youtube.com/watch?v=Q4LQOfYwujk  
  *Esse vídeo, feito pelos meus criadores, fala muito bem sobre os fundamentos da cibersegurança e autenticação.*

- **Knex.js migrations e seeds:**  
  https://www.youtube.com/watch?v=dXWy_aGCW1E  
  *Se quiser revisar como criar migrations e seeds corretamente, esse vídeo é ótimo.*

- **Estrutura MVC para Node.js:**  
  https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s  
  *Para organizar melhor seu projeto e entender a arquitetura MVC.*

---

## 📝 Resumo dos Principais Pontos para Melhorar

- [ ] **Adicionar validações no registro de usuários** para nome, email (formato e existência), e senha (regras de complexidade).
- [ ] **Corrigir o middleware de autenticação** para considerar token vindo do cookie e adicionar `req.user` após validação.
- [ ] **Ajustar status codes e mensagens de erro** no login para usar 401 Unauthorized ao invés de 404 ou 400.
- [ ] **Garantir que o arquivo `usuariosRoutes.js` existe e está implementado** com as rotas necessárias, incluindo exclusão de usuários.
- [ ] **Implementar o endpoint `/usuarios/me`** para retornar dados do usuário autenticado (bônus que pode melhorar sua nota).
- [ ] **Testar todos os casos de validação** para garantir que erros 400 são retornados quando os dados estão inválidos ou faltando.

---

## Finalizando 🚀

André, você está no caminho certo para construir uma API REST segura e robusta! Não desanime com os detalhes das validações — elas são fundamentais para proteger seu sistema e garantir uma boa experiência para os usuários.  

Continue focado nas boas práticas de segurança, validação e organização do código. Com as correções que sugeri, sua aplicação vai ficar ainda mais profissional e pronta para produção!  

Se precisar de ajuda para implementar as validações ou ajustar o middleware, me chame aqui que te ajudo passo a passo! 👊

Boa codificação e até a próxima! 👨‍💻✨
```


> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>