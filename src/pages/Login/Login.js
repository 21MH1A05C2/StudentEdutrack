import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Link , Navigate} from 'react-router-dom';
import './Login.css';
const Login = () => {
  const [authenticatedRollNo, setAuthenticatedRollNo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [AdminloggedIn, setAdminLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    rollno: '',
    password: '',
  });
  const notify = () => toast("Login successful");
  const [errors, setErrors] = useState({});

  const backend_api = 'http://localhost:4000/login'; // API endpoint for user login

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    const newErrors = {};

    if (!formData.rollno.trim()) {
      newErrors.rollno = 'Valid Roll No is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    // Update errors state with new validation errors
    setErrors(newErrors);

    // If there are validation errors, prevent form submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    if(formData.rollno==="YDP12" && formData.password==="123"){
      notify();
      setFormData({
        rollno: '',
        password: '',
      });
      setAdminLoggedIn(true);
      
    }
    else{
      try {
        // Send POST request to backend API for login
        const response = await axios.post(backend_api, formData);
  
        if (response.status === 200) {
          notify();
          // alert('Login successful');
          // Optionally clear form data after successful submission
          setFormData({
            rollno: '',
            password: '',
          });
          setLoggedIn(true);
          setAuthenticatedRollNo(response.data.rollno);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast('Login failed. Please check your credentials and try again.');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rollno">Roll No:</label>
          <input
            type="text"
            id="rollno"
            name="rollno"
            value={formData.rollno}
            onChange={handleInputChange}
            placeholder="Enter your roll number"
          />
          {errors.rollno && <span className="error">{errors.rollno}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="login">
          <button type="submit">Login</button>
        </div>
        <p className="register-prompt">
          Don't have an account? <Link to="/register">Register Here</Link>
        </p>
      </form>
      {/* {loggedIn && <StudentDashboard authenticatedRollNo={authenticatedRollNo} />} */}
      {loggedIn && <Navigate to={`/studentdashboard?rollno=${authenticatedRollNo}`} replace />}
      {/* {loggedIn && <Navigate to="/studentdashboard" replace/>} */}
      {AdminloggedIn && <Navigate to="/admindashboard" replace/>}
    </div>
  );
};

export default Login;