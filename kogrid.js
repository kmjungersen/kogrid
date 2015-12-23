// KNOCKOUT DYNAMIC GRID

ko.bindingHandlers.foreachprop = {
    transformObject: function (obj) {
        var properties = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                properties.push({ key: key, value: obj[key] });
            }
        }
        return properties;
    },
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            properties = ko.bindingHandlers.foreachprop.transformObject(value);
        ko.applyBindingsToNode(element, { foreach: properties }, bindingContext);
        return { controlsDescendantBindings: true };
    }
};

var sampleOptions = {
    headers: [
        {
            columnName: 'column1',
            width: 'col-xs-4',
            sortable: true
        },{
            columnName: 'column2',
            width: 'col-xs-4',
            sortable: true
        },{
            columnName: 'column3',
            width: 'col-xs-4',
            sortable: true
        }
    ],
    width: '400px',
    height: '400px',
    data: ko.observableArray,
    onClick: function(index, object){ }
}

var defaultOptions = {
    width: '400px',
    height: '400px',
    data: ko.observableArray,
    onClick: function(index, object){ }
}

var kogridErrorHandler = (function() {
    function Handler() {
        var _self = this;

        _self.errMsgs = {
            noOptions: 'Error: no options passed to kogrid!',
            noErrMsg: 'Error: no error message of this type does not exist!',
            miscError: 'Error: something went wrong!',
            noData: 'Error: kogrid needs a configured data-source!',
            noTargetElement: 'Error: kogrid needs a target element!',
            elementNotSetup: 'Error: targetElement must be set up before applying knockout bindings!'
        }

        _self.log = function(errorName) {
            var errMsg = _self.errMsgs[errorName];

            if (!errMsg) {
                errMsg = _self.errMsgs.noErrMsg;
            }
            console.error(errMsg);
        }
    }

    return {
        Handler: Handler
    }
})();

var kogridConstants = {
    gridBody:
        '<div class="kogrid-body" data-bind="foreach: data">\
            <div class="row" data-bind="foreachprop: $data">\
                <div class="col-xs-2">\
                    <span data-bind="text: value"></span>\
                </div>\
            </div>\
        </div>',
    regexPercent: /(.*)\w+%/g,
    regexPixels: /(.*)\w+px/g,
    regexBootstrapColumn: /col(.*)\w+/g
}

var kogrid = (function(errorHandler, kogridConstants, defaultOptions){
    function Grid(options) {
        var _self = this;

        _self.errorHandler = errorHandler;
        _self.constants = kogridConstants;
        _self.defaultOptions = defaultOptions;

        _self.options = options;
        _self.elementReady = false;

        _self.applyDimension = function(dimensionType, dimensionValue, targetElement) {
            if (dimensionValue.match(_self.constants.regexPercent) ||
            dimensionValue.match(_self.constants.regexPixels)) {
                $(targetElement).css(dimensionType, dimensionValue);
                return 'css';
            }
            else if (dimensionValue.match(_self.constants.regexBootstrapColumn)) {
                $(targetElement).addClass(dimensionValue);
                return 'class';
            }
            return null;
        }

        _self.elementSetup = function(targetElement) {
            var element = $(targetElement);

            element.append(_self.constants.gridBody);

            _self.applyDimension('width', _self.options.width, targetElement);
            _self.applyDimension('height', _self.options.height, targetElement);

            _self.elementReady = true;

            return element;
        }

        _self.applyBindings = function(targetElement) {
            // _self.elementSetup(targetElement);
            if (_self.elementReady) {
                ko.applyBindings(options, targetElement);
            }
            else {
                _self.errorHandler.log('elementNotSetup');
            }
        }

        _self.buildOptions = function(options) {
            for (var key in _self.defaultOptions) {
                if (!options.hasOwnProperty(key)) {
                    options[key] = _self.defaultOptions[key];
                }
            };
            return options
        }

        _self.optionsCheck = function(options) {
            if (!options){
                _self.errorHandler.log('noOptions');
                return false;
            } else if (!options.rawData) {
                _self.errorHandler.log('noData');
                return false;
            } else if (!options.targetElement) {
                _self.errorHandler.log('noTargetElement');
                return false;
            }

            return options;
        }

        _self.init = function() {
            _self.options = _self.optionsCheck(_self.options);
            _self.options = _self.buildOptions(_self.options);
            _self.elementSetup(_self.options.targetElement);
            _self.applyBindings(_self.options.targetElement);
        }();

    }

    return {
        Grid: Grid
    }

})(
    new kogridErrorHandler.Handler(),
    kogridConstants
);
