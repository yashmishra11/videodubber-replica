"use client";

import { useState, useRef, useEffect } from "react";
import { MantineProvider, NumberInput, Button, Group, Paper, Container, Text, Stack, Divider } from "@mantine/core";
import { Rnd } from "react-rnd";
import ReactPlayer from "react-player";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

const VIDEO_MIME_TYPE = ["video/mp4", "video/webm", "video/ogg"] as const;

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

    if (IMAGE_MIME_TYPE.includes(fileType as (typeof IMAGE_MIME_TYPE)[number])) {
      setMediaType("image");
    } else if (VIDEO_MIME_TYPE.includes(fileType as (typeof VIDEO_MIME_TYPE)[number])) {
      setMediaType("video");
    } else {
      alert("Unsupported file type!");
      return;
    }

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
      <div 
        style={{ 
          display: "flex", 
          height: "100vh",
          background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)",
        }}
      >
        {/* Left Sidebar */}
        <Paper 
          shadow="xl" 
          p="xl" 
          style={{ 
            width: 320, 
            background: "rgba(20, 20, 35, 0.85)",
            backdropFilter: "blur(16px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 0,
            boxShadow: "4px 0 24px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Stack gap="lg">
            {/* Header */}
            <div>
              <Text 
                size="xl" 
                fw={700} 
                style={{ 
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "0.5rem"
                }}
              >
                Media Editor
              </Text>
              <Text size="xs" color="dimmed">
                Upload and customize your media
              </Text>
            </div>

            <Divider 
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.1)" 
              }} 
            />

            {/* Dimensions Section */}
            <div>
              <Text 
                size="sm" 
                fw={600} 
                mb="sm"
                style={{ color: "#e0e0e0" }}
              >
                Dimensions
              </Text>
              <Group spacing="sm">
                <NumberInput
                  label="Width"
                  value={dimensions.width}
                  onChange={(val) => setDimensions((p) => ({ ...p, width: Number(val) || 200 }))}
                  min={50}
                  max={1000}
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }
                    },
                    label: {
                      color: "#b0b0b0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <NumberInput
                  label="Height"
                  value={dimensions.height}
                  onChange={(val) => setDimensions((p) => ({ ...p, height: Number(val) || 200 }))}
                  min={50}
                  max={1000}
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }
                    },
                    label: {
                      color: "#b0b0b0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </Group>
            </div>

            {/* Timing Section */}
            <div>
              <Text 
                size="sm" 
                fw={600} 
                mb="sm"
                style={{ color: "#e0e0e0" }}
              >
                Timing Controls
              </Text>
              <Group spacing="sm">
                <NumberInput
                  label="Start (sec)"
                  value={startTime}
                  onChange={(val) => setStartTime(Number(val) || 0)}
                  min={0}
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }
                    },
                    label: {
                      color: "#b0b0b0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <NumberInput
                  label="End (sec)"
                  value={endTime}
                  onChange={(val) => setEndTime(Number(val) || 5)}
                  min={0}
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "8px",
                      color: "#ffffff",
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "#667eea",
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
                      },
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      }
                    },
                    label: {
                      color: "#b0b0b0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </Group>
            </div>

            <Divider 
              style={{ 
                borderColor: "rgba(255, 255, 255, 0.1)" 
              }} 
            />

            {/* Playback Control */}
            <Button
              fullWidth
              onClick={() => setIsPlaying((prev) => !prev)}
              size="md"
              styles={{
                root: {
                  background: isPlaying 
                    ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "10px",
                  height: "48px",
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isPlaying
                    ? "0 4px 16px rgba(255, 107, 107, 0.4)"
                    : "0 4px 16px rgba(102, 126, 234, 0.4)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isPlaying
                      ? "0 8px 24px rgba(255, 107, 107, 0.5)"
                      : "0 8px 24px rgba(102, 126, 234, 0.5)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  }
                }
              }}
            >
              {isPlaying ? "⏸ Stop" : "▶ Play"} • {currentTime}s
            </Button>

            {/* Upload Button */}
            <Button
              fullWidth
              onClick={handleUploadButtonClick}
              size="md"
              variant="outline"
              styles={{
                root: {
                  background: "rgba(102, 126, 234, 0.1)",
                  border: "2px solid rgba(102, 126, 234, 0.5)",
                  borderRadius: "10px",
                  height: "48px",
                  color: "#667eea",
                  fontWeight: 600,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "rgba(102, 126, 234, 0.2)",
                    borderColor: "#667eea",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  }
                }
              }}
            >
              📁 Upload Media
            </Button>

            {/* Hidden File Input */}
            <input
              type="file"
              style={{ display: "none" }}
              accept={[...IMAGE_MIME_TYPE, ...VIDEO_MIME_TYPE].join(",")}
              onChange={handleFileChange}
              ref={fileInputRef}
            />

            {/* Delete Button */}
            {mediaFile && (
              <Button
                fullWidth
                onClick={handleDelete}
                size="md"
                variant="outline"
                styles={{
                  root: {
                    background: "rgba(255, 107, 107, 0.1)",
                    border: "2px solid rgba(255, 107, 107, 0.5)",
                    borderRadius: "10px",
                    height: "48px",
                    color: "#ff6b6b",
                    fontWeight: 600,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "rgba(255, 107, 107, 0.2)",
                      borderColor: "#ff6b6b",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(255, 107, 107, 0.3)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    }
                  }
                }}
              >
                🗑️ Delete Media
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Main Canvas */}
        <div 
          style={{ 
            flex: 1, 
            position: "relative",
            background: "rgba(10, 10, 20, 0.5)",
            backdropFilter: "blur(8px)",
            overflow: "hidden"
          }}
        >
          {!mediaFile ? (
            <Container 
              style={{ 
                textAlign: "center", 
                padding: "80px 50px",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(12px)",
                  border: "2px dashed rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  padding: "60px 40px",
                  transition: "all 0.3s ease",
                }}
              >
                <Text 
                  size="xl" 
                  fw={600}
                  style={{ 
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: "0.5rem"
                  }}
                >
                  📂 No Media Loaded
                </Text>
                <Text 
                  size="sm"
                  style={{ 
                    color: "rgba(255, 255, 255, 0.4)"
                  }}
                >
                  Upload an image or video to get started
                </Text>
              </div>
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
              style={{
                border: "2px solid rgba(102, 126, 234, 0.5)",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {mediaType === "video" ? (
                <ReactPlayer
                  ref={playerRef}
                  url={mediaFile}
                  playing={isPlaying}
                  style={{
                    opacity: currentTime >= startTime && currentTime <= endTime ? 1 : 0.3,
                    transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  width="100%"
                  height="100%"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaFile}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: currentTime >= startTime && currentTime <= endTime ? 1 : 0.3,
                    transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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
