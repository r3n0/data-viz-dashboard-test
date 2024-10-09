import pandas as pd

# Load your dataset (adjust the file path to your local file)
file_path = 'filtered_data.csv'  # Replace with the correct file path
data = pd.read_csv(file_path)

# Convert the 'Fecha registro' column to datetime (adjust the column name if needed)
data['Fecha registro'] = pd.to_datetime(data['Fecha registro'], errors='coerce')

# Drop any rows with missing or invalid dates
data_cleaned = data.dropna(subset=['Fecha registro'])

# Group by year and month, and count the occurrences
data_filtered = data_cleaned.groupby(data_cleaned['Fecha registro'].dt.to_period('M')).size().reset_index(name='count')

# Rename the 'Fecha registro' column to 'date'
data_filtered.columns = ['date', 'count']

# Convert 'date' from Period to string for easier export
data_filtered['date'] = data_filtered['date'].astype(str)

# Save the filtered data to a new CSV file
output_file_path = 'filtered_data_by_month.csv'  # Specify your desired output path
data_filtered.to_csv(output_file_path, index=False)

print(f"Filtered data saved to {output_file_path}")