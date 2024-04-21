import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../redux/project/project.slice';
import { projectSchema } from '../validations/project.schema.js';
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

const Project = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isActive, loading } = useSelector((state) => state.project);
  

  const createproject = () => {
    dispatch(createProject(values));
    
  };

  /*===== formik and yup =====*/
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        description: "",
      },
      validationSchema: projectSchema,
      onSubmit: createproject,
    });
  /*=====// formik and yup //=====*/

  useEffect(() => {
    {
      isActive && navigate("/projectmanip");
    }
  }, [isActive]);

  return (
    <div
      className='px-6 w-full h-screen flex justify-center items-center  grid'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <form className='border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem] flex-1'
      onSubmit={handleSubmit}>
        <h1 className='uppercase text-xl mb-4 font-bold'>Create New Project</h1>
        <div className='flex flex-col mb-4 w-full'>
          <label htmlFor='name'>Project Name</label>
          <input
            type='text'
            name='name'
            className='form-control mt-2'
            placeholder='Project Name'
            value={values.name}
            onChange={handleChange}
            autoFocus={true}
          />
          {touched.name && errors?.name && (
            <span className="text-red-700">{errors.name}</span>
          )}
        </div>
        <div className='flex flex-col mb-4 w-full'>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            className='form-control mt-2'
            placeholder='Description'
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus={true}
          />
          <span className="text-red-700">
            {touched.description && errors.description && errors.description}
          </span>
        </div>
        
        <div className='flex justify-between w-full'>
          <button 
            className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            type='submit'
            disabled={loading}
          >
            
            {loading ? "Loading..." : "Create "}

          </button>
          <button onClick={() => navigate("/account")}
            className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
            type='button'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Project;