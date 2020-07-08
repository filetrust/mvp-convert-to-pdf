const { writeFileSync }                             = require("fs");
const { readFileSync }                              = require("fs");
const path                                          = require("path");
const { execSync }                                  = require("child_process");
const libre                                         = require('libreoffice-convert');
const REGEX_SAFE_FILE_NAME                          = /[^a-zA-Z0-9-_\.]/g
var PDFImage                                        = require("pdf-image").PDFImage;

const MAX_FILE_SIZE                                 = 30 * 1024 * 1024;

async function convert(request, response){
    console.log('Request Body - '+JSON.stringify(request.body))
    const filename                                    = request.body.filename;
    const base64File                                  = request.body.base64File;
    filename_sanitized                                = sanitize_file_name(filename);
    var pdfFileURLProm                                = convertFileToPDF(base64File, filename_sanitized,response);
}

async function convert_to_img(request, response){
    console.log('Request Body - '+JSON.stringify(request.body))
    const filename                                    = request.body.filename;
    const base64File                                  = request.body.base64File;
    filename_sanitized                                = sanitize_file_name(filename);
    const fileBuffer                                  = new Buffer(base64File, "base64");
    const fileError                                   = validate(fileBuffer);
    if (fileError) {
        response.status(400).download('File too big or too small')
        return;
    }
    writeFileSync(`/tmp/${filename_sanitized}`, fileBuffer);
    console.log('Wrote tmp pdf at '+filename_sanitized)
    var pdfImage = new PDFImage(`/tmp/${filename_sanitized}`,{
      combinedImage: true
    });
    pdfImage.convertFile().then(function (imagePaths) {
        console.log("Image converted successfully!");
        var result_path = imagePaths;
        console.log('result_path '+result_path)
        const imgBytes = readFileSync(result_path)
        console.log("Returning response!");
        response.status(200).send({'filename' : filename_sanitized.split('.')[0]+'.png' , "base64file" : Buffer.from(imgBytes).toString('base64')})
    });
}


function convertFileToPDF(base64File,filename, response) {
    const fileBuffer                                  = new Buffer(base64File, "base64");
    const fileError                                   = validate(fileBuffer);
    if (fileError) {
        response.status(400).download('File too big or too small')
        return;
    }
    writeFileSync(`/tmp/${filename}`, fileBuffer);
    convertToPDF(filename,response);
}

function validate(fileBuffer) {
    if (fileBuffer.length > MAX_FILE_SIZE) {
        return Promise.reject(new Error("File is too large"));
    }
    if (fileBuffer.length < 4) {
        return Promise.reject(new Error("File is too small"));
    }
}

function convertToPDF(inputFilename,response) {
    const pdfFilename                                   = getPDFFilename(inputFilename);
    const pdfFilePath                                  = '/tmp/'+pdfFilename;
    //const command                                     = 'chmod 777  /root/instdir/program/soffice.bin && cd /root && '+convertCommand+' /tmp/'+ inputFilename;
    try {
        const file = readFileSync('/tmp/'+inputFilename);
        libre.convert(file, ".pdf", undefined, (err, done) => {
            if (err) {
                console.log(`Error converting file: ${err}`);
                response.status(500).send('Processing error')
                return;
            }
            writeFileSync(pdfFilePath, done);
            const pdfBytes = readFileSync(pdfFilePath)
            response.status(200).send({'filename' : pdfFilename, "base64file" : Buffer.from(pdfBytes).toString('base64')})
        });
    } catch (e) {
        console.log('Error '+e.stack);
    }
    console.log('[converted]');
}

function getPDFFilename(inputFilename) {
    const { name }                                    = path.parse(inputFilename);
    return                                            inputFilename.split(".")[0]+'.pdf';
}


function sanitize_file_name(file_name) {
    if (typeof(file_name) !== 'string') {
        throw new Error(`[sanitize_file_name] provided value was now a string, it was ${typeof(file_name)}`)
    }
    return file_name.replace(REGEX_SAFE_FILE_NAME, '_')
}

module.exports = {
    convert,
    convert_to_img
}