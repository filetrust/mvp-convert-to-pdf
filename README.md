# mvp-convert-to-pdf

This converter can be used to convert all types of documents to pdf.
It uses a lambda to invoke libre-office and converts documents

## Source code structuring

* The source code is divided into 2 directories
    * Frontend
    * Backend
* Frontend contains the react.js source code that can be hosted in any public domain. The frontend facilitates user's input of documents to convert.
* Backend contains nodejs and python lamda source codes and lambda layer for the actual conversion.These are to be deployed on AWS

## General Workflow

* The front end UI, built in react
* It takes the file to convert from the user. It reads to file into a base64 encoded string
* It creates a json body from the file name and the base64 encoded file and invokes the backend lambda using the aws javascript sdk
* The backend lambda receives the request.
* It writes the base64 file input to a real file on the disk in the lambda runtime environment.
* It checks if the layer attached with the lambda is unpacked. The layer contains the libreoffice executable.
* In case the runtime has the layer unzipped (which is the case on warm lambda boots), it invokes the libre office executable to start conversion

```
./instdir/program/soffice.bin --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp withlinkrtf
```

* The converted pdf file is read back by the lambda and it is uploaded to a S3 bucket with public read access.
* The S3 pdf location is then returned back to the frontend
* The frontend reads back the response, shows a preview of the returned pdf and allows facility to download it.

## Deployment

### Backend

The nodejs lambda is fully functional for now.

####Build Steps

* Download lo.zip from https://lambda-libreoffice-demo-aa1.s3.amazonaws.com/lo.zip and upload it to S3
* Provide public read permissions to it.
* Change the following properties in backend/node/src/handler.js as per deployment

```
var s3Region                                        = 'us-east-1';
var s3Bucket                                        = 'lambda-libreoffice-demo-aa1';
```

* Run "npm install" from backend/node/src directory.
* Pack the resultant handler.js and the node_modules directory in a zip.


####Deployment Steps

* Create a Lmabda function in AWS
* Keep maximum possible timeout (15 mins) and memory
* Upload the code base zip 
* Name the lambda handler as handler.handler
* Keep runtime as Node.js 10.X 
* Name the function convert-to-pdf
* Save it

### Frontend

####Build Steps

* Create a AWS programmatic access user with permission to execute the lambda create during backend deployment. 
Example policy

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowConversionFunction",
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": "arn:aws:lambda:us-east-1:701758031517:function:convert-to-pdf"
        }
    ]
}
```

* Edit frontend/src/component/Upload.js. Replace AWS_REGION, ACCESS_KEY and SECRET variables at top as per the iAM user's credentials created above and region.
* Change directory to frontend
* Install dependencies with ```npm install```
* Run ```npm start``` to start and test the frontend locally.
* Run ```npm run-script build``` to create a deployment package in the build directory in frontend directory

####Deployment Steps

* Copy the build directory contents to S3, Github pages or any place of choice and execute the front end.
