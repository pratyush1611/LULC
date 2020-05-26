//FILTERED IMAGECOLELCTIONS
var coll5 = landsat_5.filterDate('1984-01-01', '2020-05-01')
   .filterBounds(filter_bdry)
   .filter(ee.Filter.lt('CLOUD_COVER', 5));
   //Map.addLayer(landsat_5);

var coll7 = landsat_7.filterDate('1984-01-01',  '2020-05-01')
   .filterBounds(filter_bdry)
   .filter(ee.Filter.lt('CLOUD_COVER', 5));
   //Map.addLayer(landsat_7);

var coll8 = landsat_8.filterDate('1984-01-01', '2020-05-01')
   .filterBounds(filter_bdry)
   .filter(ee.Filter.lt('CLOUD_COVER', 5));
   //Map.addLayer(landsat_8);

///////////////////////////////////////////////////// classifier
var classificator = function(image, newfc , bands)
{
  var training = image.select(bands).sampleRegions(
  {
    collection: newfc,
    properties: ['landcover'],
    scale: 30
  });

  var classifier = ee.Classifier.cart().train(
  {
    features: training,
    classProperty: 'landcover',
    inputProperties: bands
  });
  var classified = image.select(bands).classify(classifier);

  return [ classified, ee.String(image.id().slice(12,16)).toString().slice(251,255)];
};// EoF classificator

////////////////////// LULC showinator//////////
var LULCinator = function(in_classi, plng_bnd ,no_of_classes, showMap)
{
  var classified = in_classi[0];
  var namee = in_classi[1];
  print("showing classified images: " + namee);
  if (showMap == 1)
    {
    showMap = true;
    }
  else
    {
    showMap = false;
    }
  switch(no_of_classes)
  {
    case 5: //two type barren
      Map.addLayer(classified.clip(plng_bnd), {min: 1, max: 5, palette: ['red', 'green', 'blue','yellow','FF4B4B'/*'F3DB10'*/]}, namee + '_lulc', showMap);
      break;
    case 6: //two type urban and two type barren
      Map.addLayer(classified.clip(plng_bnd), {min: 1, max: 6, palette: ['red', 'green', 'blue','yellow','FF4B4B','F3DB10'] }, namee + '_lulc',showMap);
      break;
    case 7: //two type barren 2 urban 2 green 1  water
      Map.addLayer(classified.clip(plng_bnd), {min: 1, max: 7, palette: ['red', 'green', 'blue','yellow','F3DB10','FF4B4B','purple'] }, namee + '_lulc',showMap);
      break;
    default:
      Map.addLayer(classified.clip(plng_bnd), {min: 1, max: 4, palette: ['red', 'green', 'blue','yellow']}, namee + '_lulc',showMap);
      break;
  }//end of switch case
};//end of function lulcinator


/////////////////////  LST_nator
var lst_creatinator = function(planning_bound, img_name)
{
  var raw_img_clcn = "";  var image_raw;  var geet = require('users/elacerda/geet:geet');  var new_toa_radiance;  var brightness_temp_img;
  var l5_ndvi;  var l7_ndvi;  var l8_ndvi;
  var img_pv;  var lse;  var surfTemp_img;  var lst_image;

  if (img_name.slice(0,2) == "LT") //landsat 5
  {
    raw_img_clcn = 'LANDSAT/LT05/C01/T1/';
    image_raw = ee.Image( raw_img_clcn + img_name).clip(planning_bound);

    new_toa_radiance = geet.toa_radiance(image_raw, 6);
    brightness_temp_img = geet.brightness_temp_l5c(new_toa_radiance, true);
    l5_ndvi = geet.ndvi_l5(brightness_temp_img);
    img_pv = geet.prop_veg(l5_ndvi);
    lse = geet.surface_emissivity(img_pv);
    surfTemp_img = geet.surface_temperature_oli(lse);
    lst_image = surfTemp_img.select("LST");
  }
  else if (img_name.slice(0,2) == "LC") // landsat 8
  {
    raw_img_clcn = 'LANDSAT/LC08/C01/T1/';
    image_raw = ee.Image( raw_img_clcn + img_name).clip(planning_bound);
    new_toa_radiance = geet.toa_radiance(image_raw, 10 )
    brightness_temp_img = geet.brightness_temp_l8c(new_toa_radiance, true);
    l8_ndvi = geet.ndvi_l8(brightness_temp_img);
    img_pv = geet.prop_veg(l8_ndvi);
    lse = geet.surface_emissivity(img_pv);
    surfTemp_img = geet.surface_temperature_oli(lse);
    lst_image = surfTemp_img.select("LST");

  }
  else //landsat 7
  {
    raw_img_clcn = 'LANDSAT/LE07/C01/T1/';
    image_raw = ee.Image(raw_img_clcn + img_name).clip(planning_bound);
    new_toa_radiance = geet.toa_radiance(image_raw, '6_VCID_1');
    brightness_temp_img = geet.brightness_temp_l7c(new_toa_radiance, true);
    l7_ndvi = geet.ndvi_l7(brightness_temp_img);
    img_pv = geet.prop_veg(l7_ndvi);
    lse = geet.surface_emissivity(img_pv);
    surfTemp_img = geet.surface_temperature_tm(lse);
    lst_image = surfTemp_img.select("LST");
  }


  return lst_image;
};//end of lst function

