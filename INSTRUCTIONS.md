# Instructions

## Autenticação

## Registrar usuário
**Endpoint:** `POST /auth/register`

**Body JSON:**
```json
{
    "nome": "André",
    "email": "andre@gmail.com",
    "senha": "senha@andre"
}
```
Resposta(201):
```json
{
  "id": 1,
  "nome": "André",
  "email": "andre@gmail.com"
}
```

Se o e-mail já estiver registrado:
```json
Resposta(400):
{
  "message": "Email already exists."
}
```

## Login
**Endpoint:** `POST /auth/login`

**Body JSON**
```json
{
    "email": "andre@gmail.com",
    "senha": "senha@andre"
}
```

Resposta(200):
```json
{
    "message": "User logged in successfully.",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwibm9tZSI6IkFuZHJlIiwiZW1haWwiOiJhbmRyZUBnbWFpbC5jb20iLCJpYXQiOjE3NTYzMTg0NDEsImV4cCI6MTc1NjMyMjA0MX0.mwF1p_HMmpv73wKp79N6KCuhyZTGjiTcgubAcBmUVFw"
}
```

## Logout
**Endpoint:** `POST /auth/logout`
Header necessário: Authorization: Bearer <seu_token_jwt>

Resposta(200):
```json
{
  "message": "Logout successfully.",
}
```

## Uso do JWT
Após o login, copie o token recebido e incluir no Header Authorization de todas as requisições protegidas. Por exemplo: se for fazer uma requisição GET http://localhost:3000/agentes é necessário fazer um login antes, copiar o token e inserir no Header da requisição o Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...

Header: Authorization: Bearer <seu_token_jwt>