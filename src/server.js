require("dotenv").config();
const server_port = process.env.PORT || process.env.MY_PORT || 5000;
const server_host = process.env.MY_HOST || '0.0.0.0';
//requires
const session = require('express-session');
const SqliteHandler = require("../src/Dal/SqliteHandler");
const CodePromoController = require('./Controllers/CodePromoController');
const AuthController = require('./Controllers/AuthController');
const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');


// Initialization variables
const api = '/api';
const app = express();
const sqliteHandler = new SqliteHandler();
const dbclient = new CodePromoController(process.env.DBPATH, sqliteHandler);
const authController = new AuthController(process.env.DBPATH, sqliteHandler);
const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Documentation API', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: [__dirname + '/server.js'],
  basePath: 'api/'
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(session({secret:'secretkey'}));
app.use((req,res,next) => {
  console.log(req.url);
  if(req.url !== '/login.html' && req.url !== '/' && req.url !== '/css/style.css' && req.url.includes('api'))
    if(!req.session.token)
      res.status(401).send();

  next();
});
app.use(express.static('./public'));
app.use(express.json()); // for parsing application/json)
app.listen(server_port);

app.get('/', async (req,res) => {
  res.redirect('/login.html');
});
/**
 * @swagger
 * 
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels 
 * 
 *paths:
 *  /api/coupon/{qrcodeID}:
 *    get:
 *      description: Permet de récupérer le code promotionnel lié à un QrCode
 *      tags: 
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: qrcodeID
 *          description: ID du qrcode scanné
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Récupération OK
 */
app.get(api + "/coupon/:id", async (req, res) => {
  res.append("Content-Type", "application/json");
  dbclient.getCodePromoByQrCodeId(req.params.id)
    .then((result) => {
      res.send({ codepromo: result.code });
    }).catch((erreur) => {
      res.status(404).send({ erreur: "Not Found" });
    });
});

/**
* @swagger
* 
*tags:
* - name: API Code Promotionnel
*   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels 
* 
*paths:
*  /api/coupon:
*    post:
*      description: Permet d'ajouter un code promotionnel
*      tags: 
*      - API Code Promotionnel
*      produces:
*        - application/json
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*               type: object
*               properties:
*                 code:
*                   type: string
*                 description:
*                   type: string
*        
*      responses:
*        200:
*          description: Récupération OK
*/
app.post(api + "/coupon", async (req, res) => {
  console.log(req.body);
  const body = JSON.parse(req.body);
  console.log(body);
  dbclient.postCodePromo(body)
    .then((result) => {
      res.send({ message: result });
    }).catch((erreur) => {
      res.status(500).send({ erreur: erreur });
    });
});

app.post("/login", async (req, res) => {
  res.append("Content-Type", "application/json");
  req.session.token = null;
  const token = await authController.login(req.body.login, req.body.password);
  console.log({token});
  if(!token) res.redirect('/');
  else{
    req.session.token = token;
    res.redirect('/promocode.html');
  }
});

app.post(api + "/logout", async (req, res) => {
  res.append("Content-Type", "application/json");
  req.session.token = null;
});

app.get(api + "/coupons", async (req, res) => {
  res.append("Content-Type", "application/json");
  dbclient.getCodesPromos()
      .then((result) => {
        res.status(200).send(result);
      }).catch((erreur) => {
          res.status(404).send({ erreur: "Not Found" });
  });
});

app.delete(api + "/coupon/:id", async (req,res) => {
  res.append("Content-Type", "application/json");
  dbclient.deleteCodePromo(req.params.id)
      .then((result) => {
        res.status(200).send();
      }).catch((erreur) => {
    res.status(404).send({ erreur: 'Not found' });
  });
});
