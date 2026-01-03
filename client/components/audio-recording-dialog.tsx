"use client";

import * as React from "react";
import { X, RotateCcw, Play, Square, Mic, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

export default function VoiceRecorderDialog() {
  const [status, setStatus] = React.useState<"idle" | "recording" | "finished">("idle");
  const [time, setTime] = React.useState(0);
  
  // 15 bars for the waveform
  const [levels, setLevels] = React.useState<number[]>(Array(15).fill(10));

  // Timer and Animation Logic
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "recording") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
        setLevels(levels.map(() => Math.floor(Math.random() * 30) + 40));
      }, 1000);
    } else {
      setLevels(Array(15).fill(10));
    }
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} : ${secs.toString().padStart(2, "0")}`;
  };

  const handleStop = () => setStatus("finished");
  const handleReset = () => {
    setStatus("idle");
    setTime(0);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer text-xs rounded-xs rounded-full" size={'icon-sm'}>
          <Mic />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-white rounded-2xl">
        <div className="p-6 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Voice Recorder</h2>
            <p className="text-sm text-gray-500 mt-1">Click on play and start talking.</p>
          </div>
        </div>

        <div className="flex flex-col items-center py-10 px-6">
          <div className="text-5xl font-mono font-bold text-gray-900 mb-8">
            {formatTime(time)}
          </div>

          <div className="flex items-center gap-1 h-12 mb-10">
            {levels.map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  status === "recording" ? "bg-black" : "bg-gray-200"
                }`}
                style={{ height: status === "recording" ? `${height}px` : "8px" }}
              />
            ))}
          </div>

           
          <div className={`gap-6 ${status === 'finished' && 'flex items-center'}`}>
            {status === "finished" && (
              <button 
                onClick={handleReset}
                className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition shadow-sm"
              >
                <RotateCcw size={20} className="text-gray-700" />
              </button>
            )}
            {status !== "recording" ? (
              <button
                onClick={() => setStatus("recording")}
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center hover:bg-black/70 transition shadow-lg"
              >
                <Play fill="white" size={20} className="text-white ml-1" />
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition shadow-lg animate-pulse"
              >
                <Square fill="white" size={20} className="text-white" />
              </button>
            )}
            {status === "finished" && (
              <button 
                onClick={handleReset}
                className="w-16 h-16 bg-black rounded-full flex items-center justify-center hover:bg-black/70 transition shadow-lg"
              >
                <Send size={20} className="text-white" />
              </button>
            )}
            {status === "idle" && <div className="w-11" />}
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}