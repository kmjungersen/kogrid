# kogrid.js

Easily build Knockout grids without the excessive markup, all done entirely with JS.  Kogrid uses a knockout observable array to generate a dynamic grid.  Update the array, and the UI is automatically updated as well, fully leveraging the power of knockout.

## Example

With a single JS entry point, we can create a grid like so:

HTML Markup:
```html
<div id="some-grid" class="kogrid"></div>
```

app.js:
```javascript
var koArray = ko.observableArray([]);

// Add some items to the observable array...

var gridOptions = {
    rawData: koArray,
    headers: [
        {
            columnName: 'column1',
            width: 'col-xs-4',
            sortable: false
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
}

var grid = new kogrid.Grid(gridOptions);
```

And that's it!
