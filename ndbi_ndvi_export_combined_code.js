////NDVI

var NDinator = function(plngbnd , image)
{
  var ndvi,  ndbi;
  if (image.id().getInfo().toString().slice(0,2) == "LC")
  {
    ndvi = image.normalizedDifference(['B5', 'B4']);
    ndbi = image.normalizedDifference(['B6', 'B5']);
  }
  else
  {
    ndvi = image.normalizedDifference(['B4', 'B3']);
    ndbi = image.normalizedDifference(['B5', 'B4']);
  }
  return [ndvi, ndbi];
};
  

  
//////////////////////////////
//////    EXPORT CODE   //////
//////////////////////////////
////////////////////  expoerterinator
var exporter = function(planning_bound, img, imgtyp, img_nm)
{
  var placename = img_nm.slice(0,-4);
 switch(imgtyp)
 {
 case 0:
   // IMG 432 fcc
   var  band_list= [];
   if ((img.id().toString().slice(142,144)) == ("LC"))
     {
      //print(img_nm, ee.String(img.id().toString().slice(142,144)) )
      band_list = ['B5', 'B4', 'B3'];
     }
   else
     {
      //print(img_nm, 'nahi aaya')
      band_list = ['B4', 'B3', 'B2'];
     }

   Export.image.toDrive(  //fcc
     {

       image: img.clip(planning_bound).select(band_list),//['B4', 'B3', 'B2']),
       description: img_nm + '_fcc',
       folder: 'FCC_visual_'+placename,
       scale: 30,
       region: planning_bound

     });
   break;
 case 1:
   // LULC
   Export.image.toDrive(
     {
       image:img.clip(planning_bound),
       description: img_nm + '_lulc_cnstnt',
       folder: 'LULC_'+placename,
       scale: 30,
       region: planning_bound
     });
   break;
 case 2:
   //LST
   Export.image.toDrive(
     {
       image: img,
       description: img_nm + '_lst',
       folder: 'LST_'+placename,
       scale: 30,
       region: planning_bound
     });
   break;
 case 3:
   //NDVI
   Export.image.toDrive(
     {
       image: img[0],
       description: img_nm + '_ndvi',
       folder: 'NDVI_'+placename,
       scale: 30,
       region: planning_bound
     });
  //NDBI   
   Export.image.toDrive(
     {
       image: img[1],
       description: img_nm + '_ndbi',
       folder: 'NDBI_'+placename,
       scale: 30,
       region: planning_bound
     });     
   break;   
 }
}; //eof exporterinator
