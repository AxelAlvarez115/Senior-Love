import { User, Message, User_ContactRequest } from '../models/index.js';

async function addUserData(req, res, next) {
    if (req.session.isLogged) {
      res.locals.isLogged = true;
      res.locals.isAdmin = req.session.isAdmin;
      res.locals.userId = req.session.userId;
      try {
        res.locals.unreadMessages = await Message.count({
          where: { recipient_id: req.session.userId, read: false }
        });
        res.locals.pendingContactRequests = await User_ContactRequest.count({
          where: { requestee_id: req.session.userId }
        });
      }
      catch (error) {
        console.log(error);
        res.locals.unreadMessages = 0;
        res.locals.pendingContactRequests = 0;
      }
    }
    else {
      res.locals.isLogged=false;
      res.locals.userId = null;
      res.locals.unreadMessages = 0;
      res.locals.pendingContactRequests = 0;
    }
    next();
}
  
export default addUserData;