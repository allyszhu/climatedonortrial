import { Button, Layout, Row } from 'antd';
import React, { useEffect } from 'react';
import NavBar from "../../components/NavBar";
import {
    useAuthUser,
    withAuthUser,
    AuthAction
} from 'next-firebase-auth'
import ProjectPage from '../../components/ProjectPage';
import SearchBar from "../../components/SearchBar";

const { Content } = Layout;

const DonorProjects = () => {
    const AuthUser = useAuthUser()

    return (
        <>
            <Layout>
                <NavBar userId={AuthUser.id} signOut={AuthUser.signOut} />
                <Content className="siteContent projectPageContent">
                    {/* <div className="search" style={{float: 'right'}} >
                        <SearchBar/>
                    </div>
                    <Row>
                        Donor Projects for {AuthUser.firebaseUser.email}
                    </Row>
                    <br/> */}
                    {/* Testing projectCard Component */}
                    <Row>
                    <div style={{marginLeft: '30px'}}>
                        <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>Projects /</span> Repurposing Oil Platforms
                        </div>
                    </Row>
                        <Row>
                            <ProjectPage
                                tagName='Clean Energy'
                                src="https://via.placeholder.com/150"
                                projectTitle="Repurposing Oil Platforms"
                                projectShortDescription="Imagine if all offshore oil platforms were converted to clearn energy producing wind turbine platforms..."
                                projectFullDescription="With today’s offshore oil production practice, oil companies have two options when oil production is over: 1) remove the platform completely; or, 2) leave the platform in place under the “reefs for rigs” regulatory provisions. Successful examples of coral reefs created by abandoned oil platforms exist on both east and west coasts of the US. While the below-surface rig structure provides an environmental benefit, the infrastructure above the sea level remains in place without any benefit. That’s where this Project comes in.  For those oil platforms that qualify, wind turbines can be installed on the unused platform surface and the electrical energy generated from these turbines could be stored via an electrolyte-based flow battery using the depleted oil reservoir for electrolyte storage.  The energy now stored in this flow battery can then converted back to electrical energy and sold when it is needed to meet consumer demand..."
                                author="Climate Donor"
                                location="Stanford, CA"
                                published={new Date().toLocaleDateString() + ''}
                                updated={new Date().toLocaleDateString() + ''}
                                curAmt="75,890"
                                totalAmt="89,000"
                            />
                        </Row>
                    
                </Content>
            </Layout>

        </>
    )
}

const MyLoader = () => <div>Loading...</div>
export default withAuthUser({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: MyLoader,
})(DonorProjects)
