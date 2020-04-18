import React from 'react';
import './style.css'
import * as Utils from '../utils/utils.js'

import CommonServices from '../services/common/common';

const Loader = new CommonServices();


let AWS_REGION = 'XXXX';
let ACCESS_KEY = "XXXX";
let SECRET = "XXXX";



class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

   

    getPDFUrl = (data, uploadResult) => {
        Loader.showLoader();
        let _self = this;
        window.AWS.config.update({
            region: AWS_REGION,
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET,
            httpOptions: {
                timeout: 3000000,
                connectTimeout: 500000
            }
        });
        var lambda = new window.AWS.Lambda();
        var params = {
            FunctionName: 'convert-to-pdf',
            Payload: JSON.stringify(data)

        };

        var upload = lambda.invoke(params);
        var promise = upload.promise();

        promise.then(
            function (data) {
                uploadResult(data, _self);
                Loader.hideLoader();
            },
            function (err) {
                alert("There was an error uploading file: ", err.message);
                uploadResult(data, _self);
                Loader.hideLoader();
            }
        );

    }



    
    uploadResult = (data, self) => {

        if (data) {
            let payload = data.Payload;
            let bodyObject = JSON.parse(payload);
            if (typeof bodyObject === "string") {
                bodyObject = JSON.parse(bodyObject);
            }
            if (typeof bodyObject.body !== "undefined") {
                let convertedFileUrl = (bodyObject.body.pdfFileURL);
                sessionStorage.setItem("pdfurl", convertedFileUrl)
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
                    <button className="submit">Upload!</button>
                </div>
                </div>
            </div>
        );
    }




}


export default Upload;