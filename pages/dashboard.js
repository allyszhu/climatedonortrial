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
        <Sidebar />
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
          {/* Testing projectCard Component */}
          {
            donorProjects && donorProjects.map((project, index) => {
              const data = project.data();
              return (
                <Row key={index}>
                  <ProjectCard
                    key={project.id}
                    tagName={data.tagName}
                    src={data.src}
                    projectTitle={data.title}
                    projectDescription={data.description}
                    author={data.author}
                    location={data.location}
                    published={data.published.toDate().toLocaleDateString() + ''}
                    updated={data.updated.toDate().toLocaleDateString() + ''}
                    curAmt={data.curAmt}
                    totalAmt={data.totalAmt}

                  />
                </Row>
              )
            })
          }
          <Row>
              <ProjectCard
                tagName='Clean Energy'
                src="https://via.placeholder.com/150"
                projectTitle="Repurposing Oil Platforms"
                projectDescription="Imagine if all offshore oil platforms were converted to clearn energy producing wind turbine platforms..."
                author="Climate Donor"
                location="Stanford, CA"
                published={new Date().toLocaleDateString() + ''}
                updated={new Date().toLocaleDateString() + ''}
                curAmt="75,890"
                totalAmt="89,000"
              />
          </Row>
          <Row>
            <ProjectCard
              tagName='Transportation'
              src="https://via.placeholder.com/150"
              projectTitle="Saving the Melting Polar Caps"
              projectDescription="Dedicated researchers and biologist, focused on saving and salvaging the melting polar caps..."
              author="Climate Donor"
              location="Stanford, CA"
              published={new Date().toLocaleDateString() + ''}
              updated={new Date().toLocaleDateString() + ''}
              curAmt="26,000"
              totalAmt="89,000"
            />
          </Row>
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
