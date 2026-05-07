import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class User_Event extends Model {};

User_Event.init(
	{
		user_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		event_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_event",
		timestamps: false,
	},
);

export default User_Event;