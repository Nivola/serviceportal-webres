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
nivolaApp.directive("dropzone", function() {
  return {
      restrict : "A",
      link: function (scope, elem) {
          elem.bind('drop', function(evt) {
              evt.stopPropagation();
              evt.preventDefault();

              var files = evt.dataTransfer.files;
              for (var i = 0, f; f = files[i]; i++) {
                  var reader = new FileReader();
                  reader.readAsArrayBuffer(f);

                  reader.onload = (function(theFile) {
                      return function(e) {
                          var newFile = { name : theFile.name,
                              type : theFile.type,
                              size : theFile.size,
                              lastModifiedDate : theFile.lastModifiedDate
                          }

                          scope.addfile(newFile);
                      };
                  })(f);
              }
          });
      }
  }
});
