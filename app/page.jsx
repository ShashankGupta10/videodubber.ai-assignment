"use client";
import { useRef, useState } from "react";
import AudioCutter from "./../components/AudioCutter";
export default function Home() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const selected_file = e.target.files[0];
    setFile(selected_file);
  };

  return !file ? (
    <main className="flex flex-col items-center justify-center h-[100vh] bg-gray-100 px-4 md:px-6">
      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-7xl font-bold tracking-tighter text-gray-900">
          Audio Cutter
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-md block mx-auto">
          Easily trim and edit your audio files with our powerful cutting tool.
          Upload your audio and start customizing it to perfection.
        </p>
        <button
          className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
          onClick={handleButtonClick}
        >
          Upload Audio
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".mp3, .wav"
          className="hidden"
        />
      </div>
    </main>
  ) : (
    <AudioCutter audioFile={file} setAudioFile={setFile}/>
  );
}
