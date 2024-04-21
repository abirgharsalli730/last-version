import axios  from 'axios';
import dotenv from 'dotenv'
dotenv.config();
import fs  from 'fs';
import Issue from '../../models/issue.model.js';
import path from 'path';

const usernameEnv = process.env.ATLASSIAN_USERNAME
const password = process.env.ATLASSIAN_API_KEY
const domain = process.env.DOMAIN



//Gets all issues in a particular project using the Jira Cloud REST API
export async function getIssues(req, res) {
  const auth = {
    username: req.body.username,
    password: password
  };
  try {

    const baseUrl = 'https://' + domain + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/search',
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    const issues = response.data.issues;
/*
    // Save new issues to MongoDB
    let newIssuesSaved = 0;
    for (const issue of issues) {
      const issueId = issue.id;
      const existingIssue = await Issue.findOne({ id: issueId });
      if (!existingIssue) {
        const issueData = {
          id: issueId,
          summary: issue.fields.summary,
          description: issue.fields.description,
          projectName: issue.fields.project.name,
          createdBy: issue.fields.creator.displayName,
          createdTime: issue.fields.created,
        };
        const dbIssue = new Issue(issueData);
        await dbIssue.save();
        newIssuesSaved++;
      }
    }

    return res.send(`Saved ${newIssuesSaved} new issues to MongoDB`);
    */
    return res.json(issues);
  } catch (error) {
    console.log('error: ')
    console.log(error.response)
    res.json(error.response)
  }
}

// Function to get the accountId of a user by display name
export async function getAccountIdByDisplayName(displayName) {
    try {
      console.log(displayName)
        const response = await axios.get('https://'+ domain +'.atlassian.net' +'/rest/api/3/user/search', {
            params: {
                query: displayName
            },
            auth: {
                username: usernameEnv ,
                password: password // Jira API token
            }
        });
        // Assuming the first user returned in the search results is the one you're looking for
        if(response.data && response.data[0]){
          return response.data[0].accountId;

        }
        else 
        return null
    } catch (error) {
        console.error('Error fetching user accountId:', error);
        throw error;
    }
}

// Function to get issues created by a user
export async function getIssuesByCreator(req, res) {
    try {
        const accountId = await getAccountIdByDisplayName(req.body.displayName);
        if(accountId){
        const response = await axios.get('https://'+ domain+'.atlassian.net' +'/rest/api/3/search', {
            params: {
                jql: `creator=${accountId}`,
                fields: 'summary,status' // Add any other fields you need
            },
            auth: {
                username: usernameEnv,
                password: password
            }
        });
        return res.json(response.data.issues);
      }
      return res.json("user not found")
    } catch (error) {
        console.error('Error fetching issues by creator:', error);
        throw error;
    }
}
export async function getCurrentUser() {
  try {
      // Make a request to the Jira API to get information about the current user
      const response = await axios.get(`https://${domain}.atlassian.net/rest/api/3/myself`, {
          headers: {
              'Accept': 'application/json'
          },
          auth: {
            username: usernameEnv ,
            password: password // Jira API token
        }

      });
      return response.data;
  } catch (error) {
      console.error('Error fetching current user:', error.response ? error.response.data : error.message);
      throw error;
  }
}

export async function getAssignedIssues(req, res) {
  try {
      const currentUser = await getCurrentUser();
      const currentUserAccountId = currentUser.accountId;
      console.log(currentUserAccountId)

      // Make a request to the Jira API to get issues assigned to the current user
      const response = await axios.get(`https://${domain}.atlassian.net/rest/api/3/search?jql=assignee=${currentUserAccountId}`, {
          headers: {
              'Accept': 'application/json'
          },
          auth: {
            username: usernameEnv ,
            password: password // Jira API token
        }
      });
      return res.json(response.data);
  } catch (error) {
      console.error('Error fetching assigned issues:', error.response ? error.response.data : error.message);
      throw error;
  }
}
export async function getIssueByID(issueKey) {

  try {

    const baseUrl = 'https://' + domain + '.atlassian.net';

    const config = {
      method: 'get',
      url: baseUrl + '/rest/api/2/issue/' + issueKey,
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };
    const response = await axios.request(config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.log('error: ')
    console.log(error.response.data.errors)
  }
}


export async function getIssusByProject(req, res) {
  try {
    
      const projectKey = req.body.project;
      const  issusType = req.body.type
      // Make a request to the Jira API to get issues assigned to the current user
      const response = await axios.get(`https://${req.body.domaine}.atlassian.net/rest/api/3/search?jql=project=${projectKey} AND type =${issusType}`, {
          headers: {
              'Accept': 'application/json'
          },
          auth: {
            username: req.body.username ,
            password: req.body.token  // Jira API token
        }
      });
      return res.json(response.data);
  } catch (error) {
      console.error('Error fetching assigned issues:', error.response ? error.response.data : error.message);
      throw error;
  }
}






// Function to convert data to CSV format
function convertToCSV(data) {
let isssusTab=[]
  for (const issue of data) {
    const issueId = issue.id;    
      const issueData = {
        id: issueId,
        summary: issue.fields.summary,
        description: issue.fields.description?.content?.[0]?.content?.[0]?.text || '', // Added optional chaining for robustness
        projectName: issue.fields.project.name,
        createdBy: issue.fields.creator.displayName,
        createdTime: issue.fields.created,
      };        
      isssusTab.push(issueData) 
  }
  const header = Object.keys(isssusTab[0]).join(',') + '\n';
  const rows = isssusTab.map(obj => Object.values(obj).join(',')).join('\n');
  return header + rows;
}
// Function to save data as a CSV file
export function saveAsCSV(req, res) {
  try{
  const csvContent = convertToCSV(req.body.data );
 // Specify the path to the public folder
 const folderPath = 'projects/'+req.body.data[0].fields.issuetype.name; 
  const filePath = path.join(folderPath, `${req.body.data[0].fields.project.name}.csv`);
  // Create the public folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(filePath, csvContent);
  console.log(`Data saved as ${req.body.data[0].fields.project.name}`);
  res.json({msg:"save success"})
  }
  catch(err){
    console.log(err)
  }
}

// Save data as CSV




