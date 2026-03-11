// Upload.jsx
import React, { useState } from "react";

export function Upload() {
  const [title, setTitle] = useState("");
  const [audio, setAudio] = useState(null);
  const [poster, setPoster] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("audio", audio);
    if (poster) formData.append("poster", poster);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded:", data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files[0])}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPoster(e.target.files[0])}
      />
      <button type="submit">Upload Song</button>
    </form>
  );
}
