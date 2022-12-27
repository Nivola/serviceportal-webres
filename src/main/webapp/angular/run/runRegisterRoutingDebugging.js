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
nivolaApp.run(['$rootScope', '$state', 'loggers', 'utils', function ($rootScope, $state, loggers, utils) {

    var logger = loggers.get("routing");

    $rootScope.$on('stateChangeCanceled', function () {
        $rootScope.stateChanging = false;
        $rootScope.stateChangingModal = false;
        $rootScope.stateChangingAny = false;
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var targetIsModal = (!!toParams.inModal) || (toState.data && toState.data.MODALE);
        logger.trace('$stateChangeStart to ' + toState.name + '- fired when the transition begins. toState,toParams : ', toState, toParams);
        $rootScope.stateChanging = !targetIsModal;
        $rootScope.stateChangingModal = targetIsModal;
        $rootScope.stateChangingAny = true;
    });

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        logger.error('Errore durante il cambiamento di stato.', arguments);
        $rootScope.stateChanging = false;
        $rootScope.stateChangingModal = false;
        $rootScope.stateChangingAny = false;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        logger.trace('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        $rootScope.stateChanging = false;
        $rootScope.stateChangingModal = false;
        $rootScope.stateChangingAny = false;
    });

    $rootScope.$on('$viewContentLoaded', function (event) {
        logger.trace('$viewContentLoaded - fired after dom rendered', event);

        if ($state.current.scrollTo){
            utils.scrollToElement($state.current.scrollTo, 500);
        }
    });

    $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
        logger.error('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.',
            {unfoundState: unfoundState, fromState: fromState, fromParams: fromParams}
        );
        $rootScope.stateChanging = false;
        $rootScope.stateChangingModal = false;
        $rootScope.stateChangingAny = false;
    });
}]);
