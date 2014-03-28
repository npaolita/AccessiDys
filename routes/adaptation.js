/* File: adaptation.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';
var User = require('../models/User');
module.exports = function(app, passport) {


    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        // console.log(req.body);
        if (req.body.id) {
            User.findById(req.body.id, function(err, user) {
                //console.log(user);
                //console.log(err);
                if (err !== null) {
                    res.send(401);
                } else {
                    req.user = user;
                    return next();
                }
            });
            //return next();
        }
        // res.send(401);
        //onsole.log('unauthorized operation ');
    }

    function isLoggedInAdmin(req, res, next) {

        // if user is authenticated in the session, carry on

        if (req.isAuthenticated()) {
            if (req.user.local.role === 'admin') {
                return next();
            }
        }

        res.send(401);

    }

    app.get('/adminService', isLoggedInAdmin, function(req, res) {
        console.log('admin services, already loged');
        res.jsonp(200, req.user);
    });



    // Documents structure routes
    var docStructure = require('../api/dao/docStructure');
    app.post('/ajouterDocStructure', docStructure.createDocuments);
    app.post('/getDocument', docStructure.getDocument);
    app.post('/getDocuments', docStructure.all);

    // Routes for tag manipulating
    var tags = require('../api/dao/tag');
    app.post('/addTag', tags.create);
    app.get('/readTags', tags.all);
    app.post('/updateTag', tags.update);
    app.post('/deleteTag', tags.remove);
    app.post('/getTagById', tags.findTagById);

    //test for manipulating image
    var images = require('../api/services/images');
    app.post('/images', images.cropImage);
    app.post('/pdfimage', images.convertsPdfToPng);
    app.post('/oceriser', images.oceriser);
    app.post('/fileupload', images.uploadFiles);
    app.post('/texttospeech', images.textToSpeech);
    app.post('/espeaktexttospeechdemo', images.espeakTextToSpeech);
    app.post('/festivaltexttospeechdemo', images.festivalTextToSpeech);
    app.post('/sendPdf', images.sendPdf);
    app.post('/sendPdfHTTPS', images.sendPdfHTTPS);

    //test for manipulating emailSend
    var helpers = require('../api/helpers/helpers');
    app.post('/sendMail', helpers.sendMail);



    //route for profile manipulations
    var profils = require('../api/dao/profils');
    app.get('/listerProfil', profils.all);
    app.post('/deleteProfil', profils.supprimer);
    app.post('/ajouterProfils', profils.createProfile);
    app.post('/updateProfil', profils.update);
    app.post('/profilParUser', profils.allByUser);
    app.post('/chercherProfil', profils.chercherProfil);
    app.post('/ajoutDefaultProfil', profils.ajoutDefaultProfil);


    //route for userProfile manipulations
    var userProfil = require('../api/dao/userProfil');
    app.post('/ajouterUserProfil', userProfil.createUserProfil);
    app.post('/addUserProfil', userProfil.addUserProfil);
    app.post('/removeUserProfile', userProfil.removeUserProfile);
    app.post('/setDefaultProfile', userProfil.setDefaultProfile);
    app.post('/chercherProfilParDefaut', userProfil.chercherProfilParDefaut);

    //route for ProfileTag manipulations
    var profilsTags = require('../api/dao/profilTag');
    app.post('/ajouterProfilTag', profilsTags.createProfilTag);
    app.post('/chercherTagsParProfil', profilsTags.findTagsByProfil);
    app.post('/supprimerProfilTag', profilsTags.supprimer);
    app.post('/modifierProfilTag', profilsTags.update);
    app.post('/chercherProfilsTagParProfil', profilsTags.chercherProfilsTagParProfil);
    app.post('/saveProfilTag', profilsTags.saveProfilTag);

    //route for userAccount manipulations
    var userAccount = require('../api/dao/userAccount');
    app.post('/modifierInfosCompte', userAccount.update);
    app.get('/allAccounts', isLoggedInAdmin, userAccount.all);
    app.post('/deleteAccounts', isLoggedInAdmin, userAccount.supprimer);
    app.post('/modifierPassword', userAccount.modifierPassword);
    app.post('/checkPassword', userAccount.checkPassword);

    //passportJS
    app.post('/signup', passport.authenticate('local-signup', {
            failureRedirect: '/#/',
            failureFlash: true
        }),
        function(req, res) {
            res.jsonp(req.user);
        });

    app.post('/login', passport.authenticate('local-login', {
            failureRedirect: '/#/',
            failureFlash: true
        }),
        function(req, res) {
            console.log(req.session);
            res.jsonp(200, req.user);
        });

    app.post('/profile', isLoggedIn, function(req, res) {
        console.log('user already loged');
        console.log(req.user._id); // get the user out of session and pass to template
        var user = req.user;
        res.jsonp(200, user);
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/auth/dropbox',
        passport.authenticate('dropbox-oauth2'));

    app.get('/auth/dropbox/callback',
        passport.authenticate('dropbox-oauth2', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            res.redirect('/#/inscriptionContinue');
        });
};