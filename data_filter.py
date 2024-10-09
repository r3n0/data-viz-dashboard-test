import pandas as pd

# Load the CSV file
file_path = './filtered_data.csv'  # Replace with the actual path to your CSV file
data = pd.read_csv(file_path)

# Keep only the relevant columns and drop rows with missing values in these columns
columns_to_keep = [
	'sexo', 
	'edad', 
	'lengua_materna', 
	'identificacion_etnic', 
	'nacionalidad_indigena', 
	'provincia_labora',
	'canton_labora',
	'jurisdiccion_labora', 
	'Fecha registro',
	'Carrera',
	'Título',
	'Nivel']
filtered_data = data[columns_to_keep].dropna()

# Save the filtered data to a new CSV file
output_file_path = 'filtered_data.csv'  # Specify the output path
filtered_data.to_csv(output_file_path, index=False)

print(f"Filtered data saved to {output_file_path}")