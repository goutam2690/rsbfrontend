import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

const FileUpload = (props) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const cookies = new Cookies()
    const usertoken = cookies.get('access')
 
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(props.importurl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${usertoken}`
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error uploading file: ' + error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Upload Excel File</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
