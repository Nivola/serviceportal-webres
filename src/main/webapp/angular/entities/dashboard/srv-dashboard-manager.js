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
function serviceDashboardManagerBuilder(
	$http, loggers, conf, events, browserStorage, $injector,DashboarFactory,AuthenticationService
) {

	var logger = loggers.get("dashboard-manager");
    var thiz = this;
    
    var widgetConfig = {
        computeServiceDataProviderService: {
            accountUuid: undefined,
            refreshAutomatico: undefined,
            divisioneUuid:undefined,
            requiredUC:undefined,
            
        },
        dbaasDataProviderService: {
            accountUuid: undefined,
            refreshAutomatico: undefined,
            divisioneUuid:undefined

        },
        staasDataProviderService: {
            accountUuid: undefined,
            refreshAutomatico: undefined,
            divisioneUuid:undefined

        }
    };


	/* Interface */

    thiz.getDashboardPreferenceBucket;
    thiz.loadDashboard;

	/* Implementation */
    
    thiz.getDashboardPreferenceBucket = function(key) {
		key = cleanKey(key);
        return browserStorage.local.getBucket("dashboardConfig_" + key);
    }
    thiz.impostaWidgetConf = function(wiConf){
        widgetConfig = wiConf;
    }
    thiz.loadDashboard = function(key, options) {
        logger.debug("ROLE:",key);
        key = cleanKey(key);
        var dashboardConfigContainer = thiz.getDashboardPreferenceBucket(key);
        var storedDashboardConfig = dashboardConfigContainer.get();
        var source = "unknown";
        var data = DashboarFactory(key);
        var dataToLoad = data;
        var needToSave = false;

        if (storedDashboardConfig && storedDashboardConfig.version) {
            if (data.version != storedDashboardConfig.version) {
                logger.debug("configurazione dashboard reinizializzata per nuova specifica");
                source = "reset";
                needToSave = true;
            } else {
                logger.debug("configurazione dashboard ripristinata da storage");
                dataToLoad = storedDashboardConfig;
                source = "saved";
            }
        } else {
            logger.debug("configurazione dashboard inizializzata");
            source = "new";
            needToSave = true;
        }

        var built = _buildDashboard(key, dataToLoad, source, options || {});
        if (needToSave) {
            //commentato il salvataggio nello storage della confgurazione della dashboard
            //built.save();
        }
        return built;

    }

    /* Helpers */
    function cleanKey(key) {
        return key ? key : "default";
    }

    function _buildDashboard(key, config, source, options) {
    	var dashboard = {
            key : key,
			configuration : config,
            source : source,
			unsavedChanges : 0,
			editMode : false,
            savingChanges : false
        };

        dashboard.save = function() {
    		this.savingChanges = true;
            thiz.getDashboardPreferenceBucket(this.key).set(this.configuration);
            this.unsavedChanges = 0;
            this.savingChanges = false;
		};

        dashboard.setEditMode = function(editMode) {
            var data = this.configuration;
            data._isEditMode = editMode;
            data.dynamicColumns = editMode;
            data.resizeableColumns = editMode;
            this.editMode = editMode;

            $.each(data.columns, function(i0, column) {
                $.each(column.widgets, function(i1, widget) {
                    widget.sticky = !editMode;
                    widget.stickyControl = false;
                    widget.closeControl = editMode;
                    widget.controlsLayout = "default";
                    widget.resize = false;
                    widget.fullscreenControl = false;
                    widget._isEditMode = editMode;
                });
            });
        };

        dashboard.findWidget = function (name) {
            function widgetEqualName (widget) {
                return  widget.name === name ;
            }
            function widgetSearch (acc, col) {
                return acc || Object.values(col.widgets).find(widgetEqualName);
            }
            return Object.values(this.configuration.columns).reduce(widgetSearch, null);
            // alternativa
            // return Object.values(this.configuration.columns)
            //     .reduce((acc, col) => acc || Object.values(col.widgets).find(widget => widget.name === name), null);
        };

		dashboard.getWidgets = function () {
            function concatena (acc, col) {
                 return acc.concat(Object.values(col.widgets));
            }
            return Object.values(this.configuration.columns).reduce(concatena, []);
            // alternativa
            // return Object.values(this.configuration.columns)
            //    .reduce((acc, col) => acc.concat(Object.values(col.widgets)), []);
		};

	    dashboard.toggleEditMode = function() {
            this.setEditMode(!this.editMode);
        };

        dashboard.callback = function(e, configuration){
            logger.trace("dashboard_" + key + " received widget event " + e, configuration);

            if (!e.startsWith("$")) {
                logger.trace("event is custom, rerouting");

                var widget = dashboard.findWidget(configuration.name);
                if (widget && widget.dataProviderService) {
                    var providerService = $injector.get(widget.dataProviderService);
                    if (typeof providerService.eventCallback == "function") {
                        providerService.eventCallback(e, configuration);
                    };
                };
                
                if (dashboard.eventCallback) {
                    dashboard.eventCallback(e, configuration);
                };

            } else {
                logger.trace("event is layout, handling and maybe rerouting");
                dashboard.unsavedChanges ++;
                if (dashboard.layoutCallback) {
                    dashboard.layoutCallback(e, configuration);
                };
            };
        };

        dashboard.finalize = function() {
            $.each(dashboard.getWidgets(), function(i1, widget) {
                if (widget.dataProviderService) {
                    var dataProviderService = $injector.get(widget.dataProviderService);
                    if (typeof dataProviderService.finalize == "function") {
                        dataProviderService.finalize(widget);
                    }
                } else {
                    widget.data = {};
                }
            });
		};

        angular.extend(dashboard, options);

        $.each(dashboard.getWidgets(), function(i1, widget) {
            widget.data = {};
			if (widget.dataProviderService) {
                widget.data = widgetConfig[widget.dataProviderService] || {};
                var dataProviderService = $injector.get(widget.dataProviderService);
                if (typeof dataProviderService.provide == "function") {
                    dataProviderService.provide(widget);
                }
			} 
		});

        dashboard.setEditMode(false);
    	return dashboard;
	}
}

angular.module('app').service(
	'DashboardManagerService',
	['$http', 'loggers', 'conf', 'events', 'browserStorage', '$injector','DashboarFactory','AuthenticationService',
	serviceDashboardManagerBuilder]);
