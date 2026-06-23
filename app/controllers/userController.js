import { User } from '../models/index.js';

const userController = {
  userCreate: function (req, res) {
      res.render('user-add-update', { title:'Créer un nouvel utilisateur', action:'Ajouter', link:'/utilisateur/ajouter', user: {} });
  },
  userCreateAction: async function (req, res) {
    try {
      await User.create(req.body);
      res.redirect('/utilisateur');
    }
    catch(error) {
      console.log(error);
    }
  },
  userUpdate: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.user);
      res.render('user-add-update', { title:`Mettre à jour le profil de ${user.firstname} ${user.lastname}`, action:'Modifier', link:'/utilisateur/modifier', user });
    }
    catch(error) {
      console.log(error);
    }
  },
  userUpdateAction: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.user);
      await user.update(req.body);
      res.redirect('/utilisateur');
    }
    catch(error) {
      console.log(error);
    }
  },
  userBanAction: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.user);
      await user.destroy();
      res.redirect('/utilisateur');
    }
    catch(error) {
      console.log(error);
    }
  },
  userRestoreAction: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.user);
      await user.restore();
      res.redirect('/utilisateur');
    }
    catch(error) {
      console.log(error);
    }
  },
  userDeleteAction: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.user);
      await user.destroy({ force:true });
      res.redirect('/utilisateur');
    }
    catch(error) {
      console.log(error);
    }
  },
  userList: async function (req, res) {
    // La gestion des utilisateurs se fait via le tableau de bord admin (vue existante et fonctionnelle).
    // L'ancienne vue 'user_list' n'existe pas : on redirige vers la liste admin pour éviter une erreur de rendu.
    res.redirect('/admin/users');
  },
  update: async function (req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'Utilisateur introuvable' });
      }
      const { firstname, lastname, email, phone, date_of_birth, gender, city, bio, administrator } = req.body;
      const payload = {};
      if (firstname !== undefined) payload.firstname = firstname;
      if (lastname !== undefined) payload.lastname = lastname;
      if (email !== undefined) payload.email = email;
      if (phone !== undefined) payload.phone = String(phone);
      if (date_of_birth !== undefined) payload.date_of_birth = date_of_birth || null;
      if (gender !== undefined) payload.gender = gender;
      if (city !== undefined) payload.city = city;
      if (bio !== undefined) payload.bio = bio;
      if (administrator !== undefined) {
        payload.administrator = administrator === true || administrator === 'true' || administrator === 'on' || administrator === 1;
      }
      await user.update(payload);
      req.session.alert = {
        type: 'global',
        value: 'success',
        message: 'L\'utilisateur a bien été modifié'
      };
      res.json({ success: true });
    }
    catch(error) {
      console.log(error);
      res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour' });
    }
  }
};

export default userController;