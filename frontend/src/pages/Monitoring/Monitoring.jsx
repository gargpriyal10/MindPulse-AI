import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Brain,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  HeartPulse,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Square,
  Wifi,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import {
  startMonitoringSession,
  finishMonitoringSession,
} from "../../services/monitoringService";

import {
  uploadEmotionImage,
} from "../../services/api";

import { uploadAudioFile } from "../../services/api";

import "./Monitoring.css";

function Monitoring() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const faceDetectorRef = useRef(null);
  const faceAnimationRef = useRef(null);
  const sessionRef = useRef(null);

  const [isMonitoring, setIsMonitoring] =
    useState(false);

  const [isPaused, setIsPaused] =
    useState(false);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [cameraError, setCameraError] =
    useState("");

  const [cameraReady, setCameraReady] =
    useState(false);

  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [audioResult, setAudioResult] = useState(null);

  const audioStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioProcessorRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [faceStatus, setFaceStatus] =
    useState("idle");

  const [faceBox, setFaceBox] =
    useState(null);

  const [currentEmotion, setCurrentEmotion] =
    useState({
      name: "Neutral",
      emoji: "😐",
      confidence: 0,
      intensity: 0,
    });

  const [emotionSignals, setEmotionSignals] =
    useState([
      { name: "Neutral", emoji: "😐", value: 0, color: "lavender" },
      { name: "Happy", emoji: "😊", value: 0, color: "teal" },
      { name: "Surprise", emoji: "😮", value: 0, color: "teal" },
      { name: "Sad", emoji: "😔", value: 0, color: "lavender" },
      { name: "Anger", emoji: "😠", value: 0, color: "coral" },
      { name: "Disgust", emoji: "🤢", value: 0, color: "coral" },
      { name: "Fear", emoji: "😨", value: 0, color: "coral" },
      { name: "Contempt", emoji: "😒", value: 0, color: "lavender" },
    ]);

  /* ============================================================
     START CAMERA
  ============================================================ */

  const startCamera = async () => {
    setCameraError("");

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        "Camera access is not supported by this browser."
      );

      return false;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();
      }

      setCameraReady(true);

      return true;
    } catch (error) {
      console.error(
        "Unable to access camera:",
        error
      );

      if (
        error.name ===
        "NotAllowedError"
      ) {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser."
        );
      } else if (
        error.name ===
        "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else if (
        error.name ===
        "NotReadableError"
      ) {
        setCameraError(
          "Your camera is already being used by another application."
        );
      } else {
        setCameraError(
          "Unable to access the camera. Please check your camera settings."
        );
      }

      setCameraReady(false);

      return false;
    }
  };

  /* ============================================================
     FACE DETECTION
  ============================================================ */

  const startFaceDetection = async () => {
    if (!videoRef.current) {
      return;
    }

    if (faceDetectorRef.current) {
      return;
    }

    setFaceStatus("loading");
    setFaceBox(null);

    try {
      const vision =
        await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

      const detector =
        await FaceDetector.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            },
            runningMode: "VIDEO",
            minDetectionConfidence: 0.5,
          }
        );

      faceDetectorRef.current = detector;

      const detectFace = () => {
        const video = videoRef.current;

        if (
          !video ||
          video.readyState < 2 ||
          !isMonitoring ||
          isPaused
        ) {
          return;
        }

        try {
          const result =
            detector.detectForVideo(
              video,
              performance.now()
            );

          const detections =
            result?.detections || [];

          if (detections.length > 0) {
            const box =
              detections[0].boundingBox;

            if (
              box &&
              video.videoWidth > 0 &&
              video.videoHeight > 0
            ) {
              /*
                The webcam video uses:
                  object-fit: cover
                  transform: scaleX(-1)

                MediaPipe returns coordinates in the original
                camera frame, so those coordinates must be mapped
                to the displayed/cropped/mirrored video before the
                FACE box is positioned.
              */

              const container =
                video.parentElement;

              const containerWidth =
                container?.clientWidth ||
                video.clientWidth;

              const containerHeight =
                container?.clientHeight ||
                video.clientHeight;

              const scale = Math.max(
                containerWidth /
                video.videoWidth,
                containerHeight /
                video.videoHeight
              );

              const renderedWidth =
                video.videoWidth * scale;

              const renderedHeight =
                video.videoHeight * scale;

              const cropX =
                (renderedWidth -
                  containerWidth) /
                2;

              const cropY =
                (renderedHeight -
                  containerHeight) /
                2;

              const rawLeft =
                box.originX * scale -
                cropX;

              const rawTop =
                box.originY * scale -
                cropY;

              const renderedBoxWidth =
                box.width * scale;

              const renderedBoxHeight =
                box.height * scale;

              /*
                The video is mirrored with scaleX(-1).
                Mirror the bounding box horizontally so it
                stays over the user's face.
              */
              const mirroredLeft =
                containerWidth -
                rawLeft -
                renderedBoxWidth;

              setFaceBox({
                x:
                  (mirroredLeft /
                    containerWidth) *
                  100,

                y:
                  (rawTop /
                    containerHeight) *
                  100,

                width:
                  (renderedBoxWidth /
                    containerWidth) *
                  100,

                height:
                  (renderedBoxHeight /
                    containerHeight) *
                  100,
              });
            }

            setFaceStatus("detected");
          } else {
            setFaceBox(null);
            setFaceStatus("searching");
          }
        } catch (error) {
          console.error(
            "Face detection error:",
            error
          );

          setFaceBox(null);
          setFaceStatus("error");
        }

        faceAnimationRef.current =
          requestAnimationFrame(
            detectFace
          );
      };

      setFaceStatus("searching");

      faceAnimationRef.current =
        requestAnimationFrame(
          detectFace
        );
    } catch (error) {
      console.error(
        "Unable to initialize MediaPipe face detector:",
        error
      );

      setFaceBox(null);
      setFaceStatus("error");
    }
  };

  const stopFaceDetection = () => {
    if (faceAnimationRef.current) {
      cancelAnimationFrame(
        faceAnimationRef.current
      );

      faceAnimationRef.current = null;
    }

    if (faceDetectorRef.current) {
      faceDetectorRef.current.close();

      faceDetectorRef.current = null;
    }

    setFaceBox(null);
    setFaceStatus("idle");
  };

  useEffect(() => {
    if (
      isMonitoring &&
      cameraReady &&
      !isPaused
    ) {
      startFaceDetection();
    }

    if (isPaused) {
      if (faceAnimationRef.current) {
        cancelAnimationFrame(
          faceAnimationRef.current
        );

        faceAnimationRef.current = null;
      }

      setFaceBox(null);
      setFaceStatus("paused");
    }

    return () => {
      if (faceAnimationRef.current) {
        cancelAnimationFrame(
          faceAnimationRef.current
        );

        faceAnimationRef.current = null;
      }
    };
  }, [
    isMonitoring,
    cameraReady,
    isPaused,
  ]);


  const captureCameraFrame = () => {
    const video = videoRef.current;

    if (!video || !cameraReady) {
      return null;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.85
      );
    });
  };



  const uploadCameraFrame = async () => {
    try {
      if (
        !isMonitoring ||
        isPaused ||
        !cameraReady ||
        faceStatus !== "detected"
      ) {
        return;
      }

      const imageBlob = await captureCameraFrame();

      if (!imageBlob) {
        console.error("Unable to capture camera frame.");
        return;
      }

      const response = await uploadEmotionImage(imageBlob);
      const result = response.data;

      if (!result?.success) {
        console.error("Emotion prediction was unsuccessful:", result);
        return;
      }

      const emotionMap = {
        neutral: { name: "Neutral", emoji: "😐" },
        happiness: { name: "Happy", emoji: "😊" },
        surprise: { name: "Surprise", emoji: "😮" },
        sadness: { name: "Sad", emoji: "😔" },
        anger: { name: "Anger", emoji: "😠" },
        disgust: { name: "Disgust", emoji: "🤢" },
        fear: { name: "Fear", emoji: "😨" },
        contempt: { name: "Contempt", emoji: "😒" },
      };

      const emotionKey = result.emotion;
      const emotion = emotionMap[emotionKey];

      if (!emotion) {
        console.error("Unknown emotion returned by backend:", emotionKey);
        return;
      }

      const confidence = Math.round(
        Number(result.confidence) * 100
      );

      setCurrentEmotion({
        name: emotion.name,
        emoji: emotion.emoji,
        confidence,
        intensity: confidence,
      });

      const signalMap = {
        neutral: "Neutral",
        happiness: "Happy",
        surprise: "Surprise",
        sadness: "Sad",
        anger: "Anger",
        disgust: "Disgust",
        fear: "Fear",
        contempt: "Contempt",
      };

      setEmotionSignals((previous) =>
        previous.map((signal) => {
          const key = Object.keys(signalMap).find(
            (item) => signalMap[item] === signal.name
          );

          const score = key
            ? Number(result.scores?.[key] ?? 0)
            : 0;

          return {
            ...signal,
            value: Math.round(score * 100),
          };
        })
      );

      console.log("Camera emotion prediction:", result);
    } catch (error) {
      console.error(
        "Camera emotion upload failed:",
        error.response?.data || error.message || error
      );
    }
  };


  useEffect(() => {
    if (
      !isMonitoring ||
      isPaused ||
      !cameraReady ||
      faceStatus !== "detected"
    ) {
      return undefined;
    }

    const uploadTimer = setInterval(() => {
      uploadCameraFrame();
    }, 5000);

    return () => {
      clearInterval(uploadTimer);
    };
  }, [
    isMonitoring,
    isPaused,
    cameraReady,
    faceStatus,
  ]);

    const startAudioRecording = async () => {
    try {
      setAudioError("");
      setAudioResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioStreamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      audioProcessorRef.current = processor;
      audioChunksRef.current = [];

      processor.onaudioprocess = (event) => {
        audioChunksRef.current.push(
          new Float32Array(event.inputBuffer.getChannelData(0))
        );

        event.outputBuffer.getChannelData(0).fill(0);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsAudioRecording(true);
    } catch (error) {
      setAudioError(error.message || "Unable to access microphone.");
    }
  };

  const stopAudioRecording = async () => {
    try {
      const context = audioContextRef.current;

      if (!context) return;

      audioProcessorRef.current?.disconnect();

      const chunks = audioChunksRef.current;
      const totalLength = chunks.reduce(
        (total, chunk) => total + chunk.length,
        0
      );

      const samples = new Float32Array(totalLength);
      let offset = 0;

      chunks.forEach((chunk) => {
        samples.set(chunk, offset);
        offset += chunk.length;
      });

      const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(wavBuffer);

      const writeString = (position, value) => {
        for (let i = 0; i < value.length; i++) {
          view.setUint8(position + i, value.charCodeAt(i));
        }
      };

      writeString(0, "RIFF");
      view.setUint32(4, 36 + samples.length * 2, true);
      writeString(8, "WAVE");
      writeString(12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, context.sampleRate, true);
      view.setUint32(28, context.sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, "data");
      view.setUint32(40, samples.length * 2, true);

      for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(
          44 + i * 2,
          sample < 0 ? sample * 32768 : sample * 32767,
          true
        );
      }

      const audioBlob = new Blob([wavBuffer], {
        type: "audio/wav",
      });

      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;

      await context.close();
      audioContextRef.current = null;
      audioProcessorRef.current = null;
      setIsAudioRecording(false);

      const response = await uploadAudioFile(audioBlob);
      setAudioResult(response.data);

    } catch (error) {
      setAudioError(
        error.response?.data?.message ||
        error.message ||
        "Audio recording or upload failed."
      );
      setIsAudioRecording(false);
    }
  };

  /* ============================================================
     STOP CAMERA
  ============================================================ */

  const stopCamera = () => {
    stopFaceDetection();

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  /* ============================================================
     CLEANUP CAMERA WHEN PAGE UNMOUNTS
  ============================================================ */

  useEffect(() => {
    return () => {
      if (faceAnimationRef.current) {
        cancelAnimationFrame(
          faceAnimationRef.current
        );
      }

      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  /* ============================================================
     TIMER
  ============================================================ */

  useEffect(() => {
    if (
      !isMonitoring ||
      isPaused
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setElapsedSeconds(
        (previous) => previous + 1
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    isMonitoring,
    isPaused,
  ]);

  /* ============================================================
     MOCK EMOTION CHANGES

     NOTE:
     These are still simulated.
     Real emotion recognition will be connected later.
  ============================================================ */



  /* ============================================================
     TIME FORMAT
  ============================================================ */

  const formatTime = (
    seconds
  ) => {
    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) /
        60
      );

    const remainingSeconds =
      seconds % 60;

    return [
      hours,
      minutes,
      remainingSeconds,
    ]
      .map((value) =>
        String(value).padStart(
          2,
          "0"
        )
      )
      .join(":");
  };

  /* ============================================================
     START SESSION
  ============================================================ */

  const handleStartSession =
    async () => {
      const cameraStarted =
        await startCamera();

      if (!cameraStarted) {
        return;
      }

      const session =
        startMonitoringSession();

      sessionRef.current = session;

      setElapsedSeconds(0);
      setIsPaused(false);
      setIsMonitoring(true);
    };

  /* ============================================================
     STOP SESSION
  ============================================================ */

  const handleStopSession =
    () => {
      if (sessionRef.current) {
        finishMonitoringSession(
          sessionRef.current.id,
          {
            duration: elapsedSeconds,
            dominantEmotion:
              currentEmotion.name,
            confidence:
              currentEmotion.confidence,
            wellbeingScore: Math.round(
              emotionSignals.reduce(
                (total, signal) => total + Number(signal.value || 0),
                0
              ) / emotionSignals.length
            ),
            emotions:
              emotionSignals.reduce(
                (result, signal) => ({
                  ...result,
                  [signal.name]:
                    signal.value,
                }),
                {}
              ),
          }
        );

        sessionRef.current = null;
      }

      setIsMonitoring(false);
      setIsPaused(false);

      stopCamera();
    };

  /* ============================================================
     PAUSE / RESUME
  ============================================================ */

  const handlePauseResume =
    () => {
      setIsPaused(
        (previous) =>
          !previous
      );
    };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <main className="monitoring-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="monitoring-sidebar">

        <a
          href="/dashboard"
          className="monitoring-brand"
        >
          <span className="monitoring-brand__icon">
            <Brain size={20} />
          </span>

          <span>
            MindPulse{" "}
            <strong>AI</strong>
          </span>
        </a>

        <nav className="monitoring-nav">

          <span className="monitoring-nav__label">
            WORKSPACE
          </span>

          <a
            href="/dashboard"
            className="monitoring-nav__item"
          >
            <Activity size={17} />
            Overview
          </a>

          <a
            href="/monitoring"
            className="monitoring-nav__item monitoring-nav__item--active"
          >
            <Camera size={17} />
            Monitoring
          </a>

          <a
            href="/history"
            className="monitoring-nav__item"
          >
            <Clock3 size={17} />
            History
          </a>

          <a
            href="/reports"
            className="monitoring-nav__item"
          >
            <Activity size={17} />
            Reports
          </a>

          <span className="monitoring-nav__label monitoring-nav__label--second">
            ACCOUNT
          </span>

          <a
            href="/profile"
            className="monitoring-nav__item"
          >
            <HeartPulse size={17} />
            Profile
          </a>

          <a
            href="/settings"
            className="monitoring-nav__item"
          >
            <ShieldCheck size={17} />
            Settings
          </a>

        </nav>

        <div className="monitoring-sidebar__bottom">

          <div className="monitoring-sidebar__privacy">

            <ShieldCheck size={15} />

            <span>
              Privacy-first monitoring
            </span>

          </div>

          <a
            href="/dashboard"
            className="monitoring-sidebar__back"
          >
            <ArrowLeft size={14} />
            Dashboard
          </a>

        </div>

      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="monitoring-main">

        {/* HEADER */}

        <header className="monitoring-header">

          <div>

            <span className="monitoring-header__eyebrow">
              REAL-TIME ANALYSIS
            </span>

            <h1>
              Emotion Monitoring
            </h1>

            <p>
              Stay present while
              MindPulse observes your
              emotional signals.
            </p>

          </div>

          <div className="monitoring-header__status">

            <span
              className={
                isMonitoring
                  ? "monitoring-status-dot"
                  : "monitoring-status-dot monitoring-status-dot--offline"
              }
            />

            <span>
              {isMonitoring
                ? "Camera active"
                : "Ready to start"}
            </span>

            <div className="monitoring-header__timer">

              <Clock3 size={14} />

              {formatTime(
                elapsedSeconds
              )}

            </div>

          </div>

        </header>

        {/* =================================================
            SESSION STATUS
        ================================================= */}

        <div className="monitoring-session-bar">

          <div className="monitoring-session-bar__left">

            <div className="monitoring-live-icon">
              <Wifi size={16} />
            </div>

            <div>

              <strong>
                {isMonitoring
                  ? isPaused
                    ? "Monitoring paused"
                    : "Live session active"
                  : "Ready to monitor"}
              </strong>

              <span>
                {isMonitoring
                  ? isPaused
                    ? "Camera is paused. Resume when you're ready."
                    : "Camera is active and ready for emotion analysis."
                  : "Start a session to enable your camera."}
              </span>

            </div>

          </div>

          <div className="monitoring-session-tags">

            {cameraReady && (
              <span>
                <Eye size={13} />
                Camera connected
              </span>
            )}

            {isMonitoring && (
              <span>
                <CheckCircle2 size={13} />
                Signal stable
              </span>
            )}

          </div>

        </div>

        {/* =================================================
            CAMERA ERROR
        ================================================= */}

        {cameraError && (

          <div
            className="monitoring-camera-error"
            role="alert"
          >

            <AlertCircle size={17} />

            <div>
              <strong>
                Camera access required
              </strong>

              <span>
                {cameraError}
              </span>
            </div>

          </div>

        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="monitoring-grid">

          {/* =================================================
              WEBCAM
          ================================================= */}

          <Card
            className="monitoring-camera-card"
            padding="none"
          >

            <div className="monitoring-card-header">

              <div>

                <span className="monitoring-card-kicker">
                  CAMERA FEED
                </span>

                <h2>
                  Live preview
                </h2>

              </div>

              <div className="monitoring-camera-status">

                <span />

                {cameraReady
                  ? "LIVE"
                  : "OFFLINE"}

              </div>

            </div>

            <div className="monitoring-camera">

              {/* REAL CAMERA
                  The video element must always exist in the DOM.
                  Otherwise startCamera() receives a null videoRef
                  before cameraReady causes the video to render. */}

              <video
                ref={videoRef}
                className="monitoring-camera__video"
                autoPlay
                playsInline
                muted
              />

              {!cameraReady && (
                <>
                  <div className="monitoring-camera__grid" />

                  <div className="monitoring-camera__center">

                    <div className="monitoring-camera__face">

                      <div className="monitoring-face-corner monitoring-face-corner--tl" />

                      <div className="monitoring-face-corner monitoring-face-corner--tr" />

                      <div className="monitoring-face-corner monitoring-face-corner--bl" />

                      <div className="monitoring-face-corner monitoring-face-corner--br" />

                      <div className="monitoring-face-placeholder">

                        <Camera size={32} />

                      </div>

                      <div className="monitoring-face-label">

                        <span />

                        CAMERA READY

                      </div>

                    </div>

                  </div>

                </>
              )}

              {/* CAMERA TOP LABEL */}

              <div className="monitoring-camera__top">

                <span>
                  CAMERA 01
                </span>

                <span>
                  720p • Live
                </span>

              </div>

              {/* CAMERA BOTTOM LABEL */}

              {cameraReady && (

                <div className="monitoring-camera__bottom">

                  <span>

                    <span className="monitoring-camera-dot" />

                    Camera active

                  </span>

                  <span>
                    Secure local stream
                  </span>

                </div>

              )}

              {cameraReady && (
                <div
                  className={`monitoring-face-status monitoring-face-status--${faceStatus}`}
                >
                  <span className="monitoring-face-status__dot" />

                  {faceStatus === "loading" &&
                    "Starting face detection..."}

                  {faceStatus === "searching" &&
                    "Looking for a face..."}

                  {faceStatus === "detected" &&
                    "Face detected"}

                  {faceStatus === "paused" &&
                    "Face detection paused"}

                  {faceStatus === "error" &&
                    "Face detection unavailable"}

                  {faceStatus === "idle" &&
                    "Face detection ready"}
                </div>
              )}

              {cameraReady &&
                faceBox &&
                faceStatus === "detected" && (
                  <div
                    className="monitoring-face-box"
                    style={{
                      left: `${faceBox.x}%`,
                      top: `${faceBox.y}%`,
                      width: `${faceBox.width}%`,
                      height: `${faceBox.height}%`,
                    }}
                  >
                    <span className="monitoring-face-box__label">
                      FACE
                    </span>
                  </div>
                )}

              {/* SESSION ENDED */}

              {!isMonitoring &&
                !cameraReady && (

                  <div className="monitoring-camera__ended">

                    <div>

                      <Square size={22} />

                      <strong>
                        Camera inactive
                      </strong>

                      <span>
                        Start a new session
                        to enable your
                        camera.
                      </span>

                    </div>

                  </div>

                )}

              {/* PAUSED */}

              {isMonitoring &&
                isPaused && (

                  <div className="monitoring-camera__paused">

                    <Pause size={24} />

                    <strong>
                      Monitoring paused
                    </strong>

                    <span>
                      Resume when you're
                      ready.
                    </span>

                  </div>

                )}

            </div>

            {/* CAMERA CONTROLS */}

            <div className="monitoring-camera-controls">

              {isMonitoring ? (
                <>
                  <button
                    type="button"
                    className="monitoring-control-button"
                    onClick={
                      handlePauseResume
                    }
                  >

                    {isPaused ? (
                      <Play size={15} />
                    ) : (
                      <Pause size={15} />
                    )}

                    {isPaused
                      ? "Resume"
                      : "Pause"}

                  </button>

                  <button
                    type="button"
                    className="monitoring-control-button monitoring-control-button--danger"
                    onClick={
                      handleStopSession
                    }
                  >

                    <Square size={14} />

                    Stop session

                  </button>
                </>
              ) : (

                <Button
                  icon={
                    <Play size={15} />
                  }
                  onClick={
                    handleStartSession
                  }
                >
                  Start Monitoring
                </Button>

              )}

            </div>

            <div style={{ padding: "16px" }}>
  <h3>Audio Emotion Analysis</h3>

  <button
    type="button"
    onClick={
      isAudioRecording
        ? stopAudioRecording
        : startAudioRecording
    }
    disabled={!isMonitoring || isPaused}
  >
    {isAudioRecording ? "Stop & Analyze Audio" : "Start Audio Recording"}
  </button>

  {isAudioRecording && (
    <p>Recording in progress... Please speak clearly.</p>
  )}

  {audioError && (
    <p role="alert" style={{ color: "red" }}>
      {audioError}
    </p>
  )}

  {audioResult && (
    <div>
      <p>Detected emotion: {audioResult.emotion}</p>
      <p>
        Confidence:{" "}
        {Math.round(Number(audioResult.confidence) * 100)}%
      </p>
    </div>
  )}
</div>

          </Card>

          {/* =================================================
              CURRENT EMOTION
          ================================================= */}

          <Card
            className="monitoring-emotion-card"
            padding="medium"
          >

            <div className="monitoring-card-header">

              <div>

                <span className="monitoring-card-kicker">
                  CURRENT STATE
                </span>

                <h2>
                  Live emotion
                </h2>

              </div>

              <Activity
                size={17}
                className="monitoring-card-header__icon"
              />

            </div>

            <div className="monitoring-current-emotion">

              <div className="monitoring-current-emotion__orb">

                <div />

                <span>
                  {currentEmotion.emoji}
                </span>

              </div>

              <span className="monitoring-current-emotion__label">
                DETECTED EMOTION
              </span>

              <h3>
                {currentEmotion.name}
              </h3>

              <div className="monitoring-confidence">

                <div className="monitoring-confidence__header">

                  <span>
                    Confidence
                  </span>

                  <strong>
                    {currentEmotion.confidence}%
                  </strong>

                </div>

                <div className="monitoring-confidence__track">

                  <span
                    style={{
                      width: `${currentEmotion.confidence}%`,
                    }}
                  />

                </div>

              </div>

              <div className="monitoring-emotion-stats">

                <div>

                  <span>
                    Intensity
                  </span>

                  <strong>
                    {currentEmotion.intensity}%
                  </strong>

                </div>

                <div>

                  <span>
                    Stability
                  </span>

                  <strong>
                    High
                  </strong>

                </div>

              </div>

            </div>

          </Card>

        </section>

        {/* =================================================
            EMOTION SIGNALS
        ================================================= */}

        <section className="monitoring-section">

          <div className="monitoring-section-header">

            <div>

              <span>
                EMOTION SIGNALS
              </span>

              <h2>
                What MindPulse is detecting
              </h2>

              <p>
                Relative intensity of
                detected emotional states.
              </p>

            </div>

            {isMonitoring && (

              <div className="monitoring-signal-live">

                <span />

                Updating live

              </div>

            )}

          </div>

          <div className="monitoring-signals">

            {emotionSignals.map(
              (signal) => (

                <Card
                  key={signal.name}
                  className={`monitoring-signal-card monitoring-signal-card--${signal.color}`}
                  padding="medium"
                >

                  <div className="monitoring-signal-card__top">

                    <div className="monitoring-signal-card__emotion">

                      <span>
                        {signal.emoji}
                      </span>

                      <strong>
                        {signal.name}
                      </strong>

                    </div>

                    <strong>
                      {signal.value}%
                    </strong>

                  </div>

                  <div className="monitoring-signal-card__track">

                    <span
                      style={{
                        width: `${signal.value}%`,
                      }}
                    />

                  </div>

                  <small>

                    {signal.value >=
                      70
                      ? "Strong signal"
                      : signal.value >=
                        40
                        ? "Moderate signal"
                        : "Low signal"}

                  </small>

                </Card>

              )
            )}

          </div>

        </section>

        {/* =================================================
            AI OBSERVATION
        ================================================= */}

        <section className="monitoring-bottom-grid">

          <Card
            className="monitoring-observation"
            padding="medium"
          >

            <div className="monitoring-observation__header">

              <div className="monitoring-observation__icon">
                <Sparkles size={18} />
              </div>

              <div>

                <span>
                  AI OBSERVATION
                </span>

                <h2>
                  Your current emotional
                  snapshot
                </h2>

              </div>

            </div>

            <p>
              Your current signals suggest
              a relatively calm emotional
              state. Facial cues indicate
              low stress activity with a
              stable level of positive
              engagement.
            </p>

            <div className="monitoring-observation__tags">

              <span>
                Calm dominant
              </span>

              <span>
                Low stress
              </span>

              <span>
                Stable
              </span>

            </div>

            <div className="monitoring-observation__notice">

              <AlertCircle size={15} />

              <span>
                This is an AI-generated
                observation and should not
                be considered a medical
                diagnosis.
              </span>

            </div>

          </Card>

          <Card
            className="monitoring-wellbeing"
            padding="medium"
          >

            <div className="monitoring-wellbeing__header">

              <span>
                LIVE WELL-BEING
              </span>

              <HeartPulse size={17} />

            </div>

            <div className="monitoring-wellbeing__score">

              <strong>
                84
              </strong>

              <span>
                / 100
              </span>

            </div>

            <div className="monitoring-wellbeing__meter">

              <span />

            </div>

            <p>
              Balanced emotional state
            </p>

            <div className="monitoring-wellbeing__legend">

              <span>

                <i />

                Current

              </span>

              <span>

                <i />

                Healthy range

              </span>

            </div>

          </Card>

        </section>

        {/* FOOTER */}

        <footer className="monitoring-footer">

          <span>
            MindPulse AI • Real-time
            emotional awareness
          </span>

          <span>
            Privacy-first • Human-centric
          </span>

        </footer>

      </section>

    </main>
  );
}

export default Monitoring;