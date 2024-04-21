import {  useRef } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSignInAlt,FaUser, FaBars, FaTimes,FaPlus, FaProjectDiagram, FaEdit, FaEye, FaQuestionCircle, FaFileAlt, FaHome } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

const Navbar = () => {
  const { userInfo, userId, isAuth } = useSelector((state) => state.user);
console.log(userInfo,"info")
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle(
      "responsive_nav"
    );
  };
  // const { id } = useParams();
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getUser({ id }));
  // }, [id]);
  const user = useSelector((state) => state?.user?.user);
console.log(user?.role,"roleee")
  return (
    <header>
      <nav className="grid grid-cols-2 p-4 border-b font-semibold h-18" ref={navRef}>
        <h1 className="font-bold text-3xl uppercase flex items-center justify-start px-4 tracking-wider">
          <Link to="/">Trace</Link>
        </h1>
        <div className="flex justify-end items-center px-4 text-md md:text-lg">
          {isAuth ? (
            <>
            <div>
                <Link to="/account" className="uppercase px-4 py-2">
                  <FaHome />
                  <span className="ml-2">Home</span>
                </Link>
              </div>
              <div>
                {user?.role == "ADMIN" &&
                 <Link to={`/users-dashbord`}>
                 <FaUsersGear />
                 <span className="ml-2">Users</span>
               </Link>
                }
             {user?.role == "special" || user?.role == "ADMIN"  ? 
              <Link to={`/project`}>
              <FaPlus />
              <span className="ml-2">Projects</span>
            </Link> : 
              <Link to={`/unauthorized`}>
              <FaProjectDiagram  />
              <span className="ml-2">Projects</span>
            </Link> 
            }
              
              </div>
              <div>

             {user?.role == "special" || user?.role == "ADMIN"  ? 
                <Link to={`/edit`}>
                <FaEdit />
                <span className="ml-2">Edit</span>
              </Link> 
              :
              <Link to={`/unauthorized`}>
              <FaEdit />
              <span className="ml-2">Edit</span>
            </Link>
}

             
              </div>
              {user?.role == "special" || user?.role == "ADMIN"  ? 
                     <div>
                     <Link to={`/view`}>
                       <FaEye />
                       <span className="ml-2">View</span>
                     </Link>
                   </div> :
                    <div>
                    <Link to={`/unauthorized`}>
                      <FaEye />
                      <span className="ml-2">View</span>
                    </Link>
                  </div>
}
          {user?.role == "special" || user?.role == "ADMIN"  ? 
   <div>
   <Link to={`/jira`}>
   <FaProjectDiagram  />
     <span className="ml-2">Jira</span>
   </Link>
 </div> :    <div>
                <Link to={`/unauthorized`}>
                <FaProjectDiagram  />
                  <span className="ml-2">Jira</span>
                </Link>
              </div> }
           
              <div>
                <Link to={`/report`}>
                  <FaFileAlt />
                  <span className="ml-2">Report</span>
                </Link>
              </div>
              <div>
                <Link to={`/help`}>
                  <FaQuestionCircle />
                  <span className="ml-2">Help</span>
                </Link>
              </div>
              <div>
                <Link to={`/profile/${userId}`}>
                  <FaUser />
                  <span className="ml-2">Profile</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <Link to="/signup" className="uppercase px-4 py-2">
                  <FaUser />
                  <span className="ml-2">Sign Up</span>
                </Link>
              </div>
              <div>
                <Link to="/signin" className="uppercase px-4 py-2">
                  <FaSignInAlt />
                  <span className="ml-2">Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <button
          className="nav-btn nav-close-btn"
          onClick={showNavbar}>
          <FaTimes />
        </button>
       
      </nav>
      <button
        className="nav-btn"
        onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;
