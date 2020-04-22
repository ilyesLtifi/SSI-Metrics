const express = require('express');
const app = express();

const {Rssi} = require('./db/models');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');

/* MIDDLEWARE  */


// Load middleware
app.use(bodyParser.json());



// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');
   
    Rssi.findByIdAndToken(_id, refreshToken).then((rssi) => {
        if (!rssi) {
            // rssi couldn't be found
            return Promise.reject({
                'error': 'Rssi not found. Make sure that the refresh token and  id are correct'
            });
        }


        // The refresh token exists in the database - but we still have to check if it has expired or not

        req.rssi_id = rssi._id;
        req.rssiObject = rssi;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        rssi.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (Rssi.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}


/* END MIDDLEWARE  */




/* RSSI ROUTES */

//Sign Up routes
app.post('/rssis', (req, res) => {
  

    let body = req.body;
    let newRssi = new Rssi(body);

    newRssi.save().then(() => {
        return newRssi.createSession();
    }).then((refreshToken) => {
       

        return newRssi.generateAccessAuthToken().then((accessToken) => {
           
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newRssi);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


//Rssi login
app.post('/rssis/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Rssi.findByCredentials(email, password).then((rssi) => {
        return rssi.createSession().then((refreshToken) => {
          

            return rssi.generateAccessAuthToken().then((accessToken) => {
               
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
          
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(rssi);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/rssis/me/access-token', verifySession, (req, res) => {
    // we know that the caller is authenticated and we have the rssi_id and rssi  object available to us
    req.rssiObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})




app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})


