import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function Dashboard() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setRecords(snap.docs.map((d) => d.data()));
    };
    fetch();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Attendance Dashboard</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#6366f1", color: "white" }}>
          <tr><th>Name</th><th>Date</th><th>Time</th></tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.date}</td>
              <td>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
