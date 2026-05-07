import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class User_ContactRequest extends Model {};

User_ContactRequest.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		requester_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		requestee_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_contactrequest",
		timestamps: true,
	},
);

export default User_ContactRequest;