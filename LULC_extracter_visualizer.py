# -*- coding: utf-8 -*-
"""
Created on Mon Jul  1 11:24:45 2019

@author: user
"""

from plotly.offline import plot
import plotly.tools as tls
import os
import re
import numpy as np
import pandas as pd
from osgeo import gdal

################################/////////////////////////  extracter function
def value_extractinator(path):
    data_years = pd.DataFrame(data=[], index=["nodata","urban","green","water","barren"], columns=[])
    for file in os.listdir(path):
        if (file.endswith(".tif")):
            print(file)
            ds = gdal.Open(path+ "/" +file)
            band =  ds.GetRasterBand(1)
            #print(gdal.GetDataTypeName(band.DataType)  )
            rasterArray = band.ReadAsArray()
            unique_array ,count_array = (np.unique(rasterArray,return_index=False, return_inverse=False, return_counts=True, axis=None))
            saal = int((re.search( r"\d{4}" ,file)).group())
            print(saal)
            data_years[saal] = count_array
            landcover = data_years.drop("nodata", axis=0).transpose()
            
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
            
            landcover = landcover * 0.0009		
    landcover.to_excel(path + '/data_extracted.xlsx', sheet_name='Sheet1', na_rep='', float_format=None, columns=None, header=True, index=True, index_label=None, startrow=0, startcol=0, engine=None, merge_cells=True, encoding=None, inf_rep='inf', verbose=True, freeze_panes=None)
    print("im done here")
    return(landcover)

path = input("Enter the path of your clipped images folder: ")
assert os.path.exists(path), "I did not find the file at, " + str(path)
#path = r"E:\earthEngine\million_plus\LULC\newdata\clipped_files"

df = value_extractinator(path)
print(df)

#df.iloc[:,0] = pd.to_datetime(df.iloc[:,0]) # to convert to date time format so that it is readable by .dt.month


fig = tls.make_subplots(rows=2, cols=2, shared_xaxes=False,subplot_titles=('Urban','Green','Water','Barren'))
#fig.layout.template = 'plotly'
fig.layout.title = 'LULC'

fig.append_trace({
				  'x': df.index, 
				  'y': df.urban, 
				  'mode': 'lines + markers',
				  'name': 'Urban',
				  'marker' : {'color' : 'rgb(0, 255, 0)',
					          'size' : 5,
							  'symbol': 0
							 },
				  'line': {'color' : 'red'}
				  }, 1, 1)
x_trend = df.index.astype(np.int32)
y_trend = df.urban.astype(np.float32)
z = np.polyfit(x_trend, y_trend, 3)
p = np.poly1d(z)
fig.append_trace({
				  'x': x_trend, 
				  'y': p(x_trend), 
				  'mode': 'lines',
				  'name': 'Trend',
  				  'line': {'color' : 'gray', 'dash' : 'dot','width' : 2   }
				  }, 1, 1)
	
	
fig.append_trace({
				  'x': df.index, 
				  'y': df.green, 
				  'mode': 'lines + markers',
				  'name': 'Green',
				  'marker' : {'color' : 'red',
					          'size' : 5,
							  'symbol': 100
							 },
				  'line': {'color' : 'green'}
				  }, 1, 2)
x_trend = df.index.astype(np.int32)
y_trend = df.green.astype(np.float32)
z = np.polyfit(x_trend, y_trend, 3)
p = np.poly1d(z)
fig.append_trace({
				  'x': x_trend, 
				  'y': p(x_trend), 
				  'mode': 'lines',
				  'name': 'Trend',
  				  'line': {'color' : 'gray', 'dash' : 'dot','width' : 2   }
				  }, 1, 2)	
	
fig.append_trace({
				  'x': df.index, 
				  'y': df.water, 
				  'mode': 'lines + markers',
				  'name': 'Water',
				  'marker' : {'color' : 'red',
					          'size' : 5,
							  'symbol': 100
							 },
				  'line': {'color' : 'blue'}
				  }, 2, 1)	
x_trend = df.index.astype(np.int32)
y_trend = df.water.astype(np.float32)
z = np.polyfit(x_trend, y_trend, 3)
p = np.poly1d(z)
fig.append_trace({
				  'x': x_trend, 
				  'y': p(x_trend), 
				  'mode': 'lines',
				  'name': 'Trend',
  				  'line': {'color' : 'gray', 'dash' : 'dot','width' : 2   }
				  }, 2, 1)	
	
fig.append_trace({
				  'x': df.index, 
				  'y': df.barren ,#+ df.green + df.water, 
				  'mode': 'lines + markers',
				  'name': 'Barren',
				  'marker' : {'color' : 'red',
					          'size' : 5,
							  'symbol': 100
							 },
				  'line': {'color' : 'brown'}
				  }, 2, 2)	
x_trend = df.index.astype(np.int32)
y_trend = df.barren.astype(np.float32)
z = np.polyfit(x_trend, y_trend, 3)
p = np.poly1d(z)
fig.append_trace({
				  'x': x_trend, 
				  'y': p(x_trend), 
				  'mode': 'lines',
				  'name': 'Trend',
  				  'line': {'color' : 'gray', 'dash' : 'dot','width' : 2   }
				  }, 2, 2)
	     
plot(fig, filename = path + '/_lulc.html')

