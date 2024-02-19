import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import '@mediapipe/face_detection';
import '@tensorflow/tfjs-core';
// Register WebGL backend.
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h3>People detection demo</h3>
      <Facedetector />
    </>
  );
}
function Facedetector() {
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);
  const [detector, setDetector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faces, setFaces] = useState(0);

  // Assuming `faceDetection` is available
  useEffect(() => {
    const createDetectorAsync = async () => {
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detectorConfig = {
        runtime: 'tfjs',
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          return stream;
        });
        const detector = await faceDetection.createDetector(
          model,
          detectorConfig
        );
        setDetector(detector);

        const handleVideo = async () => {
          const video = document.getElementById('videoFeed');
          const estimationConfig = { flipHorizontal: false };
          const faces = await detector.estimateFaces(video, estimationConfig);
          setFaces(faces.length);
          setTimeout(handleVideo, 500);
        };
        handleVideo();
      } catch (error) {
        console.error('Error creating detector:', error);
      } finally {
        setLoading(false);
      }
    };

    createDetectorAsync();
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef]);

  return (
    <div className="faceDetector">
      <video
        ref={videoRef}
        style={{
          transform: 'scaleX(-1)',
        }}
        id="videoFeed"
        autoPlay
        width="480"
        height="360"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        // Use the detector here if available
        <p>Detector is ready!</p>
      )}
      <p>Faces Found : {faces}</p>
    </div>
  );
}
export default App;
