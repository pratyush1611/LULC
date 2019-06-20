#Description: to extract from lulc images to csv for furthur analyses

# Import system modules
import os
import arcpy
from arcpy import env

# Set workspace
env.workspace = r"E:\earthEngine\million_plus\LULC\tester"
'''
# Set local variables
in_features = "majorrds.shp"
clip_features = "study_quads.shp"
out_feature_class = "C:/output/studyarea.shp"
xy_tolerance = ""


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
    for file in os.listdir(path):
        in_features = file
        clip_features = "kota_plng_bnd.shp"
        out_feature_class = r"E:\earthEngine\million_plus\LULC\tester\clipped"+file.strip(".tif")+"_clipped.tif"
        # Execute Clip
        arcpy.Clip_analysis(in_features, clip_features, out_feature_class, "")

clipper_func()
