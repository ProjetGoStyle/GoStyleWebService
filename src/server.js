require("dotenv").config();
const server_port = process.env.PORT || process.env.MY_PORT || 5000;
const server_host = process.env.MY_HOST || '0.0.0.0';
//requires
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SqliteHandler = require("../src/Dal/SqliteHandler");
const CodePromoController = require('./Controllers/CodePromoController');
const AuthController = require('./Controllers/AuthController');
const StatistiqueController = require('./Controllers/StatistiqueController');
const CheckData = require('./Utils/CheckData');
const express = require("express");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pathPublicFolder = __dirname.slice(0, __dirname.length - 3) + '/public';

// Initialization variables
const api = '/api';
const app = express();
const sqliteHandler = new SqliteHandler();
const codePromoController = new CodePromoController(process.env.DBPATH, sqliteHandler);
const authController = new AuthController(process.env.DBPATH, sqliteHandler);
const statistiqueController = new StatistiqueController(process.env.DBPATH, sqliteHandler);
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

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(session({ secret: 'secretkey' }));


app.use('/style', express.static(pathPublicFolder + '/css'));
app.use('/js', express.static(pathPublicFolder + '/js'));
app.use(express.json()); // for parsing application/json)
app.use(cookieParser())
app.listen(server_port);

app.get('/', async (req, res) => {
     res.sendFile(pathPublicFolder + '/login.html');
});
app.get('/promocodes', (req, res) => {
     if (!CheckData.isAuth(req)) {
          res.redirect('/');
          return;
     }
     res.sendFile(pathPublicFolder + '/promocode.html');
});
app.get('/administrateurs', (req, res) => {
    if (!CheckData.isAuth(req)) {
        res.redirect('/');
        return;
    }
    res.sendFile(pathPublicFolder + '/administrateur.html');
});

/**
 * Permet de se connecter au back-office
 * @body login
 * @body password
 */
app.post("/login", async (req, res) => {
    res.append("Content-Type", "application/json");
    req.session.token = null;
    setTimeout(() => {},1500);
    const token = await authController.login(CheckData.replaceSymbol(req.body.login), CheckData.replaceSymbol(req.body.password));
    if (!token)
        res.redirect(404, '/');
    else {
        req.session.token = token;
        res.status(200).send(JSON.stringify({
            token: token
        }));
    }
});

/**
 * Appel permettant de se déconnecter et efface le token
 */
