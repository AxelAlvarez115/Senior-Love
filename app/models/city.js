import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class City extends Model {}

City.init(
	{
		city_id: {
			type: DataTypes.INTEGER, // INNTEGER
			primaryKey: true, // Défini la valeur en tant que clé primaire
			autoIncrement: true, // Défini autimatiquement la clé primaire
		},
		cityCode: {
			type: DataTypes.STRING(5),
			allowNull: false,
			unique:true,
			validate: {
				notEmpty: true
			}
		},
		name: {
			type: DataTypes.STRING(45), // taille de la ville la plus longue en france (Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson)
			allowNull: false,
			unique: false,
			validate: {
				notEmpty: true
			},
		},
	},
	{
		sequelize,
		tableName: "city",
		timesTamps: false,
		paranoid: true,
	},
);

export default City;
