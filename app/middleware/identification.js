import { User } from '../models/index.js';

const identification = {
    isNotLogged: function (req, res, next) {
        if (!req.session.isLogged) {
            req.session.alert = {
                type: 'global',
                value: 'error',
                message: 'Vous devez être connecté pour accéder à cette page'
            }
            req.session.redirectTo = req.url;
            res.redirect(`/connexion`);
        }
        else {
            next();
        }
    },
    isLogged: function (req, res, next) {
        if (req.session.isLogged) {
            res.render('home', {});
        }
        else {
            next();
        }
    },
    isAdmin: async function (req, res, next) {
        try {
            const user = req.session.userId ? await User.findByPk(req.session.userId) : null;
            if (!user || !user.administrator) {
                return res.status(403).render('error', {
                    message: 'Vous n\'avez pas accès à cette page.',
                    link: '/',
                    pageName: 'd\'accueil'
                });
            }
            res.locals.isAdmin = true;
            req.session.isAdmin = true;
            next();
        }
        catch (error) {
            next(error);
        }
    }
};

export default identification;