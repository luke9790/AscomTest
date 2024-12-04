
# Patients Management Application

This is a sample Angular project designed to demonstrate CRUD operations for managing "Patient" entities. The application interacts with a RESTful API to retrieve, update, and display patient data. It provides various features like a sortable and filterable grid, detail views, and some editing capabilities.

## Functionalities

The application manages entities of type `Patient`. 

### Levels of Functionality
1. **Level 1**:  
   Display a grid with all patients retrieved from the `/Patient/GetList` endpoint. For each patient:
   - Show FamilyName, GivenName, Sex, Birth Date, and Number of Parameters.
   - Display a red label if at least one parameter has `Alarm = true`.

2. **Level 2**:  
   Make the grid sortable and filterable.

3. **Level 3**:  
   Allow users to open a detail/edit dialog by clicking on a patient in the grid. The dialog displays:
   - The same fields as the grid.
   - A non-editable list of parameters for the patient.

4. **Level 4**:  
   Allow editing of patient fields (`FamilyName`, `GivenName`, `Sex`) in the detail dialog. Updated data is saved via the `/Patient/Update` endpoint.

---

## How to Run the Project

### Step 1: Clone the Repository
Clone the repository to your local machine:

```bash
git clone [<repository-url>](https://github.com/luke9790/AscomTest)
cd AscomTest
```

### Step 2: Set Up Environment Variables
1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit the `.env` file and replace the placeholders with actual values:
   ```plaintext
   API_BASE_URL=https://your-api-url.com
   API_USER=your-username
   API_PASSWORD=your-password
   ```

### Step 3: Install Dependencies
Run the following command to ensure all required packages are installed and that Angular CLI version 18 is available:

```bash
make install
```

### Step 4: Start the Application
To start the Angular development server, run:

```bash
make run
```

This will:
1. Verify the `.env` file exists.
2. Install required dependencies if not already installed.
3. Generate the necessary environment file (src/app/environment.ts).
4. Start the application and open it in your default browser.

---

## Notes
- **Environment Variables**: Ensure that the `.env` file contains accurate API credentials. Do not commit sensitive data to the repository.
- **Browser Compatibility**: The application is optimized for modern browsers.
