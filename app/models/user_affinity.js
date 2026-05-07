import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class User_Affinity extends Model {};

User_Affinity.init(
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		affinity_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_affinity",
		timestamps: false,
	},
);

export default User_Affinity;