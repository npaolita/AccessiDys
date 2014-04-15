/* File: apercu.js
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

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId */

'use strict';

angular.module('cnedApp').controller('ApercuCtrl', function($scope, $rootScope, $http, $window, $location, serviceCheck, configuration, dropbox, removeHtmlTags) {

	$scope.data = [];
	//$scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.styleParagraphe = '';
	/* activer le loader */
	$scope.loader = true;
	$scope.showDuplDocModal = false;
	$scope.showRestDocModal = false;
	$scope.escapeTest = true;
	var numTitre = 0;

	$rootScope.restructedBlocks = null;

	$('#main_header').show();
	$('#titreDocument').hide();

	/* Mette à jour dernier document affiché */
	if ($location.absUrl()) {
		localStorage.setItem('lastDocument', $location.absUrl());
	}

	$scope.populateApercu = function() {
		// Selection des profils tags pour le style
		if (blocks && blocks.children.length > 0) {
			//if (localStorage.getItem('listTagsByProfil')) {
			$scope.profiltags = JSON.parse(localStorage.getItem('listTagsByProfil'));
			//Selection des tags pour le plan
			//if (localStorage.getItem('listTags')) {
			$scope.tags = JSON.parse(localStorage.getItem('listTags'));
			var blocksArray = angular.fromJson(blocks);
			var j = 0;
			$scope.blocksPlan = [];
			$scope.blocksPlan[0] = [];
			$scope.blocksPlan[0][0] = [];

			for (var i = 0; i < blocksArray.children.length; i++) {
				$scope.blocksPlan[i + 1] = [];
				j = 0;
				$scope.blocksPlan[i + 1][j] = blocksArray.children[i];
				blocksArray.children[i].root = true;
				traverse(blocksArray.children[i].children, i, j);
			}

			$scope.plans.forEach(function(entry) {
				entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
			});

			// if (localStorage.getItem('compteId') && ownerId && ownerId !== localStorage.getItem('compteId')) {
			// 	$scope.newOwnerId = localStorage.getItem('compteId');
			// 	$scope.showDuplDocModal = true;
			// }

			// if (localStorage.getItem('compteId') && ownerId && ownerId === localStorage.getItem('compteId')) {
			// 	$scope.showRestDocModal = true;
			// }

			$scope.loader = false;
		}
	};

	$scope.verifProfil = function() {
		$scope.sentVar = {
			userID: $rootScope.currentUser._id,
			actuel: true
		};
		$http.post(configuration.URL_REQUEST + '/chercherProfilActuel', $scope.sentVar)
			.success(function(dataActuel) {
				$scope.varToSend = {
					profilID: dataActuel.profilID
				};
				localStorage.setItem('profilActuel', JSON.stringify(dataActuel));
				$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
					idProfil: dataActuel.profilID
				}).success(function(data) {
					localStorage.setItem('listTagsByProfil', JSON.stringify(data));
					$http.get(configuration.URL_REQUEST + '/readTags').success(function(data) {
						localStorage.setItem('listTags', JSON.stringify(data));
						$scope.populateApercu();
					});
				});
			});
	};

	$scope.defaultProfile = function() {
		$http.post(configuration.URL_REQUEST + '/chercherProfilParDefaut')
			.success(function(data) {
				if (data) {
					$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
						idProfil: data.profilID
					}).success(function(data) {
						localStorage.setItem('listTagsByProfil', JSON.stringify(data));
						$http.get(configuration.URL_REQUEST + '/readTags').success(function(data) {
							localStorage.setItem('listTags', JSON.stringify(data));
							$scope.populateApercu();
						});
					});
				}
			});
	};

	$scope.init = function() {
		if ($location.absUrl().indexOf('key=') > -1) {
			var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
			localStorage.setItem('compteId', callbackKey);
		}

		if (!localStorage.getItem('compteId') && localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
			$scope.populateApercu();
		} else if (localStorage.getItem('compteId')) {
			var tmp = serviceCheck.getData();
			tmp.then(function(result) {
				$rootScope.currentUser = result.user;
				if (ownerId && ownerId !== $rootScope.currentUser._id) {
					$scope.newOwnerId = $rootScope.currentUser._id;
					$scope.showDuplDocModal = true;
				}

				if (ownerId && ownerId === $rootScope.currentUser._id) {
					$scope.showRestDocModal = true;
				}
				$scope.verifProfil();

			});
		} else {
			$scope.defaultProfile();
		}
	};

	$scope.init();

	function getTitleIndex(titre) {
		return parseInt(titre.substring(titre.length - 1, titre.length));
	}

	function limitParagraphe(titre) {
		var taille = 0;
		var limite = 80;

		if (titre.length <= limite) {
			return titre;
		}

		for (var i = 0; i < titre.length; i++) {
			taille = taille + 1;
			if (taille >= limite) {
				break;
			}
		}
		return titre.substring(0, taille) + '...';

		// var maxLength = 80; // maximum number of characters to extract
		// //trim the string to the maximum length
		// var trimmedString = titre.substr(0, maxLength);
		// //re-trim if we are in the middle of a word
		// trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' ')));
		// return trimmedString;
	}

	/* Parcourir les blocks du document d'une facon recursive */
	function traverse(obj, idx1, idx2) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text !== '') {
					$scope.counterElements += 1;
					var debutStyle = '<p id="' + $scope.counterElements + '">';
					var finStyle = '</p>';
					var tagExist = false;
					var libelle = '';
					var numTitreTmp = numTitre;
					var isTitre = false;

					for (var profiltag in $scope.profiltags) {
						/* le cas d'un paragraphe */
						var style = $scope.profiltags[profiltag].texte;
						libelle = $scope.profiltags[profiltag].tagName;
						if (libelle.match('^Paragraphe')) {
							$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
						}

						if (obj[key].tag === $scope.profiltags[profiltag].tag) {
							debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + $scope.counterElements + '" regle-style="" >';
							/* le cas d'un titre */
							if (libelle.match('^Titre')) {
								numTitre = getTitleIndex(libelle);
								numTitreTmp = numTitre;
								numTitre++;
								libelle = obj[key].text;
								isTitre = true;
							}
							tagExist = true;
							break;
						}
					}

					// Selection du Tag si il n'existe pas sur les profilsTags
					if (!tagExist) {
						for (var i = 0; i < $scope.tags.length; i++) {
							if (obj[key].tag === $scope.tags[i]._id) {
								libelle = $scope.tags[i].libelle;
								if (libelle.match('^Titre')) {
									numTitre = getTitleIndex(libelle);
									numTitreTmp = numTitre;
									numTitre++;
									libelle = obj[key].text;
									isTitre = true;
								}
								break;
							}
						}
					}

					if (!isTitre) {
						libelle = removeHtmlTags(libelle) + ' : ' + limitParagraphe(removeHtmlTags(obj[key].text)).replace(/\n/g, ' ');
					} else {
						libelle = removeHtmlTags(libelle);
					}

					$scope.plans.push({
						libelle: libelle,
						block: obj[key].id,
						position: idx1,
						numTitre: numTitreTmp
					});

					obj[key].text = debutStyle + obj[key].text + finStyle;
				}

				$scope.blocksPlan[idx1 + 1][++idx2] = obj[key];

				if (obj[key].children.length > 0) {
					traverse(obj[key].children, idx1, idx2);
				} else {
					obj[key].leaf = true;
				}
			}
		}
	}

	/* Aller au Slide de position idx et du block blk */
	$scope.setActive = function(idx, blk) {
		$scope.blocksPlan[idx + 1].active = true;
		$scope.currentBlock = blk;
		$scope.showApercu = 'visible';
		$scope.showPlan = 'hidden';
	};

	/* Interception de l'evenement goToArea de la fin de la transition */
	$scope.$on('goToBlockSlide', function() {
		var blockId = '#' + $scope.currentBlock;
		if ($scope.currentBlock && $(blockId).offset()) {
			$('html, body').animate({
				scrollTop: $(blockId).offset().top
			}, 1200);
			$scope.currentBlock = null;
		} else {
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	});

	// Catch detection of key up
	$scope.$on('keydown', function(msg, code) {
		if (code === 37) {
			$scope.$broadcast('prevSlide');
		} else if (code === 39) {
			$scope.$broadcast('nextSlide');
		}
	});

	/*$scope.initPlayerAudio = function() {
		console.log("ng initialised");
		// Initialiser le lecteur audio
		audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
		});
		var players = document.getElementsByClassName("player-audio");
		console.log(players);
		players.load();
	};*/

	$scope.playSong = function(source) {
		var audio = document.getElementById('player');
		audio.setAttribute('src', source);
		audio.load();
		audio.play();

		/*audiojs.events.ready(function() {
			console.log('ng initialised 1.1 ');
			var as = audiojs.createAll();
			as.play();
		});*/
	};

	/* Imprimer le document */
	$scope.printDocument = function() {
		window.print();
	};

	/* Afficher/Masquer le menu escamotable */
	$scope.afficherMenu = function() {
		if ($('.open_menu').hasClass('shown')) {
			$('.open_menu').removeClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '140px'
			}, 100);
		} else {
			$('.open_menu').addClass('shown');
			$('.open_menu').parent('.menu_wrapper').animate({
				'margin-left': '0'
			}, 100);
		}
	};

	/* Aller au precedent */
	$scope.precedent = function() {
		$scope.$broadcast('prevSlide');
	};

	/* Aller au suivant */
	$scope.suivant = function() {
		$scope.$broadcast('nextSlide');
	};

	/* Aller au dernier */
	$scope.dernier = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[$scope.blocksPlan.length - 1].active = true;
		}
	};

	/* Aller au premier */
	$scope.premier = function() {
		if ($scope.blocksPlan.length === 1) {
			$scope.blocksPlan[0].active = true;
		} else if ($scope.blocksPlan.length > 1) {
			$scope.blocksPlan[1].active = true;
		}
	};

	/* Aller au plan */
	$scope.plan = function() {
		if ($scope.blocksPlan.length > 0) {
			$scope.blocksPlan[0].active = true;
			if ($('#plan').offset()) {
				$('html, body').animate({
					scrollTop: $('#plan').offset().top
				}, 500);
			}
		}
	};

	/* Fixer/Défixer le menu lors du défilement */
	$(window).scroll(function() {
		if ($('.carousel-inner').offset()) {
			if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
				$('.fixed_menu').addClass('attached');
			} else {
				$('.fixed_menu').removeClass('attached');
			}
		}

	});

	$scope.restructurer = function() {
		if (blocks && blocks.children.length > 0) {
			$rootScope.restructedBlocks = blocks;
			var urlAp = $location.absUrl();
			urlAp = urlAp.replace('#/apercu', '');
			$rootScope.docTitre = decodeURI(urlAp.substring(urlAp.lastIndexOf('/') + 1, urlAp.lastIndexOf('.html')));
			if ($scope.escapeTest) {
				$window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
			}
		}
	};

	$scope.dupliquerDocument = function() {
		if ($rootScope.currentUser) {
			var token = $rootScope.currentUser.dropbox.accessToken;
			var newOwnerId = $rootScope.currentUser._id;
			var url = $location.absUrl();
			url = url.replace('#/apercu', '');
			var newDocName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.html'));
			var manifestName = newDocName + '.appcache';
			var apercuName = newDocName + '.html';
			var listDocumentDropbox = configuration.CATALOGUE_NAME;
			$scope.loader = true;
			var msg1 = 'Le document est copi&eacute; avec succ&egrave;s!';
			$scope.showMsgSuccess = false;

			$http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(response) {
				var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), response.data, token, configuration.DROPBOX_TYPE);
				uploadManifest.then(function(result) {
					if (result) {
						var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
						shareManifest.then(function(result) {
							if (result) {
								var urlManifest = result.url;
								$http.get(($scope.url || url)).then(function(resDocDropbox) {
									var docDropbox = resDocDropbox.data;
									docDropbox = docDropbox.replace(docDropbox.substring(docDropbox.indexOf('manifest="'), docDropbox.indexOf('.appcache"') + 10), 'manifest="' + urlManifest + '"');
									docDropbox = docDropbox.replace('ownerId = \'' + ownerId + '\'', 'ownerId = \'' + newOwnerId + '\'');

									var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), docDropbox, token, configuration.DROPBOX_TYPE);
									uploadApercu.then(function(result) {
										var listDocument = result;
										var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
										shareApercu.then(function(result) {
											if (result) {
												$scope.docTitre = '';
												var urlDropbox = result.url + '#/apercu';
												console.log(urlDropbox);
												listDocument.lienApercu = result.url + '#/apercu';
												var downloadDoc = dropbox.download(($scope.listDocumentDropbox || listDocumentDropbox), token, configuration.DROPBOX_TYPE);
												downloadDoc.then(function(result) {
													var debut = result.indexOf('var listDocument') + 18;
													var fin = result.indexOf(']', debut) + 1;
													var curentListDocument = result.substring(debut + 1, fin - 1);
													if (curentListDocument.length > 0) {
														curentListDocument = curentListDocument + ',';
													}
													result = result.replace(result.substring(debut, fin), '[]');
													result = result.replace('listDocument= []', 'listDocument= [' + curentListDocument + angular.toJson(listDocument) + ']');
													var uploadDoc = dropbox.upload(($scope.listDocumentDropbox || listDocumentDropbox), result, token, configuration.DROPBOX_TYPE);
													uploadDoc.then(function() {
														var downloadManifest = dropbox.download('listDocument.appcache', token, configuration.DROPBOX_TYPE);
														downloadManifest.then(function(dataFromDownload) {
															var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
															dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
															var uploadManifest = dropbox.upload('listDocument.appcache', dataFromDownload, token, configuration.DROPBOX_TYPE);
															uploadManifest.then(function() {
																$scope.loader = false;
																$scope.showMsgSuccess = true;
																$scope.msgSuccess = msg1;
																$('#duplicateDocModal').modal('show');
															});
														});
													});
												});
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
	};


});