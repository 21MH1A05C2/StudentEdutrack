import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './Register.css';
import { toast } from 'react-toastify';
const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        rollno: "",
        college: "",
        branch: "",
        email: "",
        password: "", 
        profilepic: null,
    });

    const [errors, setErrors] = useState({});

    const backend_api = "http://localhost:4000/users"; // API endpoint for user registration

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.rollno.trim() ) {
            newErrors.rollno = "Valid Roll No is required";
        }

        if (!formData.college.trim()) {
            newErrors.college = "College is required";
        }

        if (!formData.branch) {
            newErrors.branch = "Branch is required";
        }

        if (!formData.email.trim() || !isValidEmail(formData.email)) {
            newErrors.email = "Valid email is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        if (!formData.profilepic) {
            newErrors.profilepic = "Profile picture is required";
        }

        // Update errors state with new validation errors
        setErrors(newErrors);

        // If there are validation errors, prevent form submission
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Prepare form data for submission
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("rollno", formData.rollno);
        formDataToSend.append("college", formData.college);
        formDataToSend.append("branch", formData.branch);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password); 
        formDataToSend.append("profilepic", formData.profilepic);

        try {
            // Send POST request to backend API
            const response = await axios.post(backend_api, formDataToSend);

            if (response.status === 200) {
                toast("User registered successfully");
                // Optionally clear form data after successful submission
                setFormData({
                    name: "",
                    rollno: "",
                    college: "",
                    branch: "",
                    email: "",
                    password: "",
                    profilepic: null,
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast("An error occurred while submitting the form.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "myfile") {
            setFormData({ ...formData, profilepic: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const isValidEmail = (email) => {
        // Basic email format validation using regex
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <div className="containerr">
            <h1>Student Registration Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
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
                    <label htmlFor="college">College:</label>
                    <input
                        type="text"
                        id="college"
                        name="college"
                        value={formData.college}
                        onChange={handleInputChange}
                        placeholder="Enter your college name"
                    />
                    {errors.college && <span className="error">{errors.college}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="branch">Branch:</label>
                    <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Branch</option>
                        <option value="cse">CSE</option>
                        <option value="iot">IOT</option>
                        <option value="it">IT</option>
                        <option value="aiml">AIML</option>
                        <option value="ece">ECE</option>
                        <option value="mech">MECH</option>
                        <option value="civil">CIVIL</option>
                    </select>
                    {errors.branch && <span className="error">{errors.branch}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
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
                <div className="form-group">
                    <label htmlFor="myfile">Upload Profile Picture:</label>
                    <input
                        type="file"
                        id="myfile"
                        name="myfile"
                        onChange={handleInputChange}
                    />
                    {errors.profilepic && <span className="error">{errors.profilepic}</span>}
                </div>
                <div className="button">
                    <button type="submit">Submit</button>
                </div>
                <p className="login-prompt">
                    Already registered? <Link to="/login">Login Here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;