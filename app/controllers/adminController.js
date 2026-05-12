import { User, Event, Comment, Interest, Affinity } from '../models/index.js';

const adminController = {
    home: async (req, res) => {
        try {
            const [userCount, eventCount, commentCount, interestCount] = await Promise.all([
                User.count(),
                Event.count(),
                Comment.count(),
                Interest.count(),
            ]);
            res.render('admin/index', { dashboard: true, stats: { userCount, eventCount, commentCount, interestCount } });
        } catch (error) {
            console.error(error);
            res.render('admin/index', { dashboard: true, stats: { userCount: 0, eventCount: 0, commentCount: 0, interestCount: 0 } });
        }
    },

    user: async (req, res) => {
        try {
            const users = await User.findAll({ order: [['id', 'ASC']], limit: 10 });
            res.render('admin/index', { users });
        } catch (error) {
            console.error(error);
            res.redirect('/admin');
        }
    },

    event: async (req, res) => {
        try {
            const [events, interestOptions] = await Promise.all([
                Event.findAll({ order: [['id', 'ASC']], limit: 10 }),
                Interest.findAll({ order: [['name', 'ASC']] }),
            ]);
            res.render('admin/index', { events, interestOptions });
        } catch (error) {
            console.error(error);
            res.redirect('/admin');
        }
    },

    comment: async (req, res) => {
        try {
            const comments = await Comment.findAll({
                order: [['id', 'ASC']],
                limit: 50,
                include: [
                    { model: User,  attributes: ['id', 'firstname', 'lastname'] },
                    { model: Event, attributes: ['id', 'name'] },
                ],
            });
            res.render('admin/index', { comments });
        } catch (error) {
            console.error(error);
            res.redirect('/admin');
        }
    },

    commentDelete: async (req, res) => {
        try {
            await Comment.destroy({ where: { id: req.params.id } });
            res.redirect('/admin/comments');
        } catch (error) {
            console.error(error);
            res.redirect('/admin/comments');
        }
    },

    interest: async (req, res) => {
        try {
            const interests = await Interest.findAll({ order: [['id', 'ASC']] });
            res.render('admin/index', { interests });
        } catch (error) {
            console.error(error);
            res.redirect('/admin');
        }
    },

    interestUpdate: async (req, res) => {
        try {
            await Interest.update({ name: req.body.name }, { where: { id: req.params.id } });
            res.redirect('/admin/interests');
        } catch (error) {
            console.error(error);
            res.redirect('/admin/interests');
        }
    },

    interestDelete: async (req, res) => {
        try {
            await Interest.destroy({ where: { id: req.params.id } });
            res.redirect('/admin/interests');
        } catch (error) {
            console.error(error);
            res.redirect('/admin/interests');
        }
    },

    affinity: async (req, res) => {
        try {
            const affinities = await Affinity.findAll({ order: [['id', 'ASC']] });
            res.render('admin/index', { affinities });
        } catch (error) {
            console.error(error);
            res.redirect('/admin');
        }
    },

    affinityUpdate: async (req, res) => {
        try {
            await Affinity.update({ name: req.body.name }, { where: { id: req.params.id } });
            res.redirect('/admin/affinities');
        } catch (error) {
            console.error(error);
            res.redirect('/admin/affinities');
        }
    },

    affinityDelete: async (req, res) => {
        try {
            await Affinity.destroy({ where: { id: req.params.id } });
            res.redirect('/admin/affinities');
        } catch (error) {
            console.error(error);
            res.redirect('/admin/affinities');
        }
    },

    userCreate: async (req, res) => {
        try {
            const { firstname, lastname, email, password, phone, city, date_of_birth, gender, gender_preference, bio, administrator } = req.body;
            await User.create({
                firstname, lastname, email, password, phone, city,
                date_of_birth: date_of_birth || null,
                gender: gender || null,
                gender_preference: gender_preference || null,
                bio: bio || null,
                administrator: administrator === 'on' || administrator === 'true',
            });
            req.session.alert = { type: 'global', value: 'success', message: `L'utilisateur ${firstname} ${lastname} a été créé.` };
            res.redirect('/admin/users');
        } catch (error) {
            console.error(error);
            req.session.alert = { type: 'global', value: 'error', message: 'Erreur lors de la création : ' + (error.errors?.[0]?.message ?? error.message) };
            res.redirect('/admin/users');
        }
    },

    eventCreate: async (req, res) => {
        try {
            const { name, description, city, date, adresse, interest_id } = req.body;
            await Event.create({ name, description, city, date, adresse: adresse || null, interest_id });
            req.session.alert = { type: 'global', value: 'success', message: `L'évènement "${name}" a été créé.` };
            res.redirect('/admin/events');
        } catch (error) {
            console.error(error);
            req.session.alert = { type: 'global', value: 'error', message: 'Erreur lors de la création : ' + (error.errors?.[0]?.message ?? error.message) };
            res.redirect('/admin/events');
        }
    },

    interestCreate: async (req, res) => {
        try {
            const { name } = req.body;
            await Interest.create({ name });
            req.session.alert = { type: 'global', value: 'success', message: `Le centre d'intérêt "${name}" a été créé.` };
            res.redirect('/admin/interests');
        } catch (error) {
            console.error(error);
            req.session.alert = { type: 'global', value: 'error', message: 'Erreur lors de la création : ' + (error.errors?.[0]?.message ?? error.message) };
            res.redirect('/admin/interests');
        }
    },

    affinityCreate: async (req, res) => {
        try {
            const { name } = req.body;
            await Affinity.create({ name });
            req.session.alert = { type: 'global', value: 'success', message: `L'affinité "${name}" a été créée.` };
            res.redirect('/admin/affinities');
        } catch (error) {
            console.error(error);
            req.session.alert = { type: 'global', value: 'error', message: 'Erreur lors de la création : ' + (error.errors?.[0]?.message ?? error.message) };
            res.redirect('/admin/affinities');
        }
    },
};

export default adminController;
