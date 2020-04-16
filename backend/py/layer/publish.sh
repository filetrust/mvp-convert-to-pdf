#!/usr/bin/env bash

LAYER_FILENAME='layer.tar.gz.zip'
TARGET_REGION='us-east-1'
LAYER_NAME='libreoffice'
LO_VERSION='1'
S3BUCKET='lambda-libreoffice-demo-aa1'

aws s3 cp ./"$LAYER_FILENAME" s3://"$S3BUCKET"/"$LAYER_FILENAME"

aws lambda add-layer-version-permission \
  --region "$TARGET_REGION" \
  --layer-name "$LAYER_NAME" \
  --statement-id sid1 \
  --action lambda:GetLayerVersion \
  --principal '*' \
  --version-number "$(aws lambda publish-layer-version \
    --region "$TARGET_REGION" \
    --layer-name "$LAYER_NAME" \
    --description "${LAYER_NAME} ${LO_VERSION} binary" \
    --query Version \
    --output text \
    --content S3Bucket=lambda-libreoffice-demo-aa1,S3Key="$LAYER_FILENAME"
    )"

sleep 9000