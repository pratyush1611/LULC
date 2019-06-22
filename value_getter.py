#!python3
import os
import re
import numpy as np
import pandas as pd
from osgeo import gdal
path = r"E:\earthEngine\million_plus\LULC\newdata\clipped_files"
################################/////////////////////////  extracter function
def value_extractinator():
    data_years = pd.DataFrame(data=[], index=["nodata","urban","green","water","barren"], columns=[])
    for file in os.listdir(path):
        if (file.endswith(".tif")):
            print(file)
            ds = gdal.Open(path+ "/" +file)
            band =  ds.GetRasterBand(1)
            #print(gdal.GetDataTypeName(band.DataType)   )
            rasterArray = band.ReadAsArray()
            unique_array ,count_array = (np.unique(rasterArray,return_index=False, return_inverse=False, return_counts=True, axis=None))
            saal = int((re.search( r"\d{4}" ,file)).group())
            print(saal)
            data_years[saal] = count_array
            landcover = data_years.drop("nodata", axis=0).transpose()
            '''
            #to check the stats of raster images
            array_unq_cnt = zip(unique_array,count_array)
            for i in array_unq_cnt:
                print(i[0], i[1])
            # Compute statistics if needed
            if band.GetMinimum() is None or band.GetMaximum()is None:
                band.ComputeStatistics(0)
                print("Statistics computed.")

            # Print only selected metadata:
            print ("[ NO DATA VALUE ] = ", band.GetNoDataValue()) # none
            print ("[ MIN ] = ", band.GetMinimum())
            print ("[ MAX ] = ", band.GetMaximum())
            '''
    landcover.to_csv(path + '/data_extracted.csv')
    print("im done here")
    return(landcover)


print(value_extractinator())
