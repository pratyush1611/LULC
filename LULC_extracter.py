#!python2
#above line torun from python 2 compiler
#Description: to extract from lulc images to csv for furthur analyses

# Import system modules
import os
import arcpy
from arcpy import env
import numpy as np

##//////////clipper func
def clipper_func(clip_var = "kota_plng_bnd.shp"):

    for file in os.listdir(env.workspace):
        if(file.endswith(".tif")):
            print(file)
            #out_feature_class = r"E:\earthEngine\million_plus\LULC\tester\clipped"+file.strip(".tif")+"_clipped.tif"
            in_features = file
            clip_features = clip_var
            out_feature_class = "/clipped_files/" + in_features[:-4]+"_clipped"
            arcpy.Clip_management(in_features,"#",out_feature_class + ".tif",
                                    clip_features,"NULL" ,"ClippingGeometry",
                                    "NO_MAINTAIN_EXTENT")
            print(file + "has been clipped")

    print("clipper has come to an end")
####################################################



#///////////////////////////////////////////////////
print("code started")
# Set workspace
env.workspace = input("Enter the path to set as environment workspace : ")
assert os.path.exists(path), "I did not find the file at, " + str(path)
#env.workspace = r"E:\earthEngine\million_plus\LULC\newdata"
clip_var = input("Enter the name of clipping feature that is the feature to act as boundary for clip : \n(please include the .shp at the end of the file name and ensure that it exists in the environment workspace) ")
#run function to clip multiple
clipper_func()
print("code ended")
