////NDVI

var NDinator = function(plngbnd , image)
{
  var ndvi;
  if (image.id().getInfo().toString() == "LC")
  {
    ndvi = image.normalizedDifference(['B5', 'B4']);
    ndbi = image.normalizedDifference(['B6', 'B5']);
  }

  return ndvi;
};
