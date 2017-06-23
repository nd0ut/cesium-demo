var viewer = new Cesium.Viewer('cesiumContainer', {
});
viewer.extend(Cesium.viewerCesiumNavigationMixin, {});

var defaultTerrainProvider = viewer.terrainProvider;

viewer.scene.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0)
});

function reset() {
  viewer.terrainProvider = defaultTerrainProvider;
  viewer.imageryLayers.removeAll();
  viewer.dataSources.removeAll();
  viewer.entities.removeAll();
  viewer.trackedEntity = undefined;
  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(30.315785, 59.939039, 40000.0),
    duration: 0
  });
}
