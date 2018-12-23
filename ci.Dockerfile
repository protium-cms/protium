# alpine based
FROM docker:stable
FROM node:lts-alpine

# Download and install Google Cloud SDK
ARG CLOUD_SDK_VERSION=228.0.0
ENV CLOUD_SDK_VERSION=$CLOUD_SDK_VERSION
ARG SDK_LOCATION=/opt/google-cloud-sdk
ARG KEY_LOCATION=/usr/local/keys

# Prepare folders
RUN mkdir -p ${SDK_LOCATION}
RUN mkdir -p ${KEY_LOCATION}

# Install CA certs, openssl to https downloads, python for gcloud sdk
RUN apk add --update bash tar curl make ca-certificates openssl python
# RUN update-ca-certificates

# Download and unpack
RUN curl -s -L -o /var/tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${CLOUD_SDK_VERSION}-linux-x86_64.tar.gz
RUN tar -xzf /var/tmp/google-cloud-sdk.tar.gz -C /opt

# Install gcloud sdk
RUN ${SDK_LOCATION}/install.sh --usage-reporting=false

ENV PATH="${SDK_LOCATION}/bin:${PATH}"
RUN gcloud --quiet components update

# Write our GCP service account private key into a file
# COPY keys/ci-service-key.json ${KEY_LOCATION}

# Login to GCP Docker registry
# RUN gcloud auth activate-service-account --key-file ${KEY_LOCATION}/ci-service-key.json
# RUN docker login -u _json_key --password-stdin https://gcr.io < ${KEY_LOCATION}/ci-service-key.json