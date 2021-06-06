import styles from '../styles/ProjectCard.module.css'
import { Image, Progress } from 'antd';
import { faUser, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link';

const tag_text1 = "Clean Energy"
const tag_text2 = "Transportation"

const calPercentage = (currentAmt, total) => {
    currentAmt = parseInt(currentAmt, 10);
    total = parseInt(total, 10);
    return ((100 * currentAmt) / total).toFixed(2);
}


const ProjectCard = (props) => {
    const { key, src, projectTitle, projectDescription, tagName, author, location, published, updated, curAmt, totalAmt } = props
    return (
        <Link href={`projects/${key ? key : 1}`}>
        <div className={styles.projectCard}>
            <Image width={200} height={180} src={src} fallback="error_project.png" />
            <div className={styles.cardContent}>
                {tagName == tag_text1 && <div className={styles.tag_red}>{tagName}</div>}
                {tagName == tag_text2 && <div className={styles.tag_blue}>{tagName}</div>}
                <div className={styles.cardContent__info}>
                    <h3>{projectTitle}</h3>
                    <p>{projectDescription}</p>
                </div>
                <div className={styles.progressBar} style={{width: 300}}>
                    <Progress 
                        percent={calPercentage(curAmt, totalAmt)} 
                        strokeColor="#048a81" 
                        size="default" 
                        format={() => <p><b>${curAmt} raised</b> <span className={styles.smallFont}> of ${totalAmt}</span></p>} 
                    />
                </div>
                <div className={styles.labels}>
                    <span><FontAwesomeIcon icon={faUser} /> {author}</span>
                    <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {location}</span>
                    <span>Published {published}</span>
                    <span>Last Updated {updated}</span>
                </div>
            </div>
        </div>
        </Link>
    )
}

export default ProjectCard;