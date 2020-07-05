
npm run build
docker build -t wakecap_application .
docker run -p  3003:3003 wakecap_application