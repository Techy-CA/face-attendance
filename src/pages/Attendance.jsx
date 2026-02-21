import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { loadModels } from "../utils/loadModels";

export default function Attendance() {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    loadModels().then(startCamera);
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStatus("📷 Camera ready. Click Mark Attendance.");
  };

  const handleAttendance = async () => {
    setStatus("🔍 Scanning...");

    // Firestore se sab users fetch karo
    const snapshot = await getDocs(collection(db, "users"));
    const labeledDescriptors = snapshot.docs.map((doc) => {
      const { name, descriptor } = doc.data();
      return new faceapi.LabeledFaceDescriptors(name, [
        new Float32Array(descriptor),
      ]);
    });

    if (labeledDescriptors.length === 0) {
      setStatus("❌ No registered faces found!");
      return;
    }

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("❌ Face not detected. Try again!");
      return;
    }

    // 0.5 threshold — lower = stricter match [web:9]
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.label === "unknown") {
      setStatus("❓ Unknown face. Please register first.");
      return;
    }

    // Attendance Firestore mein save karo
    await addDoc(collection(db, "attendance"), {
      name: bestMatch.label,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString(),
    });

    setStatus(`✅ Attendance marked for: ${bestMatch.label}`);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>📋 Mark Attendance</h2>
      <video ref={videoRef} autoPlay muted width="400" height="300"
        style={{ borderRadius: "12px", border: "2px solid #10b981" }}
      />
      <br />
      <button onClick={handleAttendance}
        style={{ margin: "1rem", padding: "0.6rem 2rem", background: "#10b981",
          color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
        Mark Attendance
      </button>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{status}</p>
    </div>
  );
}
