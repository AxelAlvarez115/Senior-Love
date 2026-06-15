import { User, Event, Interest, UserPhoto } from '../models/index.js';
import { Op } from 'sequelize';
import validator from 'validator';
import bcrypt from 'bcrypt';
import User_Relationship from '../models/user_relationship.js';
import sequelize from '../database/database.js';
import userController from './userController.js';
import { avatarUpload, photoUpload } from '../middleware/upload.js';
import fs from 'fs';

const MAX_GALLERY_PHOTOS = 8;

const accountController = {
account: async function (req, res) {
    try {
        const user = await User.findByPk(req.session.userId);
        const photos = await UserPhoto.findAll({
            where: { user_id: req.session.userId },
            order: [['createdAt', 'DESC']],
        });
        res.render('account', { user, photos });
    }
    catch (error) {
        console.log(error);
    }
},
accountInfoAction: async function (req, res) {
    try {
      const user = await User.findByPk(req.session.userId);
      if (!user) {
        return res.redirect('/connexion');
      }
      const { gender, city, bio } = req.body;
      const payload = { gender, city, bio };
      if (req.session.isAdmin) {
        const { firstname, lastname } = req.body;
        if (firstname) payload.firstname = firstname;
        if (lastname) payload.lastname = lastname;
      }
      await user.update(payload);
      req.session.alert = {
        type: 'profil',
        value: 'success',
        message: 'Vos informations ont bien été modifiées'
      };
      res.redirect('/compte');
    }
    catch (error) {
      console.log(error);
      req.session.alert = {
        type: 'profil',
        value: 'error',
        message: 'Une erreur est survenue lors de la mise à jour'
      };
      res.redirect('/compte');
    }
},
accountEmailAction: async function (req, res) {
    const setAlert = (value, message) => {
        req.session.alert = { type: 'profil', value, message };
    };
    try {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.redirect('/connexion');
        }
        const { email, emailValidate, passwordEmail } = req.body;

        if (!email || !validator.isEmail(email)) {
            setAlert('error', 'L\'email saisi est incorrect');
            return res.redirect('/compte');
        }
        if (email !== emailValidate) {
            setAlert('error', 'Les emails entrés ne correspondent pas');
            return res.redirect('/compte');
        }
        if (!passwordEmail) {
            setAlert('error', 'Le mot de passe est requis pour changer l\'email');
            return res.redirect('/compte');
        }
        const passwordOk = await bcrypt.compare(passwordEmail, user.password);
        if (!passwordOk) {
            setAlert('error', 'Le mot de passe est incorrect');
            return res.redirect('/compte');
        }
        if (email === user.email) {
            setAlert('error', 'L\'email saisi est identique à l\'actuel');
            return res.redirect('/compte');
        }
        const doExist = await User.findOne({ where: { email } });
        if (doExist) {
            setAlert('error', 'Cette adresse mail est déjà utilisée');
            return res.redirect('/compte');
        }

        await user.update({ email });
        setAlert('success', 'Votre adresse mail a bien été modifiée');
        res.redirect('/compte');
    }
    catch (error) {
        console.log(error);
        req.session.alert = {
            type: 'global',
            value: 'error',
            message: 'Une erreur est survenue'
        };
        res.redirect('/compte');
    }
},
accountPasswordAction: async function (req, res) {
    const options = {
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    };
    const setAlert = (value, message) => {
        req.session.alert = { type: 'profil', value, message };
    };
    try {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.redirect('/connexion');
        }
        const { currentPassword, password, validatePassword } = req.body;
        if (!currentPassword || !password || !validatePassword) {
            setAlert('error', 'Tous les champs sont requis');
            return res.redirect('/compte');
        }
        const result = await bcrypt.compare(currentPassword, user.password);
        if (!result) {
            setAlert('error', 'Le mot de passe ne correspond pas à celui du compte');
            return res.redirect('/compte');
        }
        if (!validator.isStrongPassword(password, options)) {
            setAlert('error', 'Le mot de passe saisi ne respecte pas les critères');
            return res.redirect('/compte');
        }
        if (password !== validatePassword) {
            setAlert('error', 'La confirmation du mot de passe est incorrecte');
            return res.redirect('/compte');
        }
        await user.update({ password });
        setAlert('success', 'Votre mot de passe a bien été modifié');
        res.redirect('/compte');
    }
    catch (error) {
        console.log(error);
        req.session.alert = { type: 'global', value: 'error', message: 'Une erreur est survenue' };
        res.redirect('/compte');
    }
},
accountDeleteAction: async function (req, res) {
    const setAlert = (value, message) => {
        req.session.alert = { type: 'profil', value, message };
    };
    try {
        const user = await User.findByPk(req.session.userId);
        if (!user) {
            return res.redirect('/connexion');
        }
        const { deletePassword, validateSentence } = req.body;
        if (!deletePassword) {
            setAlert('error', 'Le mot de passe est requis');
            return res.redirect('/compte');
        }
        const result = await bcrypt.compare(deletePassword, user.password);
        if (!result) {
            setAlert('error', 'Le mot de passe saisi ne correspond pas à celui du compte');
            return res.redirect('/compte');
        }
        if (validateSentence !== 'Je souhaite supprimer mon compte') {
            setAlert('error', 'La phrase de validation est incorrecte');
            return res.redirect('/compte');
        }

        // Supprime les fichiers photos de l'utilisateur
        const photos = await UserPhoto.findAll({ where: { user_id: user.id } });
        for (const photo of photos) {
            fs.unlink(`public/uploads/gallery/${photo.filename}`, () => {});
        }
        if (user.avatar) {
            fs.unlink(`public/uploads/avatars/${user.avatar}`, () => {});
        }

        await UserPhoto.destroy({ where: { user_id: user.id } });
        await user.destroy({ force: true });
        req.session.destroy(() => res.redirect('/'));
    }
    catch (error) {
        console.log(error);
        req.session.alert = { type: 'global', value: 'error', message: 'Une erreur est survenue' };
        res.redirect('/compte');
    }
},
accountAvatarAction: function (req, res) {
    avatarUpload(req, res, async (err) => {
        if (err) {
            req.session.alert = { type: 'profil', value: 'error', message: err.message };
            return res.redirect('/compte');
        }
        try {
            if (!req.file) {
                req.session.alert = { type: 'profil', value: 'error', message: 'Aucun fichier sélectionné' };
                return res.redirect('/compte');
            }
            const user = await User.findByPk(req.session.userId);
            if (user.avatar) {
                fs.unlink(`public/uploads/avatars/${user.avatar}`, () => {});
            }
            await user.update({ avatar: req.file.filename });
            req.session.alert = { type: 'profil', value: 'success', message: 'Votre photo de profil a été mise à jour' };
            res.redirect('/compte');
        } catch (error) {
            console.log(error);
            req.session.alert = { type: 'profil', value: 'error', message: 'Une erreur est survenue' };
            res.redirect('/compte');
        }
    });
},
accountPhotoAddAction: function (req, res) {
    photoUpload(req, res, async (err) => {
        if (err) {
            req.session.alert = { type: 'photos', value: 'error', message: err.message };
            return res.redirect('/compte');
        }
        try {
            if (!req.file) {
                req.session.alert = { type: 'photos', value: 'error', message: 'Aucun fichier sélectionné' };
                return res.redirect('/compte');
            }
            const count = await UserPhoto.count({ where: { user_id: req.session.userId } });
            if (count >= MAX_GALLERY_PHOTOS) {
                fs.unlink(`public/uploads/gallery/${req.file.filename}`, () => {});
                req.session.alert = { type: 'photos', value: 'error', message: `Vous avez atteint la limite de ${MAX_GALLERY_PHOTOS} photos` };
                return res.redirect('/compte');
            }
            await UserPhoto.create({ user_id: req.session.userId, filename: req.file.filename });
            req.session.alert = { type: 'photos', value: 'success', message: 'Photo ajoutée avec succès' };
            res.redirect('/compte');
        } catch (error) {
            console.log(error);
            req.session.alert = { type: 'photos', value: 'error', message: 'Une erreur est survenue' };
            res.redirect('/compte');
        }
    });
},
accountPhotoDeleteAction: async function (req, res) {
    try {
        const photo = await UserPhoto.findOne({
            where: { id: req.params.id, user_id: req.session.userId },
        });
        if (!photo) {
            req.session.alert = { type: 'photos', value: 'error', message: 'Photo introuvable' };
            return res.redirect('/compte');
        }
        fs.unlink(`public/uploads/gallery/${photo.filename}`, () => {});
        await photo.destroy();
        req.session.alert = { type: 'photos', value: 'success', message: 'Photo supprimée' };
        res.redirect('/compte');
    } catch (error) {
        console.log(error);
        req.session.alert = { type: 'photos', value: 'error', message: 'Une erreur est survenue' };
        res.redirect('/compte');
    }
},
accountEvent: async function (req, res) {
    try {
        const user = await User.findByPk(req.session.userId);
        const photoCount = await UserPhoto.count({ where: { user_id: req.session.userId } });
        const userWithEvents = await User.findOne({
            where: { id: req.session.userId },
            include: [{ model: Event, as: 'events', include: [{ model: Interest }] }]
        });
        const events = userWithEvents.events;
        res.render('account-event', { user, photoCount, events });
    }
    catch (error) {
        console.log(error);
    }
},

accountMeeting: async function (req, res) {
    try {
        const user = await User.findByPk(req.session.userId);
        const photoCount = await UserPhoto.count({ where: { user_id: req.session.userId } });
        const userWithContacts = await User.findOne({ where: { id: req.session.userId }, include: 'contacts' });
        const contacts = userWithContacts.contacts;
        res.render('account-meeting', { user, photoCount, contacts });
    }
    catch (error) {
        console.log(error);
    }
}
}

export default accountController;
