import json
import boto3
import base64
import os
import subprocess
import os.path
from os import path
import zipfile

REGION                                              = 'us-east-1'
S3BUCKET                                            = 'lambda-libreoffice-demo-aa1'
CONVERT_COMMAND                                     = 'export HOME=/tmp && ./instdir/program/soffice.bin --headless --norestore --invisible --nodefault --nofirststartwizard --nolockcheck --nologo --convert-to "pdf:writer_pdf_Export" --outdir /tmp'
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
    if (body):
        filename                                    = body["filename"]
        base64_file                                 = body["base64File"]
        pdf_response                                = convert_file_to_pdf(base64_file, filename)
        filename                                    = pdf_response["filename"]
        fileBuffer                                  = pdf_response["fileBuffer"]
        key                                         = 'pdfs/' + filename
        s3                                          = boto3.client('s3')
        s3.put_object(
            Bucket                                  = S3BUCKET,
            Key                                     = key,
            Body                                    = fileBuffer,
            ACL                                     = "public-read",
            ContentType                             = "application/pdf")
        location                                    = f'https://{S3BUCKET}.s3.amazonaws.com/' + key
        response = {
            "statusCode"                            : 200,
            "headers"                                   : {
                'Access-Control-Allow-Origin'           : '*',
                'Access-Control-Allow-Headers'          : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods'          : 'GET, POST, OPTIONS'
                },
            "body": {"pdfFileURL"                       : location}
        }
    return json.dumps(response)


def convert_file_to_pdf(base_64_file, filename) :
      file_buffer                                   = base64.b64decode(base_64_file)
      file_error                                    = validate(file_buffer)
      if (file_error):
        return                                        file_error
      f                                             = open(f'/tmp/{filename}', 'wb')
      f.write(file_buffer)
      f.close()
      pdf_filename, pdf_file_buffer                 = convert_to_pdf(filename)
      return upload_pdf(pdf_filename, pdf_file_buffer)

def validate(file_buffer):
    if len(file_buffer)                             > MAX_FILE_SIZE:
        return                                        False
    if len(file_buffer)                             < 4:
        return                                        False


def convert_to_pdf(input_file_name):
      pdf_filename                                  = get_pdf_file_name(input_file_name)
      there = exists('/tmp/instdir')
      if there == False:
        download()
      command                                       = 'chmod 777  /tmp/instdir/program/soffice.bin && cd /tmp && '+CONVERT_COMMAND+' '+ input_file_name;
      try:
          result = subprocess.Popen(
              ['/tmp/instdir/program/soffice.bin', "--convert-to", "pdf", "--outdir", "/tmp", '/tmp/'+input_file_name])
      except Exception as e:
          f                                         = os.popen(command)
          result                                    = f.read()
      in_file                                       = open('/tmp/'+pdf_filename, "rb")
      pdf_file_buffer                               = in_file.read()
      return pdf_filename,pdf_file_buffer



def get_pdf_file_name(inputFilename):
    return                                            inputFilename.split(".")[0]+'.pdf'


def upload_pdf(filename, fileBuffer):
    return {
        "filename"                                  : filename,
        "fileBuffer"                                : fileBuffer}

def exists(in_path):
    if (path.exists(in_path)):
        return                                        True
    return                                            False


def download():
    s3                                              = boto3.resource('s3')
    obj                                             = s3.Object(S3BUCKET, 'lo.zip')
    body                                            = obj.get()['Body'].read()
    f                                               = open("/tmp/lo.zip", "wb")
    f.write(body)
    f.close()
    with zipfile.ZipFile('/tmp/lo.zip', 'r') as zip_ref:
        zip_ref.extractall('/tmp')
    mv = 'chmod 777  /tmp/instdir/program/soffice.bin'
    f = os.popen(mv)
    res = f.read()