/* File: main.js
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
/* global $ */
/* global listDocument */

angular.module('cnedApp').controller('listDocumentCtrl', function($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window, configuration) {

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').show();

	$scope.files = [];
	$scope.errorMsg = '';
	$scope.displayDestination = false;

	$scope.files = [];
	$scope.errorMsg = '';

	$scope.afficheErreurModifier = false;
	$scope.videModifier = false;
	$scope.testEnv = false;
	$scope.envoiMailOk = false;

	$scope.flagListDocument = false;

	$scope.initListDocument = function() {

		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
			$rootScope.listDocumentDropBox = $location.absUrl().substring(0, $location.absUrl().indexOf('?key'));
		}

		if ($location.absUrl().indexOf('?reload=true') > -1) {
			var reloadParam = $location.absUrl().substring(0, $location.absUrl().indexOf('?reload=true'));
			window.location.href = reloadParam;
		}

		if (navigator.onLine) {
			console.log('======== you are online ========');
			if (localStorage.getItem('compteId')) {
				var user = serviceCheck.getData();
				user.then(function(result) {
					console.log(result);
					if (result.loged) {
						console.log('======== you are loged =========');
						if (result.dropboxWarning === false) {
							$rootScope.dropboxWarning = false;
							$scope.missingDropbox = false;
							$rootScope.loged = true;
							$rootScope.admin = result.admin;
							$rootScope.apply; // jshint ignore:line
							if ($location.path() !== '/inscriptionContinue') {
								$location.path('/inscriptionContinue');
							}
						} else {
							console.log('=======  you have full account  ========');
							$rootScope.currentUser = result.user;
							$rootScope.loged = true;
							$rootScope.admin = result.admin;
							$rootScope.apply; // jshint ignore:line
							if ($rootScope.currentUser.dropbox.accessToken) {
								var tmp5 = dropbox.search('.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp5.then(function(data) {
									console.log('=======  getting all .html  ========');
									$scope.listDocument = listDocument;
									$scope.initialLenght = $scope.listDocument.length;
									console.log($scope.listDocument);
									for (var i = 0; i < $scope.listDocument.length; i++) {
										var documentExist = false;
										for (var y = 0; y < data.length; y++) {
											if ($scope.listDocument[i].path === data[y].path) {
												console.log('ce document exist');
												documentExist = true;
											}
										}
										if (!documentExist) {
											console.log('ce document nexist pas');
											$scope.listDocument.splice(i);
										}
									}
									console.log($scope.listDocument);
									if ($scope.initialLenght !== $scope.listDocument.length) {

										var tmp7 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
										tmp7.then(function(entirePage) {
											var debut = entirePage.search('var listDocument') + 18;
											var fin = entirePage.indexOf('"}];', debut) + 3;
											entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
											entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson($scope.listDocument));
											console.log($scope.listDocument);
											var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
											tmp6.then(function() {
												var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
												tmp3.then(function(dataFromDownload) {
													console.log(dataFromDownload);
													var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
													dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
													var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
													tmp4.then(function() {
														console.log('new manifest uploaded');
														$scope.flagListDocument = true;
														if ($scope.testEnv === false) {
															window.location.reload();
														}
													});
												});
											});
										});
									}
									$('#listDocumentPage').show();
									$scope.listDocument = listDocument;
									// for (i = 0; i < $scope.listDocument.length; i++) {
									// $scope.listDocument[i].path = $scope.listDocument[i].path.replace('/', '');
									// }
								});
							} else {
								$location.path('/');
							}
						}
					}
				});
			}
		} else {
			console.log('you are offline');
			/* jshint ignore:start */
			$scope.listDocument = listDocument;
			// for (var i = 0; i < $scope.listDocument.length; i++) {
			// 	$scope.listDocument[i].path = $scope.listDocument[i].path.replace('/', '');
			// };
			$('#listDocumentPage').show();

			/* jshint ignore:end */
		}
	};

	$scope.open = function(document) {
		$scope.deleteLink = document.path;
		$scope.deleteLienDirect = document.lienApercu;
	};

	$scope.suprimeDocument = function() {
		if (localStorage.getItem('compteId')) {
			$scope.verifLastDocument($scope.deleteLienDirect, null);
			var tmp = dropbox.delete($scope.deleteLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
			tmp.then(function() {
				$('#myModal').modal('hide');
				$scope.initListDocument();
			});
		}
	};

	$scope.openModifieTitre = function(document) {
		$scope.selectedItem = document.path;
		$scope.selectedItemLink = document.lienApercu;
		$scope.afficheErreurModifier = false;
		$scope.videModifier = false;
		$scope.nouveauTitre = '';
	};

	$scope.modifieTitre = function() {
		if ($scope.nouveauTitre !== '') {
			console.log($scope.selectedItem);
			console.log($scope.nouveauTitre);
			$scope.videModifier = false;
			var documentExist = false;
			for (var i = 0; i < $scope.listDocument.length; i++) {
				if ($scope.listDocument[i].path === $scope.nouveauTitre) {
					documentExist = true;
					break;
				}
			}
			if (documentExist) {
				$scope.afficheErreurModifier = true;
			} else {
				$scope.modifieTitreConfirme();
			}
		} else {
			$scope.videModifier = true;
		}
	};

	$scope.verifLastDocument = function(oldUrl, newUrl) {
		var lastDocument = localStorage.getItem('lastDocument');
		if (lastDocument && oldUrl === lastDocument) {
			if (newUrl && newUrl.length > 0) {
				localStorage.setItem('lastDocument', newUrl);
			} else {
				localStorage.removeItem('lastDocument');
			}
		}
	};

	$scope.modifieTitreConfirme = function() {
		var tmp = dropbox.rename($scope.selectedItem, '/' + $scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		tmp.then(function(result) {
			$scope.newFile = result;

			var tmp3 = dropbox.shareLink($scope.nouveauTitre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
			tmp3.then(function(resultShare) {
				console.log(resultShare);
				$scope.newShareLink = resultShare.url;
				var tmp2 = dropbox.delete('/' + $scope.selectedItem, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
				tmp2.then(function(deleteResult) {
					$scope.oldFile = deleteResult;
					var tmp3 = dropbox.download(configuration.CATALOGUE_NAME, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
					tmp3.then(function(entirePage) {
						for (var i = 0; i < listDocument.length; i++) {
							if (listDocument[i].path === $scope.selectedItem) {
								console.log('element a remplacer trouver');
								$scope.newFile.lienApercu = $scope.newShareLink + '#/apercu';
								listDocument[i] = $scope.newFile;
								break;
							}
						}
						$scope.verifLastDocument($scope.selectedItemLink, $scope.newShareLink);
						var debut = entirePage.search('var listDocument') + 18;
						var fin = entirePage.indexOf('"}];', debut) + 3;
						entirePage = entirePage.replace(entirePage.substring(debut, fin), '[]');
						entirePage = entirePage.replace('listDocument= []', 'listDocument= ' + angular.toJson(listDocument));
						console.log(entirePage);
						var tmp6 = dropbox.upload(configuration.CATALOGUE_NAME, entirePage, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
						tmp6.then(function() {
							var tmp3 = dropbox.download('listDocument.appcache', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
							tmp3.then(function(dataFromDownload) {
								console.log(dataFromDownload);
								var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
								dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
								var tmp4 = dropbox.upload('listDocument.appcache', dataFromDownload, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
								tmp4.then(function() {
									console.log('new manifest uploaded');
									//window.location.reload();
									if ($scope.testEnv === false) {
										window.location.reload();
									}
								});
							});
						});
					});
				});
			});
		});
	};
	$scope.ajouterDocument = function() {
		if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}
		var searchApercu = dropbox.search($scope.doc.titre + '.html', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
		searchApercu.then(function(result) {
			if (result && result.length > 0) {
				$scope.errorMsg = 'Le document existe déja dans Dropbox';
			} else {
				if ((!$scope.doc.lienPdf && $scope.files.length <= 0) || ($scope.doc.lienPdf && $scope.files.length > 0)) {
					$scope.errorMsg = 'Veuillez saisir un lien ou uploader un fichier !';
					return;
				}
				$('#addDocumentModal').modal('hide');
				$('#addDocumentModal').on('hidden.bs.modal', function() {
					if ($scope.files.length > 0) {
						$scope.doc.uploadPdf = $scope.files;
					}
					$rootScope.uploadDoc = $scope.doc;
					$scope.doc = {};
					$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
				});
			}
		});
	};

	$scope.setFiles = function(element) {
		$scope.files = [];
		$scope.$apply(function() {
			for (var i = 0; i < element.files.length; i++) {
				if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf') {
					$scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
					$scope.files = [];
					break;
				} else {
					$scope.files.push(element.files[i]);
				}
			}
		});
	};

	$scope.clearUploadPdf = function() {
		$scope.files = [];
		$('#docUploadPdf').val('');
	};

	/*load email form*/
	$scope.loadMail = function() {
		$scope.displayDestination = true;
	};
	/*regex email*/
	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};

	$scope.docPartage = function(param) {
		$scope.docApartager = param;
		$scope.encodeURI = encodeURIComponent($scope.docApartager.lienApercu);
		if ($scope.docApartager && $scope.docApartager.lienApercu) {
			$scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');

		}
	};

	/*envoi de l'email au destinataire*/
	$scope.sendMail = function() {

		console.log('inside mail send');
		$scope.destination = $scope.destinataire;
		if ($scope.verifyEmail($scope.destination) && $scope.destination.length > 0) {
			console.log('ok verify mail');

			$('.sendingMail').attr('data-dismiss', 'modal');

			if ($scope.docApartager) {
				console.log('ok $scope.document');

				if ($rootScope.currentUser.dropbox.accessToken) {
					console.log('ok accessToken');

					if (configuration.DROPBOX_TYPE) {
						console.log('ok DROPBOX_TYPE');

						console.log('resulllt ==>');
						$scope.sendVar = {
							to: $scope.destinataire,
							content: 'je viens de partager avec vous le lien suivant :' + $scope.docApartager.lienApercu,
							encoded: '<div>je viens de partager avec vous le lien suivant :' + $scope.docApartager.lienApercu + ' </div>'
						};
						$http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar)
							.success(function(data) {
								$('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');

								console.log('here');
								$scope.sent = data;
								$scope.envoiMailOk = true;
								console.log('sent ===>');
								console.log(data);
								$scope.destinataire = '';


							});



					}

				}

			}


		} else {
			$('.sendingMail').removeAttr('data-dismiss', 'modal');

			$('#erreurEmail').fadeIn('fast').delay(5000).fadeOut('fast');

		}
	};

});
