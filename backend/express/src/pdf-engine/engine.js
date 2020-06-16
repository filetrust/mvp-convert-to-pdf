const { writeFileSync }                             = require("fs");
const path                                          = require("path");
const { execSync }                                  = require("child_process");
const convertCommand                                = 'export HOME=/root && ./instdir/program/soffice.bin --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp';

const MAX_FILE_SIZE                                 = 30 * 1024 * 1024;

async function convert(request, response){
    console.log('Convert IN')
    const filename                    = request.body.filename;
    const base64File                  = request.body.base64File;
    filename_sanitized                                = filename.replace(/[^a-zA-Z ]/g, "").replace(" ", "");
    var pdfFileURLProm                                = convertFileToPDF(base64File, filename_sanitized);
    var filename_pdf                                  = pdfFileURLProm.filename;
    await response.status(200).download('/tmp/'+filename_pdf)
}

function convertFileToPDF(base64File,filename) {
    const fileBuffer                                  = new Buffer(base64File, "base64");
    const fileError                               = validate(fileBuffer);
    if (fileError) {
        return fileError;
    }
    writeFileSync(`/tmp/${filename}`, fileBuffer);
    const { pdfFilename, pdfFileBuffer }              = convertToPDF(filename);
    return {"filename" : filename, "fileBuffer" : fileBuffer};
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
    const command                                     = 'chmod 777  /root/instdir/program/soffice.bin && cd /root && '+convertCommand+' '+ inputFilename;
    try {
        execSync(command);
    } catch (e) {
        execSync(command);
    }
    console.log('[converted]');
    return {
        pdfFilename
    };
}

function getPDFFilename(inputFilename) {
    const { name }                                    = path.parse(inputFilename);
    return                                            inputFilename.split(".")[0]+'.pdf';
}


module.exports = {
    convert
}