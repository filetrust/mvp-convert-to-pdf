import React from 'react';
import './style.css'
import DownloadIcon from '../images/download-icon.png'
import {Link} from 'react-router-dom'

class FileLinks extends React.Component {
    constructor(props){
        super(props);
        this.state={
            fileLink:[process.env.PUBLIC_URL + "/images/sample1.png",
            process.env.PUBLIC_URL + "/images/sample2.txt",
            process.env.PUBLIC_URL + "/images/sample3.pptx",
            process.env.PUBLIC_URL + "/images/sample4.xlsx",
            process.env.PUBLIC_URL + "/images/sample5.docx"]
            
        }
    }
    render(){
        return(
            <div className="sample-links">
                <h2>Sample Files. Download and convert into PDF </h2>
                <ul>
                    <li><Link to={this.state.fileLink[0]} target="_blank" download><span>Sample1.png</span><i><img src={DownloadIcon} alt="Download Image"/></i> </Link></li>
                    <li><Link to={this.state.fileLink[1]} target="_blank" download><span>Sample2.txt</span><i><img src={DownloadIcon} alt="Download Image"/></i> </Link></li>
                    <li><Link to={this.state.fileLink[2]} target="_blank" download><span>Sample3.pptx</span><i><img src={DownloadIcon} alt="Download Image"/></i> </Link></li>
                    <li><Link to={this.state.fileLink[3]} target="_blank" download><span>Sample4.xlsx</span><i><img src={DownloadIcon} alt="Download Image"/></i> </Link></li>
                    <li><Link to={this.state.fileLink[4]} target="_blank" download><span>Sample5.docx</span><i><img src={DownloadIcon} alt="Download Image"/></i> </Link></li>
                </ul>   
            </div>
        )
    }
}


export default FileLinks

