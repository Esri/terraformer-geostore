(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory(require("terraformer"));
  }

  // Browser Global.
  if(typeof root.navigator === "object") {
    if (!root.Terraformer){
      throw new Error("Terraformer.GeoStore requires the core Terraformer library. http://github.com/esri/terraformer")
    }
    root.Terraformer.GeoStore = factory(root.Terraformer).GeoStore;
  }

}(this, function(Terraformer) {
