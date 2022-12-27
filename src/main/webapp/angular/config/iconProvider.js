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
nivolaApp.config(function ($mdIconProvider) {
    // Configure URLs for icons specified by [set:]id.

    $mdIconProvider
        // .defaultFontSet('fa')                               // This sets our default fontset className.
        // .defaultIconSet('img/os/operating-system-48.svg')   // Register a default set of SVG icons
        // .iconSet('social', 'img/os/social.svg')             // Register a named icon set of SVGs

        // OS
        .icon('osx', 'img/os/apple-logo-48.svg')               // Register a specific icon (by name)
        .icon('centos', 'img/os/centos-50.svg')                // Register a specific icon (by name)
        .icon('debian', 'img/os/debian-48.svg')                // Register a specific icon (by name)
        .icon('freebsd', 'img/os/freebsd-48.svg')              // Register a specific icon (by name)
        .icon('linux', 'img/os/linux-48.svg')                  // Register a specific icon (by name)
        .icon('os', 'img/os/operating-system-48.svg')          // Register a specific icon (by name)
        .icon('redhat', 'img/os/red-hat-50.svg')               // Register a specific icon (by name)
        .icon('suse', 'img/os/suse-48.svg')                    // Register a specific icon (by name)
        .icon('ubuntu', 'img/os/ubuntu-48.svg')                // Register a specific icon (by name)
        .icon('windows', 'img/os/windows-48.svg')              // Register a specific icon (by name)

        // .icon('work:chair', 'img/os/chair.svg');            // Register icon in a specific set

        // DB
        .icon('db', 'img/db/db.svg')                           // Register a specific icon (by name)
        .icon('oracle', 'img/db/oracle.svg')                   // Register a specific icon (by name)
        .icon('mysql', 'img/db/mysql.svg')                     // Register a specific icon (by name)
        .icon('postgresql', 'img/db/postgresql.svg')           // Register a specific icon (by name)
        .icon('sqlserver', 'img/db/sqlserver.svg')             // Register a specific icon (by name)


        .icon('sg-template-1', 'img/temp/sg-template-1.svg')   // Register a specific icon (by name)
        .icon('sg-template-2', 'img/temp/sg-template-2.svg')   // Register a specific icon (by name)
        .icon('sg-template-3', 'img/temp/sg-template-3.svg')   // Register a specific icon (by name)
        .icon('sg-template-4', 'img/temp/sg-template-4.svg')   // Register a specific icon (by name)

});
