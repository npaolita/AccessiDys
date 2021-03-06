/* File: profiles.js
 *
 * Copyright (c) 2013-2016
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
/* global $:false */
/* jshint loopfunc:true */

angular.module('cnedApp').controller('ProfilesCtrl', function ($scope, $http, $rootScope, removeStringsUppercaseSpaces, configuration, $location, serviceCheck, verifyEmail, $window, profilsService, $modal, $timeout, $interval, tagsService) {

    /* Initialisations */
    $scope.successMod = 'Profil Modifie avec succes !';
    $scope.successAdd = 'Profil Ajoute avec succes !';
    $scope.successDefault = 'defaultProfileSelection';
    $scope.displayText = '<p>AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.</p>';
    $scope.displayTextSimple = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.';
    $scope.cancelDefault = 'cancelDefault';
    $scope.flag = false;
    $scope.colorLists = ['Pas de coloration', 'Colorer les mots', 'Colorer les syllabes', 'Colorer les lignes RBV', 'Colorer les lignes RVJ', 'Colorer les lignes RBVJ', 'Surligner les mots', 'Surligner les lignes RBV', 'Surligner les lignes RVJ', 'Surligner les lignes RBVJ'];
    $scope.weightLists = ['Gras', 'Normal'];
    $scope.headers = ['Nom', 'Descriptif', 'Action'];
    $scope.profilTag = {};
    $scope.profil = {};
    $scope.listTag = {};
    $scope.editTag = null;
    $scope.colorList = null;
    $scope.tagStyles = [];
    $scope.deletedParams = [];
    $scope.tagProfilInfos = [];
    $scope.variableFlag = false;
    $scope.trashFlag = false;
    $scope.admin = $rootScope.admin;
    $scope.displayDestination = false;
    $scope.testEnv = false;
    $scope.loader = false;
    $scope.loaderMsg = '';
    $scope.tagStylesToDelete = [];
    $scope.applyRules = false;
    $scope.forceApplyRules = true;
    $('#titreCompte').hide();
    $('#titreProfile').show();
    $('#titreDocument').hide();
    $('#titreAdmin').hide();
    $('#titreListDocument').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();
    $('#titreTag').hide();
    $scope.demoBaseText = 'AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap mais aussi toute personne ayant des difficultés pour lire des documents longs ou complexes. Depuis les élèves et étudiants avec une dyslexie jusqu’aux cadres supérieurs trop pressés jusqu’aux personnes âgées, AccessiDys facilite la compréhension des documents administratifs ou juridiques, des manuels scolaires traditionnels, des magazines ou journaux à la mise en page complexe, avec des petits caractères ou sans synthèse vocale. AccessiDys est une plateforme Web avec deux fonctions principales. Les pages Web ou documents à lire sont affichées en utilisant un profil de lecture sur mesure qui comprend un large choix de paramètres d’affichage adaptés aux besoins individuels de chaque lecteur. AccessiDys vise les lecteurs qui ont trop peu de temps ou d’attention, qui ont une dyslexie, une dyspraxie, un autisme ou des déficiences visuelles. AccessiDys sait également lire les pages Web à haute voix. AccessiDys rend vos documents ou pages accessibles aux lecteurs en les important de manière simple et rapide quel que soit le format du fichier d’origine. Qu’il s’agisse d’un fichier PDF numérisé, d’un document Office, d’un livre électronique au format ePub ou d’une page Web traditionnelle, AccessiDys vous permet de transformer votre document pour que les lecteurs bénéficient d’une expérience de lecture totalement personnalisée.';
    $scope.policeLists = ['Arial', 'opendyslexicregular', 'Times New Roman', 'LDFComicSans',
        'HKGrotesk-Regular', 'SignikaNegative-Regular', 'Century Gothic', 'OpenSans-CondensedLight', 'CodeNewRoman',
        'FiraSansCondensed', 'AnonymousPro-Bold', 'AndikaNewBasic', 'TiresiasInfofontItalic'
    ];
    $scope.tailleLists = [{
        number: '8',
        label: 'eight'
    }, {
        number: '9',
        label: 'nine'
    }, {
        number: '10',
        label: 'ten'
    }, {
        number: '11',
        label: 'eleven'
    }, {
        number: '12',
        label: 'twelve'
    }, {
        number: '14',
        label: 'fourteen'
    }, {
        number: '16',
        label: 'sixteen'
    }, {
        number: '18',
        label: 'eighteen'
    }, {
        number: '22',
        label: 'twenty two'
    }, {
        number: '24',
        label: 'twenty four'
    }, {
        number: '26',
        label: 'twenty six'
    }, {
        number: '28',
        label: 'twenty eight'
    }, {
        number: '36',
        label: 'thirty six'
    }, {
        number: '48',
        label: 'fourty eight'
    }, {
        number: '72',
        label: 'seventy two'
    }, ];

    $scope.spaceLists = [{
        number: '1',
        label: 'one'
    }, {
        number: '2',
        label: 'two'
    }, {
        number: '3',
        label: 'three'
    }, {
        number: '4',
        label: 'four'
    }, {
        number: '5',
        label: 'five'
    }, {
        number: '6',
        label: 'six'
    }, {
        number: '7',
        label: 'seven'
    }, {
        number: '8',
        label: 'eight'
    }, {
        number: '9',
        label: 'nine'
    }, {
        number: '10',
        label: 'ten'
    }];
    $scope.spaceCharLists = [{
        number: '1',
        label: 'one'
    }, {
        number: '2',
        label: 'two'
    }, {
        number: '3',
        label: 'three'
    }, {
        number: '4',
        label: 'four'
    }, {
        number: '5',
        label: 'five'
    }, {
        number: '6',
        label: 'six'
    }, {
        number: '7',
        label: 'seven'
    }, {
        number: '8',
        label: 'eight'
    }, {
        number: '9',
        label: 'nine'
    }, {
        number: '10',
        label: 'ten'
    }];
    $scope.interligneLists = [{
        number: '1',
        label: 'one'
    }, {
        number: '2',
        label: 'two'
    }, {
        number: '3',
        label: 'three'
    }, {
        number: '4',
        label: 'four'
    }, {
        number: '5',
        label: 'five'
    }, {
        number: '6',
        label: 'six'
    }, {
        number: '7',
        label: 'seven'
    }, {
        number: '8',
        label: 'eight'
    }, {
        number: '9',
        label: 'nine'
    }, {
        number: '10',
        label: 'ten'
    }];
    $scope.defaultStyle;
    $scope.editingStyles = false;
    $scope.requestToSend = {};
    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    $rootScope.$watch('admin', function () {
        $scope.admin = $rootScope.admin;
        $scope.apply; // jshint ignore:line
    });

    /**
     * cette fonction génère suffisamment de ligne en fonction de la coloration
     */
    $scope.adaptiveTextDemo = function (texteTag, tag) {
        var tempTextTag = texteTag;
        var count = (tempTextTag.match(/<\//g) || []).length;
        var coloration = tag.coloration;
        // recupérer le pattern de répétion du texte s'il y'a des répétion.
        if (count > 1) {
            var n = texteTag.indexOf('>');
            n = texteTag.indexOf('>', parseInt(n + 1));
            if (n > -1) {
                var tempTextTag = texteTag.substring(0, n + 1);
            }
        }
        /*
         * if(tag.spaceCharSelected >= 4 && tag.spaceSelected >= 6){ count+=1; }
         */

        switch (coloration) {
        case 'Colorer les lignes RVJ':
        case 'Colorer les lignes RBV':
        case 'Surligner les lignes RVJ':
        case 'Surligner les lignes RBV':
            if (count > 3) {
                texteTag = tempTextTag;
                for (var i = 0; i < 2; i++) {
                    texteTag += tempTextTag;
                }
            } else {
                for (var i = 0; i < (3 - count); i++) {
                    texteTag += tempTextTag;
                }
            }
            break;

        case 'Colorer les lignes RBVJ':
        case 'Surligner les lignes RBVJ':
            for (var i = 0; i < (4 - count); i++) {
                texteTag += tempTextTag;
            }
            break;
        default:
            // shortcut the demo text.
            if (tempTextTag) {
                texteTag = tempTextTag;
            }
            break;
        }
        return texteTag;
    };


    /**
     * Cette fonction reconstruit le text Demo d'un style modifié.
     */
    $scope.refreshEditStyleTextDemo = function (tag, niveau) {
        // génération du style

        var startPosition = niveau.indexOf('data-margin-left="');
        var endPosition = niveau.indexOf('"', parseInt(startPosition + 19));
        niveau = niveau.substring(startPosition, endPosition + 1);

        var fontstyle = 'Normal';
        var texteTag;
        if ($scope.weightList === 'Gras') {
            fontstyle = 'Bold';
        }
        // Transformation propre à l'application
        var style = 'font-family: ' + $scope.policeList + ';' +
            'font-size: ' + ($scope.tailleList / 12) + 'em; ' +
            'line-height: ' + (1.286 + ($scope.interligneList - 1) * 0.18) + 'em;' +
            'font-weight: ' + fontstyle + ';  ' +
            'word-spacing: ' + (0 + ($scope.spaceSelected - 1) * 0.18) + 'em;' +
            'letter-spacing: ' + (0 + ($scope.spaceCharSelected - 1) * 0.12) + 'em;';

        if (tag.balise !== 'div') {
            texteTag = '<' + tag.balise + ' style="' + style + niveau + '" >' + tag.libelle;
        } else {
            texteTag = '<' + tag.balise + ' style="' + style + niveau + '" class="' + removeStringsUppercaseSpaces(tag.libelle) + '">' + tag.libelle;
        }
        texteTag += (': ' + $scope.demoBaseText + '</' + tag.balise + '>');
        /*
         * if (tag.libelle.toUpperCase().match('^TITRE')) { texteTag += ' : Ceci
         * est un exemple de ' + tag.libelle + '. </'+tag.balise+'>'; } else {
         * texteTag += ' : Accessidys est une application qui permet d\'adapter
         * les documents. </'+tag.balise+'>'; }
         */
        return texteTag;
    };

    // verification des champs avant validation lors de la modification
    $scope.beforeValidationModif = function () {
        $scope.affichage = false;
        $scope.addFieldError = [];

        if ($scope.profMod.nom == null) { // jshint ignore:line
            $scope.addFieldError.push(' Nom ');
            $scope.affichage = true;
        }
        if ($scope.editTag == null) { // jshint ignore:line
            $scope.addFieldError.push(' Style ');
            $scope.affichage = true;
        }
        if ($scope.policeList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Police ');
            $scope.affichage = true;
        }
        if ($scope.tailleList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Taille ');
            $scope.affichage = true;
        }
        if ($scope.interligneList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Interligne ');
            $scope.affichage = true;
        }
        if ($scope.colorList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Coloration ');
            $scope.affichage = true;
        }
        if ($scope.weightList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Graisse ');
            $scope.affichage = true;
        }
        if ($scope.spaceSelected == null) { // jshint ignore:line
            $scope.addFieldError.push(' Espace entre Les mots ');
            $scope.affichage = true;
        }
        if ($scope.spaceCharSelected == null) { // jshint ignore:line
            $scope.addFieldError.push(' Espace entre Les caractères ');
            $scope.affichage = true;
        }
        if ($scope.addFieldError.length === 0) {
            $scope.editerStyleTag();
        }
        if ($scope.tagStyles.length > 0) {
            $scope.erreurAfficher = false;
        }
        console.log($scope.tagStyles.length);
        console.log($scope.affichage);
    };

    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que le partage est
     * indisponible en mode déconnecté
     *
     * @method $partageInfoDeconnecte
     */
    $scope.partageInfoDeconnecte = function () {
        $modal.open({
            templateUrl: 'views/common/informationModal.html',
            controller: 'InformationModalCtrl',
            size: 'sm',
            resolve: {
                title: function () {
                    return 'Pas d\'accès internet';
                },
                content: function () {
                    return 'La fonctionnalité de partage de profil nécessite un accès à internet';
                },
                reason: function () {
                    return null;
                },
                forceClose: function () {
                    return null;
                }
            }
        });
    };


    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que l'affichage du
     * profile est indisponible en mode déconnecté
     *
     * @method $partageInfoDeconnecte
     */
    $scope.affichageInfoDeconnecte = function () {
        $modal.open({
            templateUrl: 'views/common/informationModal.html',
            controller: 'InformationModalCtrl',
            size: 'sm',
            resolve: {
                title: function () {
                    return 'Pas d\'accès internet';
                },
                content: function () {
                    return 'L\'affichage de ce profil nécessite au moins un affichage préalable via internet.';
                },
                reason: function () {
                    return '/profiles';
                },
                forceClose: function () {
                    return null;
                }
            }
        });
    };


    /**
     * Open a modal with selected profil detail
     *
     * @param template
     *
     * @method $affichageProfilModal
     */
    $scope.affichageProfilModal = function (toDisplay) {
        $scope.displayedPopup = toDisplay;
        var modalInstance = $modal.open({
            templateUrl: 'views/profiles/profilAffichageModal.html',
            controller: 'profilesAffichageModalCtrl',
            windowClass: 'profil-lg',
            backdrop: false,
            scope: $scope,
            resolve: {
                displayedPopup: function () {
                    return toDisplay;
                },
            }
        });

        modalInstance.result.then(function (selectedItem) {
            if (selectedItem.index || selectedItem.index === 0) {
                if (selectedItem.type === 'modification') {
                    $scope.editionModifierTag(selectedItem.index);
                } else {
                    $scope.editStyleTag(selectedItem.index);
                }
            } else {
                $scope.renameProfilModal(selectedItem.type);
            }
        }, function () {
            if ($location.absUrl().lastIndexOf('detailProfil') <= -1) {
                $scope.afficherProfilsParUser();
            }
        });
    };

    $scope.openStyleEditModal = function (toDisplay) {
        $scope.displayedPopup = toDisplay;
        var modalInstance = $modal.open({
            templateUrl: 'views/profiles/editProfilStyleModal.html',
            controller: 'styleEditModalCtrl',
            windowClass: 'profil-lg',
            backdrop: false,
            scope: $scope,
            resolve: {
                displayedPopup: function () {
                    return toDisplay;
                },
            }
        });

        modalInstance.result.then(function (editedItem) {
            $scope.policeList = editedItem.policeList;
            $scope.tailleList = editedItem.tailleList;
            $scope.interligneList = editedItem.interligneList;
            $scope.weightList = editedItem.weightList;
            $scope.colorList = editedItem.colorList;
            $scope.spaceSelected = editedItem.spaceSelected;
            $scope.spaceCharSelected = editedItem.spaceCharSelected;
            if (editedItem.type === 'modification') {
                $scope.editTag = editedItem.editTag;
                $scope.beforeValidationModif();
            } else {
                $scope.tagList = editedItem.tagList;
                $scope.beforeValidationAdd();
            }
            $scope.affichageProfilModal(editedItem.type);
        }, function (type) {
            $scope.affichageProfilModal(type);
        });
    };

    $scope.renameProfilModal = function (toDisplay) {
        $scope.displayedPopup = toDisplay;
        var modalInstance = $modal.open({
            templateUrl: 'views/profiles/renameProfilModal.html',
            controller: 'profilesRenommageModalCtrl',
            scope: $scope,
            backdrop: false,
            resolve: {
                displayedPopup: function () {
                    return toDisplay;
                },
            }
        });
        modalInstance.result.then(function (renamedItem) {
            $scope.oldProfilNom = renamedItem.oldProfilNom;
            $scope.oldProfilDescriptif = renamedItem.oldProfilDescriptif;
            if (renamedItem.type === 'modification') {
                $scope.profMod = renamedItem.profMod;
                $scope.beforeValidateInfoProfil(false);
            } else {
                $scope.profil = renamedItem.profil;
                $scope.beforeValidateInfoProfil(true);
            }
            $scope.affichageProfilModal(renamedItem.type);
        });
    };

    /**
     * Cette fonction contrôle les informations de modification d'un profil.
     */
    $scope.beforeValidateInfoProfil = function (creation) {
        $scope.affichage = false;
        $scope.addFieldError = [];
        if (creation) {
            if ($scope.profil.nom == null) { // jshint ignore:line
                $scope.addFieldError.push(' Nom ');
                $scope.affichage = true;
            }
            $scope.oldProfilNom = $scope.profil.nom;
            $scope.oldProfilDescriptif = $scope.profil.descriptif;
        } else {
            if ($scope.profMod.nom == null) { // jshint ignore:line
                $scope.addFieldError.push(' Nom ');
                $scope.affichage = true;
            }
            $scope.oldProfilNom = $scope.profMod.nom;
            $scope.oldProfilDescriptif = $scope.profMod.descriptif;
        }
    };

    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que la délégation
     * est indisponible en mode déconnecté
     *
     * @method $delegationInfoDeconnecte
     */
    $scope.delegationInfoDeconnecte = function () {
        $modal.open({
            templateUrl: 'views/common/informationModal.html',
            controller: 'InformationModalCtrl',
            size: 'sm',
            resolve: {
                title: function () {
                    return 'Pas d\'accès internet';
                },
                content: function () {
                    return 'La fonctionnalité de délégation de profil nécessite un accès à internet';
                },
                reason: function () {
                    return null;
                },
                forceClose: function () {
                    return null;
                }
            }
        });
    };

    // $scope.currentTagProfil = null;
    $scope.initProfil = function () {
        $scope.verifProfil();
        $('#profilePage').show();
        $scope.currentUser();
        $scope.token = {
            id: localStorage.getItem('compteId')
        };
        $scope.afficherProfils();
    };

    $scope.displayOwner = function (param) {
        if (param.state === 'mine' || ($rootScope.currentUser.local.role === 'admin' && $rootScope.currentUser._id === param.owner)) {
            return 'Moi-même';
        } else if (param.state === 'favoris') {
            return 'Favoris';
        } else if (param.state === 'delegated') {
            return 'Délégué';
        } else if (param.state === 'default') {
            return 'Accessidys';
        }
    };

    $scope.verifProfil = function () {
        if (!localStorage.getItem('listTagsByProfil')) {
            if (!$scope.token && localStorage.getItem('compteId')) {
                $scope.token = {
                    id: localStorage.getItem('compteId')
                };
            }
            $http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.token)
                .success(function (dataActuel) {
                    $scope.chercherProfilActuelFlag = dataActuel;
                    $scope.varToSend = {
                        profilID: $scope.chercherProfilActuelFlag.profilID
                    };
                    $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                        idProfil: $scope.chercherProfilActuelFlag.profilID
                    }).success(function (data) {
                        $scope.chercherTagsParProfilFlag = data;
                        localStorage.setItem('listTagsByProfil', JSON.stringify($scope.chercherTagsParProfilFlag));

                    });
                });
        }
    };

    // Affichage des differents profils sur la page
    $scope.afficherProfils = function () {
        /*
        $http.get(configuration.URL_REQUEST + '/listerProfil', {
                params: $scope.token
            })
            .success(function(data) {
                $scope.listeProfils = data;
            }).error(function() {});
            */
    };

    // gets the user that is connected
    $scope.currentUser = function () {
        $scope.afficherProfilsParUser();
    };


    $scope.tests = {};
    // displays user profiles
    $scope.afficherProfilsParUser = function () {

        console.log('afficherProfilsParUser ==> ');
        $scope.loader = true;
        $scope.loaderMsg = 'Affichage de la liste des profils en cours ...';
        profilsService.getProfilsByUser($rootScope.isAppOnline).then(function (data) {
            if (data) {
                /* Filtre Profiles de l'Admin */
                if ($rootScope.currentUser.local.role === 'admin') {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type === 'profile' && data[i].state === 'mine') {
                            for (var j = 0; j < data.length; j++) {
                                if (data[i]._id === data[j]._id && data[j].state === 'default' && data[j].owner === $rootScope.currentUser._id) {
                                    data[i].stateDefault = true;
                                    data.splice(j, 2);
                                }
                            }
                        }
                    }
                }
                $rootScope.$emit('refreshProfilAcutel', data);
                tagsService.getTags($scope.requestToSend).then(function (tags) {
                    $scope.listTags = tags;
                    console.log('List Tags size : ' + $scope.listTags.length);



                    var tagText = {};

                    for (var i = data.length - 1; i >= 0; i--) { // jshint
                        // ignore:line
                        if (data[i].type === 'tags') {

                            console.log('List Data Tags size [' + i + ']: ' + data[i].tags.length);

                            var tagShow = [];
                            var nivTag = 0;
                            var nivTagTmp = 0;
                            var texteTag;
                            // Ordere des Tags
                            for (var j = 0; j < data[i].tags.length; j++) { // jshint
                                // ignore:line
                                for (var k = 0; k < $scope.listTags.length; k++) {
                                    if (data[i].tags[j].tag === $scope.listTags[k]._id) {
                                        data[i].tags[j].position = $scope.listTags[k].position;
                                    }
                                }
                            }
                            data[i].tags.sort(function (a, b) {
                                return a.position - b.position;
                            });

                            for (var j = 0; j < data[i].tags.length; j++) { // jshint
                                // ignore:line
                                nivTagTmp = nivTag;
                                for (var k = 0; k < $scope.listTags.length; k++) { // jshint
                                    // ignore:line
                                    if (data[i].tags[j].tag === $scope.listTags[k]._id) {
                                        var tmpText = {};
                                        tmpText.spaceSelected = 0 + (data[i].tags[j].spaceSelected - 1) * 0.18;
                                        tmpText.spaceCharSelected = 0 + (data[i].tags[j].spaceCharSelected - 1) * 0.12;
                                        tmpText.interligneList = 1.286 + (data[i].tags[j].interligne - 1) * 0.18;
                                        tmpText.tailleList = 1 + (data[i].tags[j].taille - 1) * 0.18;

                                        if ($scope.listTags[k].niveau && parseInt($scope.listTags[k].niveau) > 0) {
                                            nivTag = parseInt($scope.listTags[k].niveau);
                                            nivTagTmp = nivTag;
                                            nivTag++;
                                        }

                                        if (nivTagTmp === 0) {
                                            tagText.niveau = 0;
                                            tagText.width = 1055;
                                        } else {
                                            tagText.niveau = (nivTagTmp - 1) * 30;
                                            var calculatedWidth = (1055 - tagText.niveau);
                                            tagText.width = calculatedWidth;
                                        }

                                        // génération du style
                                        var fontstyle = 'Normal';
                                        if (data[i].tags[j].styleValue === 'Gras') {
                                            fontstyle = 'Bold';
                                        }
                                        // Transformation propre à l'application
                                        var style = 'font-family: ' + data[i].tags[j].police + ';' +
                                            'font-size: ' + (data[i].tags[j].taille / 12) + 'em; ' +
                                            'line-height: ' + (1.286 + (data[i].tags[j].interligne - 1) * 0.18) + 'em;' +
                                            'font-weight: ' + fontstyle + ';  ' +
                                            'word-spacing: ' + (0 + (data[i].tags[j].spaceSelected - 1) * 0.18) + 'em;' +
                                            'letter-spacing: ' + (0 + (data[i].tags[j].spaceCharSelected - 1) * 0.12) + 'em;';

                                        if ($scope.listTags[k].balise !== 'div') {
                                            texteTag = '<' + $scope.listTags[k].balise + ' style="' + style + '" data-margin-left="' + tagText.niveau + '" >' + $scope.listTags[k].libelle;
                                        } else {
                                            texteTag = '<' + $scope.listTags[k].balise + ' style="' + style + '" data-margin-left="' + tagText.niveau + '" class="' + removeStringsUppercaseSpaces($scope.listTags[k].libelle) + '">' + $scope.listTags[k].libelle;
                                        }
                                        texteTag += (': ' + $scope.demoBaseText + '</' + $scope.listTags[k].balise + '>');
                                        /*
                                         * if
                                         * ($scope.listTags[k].libelle.toUpperCase().match('^TITRE')) {
                                         * texteTag += ' : Ceci est un exemple de ' +
                                         * $scope.listTags[k].libelle + '.
                                         * </'+$scope.listTags[k].balise+'>'; } else {
                                         * texteTag += ' : Accessidys est une
                                         * application qui permet d\'adapter les
                                         * documents.
                                         * </'+$scope.listTags[k].balise+'>'; }
                                         * if(!testEnv){ texteTag =
                                         * $scope.adaptiveTextDemo(texteTag,data[i].tags[j]); }
                                         */

                                        tagText = {
                                            texte: texteTag
                                        };

                                        tagShow.push(tagText);
                                        break;
                                    }
                                }

                            }
                            data[i].tagsText = tagShow;

                        }
                        data[i].showed = true;
                    }
                });
                $scope.tests = data;
                if (!$scope.$$phase) {
                    $scope.$digest();
                }
                console.log($scope.tests);
                // Forcer la réapplication des colorations.
                $scope.forceRulesApply();
            }

            $scope.loader = false;
            $scope.loaderMsg = '';

        });

    };


    $scope.isDeletable = function (param) {
        if (param.favourite && param.delete) {
            return true;
        }
        if (param.favourite && !param.delete) {
            return false;
        }
    };

    // Affichage des differents profils sur la page avec effacement des styles
    $scope.afficherProfilsClear = function () {

        // $scope.listeProfils = data;
        $scope.profil = {};
        $scope.tagList = {};
        $scope.policeList = {};
        $scope.tailleList = {};
        $scope.interligneList = {};
        $scope.weightList = {};
        $scope.colorList = {};
        $scope.tagStyles = [];
        $scope.erreurAfficher = false;
        $scope.erreurNomExistant = false;
        $('.shown-text-add').text($scope.displayTextSimple);
        $('.shown-text-add').css('font-family', '');
        $('.shown-text-add').css('font-size', '');
        $('.shown-text-add').css('line-height', '');
        $('.shown-text-add').css('font-weight', '');
        $('.shown-text-add').css('word-spacing', '0em');
        $('.shown-text-add').css('letter-spacing', '0em');
        $('.shown-text-add').removeAttr('style');


        $('.shown-text-edit').text($scope.displayTextSimple);
        $('.shown-text-edit').css('font-family', '');
        $('.shown-text-edit').css('font-size', '');
        $('.shown-text-edit').css('line-height', '');
        $('.shown-text-edit').css('font-weight', '');
        $('.shown-text-edit').css('word-spacing', '0em');
        $('.shown-text-edit').css('letter-spacing', '0em');
        $('.shown-text-edit').removeAttr('style');

        $('.shown-text-duplique').text($scope.displayTextSimple);
        $('.shown-text-duplique').css('font-family', '');
        $('.shown-text-duplique').css('font-size', '');
        $('.shown-text-duplique').css('line-height', '');
        $('.shown-text-duplique').css('font-weight', '');
        $('.shown-text-duplique').css('word-spacing', '0em');
        $('.shown-text-duplique').css('letter-spacing', '0em');
        $('.shown-text-duplique').removeAttr('style');

        // set customSelect jquery plugin span text to empty after cancel
        $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tagList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
        $scope.tagList = null;
        $scope.editTag = null;
        $scope.hideVar = true;
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.weightList = null;
        $scope.colorList = null;
        $scope.affichage = false;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;

        $('#selectId').prop('disabled', false);
        $scope.currentTagProfil = null;
        $scope.reglesStyleChange('initialiseColoration', null);
        $scope.editStyleChange('initialiseColoration', null);

        $('#add_tag').removeAttr('disabled');

    };

    // Affiche les widgets en bleu;
    $scope.isTagStylesNotEmpty = function () {
        if ($scope.tagStyles.length >= 0) {
            return true;
        }
    };
    // Ajout d'un profil
    $scope.erreurAfficher = false;
    $scope.errorAffiche = [];
    $scope.erreurNomExistant = false;

    $scope.ajouterProfil = function () {
        $scope.errorAffiche = [];
        $scope.addFieldError = [];

        if (!$scope.profil.nom) {
            $scope.addFieldError.push(' Nom ');
            $scope.affichage = true;
        } else {
            $scope.affichage = false;
        }

        if (!$scope.profil.nom && $scope.addFieldError.state) {
            $scope.erreurAfficher = true;
            $scope.errorAffiche.push(' profilInfos ');
        }

        if ($scope.tagStyles.length == 0) { // jshint ignore:line
            $scope.errorAffiche.push(' Style ');
            $scope.erreurAfficher = true;
        }

        if ($scope.profil.nom !== null && $scope.addFieldError.state) {
            $scope.errorAffiche = [];
        }

        if ($scope.tagStyles.length > 0 && $scope.errorAffiche.length === 0 && $scope.affichage === false) {
            $scope.loader = true;
            $scope.loaderMsg = 'Enregistrement du profil en cours ...';
            $scope.profil.photo = './files/profilImage/profilImage.jpg';
            $scope.profil.owner = $rootScope.currentUser._id;
            profilsService.lookForExistingProfile($rootScope.isAppOnline, $scope.profil).then(function (res) {
                if (!res) {
                    $('#addProfileModal').modal('hide');
                    // erase useless datas
                    angular.forEach($scope.tagStyles, function (item) {
                        if (item.disabled) {
                            delete item.disabled;
                        }
                        if (item.tagLibelle) {
                            delete item.tagLibelle;
                        }
                        if (item.tag) {
                            delete item.tag;
                        }
                    });
                    if ($scope.profil.descriptif === '' || !$scope.profil.descriptif.length) {
                        $scope.profil.descriptif = ' ';
                    }

                    profilsService.addProfil($rootScope.isAppOnline, $scope.profil, $scope.tagStyles).then(function (data) {
                    	$scope.profilFlag = data;
                        $scope.lastDocId = data._id;
                        $scope.loader = false;
                        $scope.loaderMsg = '';
                        $scope.afficherProfilsParUser();
                        $scope.resetAddProfilModal();
                    });

                } else {
                    $scope.loader = false;
                    $scope.loaderMsg = '';
                    $scope.erreurNomExistant = true;
                }
            });
        }
    };

    $scope.resetAddProfilModal = function () {
        $scope.profil = {};
        $scope.tagStyles.length = 0;
        $scope.tagStyles = [];
        $scope.colorList = {};
        $scope.errorAffiche = [];
        $scope.addFieldError = [];
        $scope.erreurNomExistant = false;
        $('.shown-text-add').text($scope.displayTextSimple);
        $('.shown-text-add').css('font-family', '');
        $('.shown-text-add').css('font-size', '');
        $('.shown-text-add').css('line-height', '');
        $('.shown-text-add').css('font-weight', '');
        $('.shown-text-add').removeAttr('style');
        $('#addPanel').fadeIn('fast').delay(5000).fadeOut('fast');
        $scope.tagList = {};
        $scope.policeList = {};
        $scope.tailleList = {};
        $scope.interligneList = {};
        $scope.weightList = {};
        $scope.colorList = {};
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $scope.editTag = null;
        $('.addProfile').removeAttr('data-dismiss');
        $scope.affichage = false;
        $scope.erreurAfficher = false;
        $scope.profilTag = {};
    };

    // Modification du profil
    $scope.modifierProfil = function () {
        $scope.addFieldError = [];
        $scope.errorAffiche = [];
        $scope.erreurNomExistant = false;
        if (!$scope.profMod.nom) { // jshint ignore:line
            $scope.addFieldError.push(' Nom ');
            $scope.affichage = true;
        }
        if ($scope.tagStyles.length == 0) { // jshint ignore:line
            $scope.errorAffiche.push(' Style ');
            $scope.erreurAfficher = true;
        }
        if ($scope.addFieldError.length === 0 && $scope.tagStyles.length > 0) {
            $scope.loader = true;
            $scope.loaderMsg = 'Modification du profil en cours ...';
            // $('.editionProfil').attr('data-dismiss', 'modal');
            profilsService.lookForExistingProfile($rootScope.isAppOnline, $scope.profMod).then(function (res) {
                if (!res) {
                    $scope.erreurNomExistant = false;
                    profilsService.updateProfil($rootScope.isAppOnline, $scope.profMod).then(function (data) {
                        $scope.profilFlag = data;
                        /* unit tests */
                        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                            $scope.detailProfil.nom = $scope.profMod.nom;
                            $scope.detailProfil.descriptif = $scope.profMod.descriptif;
                        }
                        $scope.editionAddProfilTag();
                        // $('.editionProfil').removeAttr('data-dismiss');
                        $scope.affichage = false;
                        $scope.tagStyles = [];
                        $rootScope.updateListProfile = !$rootScope.updateListProfile;
                        if ($scope.oldProfilNom === $('#headerSelect + .customSelect .customSelectInner').text()) {
                            $('#headerSelect + .customSelect .customSelectInner').text($scope.profMod.nom);
                        }

                        $rootScope.actu = data;
                        $rootScope.apply; // jshint ignore:line

                        $scope.loader = false;
                        $scope.loaderMsg = '';

                    });
                } else {
                    $scope.loader = false;
                    $scope.loaderMsg = '';
                    $scope.erreurNomExistant = true;
                }
            });
        }
    };

    // Suppression du profil
    $scope.supprimerProfil = function () {
        $scope.loader = true;
        $scope.loaderMsg = 'Suppression du profil en cours ...';
        profilsService.deleteProfil($rootScope.isAppOnline, $rootScope.currentUser._id, $scope.sup._id).then(function (data) {
            $scope.profilFlag = data;
            $('#deleteModal').modal('hide');
            $scope.loader = false;
            $scope.loaderMsg = '';

            $scope.tagStyles.length = 0;
            $scope.tagStyles = [];
            $scope.removeUserProfileFlag = data;
            if ($scope.sup.nom === $('#headerSelect + .customSelect .customSelectInner').text()) {
                $scope.token.defaultProfile = $scope.removeVar;
                $http.post(configuration.URL_REQUEST + '/setProfilParDefautActuel', $scope.token)
                    .success(function () {
                        localStorage.removeItem('profilActuel');
                        localStorage.removeItem('listTags');
                        localStorage.removeItem('listTagsByProfil');
                        $window.location.reload();
                    });
            } else {
                $rootScope.updateListProfile = !$rootScope.updateListProfile;
                $scope.afficherProfilsParUser();
            }
        });
    };

    // Premodification du profil
    $scope.preModifierProfil = function (profil, index) {
        $scope.erreurNomExistant = false;
        $scope.actionType = 'modification';
        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.profMod = {};
            $scope.profMod._id = profil._id;
            $scope.profMod.nom = profil.nom;
            $scope.profMod.descriptif = profil.descriptif;
            $scope.profMod.owner = profil.owner;
            $scope.profMod.photo = profil.photo;
            if (profil.preDelegated) {
                $scope.profMod.preDelegated = profil.preDelegated;
            }
            if (profil.delegated) {
                $scope.profMod.delegated = profil.delegated;
            }
            $scope.profModTagsText = $scope.regles;
            profilsService.getProfilTags($scope.profMod._id).then(function (data) {
                $scope.tagStylesFlag = data;
                // Unit tests
                $scope.tagStyles = data;
                $scope.afficherTags(true, 'modification');
            });
        } else {
            $scope.profMod = profil;
            $scope.profModTagsText = $scope.tests[index + 1].tagsText;
            $scope.tagStyles = $scope.tests[index + 1].tags;
            $scope.tagStylesFlag = $scope.tests[index + 1].tags;
            $scope.afficherTags(true, 'modification');
        }
        $scope.oldProfilNom = $scope.profMod.nom;
        $scope.oldProfilDescriptif = $scope.profMod.descriptif;
        $('.shown-text-edit').text($scope.displayTextSimple);

    };

    // Presuppression du profil
    $scope.preSupprimerProfil = function (profil) {
        $scope.sup = profil;
        $scope.profilName = profil.nom;
    };

    $scope.forceRulesApply = function () {
        $scope.forceApplyRules = false;
        $timeout(function () {
            $scope.forceApplyRules = true;
        });
    };

    // Affichage des tags
    $scope.afficherTags = function (force, popup) {

        if (localStorage.getItem('listTags')) {
            $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
            // Set disabled tags
            for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
                for (var j = $scope.listTags.length - 1; j >= 0; j--) {
                    if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
                        $scope.listTags[j].disabled = true;
                        $scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
                    }
                }
            }
            if (force) {
                $scope.affichageProfilModal(popup);
            }

        } else {
            tagsService.getTags($scope.requestToSend).then(function (data) {
                $scope.listTags = data;
                // Set disabled tags
                for (var i = $scope.tagStyles.length - 1; i >= 0; i--) {
                    for (var j = $scope.listTags.length - 1; j >= 0; j--) {
                        if ($scope.listTags[j]._id === $scope.tagStyles[i].tag) {
                            $scope.listTags[j].disabled = true;
                            $scope.tagStyles[i].tagLibelle = $scope.listTags[j].libelle;
                        }
                    }
                }
                if (force) {
                    $scope.affichageProfilModal(popup);
                }
            });
        }

    };

    /**
     * Cette fonction permet d'initialiser les styles d'un profil à créer par
     * celui par défaut de l'application.
     */
    $scope.initAddProfilTags = function (tags) {
        var listTagsMaps = {};
        angular.forEach($scope.listTags, function (item) {
            listTagsMaps[item._id] = item;
        });
        // Formater les données des tags par ce qui est attendu par le serveur
        angular.forEach(tags, function (item) {
            $scope.tagStyles.push({
                tag: item.tag,
                id_tag: item.tag,
                style: item.texte,
                label: listTagsMaps[item.tag].libelle,
                police: item.police,
                taille: item.taille,
                interligne: item.interligne,
                styleValue: item.styleValue,
                coloration: item.coloration,
                spaceSelected: item.spaceSelected,
                spaceCharSelected: item.spaceCharSelected
            });
        });
        $scope.afficherTags(true, 'ajout');
    };

    /**
     * Cette fonction génère le nom du profil
     */
    $scope.generateProfilName = function (actualPrenom, numeroPrenom, i) {
        if ($scope.tests[i].type === 'profile' && $scope.tests[i].nom.indexOf(actualPrenom) > -1 && $scope.tests[i].nom.length === actualPrenom.length) {
            numeroPrenom++;
            actualPrenom = $rootScope.currentUser.local.prenom + ' ' + numeroPrenom;
            if ((i + 1) < $scope.tests.length) {
                return $scope.generateProfilName(actualPrenom, numeroPrenom, 0);
            } else {
                return actualPrenom;
            }
        } else if ((i + 1) < $scope.tests.length) {
            return $scope.generateProfilName(actualPrenom, numeroPrenom, (i + 1));
        } else {
            return actualPrenom;
        }
    };

    $scope.preAddProfil = function () {
        $scope.erreurNomExistant = false;
        $scope.tagStyles = [];
        $scope.afficherTags();
        // init profil name.
        var prenom = $scope.generateProfilName($rootScope.currentUser.local.prenom, 0, 0);
        for (var i = 0; i < $scope.tests.length; i++) {
            if ($scope.tests[i].type === 'profile' && $scope.tests[i].state === 'default' && $scope.tests[i].nom === 'Accessidys par défaut') {
                $scope.defaultStyle = $scope.tests[i];
            }
            if ($scope.defaultStyle && $scope.defaultStyle.type === 'profile' && $scope.tests[i].type === 'tags' && $scope.tests[i].idProfil === $scope.defaultStyle._id) {
                $scope.defaultStyle = $scope.tests[i];
            }
        }
        $scope.oldProfilNom = prenom;
        $scope.oldProfilDescriptif = ' ';
        $scope.profil = {
            'nom': prenom,
            'descriptif': ' '
        };
        $scope.affichage = false;
        // Ajouter le texte de l'aperçu des Tags
        $('.shown-text-add').text($scope.displayTextSimple);

        // init add profil styles with cnedAdapt default style/
        if ($scope.defaultStyle.tags && $scope.defaultStyle.tags.length)
            $scope.initAddProfilTags($scope.defaultStyle.tags);

    };


    /* Mettre à jour la liste des TagsParProfil */
    $scope.updateProfilActual = function () {
        var profilActual = JSON.parse(localStorage.getItem('profilActuel'));

        /* Mettre à jour l'apercu de la liste des profils */
        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.initDetailProfil();
        } else {
            $scope.afficherProfilsParUser();
        }
        if (profilActual && $scope.profMod._id === profilActual._id) {
            profilsService.getProfilTags($scope.profilFlag._id).then(function (data) {
                localStorage.setItem('listTagsByProfil', JSON.stringify(data));
            });
        }
    };

    // enregistrement du profil-tag lors de l'edition
    $scope.editionAddProfilTag = function () {
        var profilTagsResult = [];

        if (!$scope.token || !$scope.token.id) {
            $scope.token = {
                id: localStorage.getItem('compteId')
            };
        }

        $scope.tagStyles.forEach(function (item) {
            var profilTag = {
                id_tag: item.tag,
                style: item.texte,
                police: item.police,
                taille: item.taille,
                interligne: item.interligne,
                styleValue: item.styleValue,
                coloration: item.coloration,
                spaceSelected: item.spaceSelected,
                spaceCharSelected: item.spaceCharSelected
            };
            if (item.state !== 'deleted') {
                profilTagsResult.push(profilTag);
            }
        });

        $scope.resetEditProfilModal();

        console.log('new tags : ');
        console.log(profilTagsResult);

        profilsService.updateProfilTags($rootScope.isAppOnline, $scope.profMod, profilTagsResult).then(function (result) {
            if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                $scope.initDetailProfil();
                $('#profilAffichageModal').modal('hide');
            } else {
                $('#profilAffichageModal').modal('hide');
                $scope.afficherProfilsParUser();
            }
            $scope.updateProfilActual();
            $('#editPanel').fadeIn('fast').delay(1000).fadeOut('fast');

        });

    };
    $scope.resetEditProfilModal = function () {
        $scope.tagStyles = [];
        $scope.tagList = {};
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.weightList = null;
        $scope.listeProfils = {};
        $scope.editTag = null;
        $scope.colorList = null;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $('.shown-text-edit').text($scope.displayTextSimple);
        $('.shown-text-edit').css('font-family', '');
        $('.shown-text-edit').css('font-size', '');
        $('.shown-text-edit').css('line-height', '');
        $('.shown-text-edit').css('font-weight', '');
        $('.shown-text-edit').removeAttr('style');

        $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
    };

    // Griser select après validation
    $scope.affectDisabled = function (param) {
        if (param) {
            return true;
        } else {
            return false;
        }
    };

    // verification des champs avant validation lors de l'ajout
    $scope.beforeValidationAdd = function () {
        $scope.addFieldError = [];
        $scope.affichage = false;

        if ($scope.profil.nom == null) { // jshint ignore:line
            $scope.addFieldError.push(' Nom ');
            $scope.affichage = true;
        }
        if ($scope.tagList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Style ');
            $scope.affichage = true;
        }
        if ($scope.policeList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Police ');
            $scope.affichage = true;
        }
        if ($scope.tailleList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Taille ');
            $scope.affichage = true;
        }
        if ($scope.interligneList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Interligne ');
            $scope.affichage = true;
        }
        if ($scope.colorList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Coloration ');
            $scope.affichage = true;
        }
        if ($scope.weightList == null) { // jshint ignore:line
            $scope.addFieldError.push(' Graisse ');
            $scope.affichage = true;
        }
        if ($scope.spaceSelected == null) { // jshint ignore:line
            $scope.addFieldError.push(' espace entre les mots ');
            $scope.affichage = true;
        }
        if ($scope.spaceCharSelected == null) { // jshint ignore:line
            $scope.addFieldError.push(' Espace entre Les caractères ');
            $scope.affichage = true;
        }

        if ($scope.addFieldError.length === 0) {
            $scope.validerStyleTag();
            $scope.addFieldError.state = true;
            $scope.affichage = false;
            $scope.erreurAfficher = false;
            $scope.errorAffiche = [];
            $scope.colorationCount = 0;
            $scope.oldColoration = null;
            $scope.spaceSelected = null;
            $scope.spaceSelected = null;
        }
    };
    $scope.addFieldError = [];



    // Valider les attributs d'un Tag
    $scope.validerStyleTag = function () {

        try {
            $scope.currentTag = JSON.parse($scope.tagList);
        } catch (ex) {
            console.log('Exception ==> ', ex);
            $scope.currentTag = $scope.tagList;
        }

        var fontstyle = 'Normal';
        if ($scope.weightList === 'Gras') {
            fontstyle = 'Bold';
        }
        var tmpText = {};
        tmpText.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
        tmpText.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
        tmpText.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
        tmpText.tailleList = 1 + ($scope.tailleList - 1) * 0.18;

        var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText.tailleList + '" data-lineheight="' + tmpText.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText.spaceSelected + '" data-letter-spacing="' + tmpText.spaceCharSelected + '" > </p>';

        var tagExist = false;
        for (var i = 0; i < $scope.tagStyles.length; i++) {
            if ($scope.tagStyles[i].id_tag === $scope.currentTag._id) {
                $scope.tagStyles[i].style = mytext;
                $scope.tagStyles[i].label = $scope.currentTag.libelle;
                $scope.tagStyles[i].police = $scope.policeList;
                $scope.tagStyles[i].taille = $scope.tailleList;
                $scope.tagStyles[i].interligne = $scope.interligneList;
                $scope.tagStyles[i].styleValue = $scope.weightList;
                $scope.tagStyles[i].coloration = $scope.colorList;
                $scope.tagStyles[i].spaceSelected = $scope.spaceSelected;
                $scope.tagStyles[i].spaceCharSelected = $scope.spaceCharSelected;
                tagExist = true;
                if (!testEnv) {
                    var tagDescr = $scope.getTagsDescription($scope.currentTagProfil.id_tag);
                    $scope.defaultStyle.tagsText[i].texte = $scope.refreshEditStyleTextDemo(tagDescr, $scope.defaultStyle.tagsText[i].texte);
                }
                break;
            }
        }

        // If Tag does not exist already, add a new One
        if (!tagExist) {
            $scope.tagStyles.push({
                id_tag: $scope.currentTag._id,
                style: mytext,
                label: $scope.currentTag.libelle,
                police: $scope.policeList,
                taille: $scope.tailleList,
                interligne: $scope.interligneList,
                styleValue: $scope.weightList,
                coloration: $scope.colorList,
                spaceSelected: $scope.spaceSelected,
                spaceCharSelected: $scope.spaceCharSelected
            });
        }


        angular.element($('#style-affected-add').removeAttr('style'));
        $scope.editStyleChange('initialiseColoration', null);
        $('.shown-text-add').removeAttr('style');
        $('.shown-text-add').text($scope.displayTextSimple);

        $scope.colorationCount = 0;
        $scope.tagList = null;
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.weightList = null;
        $scope.colorList = null;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $scope.editTag = null;
        $('.label_action').removeClass('selected_label');
        $('#addProfile .customSelectInner').text('');
        $('#add_tag').prop('disabled', false);
        $scope.hideVar = true;

        // Disable Already Selected Tags
        for (var i = $scope.listTags.length - 1; i >= 0; i--) {
            for (var j = 0; j < $scope.tagStyles.length; j++) {
                if ($scope.listTags[i]._id === $scope.tagStyles[j].id_tag) {
                    $scope.listTags[i].disabled = true;
                }
            }
        }
    };


    // Modifier les attributs d'un Tag
    $scope.editStyleTag = function (tagStyleParametre) {
        if (typeof tagStyleParametre !== 'object')
            tagStyleParametre = $scope.tagStyles[tagStyleParametre];
        $scope.currentTagProfil = tagStyleParametre;

        for (var i = 0; i < $scope.tagStyles.length; i++) {
            if (tagStyleParametre.id_tag === $scope.tagStyles[i].id_tag) {

                // Afficher le nom du tag dans le Select
                $scope.tagStyles[i].disabled = true;
                $scope.hideVar = false;
                // Disable le bouton de Validation du Tag
                // $('#addProfileValidation').prop('disabled', false);

                // Set des paramétres à afficher
                $scope.tagList = {
                    _id: tagStyleParametre.id_tag,
                    libelle: tagStyleParametre.label
                };
                $scope.policeList = tagStyleParametre.police;
                $scope.tailleList = tagStyleParametre.taille;
                $scope.interligneList = tagStyleParametre.interligne;
                $scope.weightList = tagStyleParametre.styleValue;
                $scope.colorList = tagStyleParametre.coloration;
                $scope.spaceSelected = tagStyleParametre.spaceSelected;
                $scope.spaceCharSelected = tagStyleParametre.spaceCharSelected;
                $scope.openStyleEditModal('ajout');
            }
        }
    };

    $scope.checkStyleTag = function () {
        if ($scope.tagStyles.length > 0) {
            return false;
        }
        if ($scope.tagStyles.length === 0 && $scope.trashFlag) {
            return false;
        }
        return true;
    };

    // Edition StyleTag
    $scope.editerStyleTag = function () {

        var fontstyle = 'Normal';
        if ($scope.weightList === 'Gras') {
            fontstyle = 'Bold';
        }
        if (!$scope.currentTagProfil) {
            console.log('addiction of new element');
            /* Aucun tag n'est sélectionné */
            $scope.currentTagEdit = JSON.parse($scope.editTag);
            for (var i = $scope.listTags.length - 1; i >= 0; i--) {
                if ($scope.listTags[i]._id === $scope.currentTagEdit._id) {
                    $scope.listTags[i].disabled = true;
                    break;
                }
            }
            var tmpText = {};
            tmpText.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
            tmpText.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
            tmpText.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
            tmpText.tailleList = 1 + ($scope.tailleList - 1) * 0.18;


            var textEntre = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText.tailleList + '" data-lineheight="' + tmpText.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText.spaceSelected + '" data-letter-spacing="' + tmpText.spaceCharSelected + '" > </p>';
            // var textEntre = '<p data-font="' + $scope.policeList + '"
            // data-size="' + $scope.tailleList + '" data-lineheight="' +
            // $scope.interligneList + '" data-weight="' + $scope.weightList +
            // '"
            // data-coloration="' + $scope.colorList + '" data-word-spacing ="'
            // +
            // $scope.spaceSelected + '" data-letter-spacing="' +
            // $scope.spaceCharSelected + '"> </p>';

            /* Liste nouveaux Tags */
            $scope.tagStyles.push({
                tag: $scope.currentTagEdit._id,
                tagLibelle: $scope.currentTagEdit.libelle,
                profil: $scope.lastDocId,
                police: $scope.policeList,
                taille: $scope.tailleList,
                interligne: $scope.interligneList,
                styleValue: $scope.weightList,
                coloration: $scope.colorList,
                spaceSelected: $scope.spaceSelected,
                spaceCharSelected: $scope.spaceCharSelected,
                texte: textEntre,
                state: 'added'
            });
            console.log($scope.tagStyles);
            angular.element($('.shown-text-edit').text($scope.displayTextSimple));
            angular.element($('#style-affected-edit').removeAttr('style'));
        } else {
            /* Tag sélectionné */
            console.log('edition tagstyle');
            if (!$scope.currentTagProfil.state) {
                console.log('edition of element 2');
                var tmpText2 = {};
                tmpText2.spaceSelected = 0 + ($scope.spaceSelected - 1) * 0.18;
                tmpText2.spaceCharSelected = 0 + ($scope.spaceCharSelected - 1) * 0.12;
                tmpText2.interligneList = 1.286 + ($scope.interligneList - 1) * 0.18;
                tmpText2.tailleList = 1 + ($scope.tailleList - 1) * 0.18;

                var mytext = '<p data-font="' + $scope.policeList + '" data-size="' + tmpText2.tailleList + '" data-lineheight="' + tmpText2.interligneList + '" data-weight="' + fontstyle + '" data-coloration="' + $scope.colorList + '" data-word-spacing="' + tmpText2.spaceSelected + '" data-letter-spacing="' + tmpText2.spaceCharSelected + '" > </p>';
                /* Liste tags modifiés */
                for (var c = 0; c < $scope.tagStyles.length; c++) {
                    if ($scope.tagStyles[c]._id === $scope.currentTagProfil._id) {
                        $scope.tagStyles[c].texte = mytext;
                        $scope.tagStyles[c].police = $scope.policeList;
                        $scope.tagStyles[c].taille = $scope.tailleList;
                        $scope.tagStyles[c].interligne = $scope.interligneList;
                        $scope.tagStyles[c].styleValue = $scope.weightList;
                        $scope.tagStyles[c].coloration = $scope.colorList;
                        $scope.tagStyles[c].spaceSelected = $scope.spaceSelected;
                        $scope.tagStyles[c].spaceCharSelected = $scope.spaceCharSelected;
                        $scope.tagStyles[c].state = 'modified';

                        if (!testEnv) {
                            var tagDescr = $scope.getTagsDescription($scope.currentTagProfil.tag);
                            $scope.profModTagsText[c].texte = $scope.refreshEditStyleTextDemo(tagDescr, $scope.profModTagsText[c].texte);
                            // $scope.profModTagsText[c].texte =
                            // $scope.adaptiveTextDemo(demoText,$scope.tagStyles[c]);
                        }
                    }
                }
                $scope.currentTagProfil = null;
                $scope.noStateVariableFlag = true;
            }
        }

        $('#selectId option').eq(0).prop('selected', true);
        $('#selectIdDuplisuer option').eq(0).prop('selected', true);
        $('#selectId').prop('disabled', false);
        $('#selectIdDuplisuer').prop('disabled', false);
        $scope.hideVar = true;
        $scope.editTag = null;
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.weightList = null;
        $scope.colorList = null;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $scope.colorationCount = 0;
        $scope.oldColoration = null;
        $scope.editStyleChange('initialiseColoration', null);
        $('.selected_label').removeClass('selected_label');

        // set customSelect jquery plugin span text to empty string
        $('.shown-text-edit').removeAttr('style');
        $('.shown-text-duplique').removeAttr('style');
        $('.shown-text-edit').text($scope.displayTextSimple);
        $('.shown-text-duplique').text($scope.displayTextSimple);
        $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
    };



    // Suppression d'un paramètre
    $scope.ajoutSupprimerTag = function (parameter) {
        var index = $scope.tagStyles.indexOf(parameter);
        if (index > -1) {
            $scope.tagStyles.splice(index, 1);
        }
        for (var j = $scope.listTags.length - 1; j >= 0; j--) {
            if ($scope.listTags[j]._id === parameter.id_tag) {
                $scope.listTags[j].disabled = false;
            }
        }

        if ($scope.tagStyles.length < 1) {
            $scope.erreurAfficher = true;
        } else {
            $scope.erreurAfficher = false;
        }
        // Set des valeures par défaut
        $('.shown-text-add').text($scope.displayTextSimple);
        $('.shown-text-add').removeAttr('style');

        $scope.hideVar = true;

        $('select[data-ng-model="tagList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');
        $('#add_tag option').eq(0).prop('selected', true);
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.colorList = null;
        $scope.weightList = null;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $scope.tagList = null;
        $scope.reglesStyleChange('initialiseColoration', null);
        $('#add_tag').removeAttr('disabled');
    };


    $scope.PreeditionSupprimerTag = function (toDelete) {
        $('#myModal').modal('show');
        $scope.toDeleteTag = toDelete;
    };

    // Supression d'un tag lors de l'edition
    $scope.editionSupprimerTag = function () {
        var parameter = $scope.toDeleteTag;
        // if (parameter.state) {
        var index = $scope.tagStyles.indexOf(parameter);
        if (index > -1) {
            var tmp = $scope.tagStyles[index];
            tmp.state = 'deleted';
            $scope.tagStylesToDelete.push(tmp);
            $scope.tagStyles.splice(index, 1);

        }
        for (var k = $scope.listTags.length - 1; k >= 0; k--) {
            if (parameter.tag === $scope.listTags[k]._id) {
                $scope.listTags[k].disabled = false;
            }
        }

        if ($scope.tagStyles.length < 1) {
            $scope.erreurAfficher = true;
        } else {
            $scope.erreurAfficher = false;
        }
        $scope.currentTagProfil = null;

        $scope.editStyleChange('initialiseColoration', null);

        angular.element($('.shown-text-edit').text($scope.displayTextSimple));
        angular.element($('.shown-text-duplique').text($scope.displayTextSimple));
        angular.element($('.shown-text-edit').removeAttr('style'));
        angular.element($('.shown-text-duplique').removeAttr('style'));

        $scope.hideVar = true;

        $('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text('');
        $('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text('');

        $('#selectId option').eq(0).prop('selected', true);
        $('#selectIdDuplisuer option').eq(0).prop('selected', true);
        $('#selectId').removeAttr('disabled');
        $('#selectIdDuplisuer').removeAttr('disabled');
        $scope.policeList = null;
        $scope.tailleList = null;
        $scope.interligneList = null;
        $scope.colorList = null;
        $scope.weightList = null;
        $scope.spaceSelected = null;
        $scope.spaceCharSelected = null;
        $scope.editTag = null;
        $scope.editStyleChange('initialiseColoration', null);

    };

    $scope.hideVar = true;
    // Modification d'un tag lors de l'edition
    $scope.label_action = 'label_action';

    $scope.editionModifierTag = function (parameter) {
        $scope.popupDeModification = '#editModal';
        // si le parametre n'est pas un objet(style), récupérer le style
        // (édition depuis la popup de gestion de styles).
        if (typeof parameter !== 'object') {
            parameter = $scope.tagStyles[parameter];
            $scope.editingStyles = true;
            parameter.tagLibelle = ($scope.getTagsDescription(parameter.tag)).libelle;
        } else {
            $scope.editingStyles = false;
        }
        console.time('editionModifierTag');
        $scope.hideVar = false;

        $scope.currentTagProfil = parameter;
        for (var i = $scope.listTags.length - 1; i >= 0; i--) {
            if (parameter.tag === $scope.listTags[i]._id) {

                $scope.listTags[i].disabled = true;
                $scope.editTag = parameter.tagLibelle;
                $scope.policeList = parameter.police;
                $scope.tailleList = parameter.taille;
                $scope.interligneList = parameter.interligne;
                $scope.weightList = parameter.styleValue;
                $scope.colorList = parameter.coloration;
                $scope.spaceSelected = parameter.spaceSelected;
                $scope.spaceCharSelected = parameter.spaceCharSelected;
                $scope.openStyleEditModal('modification');

                console.timeEnd('editionModifierTag');
            }
        }
    };


    $scope.reglesStyleChange = function (operation, value) {
        $rootScope.$emit('reglesStyleChange', {
            'operation': operation,
            'element': 'shown-text-add',
            'value': value
        });
    };

    $scope.editStyleChange = function (operation, value) {
        $rootScope.$emit('reglesStyleChange', {
            'operation': operation,
            'element': 'shown-text-edit',
            'value': value
        });
    };

    $scope.editHyphen = function () {
        angular.element($('.shown-text-edit').addClass('hyphenate'));
        $('#selectId').removeAttr('disabled');
        angular.element($('.shown-text-edit').removeAttr('style'));
    };

    $scope.mettreParDefaut = function (param) {
        $scope.defaultVar = {
            userID: param.owner,
            profilID: param._id,
            defaultVar: true
        };
        param.defautMark = true;
        param.defaut = true;
        $scope.token.addedDefaultProfile = $scope.defaultVar;
        $http.post(configuration.URL_REQUEST + '/setDefaultProfile', $scope.token)
            .success(function (data) {
                $scope.defaultVarFlag = data;
                $('#defaultProfile').fadeIn('fast').delay(5000).fadeOut('fast');
                $('.action_btn').attr('data-shown', 'false');
                $('.action_list').attr('style', 'display:none');
                if ($scope.testEnv === false) {
                    $scope.afficherProfilsParUser();
                }
            });
    };

    $scope.retirerParDefaut = function (param) {
        $scope.defaultVar = {
            userID: param.owner,
            profilID: param._id,
            defaultVar: false
        };

        if ($scope.token && $scope.token.id) {
            $scope.token.cancelFavs = $scope.defaultVar;
        } else {
            $scope.token.id = localStorage.getItem('compteId');
            $scope.token.cancelFavs = $scope.defaultVar;
        }

        $http.post(configuration.URL_REQUEST + '/cancelDefaultProfile', $scope.token)
            .success(function (data) {
                $scope.cancelDefaultProfileFlag = data;
                $('#defaultProfileCancel').fadeIn('fast').delay(5000).fadeOut('fast');
                $('.action_btn').attr('data-shown', 'false');
                $('.action_list').attr('style', 'display:none');
                if ($scope.testEnv === false) {
                    $scope.afficherProfilsParUser();
                }
            });
    };

    $scope.isDefault = function (param) {
        if (param && param.stateDefault || param.state === 'default') {
            return true;
        }
        return false;
    };

    $scope.isDelegated = function (param) {
        if (param && param.state === 'delegated') {
            return true;
        }
        return false;
    };

    $scope.isFavourite = function (param) {
        if (param && (param.state === 'favoris' || param.state === 'default')) {
            return true;
        }
        return false;
    };

    $scope.isProfil = function (param) {
        if (param && param.showed) {
            if (param.type === 'profile') {
                return true;
            }
        }
        return false;
    };

    $scope.isOwnerDelagate = function (param) {
        if (param && param.delegated && param.owner === $rootScope.currentUser._id) {
            return true;
        }
        return false;
    };

    $scope.isAnnuleDelagate = function (param) {
        if (param && param.preDelegated && param.owner === $rootScope.currentUser._id) {
            return true;
        }
        return false;
    };

    $scope.isDelegatedOption = function (param) {
        if (param && !param.delegated && !param.preDelegated && param.owner === $rootScope.currentUser._id) {
            return true;
        }
        return false;
    };

    $scope.isDeletableIHM = function (param) {
        if (param.owner === $rootScope.currentUser._id) {
            return true;
        }
        return false;
    };

    $scope.toViewProfil = function (param) {
        $location.search('idProfil', param._id).path('/detailProfil').$$absUrl;
    };

    $scope.preRemoveFavourite = function (param) {
        $scope.profilId = param._id;
    };

    $scope.removeFavourite = function () {
        $scope.sendVar = {
            profilID: $scope.profilId,
            userID: $rootScope.currentUser._id,
            favoris: true
        };

        if ($scope.token && $scope.token.id) {
            $scope.token.favProfile = $scope.sendVar;
        } else {
            $scope.token.id = localStorage.getItem('compteId');
            $scope.token.favProfile = $scope.sendVar;
        }
        $http.post(configuration.URL_REQUEST + '/removeUserProfileFavoris', $scope.token)
            .success(function (data) {
                $scope.removeUserProfileFavorisFlag = data;
                localStorage.removeItem('profilActuel');
                localStorage.removeItem('listTagsByProfil');
                $rootScope.$broadcast('initProfil');
                if ($scope.testEnv === false) {
                    $scope.afficherProfilsParUser();
                }

            });

    };

    /* envoi de l'email lors de la dupliquation */
    $scope.sendEmailDuplique = function () {
        $http.post(configuration.URL_REQUEST + '/findUserById', {
            idUser: $scope.oldProfil.owner
        }).success(function (data) {
            $scope.findUserByIdFlag = data;
            if (data && data.local) {
                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                $scope.sendVar = {
                    emailTo: data.local.email,
                    content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour dupliquer votre profil : ' + $scope.oldProfil.nom + '. </span>',
                    subject: fullName + ' a dupliqué votre profil'
                };
                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                    .success(function () {});
            }
        }).error(function () {
            console.log('erreur lors de lenvoie du mail dupliquer');
        });
    };

    // preDupliquer le profil favori
    $scope.preDupliquerProfilFavorit = function (profil) {
        $scope.actionType = 'duplicate';
        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.profMod = {};
            $scope.profMod._id = profil._id;
            $scope.profMod.nom = profil.nom;
            $scope.profMod.descriptif = profil.descriptif;
            $scope.profMod.owner = profil.owner;
            $scope.profMod.photo = profil.photo;
        } else {
            $scope.profMod = profil;
        }

        $scope.oldProfil = {
            nom: $scope.profMod.nom,
            owner: $scope.profMod.owner
        };

        $scope.profMod.nom = $scope.profMod.nom + ' Copie';
        $scope.profMod.descriptif = $scope.profMod.descriptif + ' Copie';
        $http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
                idProfil: profil._id
            })
            .success(function (data) {
                $scope.tagStylesFlag = data;
                /* Unit tests */
                $scope.tagStyles = data;
                /*
                 * $scope.tagStyles.forEach(function(item) { item.state = true;
                 * });
                 */
                $scope.afficherTags();
            });
        $('.shown-text-duplique').text($scope.displayTextSimple);
    };

    // OnchangeStyle du profil
    $scope.dupliqueStyleChange = function (operation, value) {
        $rootScope.$emit('reglesStyleChange', {
            'operation': operation,
            'element': 'shown-text-duplique',
            'value': value
        });
    };

    // Dupliquer les tags du profil
    $scope.dupliqueProfilTag = function () {
        if (!$scope.token || !$scope.token.id) {
            $scope.token = {
                id: localStorage.getItem('compteId')
            };
        }

        var tagsToDupl = [];
        $scope.tagStyles.forEach(function (item) {
            // if (item.state) {
            var profilTag = {
                id_tag: item.tag,
                style: item.texte,
                police: item.police,
                taille: item.taille,
                interligne: item.interligne,
                styleValue: item.styleValue,
                coloration: item.coloration,
                spaceSelected: item.spaceSelected,
                spaceCharSelected: item.spaceCharSelected

            };
            tagsToDupl.push(profilTag);
            // }
        });
        for (var i = 0; i < tagsToDupl.length; i++) {
            for (var k = $scope.tagStylesToDelete.length - 1; k >= 0; k--) {
                if (tagsToDupl[i].id === $scope.tagStylesToDelete[k]._id) {
                    tagsToDupl.splice(i, 1);
                }
            }

        }

        if (tagsToDupl.length > 0) {
            $http.post(configuration.URL_REQUEST + '/ajouterProfilTag', {
                    id: $scope.token.id,
                    profilID: $scope.profMod._id,
                    profilTags: JSON.stringify(tagsToDupl)
                })
                .success(function (data) {
                    $scope.editionFlag = data;
                    /* unit tests */
                    $scope.loader = false;
                    $scope.loaderMsg = '';

                    if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
                        $scope.initDetailProfil();
                    } else {
                        $scope.afficherProfilsParUser();
                    }
                    $scope.tagStyles.length = 0;
                    $scope.tagStyles = [];
                    $scope.tagList = {};
                    $scope.policeList = null;
                    $scope.tailleList = null;
                    $scope.interligneList = null;
                    $scope.weightList = null;
                    $scope.listeProfils = {};
                    $scope.editTag = null;
                    $scope.colorList = null;
                    $scope.spaceSelected = null;
                    $scope.spaceCharSelected = null;

                    $('.shown-text-edit').text($scope.displayTextSimple);
                    $('.shown-text-edit').css('font-family', '');
                    $('.shown-text-edit').css('font-size', '');
                    $('.shown-text-edit').css('line-height', '');
                    $('.shown-text-edit').css('font-weight', '');
                    $('.shown-text-add').css('word-spacing', '0em');
                    $('.shown-text-add').css('letter-spacing', '0em');
                }).error(function () {
                    console.log('dupliqueProfilTag');
                });
        }
    };

    // Dupliquer le profil
    $scope.dupliquerFavoritProfil = function () {
        $scope.addFieldError = [];
        if ($scope.profMod.nom == null) { // jshint ignore:line
            $scope.addFieldError.push(' Nom ');
            $scope.affichage = true;
        }
        if ($scope.profMod.descriptif == null) { // jshint ignore:line
            $scope.addFieldError.push(' Descriptif ');
            $scope.affichage = true;
        }
        if ($scope.addFieldError.length === 0) { // jshint ignore:line
            $scope.loader = true;
            $scope.loaderMsg = 'Duplication du profil en cours ...';
            $('.dupliqueProfil').attr('data-dismiss', 'modal');
            var newProfile = {};
            newProfile.photo = './files/profilImage/profilImage.jpg';
            newProfile.owner = $rootScope.currentUser._id; // $rootScope.currentUser._id;
            newProfile.nom = $scope.profMod.nom;
            newProfile.descriptif = $scope.profMod.descriptif;
            if (!$scope.token || !$scope.token.id) {
                $scope.token = {
                    id: localStorage.getItem('compteId')
                };
            }
            $scope.token.newProfile = newProfile;
            $http.post(configuration.URL_REQUEST + '/ajouterProfils', $scope.token)
                .success(function (data) {
                    $scope.sendEmailDuplique();
                    $scope.profilFlag = data;
                    /* unit tests */
                    $scope.profMod._id = $scope.profilFlag._id;
                    $rootScope.updateListProfile = !$rootScope.updateListProfile;
                    $scope.dupliqueProfilTag();
                    $('.dupliqueProfil').removeAttr('data-dismiss');
                    $scope.affichage = false;
                    $scope.tagStyles = [];

                }).error(function () {
                    console.log('3-2');
                });
        }
    };

    $scope.dupliqueModifierTag = function (parameter) {
        $scope.hideVar = false;
        $('.label_action').removeClass('selected_label');
        $('#' + parameter._id).addClass('selected_label');
        $scope.currentTagProfil = parameter;
        for (var i = $scope.listTags.length - 1; i >= 0; i--) {
            if (parameter.tag === $scope.listTags[i]._id) {
                $scope.listTags[i].disabled = true;
                angular.element($('#selectIdDuplisuer option').each(function () {
                    var itemText = $(this).text();
                    if (itemText === parameter.tagLibelle) {
                        $(this).prop('selected', true);
                        $('#selectIdDuplisuer').prop('disabled', 'disabled');
                        $('#dupliqueValidationButton').prop('disabled', false);
                    }
                }));
                $('#dupliqueValidationButton').prop('disabled', false);
                $scope.editTag = parameter.tagLibelle;
                $scope.policeList = parameter.police;
                $scope.tailleList = parameter.taille;
                $scope.interligneList = parameter.interligne;
                $scope.weightList = parameter.styleValue;
                $scope.colorList = parameter.coloration;
                $scope.spaceSelected = parameter.spaceSelected;
                $scope.spaceCharSelected = parameter.spaceCharSelected;

                $scope.dupliqueStyleChange('police', $scope.policeList);
                $scope.dupliqueStyleChange('taille', $scope.tailleList);
                $scope.dupliqueStyleChange('interligne', $scope.interligneList);
                $scope.dupliqueStyleChange('style', $scope.weightList);
                $scope.dupliqueStyleChange('coloration', $scope.colorList);
                $scope.dupliqueStyleChange('space', $scope.spaceSelected);
                $scope.dupliqueStyleChange('spaceChar', $scope.spaceCharSelected);

                /* Selection de la pop-up de la duplication */
                var dupliqModal = $('#dupliqueModal');

                // set span text value of customselect
                $(dupliqModal).find('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text(parameter.tagLibelle);
                $(dupliqModal).find('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text(parameter.police);
                $(dupliqModal).find('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text(parameter.taille);
                $(dupliqModal).find('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text(parameter.interligne);
                $(dupliqModal).find('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text(parameter.styleValue);
                $(dupliqModal).find('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text(parameter.coloration);
                $(dupliqModal).find('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text(parameter.spaceSelected);
                $(dupliqModal).find('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text(parameter.spaceCharSelected);

            }
        }
    };

    $scope.preDeleguerProfil = function (profil) {
        if (!$rootScope.isAppOnline) {
            $scope.delegationInfoDeconnecte();
        } else {
            $('#delegateModal').modal('show');
            $scope.profDelegue = profil;
            $scope.errorMsg = '';
            $scope.successMsg = '';
            $scope.delegateEmail = '';
        }
    };

    $scope.deleguerProfil = function () {
        $scope.errorMsg = '';
        $scope.successMsg = '';
        if (!$scope.delegateEmail || $scope.delegateEmail.length <= 0) {
            $scope.errorMsg = 'L\'email est obligatoire !';
            return;
        }
        if (!verifyEmail($scope.delegateEmail)) {
            $scope.errorMsg = 'L\'email est invalide !';
            return;
        }
        $http.post(configuration.URL_REQUEST + '/findUserByEmail', {
                email: $scope.delegateEmail
            })
            .success(function (data) {
                if (data) {
                    $scope.findUserByEmailFlag = data;
                    var emailTo = data.local.email;

                    if (emailTo === $rootScope.currentUser.local.email) {
                        $scope.errorMsg = 'Vous ne pouvez pas déléguer votre profil à vous même !';
                        return;
                    }

                    $('#delegateModal').modal('hide');

                    var sendParam = {
                        idProfil: $scope.profDelegue._id,
                        idDelegue: data._id
                    };
                    $scope.loader = true;
                    $scope.loaderMsg = 'Délégation du profil en cours...';
                    $http.post(configuration.URL_REQUEST + '/delegateProfil', sendParam)
                        .success(function () {
                            var profilLink = $location.absUrl();
                            profilLink = profilLink.replace('#/profiles', '#/detailProfil?idProfil=' + $scope.profDelegue._id);
                            var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                            $scope.sendVar = {
                                emailTo: emailTo,
                                content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour vous déléguer son profil : <a href=' + profilLink + '>' + $scope.profDelegue.nom + '</a>. </span>',
                                subject: 'Profil délégué'
                            };
                            $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                    timeout: 60000
                                }).success(function () {
                                    $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                                    $scope.msgSuccess = 'La demande est envoyée avec succés.';
                                    $scope.errorMsg = '';
                                    $scope.delegateEmail = '';
                                    $scope.loader = false;
                                    $scope.afficherProfilsParUser();
                                }).error(function () {
                                    $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                                    $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                                    $scope.loader = false;
                                    $scope.afficherProfilsParUser();
                                });
                        });
                } else {
                    $scope.errorMsg = 'L\'Email n\'est pas identifié dans Accessidys!';
                }
            });
    };

    $scope.preRetirerDeleguerProfil = function (profil) {
        if (!$rootScope.isAppOnline) {
            $scope.delegationInfoDeconnecte();
        } else {
            $('#retirerDelegateModal').modal('show');
            $scope.profRetirDelegue = profil;
        }
    };

    $scope.retireDeleguerProfil = function () {
        var sendParam = {
            id: $rootScope.currentUser.local.token,
            sendedVars: {
                idProfil: $scope.profRetirDelegue._id,
                idUser: $rootScope.currentUser._id
            }
        };
        $scope.loader = true;
        $scope.loaderMsg = 'Retrait de la délégation du profil en cours...';
        $http.post(configuration.URL_REQUEST + '/retirerDelegateUserProfil', sendParam)
            .success(function (data) {
                if (data) {
                    $scope.retirerDelegateUserProfilFlag = data;
                    $http.post(configuration.URL_REQUEST + '/findUserById', {
                            idUser: data.delegatedID
                        })
                        .success(function (data) {
                            if (data) {
                                $scope.findUserByIdFlag2 = data;
                                var emailTo = data.local.email;
                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                $scope.sendVar = {
                                    emailTo: emailTo,
                                    content: '<span> ' + fullName + ' vient de vous retirer la délégation de son profil : ' + $scope.profRetirDelegue.nom + '. </span>',
                                    subject: 'Retirer la délégation'
                                };
                                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                        timeout: 60000
                                    }).success(function () {
                                        $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                                        $scope.msgSuccess = 'La demande est envoyée avec succés.';
                                        $scope.errorMsg = '';
                                        $scope.loader = false;
                                        $scope.afficherProfilsParUser();
                                    }).error(function () {
                                        $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                                        $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                                        $scope.loader = false;
                                        $scope.afficherProfilsParUser();
                                    });
                            }
                        });
                }
            });
    };

    $scope.preAnnulerDeleguerProfil = function (profil) {
        if (!$rootScope.isAppOnline) {
            $scope.delegationInfoDeconnecte();
        } else {
            $('#annulerDelegateModal').modal('show');
            $scope.profAnnuleDelegue = profil;
        }
    };

    $scope.annuleDeleguerProfil = function () {
        var sendParam = {
            id: $rootScope.currentUser.local.token,
            sendedVars: {
                idProfil: $scope.profAnnuleDelegue._id,
                idUser: $rootScope.currentUser._id
            }
        };
        $scope.loader = true;
        $scope.loaderMsg = 'Annulation de la délégation du profil en cours...';
        $http.post(configuration.URL_REQUEST + '/annulerDelegateUserProfil', sendParam)
            .success(function (data) {
                // $rootScope.updateListProfile = !$rootScope.updateListProfile;
                if (data) {
                    $scope.annulerDelegateUserProfilFlag = data;
                    $http.post(configuration.URL_REQUEST + '/findUserById', {
                            idUser: $scope.profAnnuleDelegue.preDelegated
                        })
                        .success(function (data) {
                            if (data) {
                                $scope.findUserByIdFlag2 = data;
                                var emailTo = data.local.email;
                                var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                                $scope.sendVar = {
                                    emailTo: emailTo,
                                    content: '<span> ' + fullName + ' vient d\'annuler la demande de délégation de son profil : ' + $scope.profAnnuleDelegue.nom + '. </span>',
                                    subject: 'Annuler la délégation'
                                };
                                $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar, {
                                        timeout: 60000
                                    }).success(function () {
                                        $('#msgSuccess').fadeIn('fast').delay(5000).fadeOut('fast');
                                        $scope.msgSuccess = 'La demande est envoyée avec succés.';
                                        $scope.errorMsg = '';
                                        $scope.loader = false;
                                        $scope.afficherProfilsParUser();
                                    }).error(function () {
                                        $('#msgError').fadeIn('fast').delay(5000).fadeOut('fast');
                                        $scope.msgError = 'Erreur lors de l\'envoi de la demande.';
                                        $scope.loader = false;
                                        $scope.afficherProfilsParUser();
                                    });
                            }
                        });
                }
            });
    };


    $scope.profilApartager = function (param) {
        if (!$rootScope.isAppOnline) {
            $scope.partageInfoDeconnecte();
        } else {
            $('#shareModal').modal('show');
            $scope.profilPartage = param;
            $scope.currentUrl = $location.absUrl();
            $scope.socialShare();
        }
    };

    /* load email form */
    $scope.loadMail = function () {
        $scope.displayDestination = true;
    };

    $scope.clearSocialShare = function () {
        $scope.displayDestination = false;
        $scope.destinataire = '';
    };

    $scope.attachFacebook = function () {
        console.log(decodeURIComponent($scope.encodeURI));
        $('.facebook-share .fb-share-button').remove();
        $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.envoiUrl) + '" data-layout="button"></div>');
        try {
            FB.XFBML.parse();
        } catch (ex) {
            console.log('gotchaa ... ');
            console.log(ex);
        }
    };

    $scope.attachGoogle = function () {
        console.log('IN ==> ');
        var options = {
            contenturl: decodeURIComponent($scope.envoiUrl),
            contentdeeplinkid: '/pages',
            clientid: '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            prefilltext: '',
            calltoactionlabel: 'LEARN_MORE',
            calltoactionurl: decodeURIComponent($scope.envoiUrl),
            callback: function (result) {
                console.log(result);
                console.log('this is the callback');
            },
            onshare: function (response) {
                console.log(response);
                if (response.status === 'started') {
                    $scope.googleShareStatus++;
                    if ($scope.googleShareStatus > 1) {
                        $('#googleShareboxIframeDiv').remove();
                        // alert('some error in sharing');
                        $('#shareModal').modal('hide');
                        $('#informationModal').modal('show');
                        localStorage.setItem('googleShareLink', $scope.envoiUrl);
                    }
                } else {
                    localStorage.removeItem('googleShareLink');
                    $scope.googleShareStatus = 0;
                    $('#shareModal').modal('hide');
                }

                // These are the objects returned by the platform
                // When the sharing starts...
                // Object {status: "started"}
                // When sharing ends...
                // Object {action: "shared", post_id: "xxx", status:
                // "completed"}
            }
        };

        gapi.interactivepost.render('google-share', options);
    };

    $scope.socialShare = function () {
        $scope.shareMailInvalid = false;
        $scope.destination = $scope.destinataire;
        $scope.encodeURI = encodeURIComponent($location.absUrl());
        $scope.currentUrl = $location.absUrl();
        if ($scope.currentUrl.lastIndexOf('detailProfil') > -1) {
            $scope.envoiUrl = encodeURIComponent($scope.currentUrl);
            $scope.attachFacebook();
            $scope.attachGoogle();
        } else {
            $scope.envoiUrl = encodeURIComponent($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
            $scope.attachFacebook();
            $scope.attachGoogle();
        }
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            $('#confirmModal').modal('show');
            $('#shareModal').modal('hide');
        } else if ($scope.destination && $scope.destination.length > 0) {
            $scope.shareMailInvalid = true;
        }
    };

    /* regex email */
    $scope.verifyEmail = function (email) {
        var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (reg.test(email)) {
            return true;
        } else {
            return false;
        }
    };

    /* envoi de l'email au destinataire */
    $scope.sendMail = function () {
        $('#confirmModal').modal('hide');
        $scope.loaderMsg = 'Partage du profil en cours. Veuillez patienter ..';
        $scope.currentUrl = $location.absUrl();
        if ($location.absUrl().lastIndexOf('detailProfil') > -1) {
            $scope.envoiUrl = decodeURI($scope.currentUrl);
        } else {
            $scope.envoiUrl = decodeURI($scope.currentUrl.replace('profiles', 'detailProfil?idProfil=' + $scope.profilPartage._id));
        }
        $scope.destination = $scope.destinataire;
        $scope.loader = true;
        if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
            if ($location.absUrl()) {
                if ($rootScope.currentUser.dropbox.accessToken) {
                    if (configuration.DROPBOX_TYPE) {
                        if ($rootScope.currentUser) {
                            $scope.sendVar = {
                                to: $scope.destinataire,
                                content: ' vient de partager avec vous un profil sur l\'application Accessidys.  ' + $scope.envoiUrl,
                                encoded: '<span> vient de partager avec vous un profil sur l\'application Accessidys.   <a href=' + $scope.envoiUrl + '>Lien de ce profil</a> </span>',
                                prenom: $rootScope.currentUser.local.prenom,
                                fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                                doc: $scope.envoiUrl
                            };
                            $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
                                .success(function (data) {
                                    $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                                    $scope.sent = data;
                                    $scope.envoiMailOk = true;
                                    $scope.destinataire = '';
                                    $scope.loader = false;
                                    $scope.displayDestination = false;
                                    $scope.loaderMsg = '';
                                }).error(function() {
                                    $scope.loader = false;
                                    $scope.loaderMsg = '';
                                });
                        }
                    }
                }
            }
        } else {
            $('.sendingMail').removeAttr('data-dismiss', 'modal');
            $('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');
        }
    };

    $scope.specificFilter = function () {
        // parcours des Profiles
        for (var i = 0; i < $scope.tests.length; i++) {
            if ($scope.tests[i].type === 'profile') {
                if ($scope.tests[i].nom.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1 || $scope.tests[i].descriptif.toLowerCase().indexOf($scope.query.toLowerCase()) !== -1) {
                    // Query Found
                    $scope.tests[i].showed = true;
                    $scope.tests[i + 1].showed = true;
                } else {
                    // Query not Found
                    $scope.tests[i].showed = false;
                    $scope.tests[i + 1].showed = false;
                }
            }
        }
    };
    // $scope.initProfil();

    /** **** Debut Detail Profil ***** */
    /*
     * Afficher la liste des tags triés avec gestion des niveaux.
     */
    $scope.showTags = function () {
        if ($scope.listTags && $scope.listTags.length > 0) {
            /* Récuperer la position de listTags dans tagsByProfils */
            for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
                for (var j = $scope.listTags.length - 1; j >= 0; j--) {
                    if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
                        $scope.tagsByProfils[i].position = $scope.listTags[j].position;
                    }
                }
            }
            /* Trier tagsByProfils avec position */
            $scope.tagsByProfils.sort(function (a, b) {
                return a.position - b.position;
            });
            var nivTag = 0;
            var nivTagTmp = 0;
            var texteTag;
            for (var i = 0; i < $scope.tagsByProfils.length; i++) {
                nivTagTmp = nivTag;
                for (var j = 0; j < $scope.listTags.length; j++) {
                    if ($scope.tagsByProfils[i].tag === $scope.listTags[j]._id) {
                        var tmpText = {};
                        var fontstyle = 'Normal';
                        if ($scope.tagsByProfils[i].styleValue === 'Gras') {
                            fontstyle = 'Bold';
                        }

                        /* Si le tag contient un niveau strictement positif */
                        if ($scope.listTags[j].niveau && parseInt($scope.listTags[j].niveau) > 0) {
                            nivTag = parseInt($scope.listTags[j].niveau);
                            nivTagTmp = nivTag;
                            nivTag++;
                        }

                        if (nivTagTmp === 0) {
                            $scope.regles[i] = {
                                niveau: 0
                            };
                        } else {
                            var calculatedNiveau = (nivTagTmp - 1) * 30;
                            $scope.regles[i] = {
                                niveau: calculatedNiveau
                            };
                        }

                        var calculatedWidth = 1055 - $scope.regles[i].niveau;

                        $scope.regles[i].profStyle = {
                            'width': calculatedWidth
                        };

                        // Transformation propre à l'application
                        var style = 'font-family: ' + $scope.tagsByProfils[i].police + ';' +
                            'font-size: ' + ($scope.tagsByProfils[i].taille / 12) + 'em; ' +
                            'line-height: ' + (1.286 + ($scope.tagsByProfils[i].interligne - 1) * 0.18) + 'em;' +
                            'font-weight: ' + fontstyle + ';  ' +
                            'word-spacing: ' + (0 + ($scope.tagsByProfils[i].spaceSelected - 1) * 0.18) + 'em;' +
                            'letter-spacing: ' + (0 + ($scope.tagsByProfils[i].spaceCharSelected - 1) * 0.12) + 'em;';

                        if ($scope.listTags[j].balise !== 'div') {
                            texteTag = '<' + $scope.listTags[j].balise + ' style="' + style + '" data-margin-left="' + nivTag + '" >' + $scope.listTags[j].libelle;
                        } else {
                            texteTag = '<' + $scope.listTags[j].balise + ' style="' + style + '" data-margin-left="' + nivTag + '" class="' + removeStringsUppercaseSpaces($scope.listTags[j].libelle) + '">' + $scope.listTags[j].libelle;
                        }
                        texteTag += (': ' + $scope.demoBaseText + '</' + $scope.listTags[j].balise + '>');
                        /*
                         * if
                         * ($scope.listTags[j].libelle.toUpperCase().match('^TITRE')) {
                         * texteTag += ' : Ceci est un exemple de ' +
                         * $scope.listTags[j].libelle + '
                         * </'+$scope.listTags[j].balise+'>'; } else { texteTag += ' :
                         * Accessidys est une application qui permet d\'adapter
                         * les documents. </'+$scope.listTags[j].balise+'>'; }
                         * if(!testEnv){ texteTag =
                         * $scope.adaptiveTextDemo(texteTag,$scope.tagsByProfils[i]); }
                         */
                        $scope.regles[i].texte = texteTag;
                        break;
                    }
                }
            }
        }
    };

    /*
     * Gérer les buttons d'action dans le détail du profil.
     */
    $scope.showProfilAndTags = function (idProfil) {
        if (!idProfil) {
            $scope.target = $location.search()['idProfil']; // jshint
            // ignore:line
        } else {
            $scope.target = idProfil;
        }
        /* Récuperer le profil et le userProfil courant */
        profilsService.getUserProfil($scope.target).then(function (data) {
            if (data === null || !data) {
                $scope.affichageInfoDeconnecte();
            } else {
                $scope.detailProfil = data;
                if ($rootScope.currentUser) {
                    $scope.showPartager = true;
                    /* Non propriétaire du profil */
                    if ($rootScope.currentUser._id !== $scope.detailProfil.owner) {
                        $scope.showDupliquer = true;
                    }
                    /* Propriétaire du profil */
                    if ($rootScope.currentUser._id === $scope.detailProfil.owner && !$scope.detailProfil.delegated) {
                        $scope.showEditer = true;
                    }
                    /*
                     * Propriétaire du profil ou profil délégué ou profil par
                     * defaut
                     */
                    if ($rootScope.currentUser._id === $scope.detailProfil.owner || $scope.detailProfil.delegated || $scope.detailProfil.default || $scope.detailProfil.preDelegated) {
                        $scope.showFavouri = false;
                    } else {
                        $scope.showFavouri = !$scope.detailProfil.favoris;
                    }
                    /* profil délégué à l'utlisateur connecté */
                    if ($scope.detailProfil.preDelegated && $rootScope.currentUser._id === $scope.detailProfil.preDelegated) {
                        $scope.showDeleguer = true;
                    }
                }

                profilsService.getProfilTags($scope.detailProfil.profilID).then(function (data) {
                    $scope.tagsByProfils = data;
                    $scope.regles = [];

                    if (localStorage.getItem('listTags')) {
                        $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
                        $scope.showTags();
                    } else {
                        var requestToSend = {};
                        if (localStorage.getItem('compteId')) {
                            requestToSend = {
                                id: localStorage.getItem('compteId')
                            };
                        }
                        tagsService.getTags(requestToSend).then(function (data) {
                            $scope.listTags = data;
                            localStorage.setItem('listTags', JSON.stringify($scope.listTags));
                            $scope.showTags();
                        });
                    }
                });
            }

        });
    };

    /*
     * Initialiser le detail du profil.
     */
    $scope.initDetailProfil = function () {
        $scope.showDupliquer = false;
        $scope.showEditer = false;
        $scope.showFavouri = false;
        $scope.showDeleguer = false;
        $scope.showPartager = false;


        if (localStorage.getItem('googleShareLink')) {
            // $scope.docApartager = {lienApercu:
            // localStorage.getItem('googleShareLink')}
            $scope.envoiUrl = localStorage.getItem('googleShareLink');
            $scope.attachFacebook();
            $scope.attachGoogle();
            $('#shareModal').modal('show');
            localStorage.removeItem('googleShareLink');
        }

        var dataProfile = {};
        if (localStorage.getItem('compteId')) {
            dataProfile = {
                id: localStorage.getItem('compteId')
            };
        }
        var random = Math.random() * 10000;
        $http.get(configuration.URL_REQUEST + '/profile', {
                params: dataProfile
            })
            .success(function (result) {
                /* Authentifié */
                $rootScope.currentUser = result;
                $scope.showProfilAndTags();
            }).error(function () {
                /* Non authentifié */
                $scope.showFavouri = false;
                $scope.showProfilAndTags();
            });
    };

    /*
     * Ajouter un profil à ses favoris.
     */
    $scope.ajouterAmesFavoris = function () {
        if ($rootScope.currentUser && $scope.detailProfil) {
            var token = {
                id: $rootScope.currentUser.local.token,
                newFav: {
                    userID: $rootScope.currentUser._id,
                    profilID: $scope.detailProfil.profilID,
                    favoris: true,
                    actuel: false,
                    default: false
                }
            };
            $http.post(configuration.URL_REQUEST + '/addUserProfilFavoris', token).success(function (data) {
                $scope.favourite = data;
                $scope.showFavouri = false;
                $('#favoris').fadeIn('fast').delay(5000).fadeOut('fast');
                $rootScope.$broadcast('initCommon');
            });
        }
    };

    /*
     * Accepter la délégation d'un profil.
     */
    $scope.deleguerUserProfil = function () {
        $scope.loader = true;
        $scope.varToSend = {
            profilID: $scope.detailProfil.profilID,
            userID: $scope.detailProfil.owner,
            delegatedID: $rootScope.currentUser._id
        };
        var tmpToSend = {
            id: $rootScope.currentUser.local.token,
            sendedVars: $scope.varToSend
        };
        $http.post(configuration.URL_REQUEST + '/delegateUserProfil', tmpToSend)
            .success(function (data) {
                $scope.delegateUserProfilFlag = data;

                $http.post(configuration.URL_REQUEST + '/findUserById', {
                        idUser: $scope.detailProfil.owner
                    })
                    .success(function (data) {
                        if (data) {
                            var emailTo = data.local.email;
                            var fullName = $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom;
                            $scope.sendVar = {
                                emailTo: emailTo,
                                content: '<span> ' + fullName + ' vient d\'utiliser Accessidys pour accepter la délégation de votre profil : ' + $scope.detailProfil.nom + '. </span>',
                                subject: 'Confirmer la délégation'
                            };
                            $http.post(configuration.URL_REQUEST + '/sendEmail', $scope.sendVar)
                                .success(function () {
                                    $scope.loader = false;
                                    $rootScope.updateListProfile = !$rootScope.updateListProfile;
                                    var profilLink = $location.absUrl();
                                    profilLink = profilLink.substring(0, profilLink.lastIndexOf('#/detailProfil?idProfil'));
                                    profilLink = profilLink + '#/profiles';
                                    $window.location.href = profilLink;
                                }).error(function() {
                                    $scope.loader = false;
                                });
                        }
                    });
            });
    };

    $scope.detailsProfilApartager = function () {
        if (!$rootScope.isAppOnline) {
            $scope.partageInfoDeconnecte();
        } else {
            $('#shareModal').modal('show');
            $scope.socialShare();
        }
    };

    /**
     * Cette fonction permet de récupérer le libellé d'un tag.
     */
    $scope.getTagsDescription = function (tag) {
        if (!$scope.listTags || !$scope.listTags.length) {
            $scope.listTags = JSON.parse(localStorage.getItem('listTags'));
        }
        var listTagsMaps = {};
        angular.forEach($scope.listTags, function (item) {
            listTagsMaps[item._id] = item;
        });
        return listTagsMaps[tag];
    };



    /** **** Fin Detail Profil ***** */
});