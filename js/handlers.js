function geojsonHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g'
  }))

  viewer.dataSources.add(Cesium.GeoJsonDataSource.load('/data/st-petersburg.geojson', {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.GREEN.withAlpha(0.4),
    strokeWidth: 3
  }));

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0)
  });
}

function pointsHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g'
  }))

  Cesium.GeoJsonDataSource.load('/data/spb_points.geojson', {
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

function geojsonExtrudedHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.MapboxImageryProvider({
    mapId: 'mapbox.streets-basic',
    accessToken: 'pk.eyJ1IjoiYW5hbHl0aWNhbGdyYXBoaWNzIiwiYSI6ImNpd204Zm4wejAwNzYyeW5uNjYyZmFwdWEifQ.7i-VIZZWX8pd1bTfxIVj9g'
  }))

  Cesium.GeoJsonDataSource.load('/data/st-petersburg.geojson')
    .then(function(source) {
      viewer.dataSources.add(source);

      Cesium.Math.setRandomNumberSeed(0);
      var entities = source.entities.values;
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.polygon.outline = false;
        entity.polygon.material = Cesium.Color.fromRandom({
          alpha: 1
        })
        entity.polygon.extrudedHeight = Cesium.Math.nextRandomNumber() * 5000;
      }
    });

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0)
  });
}

function planeHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }))

  Cesium.Math.setRandomNumberSeed(3);

  var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
  var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.multiplier = 10;

  viewer.timeline.zoomTo(start, stop);

  function computeCirclularFlight(lon, lat, radius) {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i <= 360; i += 45) {
      var radians = Cesium.Math.toRadians(i);
      var time = Cesium.JulianDate.addSeconds(start, i * 10, new Cesium.JulianDate());
      var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 500);
      property.addSample(time, position);
    }
    return property;
  }

  var position = computeCirclularFlight(30.315785, 59.939039, 0.03);
  var entity = viewer.entities.add({

    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: start,
      stop: stop
    })]),

    position: position,

    orientation: new Cesium.VelocityOrientationProperty(position),

    model: {
      uri: 'data/Cesium_Air.gltf',
      minimumPixelSize: 64,
    }
  });

  viewer.trackedEntity = entity;

  entity.position.setInterpolationOptions({
    interpolationDegree: 5,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });

}

function terrainHandler() {
  reset();
  viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }))
  var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
    url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
    requestWaterMask: true,
    requestVertexNormals: true
  });
  viewer.terrainProvider = cesiumTerrainProviderMeshes;
  var target = new Cesium.Cartesian3(300770.50872389384, 5634912.131394585, 2978152.2865545116);
  var offset = new Cesium.Cartesian3(6344.974098678562, -793.3419798081741, 2499.9508860763162);
  viewer.camera.lookAt(target, offset);
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}

function imageHandler() {
  reset();

  viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  }))

  viewer.entities.add({
      rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(30.315785, 59.939039, 31, 60),
          material: new Cesium.ImageMaterialProperty({
              image: 'data/logo.png'
          }),
      }
  });
}
