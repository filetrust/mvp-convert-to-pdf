import json
import boto3
import base64
import os
import subprocess
import tarfile

S3BUCKET                                            = 'lambda-libreoffice-demo-aa1'
CONVERT_COMMAND                                     = 'export HOME=/tmp && ./instdir/program/soffice.bin --headless' \
                                                    ' --norestore --invisible --nodefault --nofirststartwizard' \
                                                    ' --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp'
MAX_FILE_SIZE                                       = 5 * 1024 * 1024


def lambda_handler(event, context):
    response = {
        "statusCode": 400,
        "headers": {
            'Access-Control-Allow-Origin'           : '*',
            'Access-Control-Allow-Headers'          : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods'          : 'POST, OPTIONS'
        }
    }
    if event['body'] is None:
        return response
    body                                            = event['body']
    print(json.dumps(body))
    if (body):
        filename                                    = body["filename"]
        base64_file                                 = body["base64File"]
        pdf_response                                = convert_file_to_pdf(base64_file, filename)
        filename                                    = pdf_response.filename
        fileBuffer                                  = pdf_response.fileBuffer
        key                                         = 'pdfs/' + filename
        params = {
            'Bucket'                                : 'lambda-libreoffice-demo-aa',
            'Key'                                   : key,
            'Body'                                  : fileBuffer,
            'ACL'                                   : "public-read",
            'ContentType'                           : "application/pdf"
        }
        s3                                          = boto3.client('s3')
        s3.putObject(params)
        location                                    = 'https://lambda-libreoffice-demo-aa.s3.amazonaws.com/' + key
        response = {
            "statusCode"                            : 200,
        "headers"                                   : {
            'Access-Control-Allow-Origin'           : '*',
            'Access-Control-Allow-Headers'          : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods'          : 'GET, POST, OPTIONS'
            },
        "body": {"pdfFileURL"                       : location}
        }
    return response


def convert_file_to_pdf(base_64_file, filename) :
      file_buffer                                   = base64.b64decode(base_64_file)
      file_error                                    = validate(file_buffer)
      if (file_error):
        return                                      file_error
      f                                             = open(f'/tmp/{filename}', 'wb')
      f.write(file_buffer)
      f.close()
      pdf_filename, pdf_file_buffer                 = convert_to_pdf(filename)
      return upload_pdf(pdf_filename, pdf_file_buffer)

def validate(file_buffer):
    if len(file_buffer)                             > MAX_FILE_SIZE:
        return                                      False
    if len(file_buffer)                             < 4:
        return                                      False


def convert_to_pdf(input_file_name):
      pdf_filename                                  = get_pdf_file_name(input_file_name)
      mv                                            = 'cp /opt/lo.tar.gz /tmp'
      f                                             = os.popen(mv)
      res                                           = f.read()
      tar                                           = tarfile.open('/tmp/lo.tar.gz', "r:gz")
      tar.extractall(path='/tmp')
      tar.close()
      command                                       = 'chmod -R 777 /tmp/instdir/'
      f                                             = os.popen(command)
      res                                           = f.read()
      command                                       = 'cd /tmp && ' + CONVERT_COMMAND +' ' + input_file_name
      try:
          f                                         = os.popen(command)
          result                                    = f.read()
      except Exception as e:
          f                                         = os.popen(command)
          result                                    = f.read()
      find_command                                  = 'ls -ltr /tmp'
      f                                             = os.popen(find_command)
      res                                           = f.read()
      in_file                                       = open('/tmp/'+pdf_filename, "rb")
      pdfFileBuffer                                 = in_file.read()
      return pdfFileBuffer,pdf_filename



def get_pdf_file_name(inputFilename):
  name                                              = os.path.splitext(inputFilename)
  return                                            inputFilename.split(".")[0]+'.pdf'


def upload_pdf(filename, fileBuffer, cb):
    return {
        "filename"                                  : filename,
        "fileBuffer"                                : fileBuffer}
