#!python3
import os
import numpy as np
from osgeo import gdal
path = r"E:\earthEngine\million_plus\LULC\tester\try"
def value_extractinator():
        raster_file =0
        ds = gdal.Open(path + "/cls_1990_nakli_lulc.tif")
        band =  ds.GetRasterBand(1)
        print(gdal.GetDataTypeName(band.DataType)   )

        array = np.array(band.ReadAsArray())
        values = np.unique(array)

        rasterArray = band.ReadAsArray()
        unique_array ,count_array = (np.unique(rasterArray,return_index=False, return_inverse=False, return_counts=True, axis=None))
        array_unq_cnt = zip(unique_array,count_array)
        for item in array_unq_cnt:
            print(i[0] + " is " + i[1}+" times"])
        '''
        # Compute statistics if needed
        if band.GetMinimum() is None or band.GetMaximum()is None:
            band.ComputeStatistics(0)
            print("Statistics computed.")


        # Print only selected metadata:
        print ("[ NO DATA VALUE ] = ", band.GetNoDataValue()) # none
        print ("[ MIN ] = ", band.GetMinimum())
        print ("[ MAX ] = ", band.GetMaximum())
        '''
        #////////////////////////////////
        # Projection
        #print(ds.GetProjection())
        # Fetch metadata for the band
        #print(band.GetMetadata())

        # Dimensions
        #print(ds.RasterXSize)
        #print(ds.RasterYSize)
        # Read raster data as numeric array from GDAL Dataset
        # Number of bands
        #print(ds.RasterCount)
        #print( "values" + values)
        #///////////////////////////////////
        #////////////////
        print("im done here")
value_extractinator()
