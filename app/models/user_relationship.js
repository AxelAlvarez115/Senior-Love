import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class User_Relationship extends Model {};

User_Relationship.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		contact_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "user_relationship",
		paranoid: true,
	},
);

export default User_Relationship;