import express from 'express';
import mainController from './controllers/mainController.js';
import adminController from './controllers/adminController.js';
import userController from './controllers/userController.js';
import authController from './controllers/authController.js';
import eventController from './controllers/eventController.js';
import identification from './middleware/identification.js';
import accountController from './controllers/accountController.js';
import commentController from './controllers/commentController.js';

const router = express.Router();

router.get('/', identification.isLogged, mainController.home);
router.get('/accueil', identification.isLogged, mainController.home);

router.get('/inscription', identification.isLogged, authController.register);
router.post('/inscription', identification.isLogged, authController.registerAction);
router.get('/connexion', identification.isLogged, authController.login);
router.post('/connexion', identification.isLogged, authController.loginAction);
router.get('/deconnexion', identification.isNotLogged, authController.logout);

router.get('/admin', identification.isNotLogged, identification.isAdmin, adminController.home);
router.get('/admin/users', identification.isNotLogged, identification.isAdmin, adminController.user);
router.get('/admin/events', identification.isNotLogged, identification.isAdmin, adminController.event);
router.get('/admin/comments', identification.isNotLogged, identification.isAdmin, adminController.comment);
router.get('/admin/interests', identification.isNotLogged, identification.isAdmin, adminController.interest);
router.get('/admin/affinities', identification.isNotLogged, identification.isAdmin, adminController.affinity);

router.post('/admin/users/create', identification.isNotLogged, identification.isAdmin, adminController.userCreate);
router.post('/admin/events/create', identification.isNotLogged, identification.isAdmin, adminController.eventCreate);
router.post('/admin/interests/create', identification.isNotLogged, identification.isAdmin, adminController.interestCreate);
router.post('/admin/affinities/create', identification.isNotLogged, identification.isAdmin, adminController.affinityCreate);

router.post('/comments/delete/:id', identification.isNotLogged, identification.isAdmin, adminController.commentDelete);
router.post('/interests/update/:id', identification.isNotLogged, identification.isAdmin, adminController.interestUpdate);
router.post('/interests/delete/:id', identification.isNotLogged, identification.isAdmin, adminController.interestDelete);
router.post('/affinities/update/:id', identification.isNotLogged, identification.isAdmin, adminController.affinityUpdate);
router.post('/affinities/delete/:id', identification.isNotLogged, identification.isAdmin, adminController.affinityDelete);

router.get('/compte', identification.isNotLogged, accountController.account);
router.get('/compte/evenement', identification.isNotLogged, accountController.accountEvent);
router.get('/compte/rencontre', identification.isNotLogged, accountController.accountMeeting);
router.post('/compte/infos', identification.isNotLogged, accountController.accountInfoAction);
router.post('/compte/mot-de-passe', identification.isNotLogged, accountController.accountPasswordAction);
router.post('/compte/email', identification.isNotLogged, accountController.accountEmailAction)
router.post('/compte/supprimer', identification.isNotLogged, accountController.accountDeleteAction);

router.get('/rencontre', identification.isNotLogged, mainController.meeting);
router.get('/rencontre/:contactId', identification.isNotLogged, mainController.meetingProfil);
router.post('/rencontre/:contactId/ajouter', identification.isNotLogged, mainController.meetingProfilAdd);

router.get('/evenement', identification.isNotLogged, eventController.event);
router.get('/evenement/:event', identification.isNotLogged, eventController.eventDetails);

router.post('/evenement/:event/participation', identification.isNotLogged, eventController.toggleParticipate);

router.post('/evenement/:event/ajout-com', identification.isNotLogged, eventController.addCommentAction);
router.post('/evenement/:event/:com/modif-com', identification.isNotLogged, eventController.updateCommentAction);
router.post('/evenement/:event/:com/suppr-com', identification.isNotLogged, eventController.deleteCommentAction);

router.post('/commentaire/:event', identification.isNotLogged, commentController.create);
router.delete('/commentaire/:com', identification.isNotLogged, commentController.delete);

// router.get('/evenement/ajouter', identification.isNotLogged, identification.isAdmin, eventController.addEvent);
router.post('/evenement/ajouter', identification.isNotLogged, identification.isAdmin, eventController.addEventAction);
// router.get('/evenement/modifier/:event', identification.isNotLogged, identification.isAdmin, eventController.updateEvent);
router.post('/evenement/modifier/:event', identification.isNotLogged, identification.isAdmin, eventController.updateEventAction);
router.post('/evenement/supprimer/:event', identification.isNotLogged, identification.isAdmin, eventController.deleteEventAction);

router.get('/faq', mainController.faq);

router.get('/assistance', mainController.help);

// router.get('/evenement', identification.isNotLogged, eventController.event);

router.post('/events/update/:id', identification.isNotLogged, identification.isAdmin, eventController.update);
router.post('/events/delete/:id', identification.isNotLogged, identification.isAdmin, eventController.delete);

router.post('/users/update/:id', identification.isNotLogged, identification.isAdmin, userController.update);

router.get('/user-list', identification.isNotLogged, identification.isAdmin, userController.userList);
router.get('*', mainController.notFound);
router.post('*', mainController.redirect);

export default router;

// A faire:

// Gérer le cas de redirection après tentative d'acces à une page avec login nécessaire

// Routes à faire :

//router.get('/event/:event', eventController.details)

//router.get('/help', helpController.help)
// pas dans mvp router.get('/help/chat', mainController.chatHelp)
// pas dans mvp router.get('/help/call', mainController.chatHelp)
// pas dans mvp router.get('/help/mods', mainController.modsHelp)
// pas dans mvp router.get('/help/mods/:user', mainController.HelpModsUser)

//pas dans mvp router.get('/meeting/message', mainController.message)

//router.get('/faq', faqController.faq);
//router.get('/faq/messagerie', faqController.faqMessage);
//router.get('/faq/register-login', faqController.faqRegister);
//router.get('/faq/profile', faqController.faqProfile);
// pas dans mvp router.get('/faq/edit', mainController.faqEdit);
// pas dans mvp router.get('/faq/edit/:question', mainController.faqEditQuestion);

// router.post('/profile', mainController.profileAction);

// router.get('/user-list/:user', userListController.user);
// router.get('/user-list/:user/edit', userListController.userEdit);