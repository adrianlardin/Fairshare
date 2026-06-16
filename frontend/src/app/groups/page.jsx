"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./groups.css";

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:5000/groups",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener grupos");
        }

        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-container">

      <div className="groups-header">
        <div>
          <h1>Select Group</h1>
          <p>Manage your shared travel expenses.</p>
        </div>

        <button className="create-btn">
          + Create New Group
        </button>
      </div>

      <div className="groups-grid">

        {groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="group-card"
            >
              <h2>{group.name}</h2>

              <p>
                {group.description || "Travel expenses"}
              </p>

              <span>
                {group.category || "Open Group"}
              </span>
            </Link>
          ))
        )}

      </div>

    </div>
  );
}