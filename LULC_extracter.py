#!python2
#Description: to extract from lulc images to csv for furthur analyses

# Import system modules
import os
import arcpy
from arcpy import env
import numpy as np
from osgeo import gdal

# Set workspace
env.workspace = r"E:\earthEngine\million_plus\LULC\tester"
path = r"E:\earthEngine\million_plus\LULC\tester"
'''
def read_folder(path):
    lst_path = list()
    file_name = list()
    lst = os.listdir(path) # returns list
    for i in lst:
        if i.endswith(".tif"):
            lst_path.append(path+ '\\' + i)
            file_name.append(i)
        else:
            pass
    return [lst_path, file_name]
'''
##//////////clipper func
def clipper_func():

    for file in os.listdir(env.workspace):
        if(file.endswith(".tif")):
            print(file)
            #out_feature_class = r"E:\earthEngine\million_plus\LULC\tester\clipped"+file.strip(".tif")+"_clipped.tif"
            in_features = file
            clip_features = "kota_plng_bnd.shp"
            out_feature_class = "/clipped_files/" + in_features[:-5]+"_clipped"
            arcpy.Clip_management(in_features,"#",out_feature_class + ".tif", clip_features,"#" ,"ClippingGeometry", "NO_MAINTAIN_EXTENT")
            print(file + "has been clipped")

    print("clipper has come to an end")

def value_extractinator():
        raster_file =0

        ds = gdal.Open(env.workspace + "/clipped_files/kota_1990_lulc_cnstn_clipped.tif")
        #//band =  ds.GetRasterBand(1)
        array = np.array(ds)#band.ReadAsArray())
        values = np.unique(array)
        print(values)
        print("im done here")

print("code started")
#clipper_func()
value_extractinator()
print("code ended")
