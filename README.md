# SalesRecord

A simple web-based application for managing and visualizing sales records. This dashboard allows users to input, manage, and analyze sales data dynamically, while providing interactive visualizations for deeper insights into sales performance across states.

---

## Features

### Add and Manage Sales
- Add detailed sales records, including:
  - **Date**
  - **Customer Name**
  - **Quantity**
  - **State**
  - **Discount**
  - **Item**
- Edit and delete records directly within the table.

### Interactive Visualizations
#### Line Chart
- Analyze sales trends over time.
- Automatically updates based on the latest sales data.

#### Bar Chart
- Compare sales across different categories, such as items, discounts, or states.
- Filter the chart by month for granular insights.
- Customize the x-axis to analyze different metrics like states, discounts, or items sold.

#### Bubble Map
- Visualize sales volume across states.
- Interactive mouseover tooltips display detailed sales information per state.
- Map automatically updates based on the latest data entered.

### Filters and Customization
- Filter bar charts by month.
- Select the x-axis for tailored insights.

---

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:sims04/SalesRecord.git
   cd SalesRecord
2. Open index.html in your browser

   
## Usage

### Add Sales
- Click the **Add Sale** button to open the sales form.
- Enter the details (e.g., date, customer name, quantity, etc.).
- Click **Add** to save the sales record.

### View and Edit Sales
- All sales records are displayed in a dynamic, scrollable table.
- Use the **Edit**, **Done**, or **Delete** buttons to:
  - **Edit:** Modify records in-place.
  - **Done:** Confirm changes.
  - **Delete:** Remove unwanted entries.

### Generate Charts
- The dropdowns for the **X-axis** and **Y-axis** are already pre-selected for the line chart.
- Users can:
  - Select the X-Axis for the bar chart.
  - Filter the bar chart by month.
- Click **Plot Chart** or **Plot Bar Chart** to visualize the data.

### Interactive Map
- View the geographical distribution of sales on the map.
- **Bubbles represent sales volume per state.**
- Use your mouse to hover over the bubbles to see detailed sales volume information.

---

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Data Visualization:** D3.js
- **Map Integration:** TopoJSON, D3.js

---

## Future Enhancements
- Add export functionality for sales data.
- Enable advanced filters (e.g., customer name, date ranges).
- Enhance map interactivity with zoom capabilities.
- Provide analytics summaries (e.g., top-performing states or products).

---

## Contact
For questions or feedback, feel free to reach out:

- **Email:** [simane.salah@gmail.com](mailto:simane.salah@gmail.com)
- **GitHub:** [sims04](https://github.com/sims04)


   
   
