import React from 'react';
import './style.css'
import * as Utils from '../utils/utils.js'
import CommonServices from '../services/common/common';
import SampleLinks from './SampleLinks'
import axios from 'axios'


const Loader = new CommonServices();

const SERVER_URL = 'https://'+process.env.REACT_APP_API_HOST+":"+process.env.REACT_APP_API_PORT+"/";

class Upload extends React.Component {

    constructor(props) {
        super(props);
        console.log('process.env.API_HOST - '+process.env.REACT_APP_API_HOST)
        this.state = {}
    }

   

    getPDFUrl = (filename, data, uploadResult) => {
        Loader.showLoader();
        let _self = this;
        let serverUrl = SERVER_URL+'convert';
        let body = {"filename" : filename, "base64File" : data.body.base64File};
        console.log('axios = '+serverUrl)
        axios.post(serverUrl, body)
        .then(function (res) {
            console.log('Result from api '+res);
            uploadResult(res.data, _self);
            Loader.hideLoader();
        })
        .catch(e => {
            alert("There was an error uploading file: ", e.message)
            console.log(e.stack);
            Loader.hideLoader();
        })
        console.log('getPDFUrl OUT ')
    }

    
    uploadResult = (data, self) => {
        console.log('uploadResult data - '+JSON.stringify(data));
        if (data) {
            sessionStorage.setItem("pdfData", JSON.stringify(data))
            self.props.history.push("/download")
            }
            else {
                alert("There was an error in converting file to PDF: ");
            }
            Loader.hideLoader();
    }


    UploadHandler = async (event) => {
        let file = event.target.files[0];
        if (file) {
            //let id = "fileupload";
            await Utils.fileToBase64(file).then(data => {
                console.log("content:" + data)
                let filename = file.name;
                this.getPDFUrl(filename, data, this.uploadResult);

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