const { writeFileSync }                             = require("fs");
const path                                          = require("path");
const { execSync }                                  = require("child_process");
const convertCommand                                = 'export HOME=/root && ./instdir/program/soffice.bin --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp';
const REGEX_SAFE_FILE_NAME                          = /[^a-zA-Z0-9-_\.]/g

const MAX_FILE_SIZE                                 = 30 * 1024 * 1024;

async function convert(request, response){
    const filename                                    = request.body.filename;
    const base64File                                  = request.body.base64File;
    filename_sanitized                                = sanitize_file_name(filename);
    var pdfFileURLProm                                = convertFileToPDF(base64File, filename_sanitized);
    var filename_pdf                                  = pdfFileURLProm.filename;
    await response.status(200).download('/tmp/'+filename_pdf)
}

function convertFileToPDF(base64File,filename) {
    const fileBuffer                                  = new Buffer(base64File, "base64");
    const fileError                                   = validate(fileBuffer);
    if (fileError) {
        return                                          fileError;
    }
    writeFileSync(`/tmp/${filename}`, fileBuffer);
    const { pdfFilename, pdfFileBuffer }              = convertToPDF(filename);
    return                                              {"filename" : pdfFilename, "fileBuffer" : pdfFileBuffer};
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
    console.log('[convertToPDF]inputFilename - '+inputFilename);
    const pdfFilename                                 = getPDFFilename(inputFilename);
    const command                                     = 'chmod 777  /root/instdir/program/soffice.bin && cd /root && '+convertCommand+' /tmp/'+ inputFilename;
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


function sanitize_file_name(file_name) {
    if (typeof(file_name) !== 'string') {
        throw new Error(`[sanitize_file_name] provided value was now a string, it was ${typeof(file_name)}`)
    }
    return file_name.replace(REGEX_SAFE_FILE_NAME, '_')
}

module.exports = {
    convert
}