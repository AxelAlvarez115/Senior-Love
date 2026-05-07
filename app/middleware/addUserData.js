import { User } from '../models/index.js';

async function addUserData(req, res, next) {
    if (req.session.isLogged) {
      res.locals.isLogged = true;
      res.locals.isAdmin = req.session.isAdmin;
    }
    else {
      res.locals.isLogged=false;
    }
    next();
}
  
export default addUserData;