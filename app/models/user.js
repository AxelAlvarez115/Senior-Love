import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";
import bcrypt from 'bcrypt';

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER, // INNTEGER
			primaryKey: true, // Défini la valeur en tant que clé primaire
			autoIncrement: true, // Défini autimatiquement la clé primaire
		},
		firstname: {
			type: DataTypes.STRING(40), // VARCHAR(40)
			allowNull: false, // la valeur ne peut pas etre NULL
			validate: {
				notEmpty: true,
			}
		},
		lastname: {
			type: DataTypes.STRING(40), // VARCHAR(40)
			allowNull: false, // la valeur ne peut pas etre NULL
			validate: {
				notEmpty: true,
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		email: {
			type: DataTypes.STRING(255), // VARCHAR(255) - un email peut atteindre 254 caractères
			allowNull: false, // la valeur ne peut pas etre NULL
			unique: true,
			validate: {
				notEmpty: true,
			}
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true,
				is: /^[0-9+\s().-]{6,20}$/i
			}
		},
		city: {
			type: DataTypes.STRING(58),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		date_of_birth: {// ATTENTION A REFAIRE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			type: DataTypes.DATEONLY, // DATE
			allowNull: true, // la valeur ne peut pas etre NULL
			validate: {
				notEmpty: false,
			}
		},
		gender: {
			type: DataTypes.STRING(10),
			allowNull: true,
			validate: {
				notEmpty: false,
			}
		},
		gender_preference: {
			type: DataTypes.STRING(10),
			allowNull: true,
			validate: {
				isIn: [['homme', 'femme', 'tous', null]],
			}
		},
		bio: {
			type: DataTypes.STRING(255), // STRING(255)
		},
		avatar: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		administrator: {
			type: DataTypes.BOOLEAN, // BOOLEAN
			allowNull: false, // la valeur ne peut pas etre NULL
			defaultValue: false,
			validate: {
				notEmpty: true,
			}
		},
	},
	{
		sequelize,
		tableName: "user", //nommé la table user au singulier
		paranoid: true, //Ne supprime pas l'utilisateur quand on appelle destroy mais crée une colone deleted at et empeche ton find de le trouver
	},
);

User.addHook('beforeCreate', async (user) => {
	const salt = await bcrypt.genSalt(12);
	user.password = await bcrypt.hash(user.password, salt);
});

User.addHook('beforeUpdate', async (user) => {
	if (user.changed('password')) {
		const salt = await bcrypt.genSalt(12);
		user.password = await bcrypt.hash(user.password, salt);
	}
});

export default User;
