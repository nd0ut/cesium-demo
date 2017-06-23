function pointsHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g'
  }))

  Cesium.GeoJsonDataSource.load('/data/test_cesium/points.json', {
      markerSymbol: 'town-hall'
    })
    .then(function(source) {
      viewer.dataSources.add(source);

      var entities = source.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.label = new Cesium.LabelGraphics({
          text: entity.properties.title.getValue(),
          font: '12px Helvetica',
          fillColor: Cesium.Color.BLACK,
          style: Cesium.LabelStyle.FILL,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, -60),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 7000)
        });
      }
    });

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0)
  });
}

function contoursHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g'
  }))

  Cesium.GeoJsonDataSource.load('/data/test_cesium/contours.json')
    .then(function(source) {
      viewer.dataSources.add(source);

      Cesium.Math.setRandomNumberSeed(0);
      var entities = source.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var id = entity.properties.cartodb_id.getValue();
        var color = [Cesium.Color.GREEN, Cesium.Color.YELLOW, Cesium.Color.RED][id % 3];
        
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.BLACK;        
        entity.polygon.outlineWidth = 2;
        entity.polygon.material = color;
        entity.polygon.extrudedHeight = Cesium.Math.nextRandomNumber() * 5000;
      }
    });

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0)
  });
}

function terrainHandler() {
  reset();
  viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider())
  var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'http://192.168.99.100:8080/tilesets/height3'
  });
  viewer.terrainProvider = cesiumTerrainProviderMeshes;

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(37.57, 55.47, 10000.0)
  });
}

function imageHandler() {
  reset();

  var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask: false,
    requestVertexNormals: true
  });
  viewer.terrainProvider = cesiumTerrainProviderMeshes;

  viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }))

  var tms = Cesium.createTileMapServiceImageryProvider({
    url : '/data/test_cesium/image',
    fileExtension: 'png'
  }); 

  viewer.imageryLayers.addImageryProvider(tms);
  
  var center = Cesium.Cartesian3.fromDegrees(-122.53, 38.1, 40000.0)
  var heading = 5.755541504942888;
  var pitch = -0.18077455945038823;
  var range = 5000.0;
  
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3( -2716003.1025927025, -4277713.204441832, 3879433.2266100366 ),
    orientation: new Cesium.HeadingPitchRange(heading, pitch, range),
    duration: 0
  });

}
