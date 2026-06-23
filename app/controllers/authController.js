import { User, Interest } from "../models/index.js";
import validator from 'validator';
import bcrypt from 'bcrypt';

const PASSWORD_OPTIONS = {
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
};

const authController = {
    register: async function (req, res) {
        try {
            const interests = await Interest.findAll();
            res.render('register', { title: 'inscription', interests });
        }
        catch (error) {
            console.log(error);
            res.render('register', { title: 'inscription', interests: [], alert: { value: 'error', message: 'Une erreur est survenue' } });
        }
    },
    registerAction: async function (req, res) {
        const renderError = async (message) => {
            const interests = await Interest.findAll().catch(() => []);
            res.render('register', { title: 'inscription', interests, alert: { value: 'error', message } });
        };
        try {
            const { firstname, lastname, email, password, passwordConfirm, phone, city, date_of_birth, gender } = req.body;

            if (!firstname || !lastname || !email || !password || !phone || !city) {
                return renderError('Tous les champs obligatoires doivent être remplis');
            }
            if (!validator.isEmail(email)) {
                return renderError('L\'email saisi est incorrect');
            }
            if (!validator.isMobilePhone(String(phone), 'fr-FR')) {
                return renderError('Le numéro de téléphone est invalide');
            }
            if (!validator.isStrongPassword(password, PASSWORD_OPTIONS)) {
                return renderError('Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un symbole');
            }
            if (password !== passwordConfirm) {
                return renderError('La confirmation du mot de passe ne correspond pas');
            }

            const existing = await User.findOne({ where: { email } });
            if (existing) {
                return renderError('Cet email est déjà utilisé');
            }

            const user = await User.create({
                firstname,
                lastname,
                email,
                password,
                phone: String(phone),
                city,
                date_of_birth: date_of_birth || null,
                gender: gender || null
            });

            const interestInput = req.body.interest;
            if (interestInput) {
                const interestIds = (Array.isArray(interestInput) ? interestInput : [interestInput])
                    .map(v => Number(v))
                    .filter(v => Number.isInteger(v) && v > 0);
                if (interestIds.length) {
                    const interests = await Interest.findAll({ where: { id: interestIds } });
                    await user.setInterests(interests);
                }
            }

            req.session.isLogged = true;
            req.session.userId = user.id;
            req.session.isAdmin = false;
            req.session.alert = {
                type: 'global',
                value: 'success',
                message: 'Votre compte a bien été créé'
            };
            res.redirect('/');
        }
        catch (error) {
            console.log(error);
            return renderError('Une erreur est survenue lors de la création de votre compte');
        }
    },
    login: function (req, res) {
        res.render('login', { title: 'connexion' });
    },
    loginAction: async function (req, res) {
        const invalidCredentials = () => {
            req.session.alert = {
                type: 'global',
                value: 'error',
                message: 'L\'email ou le mot de passe est incorrect'
            };
            res.redirect('/connexion');
        };
        try {
            const { email, password } = req.body;
            if (!email || !password || !validator.isEmail(email)) {
                return invalidCredentials();
            }

            const user = await User.findOne({
                where: { email },
                attributes: ["id", "password", "administrator"]
            });
            if (!user) {
                return invalidCredentials();
            }

            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                return invalidCredentials();
            }

            Object.assign(req.session, {
                isLogged: true,
                userId: user.id,
                isAdmin: user.administrator
            });
            const url = req.session.redirectTo || '/';
            req.session.redirectTo = null;
            req.session.alert = {
                type: 'global',
                value: 'success',
                message: 'Vous êtes maintenant connecté'
            };
            res.redirect(url);
        }
        catch (error) {
            console.log(error);
            return invalidCredentials();
        }
    },
    logout: function (req, res) {
        req.session.destroy();
        res.locals.isLogged=false;
        res.redirect('/');
    },
};

export default authController;
