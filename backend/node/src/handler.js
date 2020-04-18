const { writeFileSync }                             = require("fs");
const { execSync }                                  = require("child_process");
const { readFileSync }                              = require("fs");
const tar                                           = require("tar-fs");
const zlib                                          = require("zlib");
const path                                          = require("path");
const https                                         = require("https");
const fs                                            = require("fs");
const unzip                                         = require("unzip");
var AWS                                             = require('aws-sdk');
var s3Region                                        = 'us-east-1';
var s3Bucket                                        = 'lambda-libreoffice-demo-aa1';

const inputPath                                     = '/tmp/lo.zip';
const outputBaseDir                                 = '/tmp';
const outputPath                                    = '/tmp/instdir';

const convertCommand                                = 'export HOME=/tmp && ./instdir/program/soffice.bin --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp';
const MAX_FILE_SIZE                                 = 5 * 1024 * 1024;

exports.handler = (event, context, callback) => {
    funcUnpack(event, context, callback);
};

function funcUnpack(event, context, callback) {
    let input                                       = path.resolve(inputPath);
    let output = outputPath;
    if(exists(output) == false){
        const file                                  = fs.createWriteStream(inputPath);
        const request                               = https.get("https://"+s3Bucket+".s3.amazonaws.com/lo.zip", function(response) {
        response.pipe(file);
        fs.createReadStream(inputPath)
          .pipe(unzip.Extract({ path: '/tmp' }))
           .on('close', function () {
                 execute(event,callback);
           });
        });
    }
    else{
        execute(event,callback);
    }
}

function execute(event,callback){
  const { filename, base64File }                    = (event.body);
  filename2                                         = filename.replace(/[^a-zA-Z ]/g, "").replace(" ", "");
  var pdfFileURLProm                                = convertFileToPDF(base64File, filename2,callback);
  var filename1                                     = pdfFileURLProm.filename;
  var fileBuffer1                                   = pdfFileURLProm.fileBuffer;
  var key                                           = 'pdfs/'+filename1;
  var params = {
    Bucket                                          : s3Bucket,
    Key                                             : key,
    Body                                            : fileBuffer1,
    ACL                                             : "public-read",
    ContentType                                     : "application/pdf"
  };
  var s3                                            = new AWS.S3({apiVersion: '2006-03-01'});
  s3.putObject(params, function(err, data) {
        var location                                = 'https://'+s3Bucket+'.s3.amazonaws.com/'+key;
        var response = {
        "statusCode"                                : 200,
        "headers": {
            'Access-Control-Allow-Origin'           : '*',
            'Access-Control-Allow-Headers'          : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods'          : 'GET, POST, OPTIONS'
        },
        "body": {"pdfFileURL"                       :location}
        }
        callback(null, JSON.stringify(response));
   });
}

function convertFileToPDF(base64File,filename,cb) {
  const fileBuffer                                  = new Buffer(base64File, "base64");
  const fileError                                   = validate(fileBuffer);
  if (fileError) {
    return fileError;
  }
  writeFileSync(`/tmp/${filename}`, fileBuffer);
  const { pdfFilename, pdfFileBuffer }              = convertToPDF(filename);
  return uploadPDF(pdfFilename, pdfFileBuffer,cb);
}

function validate(fileBuffer) {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    return Promise.reject(new Error("File is too large"));
  }
  if (fileBuffer.length < 4) {
    return Promise.reject(new Error("File is too small"));
  }
}


function convertToPDF(inputFilename) {
  console.log('[convertToPDF][file:${inputFilename}]');
  const pdfFilename                                 = getPDFFilename(inputFilename);
  const command                                     = 'chmod 777  /tmp/instdir/program/soffice.bin && cd /tmp && '+convertCommand+' '+ inputFilename;
  try {
    execSync(command);
  } catch (e) {
    execSync(command);
  }
  console.log('[converted]');
  const pdfFileBuffer                               = readFileSync('/tmp/'+pdfFilename);
  return {
    pdfFileBuffer,
    pdfFilename
  };
}


function getPDFFilename(inputFilename) {
  const { name }                                    = path.parse(inputFilename);
  return                                            inputFilename.split(".")[0]+'.pdf';
}


function uploadPDF(filename, fileBuffer,cb) {
    return {"filename" : filename,"fileBuffer": fileBuffer};
}

function exists(path){
 if (fs.existsSync(path)){
    return true;
 }
 return false;
}