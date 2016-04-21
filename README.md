# GeoStore

This package is part of the [Terraformer](http://terraformer.io) project.

`Terraformer.GeoStore` is a class built for handing lightweight storage and querying of large amounts of [GeoJSON Features](http://www.geojson.org/geojson-spec.html#feature-objects). It is very fast and index the [rough US counties data](https://github.com/Esri/Terraformer/blob/master/examples/geostore/counties_rough.json) (about 950k) in about 120ms and search for which county contains a point in about 6.5ms. These numbers are form the latest version of Chrome.

## Installing

### Node.js

```
$ npm install terraformer-geostore
$ npm install terraformer-rtree
$ npm install terraformer-geostore-memory
```

### Browser

In the browser, [Terraformer](http://github.com/esri/terraformer) is required.

You can use [Bower](http://bower.io/) to install the components if you like or download them and host them yourself.

```
$ bower install terraformer-geostore
$ bower install terraformer-rtree
$ bower install terraformer-geostore-memory
```

## Documentation

For a full guide to GeoStore check out the [Terraformer website](http://terraformer.io/geostore/).

```js
var store = new Terraformer.GeoStore({
  store: new Terraformer.Store.Memory(),
  index: new Terraformer.RTree()
});

// Add a GeoJSON feature
store.add({
  "type": "Feature",
  "properties": {
    "name": "Ladds Addition"
  },
  "id": "ladds-addition",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [ [ -122.65355587005614, 45.50499344809821 ], [ -122.65355587005614, 45.512061121601 ], [ -122.64535903930664, 45.512061121601 ], [ -122.64535903930664, 45.50499344809821 ], [ -122.65355587005614, 45.50499344809821 ] ]
    ]
  }
}, function (err, success) {
  // callback when the geojson is added
});

// You can also add FeatureCollections of multiple Features
store.add({
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Esri PDX"
      },
      "id": "esri-pdx",
      "geometry": {
        "type": "Point",
        "coordinates": [ -122.67629563808441, 45.51646293140592 ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Barista"
      },
      "id": "barista",
      "geometry": {
        "type": "Point",
        "coordinates": [ -122.67520129680635, 45.51926322043975 ]
      }
    }
  ]
}, function (err, success) {
  // callback when all features are added
});

// ask the store which features are within a given polygon.
store.within({
  "type": "Polygon",
  "coordinates": [
    [ [-122.69290924072266, 45.54038305764738], [-122.72054672241211, 45.535453299886896], [-122.69479751586914, 45.51464736754301], [-122.67848968505858, 45.495398037299395], [-122.66836166381836, 45.495398037299395], [-122.66681671142577, 45.50321887154943], [-122.67127990722655, 45.51067773196122], [-122.67127990722655, 45.522585798722176], [-122.67110824584961, 45.53028260179986], [-122.69290924072266, 45.54038305764738] ]
  ]
}, function (err, results) {
  for (var i = results.length - 1; i >= 0; i--) {
    console.log(results[i].id);
  };
});
```

## Resources

* [Terraformer Website](http://terraformer.io)
* [twitter@EsriPDX](http://twitter.com/esripdx)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

[](Esri Tags: Terraformer GeoJSON GeoStore)
[](Esri Language: JavaScript)
