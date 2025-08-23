const usuariosRepository = require('../repositories/usuariosRepository');
const APIError = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secret';

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await usuariosRepository.readByEmail(email); // recebe um objeto usuário com o 
        // mesmo email passado no body

        if (!user) { // verifica se o usuário existe
            return next(new APIError(404, 'User not found.'));
        }

        const isPasswordValid = await bcrypt.compare(password, user.password); // compara se a senha do
        // body é a mesma que a que está armazenada no banco de dados

        if (!isPasswordValid) { // senão for a mesma, retorna erro
            return next(new APIError(400, 'Invalid password.'));
        }

        const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email}, SECRET,
            { expiresIn: '1h' }); // cria um token a partir do payload do usuário, secret e o tempo
        // de expiração

        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        return next(new APIError(500, 'Error logging in'));
    }
}

const register = async (req, res, next) => {
    try {
        const { nome, email, password } = req.body;
        const user = await usuariosRepository.readByEmail(email); // recebe um usuário a partir do
        // email enviado pelo body

        if (user) { // verifica se o email existe
            return next(new APIError(400, 'Email already exists.'));
        }
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10); // cria o salt
        const hashedPassword = await bcrypt.hash(password, salt); // aplica o hash na senha

        const newUser = await usuariosRepository.create({ nome, email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        return next(new APIError(500, 'Error register new user.'));
    }
}

module.exports = { login, register };