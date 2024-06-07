const {getAllClient} = require('../controllers/adminControllers.js')
const adminRouter = require('express').Router();
const {getAdmins}  = require('../controllers/adminControllers.js')
const {getRoomHistory , getClientWithSID , createSession} = require('../controllers/adminControllers.js')
adminRouter.get('/getClients' , getAllClient);
adminRouter.get('/getRoomHistory' , getRoomHistory);
adminRouter.get('/getAdmins' , getAdmins);
adminRouter.get('/getClientWithSID' , getClientWithSID );
adminRouter.get('/createSession' , createSession );
module.exports = adminRouter ;