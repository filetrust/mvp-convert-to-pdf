import React from 'react';
import './style.css'
import * as Utils from '../utils/utils.js'
import CommonServices from '../services/common/common';
import SampleLinks from './SampleLinks'
import axios from 'axios'


const Loader = new CommonServices();

const SERVER_URL = 'http://'+process.env.API_HOST+":"+process.env.API_PORT+"/";

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

   

    getPDFUrl = (data, uploadResult) => {
        Loader.showLoader();
        let _self = this;
        var params = {
            FunctionName: 'convert-to-pdf',
            Payload: JSON.stringify(data)

        };
        axios.post(SERVER_URL+'convert' ,data)
        .then(res => {
            console.log('Result from api '+res);
            console.log(res.data);
            uploadResult(res.data, _self);
            Loader.hideLoader();
        }).catch(e){
            alert("There was an error uploading file: ", err.message);
            uploadResult(data, _self);
            Loader.hideLoader();
        }
    }

    
    uploadResult = (data, self) => {

        if (data) {
            sessionStorage.setItem("pdfData", pdfurl)
            self.props.history.push("/download")
            } else {
                alert("There was an error in converting file to PDF: ");
            }

            Loader.hideLoader();
        }
    }

    UploadHandler = async (event) => {
        let file = event.target.files[0];
        if (file) {
            //let id = "fileupload";
            await Utils.fileToBase64(file).then(data => {
                console.log("content:" + data)
                this.getPDFUrl(data, this.uploadResult);

            })

        }
    }

    render() {

        return (
            <div className="container">
                <div className="row">
                    <div className="upload-btn">
                    <label>Upload a File to Convert to PDF</label>
                    <div className="uploade-file">
                        <div className="col">
                            <input type="file" name="photo"
                                id="fileupload"
                                onChange={this.UploadHandler.bind(this)}
                            />
                        </div>                        
                    </div>
                    <div className="file-type-list">
                        <ul>
                            <li>doc</li>
                            <li>docx</li>
                            <li>ppt</li>
                            <li>pptx</li>
                            <li>xls</li>
                            <li>xlsx</li>
                            <li>numbers</li>
                            <li>pages</li>
                            <li>key</li>
                            <li>csv</li>
                            <li>txt</li>
                            <li>odt</li>
                            <li>ods</li>
                            <li>odt</li>
                            <li>odp</li>
                            <li>html</li>
                            <li>rtf</li>
                            <li>xlt</li>
                            <li>psd</li>
                            <li>bmp</li>
                            <li>png</li>
                            <li>xml</li>
                            <li>svg</li>
                            <li>cdr</li>
                            <li>eps</li>
                            <li>psw</li>
                            <li>dot</li>
                            <li>tiff</li>
                            <li><i>and more</i></li>
                        </ul>            
                        </div>
                        <SampleLinks/>
                    {/* <button className="submit">Upload!</button> */}
                </div>
                </div>
            </div>
        );
    }




}


export default Upload;