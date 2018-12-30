# alpine based
FROM docker:stable

LABEL maintainer="Jon Jaques <jaquers@gmail.com>"

ARG CLOUD_SDK_VERSION=228.0.0
ARG HELM_VERSION=2.9.1

# update registries
RUN apk update

# global deps
RUN apk add --update --no-cache \
  binutils-gold \
  bash \
  curl \
  ca-certificates \
  libgcc \
  libstdc++ \
  linux-headers \
  gcc \
  gettext \
  gnupg \
  gzip \
  g++ \
  make \
  python \
  tar \
  xz

# install latest node deps
RUN apk add nodejs npm yarn --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main

# install google cloud sdk
RUN curl -fsSL --compressed -o google-cloud-sdk.tar.gz "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-$CLOUD_SDK_VERSION-linux-x86_64.tar.gz" \
  && mkdir -p /opt \
  && tar -xzf google-cloud-sdk.tar.gz -C /opt/ \
  && /opt/google-cloud-sdk/install.sh --quiet --usage-reporting=false --additional-components=kubectl \
  && rm google-cloud-sdk.tar.gz

# update path to include gcloud bins
ENV PATH "$PATH:/opt/google-cloud-sdk/bin"

# install helm
RUN curl -fsSL --compressed -o helm.tar.gz "https://storage.googleapis.com/kubernetes-helm/helm-v$HELM_VERSION-linux-amd64.tar.gz" \
  && mkdir -p /opt/helm \
  && tar -xzf helm.tar.gz -C /opt/helm \
  && rm helm.tar.gz

# update path to include helm bin
ENV PATH "$PATH:/opt/helm/linux-amd64"

# test out installation
# RUN node -v \
#   && npm -v \
#   && yarn -v \
#   && docker -v \
#   && gcloud -v \
#   && kubectl version \
#   && helm version