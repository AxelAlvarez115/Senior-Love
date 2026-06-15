import sequelize from "../database/database.js";
import { Model, DataTypes } from "sequelize";

class Message extends Model {}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "message",
        timestamps: true,
    },
);

export default Message;
