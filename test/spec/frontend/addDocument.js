/* File: addDocument.js
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
/* global spyOn:false */

describe('Controller:AddDocumentCtrl', function() {
	var $scope, controller, fileStorageService, q, deferred;

	var doc = {
		titre: 'Document 01'
	};

	beforeEach(function(){
		fileStorageService = {
            saveTempFile : function(data) {
                deferred = q.defer();
                // Place the fake return object here
                if (data === '<p>test</p>') {
                    deferred.resolve({});
                } else {
                    deferred.reject({error : 'une erreur est survenue'});
                }
                return deferred.promise;
            }
        };
    spyOn(fileStorageService, 'saveTempFile').andCallThrough();
	});

	beforeEach(module('cnedApp'));

	beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $q) {
		q = $q;
		$scope = $rootScope.$new();
		controller = $controller('AddDocumentCtrl', {
			$scope: $scope,
      fileStorageService: fileStorageService
		});
		$scope.testEnv = true;

		$scope.mail = {
			to: 'test@test.com',
			content: 'Je viens de partager avec vous le lien suivant : dropbox.com',
			encoded: '<div>Je viens de partager avec vous le lien suivant : dropbox.com</div>'
		};

		$scope.sharedDoc = 'test.pdf';

		$scope.docApartager = {
			lienApercu: 'dropbox.com'
		};
		$rootScope.myUser = {
			dropbox: {
				accessToken: 'K79U_9sinzkAAAAAAAAAAXOOOO-ShukKKOSFG6tVhO645bUwaYER2g7bN3eHuQsS'
			}
		};

		$rootScope.currentUser = {
			__v: 0,
			_id: '5329acd20c5ebdb429b2ec66',
			dropbox: {
				accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
				country: 'MA',
				display_name: 'youbi anas',
				emails: 'anasyoubi@gmail.com',
				referral_link: 'https://db.tt/wW61wr2c',
				uid: '264998156'
			},
			local: {
				email: 'anasyoubi@gmail.com',
				nom: 'youbi',
				password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
				prenom: 'anas',
				role: 'admin',
				restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
				secretTime: '201431340',
				token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
				tokenTime: 1397469765520
			}
		};
		localStorage.setItem('compteId', $rootScope.currentUser.local.token);

		var tags = [{
			_id: '52c6cde4f6f46c5a5a000004',
			libelle: 'Exercice'
		}, {
			_id: '52c588a861485ed41c000002',
			libelle: 'Cours'
		}];
		$scope.destination = 'test@test.com';

		$scope.destinataire = 'test@test.com';

		$scope.dataRecu = {
			loged: true,
			dropboxWarning: true,
			user: {
				__v: 0,
				_id: '5329acd20c5ebdb429b2ec66',
				dropbox: {
					accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
					country: 'MA',
					'display_name': 'youbi anas',
					emails: 'anasyoubi@gmail.com',
					'referral_link': 'https://db.tt/wW61wr2c',
					uid: '264998156'
				},
				local: {
					email: 'anasyoubi@gmail.com',
					nom: 'youbi',
					password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
					prenom: 'anas',
					role: 'admin'
				}
			},
			__v: 0,
			_id: '5329acd20c5ebdb429b2ec66',
			dropbox: {
				accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
				country: 'MA',
				'display_name': 'youbi anas',
				emails: 'anasyoubi@gmail.com',
				'referral_link': 'https://db.tt/wW61wr2c',
				uid: '264998156'
			},
			local: {
				email: 'anasyoubi@gmail.com',
				nom: 'youbi',
				password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
				prenom: 'anas',
				role: 'admin'
			}
		};

		$scope.dropboxHtmlSearch = [{
			'revision': 919,
			'rev': '39721729c92',
			'thumb_exists': false,
			'bytes': 121273,
			'modified': 'Tue, 01 Apr 2014 08:47:13 +0000',
			'client_mtime': 'Tue, 01 Apr 2014 08:47:13 +0000',
			'path': '/manifestPresent.json',
			'is_dir': false,
			'icon': 'page_white_code',
			'root': 'dropbox',
			'mime_type': 'text/html',
			'size': '118.4 KB'
		}];
		$scope.uniqueResult = {
			'size': '15 bytes',
			'rev': '1f0a503351f',
			'thumb_exists': false,
			'bytes': 15,
			'modified': 'Wed, 10 Aug 2011 18:21:29 +0000',
			'path': '/test1.txt',
			'is_dir': false,
			'icon': 'page_white_text',
			'root': 'dropbox',
			'mime_type': 'text/plain',
			'revision': 496342
		};

		var data = {
			url: 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/test.html#/listDocument'
		};

		var ladate = new Date();
		var date = new Date();
		var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();

		$scope.apercuName = 'doc02.html';
		var entirePage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">';
		localStorage.setItem('compte', $scope.dataRecu.dropbox.accessToken);
		localStorage.setItem('dropboxLink', 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/' + configuration.CATALOGUE_NAME + '.html#/listDocument');
		//localStorage.setItem('listTags',tags);

    $rootScope.testEnv = true;
    $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&query=' + doc.titre + '.html&root=' + configuration.DROPBOX_TYPE).respond({});

		$scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body><script>var listDocument= [];</script></body></html>';
		$scope.appcache = 'CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached \'master entries\'. CACHE: https://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ';

		$httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond($scope.mail);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $rootScope.currentUser.local.token).respond($scope.dataRecu);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=abc&root=sandbox').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);


		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.indexPage);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/test.json?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=/2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&root=sandbox').respond($scope.dataRecu);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=/abc&root=sandbox').respond(data);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?').respond(tags);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond(tags);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(tags);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(tags);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(entirePage);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(entirePage);

		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//2014-11-14_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//2014-11-14_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond(tags);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + $scope.apercuName + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond('<htlm manifest=""><head><script> var profilId = null; var blocks = {"children":[{"id":461.5687490440905,"originalSource":"data:image/png;base64,","source":{},"text":"","level":0,"children":[{"id":"139482262782797","text":"Un titre","source":{},"children":[],"originalSource":"data:image/png;base64,jhdsghfsdhhtd","tag":"52d0598c563380592bc1d704"},{"id":"1394822627845718","text":"Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte ","source":{},"children":[],"originalSource":"data:image/png;base64,dgshgdhgsdggd","tag":"52c588a861485ed41c000001"}]}]}; var listDocument= []; </script></head><body></body></html>');
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=test.json&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=test.html&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
		$httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=_Document 01_&root=sandbox').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.appcache&root=sandbox').respond($scope.dropboxHtmlSearch);
		$httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=manifestPresent.json&root=sandbox&short_url=false').respond(data);
		$httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
			appVersion: 10
		}]);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond($scope.appcache);
		$httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond($scope.indexPage);


        $httpBackend.whenPOST(configuration.URL_REQUEST + '/epubUpload').respond(epubvar);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/externalEpub').respond(epubvar);

	}));

	afterEach(inject(function($controller, $rootScope) {
		$rootScope.$apply();
	}));



	it('AddDocumentCtrl:setFiles', inject(function() {
		var element = {};
		element.files = [];

		//cas fichier non supporté
		element.files[0] = {
			type: 'image/formatInconnu',
			name: 'formatInconnu'
		};
		$scope.setFiles(element);
		expect($scope.msgErrorModal).toEqual('Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.');
		expect($scope.errorMsg).toEqual(true);

		//cas fichier epub
		element.files[0] = {
			type: '',
			name: 'fichierEpub.epub'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierEpub');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);

		//cas fichier image png
		element.files[0] = {
			type: 'image/png',
			name: 'fichierpng.png'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierpng');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);
		expect($scope.files[0]).toEqual(element.files[0]);

		//cas fichier image jpeg
		element.files[0] = {
			type: 'image/jpeg',
			name: 'fichierjpeg.jpeg'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierjpeg');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);
		expect($scope.files[0]).toEqual(element.files[0]);

		//cas fichier image jpg
		element.files[0] = {
			type: 'image/jpeg',
			name: 'fichierjpg.jpg'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierjpg');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);
		expect($scope.files[0]).toEqual(element.files[0]);

		//cas fichier image pdf
		element.files[0] = {
			type: 'application/pdf',
			name: 'fichierpdf.pdf'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierpdf');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);
		expect($scope.files[0]).toEqual(element.files[0]);

		//cas fichier image epub+zip
		element.files[0] = {
			type: 'application/epub+zip',
			name: 'fichierepub.epub'
		};
		$scope.setFiles(element);
		expect($scope.doc.titre).toEqual('fichierepub');
		expect($scope.msgErrorModal).toEqual('');
		expect($scope.errorMsg).toEqual(false);
		expect($scope.files[0]).toEqual(element.files[0]);


	}));

	it('AddDocumentCtrl:clearUploadFile', function() {
		expect($scope.clearUploadFile).toBeDefined();
		$scope.clearUploadFile();
		expect($scope.files).toEqual([]);
	});

  it('AddDocumentCtrl: initCkEditorChange should be defined', inject(function() {
    expect($scope.initCkEditorChange).toBeDefined();
  }));

  it('AddDocumentCtrl:generateMD5', inject(function() {
    expect($scope.generateMD5('test')).toEqual('098f6bcd4621d373cade4e832627b4f6');
  }));

  it('AddDocumentCtrl:openApercu', inject(function() {
		$scope.currentData = '<p>test</p>';
    $scope.openApercu();
		expect(fileStorageService.saveTempFile).toHaveBeenCalled();
  }));

	it('AddDocumentCtrl:cancelSave', inject(function() {
		$scope.errorMsg = true;
		$scope.msgErrorModal = 'testMsg';
		$scope.cancelSave();
		expect($scope.errorMsg).toEqual(false);
		expect($scope.msgErrorModal).toEqual('');
	}));

	it('AddDocumentCtrl:verifyLink', inject(function() {
		expect($scope.verifyLink('http://test.com')).toEqual(true);
		expect($scope.verifyLink('https://test.com')).toEqual(true);
		expect($scope.verifyLink('htts://test.com')).toEqual(false);
		expect($scope.verifyLink('ftp://test.com')).toEqual(false);
	}));

	it('AddDocumentCtrl:uploadFile', inject(function() {
		$scope.files = [];
		$scope.uploadFile();
		expect($scope.msgErrorModal).toEqual('Vous devez choisir un fichier.');
		expect($scope.errorMsg).toEqual(true);
	}));

	it('AddDocumentCtrl:save', inject(function() {
		//cas titre trop long
		$scope.docTitre = 'titretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrement';
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.save();
		expect($scope.msgErrorModal).toEqual('Le titre est trop long !');
		expect($scope.errorMsg).toEqual(true);

		//cas titre non renseigne
		$scope.docTitre = '';
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.save();
		expect($scope.msgErrorModal).toEqual('Le titre est obligatoire !');
		expect($scope.errorMsg).toEqual(true);

		//cas titre avec caracteres speciaux
		$scope.docTitre = 'titreAvec_Caract&res_speciaux';
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.save();
		expect($scope.msgErrorModal).toEqual('Veuillez ne pas utiliser les caractères spéciaux.');
		expect($scope.errorMsg).toEqual(true);
	}));

	it('AddDocumentCtrl:showLoader', inject(function() {
		$scope.showLoader();
		expect($scope.loader).toEqual(false);
		expect($scope.showloaderProgress).toEqual(true);
	}));

	it('AddDocumentCtrl:hideLoader', inject(function() {
		$scope.hideLoader();
		expect($scope.loader).toEqual(false);
		expect($scope.showloaderProgress).toEqual(false);
	}));

	it('AddDocumentCtrl:ajouterDocument', inject(function() {
		//cas titre trop long
		$scope.doc = {
			titre : 'titretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrement'
		};
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.ajouterDocument();
		expect($scope.msgErrorModal).toEqual('Le titre est trop long !');
		expect($scope.errorMsg).toEqual(true);

		//cas titre non renseigne
		$scope.doc = {
			titre : ''
		};
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.ajouterDocument();
		expect($scope.msgErrorModal).toEqual('Le titre est obligatoire !');
		expect($scope.errorMsg).toEqual(true);

		//cas titre avec caracteres speciaux

		$scope.doc = {
			titre : 'titreAvec_Caract&res_speciaux'
		};
		$scope.msgErrorModal = '';
		$scope.errorMsg = false;
		$scope.ajouterDocument();
		expect($scope.msgErrorModal).toEqual('Veuillez ne pas utiliser les caractères spéciaux.');
		expect($scope.errorMsg).toEqual(true);
	}));

});