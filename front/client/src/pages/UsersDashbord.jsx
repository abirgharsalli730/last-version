import React, { isValidElement, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/userdashbord.css';
import { updateUserDashbord } from '../redux/user/user.slice';


const UsersDashbord = ({ setReload, reload }) => {
    const dispatch = useDispatch(); // Get the dispatch function

    const initialRoles = {};
    const [roles, setRoles] = useState(initialRoles);
    const [validations, setValidations] = useState({}); // State for validation

    const handleChange = (e, userId) => {
        const { value } = e.target;
        setRoles(prevRoles => ({
            ...prevRoles,
            [userId]: value
        }));
        dispatch(updateUserDashbord({ id: userId, newUser: { role: value } }));
        setReload(!reload)
    };


    const users = useSelector((state) => state.user?.users);

    return (
        <div
            className='px-6 w-full h-screen flex justify-center items-center grid'
            style={{
                backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',

            }}
        >

            <table  >
                <thead>
                    <tr>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Validation</th>
                        <th>Action</th>
                    </tr>
                </thead>
                {users?.filter((el) => el.role != "ADMIN").map((user) => (
                    <tbody>
                        {user?.isValidate ?
                            <tr style={{ backgroundColor: "#80808088" }}>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        name="role"
                                        value={roles[user._id] || user?.role}
                                        onChange={(e) => handleChange(e, user._id)}
                                    >
                                        <option value="" > Select Role</option>
                                        <option value="regular">Regular</option>
                                        <option value="special">Special</option>
                                    </select>
                                </td>
                                <td>
                                    {user?.isValidate ? <>user is validated</> : <>user is not validated</>}
                                </td>
                                <td>
                                    {user?.isValidate ?
                                        <button onClick={() => {
                                            dispatch(updateUserDashbord({ id: user?._id, newUser: { isValidate: false } }));
                                            setReload(!reload)
                                        }}>invalidate</button> :
                                        <button onClick={() => {
                                            dispatch(updateUserDashbord({ id: user?._id, newUser: { isValidate: true } }));
                                            setReload(!reload)
                                        }}>Validate</button>
                                    }

                                </td>

                            </tr> :

                            <tr>
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.email}</td>
                                <td>
                                    <select
                                        name="role"
                                        value={roles[user._id] || user.role}
                                        onChange={(e) => handleChange(e, user._id)}
                                    >
                                        <option value="" >Select Role</option>
                                        <option value="regular">Regular</option>
                                        <option value="special">Special</option>
                                    </select>
                                </td>
                                <td>
                                    {user?.isValidate ? <>user is validated</> : <>user is not validated</>}
                                </td>
                                <td>
                                    {user?.isValidate ?
                                        <button onClick={() => {
                                            dispatch(updateUserDashbord({ id: user?._id, newUser: { isValidate: false } }));
                                            setReload(!reload)

                                        }}>invalidate</button> :
                                        <button onClick={() => {
                                            dispatch(updateUserDashbord({ id: user?._id, newUser: { isValidate: true } }));
                                            setReload(!reload)

                                        }}>Validate</button>
                                    }

                                </td>

                            </tr>
                        }

                    </tbody>
                ))}
            </table>

            {/* Add a submit button outside the map function */}
            {/* <button onClick={handleSubmitAll} style={{ background: "green" }}>Submit All</button> */}
        </div>
    );
};

export default UsersDashbord;
