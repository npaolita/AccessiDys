/* File: regleStyle.js
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

/*global cnedApp,Hyphenator, $:false */
'use strict';

/*
 * Directive pour appliquer une règle de style à un paragraphe.
 */
cnedApp.directive('regleStyle', ['$rootScope', 'removeHtmlTags', '$compile',

  function($rootScope, removeHtmlTags, $compile) {
    return {
      restrict: 'EA',
      link: function(scope, element, attrs) {

        $rootScope.lineWord = 0;
        $rootScope.lineLine = 1;

        var compile = function(newHTML) {
          newHTML = $compile(newHTML)($rootScope);
          element.html('').append(newHTML);

          $(element).css({
            'font-weight': $(element).find('p').attr('data-weight'),
            'font-size': $(element).find('p').attr('data-size') + 'px',
            'line-height': $(element).find('p').attr('data-lineheight') + 'px',
            'font-family': $(element).find('p').attr('data-font'),
            'letter-spacing': $(element).find('p').attr('data-letter-spacing') + 'px',
            'word-spacing': $(element).find('p').attr('data-word-spacing') + 'px'
          });

          /* Si la règle de style est appelée */
          if ($(element).find('p').attr('data-coloration')) {
            regleColoration($(element).find('p').attr('data-coloration'), element);
          } else if (newHTML.html()) {
            element.html('').append(newHTML.html());
          }
        };

        var htmlName = attrs.regleStyle;

        scope.$watch(htmlName, function(newHTML) {
          // the HTML
          if (!newHTML) return;
          compile(newHTML); // Compile
        });

        var currentParam = '';
        var currentElementAction = '';
        var hyphenatorSettings = {
          'onhyphenationdonecallback': function() {
            // console.log('done ... ');
            syllabeAction(currentParam, currentElementAction);
          },
          hyphenchar: '|',
          displaytogglebox: true,
        };
        Hyphenator.config(hyphenatorSettings);

        /*
         * Détecter et séparer les lignes d'un paragraphe.
         */
        var lineAction = function(elementAction, palette) {
          //console.log('inside line action');
          var p = $(elementAction);
          var tmpTxt = p.text(); //.replace(/\n/g, ' <br/> ');
          tmpTxt = tmpTxt.replace(/</g, '&lt;');
          tmpTxt = tmpTxt.replace(/>/g, '&gt;');
          tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
          tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

          var words = tmpTxt.split(' '); //p.text().split(' ');
          var text = '';

          $.each(words, function(i, w) {
            if ($.trim(w)) {
              //traiter le cas de - dans un mot
              var txtTiret = w.split('-');
              if (txtTiret.length > 1) {
                $.each(txtTiret, function(j, sw) {
                  if (j === txtTiret.length - 1) {
                    text = text + '<span>' + sw + '</span>';
                  } else {
                    text = text + '<span>' + sw + '-</span>';
                  }
                });
              } else if (w !== '&nbsp;') {
                text = text + '<span>' + w + ' </span>';
              }
            }
          });

          text = text.replace(/<span><br\/> <\/span>/g, '<br/> ');

          $(elementAction).html(text);

          var line = $rootScope.lineLine;
          var prevTop = -15;
          $('span', p).each(function() {
            var word = $(this);
            var top = word.offset().top;

            if (top !== prevTop) {
              prevTop = top;
              if (line === palette) {
                line = 1;
              } else {
                line++;
              }
              $rootScope.lineLine = line;
            }
            word.attr('class', 'line' + line);
          }); //each
        };

        /*
         * Détecter et séparer les mots d'un paragraphe.
         */
        var wordAction = function(elementAction) {
          var p = $(elementAction);
          var tmpTxt = p.text();
          tmpTxt = tmpTxt.replace(/</g, '&lt;');
          tmpTxt = tmpTxt.replace(/>/g, '&gt;');
          tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
          tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

          var words = tmpTxt.split(' '); //p.text().split(' ');

          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) {
              if (w === '&nbsp;') {
                text = text + w;
              } else {
                text = text + '<span >' + w + '</span> ';
              }
            }
          });

          text = text.replace(/<span><br\/><\/span>/g, '<br/> ');

          p.html(text);
          var line = $rootScope.lineWord;
          $('span', p).each(function() {
            var word = $(this);
            if (line !== 3) {
              line++;
            } else {
              line = 1;
            }
            word.attr('class', 'line' + line);
            $rootScope.lineWord = line;
          }); //each
        };

        /*
         * Configurer le plugin Hyphenator.
         */
        var decoupe = function(param, elementAction) {
          var palinText = removeHtmlTags($(elementAction).html());
          $(elementAction).html('');
          elementAction.text(palinText);
          currentParam = param;
          currentElementAction = elementAction;

          elementAction.text(Hyphenator.hyphenate($(elementAction).text(), 'fr'));
          syllabeAction(currentParam, elementAction);
        };

        /*
         * Détecter et séparer les syllabes des mots d'un paragraphe.
         */
        var syllabeAction = function(param, elementAction) {
          var p = $(elementAction);
          var tmpTxt = p.text();
          tmpTxt = tmpTxt.replace(/</g, '&lt;');
          tmpTxt = tmpTxt.replace(/>/g, '&gt;');
          tmpTxt = tmpTxt.replace(/\n/g, ' <br/> ');
          tmpTxt = tmpTxt.replace(/\xA0/g, '&nbsp;');

          var words = tmpTxt.split(' ');

          var text = '';
          $.each(words, function(i, w) {
            if ($.trim(w)) {
              if (w.indexOf('|') > -1) {
                var wordss = w.split('|');
                $.each(wordss, function(i, ww) {
                  if (i === wordss.length - 1) {
                    text = text + '<span class="syllab">' + ww + '</span> ';
                  } else {
                    text = text + '<span class="syllab">' + ww + '</span>';
                  }
                });
              } else {
                text = text + '<span>' + w + '</span> ';
              }
            }
          });

          text = text.replace(/<span><br\/><\/span>/g, '<br/> ');

          p.html(text);
          $(window).resize(function() {

            var line = 0;
            $('span', p).each(function() {
              var word = $(this);
              if (line !== 3) {
                line++;
              } else {
                line = 1;
              }
              word.attr('class', 'line' + line);
            }); //each
          }); //resize

          $(window).resize();

          if (param === 'color-syllabes') {
            $(elementAction).css('color', '');
            $(elementAction).find('span').css('color', '');
            $(elementAction).find('.line1').css('color', '#D90629');
            $(elementAction).find('.line2').css('color', '#066ED9');
            $(elementAction).find('.line3').css('color', '#4BD906');
          }

        };

        /* Relges de style Profils */
        $rootScope.$on('reglesStyleChange', function(nv, params) {
          nv.stopPropagation();
          scope.colorationCount = 0;

          switch (params.operation) {

            case 'interligne':
              $('.' + params.element).css('line-height', params.value + 'px');
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              break;

            case 'style':
              if (params.value === 'Gras') {
                params.value = 'Bold';
              }
              $('.' + params.element).css('font-weight', params.value);
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              regleColoration(scope.oldColoration, $('.' + params.element));

              break;

            case 'taille':
              $('.' + params.element).css('font-size', params.value + 'px');
              if (scope.colorationCount > 0) {
                $('.' + params.element).text($('.' + params.element).text());
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              regleColoration(scope.oldColoration, $('.' + params.element));

              break;

            case 'police':
              $('.' + params.element).css('font-family', params.value);
              if (scope.colorationCount > 0) {
                angular.element($('.' + params.element).text($('.' + params.element).text()));
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              regleColoration(scope.oldColoration, $('.' + params.element));
              break;

            case 'coloration':
              scope.colorationCount = 0;
              regleColoration(params.value, $('.' + params.element));
              scope.colorationCount++;
              scope.oldColoration = params.value;
              break;

            case 'space':
              regleEspace(params.value, $('.' + params.element));
              if (scope.colorationCount > 0) {
                $('.' + params.element).text($('.' + params.element).text());
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              regleColoration(scope.oldColoration, $('.' + params.element));
              break;
            case 'spaceChar':
              regleCharEspace(params.value, $('.' + params.element));
              if (scope.colorationCount > 0) {
                $('.' + params.element).text($('.' + params.element).text());
                regleColoration(scope.oldColoration, $('.' + params.element));
              }
              regleColoration(scope.oldColoration, $('.' + params.element));
              break;

            case 'initialiseColoration':
              scope.oldColoration = null;
              break;
          }

        });

        function regleEspace(param, elementAction) {
          // $('.shown-text-add span').each(function() {
          //   $(this).css('margin-left', param)
          // });
          $(elementAction).css('word-spacing', '' + param + 'px');
        }

        function regleCharEspace(param, elementAction) {
          // $('.shown-text-add span').each(function() {
          //   $(this).css('margin-left', param)
          // });
          $(elementAction).css('letter-spacing', '' + param + 'px');
        }

        function regleColoration(param, elementAction) {
          // console.log(param);
          switch (param) {
            case 'Couleur par défaut':
              $(elementAction).find('.line1').css('background-color', '');
              $(elementAction).find('.line2').css('background-color', '');
              $(elementAction).find('.line3').css('background-color', '');
              $(elementAction).css('color', 'black');
              $(elementAction).find('span').css('color', 'black');
              $(elementAction).text($(elementAction).text());
              break;

            case 'Colorer les lignes 3 couleurs':
              lineAction(elementAction, 3);
              $(elementAction).find('.line1').css('color', '#D90629');
              $(elementAction).find('.line2').css('color', '#066ED9');
              $(elementAction).find('.line3').css('color', '#4BD906');
              break;

            case 'Colorer les lignes 4 couleurs':
              lineAction(elementAction, 4);
              $(elementAction).find('.line1').css('color', '#D90629');
              $(elementAction).find('.line2').css('color', '#066ED9');
              $(elementAction).find('.line3').css('color', '#4BD906');
              $(elementAction).find('.line4').css('color', '#FFA30F');
              break;

            case 'Colorer les mots':
              wordAction(elementAction);
              $(elementAction).find('.line1').css('background-color', '');
              $(elementAction).find('.line2').css('background-color', '');
              $(elementAction).find('.line3').css('background-color', '');
              $(elementAction).find('.line1').css('color', '#D90629');
              $(elementAction).find('.line2').css('color', '#066ED9');
              $(elementAction).find('.line3').css('color', '#4BD906');
              break;

            case 'Surligner les mots':
              wordAction(elementAction);
              $(elementAction).find('.line1').css({
                'background-color': '#fffd01',
                'color': '#000'
              });
              $(elementAction).find('.line2').css({
                'background-color': '#04ff04',
                'color': '#000'
              });
              $(elementAction).find('.line3').css({
                'background-color': '#04ffff',
                'color': '#000'
              });
              break;

            case 'Surligner les lignes 3 couleurs':
              lineAction(elementAction, 3);
              $(elementAction).css('color', '');
              $(elementAction).find('span').css('color', 'black');
              $(elementAction).find('.line1').css('background-color', '#fffd01');
              $(elementAction).find('.line2').css('background-color', '#04ff04');
              $(elementAction).find('.line3').css('background-color', '#04ffff');
              break;
            case 'Surligner les lignes 4 couleurs':
              lineAction(elementAction, 4);
              $(elementAction).css('color', '');
              $(elementAction).find('span').css('color', 'black');
              $(elementAction).find('.line1').css('background-color', '#fffd01');
              $(elementAction).find('.line2').css('background-color', '#04ff04');
              $(elementAction).find('.line3').css('background-color', '#04ffff');
              $(elementAction).find('.line4').css('background-color', '#FFA30F');
              break;
            case 'Colorer les syllabes':
              // console.log('Colorer les syllabes');
              // console.log(elementAction);
              decoupe('color-syllabes', elementAction);
              break;

          }
        }

      }
    };
  }
]);