app.post("/logout", async (req, res) => {
    res.append("Content-Type", "application/json");
    req.session.token = null;
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/auth:
 *    post:
 *      description: Permet de récupérer le token d'authentification
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
 *                 login:
 *                   type: string
 *                 password:
 *                   type: string
 *
 *      responses:
 *        200:
 *          description: Succès
 */
app.post(api+"/auth", async (req, res) => {
    res.append("Content-Type", "application/json");
    req.session.token = null;
    setTimeout(() => {},1500);
    const token = await authController.login(CheckData.replaceSymbol(req.body.login), CheckData.replaceSymbol(req.body.password));
    if (!token)
        res.status(401).send();
    else {
        req.session.token = token;
        res.status(200).send(JSON.stringify({
            token: token
        }));
    }
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
 *          description: Succès
 */
app.get(api + "/coupon/:id", async (req, res) => {
     res.append("Content-Type", "application/json");
    if (isNaN(req.params.id)) {
        res.status(404).send();
    }
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
     codePromoController.getCodePromoByQrCodeId(req.params.id)
          .then((result) => {
               res.send(result);
          }).catch((erreur) => {
               res.status(404).send(erreur);
          });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/coupons:
 *    get:
 *      description: Permet de récupérer les codes promotionnels
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Succès
 */
app.get(api + "/coupons", async (req, res) => {
     if (!CheckData.isAuth(req)) {
          res.status(401).send();
          return;
     }
     res.append("Content-Type", "application/json");
     codePromoController.getCodesPromos()
          .then((result) => {
               res.status(200).send(result);
          }).catch((erreur) => {
               res.status(404).send(erreur);
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
*          description: Succès
*/
app.post(api + "/coupon", async (req, res) => {
     if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
     }
     const couponAdmin = CheckData.checkInputToReplaceSymbol(req.body);
     codePromoController.postCodePromo(couponAdmin)
          .then((result) => {
              console.log(result);
               res.status(200).send(result);
          }).catch((erreur) => {
              console.log(erreur);
               res.status(500).send(erreur);
          });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/coupon/{codepromotionId}:
 *    put:
 *      description: Permet de mettre à jour le code promotionnel
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: codepromotionId
 *          description: Id du code promotionnel
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Succès
 */
app.put(api+'/coupon/:id', async(req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    res.append("Content-Type", "application/json");
    if (isNaN(req.params.id)) {
        res.status(500).send();
    }
    const updateCodePromo = {
        code: req.body.code,
        description: req.body.description,
        id: req.params.id
    };

    codePromoController.updateCodePromo(CheckData.checkInputToReplaceSymbol(updateCodePromo))
        .then(()=> {
            res.status(200).send();
        })
        .catch((err) => {
            res.status(500).send({message:err});
        });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/coupon/{codepromotionId}:
 *    delete:
 *      description: Permet de supprimer le code promotionnel
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: codepromotionId
 *          description: Id code promotionnel
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Succès
 */
app.delete(api + "/coupon/:id", async (req, res) => {
     if (!CheckData.isAuth(req)) {
         res.status(401).send();
         return;
     }
     res.append("Content-Type", "application/json");
     if (isNaN(req.params.id)) {
          res.status(500).send();
     }
     codePromoController.deleteCodePromo(req.params.id)
          .then((result) => {
               res.status(200).send();
          }).catch((erreur) => {
               res.status(404).send({message: erreur});
          });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/statistiques:
 *    get:
 *      description: Permet de récupérer les sttistiques d'utilisation
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Succès
 */
app.get(api + '/statistiques' , async (req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    const statistics = {
        avgPreviousWeek: null,
        avgCurrentWeek: null,
        numberOfUseByCodePromo: null
    }
    try{
        const avgCurrentWeek = await statistiqueController.avgUtilisationForWeek(false);
        const avgPreviousWeek = await statistiqueController.avgUtilisationForWeek(true);
        statistics["avgPreviousWeek"] = avgPreviousWeek[0].avgUse;
        statistics["avgCurrentWeek"] = avgCurrentWeek[0].avgUse;
        statistics["numberOfUseByCodePromo"] = await statistiqueController.countUtilisationByCodePromo();
        res.status(200).send(statistics);
    }catch (err) {
        res.status(500).send({message: err});
    }
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/admin:
 *    post:
 *      description: Permet d'ajouter un administrateur
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
 *                 login:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *
 *      responses:
 *        200:
 *          description: Succès
 */
app.post(api + '/admin', async(req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    const authObject = {
        login : req.body.login,
        email: req.body.email,
        password: req.body.password
    }
    authController.insertAdmin(CheckData.checkInputToReplaceSymbol(authObject))
        .then((newAdmin) => {
            res.status(200).send(newAdmin);
        })
        .catch((err) => {
            res.status(500).send({message: err});
        });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/admins:
 *    get:
 *      description: Permet de récupérer les administrateurs
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Succès
 */
app.get(api + '/admins', async(req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    res.append("Content-Type", "application/json");
    authController.getAdmins()
        .then((admins) => {
            res.status(200).send(admins);
        }).catch((err) => {
            res.status(500).send({message: err});
        });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/admin/{adminId}:
 *    delete:
 *      description: Permet de supprimer un administrateur
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: adminId
 *          description: ID de l'administrateur
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Succès
 */
app.delete(api + '/admin/:id', async(req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    res.append("Content-Type", "application/json");
    if (isNaN(req.params.id)) {
        res.status(500).send();
    }

    authController.deleteAdmin(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            res.status(500).send({message: err});
        });
});

/**
 * @swagger
 *
 * tags:
 * - name: API Code Promotionnel
 *   description: Regroupe les requêtes d'accès à la base de données stockant les codes promotionnels
 *
 *paths:
 *  /api/admin/{adminId}:
 *    put:
 *      description: Permet de modifier un administrateur
 *      tags:
 *      - API Code Promotionnel
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: adminId
 *          description: ID de l'administrateur
 *          required: true
 *          type: int
 *      responses:
 *        200:
 *          description: Récupération OK
 */
app.put(api + '/admin/:id', async(req,res) => {
    if (!CheckData.isAuth(req)) {
        res.status(401).send();
        return;
    }
    res.append("Content-Type", "application/json");
    if (isNaN(req.params.id)) {
        res.status(500).send();
    }
    const authObject = {
        id: req.params.id,
        login: req.body.login,
        email: req.body.email,
        password: req.body.password
    };


    authController.updateAdmin(CheckData.checkInputToReplaceSymbol(authObject))
        .then((response) => {
            res.status(200).send();
        })
        .catch((err) => {
            res.status(500).send({message: err});
        })
});
