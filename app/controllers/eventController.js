import { User, Event, Comment, User_Event, User_Interest, Interest } from '../models/index.js';
import validator from 'validator';

const eventController = {
    event: async function (req, res) {
        try {
            let event = {};
            let action = 'ajouter';
            const city = req.query.city;
            const interest = req.query.interest;
            let events;
            let filter = {};
            if(city || interest) {
                if(city) {
                    filter.city = city;
                }
                if(interest) {
                    filter.interest_id = interest;
                }
                events = await Event.findAll({where: filter, include:[{model:Interest}]});
            } 
            else {
                events = await Event.findAll({include:[{model:Interest}]});
            }
            const interests = await Interest.findAll();
            res.render('event', { interests, events, event, action });
        }
        catch(error) {
            console.log(error);
            res.status(500).render('error', { message: 'Une erreur est survenue.', link: '/', pageName: 'd\'accueil' });
        }
    },
    eventDetails: async function (req, res, next) {
        try {
            const event_id = Number(req.params.event);
            if(!isNaN(event_id)){
                const event = await Event.findByPk(req.params.event, {include:[{model:Interest},{model: User, as:'users', attributes:['id', 'firstname', 'lastname']}, {model: Comment, as:'Comments', attributes:['id', 'contents', 'user_id', 'createdAt', 'updatedAt'], include:[{model: User, as:'User', attributes:['id', 'firstname', 'lastname']}]}]});
                const interests = await Interest.findAll();
                if(!event){
                    return res.render('error', { message: 'Evenement introuvable', link: '/evenement', pageName: 'evenement'});
                }
                const userId = req.session.userId;
                const doParticipate = event.users.find(user => user.id===userId);
                const count = event.users.length;
                let action = 'modifier';
                res.render('event-details', { userId, interests, action, event, comments: event.Comments, users: event.users, doParticipate, count });
            }
            else {
                next();
            }
        }
        catch(error) {
            console.log(error);
            res.status(500).render('error', { message: 'Une erreur est survenue.', link: '/evenement', pageName: 'evenement' });
        }
    },
    toggleParticipate: async function (req, res) {
        try {
            const userId = req.session.userId;
            const eventId = req.params.event;
            const doParticipate = await User_Event.findOne({where: { user_id:userId, event_id:eventId }});
            if(doParticipate) {
                await doParticipate.destroy({ force: true });
                req.session.alert = {
                    type: 'global',
                    value:'success',
                    message:'Votre participation a bien été annulée'
                };
                res.redirect(`/evenement/${req.params.event}`);
            }
            else {
                await User_Event.create({user_id:userId, event_id:eventId});
                req.session.alert = {
                    type: 'global',
                    value:'success',
                    message:'Votre participation a bien été enregistrée'
                };
                res.redirect(`/evenement/${req.params.event}`);
            }
        }
        catch(error) {
            console.log(error);
            res.status(500).render('error', { message: 'Une erreur est survenue.', link: '/evenement', pageName: 'evenement' });
        }
    },
    addEvent: async function (req, res) {
        try {
            const event = {};
            const link = `ajouter`;
            const button = 'Créer'
            res.render('event-add-update', { event, link, button }); 
        }
        catch(error) {
            console.log(error);
            res.render('event-add-update', { alert: error.message, link });
        }
    },
    addEventAction: async function (req, res) {
        try {
            const { name, description, city, date, adresse, interest_id } = req.body;
            const event = await Event.create({
                name,
                description,
                city,
                date,
                adresse: adresse || null,
                interest_id: interest_id || null,
            });
            res.redirect(`/evenement/${event.id}`);
        }
        catch(error) {
            console.log(error);
            req.session.alert = {
                type: 'global',
                value: 'error',
                message: 'Une erreur est survenue lors de la création de l\'événement'
            };
            res.redirect('/evenement');
        }
    },
    updateEvent: async function (req, res) {
        try {
            await Event.findByPk(req.params.event);
            res.redirect(`/evenement/modifier`);
        }
        catch(error) {
            console.log(error);
            res.render('event-add', { alert: error.message });
        }
    },
    updateEventAction: async function (req, res) {
        try {
            const event = await Event.findByPk(req.params.event);
            if (!event) {
                req.session.alert = {
                    type: 'global',
                    value: 'error',
                    message: 'L\'événement n\'a pas été trouvé'
                };
                return res.redirect('/evenement');
            }
            const { name, description, city, date, adresse, interest_id } = req.body;
            const payload = {};
            if (name !== undefined) payload.name = name;
            if (description !== undefined) payload.description = description;
            if (city !== undefined) payload.city = city;
            if (date !== undefined) payload.date = date;
            if (adresse !== undefined) payload.adresse = adresse;
            if (interest_id !== undefined && interest_id !== '') payload.interest_id = Number(interest_id);
            await event.update(payload);
            req.session.alert = {
                type: 'global',
                value: 'success',
                message: 'L\'événement a bien été modifié'
            };
            res.redirect(`/evenement/${event.id}`);
        }
        catch (error) {
            console.log(error);
            req.session.alert = {
                type: 'global',
                value: 'error',
                message: 'Une erreur est survenue lors de la mise à jour'
            };
            res.redirect('/evenement');
        }
    },
    deleteEventAction: async function (req, res) {
        try {
            const event = await Event.findByPk(req.params.event);
            if(event) {
                await event.destroy({force:true});
                res.redirect('/evenement');
            }
            else {
                res.render('event-add-update', { alert: 'Evénement introuvable' });
            }
        }
        catch (error) {
            console.log(error);
            res.render('event-add-update', { alert: error.message });
        }
    },
    addCommentAction: async function (req, res) {
        try {
            if (validator.isEmpty(req.body.contents)) {;
                req.session.alert = {
                    type: 'com',
                    value: 'error',
                    message: 'Le contenu du commentaire ne peut pas être vide'
                };
                res.redirect(`/evenement/${req.params.event}`);
            }
            else {
                await Comment.create({contents:req.body.contents, user_id:req.session.userId, event_id:req.params.event});
                req.session.alert = {
                    type: 'com',
                    value: 'success',
                    message: 'Le commentaire a bien été ajouté'
                };
                res.redirect(`/evenement/${req.params.event}`);
            }
        }
        catch(error) {
            console.log(error);
            res.redirect(`/evenement/${req.params.event}`);
        }
    },
    updateCommentAction: async function (req, res) {
        try {
            const comment = await Comment.findByPk(req.params.com);
            const userId = req.session.userId;
            if (!comment) {
                req.session.alert = {
                    type: 'com',
                    value: 'error',
                    message: 'Commentaire introuvable'
                };
                return res.redirect(`/evenement/${req.params.event}`);
            }
            if (comment.user_id === userId) {
                const content = req.body.content;
                if (!content || validator.isEmpty(content.trim())) {
                    req.session.alert = {
                        type: 'com',
                        value: 'error',
                        message: 'Le contenu du commentaire ne peut pas être vide'
                    };
                    return res.redirect(`/evenement/${req.params.event}`);
                }
                await comment.update({ contents: content });
                req.session.alert = {
                    type: 'com',
                    value: 'success',
                    message: 'Le commentaire a bien été modifié'
                };
            }
            else {
                req.session.alert = {
                    type: 'com',
                    value: 'error',
                    message: 'Vous ne pouvez pas modifier ce commentaire'
                };
            }
            res.redirect(`/evenement/${req.params.event}`);
        }
        catch(error) {
            console.log(error);
            res.redirect(`/evenement/${req.params.event}`);
        }
    },
    deleteCommentAction: async function (req, res) {
        try {
            const comment = await Comment.findByPk(req.params.com);
            const user = await User.findByPk(req.session.userId);
            if (!comment || !user) {
                req.session.alert = {
                    type: 'com',
                    value: 'error',
                    message: 'Commentaire introuvable'
                };
                return res.redirect(`/evenement/${req.params.event}`);
            }
            if (comment.user_id === user.id || user.administrator === true) {
                await comment.destroy({ force: true });
                req.session.alert = {
                    type: 'com',
                    value: 'success',
                    message: 'Le commentaire a bien été supprimé'
                };
            }
            else {
                req.session.alert = {
                    type: 'com',
                    value: 'error',
                    message: 'Vous ne pouvez pas supprimer ce commentaire'
                };
            }
            res.redirect(`/evenement/${req.params.event}`);
        }
        catch(error) {
            console.log(error);
            res.redirect(`/evenement/${req.params.event}`);
        }
    },
    update: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Event ID is required' });
            }
            const { name, city, date, adresse, description, interest_id } = req.body;
            const payload = {};
            if (name !== undefined) payload.name = name;
            if (city !== undefined) payload.city = city;
            if (date !== undefined) payload.date = date;
            if (adresse !== undefined) payload.adresse = adresse;
            if (description !== undefined) payload.description = description;
            if (interest_id !== undefined && interest_id !== '') payload.interest_id = Number(interest_id);

            const result = await Event.update(payload, { where: { id } });
            if (result[0] === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            req.session.alert = {
                type: 'global',
                value: 'success',
                message: 'L\'événement a bien été modifié'
            };
            res.json({ success: true, message: 'Event updated successfully' });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ error: 'Failed to update event' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).json({ success: false, error: 'Event not found' });
            }
            await event.destroy();
            req.session.alert = {
                type: 'global',
                value: 'success',
                message: 'L\'événement a bien été supprimé'
            };
            res.json({ success: true, message: 'Event deleted successfully' });
        }
        catch(error) {
            console.log(error);
            res.status(500).json({ success: false, error: 'Erreur lors de la suppression' });
        }
    }
};

export default eventController;