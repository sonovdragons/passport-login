const express = require('express');
const os = require('os');
const router = express.Router()
const passport = require('passport');
const compression = require('compression');
const logger = require('../utils/loggers');

const numCPU = os.cpus().length;



const infoProcess = {
    args: process.argv.slice(2),
    platform: process.platform,
    node: process.version,
    memory: JSON.stringify(process.memoryUsage),
    exectPath: process.cwd(),
    processID: process.pid,
    path: process.argv[1],
    cores: numCPU
}

router.get('/info', compression(), (req,res) => {
    try {
        logger.info('RUTA: /info || METODO: get')
        const data = infoProcess
        res.render('info', {data})
    } catch (err) {
        logger.error('RUTA: /info || METODO: get')
    };
})



router.get('/', (req,res,next) => {
    logger.info('RUTA: / || METODO: get')
    res.redirect('/datos')
})
router.get('/signup', (req,res,next) => {
    logger.info('RUTA: /signup || METODO: get')
    res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}) );

router.get('/signin', (req,res,next) => {
    logger.info('RUTA: /signin || METODO: get')
    res.render('signin')
})
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
} ))
router.get('/logout', (req,res,next) => {
    logger.info('RUTA: /logout || METODO: get')
    req.logout( (err) => {
        if (err) {
            return next(err)
        }
        res.redirect('/');
    });
})
router.use((req,res,next)=> {
    isAuthenticated(req,res,next);
    next();
})


router.get('/profile', (req,res,next) => {
    res.render('profile')
})

function isAuthenticated(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin')
}

module.exports = router