////////////////////  expoerterinator
var exporterinator = function(planning_bound, img, imgtyp, img_nm)
{
 switch(imgtyp)
 {
 case 0:
   // IMG 432 fcc
   var  band_list= []
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
       folder: 'FCC_visual_baroda',
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
       folder: 'LULC_baroda',
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
       folder: 'LST_baroda',
       scale: 30,
       region: planning_bound
     });
   break;
 }
} //eof exporterinator

/////////////////  B E G I N   - - -   C O D I N G ///////////////////////
////////////// align map ////////////////
Map.setCenter(74.87134, 31.63578, 12);

/////  make collection  /////////////
print("starting code \n");

var start = ee.Date('1984-01-01');
var finish = ee.Date('2020-05-22');

var rgb_vis =  {    min : 0,    max : 0.3,    bands : ['B4', 'B3', 'B2']  };
var rgb_vis_l8 =  {    min : 0,    max : 0.3,    bands : ['B5', 'B4', 'B3']  };


var img1990=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_148038_19900309');
var img1992=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_148038_19920314');
var img1994=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_148038_19940304');
var img1996=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_148038_19960309');
var img1998=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_148038_19980315');
var img2010=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_149038_20100307');
var img2011=ee.Image('LANDSAT/LT05/C01/T1_TOA/LT05_149038_20110310');
var img2014=ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_149038_20140302');
var img2016=ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_149038_20160307');
var img2018=ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_148038_20180306') ;

/*
Map.addLayer(img1990.clip(filter_bdry), rgb_vis,'1990');
Map.addLayer(img1992.clip(filter_bdry), rgb_vis,'1992');
Map.addLayer(img1994.clip(filter_bdry), rgb_vis,'1994');
Map.addLayer(img1996.clip(filter_bdry), rgb_vis,'1996');
Map.addLayer(img1998.clip(filter_bdry), rgb_vis,'1998');
*/
Map.addLayer(img2010, rgb_vis, '2010');
Map.addLayer(img2011, rgb_vis, '2011');
Map.addLayer(img2014, rgb_vis_l8, '2014');
Map.addLayer(img2016, rgb_vis_l8, '2016');
Map.addLayer(img2018, rgb_vis_l8, '2018');


////bands
var bands = ['B2', 'B3', 'B4', 'B5', 'B6' ,'B7'];
var bandsL7 = ['B2', 'B3', 'B4', 'B5', 'B6_VCID_1','B6_VCID_2', 'B7','B8'];
var bandsL8 = ['B2','B3', 'B4', 'B5', 'B6' ,'B7'];
///////////

