### Overview

The `AudioCutter` is a React project designed to facilitate the manipulation and editing of audio files within a web application. It offers a user-friendly interface for tasks such as cutting, removing sections, and saving audio clips. 

1. **Waveform Visualization**: Utilizes the WaveSurfer.js library to display a visual representation of the audio waveform, allowing users to visualize and interact with the audio.

2. **Region Selection**: Allows users to select specific regions of the audio waveform for editing, providing precise control over the editing process.

3. **Cutting and Removing**: Provides functionality to cut or remove selected regions from the audio, enabling users to trim or edit audio clips as needed.

4. **Undo and Redo**: Supports undo and redo operations, allowing users to revert or repeat editing actions as necessary.

5. **Playback Control**: Offers playback control options, including play, pause, and initialization functions, to facilitate audio playback during the editing process.


### Installation
Setting up the `AudioCutter` component locally involves several steps, including installing dependencies, integrating the component into your project, and configuring any necessary settings. Here's a step-by-step guide to setting it up:

### Prerequisites
- Make sure you have Node.js and pnpm installed on your system. You can download and install them from the official [Node.js website](https://nodejs.org/).

### Step 1: Clone the project
If you don't have a React app set up already, you can create one using Create React App:

```bash
git clone https://github.com/ShashankGupta10/videodubber.ai-assignment
cd videodubber.ai-assignment
```

### Step 2: Install Dependencies
Navigate to your Next app directory and install the necessary dependencies:

```bash
pnpm install
```

### Step 3: Run the Development Server
Start the development server to see the `AudioCutter` project in action:

```bash
pnpm run dev
```

This command will start the development server, and you should be able to access your app with the `AudioCutter` project at `http://localhost:3000` by default.


### Demo
[Live Demo](https://audio-cutter-3um2ry7oc-shashankgupta10s-projects.vercel.app/)

### Usage
```javascript
import AudioCutter from './AudioCutter';

const App = () => {
  return (
    <div>
      <AudioCutter audioFile={audioFile} setAudioFile={setAudioFile} />
    </div>
  );
};
```

### Props
- `audioFile`: The audio file to be edited.
- `setAudioFile`: A function to update the audio file after editing.

### Code Explanation

#### State Initialization
- `waveformRef`: A reference to the waveform container.
- `wavesurfer`: State to hold the WaveSurfer instance.
- `region`: State to manage the audio editing region.
- `duration`: State to store the duration of the audio file.
- `undoStack` and `redoStack`: States to manage undo and redo operations.

#### WaveSurfer Initialization
- Initializes the WaveSurfer instance when the component mounts.
- Sets up event listeners for audio manipulation.

#### Audio Manipulation Functions
- `handleCut`: Cuts the selected region from the audio.
- `handleRemove`: Removes the selected region from the audio.
- `handleSave`: Saves the edited audio file.
- `handleUndo` and `handleRedo`: Undo and redo operations for audio editing.

#### Playback Functions
- `handlePlay`: Plays the audio file.

### Dependencies
- WaveSurfer.js
- Material-UI

### Example
```javascript
import React, { useState } from 'react';
import AudioCutter from './AudioCutter';

const App = () => {
  const [audioFile, setAudioFile] = useState(null);

  return (
    <div>
      <AudioCutter audioFile={audioFile} setAudioFile={setAudioFile} />
    </div>
  );
};

export default App;
```

---

