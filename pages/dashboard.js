import { Button, Layout, Row } from 'antd';
import DBNavBar from "../components/DBNavBar";
import React, { useState, useEffect } from 'react';
import NavBar from "../components/NavBar";
import ProjectTabs from "../components/ProjectTabs";
import Sidebar from "../components/Sidebar";
import SearchBar from '../components/SearchBar';
import ProjectCard from '../components/ProjectCard';
import styles from '../styles/Dashboard.module.css';
import { getProjectsByDonor } from '../lib/firebase';
import {
  useAuthUser,
  withAuthUser,
  AuthAction
} from 'next-firebase-auth'
import { getRecommendedProjects } from '../lib/firebase'

const { Content } = Layout;
const data1 = {
  tagName: 'Clean Energy',
                src: "https://via.placeholder.com/150",
                projectTitle: "Repurposing Oil Platforms",
                projectDescription:"Imagine if all offshore oil platforms were converted to clearn energy producing wind turbine platforms...",
                author:"Climate Donor",
                location:"Stanford, CA",
                published: new Date().toLocaleDateString() + '',
                updated: new Date().toLocaleDateString() + '',
                curAmt:"75,890",
                totalAmt:"89,000",
}

const DonorDashboard = () => {
  const AuthUser = useAuthUser()
  const displayName = AuthUser.firebaseUser.displayName
  const [selectedMenu, setSelectedMenu] = useState("1")

  const [projects, setProjects] = useState([]);

  const getProjects = async () => {

    if (selectedMenu === '1') {
      //let projects = await getProjectsByDonor()
      //setProjects(projects);
      setProjects([])
    } else if (selectedMenu === '2') {
      //let projects = await getSavedProjects()
      //setProjects(projects);
      setProjects([])
    } else if (selectedMenu === '3') {
      let projects = await getRecommendedProjects()
      setProjects(projects);
    } else {
      // Donation History
      setProjects([])
    }

  }

  useEffect(() => {
    getProjects()
  }, [selectedMenu])


  const [donorProjects, setDonorProjects] = useState([])
  const fetchDonorProjects = async () => {
    let projects = await getProjectsByDonor(AuthUser.id)
    setDonorProjects(projects);
    console.log("projects", AuthUser.firebaseUser)
  }
  useEffect(() => {
    fetchDonorProjects();
  }, [])

  return (
    <Layout>
      <DBNavBar userId={AuthUser.id}
        userName={displayName != null ? displayName : 'Name'}
        signOut={AuthUser.signOut} />

      <Content className={styles.dashboardContent}>
        <Sidebar setSelectedMenu={setSelectedMenu}/>

        <div className={styles.contentDisplay}>
          <div className={styles.titleBar}>
            <h2>My Projects</h2>
            <SearchBar />
          </div>
          <Row>
            <ProjectTabs
              link1='ALL'
              link2='ACTIVE'
              link3='COMPLETED'
              onClick={() => {
                console.log("Option Clicked")
              }}
            />
          </Row>

          {
            projects && projects.map((project, index) => {

          {/* Testing projectCard Component */}

              return (
                <Row key={index}>
                  <ProjectCard
                    key={project.id}
                    tagName={project.tagName}
                    src={project.src}
                    projectTitle={project.title}
                    projectDescription={project.description}
                    author={project.author}
                    location={project.location}
                    published={project.published.toDate().toLocaleDateString() + ""}
                    updated={project.updated.toDate().toLocaleDateString() + ""}
                    curAmt={project.curAmt}
                    totalAmt={project.totalAmt}
                  />
                </Row>
              )
            })
          }
        </div>
      </Content>
    </Layout>
  )
}

const MyLoader = () => <div>Loading...</div>
export default withAuthUser({
  whenAuthed: AuthAction.RENDER,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: MyLoader,
})(DonorDashboard)
