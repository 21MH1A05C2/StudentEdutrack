import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { results_list } from '../../assets/assets';
import { useLocation, Navigate } from 'react-router-dom';
import './Studentdashboard.css';

const StudentDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const authenticatedRollNo = queryParams.get('rollno');
  const [userData, setUserData] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [marksData, setMarksData] = useState(null);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  
  const resultData = results_list.find(student => student.rollno === authenticatedRollNo) || null;

  useEffect(() => {
    if (!authenticatedRollNo) return;

    axios.get(`http://localhost:4000/getuser/${authenticatedRollNo}`)
      .then(response => {
        setUserData(response.data);
        console.log('User data fetched:', response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [authenticatedRollNo]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleFetchDetails = () => {
    if (!selectedSemester) {
      console.error('Please select a semester');
      toast.error('Please select a semester');
      return;
    }

    // Fetch marks data for selected semester
    const semesterDetails = resultData?.academicRecord.semesters.find(
      semester => semester.semester === selectedSemester
    );

    if (semesterDetails) {
      console.log('Semester details:', semesterDetails);
      setMarksData(semesterDetails);
    } else {
      console.error('No semester details found for the selected semester');
      toast.error('No semester details found for the selected semester');
    }
  };

  const logout = () => {
    setShouldNavigate(true);
  };

  if (shouldNavigate) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="student-dashboard">
      <button className='out_stu' onClick={logout}>Log Out</button>
      {userData && userData.profilepic && (
        <div className='getup'>
          <h2>Welcome, {authenticatedRollNo}</h2>
          <img src={`data:image/jpg;base64,${btoa(String.fromCharCode(...new Uint8Array(userData.profilepic.data)))}`} alt="User" />
        </div>
      )}
      <select value={selectedSemester} onChange={handleSemesterChange}>
        <option value="">Select Semester</option>
        {resultData && resultData.academicRecord.semesters.map(semester => (
          <option key={semester.semester} value={semester.semester}>
            {semester.semester}
          </option>
        ))}
      </select>

      <button onClick={handleFetchDetails}>Results</button>

      {marksData && (
        <table className='table_design'>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {marksData.subjects.map(subject => (
              <tr key={subject.name}>
                <td>{subject.name}</td>
                <td>{subject.grade}</td>
                <td>{subject.grade === 'F' ? 'Fail' : 'Pass'}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3}><b>SGPA: {marksData.SGPA}</b></td>
            </tr>
            <tr>
              <td colSpan={3}><b>Overall Percentage: {resultData.academicRecord.overallPercentage}%</b></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;
