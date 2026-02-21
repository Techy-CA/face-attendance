import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { loadModels } from "../utils/loadModels";

export default function Register() {
  const videoRef = useRef();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    loadModels().then(startCamera);
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStatus("Camera ready! Enter name and capture.");
  };

  const handleRegister = async () => {
    if (!name) return alert("Name daalo pehle!");
    setStatus("Scanning face...");

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("❌ Face not detected. Adjust lighting!");
      return;
    }

    const descriptor = Array.from(detection.descriptor);

    await addDoc(collection(db, "users"), {
      name,
      descriptor,
      createdAt: new Date().toISOString(),
    });

    setStatus(`✅ ${name} registered successfully!`);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>👤 Register Face</h2>
      <video ref={videoRef} autoPlay muted width="400" height="300"
        style={{ borderRadius: "12px", border: "2px solid #6366f1" }}
      />
      <br />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
        style={{ margin: "1rem", padding: "0.5rem 1rem", borderRadius: "8px" }}
      />
      <br />
      <button onClick={handleRegister}
        style={{ padding: "0.6rem 2rem", background: "#6366f1", color: "#fff",
          border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Capture & Register
      </button>
      <p>{status}</p>
    </div>
  );
}
