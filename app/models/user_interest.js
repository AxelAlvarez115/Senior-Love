import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class User_Interest extends Model {};

User_Interest.init(
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		interest_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_interest",
		timestamps: false,
	},
);

export default User_Interest;