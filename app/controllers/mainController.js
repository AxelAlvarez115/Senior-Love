import { User, User_Relationship, UserPhoto, Notification } from '../models/index.js';
import { Op } from "sequelize";
import User_ContactRequest from '../models/user_contactRequest.js';
import { io } from "../../index.js";

const mainController = {
	home: function (req, res) {
		res.render('home', {
			title: 'Accueil',
		});
	},
	meeting: async function (req, res) {
		try {
			const userId = req.session.userId;
			const currentUser = await User.findByPk(userId, {
				include: [{
					model: User,
					as: 'contacts',
					attributes: ['id']
				}]
			});
			const contactIds = currentUser.contacts.map(contact => contact.id);

			// Filtre sur le genre des candidats selon la préférence de l'utilisateur connecté
			const genderFilter = currentUser.gender_preference && currentUser.gender_preference !== 'tous'
				? { gender: currentUser.gender_preference }
				: {};

			// Filtre réciproque : le candidat doit accepter le genre de l'utilisateur connecté
			const acceptsMeFilter = currentUser.gender
				? {
					[Op.or]: [
						{ gender_preference: null },
						{ gender_preference: 'tous' },
						{ gender_preference: currentUser.gender },
					]
				  }
				: {};

			const users = await User.findAll({
				where: {
					id: { [Op.notIn]: [...contactIds, userId] },
					...genderFilter,
					...acceptsMeFilter,
				},
				attributes: { exclude: ['password'] }
			});
			res.render('meeting', { users });
		}
		catch (error) {
			console.log(error);
			res.status(500).render('error', { message: 'Une erreur est survenue.', link: '/', pageName: 'd\'accueil' });
		}
	},
	meetingProfil: async function (req, res) {
		try {
			const contact = await User.findByPk(req.params.contactId, { attributes: { exclude: ['password'] } });
			if (!contact) {
				return res.redirect('/rencontre');
			}
			const photos = await UserPhoto.findAll({
				where: { user_id: req.params.contactId },
				order: [['createdAt', 'DESC']],
			});
			const relationship = await User_Relationship.findOne({
				where: { user_id: req.session.userId, contact_id: contact.id }
			});
			const isContact = !!relationship;
			res.render('meetingProfil', { contact, photos, isContact });
		}
		catch (error) {
			console.log(error);
			res.status(500).render('error', { message: 'Une erreur est survenue.', link: '/', pageName: 'd\'accueil' });
		}
	},
	meetingProfilAdd: async function (req, res) {
		try {
			const userId = req.session.userId;
			const contactId = Number(req.params.contactId);
			if (!Number.isInteger(contactId) || contactId === userId) {
				return res.redirect('/rencontre');
			}
			const contact = await User.findByPk(contactId, { attributes: { exclude: ['password'] } });
			if (!contact) {
				return res.redirect('/rencontre');
			}
			const photos = await UserPhoto.findAll({
				where: { user_id: contactId },
				order: [['createdAt', 'DESC']],
			});
			const relationship = await User_Relationship.findOne({where: {user_id: userId, contact_id: contact.id}});
			const isRequest = await User_ContactRequest.findOne({where: {[Op.or]: [{requester_id: userId, requestee_id: contact.id}, {requester_id: contact.id, requestee_id: userId}]}});
			if (relationship) {
				res.render('meetingProfil', { contact, photos, isContact: true, alert: { type: 'global', value: 'warning', message: `${contact.firstname} fait déjà partie de vos contacts.` } });
			}
			else if (isRequest) {
				if (isRequest.requester_id === userId) {
					res.render('meetingProfil', { contact, photos, isContact: false, alert: { type: 'global', value: 'warning', message: `Vous avez déjà envoyé une demande de contact à ${contact.firstname}.` } });
				}
				else if (isRequest.requestee_id === userId) {
					await isRequest.destroy({force: true});
					await User_Relationship.create({user_id: userId, contact_id: contact.id});
					await User_Relationship.create({user_id: contact.id, contact_id: userId});
					const currentUser = await User.findByPk(userId);
					await Notification.create({ recipient_id: isRequest.requester_id, sender_id: userId, type: "contact_accepted" });
					io.to(`user:${isRequest.requester_id}`).emit("notification:new", {
						type: "contact_accepted",
						senderName: currentUser.firstname,
					});
					res.render('meetingProfil', { contact, photos, isContact: true, alert: { type: 'global', value: 'success', message: `${contact.firstname} a été ajouté.e à vos contacts avec succès.` } });
				}
				else {
					res.redirect('/rencontre');
				}
			}
			else {
				const currentUser2 = await User.findByPk(userId);
				await User_ContactRequest.create({requester_id: userId, requestee_id: contact.id});
				await Notification.create({ recipient_id: contact.id, sender_id: userId, type: "contact_request" });
				io.to(`user:${contact.id}`).emit("notification:new", {
					type: "contact_request",
					senderName: currentUser2.firstname,
				});
				res.render('meetingProfil', { contact, photos, isContact: false, alert: { type: 'global', value: 'success', message: `Votre demande de contact à ${contact.firstname} a bien été enregistrée.` } });
			}
		}
		catch (error) {
			console.log(error);
			res.redirect('/rencontre');
		}
	},
	faq: function (req, res) {
		res.render('faq', {});
	},
	help: function (req, res) {
		res.render('help');
	},
	helpPhone: function (req, res) {
		res.render('assistance-telephone', { title: 'Assistance par téléphone' });
	},
	helpMessage: function (req, res) {
		res.render('assistance-message', { title: 'Assistance par message' });
	},
	legalNotice: function (req, res) {
		res.render('mentions-legales', { title: 'Mentions légales' });
	},
	notFound: function (req, res) {
		res.render('error', { message: 'La page à laquelle vous essayez de vous connecter n\'existe pas.', link: '/', pageName: 'd\'accueil'});
	},
	redirect: function (req, res) {
		res.redirect('/');
	}
};

export default mainController;