/* File: bodyClasses.js
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
/* global cnedApp, $:false */
/* jshint unused: false, undef:false */

/*
 * Gérer l'affichage de l'aperçu
 */
cnedApp.directive('bodyClasses', function() {
    return {
        link : function(scope, element) {
            var elementClasses = $(element).attr('class').split(' ');
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i] === 'doc-apercu' || elementClasses[i] === 'doc-General') {
                    $('body').removeClass('modal-open');
                    $('body').find('.modal-backdrop').remove();
                    $('#bookmarkletGenerator').modal('hide');
                }
            }
        }
    };
});

/*
 * Directive pour gérer Drag and Drop des annotations.
 */
cnedApp.directive('draggableNote', [ '$document',

function($document) {
    return {
        restrict : 'A',
        link : function(scope, elm, attrs) {
            var startX, startY, initialMouseX, initialMouseY, tagID, defaultX, maxX, maxY, adaptContent, noteContainer;
            elm.css({
                position : 'absolute'
            });

            /* Si le bouton de la souris est appuyé */
            elm.bind('mousedown', function($event) {
                tagID = $event.target.id;

                // click on new editable text
                if (tagID === 'draggable-note-content' && $event.target.innerHTML === 'Note') {
                    /*
                     * empty text content
                     */
                    $event.target.innerHTML = '';
                } else {
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    if (scope.modeImpression) {
                        startX = elm.prop('offsetLeft') + elm.parent().prop('offsetLeft');
                        initialMouseY = $event.clientY;
                        adaptContent = angular.element('#adapt-content-' + scope.note.idPage);
                        noteContainer = angular.element('#note-container-' + scope.note.idPage);
                        
                    } else {
                        startX = elm.prop('offsetLeft');
                        initialMouseY = $event.clientY;
                        adaptContent = angular.element('.adaptContent');
                        noteContainer = angular.element('#note_container');
                    }
                    maxX = adaptContent.width() + noteContainer.width() - elm.width() + parseInt(adaptContent.css('marginLeft'));
                    maxY = adaptContent.height();
                    defaultX = adaptContent.width() + parseInt(adaptContent.css('marginLeft'));
                    return true;
                }
            });

            /* Si le curseur de la souris se déplace sur le document */

            function mousemove($event) {
                $event.preventDefault();
                var dx = $event.clientX - initialMouseX;
                var dy = $event.clientY - initialMouseY;

                /* Si je déplace le contenu de l'annotation dans la zone permise */
                if ((tagID === 'noteID') && ((startX + dx) > defaultX) && ((startX + dx) < maxX) && ((startY + dy) > 0) && ((startY + dy)) < maxY) {

                    elm.css({
                        top : startY + dy + 'px',
                        left : startX + dx + 'px'
                    });
                    scope.note.y = startY + dy;
                    scope.note.x = startX + dx;
                    scope.drawLine();
                    /* Si je déplace la flèche de l'annotation */
                } else if (tagID === 'linkID') {
                    elm.css({
                        top : startY + dy + 'px',
                        left : startX + dx + 'px'
                    });
                    scope.note.yLink = startY + dy;
                    scope.note.xLink = startX + dx;
                    scope.drawLine();
                } else if (tagID === 'editTexteID') {
                    return true;
                }

                return false;
            }

            /* Si le bouton de la souris est relaché */

            function mouseup($event) {
                // var tagID = $event.target.id;
                /* Si je déplace la flèche et le contenu de l'annotation */
                if (tagID === 'noteID' || tagID === 'linkID') {
                    scope.editNote(scope.note);
                }
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    };
} ]);

/*
 * Directive pour détecter la fin d'un ng-repeat dans l'apercu.
 */
cnedApp.directive('onFinishApercu', [ '$timeout',

function($timeout) {
    return {
        restrict : 'A',
        link : function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinishedApercu');
                });
            }
        }
    };
} ]);

/*
 * Directive pour détecter la fin d'un ng-repeat dans print.
 */
cnedApp.directive('onFinishRender', [ '$timeout',

function($timeout) {
    return {
        restrict : 'A',
        link : function(scope) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
} ]);

/*
 * Directive pour limiter le nombre de caracteres à saisir.
 */
cnedApp.directive('maxLength', function() {
    return {
        require : 'ngModel',
        link : function(scope, element, attrs, ngModelCtrl) {
            var maxlength = Number(attrs.maxLength);

            function fromUser(text) {
                if (text && text.length > maxlength) {
                    var transformedInput = text.substring(0, maxlength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
