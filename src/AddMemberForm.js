// AddMemberForm.js
import React, { useState } from 'react';

function AddMemberForm({ onSubmit }) {
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(name);
    setName('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Member name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Add Member</button>
    </form>
  );
}

export default AddMemberForm;