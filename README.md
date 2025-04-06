# Classroom Screen

A web application similar to Classroom Screen, featuring widgets like a timer, random name picker, noise meter, work instructions, and random group maker.

## Features

- **Timer Widget**: Set custom timers with minutes and seconds
- **Random Name Picker**: Add student names and randomly select one
- **Noise Meter**: Monitor classroom noise levels using the microphone
- **Work Instructions**: Display instructions for students with adjustable font size
- **Random Group Maker**: Create random groups by size or count

## Technologies Used

- React.js
- Vite
- HTML/CSS
- JavaScript
- Local Storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd classroom-screen
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

## Building for Production

To create a production build:

```
npm run build
```

This will generate a `dist` directory with the production-ready files.

## Deployment

### Deploying to Netlify

1. Create a Netlify account if you don't have one
2. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. Login to Netlify:
   ```
   netlify login
   ```
4. Deploy the site:
   ```
   netlify deploy --prod
   ```

### Deploying to Render

1. Create a Render account
2. Create a new Static Site
3. Connect your GitHub repository
4. Configure the build settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

## Usage

### Timer Widget
- Enter minutes and seconds
- Click "Set" to set the timer
- Use "Start", "Pause", and "Reset" buttons to control the timer

### Random Name Picker
- Add student names using the input field
- Click "Pick Random Name" to randomly select a student
- Remove individual names or clear all names

### Noise Meter
- Click "Start Monitoring" to begin monitoring noise levels
- Adjust the threshold slider to set the noise level threshold
- The meter will change color based on the noise level

### Work Instructions
- Toggle between "Edit Mode" and "Display Mode"
- Adjust font size using the A+ and A- buttons
- Enter instructions in Edit Mode and view them in Display Mode

### Random Group Maker
- Choose between grouping by size or count
- Set the group size or number of groups
- Click "Create Groups" to generate random groups

## License

This project is licensed under the MIT License - see the LICENSE file for details.
