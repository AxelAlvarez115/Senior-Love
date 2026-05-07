import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class Affinity extends Model {};

Affinity.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(20),
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	},
	{
		sequelize,
		tableName: "affinity",
		paranoid: true,
	},
);

export default Affinity;