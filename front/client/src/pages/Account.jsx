import React from "react";
import "./account.css"
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import vmodel from '../assets/vmodel.png';
const Account = () => {

  return (
    <div className='px-6 w-full h-screen flex justify-center items-center'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-12 col-md-5 left-section">

            <h1 > <b> Overall Quality : 55</b> </h1>
            <ProgressBar style={{ height: '40px', width: '50%' }} className="mt-3" >
              <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
              <ProgressBar striped variant="danger" now={25} key={3} label={`${25}`} />
            </ProgressBar>

            <div>
              <h2 className="mt-5"> Specification</h2>
              <ProgressBar style={{ width: '50%' }} className="mt-2"  >
                <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                <ProgressBar striped variant="danger" now={25} key={3} label={`${25}`} />
              </ProgressBar>

              <h2  > Design</h2>
              <ProgressBar style={{ width: '50%' }} className="mt-2"  >
                <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                <ProgressBar striped variant="danger" now={25} key={2} label={`${25}`} />
              </ProgressBar>
              <h2  >Tests</h2>
              <ProgressBar style={{ width: '50%' }} className="mt-2" >
                <ProgressBar striped variant="success" now={75} key={1} label={`${75}`} />
                <ProgressBar striped variant="danger" now={25} key={2} label={`${25}`} />
              </ProgressBar>
            </div>
            <div>
              <div>
                <h1 className="mt-5">  <b> Project Details:</b>  </h1>
                <p> x documents </p>
                <p>Size: x </p>
              </div>
              <div>
                <h1 className="mt-5"> <b> Requirements: </b></h1>
                <p> x requirement(s) </p>
                <p> x uncovered requirement(s)</p>
                <p> x aditional  requirement(s)</p>
              </div>
            </div>
          </div>





          <div className="col-12 col-md-6 right-section">
           
           
          <img src={vmodel} alt="Description of the image" />
          </div>




        </div>
      </div>
    </div>

  );
};

export default Account;