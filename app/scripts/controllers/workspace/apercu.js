/* File: apercu.js
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

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId */
/* global PDFJS ,Promise, CKEDITOR, gapi  */
/*jshint unused: false, undef:false */
/* global
 FB
 */
'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $rootScope, $http, $window, $location, $log, $q, $anchorScroll, serviceCheck, configuration, dropbox, verifyEmail, generateUniqueId, storageService, htmlEpubTool, $routeParams, fileStorageService, workspaceService, $timeout, speechService, keyboardSelectionService, $modal, canvasToImage, tagsService) {

    var lineCanvas;

    $scope.idDocument = $routeParams.idDocument;
    $scope.tmp = $routeParams.tmp;
    $scope.url = $routeParams.url;
    $scope.annotationURL = $routeParams.annotation;
    $scope.isEnableNoteAdd = false;
    $scope.showDuplDocModal = false;
    $scope.showRestDocModal = false;
    $scope.showDestination = false;
    $scope.showEmail = false;
    $scope.emailMsgSuccess = '';
    $scope.emailMsgError = '';
    $scope.escapeTest = true;
    $scope.showPartagerModal = true;
    var numNiveau = 0;
    $scope.printPlan = true;

    $('#main_header').show();
    $('#titreDocument').hide();
    $('#detailProfil').hide();
    $('#titreTag').hide();
    $scope.pageBreakElement = '<div style="page-break-after: always"><span style="display: none;">&nbsp;</span></div>';
    $scope.content = [];
    $scope.currentContent = '';
    $scope.currentPage = 0;
    $scope.nbPages = 1;
    $scope.loader = false;
    /* affichage des informations pour la disponibilité de la synthèse vocale. */
    $scope.neverShowBrowserNotSupported = false;
    $scope.neverShowNoAudioRights = false;
    $scope.neverShowOfflineSynthesisTips = false;
    $scope.resizeDocApercu = 'Agrandir';
    $scope.forceApplyRules = true;
    if (!$routeParams.mode || $routeParams.mode === 'lecture')
        $scope.modeImpression = true;
    else if ($routeParams.mode === 'page')
        $scope.modeImpression = false;
    $scope.numeroPageRechercher = 0;

    /**
     * ---------- Functions -----------
     */

    /* fin création de l'éditeur */
    $scope.attachFacebook = function() {
        $('.facebook-share .fb-share-button').remove();
        $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.encodeURI) + '" data-layout="button"></div>');
        try {
            FB.XFBML.parse();
        } catch (ex) {
        }
    };

    /**
     * Force l'application des colorations .
     */
    $scope.forceRulesApply = function(popup) {
        $scope.forceApplyRules = false;
        $timeout(function() {
            $scope.forceApplyRules = true;
        });
    };

    $scope.attachGoogle = function() {
        var options = {
            contenturl : decodeURIComponent($scope.encodeURI),
            contentdeeplinkid : '/pages',
            clientid : '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
            cookiepolicy : 'single_host_origin',
            prefilltext : '',
            calltoactionlabel : 'LEARN_MORE',
            calltoactionurl : decodeURIComponent($scope.encodeURI)
        };

        gapi.interactivepost.render('google-share', options);
    };

    /*
     * Afficher le titre du document.
     */
    $scope.showTitleDoc = function(title) {
        console.log(title);
        $rootScope.titreDoc = title;
        $scope.docName = title;
        $scope.docSignature = title;
        $('#titreDocumentApercu').show();
    };

    /**
     * Affiche la popup de chargement.
     */
    $scope.showLoader = function(msg, callback) {
        $scope.loader = true;
        $scope.loaderMsg = msg;
        $('.loader_cover').show(callback);
    };

    /**
     * Cache la popup de chargement.
     */
    $scope.hideLoader = function() {
        $timeout(function() {
            $scope.loader = false;
            $scope.loaderMsg = '';
            $('.loader_cover').hide();
        }, 1000);
    };

    /*
     * Fixer/Défixer le menu lors du défilement.
     */
    $(window).scroll(function() {
        var dif_scroll = 0;
        if ($('.carousel-inner').offset()) {
            if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
                dif_scroll = $(window).scrollTop() - 160;
                $('.fixed_menu').css('top', dif_scroll + 'px');
            } else {
                $('.fixed_menu').css('top', 0);
            }
        }

    });

    /*
     * Afficher la zone de saisie de l'email.
     */
    $scope.loadMail = function() {
        $scope.showDestination = true;
    };

    /**
     * Initialiser les paramètres du partage d'un document.
     */
    $scope.clearSocialShare = function() {
        $scope.confirme = false;
        $scope.showDestination = false;
        $scope.destinataire = '';
        $scope.addAnnotation = false;
        if (localStorage.getItem('notes') !== null && $scope.idDocument) {
            var noteList = JSON.parse(JSON.parse(localStorage.getItem('notes')));
            $scope.annotationToShare = [];

            if (noteList.hasOwnProperty($scope.idDocument)) {
                $scope.addAnnotation = true;
                $scope.annotationToShare = noteList[$scope.idDocument];
            } else {
                $scope.addAnnotation = false;
            }
        } else {
            $scope.addAnnotation = false;
        }
    };

    /**
     * Partage du document
     */
    $scope.docPartage = function() {
        if (!$rootScope.isAppOnline) {
            var modalInstance = $modal.open({
                templateUrl : 'views/common/informationModal.html',
                controller : 'InformationModalCtrl',
                size : 'sm',
                resolve : {
                    title : function() {
                        return 'Pas d\'accès internet';
                    },
                    content : function() {
                        return 'La fonctionnalité de partage de document nécessite un accès à internet';
                    },
                    reason : function() {
                        return null;
                    },
                    forceClose : function() {
                        return null;
                    }
                }
            });
        } else {
            $('#shareModal').modal('show');
            localStorage.setItem('lockOperationDropBox', true);
            fileStorageService.searchFiles($rootScope.isAppOnline, $scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function(filesFound) {
                if (filesFound && filesFound.length !== 0) {
                    $scope.docApartager = filesFound[0];
                    $scope.docFullName = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec(encodeURIComponent($scope.docApartager.filepath.replace('/', '')))[0]);
                    fileStorageService.shareFile($scope.docApartager.filepath, $rootScope.currentUser.dropbox.accessToken).then(function(shareLink) {
                        $scope.docApartager.lienApercu = configuration.URL_REQUEST + '/#/apercu?url=' + shareLink;
                        $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
                        $scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
                        localStorage.setItem('lockOperationDropBox', false);
                    });
                }
            });
        }
    };

    /**
     * Partage des annotations pour le partage du document
     */
    $scope.processAnnotation = function() {
        localStorage.setItem('lockOperationDropBox', true);
        if ($scope.annotationOk && $scope.docFullName.length > 0 && $scope.annotationToShare !== null) {
            var tmp2 = dropbox.upload($scope.docFullName + '.json', $scope.annotationToShare, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            tmp2.then(function() {
                var shareAnnotations = dropbox.shareLink($scope.docFullName + '.json', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                shareAnnotations.then(function(result) {
                    $scope.docApartager.lienApercu += '&annotation=' + result.url;
                    $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
                    $scope.confirme = true;
                    $scope.attachFacebook();
                    $scope.attachGoogle();
                    localStorage.setItem('lockOperationDropBox', false);

                });
            });
        } else {
            localStorage.setItem('lockOperationDropBox', false);
            $scope.confirme = true;
            $scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
            $scope.attachFacebook();
            $scope.attachGoogle();
        }
    };

    /*
     * Annuler l'envoi d'un email.
     */
    $scope.dismissConfirm = function() {
        $scope.destinataire = '';
    };

    /*
     * Envoyer l'email au destinataire.
     */
    $scope.sendMail = function() {
        $('#confirmModal').modal('hide');
        var docApartager = $scope.encodeURI;
        $scope.loader = true;
        if ($rootScope.currentUser.dropbox.accessToken && configuration.DROPBOX_TYPE && docApartager) {
            $scope.sharedDoc = $scope.docApartager.filename;
            $scope.encodeURI = decodeURIComponent($scope.encodeURI);
            $scope.sendVar = {
                to : $scope.destinataire,
                content : ' a utilisé Accessidys pour partager un fichier avec vous !  ' + $scope.docApartager.lienApercu,
                encoded : '<span> vient d\'utiliser Accessidys pour partager ce fichier avec vous :   <a href=' + $scope.docApartager.lienApercu + '>' + $scope.docApartager.filename + '</a> </span>',
                prenom : $rootScope.currentUser.local.prenom,
                fullName : $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                doc : $scope.sharedDoc
            };
            $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar).then(function() {
                $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                $scope.envoiMailOk = true;
                $scope.destinataire = '';
                $scope.loader = false;
                $scope.showDestination = false;
            }, function() {
                $scope.envoiMailOk = false;
                $scope.loader = false;
            });
        }
    };

    /*
     * Partager un document.
     */
    $scope.socialShare = function() {
        $scope.emailMsgSuccess = '';
        $scope.emailMsgError = '';

        if (!$scope.destinataire || $scope.destinataire.length <= 0) {
            $scope.emailMsgError = 'L\'Email est obligatoire!';
            return;
        }
        if (!verifyEmail($scope.destinataire)) {
            $scope.emailMsgError = 'L\'Email est invalide!';
            return;
        }
        $('#confirmModal').modal('show');
        $('#shareModal').modal('hide');

    };

    /*
     * Initialiser les paramètres du duplication d'un document.
     */
    $scope.clearDupliquerDocument = function() {
        $scope.showMsgSuccess = false;
        $scope.showMsgError = false;
        $scope.msgSuccess = '';
        $scope.showMsgError = '';
        var docUrl = decodeURI($location.absUrl());
        docUrl = docUrl.replace('#/apercu', '');
        $scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
        $('#duplicateDocModal').modal('hide');
    };

    $scope.ete = function() {
        $scope.duplDocTitre = $('#duplDocTitre').val();
    };
    /*
     * Dupliquer un document.
     */
    $scope.dupliquerDocument = function() {

        if ($rootScope.currentUser) {
            $('.loader_cover').show();
            $scope.loaderProgress = 10;
            $scope.showloaderProgress = true;
            $scope.loaderMessage = 'Copie du document en cours. Veuillez patienter ';

            var token = $rootScope.currentUser.dropbox.accessToken;
            var newOwnerId = $rootScope.currentUser._id;
            var url = $location.absUrl();
            url = url.replace('#/apercu', '');
            var filePreview = url.substring(url.lastIndexOf('_') + 1, url.lastIndexOf('.html'));
            var newDocName = $scope.duplDocTitre;

            var manifestName = newDocName + '_' + filePreview + '.appcache';
            var apercuName = newDocName + '_' + filePreview + '.html';
            // var listDocumentDropbox = configuration.CATALOGUE_NAME;
            // $scope.loader = true;
            var msg1 = 'Le document est copié avec succès !';
            var errorMsg1 = 'Le nom du document existe déja!';
            var errorMsg2 = 'Le titre est obligatoire !';
            $scope.msgErrorModal = '';
            $scope.msgSuccess = '';
            $scope.showMsgSuccess = false;
            $scope.showMsgError = false;
            $('#duplDocButton').attr('data-dismiss', 'modal');
            /* Si le titre du document est non renseigné */
            if (!$scope.duplDocTitre || $scope.duplDocTitre.length <= 0) {
                $scope.msgErrorModal = errorMsg2;
                $scope.showMsgError = true;
                $scope.loader = false;
                $scope.showloaderProgress = false;
                $('#duplDocButton').attr('data-dismiss', '');
                return;
            }

            if (!serviceCheck.checkName($scope.duplDocTitre)) {
                $scope.msgErrorModal = 'Veuillez n\'utiliser que des lettres (de a à z) et des chiffres.';
                $scope.loader = false;
                $scope.showMsgError = true;
                $scope.showloaderProgress = false;
                $('#duplDocButton').attr('data-dismiss', '');
                return;
            }
            localStorage.setItem('lockOperationDropBox', true);
            var foundDoc = false;
            var searchApercu = dropbox.search('_' + $scope.duplDocTitre + '_', token, configuration.DROPBOX_TYPE);
            searchApercu.then(function(result) {
                $scope.loaderProgress = 30;
                for (var i = 0; i < result.length; i++) {
                    if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.duplDocTitre + '_') > 0) {
                        foundDoc = true;
                        break;
                    }
                }
                if (foundDoc) {
                    /* Si le document existe déja dans votre Dropbox */
                    $scope.showMsgError = true;
                    $scope.msgErrorModal = errorMsg1;
                    $scope.showloaderProgress = false;
                    $scope.loaderProgress = 100;
                    $scope.loader = false;
                    $('#duplDocButton').attr('data-dismiss', '');
                    $('#duplicateDocModal').modal('show');
                    localStorage.setItem('lockOperationDropBox', false);
                    if ($rootScope.titreDoc === 'Apercu Temporaire') {
                        localStorage.setItem('lockOperationDropBox', true);
                    }
                } else {
                    $scope.showloaderProgress = true;
                    $('.loader_cover').show();
                    // $scope.loader = true;
                    var dateDoc = new Date();
                    dateDoc = dateDoc.getFullYear() + '-' + (dateDoc.getMonth() + 1) + '-' + dateDoc.getDate();
                    apercuName = dateDoc + '_' + apercuName;
                    manifestName = dateDoc + '_' + manifestName;
                    $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(response) {
                        var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), response.data, token, configuration.DROPBOX_TYPE);
                        uploadManifest.then(function(result) {
                            $scope.loaderProgress = 50;
                            if (result) {
                                var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                shareManifest.then(function(result) {
                                    $scope.loaderProgress = 70;
                                    if (result) {
                                        var urlManifest = result.url;
                                        $http.get(($scope.url || url)).then(function(resDocDropbox) {
                                            $scope.loaderProgress = 80;
                                            var docDropbox = resDocDropbox.data;
                                            docDropbox = docDropbox.replace(docDropbox.substring(docDropbox.indexOf('manifest="'), docDropbox.indexOf('.appcache"') + 10), 'manifest="' + urlManifest + '"');
                                            docDropbox = docDropbox.replace('ownerId = \'' + ownerId + '\'', 'ownerId = \'' + newOwnerId + '\'');
                                            var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), docDropbox, token, configuration.DROPBOX_TYPE);
                                            uploadApercu.then(function(result) {
                                                $scope.loaderProgress = 85;
                                                var listDocument = result;
                                                var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                shareApercu.then(function(result) {
                                                    $scope.loaderProgress = 90;
                                                    localStorage.setItem('lockOperationDropBox', false);
                                                    if ($rootScope.titreDoc === 'Apercu Temporaire') {
                                                        localStorage.setItem('lockOperationDropBox', true);
                                                    }
                                                    if (result) {
                                                        $scope.docTitre = '';
                                                        listDocument.lienApercu = result.url + '#/apercu';
                                                        $scope.loaderProgress = 100;
                                                        $scope.showloaderProgress = false;
                                                        $scope.loader = false;
                                                        $scope.showMsgSuccess = true;
                                                        $scope.msgSuccess = msg1;
                                                        $('#duplDocButton').attr('data-dismiss', '');
                                                        $('#duplicateDocModal').modal('show');
                                                    }
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    };

    /**
     * ---------- Process Annotation -----------
     */

    $scope.checkAnnotations = function() {
        if ($scope.annotationURL) {
            $http.get($scope.annotationURL).success(function(data) {
                var noteList = {};
                var annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($scope.annotationURL)[9]);
                $scope.docSignature = annotationKey;
                if (localStorage.getItem('notes') !== null) {
                    noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                    noteList[annotationKey] = data;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                } else {
                    noteList = {};
                    noteList[annotationKey] = data;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                }
                $scope.restoreNotesStorage();
            });

        }
    };

    $scope.applySharedAnnotation = function() {
        if ($scope.annotationURL) {
            $http.get($scope.annotationURL).success(function(data) {
                var annotationKey = $scope.annotationDummy;
                var noteList = {};

                annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($scope.annotationURL)[0]);
                if (localStorage.getItem('notes') !== null) {
                    noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                    noteList[annotationKey] = data;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                } else {
                    noteList = {};
                    noteList[annotationKey] = data;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                }
                $('#AnnotationModal').modal('hide');

            });
        }
    };

    /* Debut Gestion des annotations dans l'apercu */
    $scope.notes = [];
    $scope.printModeNotes = [];
    /*
     * Dessiner les lignes de toutes les annotations.
     */
    $scope.drawLine = function() {
        if (!$scope.modeImpression) {
            var x, y, xLink, yLink;
            if (!lineCanvas) {
                // set the line canvas to the width and height of the carousel
                lineCanvas = $('#line-canvas');
                $('#line-canvas').css({
                    position : 'absolute',
                    width : $('#carouselid').width(),
                    height : $('#carouselid').height()
                });
            }
            $('#line-canvas div').remove();
            if ($scope.notes.length > 0) {
                for (var i = 0; i < $scope.notes.length; i++) {
                    // invariant quelques soit le mode de consultation
                    if ($scope.notes[i].idPage === $scope.currentPage) {
                        xLink = $scope.notes[i].xLink + 65;
                        x = $scope.notes[i].x;
                        yLink = $scope.notes[i].yLink + 25;
                        y = $scope.notes[i].y + 20;
                        // déssiner
                        lineCanvas.line(xLink, yLink, x, y, {
                            color : '#747474',
                            stroke : 1,
                            zindex : 10
                        });
                    }
                }
            }
        }
        /*
         * else { $scope.drawLineForPrintMode(); }
         */
    };

    /*
     * Dessiner les lignes de toutes les annotations du mode impression.
     */
    $scope.drawLineForPrintMode = function() {
        return $timeout(function() {
            if (!lineCanvas) {
                // set the line canvas to the width and height of the carousel
                lineCanvas = $('#line-canvas');
                lineCanvas.css({
                    position : 'absolute',
                    width : $('#carouselid').width(),
                    height : $('#carouselid').height()
                });
            }
            $('#line-canvas div').remove();
            $scope.printModeNotes = angular.copy($scope.notes);
            var MAGIC_X = 42, MAGIC_Y = 38, adaptContent, noteContainer;
            angular.forEach($scope.printModeNotes, function(note) {
                adaptContent = angular.element('#adapt-content-' + note.idPage);
                noteContainer = angular.element('#note-container-' + note.idPage);
                // adjust coordonate for absolute canvas line drawing
                note.xLinkLine = note.xLink + 65;
                note.yLinkLine = adaptContent.height() + note.yLink + 25 + MAGIC_Y;
                note.xLine = note.x;
                note.yLine = adaptContent.height() + note.y + 20 + MAGIC_Y;

                // notes coordinates adjustments for relative positioning
                note.yLink -= MAGIC_Y;
                note.x -= adaptContent.width() + MAGIC_X;
                note.xLink -= adaptContent.width() + MAGIC_X;
                note.position = 'relative';
                note.linkPosition = 'relative';

                // adjusting the note containers
                noteContainer.css({
                    height : adaptContent.height(),
                    top : 42,
                    position : 'relative'
                });

            });
            // draw
            if ($scope.notes.length > 0) {
                angular.forEach($scope.printModeNotes, function(note) {
                    // var lineCanvas = $('#line-canvas-' + note.idPage);
                    lineCanvas.line(note.xLinkLine, note.yLinkLine, note.xLine, note.yLine, {
                        color : '#747474',
                        stroke : 1,
                        zindex : 10
                    });

                });
            }
        });
    };

    /*
     * Récuperer la liste des annotations de localStorage et les afficher dans
     * l'apercu.
     */
    $scope.restoreNotesStorage = function( /* idx */) {
        $scope.notes = workspaceService.restoreNotesStorage($scope.docSignature);
        $scope.drawLine();
    };

    /*
     * Retourner le numero de l'annotation suivante.
     */

    function getNoteNextID() {
        if (!$scope.notes.length) {
            return (1);
        }
        var lastNote = $scope.notes[$scope.notes.length - 1];
        return (lastNote.idInPage + 1);
    }

    /*
     * Ajouter une annotation dans la position (x,y).
     */
    $scope.addNote = function(x, y) {
        var idNote = generateUniqueId();
        var idInPage = getNoteNextID();
        var adaptContent = angular.element('.adaptContent');
        var defaultX = adaptContent.width() + 50;
        // var defaultW = defaultX + $('#noteBlock2').width();
        var defaultY = y + parseInt(adaptContent.css('margin-top'));
        if (defaultY < 0) {
            defaultY = 0;
        }
        var newNote = {
            idNote : idNote,
            idInPage : idInPage,
            idDoc : $scope.docSignature,
            idPage : $scope.currentPage,
            texte : 'Note',
            x : defaultX,
            y : defaultY,
            xLink : x + 44, // light adjustment to match the pointy part of
            // the
            // link image
            yLink : defaultY
        };

        // texte: 'Note ' + idInPage,
        // newNote.styleNote = '<p ' + $scope.styleAnnotation + '> ' +
        // newNote.texte + ' </p>';

        $scope.notes.push(newNote);
        $scope.drawLine();

        var notes = [];
        var mapNotes = {};
        if (localStorage.getItem('notes')) {
            mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
            if (mapNotes.hasOwnProperty($scope.docSignature)) {
                notes = mapNotes[$scope.docSignature];
            }
        }
        notes.push(newNote);
        mapNotes[$scope.docSignature] = notes;
        var element = [];
        element.push({
            name : 'notes',
            value : JSON.stringify(angular.toJson(mapNotes))
        });
        var t = storageService.writeService(element, 0);
        t.then(function(data) {
        });
        // localStorage.setItem('notes',
        // JSON.stringify(angular.toJson(mapNotes)));
    };

    /*
     * Supprimer l'annotation de localStorage.
     */
    $scope.removeNote = function(note) {
        var index;
        for (var y = 0; y < $scope.notes.length; y++) {
            if ($scope.notes[y].idNote === note.idNote && $scope.notes[y].idInPage === note.idInPage && $scope.notes[y].idPage === note.idPage) {
                index = y;
                break;
            }
        }
        $scope.notes.splice(index, 1);
        $scope.drawLine();

        var notes = [];
        var mapNotes = {};
        if (localStorage.getItem('notes')) {
            mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
            notes = mapNotes[$scope.docSignature];
            var idx = -1;
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].idNote === note.idNote) {
                    idx = i;
                    break;
                }
            }
            notes.splice(idx, 1);
            if (notes.length > 0) {
                mapNotes[$scope.docSignature] = notes;
            } else {
                delete mapNotes[$scope.docSignature];
            }
            localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        }
    };

    $scope.styleDefault = 'data-font="" data-size="" data-lineheight="" data-weight="" data-coloration=""';

    /*
     * Fonction déclanchée lors du collage du texte dans l'annotation.
     */
    $scope.setPasteNote = function($event) {
        /* Le texte recuperé du presse-papier est un texte brute */
        if ($scope.testEnv === false) {
            document.execCommand('insertText', false, $event.originalEvent.clipboardData.getData('text/plain'));
            $event.preventDefault();
        }
        $scope.pasteNote = true;
    };

    $scope.prepareNote = function(note, $event) {
        var currentAnnotation = $($event.target);
        currentAnnotation.attr('contenteditable', 'true');
        currentAnnotation.css('line-height', 'normal');
        currentAnnotation.css('font-family', 'helveticaCND, arial');

        /*
         * var isPlaceHolder = note.texte.match(/Note/g); if (isPlaceHolder) {
         * note.styleNote = '<p></p>'; } else { note.styleNote = '<p>' +
         * note.texte + '</p>'; }
         */
        currentAnnotation.removeClass('edit_status');
        currentAnnotation.addClass('save_status');
    };

    $scope.autoSaveNote = function(note, $event) {
        var currentAnnotation = angular.element($event.target);
        note.texte = currentAnnotation.html();
        $scope.editNote(note);
    };

    /*
     * Modifier une annotation.
     */
    $scope.editNote = function(note) {
        var notes = [];
        var mapNotes = {};
        if (localStorage.getItem('notes')) {
            mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
            notes = mapNotes[$scope.docSignature];
        }
        for (var i = 0; i < notes.length; i++) {
            if (notes[i].idNote === note.idNote) {
                if ($scope.modeImpression) {
                    notes[i].texte = note.texte;
                    // modifié aussi la liste de note déjà préchargé à travers
                    // restoreNote.
                    $scope.notes[i].texte = note.texte;
                } else {
                    notes[i] = note;
                    $scope.notes[i] = note;
                }
                mapNotes[$scope.docSignature] = notes;
                localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
                break;
            }
        }
    };

    /*
     * Permettre d'ajouter une annotation.
     */
    $scope.enableNoteAdd = function() {
        $scope.isEnableNoteAdd = true;
    };

    /*
     * Ajouter une annotation dans l'apercu lors du click mode consultation.
     */
    $scope.addNoteOnClick = function(event, index) {
        if ($scope.isEnableNoteAdd && ((!$scope.modeImpression && $scope.currentPage && $scope.currentPage !== 0) || ($scope.modeImpression && index !== 0))) {
            if ($('.open_menu').hasClass('shown')) {
                $('.open_menu').removeClass('shown');
                $('.open_menu').parent('.menu_wrapper').animate({
                    'margin-left' : '160px'
                }, 100);
                $('.zoneID').css('z-index', '9');
            }

            var parentOffset = $(event.currentTarget).offset();
            var relX = event.pageX - parentOffset.left - 30;
            var relY = event.pageY - parentOffset.top - 40;
            if ($scope.modeImpression) {
                $scope.currentPage = index;
            }
            $scope.addNote(relX, relY);
            $scope.isEnableNoteAdd = false;
        }
    };

    /*
     * Réduire/Agrandir une annotation.
     */
    $scope.collapse = function($event) {
        if (angular.element($event.target).parent('td').prev('.annotation_area').hasClass('opened')) {
            angular.element($event.target).parent('td').prev('.annotation_area').removeClass('opened');
            angular.element($event.target).parent('td').prev('.annotation_area').addClass('closed');
            angular.element($event.target).parent('td').prev('.annotation_area').css('height', 36 + 'px');
        } else {
            angular.element($event.target).parent('td').prev('.annotation_area').removeClass('closed');
            angular.element($event.target).parent('td').prev('.annotation_area').addClass('opened');
            angular.element($event.target).parent('td').prev('.annotation_area').css('height', 'auto');
        }
    };

    /**
     * ---------- Process Navigation OK -----------
     */

    /*
     * Aller au Slide de position id.
     */
    $scope.setActive = function(event, id, block) {
        $scope.setPage(id);
        // scroll sans angular et quand la page est rendue car Angular
        // raffraichit la page si location.path change
        $timeout(function() {
            document.getElementById(block).scrollIntoView();
        });
    };

    /*
     * Afficher/Masquer le menu escamotable.
     */
    $scope.afficherMenu = function() {
        if ($('.open_menu').hasClass('shown')) {
            $('.open_menu').removeClass('shown');
            $('.open_menu').parent('.menu_wrapper').animate({
                'margin-left' : '160px'
            }, 100);
            $('.zoneID').css('z-index', '9');

        } else {
            $('.open_menu').addClass('shown');
            $('.open_menu').parent('.menu_wrapper').animate({
                'margin-left' : '0'
            }, 100);
            $('.zoneID').css('z-index', '8');
        }
    };

    /**
     * Aller à la page pageIndex
     */
    $scope.setPage = function(pageIndex) {
        if (pageIndex >= 0 && pageIndex < $scope.content.length) {
            $scope.currentPage = pageIndex;
            $scope.currentContent = $scope.content[$scope.currentPage];
            $scope.numeroPageRechercher = pageIndex;
            $scope.drawLine();
            window.scroll(0, 0);
            $scope.forceRulesApply();
        }
    };

    /**
     * Aller au precedent.
     */
    $scope.precedent = function() {
        $scope.setPage($scope.currentPage - 1);
    };

    /**
     * Aller au suivant.
     */
    $scope.suivant = function() {
        $scope.setPage($scope.currentPage + 1);
    };

    /**
     * Aller au dernier.
     */
    $scope.dernier = function() {
        $scope.setPage($scope.content.length - 1);
    };

    /*
     * Aller au premier.
     */
    $scope.premier = function() {
        $scope.setPage(1);
    };

    /**
     * Aller au plan.
     */
    $scope.plan = function() {
        $scope.setPage(0);
    };

    /**
     * ---------- Process Print -----------
     */

    /*
     * Initialiser les pages de début et fin lors de l'impression.
     */
    $scope.selectionnerMultiPage = function() {
        $scope.pageA = 1;
        $scope.pageDe = 1;
        $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text('1');
        $('select[data-ng-model="pageA"]').val(1);
        $('select[data-ng-model="pageDe"] + .customSelect .customSelectInner').text('1');
        $('select[data-ng-model="pageDe"]').val(1);
    };

    /*
     * Selectionner la page de début pour l'impression.
     */
    $scope.selectionnerPageDe = function() {

        $scope.pageDe = parseInt($('select[data-ng-model="pageDe"]').val());
        $scope.pageA = parseInt($('select[data-ng-model="pageA"]').val());

        if ($scope.pageDe > $scope.pageA) {
            $scope.pageA = $scope.pageDe;
            $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text($scope.pageA);
            $('select[data-ng-model="pageA"]').val($scope.pageA);
        }

        var pageDe = parseInt($scope.pageDe);
        $('select[data-ng-model="pageA"] option').prop('disabled', false);

        for (var i = 0; i <= pageDe - 1; i++) {
            $('select[data-ng-model="pageA"] option').eq(i).prop('disabled', true);
        }
    };

    var PRINTMODE = {
        EVERY_PAGES : 0,
        CURRENT_PAGE : 1,
        MULTIPAGE : 2
    };

    /*
     * Imprimer le document selon le mode choisi.
     */
    $scope.printByMode = function() {

        fileStorageService.saveTempFileForPrint($scope.content).then(function(data) {

            workspaceService.saveTempNotesForPrint($scope.notes);

            var printPlan = $scope.printPlan ? 1 : 0;

            var printURL = '#/print?documentId=' + $scope.docSignature + '&plan=' + printPlan + '&mode=' + $scope.printMode;
            if ($scope.printMode === PRINTMODE.CURRENT_PAGE) {
                printURL += ('&page=' + $scope.currentPage);
            } else if ($scope.printMode === PRINTMODE.MULTIPAGE) {
                printURL += ('&pageDe=' + $scope.pageDe + '&pageA=' + $scope.pageA);
            }
            $window.open(printURL);
        }, function(err) {
            throw (err);
        });
    };

    /**
     * ---------- Process Génération du document -----------
     */

    /**
     * ---------- Process Peuplement -----------
     */

    /**
     * Convertion du base64 en en Uint8Array
     *
     * @param base64
     *            le binaire à convertir
     * @method $scope.base64ToUint8Array
     */
    $scope.base64ToUint8Array = function(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    };

    /**
     * Charge les pages du pdf en tant qu'image dans l'éditeur
     *
     * @param pdf
     *            le le pdf à charger
     * @param le
     *            numéro de la page à partir de laquelle charger le pdf
     * @method $scope.loadPdfPage
     */
    $scope.loadPdfPage = function(pdf, pageNumber) {
        return pdf.getPage(pageNumber).then(function(page) {
            $('#canvas').remove();
            $('body').append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width); // page.getViewport(1.5);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext : context,
                viewport : viewport
            };
            page.render(renderContext).then(function(error) {
                if (error) {
                    $scope.hideLoader();
                    $scope.$apply();
                    console.log(error);
                } else {
                    new Promise(function(resolve) {
                        var dataURL = canvasToImage(canvas, context, '#FFFFFF');
                        if (dataURL) {
                            $scope.pdfTohtml.push('<img src="' + dataURL + '" />');
                            pageNumber++;
                            if (pageNumber <= pdf.numPages) {
                                $scope.pdfTohtml.push($scope.pageBreakElement);
                                $scope.loadPdfPage(pdf, pageNumber);
                            } else {
                                var resultClean = $scope.pdfTohtml.filter(function(element) {
                                    return !!element;
                                });
                                resultClean = resultClean.join(' ');
                                // Applatissement du DOM via CKeditor
                                var ckConfig = {};
                                ckConfig.on = {
                                    instanceReady : function() {
                                        var editor = CKEDITOR.instances.virtualEditor;
                                        editor.setData(resultClean);
                                        var html = editor.getData();
                                        $scope.$apply(function() {
                                            $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                                            $scope.premier();
                                        });
                                    }
                                };
                                $timeout($scope.destroyCkeditor());
                                CKEDITOR.inline('virtualEditor', ckConfig);
                                window.scrollTo(0, 0);
                                $scope.hideLoader();
                                $scope.showTitleDoc($scope.url);
                                $scope.restoreNotesStorage();
                                $scope.checkAnnotations();
                            }
                            resolve();
                            $scope.$apply();
                        }
                    });
                }
            });
        });
    };

    /**
     * Cette fonction permet de traiter un pdf par la bookmarklet.
     */
    $scope.loadPdfByLien = function(url) {
        var contains = (url.indexOf('https') > -1); // true
        if (contains === false) {
            $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
        } else {
            $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
        }
        $http.post($scope.serviceNode, {
            lien : url,
            id : localStorage.getItem('compteId')
        }).success(function(data) {
            var pdfbinary = $scope.base64ToUint8Array(data);
            PDFJS.getDocument(pdfbinary).then(function(pdf) {
                $scope.pdfTohtml = [];
                $scope.loadPdfPage(pdf, 1);
            });
        }).error(function() {
            $scope.hideLoader();
        });
    };

    /**
     * Récupération du contenu html d'une page
     *
     * @method $scope.getHTMLContent
     * @param {String}
     *            url
     * @return Promise
     */
    $scope.getHTMLContent = function(url) {
        $scope.initDone = false;
        // encodage de l'url avant l'envoi sinon le service n'accepte pas les
        // accents
        return serviceCheck.htmlPreview(encodeURI(url)).then(htmlEpubTool.cleanHTML).then(function(resultClean) {
            // Applatissement du DOM via CKeditor
            var ckConfig = {};
            ckConfig.on = {
                instanceReady : function() {
                    var editor = CKEDITOR.instances.virtualEditor;
                    editor.setData(resultClean);
                    var html = editor.getData();
                    $scope.$apply(function() {

                        // if is guest then load admin profiles
                        if($rootScope.isGuest) {
                            $http.post(configuration.URL_REQUEST + '/findAdmin').then(function(result) {
                                localStorage.setItem('compteId', result.data._id);
                                return tagsService.getTags().then(function(resultTags) {
                                    localStorage.setItem('listTags', JSON.stringify(resultTags));
                                    $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                                    $scope.premier();
                                });
                            });
                        } else {
                            $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                            $scope.premier();
                        }

                    });

                }
            };
            $timeout($scope.destroyCkeditor());
            CKEDITOR.inline('virtualEditor', ckConfig);
        }, function(err) {
            $scope.technicalError = err;// ;'<p>Le document n\'a pas pu être
            // chargé.</p>';
            angular.element('#technicalErrorModal').modal('show');
        });
    };

    /**
     * Récupération du contenu html d'un doc
     *
     * @method $scope.getDocContent
     * @param {String}
     *            idDocument
     * @return Promise
     */
    $scope.getDocContent = function(idDocument) {
        var deferred = $q.defer();
        serviceCheck.getData().then(function(result) {
            var token = '';
            if (result.user && result.user.dropbox) {
                token = result.user.dropbox.accessToken;
            }
            return fileStorageService.getFile($rootScope.isAppOnline, idDocument, token);
        }).then(function(data) {
            if (data === null) {
                deferred.reject();
            } else {
                var content = workspaceService.parcourirHtml(data);
                deferred.resolve(content);
            }
        });

        return deferred.promise;
    };

    /**
     * Récupération du contenu html tmp depuis le localStorage
     *
     * @method $scope.getTmpContent
     * @return Promise
     */
    $scope.getTmpContent = function() {
        return fileStorageService.getTempFile().then(function(data) {
            $scope.content = workspaceService.parcourirHtml(data);
            $scope.forceRulesApply();
        });
    };

    /**
     * Ouvre le document dans l'éditeur
     *
     * @method $scope.editer
     */
    $scope.editer = function() {
        $window.location.href = configuration.URL_REQUEST + '/#/addDocument?idDocument=' + $scope.idDocument;
    };

    /**
     * Cette fonction charge une image par la bookmarklet
     */
    $scope.loadPictureByLink = function(url) {
        var resultClean = '<img src="' + url + '">';
        // Applatissement du DOM via CKeditor
        var ckConfig = {};
        ckConfig.on = {
            instanceReady : function() {
                var editor = CKEDITOR.instances.virtualEditor;
                editor.setData(resultClean);
                var html = editor.getData();
                $scope.$apply(function() {
                    $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                    $scope.premier();
                });

            }
        };
        $timeout($scope.destroyCkeditor());
        CKEDITOR.inline('virtualEditor', ckConfig);
        $scope.hideLoader();
        $scope.showTitleDoc($scope.url);
        $scope.restoreNotesStorage();
        $scope.checkAnnotations();
    };

    /**
     * Génère le document en fonction de l'url ou de l'id du doc
     *
     * @method $scope.init
     */
    $scope.init = function() {
        $scope.showLoader('Chargement du document en cours.');
        // Recuperation du choix d'affichage de l'astuce d'installation
        // des voix en offline
        $scope.neverShowOfflineSynthesisTips = localStorage.getItem('neverShowOfflineSynthesisTips') === 'true';

        // Supprime l'editeur
        $scope.destroyCkeditor();

        $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');

        // Désactive la creation automatique des editeurs inline
        $scope.disableAutoInline();

        $scope.currentPage = 0;

        // Apercu d'une Url
        if ($scope.url) {
            var parser = document.createElement('a');
            parser.href = decodeURIComponent($scope.url);
            $scope.urlHost = parser.hostname;
            if($scope.urlHost && parser.href.indexOf('https') > -1) {
                $scope.urlPort = 443;
            } else {
                $scope.urlPort = 80;
            }
            $scope.url = decodeURIComponent($scope.url);
            // dans le cas d'une url d'accès à un pdf.
            if ($scope.url.endsWith('.pdf')) {
                $scope.loadPdfByLien($scope.url);
            } else if ($scope.url.endsWith('.png') || $scope.url.endsWith('.jpg') || $scope.url.endsWith('.jpeg')) {
                $scope.loadPictureByLink($scope.url);
            } else {
                $scope.getHTMLContent($scope.url).then(function() {
                    $scope.hideLoader();
                    $scope.showTitleDoc($scope.url);
                    $scope.restoreNotesStorage();
                    $scope.checkAnnotations();
                }, function() {
                    $scope.hideLoader();
                });
            }
        }

        // Apercu depuis un doc
        if ($scope.idDocument) {
            var contentGet = $scope.getDocContent($scope.idDocument);
            contentGet.then(function(data) {
                $scope.content = data;
                $scope.showTitleDoc($scope.idDocument);
                $scope.showEditer = true;
                $scope.premier();
                $scope.hideLoader();
                $scope.restoreNotesStorage();
            }, function() {
                $scope.hideLoader();
                $scope.affichageInfoDeconnecte();
            });
        }

        // Apercu temporaire
        if ($scope.tmp) {
            $scope.getTmpContent().then(function() {
                $scope.showTitleDoc('Aperçu Temporaire');
                $scope.premier();
                $scope.hideLoader();
            }, function() {
                $scope.hideLoader();
            });
        }
    };

    /**
     * Lecture du texte sélectionné
     *
     * @method $scope.speak
     */
    $scope.speak = function() {
        speechService.stopSpeech();
        $timeout(function() {
            var text = $scope.getSelectedText();
            if (text && !/^\s*$/.test(text)) {
                $scope.checkAudioRights().then(function(audioRights) {
                    if (audioRights && $scope.checkBrowserSupported()) {
                        serviceCheck.isOnline().then(function() {
                            $scope.displayOfflineSynthesisTips = false;
                            speechService.speech(text, true);
                            window.document.addEventListener('click', $scope.stopSpeech, false);
                        }, function() {
                            $scope.displayOfflineSynthesisTips = !$scope.neverShowOfflineSynthesisTips;
                            speechService.speech(text, false);
                        });
                    }
                });
            }
        }, 10);
    };

    $scope.stopSpeech = function(e) {
        speechService.stopSpeech();
        window.document.removeEventListener('click', $scope.stopSpeech, false);
    };

    /**
     * Lecture du texte sélectionné par le clavier
     *
     * @method $scope.speakspeakOnKeyboard
     */
    $scope.speakOnKeyboard = function(event) {
        if (keyboardSelectionService.isSelectionCombination(event)) {
            $scope.speak();
        }
    };

    /**
     * Vérifie que le navigateur supporte la synthèse vocale. S'il ne le
     * supporte pas alors un message est affiché à l'utilisateur.
     *
     * @method $scope.checkBrowserSupported
     */
    $scope.checkBrowserSupported = function() {
        var browserSupported = speechService.isBrowserSupported();
        if (!browserSupported && !$scope.neverShowBrowserNotSupported) {
            $scope.displayBrowserNotSupported = true;
        } else {
            $scope.displayBrowserNotSupported = false;
        }
        return browserSupported;
    };

    /**
     * Vérifie que l'utilisateur a le droit d'utiliser la synthèse vocale.
     *
     * @method $scope.checkAudioRights
     */
    $scope.checkAudioRights = function() {
        return serviceCheck.getData().then(function(statusInformation) {
            if (statusInformation.user && statusInformation.user.local && statusInformation.user.local.authorisations) {
                $scope.displayNoAudioRights = !statusInformation.user.local.authorisations.audio && !$scope.neverShowNoAudioRights;
                return statusInformation.user.local.authorisations.audio;
            } else {
                $scope.displayNoAudioRights = false;
                return true;
            }
        }, function() {
            $scope.displayNoAudioRights = false;
            return true;
        });
    };

    /**
     * Ferme le message indiquant le navigateur n'est pas supporté.
     *
     * @method $scope.closeBrowserNotSupported
     */
    $scope.closeBrowserNotSupported = function() {
        $scope.displayBrowserNotSupported = false;
    };

    /**
     * Ferme le message indiquant que l'utilisateur n'a pas les droits pour la
     * synthèse vocale
     *
     * @method $scope.closeNoAudioRights()
     */
    $scope.closeNoAudioRights = function() {
        $scope.displayNoAudioRights = false;
    };

    /**
     * Ferme l'astuce pour l'installation de voix en mode déconnecté
     *
     * @method $scope.closeOfflineSynthesisTips
     */
    $scope.closeOfflineSynthesisTips = function() {
        $scope.displayOfflineSynthesisTips = false;
        localStorage.setItem('neverShowOfflineSynthesisTips', $scope.neverShowOfflineSynthesisTips);
    };

    /**
     * Vérifie lors d'un clic sur un lien que l'utilisateur est en mode
     * connecté. S'il est en mode déconnecté alors une popup s'affiche lui
     * indiquant que la navigation adaptée n'est pas disponible.
     *
     * @method $scope.checkLinkOffline
     * @param event
     *            l'évènement du clic
     */
    $scope.checkLinkOffline = function(event) {
        if (event.target && event.target.nodeName === 'A' && !$rootScope.isAppOnline) {
            $modal.open({
                templateUrl : 'views/common/informationModal.html',
                controller : 'InformationModalCtrl',
                size : 'sm',
                resolve : {
                    title : function() {
                        return 'Pas d\'accès internet';
                    },
                    content : function() {
                        return 'La navigation adaptée n\'est pas disponible sans accès internet.';
                    },
                    reason : function() {
                        return null;
                    },
                    forceClose : function() {
                        return null;
                    }
                }
            });
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    };

    /**
     * Récupération du texte sélectionné
     *
     * @method $scope.getSelectedText
     */
    $scope.getSelectedText = function() {
        var text = '';
        if ($window.getSelection) {
            text = $window.getSelection().toString();
        } else if (document.selection && document.selection.type !== 'Control') {
            text = document.selection.createRange().text;
        }
        return text;
    };

    /**
     * Desactivation de la creation automatique des editeurs inline
     *
     * @method $scope.disableAutoInline
     */
    $scope.disableAutoInline = function() {
        CKEDITOR.disableAutoInline = true;
    };

    /**
     * Supprime l'instance de ckeditor utilisee pour formater l'html
     *
     * @method $scope.destroyCkeditor
     */
    $scope.destroyCkeditor = function() {
        for ( var name in CKEDITOR.instances) {
            if (CKEDITOR.instances[name]) {
                if (CKEDITOR.instances[name].filter) {
                    CKEDITOR.instances[name].destroy(true);
                } else {
                    CKEDITOR.remove(CKEDITOR.instances[name]);
                }
                delete CKEDITOR.instances[name];
            }
        }
    };

    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que l'affichage du
     * document est indisponible en mode déconnecté
     *
     * @method $partageInfoDeconnecte
     */
    $scope.affichageInfoDeconnecte = function() {
        var modalInstance = $modal.open({
            templateUrl : 'views/common/informationModal.html',
            controller : 'InformationModalCtrl',
            size : 'sm',
            resolve : {
                title : function() {
                    return 'Pas d\'accès internet';
                },
                content : function() {
                    return 'L\'affichage de ce document nécessite au moins un affichage préalable via internet.';
                },
                reason : function() {
                    return '/listDocument';
                },
                forceClose : function() {
                    return null;
                }
            }
        });
    };

    /**
     * Vérifie si le user est authentifié(en mode connecté ou en mode
     * déconnecté) avant de générer l'aperçu
     *
     * @method $scope.getUserAndInitApercu
     */

    $scope.getUserAndInitApercu = function() {
        var url = $routeParams.url;
        // le cas d'un document partagé ref: CNED-383
        if (url && url.indexOf('dropboxusercontent') > -1) {
            $scope.init();
        } else {
            serviceCheck.getData().then(function() {
                if ($rootScope.loged === true) {
                    $scope.init();
                }
            });
        }
    };

    $rootScope.$on('profilChanged', function() {
        $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
    });

    // réduit ou agrandit la page aperçu du document
    $scope.resizeApercu = function() {
        if ($scope.resizeDocApercu === 'Agrandir') {
            $scope.resizeDocApercu = 'Réduire';
            $('.header_zone').slideUp(300, function() {
            });

        } else {
            $scope.resizeDocApercu = 'Agrandir';
            $('.header_zone').slideDown(300, function() {
            });
        }
    };

    $scope.openDocumentListModal = function() {
        $modal.open({
            templateUrl : 'views/listDocument/listDocumentModal.html',
            controller : 'listDocumentModalCtrl',
            size : 'md',
            resolve : {
                title : function() {
                    return 'Pas d\'accès internet';
                },
                content : function() {
                    return 'L\'affichage de ce document nécessite au moins un affichage préalable via internet.';
                },
                reason : function() {
                    return '/listDocument';
                },
                forceClose : function() {
                    return null;
                }
            }
        });
    };

    $scope.switchModeAffichage = function() {
        var tmp = $location.url().indexOf('&mode');
        var refresh;
        if (tmp !== -1) {
            refresh = $location.url().substring(0, tmp);
        } else {
            refresh = $location.url();
        }
        if (!$scope.modeImpression) {
            $routeParams.mode = 'lecture';
            refresh += '&mode=lecture';
            $scope.modeImpression = true;
        } else {
            $routeParams.mode = 'page';
            refresh += '&mode=page';
            $scope.modeImpression = false;
        }
        if (!$scope.testEnv) {
            $location.url(refresh);
        }
    };

    $scope.fermerApercu = function() {
        if (!$scope.tmp) {
            $location.path('/');
        } else {
            // affichage popup bloquante de fermeture de l'aperçu du document.
            $modal.open({
                templateUrl : 'views/common/informationModal.html',
                controller : 'InformationModalCtrl',
                size : 'sm',
                backdrop : false,
                resolve : {
                    title : function() {
                        return 'Fermeture!';
                    },
                    content : function() {
                        return 'Pour fermer l\'aperçu du document, veuillez fermer la fenêtre.';
                    },
                    reason : function() {
                        return null;
                    },
                    forceClose : function() {
                        return true;
                    }
                }
            });
        }
    };

    $scope.getUserAndInitApercu();
});
