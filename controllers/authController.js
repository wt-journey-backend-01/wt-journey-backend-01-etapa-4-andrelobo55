const usuariosRepository = require('../repositories/usuariosRepository');
const APIError = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret';

const login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;
        const user = await usuariosRepository.readByEmail(email); // recebe um objeto usuário com o 
        // mesmo email passado no body

        if (!user) { // verifica se o usuário existe
            return next(new APIError(401, 'Invalid credentials.'));
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha); // compara se a senha do
        // body é a mesma que a que está armazenada no banco de dados

        if (!isPasswordValid) { // senão for a mesma, retorna erro
            return next(new APIError(401, 'Invalid credentials.'));
        }

        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, SECRET,
            { expiresIn: '1h' }); // cria um token a partir do payload do usuário, secret e o tempo
        // de expiração

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/'
        });

        res.status(200).json({ message: 'User logged in successfully', access_token: token });
    } catch (error) {
        console.log(error);
        return next(new APIError(500, 'Error logging in'));
    }
}

const register = async (req, res, next) => {
    try {
        const allowedFields = ['nome', 'email', 'senha'];
        const extraFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
        if (extraFields.length > 0) {
            return next(new APIError(400, `Campos não permitidos: ${extraFields.join(', ')}`));
        }

        const { nome, email, senha } = req.body;

        if (!nome || nome.trim() === '') {
            return next(new APIError(400, "Campo 'nome' não pode ser vazio."));
        }

        if (!email || email.trim() === '') {
            return next(new APIError(400, "Campo 'email' não pode ser vazio."));
        }

        if (!senha || senha.trim() === '') {
            return next(new APIError(400, "Campo 'senha' não pode ser vazio."));
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(senha)) {
            return next(new APIError(400, "Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais."));
        }

        const user = await usuariosRepository.readByEmail(email); // recebe um usuário a partir do
        // email enviado pelo body

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new APIError(400, "Email inválido"));
        }

        if (user) { // verifica se o email existe
            return next(new APIError(400, 'Email already exists.'));
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10); // cria o 
        // salt
        const hashedPassword = await bcrypt.hash(senha, salt); // aplica o hash na senha

        const newUser = await usuariosRepository.create({ nome, email, senha: hashedPassword });

        const { senha: _, ...safeUser } = newUser;

        res.status(201).json({ message: 'User created successfully', user: safeUser });
    } catch (error) {
        console.log(error);
        return next(new APIError(500, 'Error register new user.'));
    }
}

const logout = (req, res, next) => {
    res.clearCookie('token', { path: '/' });

    return res.status(200).json({ status: 200, message: 'Logout successfully.' });
}

module.exports = { login, register, logout };