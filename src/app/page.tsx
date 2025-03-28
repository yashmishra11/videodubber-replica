"use client";

import { useState, useRef, useEffect } from "react";
import { MantineProvider, NumberInput, Button, Group, Paper, Container } from "@mantine/core";
import { Rnd } from "react-rnd";
import ReactPlayer from "react-player";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

const VIDEO_MIME_TYPE = ["video/mp4", "video/webm", "video/ogg"];

export default function Editor() {
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<ReactPlayer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer effect for controlling playback duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= endTime) {
            setIsPlaying(false);
            return startTime;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, startTime, endTime]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileType = file.type;

    if (IMAGE_MIME_TYPE.includes(fileType)) {
      setMediaType("image");
    } else if (VIDEO_MIME_TYPE.includes(fileType)) {
      setMediaType("video");
    } else {
      alert("Unsupported file type!");
      return;
    }

    //setMediaFile(file); // Use the File object directly
    setMediaFile(URL.createObjectURL(file));
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    setMediaFile(null);
    setMediaType(null);
    setPosition({ x: 100, y: 100 });
    setDimensions({ width: 200, height: 200 });
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <MantineProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left Sidebar */}
        <Paper shadow="md" p="md" style={{ width: 300, backgroundColor: "#2D2E3B", color: "#FFFFFF" }}>
          <Group mb="md">
            <NumberInput
              label="Width"
              value={dimensions.width}
              onChange={(val) => setDimensions((p) => ({ ...p, width: Number(val) || 200 }))}
            />
            <NumberInput
              label="Height"
              value={dimensions.height}
              onChange={(val) => setDimensions((p) => ({ ...p, height: Number(val) || 200 }))}
            />
          </Group>

          <Group mb="md">
            <NumberInput
              label="Start Time (sec)"
              value={startTime}
              onChange={(val) => setStartTime(Number(val) || 0)}
            />
            <NumberInput
              label="End Time (sec)"
              value={endTime}
              onChange={(val) => setEndTime(Number(val) || 5)}
            />
          </Group>

          <Button
            fullWidth
            onClick={() => setIsPlaying((prev) => !prev)}
            color={isPlaying ? "red" : "blue"}
          >
            {isPlaying ? "Stop" : "Play"} ({currentTime}s)
          </Button>

          {/* Upload Button */}
          <Button fullWidth onClick={handleUploadButtonClick}>
            Upload Media
          </Button>

          {/* Hidden File Input */}
          <input
            type="file"
            style={{ display: 'none' }}
            accept={[...IMAGE_MIME_TYPE, ...VIDEO_MIME_TYPE].join(',')}
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {/* Delete Button */}
          {mediaFile && (
            <Button fullWidth color="red" onClick={handleDelete}>
              Delete Media
            </Button>
          )}
        </Paper>

        {/* Main Canvas */}
        <div style={{ flex: 1, position: 'relative', backgroundColor: '#1A1B1E' }}>
          {!mediaFile ? (
            <Container style={{ textAlign: "center", padding: "50px", color: "#FFFFFF" }}>
              Drop your video/image here
            </Container>
          ) : (
            <Rnd
              size={dimensions}
              position={position}
              onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(e, direction, ref, delta, position) => {
                setDimensions({
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                });
                setPosition(position);
              }}
            >
              {mediaType === "video" ? (
                <ReactPlayer
                  ref={playerRef}
                  url={mediaFile}
                  playing={isPlaying}
                  style={{
                    opacity: currentTime >= startTime && currentTime <= endTime ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                  width="100%"
                  height="100%"
                />
              ) : (
                <img
                  src={mediaFile}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: currentTime >= startTime && currentTime <= endTime ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />
              )}
            </Rnd>
          )}
        </div>
      </div>
    </MantineProvider>
  );
}
