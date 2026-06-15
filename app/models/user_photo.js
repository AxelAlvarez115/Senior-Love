import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class UserPhoto extends Model {}

UserPhoto.init(
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
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "user_photo",
    }
);

export default UserPhoto;
