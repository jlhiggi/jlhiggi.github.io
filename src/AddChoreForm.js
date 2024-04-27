// AddChoreForm.js
import React, { useState } from 'react';

function AddChoreForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ title, points: parseInt(points) });
    setTitle('');
    setPoints('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Chore title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Points"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <button type="submit">Add Chore</button>
    </form>
  );
}

export default AddChoreForm;