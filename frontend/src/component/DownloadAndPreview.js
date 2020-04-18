import React from 'react';
import './style.css'

import DocumentPreview from './DocumentPreview'

class DownloadAndPreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: null
        }
    }

    componentDidMount() {
        let url = sessionStorage.getItem("pdfurl");
        this.setState({
            url: url
        })
    }

    downloadPDF = () => {
        window.open(this.state.url, '_blank');
    }

    render() {

        return (
            <React.Fragment>

                <div className="cols">
                    <label>Download and Preview File </label>
                    <ul>
                        <li>
                            <div className="downloadLink">
                                <button className="downloadIcon" onClick={this.downloadPDF}>Download</button>
                            </div>
                        </li>
                        <li>
                            <DocumentPreview url={this.state.url}></DocumentPreview>
                        </li>


                    </ul>
                </div>
            </React.Fragment>
        );
    }



}


export default DownloadAndPreview;