
import { useState, useEffect } from 'react'
import './App.css'

function formatDOB(date) {
  if (!date) return ''

  // Keep MySQL DATE strings unchanged; avoid timezone conversion.
  return String(date).slice(0, 10)
}

function App() {
  const [usn, setUsn] = useState('')
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [students, setStudents] = useState([])
  const [editindex, setEditindex] = useState(null)
  const [editUsn, setEditUsn] = useState(null)

  const loadStudents = () => {
    fetch('http://localhost:3000/students')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load students')
        return response.json()
      })
      .then(data => setStudents(data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const clearForm = () => {
    setUsn('')
    setName('')
    setDob('')
    setEditindex(null)
    setEditUsn(null)
  }

  const handleSubmit = () => {
    if (!usn.trim() || !name.trim() || !dob) {
      alert('Please fill all fields')
      return
    }

    const studentData = {
      usn: usn.trim(),
      name: name.trim(),
      dob: dob
    }

    const isEditing = editindex !== null
    const url = isEditing
      ? `http://localhost:3000/students/${encodeURIComponent(editUsn)}`
      : 'http://localhost:3000/students'

    fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to save student')
        loadStudents()
        clearForm()
      })
      .catch(error => {
        console.error(error)
        alert('Failed to save student')
      })
  }

  const handleDelete = (studentUsn) => {
    fetch(
      `http://localhost:3000/students/${encodeURIComponent(studentUsn)}`,
      { method: 'DELETE' }
    )
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete student')
        setStudents(current =>
          current.filter(student => student.usn !== studentUsn)
        )
      })
      .catch(error => {
        console.error(error)
        alert('Failed to delete student')
      })
  }

  return (
    <>
      <div className="college-header">
        <img
          src="/college-logo.png"
          alt="College Logo"
          width="50"
          height="50"
        />
        <div className="college-info">
          <h1>VIDYAVARDHAKA COLLEGE OF ENGINEERING</h1>
          <p>Student Management System</p>
        </div>
      </div>

      <div className="container">
        <h1>Student Management System</h1>

        <div className="form">
          <input
            type="text"
            placeholder="Enter USN"
            value={usn}
            onChange={e => setUsn(e.target.value)}
          />

          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
          />

          <button className="add-btn" onClick={handleSubmit}>
            {editindex === null ? 'ADD STUDENT' : 'UPDATE STUDENT'}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>USN</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={student.usn}>
                <td>{student.usn}</td>
                <td>{student.name}</td>
                <td>{formatDOB(student.dob)}</td>

                <td>
                  <div className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setUsn(student.usn)
                        setName(student.name)
                        setDob(formatDOB(student.dob))
                        setEditindex(index)
                        setEditUsn(student.usn)
                      }}
                    >
                      EDIT
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(student.usn)}
                    >
                      DELETE
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App
