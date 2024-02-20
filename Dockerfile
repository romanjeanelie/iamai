FROM node:20.3.0-alpine3.17


ENV VITE_API_LOCATION_URL=https://api.iamplus.chat/location/
ENV VITE_API_HOST=https://api.iamplus.chat
ENV VITE_API_UPLOAD_URL=https://api.iamplus.chat/fileservices/uploads
ENV VITE_API_WHISPER_URL=https://api.iamplus.chat/proxy-whisper-api-web/asr?task=transcribe&encode=true&output=json&word_timestamps=false&language=
ENV VITE_API_NATS_URL=wss://nats.iamplus.chat
ENV VITE_API_NATS_USER=iamplus-acc
ENV VITE_API_NATS_PASS=cis8Asto6HepremoGApI
ENV VITE_API_URL=https://app.iamplus.chat/index.html?lang=ad&session_id=
ENV VITE_API_DB_HOST=https://nocodb.iamplus.chat
ENV VITE_API_DB_TOKEN=juIbsot-ERPsSlO3TdkYHRJPznr1gqrLBIpMjWZU
ENV VITE_API_ELASTIC_URL=https://api.iamplus.chat/elastic/text/bulk_index_urls
ENV VITE_API_ELASTIC_TOKEN=iIPyByKL-3X48AzXvme9onV9p94GwrmWTqV7P5jQ
ENV VITE_API_ELEVENLABS_URL=https://api.elevenlabs.io/v1/text-to-speech/ZVKjrJiWeTKF1FZwjENi/stream?optimize_streaming_latency=4
ENV VITE_API_ELEVENLABS_TOKEN=bddfcabff8951ebb9e925d506452df93
ENV VITE_API_PA_URL=https://api.iamplus.chat/deploy-pa

RUN mkdir -p /iamai-main
WORKDIR /iamai-main
COPY  . .
RUN npm install
RUN npm install -g http-server
RUN npm run build
EXPOSE 8080
WORKDIR /iamai-main/dist
CMD [ "http-server"]
