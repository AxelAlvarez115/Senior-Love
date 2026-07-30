import User from "./user.js";
import Interest from "./interest.js";
import Comment from "./comment.js";
import Event from "./event.js";
import User_Event from "./user_event.js";
import User_Interest from "./user_interest.js";
import User_Relationship from "./user_relationship.js";
import User_ContactRequest from "./user_contactRequest.js";
import sequelize from "../database/database.js";
import Affinity from "./affinity.js";
import User_Affinity from "./user_affinity.js";
import UserPhoto from "./user_photo.js";
import Notification from "./notification.js";
import Message from "./message.js";
User.hasMany(UserPhoto, { foreignKey: 'user_id', as: 'photos' });
UserPhoto.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

Event.hasMany(Comment, { foreignKey: "event_id" });
Comment.belongsTo(Event, { foreignKey: "event_id" });

User.addHook('beforeDestroy', async (user) => {
	await Comment.destroy({ where: { user_id: user.id } });
});

Event.addHook('beforeDestroy', async (event) => {
	await Comment.destroy({ where: { event_id: event.id } });
});

User.belongsToMany(Event, { through: User_Event, as:'events', foreignKey: 'user_id'});
Event.belongsToMany(User, { through: User_Event, as:'users', foreignKey: 'event_id'});

User.belongsToMany(Interest, {through: User_Interest, foreignKey: 'user_id'});
Interest.belongsToMany(User, {through: User_Interest, foreignKey: 'interest_id'});

User.belongsToMany(Affinity, {through: User_Affinity, foreignKey:'user_id'});
Affinity.belongsToMany(User, {through: User_Affinity, foreignKey:'affinity_id'});

User.belongsToMany(User, {through:User_Relationship, as:'contacts', foreignKey:'user_id', otherKey:'contact_id'});
User.belongsToMany(User, {through:User_ContactRequest, as:'requestees', foreignKey:'requester_id'});
User.belongsToMany(User, {through:User_ContactRequest, as:'requesters', foreignKey:'requestee_id'});

Interest.hasMany(Event, { foreignKey: 'interest_id', onDelete: 'CASCADE'});
Event.belongsTo(Interest, { foreignKey: 'interest_id'});

User.hasMany(Notification, { foreignKey: "recipient_id", as: "receivedNotifications" });
User.hasMany(Notification, { foreignKey: "sender_id", as: "sentNotifications" });
Notification.belongsTo(User, { foreignKey: "recipient_id", as: "recipient" });
Notification.belongsTo(User, { foreignKey: "sender_id", as: "sender" });

User.hasMany(Message, { foreignKey: "sender_id", as: "sentMessages" });
User.hasMany(Message, { foreignKey: "recipient_id", as: "receivedMessages" });
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(User, { foreignKey: "recipient_id", as: "recipient" });

await sequelize.sync({ alter: true });
console.log("Models loaded and associations defined.");

export { User, Event, Interest, Comment, User_Event, User_Interest, User_Relationship, User_ContactRequest, Affinity, User_Affinity, UserPhoto, Notification, Message };
