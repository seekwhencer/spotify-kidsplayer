FROM rust:1.66-buster as build

ARG BRANCH=master

ENV PKG_CONFIG_ALLOW_CROSS=1 PKG_CONFIG_PATH=/usr/lib/arm-linux-gnueabihf/pkgconfig/
ENV CARGO_TARGET_ARM_UNKNOWN_LINUX_GNUEABIHF_LINKER="arm-linux-gnueabihf-gcc"

WORKDIR /usr/src/


RUN dpkg --add-architecture armhf && \
    apt-get -yqq update && \
    apt-get install --no-install-recommends -yqq gcc-arm-linux-gnueabihf libc6-dev-armhf-cross \
    libasound2-dev:armhf libssl-dev:armhf && \
    mkdir -p /usr/src/spotifyd /usr/src/asound2 && \
    git clone --branch=${BRANCH} https://github.com/Spotifyd/spotifyd.git 

RUN cd spotifyd && \
    rustup target add arm-unknown-linux-gnueabihf && \
    cargo build --target=arm-unknown-linux-gnueabihf --release

RUN cd asound2 && \
    apt-get download -yqq libasound2:armhf && \
    ar p ./libasound2*_armhf.deb data.tar.xz | tar xJ

FROM arm32v7/debian:buster-slim as release

ENTRYPOINT ["/usr/bin/spotifyd", "--no-daemon"]

COPY --from=build /usr/src/spotifyd/target/arm-unknown-linux-gnueabihf/release/spotifyd /usr/bin/
COPY --from=build /usr/src/asound2/usr /usr


