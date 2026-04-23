# Use official nginx image for serving the React build
FROM nginx:alpine

# Copy built React app
COPY dist/ /usr/share/nginx/html/

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
