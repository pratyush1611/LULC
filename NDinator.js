////NDVI

var NDinator = function(plngbnd , image)
{
  var ndvi , ndbi;
  if (image.id().getInfo().toString() == "LC")
  {
    ndvi = image.normalizedDifference(['B5', 'B4']);
    ndbi = image.normalizedDifference(['B6', 'B5']);
  }
  else
  {
    ndvi = image.normalizedDifference(['B4', 'B3']);
    ndbi = image.normalizedDifference(['B5', 'B4']);
  }
  return [ndvi , ndbi];
};
