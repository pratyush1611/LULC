#!python3
import os
import numpy as np
from osgeo import gdal

def value_extractinator():
        raster_file =0

        ds = gdal.Open(path + "/clipped_files/kota_1990_lulc_cnstn_clipped.tif")
        band =  ds.GetRasterBand(1)
        print(gdal.GetDataTypeName(band.DataType)   )

        #array = np.array(band.ReadAsArray())
        #values = np.unique(array)
        # Projection
        #print(ds.GetProjection())

        # Dimensions
        #print(ds.RasterXSize)
        #print(ds.RasterYSize)
        # Read raster data as numeric array from GDAL Dataset
        rasterArray = band  .ReadAsArray()
        print(rasterArray)
        # Number of bands
        #print(ds.RasterCount)
        #print("values"+ values)
        '''
        # Compute statistics if needed
        if band.GetMinimum() is None or band.GetMaximum()is None:
            band.ComputeStatistics(0)
            print("Statistics computed.")

        # Fetch metadata for the band
        band.GetMetadata()

        # Print only selected metadata:
        print ("[ NO DATA VALUE ] = ", band.GetNoDataValue()) # none
        print ("[ MIN ] = ", band.GetMinimum())
        print ("[ MAX ] = ", band.GetMaximum())
        '''
        #////////////////
        print("im done here")
value_extractinator()
