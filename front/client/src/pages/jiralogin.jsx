import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import axios from "axios";
import Collapse from 'react-collapse';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%', // change the width to a percentage value
  maxWidth: 400, // set a maximum width to prevent the box from becoming too large on larger screens
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Jira = (projectInfo) => {
  const [optionAuth, setOpentionAuth] = React.useState(null);
  const [issuetype, setissuetype] = React.useState(null);
  const [idProject, setidProject] = React.useState(null);
  const [openModelProjectType, setopenModelProjectType] = React.useState(false);
  const [openAuth, setOpenAuth] = React.useState(false);
  const [formAuth, setformAuth] = React.useState({
    domaine: "",
    token: "",
    username: "",
  });
  const [showModal, setShowModal] = useState(false);



  const [expandedId, setExpandedId] = useState(null);

  const handleCardHover = (id) => {
    setExpandedId(id);
  };

  const handleCardLeave = () => {
    setExpandedId(null);
  };

  /*const [formAuthTwoo, setformAuthTwoo] = React.useState({
    clientId: "",
    clientSacretKey: "",
  });*/

  const handleOpenAuth = () => setOpenAuth(true);
  const handleCloseAuth = () => setOpenAuth(false);
  const [task, setTask] = React.useState([]);
  const [project, setProject] = React.useState([]);

  const [AuthTwooCode, setAuthTwooCode] = React.useState("");
  const [AuthTwooToken, setAuthTwooToken] = React.useState("");

  const [openAuthTwo, setOpenAuthTwo] = React.useState(false);
  const handleOpenAuthTwo = () => setOpenAuthTwo(true);
  const handleCloseAuthTwo = () => setOpenAuthTwo(false);

  const handelChnageFormAuth = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setformAuth({ ...formAuth, [name]: value })
  }
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const code = params.get('code');
    if (code) {
      setAuthTwooCode(code)
      setOpentionAuth("auth2")

    }
    let jiratoken = localStorage.getItem("jiratoken");
    if (jiratoken) {
      console.log("get jira token")
      setAuthTwooToken(jiratoken)
    }
    return () => {

    }
  }, [])

  const handelChnageissusType = (event) => {
    setissuetype(event.target.value)
  }

  /*
  const handelChnageFormAuthtwoo = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setformAuthTwoo({ ...formAuthTwoo, [name]: value })
  }*/

  const handelSubmitAuthMethode = (event) => {

    event.preventDefault();
    setOpentionAuth("auth")
    //axios.post("/issus",formAuth)
    axios.post("/project", formAuth)
      .then(res => {
        console.log(res),
          setProject(res.data)

      })
      .catch(err => console.log(err))
  }

  /*
  const handelSubmitAuthTwooMethode = (event) => {
    event.preventDefault();
    axios.post("authJira/auth?action=jira_platform_rest_api", formAuthTwoo)
      .then(res => {
        if (res.data.url) {

          window.location.href = res.data.url;
        }


      })
      .catch(err => console.log(err))
  } */

  const getTokenFromCode = () => {
    axios.post("authJira/generatetoken", { code: AuthTwooCode })
      .then(res => {
        if (res.data && res.data.token) {
          console.log(res.data)
          setAuthTwooToken(res.data.token)
          localStorage.setItem('jiratoken', res.data.token)
        }
      })
      .catch(err => console.log(err))
  }
  const getTasksFromtoken = () => {
    let jiratoken = localStorage.getItem("jiratoken");
    if (jiratoken && !AuthTwooToken.length > 0) {
      setAuthTwooToken(jiratoken)

    }
    axios.post("authJira/get-project", { token: AuthTwooToken })
      .then(res => {
        console.log(res.data),
          setProject(res.data.project)
      })
      .catch(err => console.log(err))
  }


  const voirIssus = (event) => {
    event.preventDefault();
    if (optionAuth == "auth2") {
      axios.post("authJira/get-issus", { token: AuthTwooToken, project: idProject, type: issuetype })
        .then(res => {
          console.log(res.data),
            setTask(res.data.issues)
        })
        .catch(err => console.log(err))
    }
    else
      axios.post("issus/byproject", { ...formAuth, project: idProject, type: issuetype })
        .then(res => {
          console.log(res.data),
            setTask(res.data.issues)
        })
        .catch(err => console.log(err))

  }


  const PostDownloads = () => {
    axios.post("saveAsCSV", { data: task })
      .then(res => console.log(res.data)
      )
      .catch(err => console.log(err))
  }

  return (
    <div
      className='px-6 w-full h-screen flex justify-center items-center'
      style={{
        backgroundImage: `url('https://t4.ftcdn.net/jpg/02/36/77/63/240_F_236776308_kQn0MgsaDZgxVS91IH9fsW3cehQ7f5RG.jpg')`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',

      }}
    >
    
       
          <form className='border bg-white p-6 flex flex-col items-center min-w-[17rem] sm:min-w-[22rem] md:min-w-[35rem] max-w-[25rem] flex-1'
          >

            <h1 className='uppercase text-xl mb-4 font-bold'>Get your jira projects</h1>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC5CAMAAAA4cvuLAAAA3lBMVEX///8lOFgmhP8gfPghNVYZc+4cMVMKJ03T1ts2R2UNKE64vshncogSauQbgP/s9P5dov0CVdB2q/yts7+yuMIKYNoAe/8Wb+oOZd8AIkoSK08Ta+UZL1Iif/r///1gbIIATc6CpOgAHkiepbFYm/wAVNBNgt+Itv4Aev+nyf/X5vz09feew/7c3+R6hJWMlKNSX3e50/5Bkf4AF0TG2/3Q4f09TWmTmqjHy9Iucd1MWnORu/7o6u5qpf0AE0IsQF8qiP7h6/txmOR/iJpKlf4ARMyNquRRju0vdOA0gvH0RsIfAAAJFUlEQVR4nO2ce1+iShiAxyQwNG27UBDiHqy1IpHcUtY6xzy1Z/d8/y90uA4zwyVARHfP+/zVT7k+De/MvPMiQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwy2D0cmNs+1rr4fHqKC+j1bYvthYeb7q5ke63fbV1cCft5efmcduXWwO9AkL2usfbvtwa0Kb9LRgxdjlKP3frNmIPOEVZmuMqjrUJigSSSox0dJ5rNDhVH1ZwsE2gved/bKowYgqNgK/t9Y+2EZ5uNmSkNQyYv0QfjvVQSINbVn0rFaH9mTuSFDNy8lXx+asVfThUsJGG3ErfeasYe3mfm4JGxODOBeLOTTUyIuzqY5M/uFZgZEK2EbvqO6mMx5xKKjByKhBGXtJ33jZP3VyxpAIjhsiFQtRB1bdRJb33PM2kAiOo/TVQwqs73ERcbvekDwNsFUZQW1A4juPl2c4OWkOM26nUzZZSiRH0Ml8sl4PTSi9+Q2h3z1evRD5kQ0Z+NXqru4D4HPC3M1JwCn772xtZRd1Jv99v9pvN/f398/PLy8vDw4uLi7Ozs08h119W/zsjzaYnxDFyjoW4Sq4/Xbt8/tz7HxjpkXcYOdk/v6Sc+Hz++5cwsmYujkogks0kQcnnLztgxLBP3kxz0Ema/4xPTGt2sDyYLcxh6fnRiLrFbCWbM7LkOQ+ZHpEMVP9jIfzYGC5kWVRVlddP2EO33jhdDHbgeUVWzfAUtu5/yul5/g1P9Ei97zlJCiYbNXIQXDKTC+jQRoyJKPLB/iJjpGXJKp4dBXMk2fKHwC05OHyu5Ess707EElcJ6cQx8hCb6lRkJDE70gnuX/SMtHkia8AYMXW+EYeX576RQo/qLXOP/oPTxK3kkDLytD0jE51sA5SR8ZJwRSF3ihvRXtlGgoPJOdVK3BEJ3TfVauRNpm6VNGLLzPNCoFiFjSRky3AroeOrawTFFrdqMjKnhZBGsoQ4G3YKG0H32UqiVuIaiU1sajHSboXpeo5XVUVR1KivGSukEE6RZYHnBVkIA618Mi5qBB3HlZDjV6zk0xdqkFunkZm3AS+Iy4E5Hw7nk06b3dd7RkRraI8Nh7E9Wcr+7rytFDWijbKVhA+OawSx6xZ1GOFm7h+qOGjHU2wTEftQ1Tn1vT3wnidu1ihqxOlwbtjw0Gd6YU+Ja2R1U7+Rhvu13EnKOI6j+CKbsfF7W+WDvYsaQat3Nn+YNMlxjaBnqX4j8a9CBngTOWnN+GVJjlMKTR20h6nUTVES9sK+Ee2quwUjevI8BUdcJ4AmbmAsuZJGHJ6OXyWJSCCyD86hbwQZr93ajQgpRQN4C+Ut5YwtubwRpGl3D/ejP499jvrsiP7ih79db9qt2Qg3Sz6cEfYiGSvoc6W8ERp3UY8OJqERhI6keo2krQbj1UAhPY1vpBp5GMX5IwW32s6b1FGtJDLizIG7dRpRU7JAHfXDJkI2EsbICMcIycENl87gK5zZngV5w4DvXwIjxPB1//wwMoJ6o66/kFOHET5t7ZML9lPmGeccCylGiNRGLGay+cNP3/8JJ/7Etpc/yOP17qdeIK7BiDpJudcwasqZa4F4VMsYMaaMkSwl1z9xKoTohX8wp+o93B9fPeeU4VHOiJLcs+KjcVzmSU0+2Qg6JhvJB63k+luUHML+YkaKs07GKM48DCNW5kmHafMaMv/VJ6e3CUpII7iV7JwR3IZSnqqAtpBixIiPSFNbiWOELKkJlOyaESs0kl30aadmA57pxZnYKJ1Q4hihEoj+tleFDbBUayRlN5b0jFEvY+JyTig584z0JHbj/SutsAKGao2EcxYhe3EmI4fGZJkzYoljRHuN+fv9jDDTVia8Ussz36i+KfD3+xlhpq3MUI1KvH+LLW45SnbNSGN9I6jHKklpJa6R2OJWd9eMzMLdssu1snPxxju7rEmG10iJYyRW0rpzRvL2vmnjER9tJKUsfgerM/4inmuECTt7/V0z8tG8J+D0o4KEuysprWokVHJx9tPdku2ud81IWD7+wSg+HOxnZIwej7pEUWZMCTbCBNdKjVCz1ZJGcs70BmkzPZLew+h9D2dUm7EeJzCCHm6qNYL/XXT9e0kjOGRmlkEY+NWMD7KKGsJvdj9JRD2AH14DI+iRKGGtwAjOiolUVqykEXyvmRmjdlrGKIM7iZz3eQ9OaAStplKFRsIxFZMGLGkEdzbcQcY5Lb6UEWZEHxlB2v1etyojOOnFxMKyRqLMR/oYzY7eeStiJDZ6/Ul8bdy/eoF4fSP4bSsmo1HWSGQ4ZfkCUSvlhYwQFWiuE8pIUB0v3UzzHjCFaJGW+Z+WNYIsnEJNiyQmUX5UzAidQ7r8N75Vb7XmD0kQK44KvdxQ2kgbO055nY2qxClohHxw9s//XTuIxlbyWw0c4tQO/VVpIyiSnJg2MqnSpKJGqLTa+kaGqtmOhmFGq0MUR7Hjh/JG2kS1RGwsbx94j0yJvmZFLUQ0qzFyIqiCsLQ6Ewdz0JCJsgWeHXWXN0L0rQ1lOSQaptG2/P+B+pZnzEoTzV9wK6nAiDvE5nivbkzlqeI5nV1wWsPIC/EiKCeK1rxtt1p2ez7ghaDoalC8Dg2hV9pIszIjicT7hTWMoFOdPDbnNExZEAQFlxWoRuFaRUQvbvlKNmhEia/irmMkVthJ4dbClzESX5vZnBExYVl7LSNooiefyRXiDnzKGKHy7p6STRnhdDNh2/WMoBOqQJxAWboRq4wRat3CiyUV9L4JjZkXlokDqTWNoPEiqe6Z1/3qxVJG6Op4x8n6RuyFKCvEGx4cL8qLtGUGlffQGSOK/7H8kRGnmRzIdH/GKfIgENDS+eDwRaqu6N9gqcKI+7rUsDPjZB/loHOSWuXRGfhYdAsyF5ZlLazFLM9PcNgdXhZ9s6oiC7M5PlvLCg9f6JVzujq+O63AiI/xMh6PX2r5Javx6cR05JqToV3B6TSqOr5fnZFfF1oJGHG5JSrBwYjH3RQ7ASM+UXU8GAnRHv3qeDBCcvfwfHUERii0dVOqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQF38B/e2MJN5bolSAAAAAElFTkSuQmCC"
              alt="Document" className="document-icon" />
            <button className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
              type='button' onClick={handleOpenAuth}>Connect to jira </button>
          </form>

          <div>

            <Modal
              open={openAuth}

              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <form onSubmit={handelSubmitAuthMethode} >
                  <Typography id="modal-modal-title" variant="h6" >
                    Enter Your Domain
                  </Typography>


                  <input type="text" className="border border-gray-300 rounded-md px-4 py-2 leading-tight" name="domaine" required onChange={handelChnageFormAuth}></input>

                  <Typography id="modal-modal-title" variant="h6" >
                    Enter Your UserName
                  </Typography>
                  <input type="text" className="border border-gray-300 rounded-md px-4 py-2 leading-tight" name="username" required onChange={handelChnageFormAuth} />

                  <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6">
                    Enter Your Password
                  </Typography>
                  <input type="password" className="border border-gray-300 rounded-md px-4 py-2 leading-tight" name="token" required onChange={handelChnageFormAuth} />
                  <div className='flex justify-between w-full'>
                    <input type='submit' className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2" value="Submit"></input>

                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                      type="button"
                      onClick={handleCloseAuth}
                    >
                      close
                    </button>
                  </div>
                </form>
              </Box>
            </Modal>

          </div>



          {/*
    <Button onClick={handleOpenAuthTwo}>get project from jira with auth2 methode</Button>

<Modal
open={openAuthTwo}
onClose={handleCloseAuthTwo}
aria-labelledby="modal-modal-title"
aria-describedby="modal-modal-description"
>
<Box sx={style}>
<form onSubmit={handelSubmitAuthTwooMethode}>

<Typography id="modal-modal-title" >
saisir client Id
</Typography>
<input type='text' name="clientId"  className="border border-gray-300 rounded-md px-4 py-2 leading-tight"  required onChange={handelChnageFormAuthtwoo}></input>

<Typography id="modal-modal-description" >
saisir client  sacret key Id
</Typography>
<input type='text'  className="border border-gray-300 rounded-md px-4 py-2 leading-tight"  name="clientSacretKey" required onChange={handelChnageFormAuthtwoo}></input>

<div>
<input type='submit' value="get Project"></input>
</div>
</form>
</Box>
</Modal>
  */}
   
          <div>
            <Modal
              open={openModelProjectType}

              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>

                <form onSubmit={voirIssus}>

                  <Typography id="modal-modal-title" >
                    Choose Issue Type
                  </Typography>
                  <select name="issusType" className="border border-gray-300 rounded-md px-4 py-2 leading-tight" required onChange={handelChnageissusType}>
                    <option value="Epic"> Epic</option>
                    <option value="Bug">Bug</option>
                    <option value="Task">Task</option>
                    <option value="PFE-14">PFE-14</option>
                    <option value={"PFE-15"}>PFE-15</option>

                  </select>

                  <div>
                    <input type='submit' value="get issus" className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"></input>
                    <button
                      className="bg-red-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2"
                      type="button"
                      onClick={() => setopenModelProjectType(false)}
                    >
                      close
                    </button>
                  </div>
                </form>
              </Box>
            </Modal>
          </div>


          {/*

      {
        optionAuth == "auth2" && AuthTwooCode.length > 0 ? <Button onClick={getTokenFromCode}> get token </Button> : ""
      }
      {
        optionAuth == "auth2" && AuthTwooToken.length > 0 ? <Button onClick={getTasksFromtoken}> get task </Button> : ""
      }
    */}

<ul> <li>
          <div className='flex flex-wrap'>
            <div className='max-h-80 overflow-y-scroll w-full bg-gray-100 flex flex-col items-center'>
            
              {project.map(el => {
                 
                return (
               
                  <div key={el.id} className='m-4'>
                         
                    <Card  >
                      <CardContent style={{ width: "500px" }} className='shadow'>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                          id project : {el.id}
                        </Typography>
                        <Typography variant="h5" component="div">
                          name : {el.name ? el.name : ""}

                        </Typography>


                        <button className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2" onClick={() => { setidProject(el.id); setopenModelProjectType(true) }}>Get Issues</button>
                      </CardContent>
                    </Card>
                  </div>

                )
              })}

            </div>
          </div>

          </li> 
        <li>
          <div className='flex flex-wrap'>
         
            <div className='max-h-80 overflow-y-scroll w-full bg-gray-200 flex flex-col items-center'>
           
              {task.map(el => {
                return (
                
                  <div key={el.id} className='m-4'>
                     
                    <Card onMouseEnter={() => handleCardHover(el.id)}
                      onMouseLeave={handleCardLeave}>
                      <CardContent style={{ width: "500px" }} className='shadow'>
                        <Typography variant="body2" m>
                          ID  : {el.id}
                        </Typography>
                        <Typography variant="h5" component="div">
                          Summary : {el.fields ? el.fields.summary : ""}

                        </Typography>
                        <Collapse isOpened={expandedId === el.id}>
                          <Typography variant="body2">
                            {el.fields && el.fields.description && (
                              <div variant="body2">
                                <h3 variant="body2" >Description:</h3>
                                {el.fields.description.content && el.fields.description.content[0] && el.fields.description.content[0].content && el.fields.description.content[0].content[0] && (
                                  <p>{el.fields.description.content[0].content[0].text}</p>
                                )}
                              </div>
                            )}
                          </Typography>

                          <Typography variant="body2">
                            Project : {el.fields && el.fields.project && el.fields.project.name} <br />
                          </Typography>
                          <Typography variant="body2">
                            Issue Type : {el.fields && el.fields.issuetype
                              && el.fields.issuetype.name} <br />
                          </Typography>
                        </Collapse>
                      </CardContent>
                    </Card>
                    {

                    }

                  </div>

                )

              })}
              {
                task.length > 0 ? <button className="bg-teal-700 text-white active:bg-emerald-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 m-2" onClick={PostDownloads}> Download </button> : ""
              }
            </div>


          </div>
        </li>
      </ul>
    </div>


  );
};

export default Jira;
