import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class Comment extends Model {}

Comment.init(
	{
		id: {
			type: DataTypes.INTEGER, // INNTEGER
			primaryKey: true, // Défini la valeur en tant que clé primaire
			autoIncrement: true, // Défini autimatiquement la clé primaire
		},
		contents: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
		// report: {
		// 	type: DataTypes.NUMBER,
		// 	allowNull: false,
		// 	validate: {
		// 		notEmpty: true,
		// 	},
		// },
	},
	{
		sequelize,
		tableName: "comment",
		paranoid: true,
	},
);

export default Comment;
