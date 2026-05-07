const handleAlerts = (req, res, next) => {
    res.locals.alert = req.session.alert;
    delete req.session.alert;
    next();
};

export default handleAlerts;