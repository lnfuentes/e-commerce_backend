import jwt from "jsonwebtoken";

const PRIVATE_KEY = 'CoderKeySecret';

const generateToken = user => {
    const token = jwt.sing({user}, PRIVATE_KEY, {expiresIn: '24h'});
    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({
        error: 'not authenticated'
    })

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({
            error: 'not authorized'
        })
        req.user = credentials.user;
        next()
    })
}

export {generateToken, authToken};