import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { createProject } from '../redux/project/project.slice';

const ImportFiles = ({ projectInfo, createProject }) => {
  const [files, setFiles] = useState(null);
  const [progress, setProgress] = useState({ started: false, pc: 0 });
  const [msg, setMsg] = useState(null);



  
  

  const upload = () => {
    if (!files) {
      setMsg("No file selected");
      return;
    }
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
      
    }
    
    fd.append("name", projectInfo.name  )
  
    setMsg("uploading...");
    setProgress(prevState => {
      return { ...prevState, started: true };
    });
    axios.post(`http://localhost:3001/api/project/upload/${projectInfo.name}`, fd, {
      onUploadProgress: (ProgressEvent) => {
        setProgress(prevState => {
          return { ...prevState, pc: (ProgressEvent.loaded / ProgressEvent.total) * 100 };
        });
      },
      headers: {
        "Custom-Header": "value",
      },
    })
      .then(res => {
        setMsg("Upload Successful ");
        console.log(res.data);
       
       
      })
      .catch(err => {
        setMsg("Upload failed");
        console.error(err);
      });
  };

  return (
    <div
      className="px-4 w-full h-screen flex justify-center items-center  grid"
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="container">
        <div className="upload-card">
          <div className="upload-card-text">
            <h1 className="uppercase text-xl mb-4 font-bold">Import Your Project Files</h1>
            <img src="https://media.istockphoto.com/id/1209500169/vector/document-papers-line-icon-pages-vector-illustration-isolated-on-white-office-notes-outline.jpg?s=612x612&w=0&k=20&c=Dt2k6dEbHlogHilWPTkQXAUxAL9sKZnoO2e055ihMO0="
              alt="Document" className="document-icon" />
          </div>
          <input onChange={(e) => { setFiles(e.target.files) }} type="file" multiple accept=".doc,.docx,.xls,.xlsx,.R4j" />
          <div className="upload-card-button">
            <button className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2" onClick={upload}>
              Upload
            </button>
          </div>
          {progress.started && <progress max="100" value={progress.pc}></progress>}
          {msg && <span>{msg}</span>}

          <style>{`
            .container {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }

            .upload-card {
              display: flex;
              flex-direction: column;
              background-color: #fff;
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 16px;
              box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 600px;
              height: 400px;
              justify-content: space-between;
              position: relative;
            }

            .upload-card-text {
              text-align: center;
            }

            .upload-card-button {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: auto;
              margin-bottom: 16px;
            }

            .upload-card-button input[type='file'] {
              display: none;
            }

            .upload-card-button button {
              color: white;
              padding: 10px 20px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }

            .document-icon {
              width: 100px;
              height: 100px;
              object-fit: contain;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  projectInfo: state.project.projectInfo,
});

// Connect the component to Redux store
export default connect(mapStateToProps, { createProject })(ImportFiles);