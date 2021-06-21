import styles from '../styles/ProjectPage.module.css'
import { Button, Image, Progress, Row, Layout } from 'antd';
import { faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getDoc } from '../lib/firebase'
import { getSession } from '../lib/payment'
import {
    useAuthUser,
    withAuthUser,
    AuthAction
} from 'next-firebase-auth'
import { addDonation } from '../lib/firebase'
import DBNavBar from "../components/DBNavBar";
import Link from 'next/link';

import { loadStripe } from '@stripe/stripe-js';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const tag_text1 = "Clean Energy"
const tag_text2 = "Transportation"

const calPercentage = (currentAmt, total) => {
    currentAmt = parseInt(currentAmt, 10);
    total = parseInt(total, 10);
    return ((100 * currentAmt) / total).toFixed(2);
}

const ProjectPage = () => {
    const AuthUser = useAuthUser()
    const displayName = AuthUser.firebaseUser.displayName
    const router = useRouter()
    const [amount, setAmount] = useState(0)
    const [project, setProject] = useState()
    const [isLoading, setIsLoading] = useState(true)

    const { query: { projectId } } = router;
    const { Content } = Layout;

    const getProject = async () => {
        var proj = (await getDoc("projects", projectId))
        proj = await Promise.resolve(proj)
        proj.published = proj?.published.toDate().toLocaleDateString() + ''
        proj.updated = proj?.updated.toDate().toLocaleDateString() + ''
        setProject(proj)
        setIsLoading(false)
    }

    getProject()

    const handleDonate = async (event) => {
        // Get Stripe.js instance
        const stripe = await stripePromise;
    
        // Call your backend to create the Checkout Session
        const response = await fetch('http://localhost:4242/create-checkout-session', { method: 'POST' });
    
        const session = await response.json();
    
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });
    
        if (result.error) {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        }
        console.log("Success")
        addDonation(AuthUser.id, projectId, amount)
    };
    


    return (
        <Layout>
            <DBNavBar userId={AuthUser.id}
                userName={displayName != null ? displayName : 'Name'}
                signOut={AuthUser.signOut} />
            <Content className="siteContent projectPageContent">
                <Row>
                    <div style={{ marginLeft: '30px' }}>
                        <Link href="/dashboard">
                            <span className={styles.breadcrumb}>Projects / </span>
                        </Link>
                        <span>{project?.title}</span>
                    </div>
                </Row>
                <div className={styles.projectPage}>
                    {!isLoading &&
                        <>

                            <div className={styles.col}>
                                <div className={styles.title__info}>
                                    <h1>{project?.title}</h1>
                                    {project?.tagName == tag_text1 && <div className={styles.tag_red}>{project?.tagName}</div>}
                                    {project?.tagName == tag_text2 && <div className={styles.tag_blue}>{project?.tagName}</div>}
                                    <p>{project?.description}</p>
                                </div>
                                <div className={styles.labels}>
                                    <span><FontAwesomeIcon icon={faUser} /> {project?.author}</span>
                                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {project?.location}</span>
                                    <span>Published {project?.published}</span>
                                    <span>Last Updated {project?.updated}</span>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <Image width={630} height={420} src={project?.src} fallback="error_project?.png" />
                                <div className={styles.cardContent}>
                                    <div className={styles.cardContent__info}>
                                        <p>Funds Raised (USD)</p>
                                        <h1>{project?.curAmt}</h1>
                                        <p>Target Amount: ${project?.totalAmt}</p>
                                    </div>
                                    <div className={styles.progressBar} style={{ width: 250 }}>
                                        <Progress
                                            percent={calPercentage(project?.curAmt, project?.totalAmt)}
                                            strokeColor="#048A81"
                                            strokeWidth={20}
                                            strokeLinecap={"square"}
                                            size="default"
                                        />
                                    </div>
                                    <div className={styles.cardContent__info}>
                                        <p>Climate Donor ${project?.totalAmt} </p>
                                        <p>Other Sources ${project?.totalAmt}</p>
                                    </div>
                                    <Button type="primary" className={styles.Button} onClick={handleDonate}>Donate</Button>
                                </div>
                            </div>
                            <div className={styles.col}>
                                <p>{project?.description}</p>
                            </div>
                            <div className={styles.projectUpdates}>
                                <h2 className={styles.projectUpdates_title}>Project Updates</h2>
                            </div>
                        </>
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
})(ProjectPage)