import React, { useState } from 'react';
import './Admindashboard.css';
import { results_list } from '../../assets/assets';
import { Navigate} from 'react-router-dom';
const AdminDashboard = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filterOption, setFilterOption] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleFilterChange = (event) => {
    const option = event.target.value;
    setFilterOption(option);
    applyFilters(option);
  };

  const applyFilters = (option) => {
    if (option === 'pass') {
      const passFiltered = results_list.filter((student) =>
        student.academicRecord.semesters.every((semester) => semester.status === 'pass')
      );
      setFilteredStudents(passFiltered);
    } else if (option === 'fail') {
      const failFiltered = results_list.filter((student) =>
        student.academicRecord.semesters.some((semester) => semester.status === 'fail')
      );
      setFilteredStudents(failFiltered);
    } else {
      setFilteredStudents(results_list);
    }
  };
 const logout=()=>{
  setShouldNavigate(true);
 }
  const handleTopFilterChange = (event) => {
    const option = event.target.value;
    if (option === 'top5' || option === 'top10') {
      let sortedStudents = [...filteredStudents];
      sortedStudents = sortedStudents.sort((a, b) => b.academicRecord.overallPercentage - a.academicRecord.overallPercentage);
      if (option === 'top5') {
        sortedStudents = sortedStudents.slice(0, 5);
      } else {
        sortedStudents = sortedStudents.slice(0, 10);
      }
      setFilteredStudents(sortedStudents);
    }
  };
  if (shouldNavigate) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="student-list">
        <button className='log_out' onClick={logout}>Log Out</button>
      <div className="top-section">
        <select value={selectedSemester} onChange={handleSemesterChange}>
          <option value="">Select Semester</option>
          <option value="1-1">1-1</option>
          <option value="1-2">1-2</option>
          <option value="2-1">2-1</option>
          <option value="2-2">2-2</option>
          <option value="3-1">3-1</option>
        </select>
        <select onChange={handleFilterChange}>
          <option value="">Filter</option>
          <option value="fail">Fail</option>
          <option value="pass">Pass</option>
        </select>
        {(filterOption === 'pass') && (
          <select onChange={handleTopFilterChange}>
            <option value="">Top</option>
            <option value="top5">Top 5</option>
            <option value="top10">Top 10</option>
          </select>
        )}
      </div>
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.rollno}</td>
                <td>{student.academicRecord.overallPercentage}</td>
                <td>{filterOption === 'pass' ? 'Pass' : 'Fail'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;