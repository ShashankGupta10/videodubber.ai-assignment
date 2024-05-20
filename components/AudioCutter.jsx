import React, { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import {
  Slider,
} from "@mui/material";
import { bufferToWave } from "./../utils/bufferToWave";

const AudioCutter = ({ audioFile, setAudioFile }) => {
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [region, setRegion] = useState({ start: 0, end: 1 });
  const [duration, setDuration] = useState(0);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    if (waveformRef.current && !wavesurfer) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "purple",
        backend: "WebAudio",
        plugins: [RegionsPlugin.create({})],
      });

      ws.on("ready", () => {
        setDuration(ws.getDuration());
      });

      ws.on("region-updated", (region) => {
        setRegion({ start: region.start, end: region.end });
      });

      setWavesurfer(ws);
    }

    return () => {
      if (wavesurfer) wavesurfer.destroy();
    };
  }, [waveformRef, wavesurfer]);

  useEffect(() => {
    if (wavesurfer && audioFile) {
      wavesurfer.load(URL.createObjectURL(audioFile));
    }
  }, [wavesurfer, audioFile]);

  const handleCut = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        (region.end - region.start) * audioBuffer.sampleRate,
        audioBuffer.sampleRate
      );

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        newBuffer.copyToChannel(
          audioBuffer
            .getChannelData(i)
            .slice(
              region.start * audioBuffer.sampleRate,
              region.end * audioBuffer.sampleRate
            ),
          i
        );
      }

      const blob = bufferToWave(newBuffer);
      updateFile(blob);
    };

    reader.readAsArrayBuffer(audioFile);
  };

  const handleRemove = () => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const sampleRate = audioBuffer.sampleRate;

      const beforeRemove = audioBuffer
        .getChannelData(0)
        .slice(0, region.start * sampleRate);
      const afterRemove = audioBuffer
        .getChannelData(0)
        .slice(region.end * sampleRate);

      const newBufferLength = beforeRemove.length + afterRemove.length;
      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        newBufferLength,
        sampleRate
      );

      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        newBuffer.copyToChannel(beforeRemove, i, 0);
        newBuffer.copyToChannel(afterRemove, i, beforeRemove.length);
      }

      const blob = bufferToWave(newBuffer);
      updateFile(blob);
    };

    reader.readAsArrayBuffer(audioFile);
  };

  const handleSave = () => {
    const url = URL.createObjectURL(audioFile);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "cut_audio.wav";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousFile = undoStack.pop();
      setRedoStack([audioFile, ...redoStack]);
      setAudioFile(previousFile);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextFile = redoStack.shift();
      setUndoStack([...undoStack, audioFile]);
      setAudioFile(nextFile);
    }
  };

  const updateFile = (newFile) => {
    setUndoStack([...undoStack, audioFile]);
    setRedoStack([]);
    setAudioFile(newFile);
  };

  const handlePlay = () => {
    const audioURL = URL.createObjectURL(audioFile);
    const audio = new Audio(audioURL);
    audio.play();
  };

  return (
      <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-10 items-center w-[80%]">
        <div
          id="waveform"
          ref={waveformRef}
          className="w-full h-[200px] mt-2"
        ></div>
        <div className="w-[80%] mt-16">
          <Slider
            value={[region.start, region.end]}
            onChange={(e, newValue) =>
              setRegion({ start: newValue[0], end: newValue[1] })
            }
            valueLabelDisplay="auto"
            min={0}
            max={duration}
            step={0.01}
          />
        </div>
        <div className="flex justify-end items-end gap-4 ml-auto">
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={handleCut}
          >
            Cut
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            color="primary"
            onClick={handleRemove}
          >
            Remove
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
          >
            Undo
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            Redo
          </button>
        </div>
        <div className="flex justify-end items-end gap-4 ml-auto mt-auto">
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={handlePlay}
          >
            Play
          </button>

          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={() => {
              if (region.start < region.end - 0.1)
                setRegion((prevRegion) => ({
                  ...prevRegion,
                  start: prevRegion.start + 0.1,
                }));
            }}
          >
            Start +
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={() => {
              if (region.start > 0.1)
                setRegion((prevRegion) => ({
                  ...prevRegion,
                  start: prevRegion.start - 0.1,
                }));
              else
                setRegion((prevRegion) => ({
                  ...prevRegion,
                  start: 0,
                }));
            }}
          >
            Start -
          </button>

          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={() => {
              if (region.end > region.start + 0.1)
                setRegion((prevRegion) => ({
                  ...prevRegion,
                  end: prevRegion.end - 0.1,
                }));
            }}
          >
            End -
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={() => {
              if (region.end > region.start + 0.1)
                setRegion((prevRegion) => ({
                  ...prevRegion,
                  end: prevRegion.end + 0.1,
                }));
            }}
          >
            End +
          </button>
          <button
            className="bg-black text-white inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 rounded-md px-8 w-full"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioCutter;
