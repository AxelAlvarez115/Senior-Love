import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class Event extends Model {}

Event.init(
	{
		id: {
			type: DataTypes.INTEGER, // INNTEGER
			primaryKey: true, // Défini la valeur en tant que clé primaire
			autoIncrement: true, // Défini autimatiquement la clé primaire
		},
		name: {
			type: DataTypes.STRING(70),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		city: {
			type: DataTypes.STRING(58),
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		adresse: {
			type: DataTypes.STRING(70),
			allowNull: true,
			validate: {
				notEmpty: false,
			},
		}
},
	{
		sequelize,
		tableName: "event", //nommé la table user au singulier
		paranoid: true, //Ne supprime pas l'utilisateur quand on appelle destroy mais crée une colone deleted at et empeche ton find de le trouver
	},
);

export default Event;
