const usuariosRepository = require('../repositories/usuariosRepository');
const APIError = require('../utils/errorHandler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret';

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
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS) || 10); // cria o 
        // salt
        const hashedPassword = await bcrypt.hash(password, salt); // aplica o hash na senha

        const newUser = await usuariosRepository.create({ nome, email, password: hashedPassword });

        const { password: _, ...safeUser } = newUser;

        res.status(201).json({ message: 'User created successfully', user: safeUser });
    } catch (error) {
        console.log(error);
        return next(new APIError(500, 'Error register new user.'));
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await usuariosRepository.readById(id);

        if (!user) {
            return next(new APIError(404, 'User not found.'));
        }

        await usuariosRepository.remove(id);

        res.status(204).send();
    } catch (error) {
        return next(new APIError(500, 'Error in deleting user.'));
    }
}

const logout = (req, res, next) => {
        res.clearCookie('token', { path: '/' });

        return res.status(200).json({ status: 200, message: 'Logout successfully.' });
}

module.exports = { login, register, deleteUser, logout };