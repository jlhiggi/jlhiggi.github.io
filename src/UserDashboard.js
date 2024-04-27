import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css';
import AddMemberForm from './AddMemberForm';
import AddChoreForm from './AddChoreForm';

function UserDashboard({ user, onAddChore }) {
  const [members, setMembers] = useState([]);
  const [chores, setChores] = useState([]);
  const [completedChores, setCompletedChores] = useState([]);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    fetchChores();
    fetchCompletedChores();
    fetchPointsEarned();
  }, []);

  function fetchChores() {
    axios.get('/api/chores')
      .then((response) => {
        setChores(response.data);
      })
      .catch((error) => {
        console.error('Error fetching chores:', error);
      });
  }

  function fetchCompletedChores() {
    axios.get('/api/chores/completed')
      .then((response) => {
        setCompletedChores(response.data);
      })
      .catch((error) => {
        console.error('Error fetching completed chores:', error);
      });
  }

  function fetchPointsEarned() {
    axios.get('/api/users/points')
      .then((response) => {
        setPointsEarned(response.data.points);
      })
      .catch((error) => {
        console.error('Error fetching points earned:', error);
      });
  }

  function addMember(name) {
    setMembers([...members, name]);
  }

  function addChore(chore) {
    const choreData = {
      ...chore,
      assignedTo: user._id,
    };
    onAddChore(choreData);
    setChores([...chores, choreData]);
  }

  function completeChore(choreId) {
      const completedChore = chores.find((chore) => chore._id === choreId);
      if (completedChore) {
        setChores(chores.filter((chore) => chore._id !== choreId));
        setCompletedChores([...completedChores, completedChore]);
        setPointsEarned(pointsEarned + completedChore.points);
      }

    axios.put(`/api/chores/${choreId}/complete`)
      .then(() => {
        fetchChores();
        fetchCompletedChores();
        fetchPointsEarned();
      })
      .catch((error) => {
        console.error('Error completing chore:', error);
      });
  }

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user.username}!</h1>

      <section className="points">
        <h2>Points Earned</h2>
        <p>{pointsEarned}</p>
      </section>

      <section className="assigned-chores">
        <h2>Assigned Chores</h2>
        <ul>
          {chores.map((chore) => (
            <li key={chore._id}>
              {chore.title} ({chore.points} points)
              <button onClick={() => completeChore(chore._id)}>Complete</button>
            </li>
          ))}
        </ul>
        <h3>Members</h3>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>
      </section>

      <section className="completed-chores">
        <h2>Completed Chores</h2>
        <ul>
          {completedChores.map((chore) => (
            <li key={chore._id}>
              {chore.title} ({chore.points} points)
            </li>
          ))}
        </ul>
      </section>

      <h2>Add member</h2>
      <AddMemberForm onSubmit={addMember} />

      <h2>Add Chore</h2>
      <AddChoreForm onSubmit={addChore} />

      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default UserDashboard;