/**
 * @module conditioner/BehaviorController
 */
Namespace.register('conditioner').BehaviorController = (function(Injector,ConditionManager) {

    'use strict';



    /* matches helper */
    var _matchesMethod = null;
    var _matchesSelector = function(element,selector) {

        if (!element) {
            return false;
        }

        if (!_matchesMethod) {
            var el = document.body;
            if (el.matches) {
                _matchesMethod = 'matches';
            }
            else if (el.webkitMatchesSelector) {
                _matchesMethod = 'webkitMatchesSelector';
            }
            else if (el.mozMatchesSelector) {
                _matchesMethod = 'mozMatchesSelector';
            }
            else if (el.msMatchesSelector) {
                _matchesMethod = 'msMatchesSelector';
            }
            else if (el.oMatchesSelector) {
                _matchesMethod = 'oMatchesSelector';
            }
        }

        return element[_matchesMethod](selector);
    };



    /**
     * Constructs BehaviorController objects.
     *
     * @class BehaviorController
     * @constructor
     * @param {String} id - id of behavior
     * @param {Object} options - options for this behavior controller
     */
    var BehaviorController = function(id,options) {

        // if no element, throw error
        if (!id) {
            throw new Error('BehaviorController(id,options): "id" is a required parameter.');
        }

        // options for class behavior controller should load
        this._id = id;

        // options for behavior controller
        this._options = options || {};

    };


    // prototype shortcut
    var p = BehaviorController.prototype;


    /**
     * Initializes the behavior controller
     * @method init
     */
    p.init = function() {

        // check if conditions specified
        this._conditionManager = new ConditionManager(
            this._options.conditions,
            this._options.target
        );

        // listen to changes in conditions
        Observer.subscribe(this._conditionManager,'change',this._onConditionsChange.bind(this));

        // if already suitable, load behavior
        if (this._conditionManager.getSuitability()) {
            this._loadBehavior();
        }

    };


    /**
     * Called when the conditions change.
     * @method _onConditionsChange
     */
    p._onConditionsChange = function() {

        var suitable = this._conditionManager.getSuitability();

        if (this._behavior && !suitable) {
            this.unloadBehavior();
        }

        if (!this._behavior && suitable) {
            this._loadBehavior();
        }

    };


    /**
     * Load the behavior set in the data-behavior attribute
     * @method _loadBehavior
     */
    p._loadBehavior = function() {

        var self = this;
        Injector.constructClass(

            // class identifier
            this._id,

            // target element
            this._options.target,

            // target element options
            this._options.options,

            // instance return method
            function(instance){

                // set behavior reference
                self._behavior = instance;

                // propagate events from behavior to behaviorController
                Observer.setupPropagationTarget(self._behavior,self);
            }
        );
    };



    /**
     * Public method for unload the behavior
     * @method unloadBehavior
     * @return {Boolean}
     */
    p.unloadBehavior = function() {

        if (!this._behavior) {
            return false;
        }

        this._behavior._unload();
        this._behavior = null;

        return true;
    };


    /**
     * Public method to check if the behavior matches the given query
     * @method matchesQuery
     * @param {Object} query - query to match
     * @return {Boolean}
     */
    p.matchesQuery = function(query) {

        if (typeof query == 'string') {

            // if matches classpath
            if (query == this._classPath) {
                return true;
            }

            // check if matches query
            if (_matchesSelector(this._options.target,query)) {
                return true;
            }
        }

        return (query == this._options.target);
    };



    /**
     * Public method for safely executing methods on the loaded behavior
     * @method execute
     * @param {String} method - method key
     * @param {Array} params - array containing the method parameters
     * @return
     */
    p.execute = function(method,params) {

        // if behavior not loaded
        if (!this._behavior) {
            return null;
        }

        // once loaded call method and pass parameters
        return this._behavior[method].apply(this._behavior,params);

    };

    return BehaviorController;

}(conditioner.Injector,conditioner.ConditionManager));