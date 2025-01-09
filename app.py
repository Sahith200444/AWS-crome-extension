import pandas as pd

# Load the provided Excel file from the D drive
file_path = 'D:/Week11.xlsx'
data = pd.read_excel(file_path, sheet_name='Sheet1')

# Display the first few rows to understand the structure of the sheet
print(data.head())

# Identify the topmost reason for a credit card application to be declined
top_reason_declined = data[data['Application_Status'] == 'Declined']['Decline_Reason'].mode()[0]

print("Topmost reason for a credit card application to be declined:", top_reason_declined)