var newfc = urban1990.merge(vegetation1990).merge(water1990).merge(barren1990);
var classified_1990 = classificator(img1990, newfc, bands);
var newfc = urban1992.merge(vegetation1992).merge(water1992).merge(barren1992);
var classified_1992 = classificator(img1992, newfc, bands);
var newfc = urban1994.merge(vegetation1994).merge(water1994).merge(barren1994);
var classified_1994 = classificator(img1994, newfc, bands);
var newfc = urban1996.merge(vegetation1996).merge(water1996).merge(barren1996);
var classified_1996 = classificator(img1996, newfc, bands);
var newfc = urban1998.merge(vegetation1998).merge(water1998).merge(barren1998);
var classified_1998 = classificator(img1998, newfc, bands);
var newfc = urban2010.merge(vegetation2010).merge(water2010).merge(barren2010);
var classified_2010 = classificator(img2010, newfc, bands);
var newfc = urban2012.merge(vegetation2012).merge(water2012).merge(barren2012);
var classified_2011 = classificator(img2011, newfc, bands);
var newfc = urban2014.merge(vegetation2014).merge(water2014).merge(barren2014);
var classified_2014 = classificator(img2014, newfc, bands);
var newfc = urban2016.merge(green2016).merge(water2016).merge(barren2016);
var classified_2016 = classificator(img2016, newfc, bandsL8);
var newfc = urban2018.merge(green2018).merge(water2018).merge(barren2018);
var classified_2018 = classificator(img2018, newfc, bandsL8);
/////////////replace urban consistency
/*
var classified_1992_new= classified_1992[0].where(classified_1990[0].eq(1),1);
var classified_1994_new= classified_1994[0].where(classified_1992[0].eq(1),1);
var classified_1996_new= classified_1996[0].where(classified_1994[0].eq(1),1);
var classified_1998_new= classified_1998[0].where(classified_1996[0].eq(1),1);
*/
//var classified_2010_new= classified_2010.where(LULC2008.eq(1),1); //import LULC2008 from assets
var classified_2011_new= classified_2011[0].where(classified_2010[0].eq(1),1);
var classified_2014_new= classified_2014[0].where(classified_2011_new.eq(1),1);
var classified_2016_new= classified_2016[0].where(classified_2014_new.eq(1),1);
var classified_2018_new= classified_2018[0].where(classified_2016_new.eq(1),1);

/////// ADD MAPS TO DISPLAY
//LULCinator([classified_1990[0], "1990"], amritsarMB, 4, 0);
//LULCinator([classified_1992_new, "1992"], amritsarMB, 4, 0);
//LULCinator([classified_1994_new, "1994"], amritsarMB, 4, 0);
//LULCinator([classified_1996_new, "1996"], amritsarMB, 4, 0);
//LULCinator([classified_1998_new, "1998"], amritsarMB, 4, 0);
LULCinator([classified_2010[0], "2010"], amritsarMB, 4, 0);
LULCinator([classified_2011_new, "2011"], amritsarMB, 4, 0);
LULCinator([classified_2014_new, "2014"], amritsarMB, 4, 0);
LULCinator([classified_2016_new, "2016"], amritsarMB, 4, 1);
LULCinator([classified_2018_new, "2018"], amritsarMB, 4, 1);

//BOUNDARY
Map.addLayer(amritsarMB.style({color: 'black', fillColor: '00000000'}),{},'muni_bnd',true);





/*
exporterinator(brc_muni, img1988, 0, "Baroda_1988" );
exporterinator(brc_muni, classified_1988_new, 1, "Baroda_1988" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19880319'), 2, "Baroad_1988");

exporterinator(brc_muni, img1990, 0, "Baroda_1990" );
exporterinator(brc_muni, classified_1990_new, 1, "Baroda_1990" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19900325'), 2, "Baroad_1990");

exporterinator(brc_muni, img1992, 0, "Baroda_1992" );
exporterinator(brc_muni, classified_1992_new, 1, "Baroda_1992" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19920314'), 2, "Baroad_1992");

exporterinator(brc_muni, img1994, 0, "Baroda_1994" );
exporterinator(brc_muni, classified_1994_new, 1, "Baroda_1994" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19940304'), 2, "Baroad_1994");

exporterinator(brc_muni, img1996, 0, "Baroda_1996" );
exporterinator(brc_muni, classified_1996_new, 1, "Baroda_1996" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19960325'), 2, "Baroad_1996");

exporterinator(brc_muni, img1998, 0, "Baroda_1998" );
exporterinator(brc_muni, classified_1998_new, 1, "Baroda_1998" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_19980315'), 2, "Baroad_1998");

exporterinator(brc_muni, img2000, 0, "Baroda_2000" );
exporterinator(brc_muni, classified_2000_new, 1, "Baroda_2000" );
exporterinator(brc_muni, lst_creatinator(brc_muni,'LT05_148045_20000320'), 2, "Baroad_2000");

print("exp");
*/
