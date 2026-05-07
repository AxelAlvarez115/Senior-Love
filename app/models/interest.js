import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class Interest extends Model {}

Interest.init(
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
		tableName: "interest",
		timestamps: false,
	},
);

export default Interest;
