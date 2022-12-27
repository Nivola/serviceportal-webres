/*-
 * ========================LICENSE_START=================================
 * Nivola Service Portal Web Resources
 * %%
 * Copyright (C) 2022 CSI Piemonte
 * %%
 * SPDX-FileCopyrightText: Copyright 2022 | CSI Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
nivolaApp.directive('fileDrag', function () {
    return {
      restrict: 'A',
      link: function (scope, elem) {
        elem.bind('drop', function(e){
          e.preventDefault();
          e.stopPropagation();
          var file = e.dataTransfer.files[0], reader = new FileReader();
            reader.onload = function (event) {
            console.log(event.target);
            elem.style.background = 'url(' + event.target.result + ') no-repeat center';
          };
          console.log(file);
          reader.readAsDataURL(file);
  
          return false;
        });
      }
    };
  });
