import styles from '../styles/ProjectPage.module.css'
import {Button, Image, Progress} from 'antd';
import {faUser, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const tag_text1 = "Clean Energy"
const tag_text2 = "Transportation"

const calPercentage = (currentAmt, total) => {
    currentAmt = parseInt(currentAmt, 10);
    total = parseInt(total, 10);
    return ((100 * currentAmt) / total).toFixed(2);
}


const ProjectPage = (props) => {
    const {
        src,
        projectTitle,
        projectShortDescription,
        projectFullDescription,
        tagName,
        author,
        location,
        published,
        updated,
        curAmt,
        totalAmt
    } = props
    return (
        <div className={styles.projectPage}>
            <div className={styles.col}>
                <div className={styles.title__info}>
                    <h1>{projectTitle}</h1>
                    {tagName == tag_text1 && <div className={styles.tag_red}>{tagName}</div>}
                    {tagName == tag_text2 && <div className={styles.tag_blue}>{tagName}</div>}
                    <p>{projectShortDescription}</p>
                </div>
                <div className={styles.labels}>
                    <span><FontAwesomeIcon icon={faUser}/> {author}</span>
                    <span><FontAwesomeIcon icon={faMapMarkerAlt}/> {location}</span>
                    <span>Published {published}</span>
                    <span>Last Updated {updated}</span>
                </div>
            </div>
            <div className={styles.row}>
                <Image width={630} height={420} src={src} fallback="error_project.png"/>
                <div className={styles.cardContent}>
                    <div className={styles.cardContent__info}>
                        <p>Funds Raised (USD)</p>
                        <h1>{curAmt}</h1>
                        <p>Target Amount: ${totalAmt}</p>
                    </div>
                    <div className={styles.progressBar} style={{width: 250}}>
                        <Progress
                            percent={calPercentage(curAmt, totalAmt)}
                            strokeColor="#048A81"
                            strokeWidth={20}
                            strokeLinecap={"square"}
                            size="default"
                        />
                    </div>
                    <div className={styles.cardContent__info}>
                        <p>Climate Donor ${totalAmt} </p>
                        <p>Other Sources ${totalAmt}</p>
                    </div>
                    <Button type="primary" className={styles.Button}>Donate</Button>
                </div>
            </div>
            <div className={styles.col}>
                <p>{projectFullDescription}</p>
            </div>
            <div className={styles.projectUpdates}>
                <h2 className={styles.projectUpdates_title}>Project Updates</h2>
            </div>
        </div>
    )
}

export default ProjectPage;