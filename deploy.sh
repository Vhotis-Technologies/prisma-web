#!/bin/bash

# Prismahome Manual Deployment Script
# This script helps with manual deployment and troubleshooting

set -e

echo "🚀 Prismahome Deployment Script"
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the prismahome directory"
    exit 1
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build the React app
build_app() {
    echo "📦 Building React application..."
    npm ci
    npm run build
    echo "✅ Build completed"
}

# Function to create deployment package
create_package() {
    echo "📦 Creating deployment package..."
    mkdir -p deploy-package
    cp -r build deploy-package/
    cp package.json package-lock.json Dockerfile docker-compose.yml deploy-package/
    tar -czf prismahome-deploy.tar.gz -C deploy-package .
    rm -rf deploy-package
    echo "✅ Deployment package created: prismahome-deploy.tar.gz"
}

# Function to deploy locally
deploy_local() {
    echo "🐳 Deploying locally..."
    check_docker
    
    # Ensure network exists
    docker network create prisma_shared_net 2>/dev/null || true
    
    # Stop existing containers
    docker compose down 2>/dev/null || true
    
    # Build and start
    docker compose up -d --build
    
    echo "✅ Local deployment completed"
    echo "🌐 Application should be available at http://localhost:3000"
}

# Function to show container status
show_status() {
    echo "📊 Container Status:"
    docker compose ps
    echo ""
    echo "📋 Container Logs:"
    docker compose logs --tail=20
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up..."
    docker compose down
    docker image prune -f
    rm -f prismahome-deploy.tar.gz
    echo "✅ Cleanup completed"
}

# Main script logic
case "${1:-help}" in
    "build")
        build_app
        ;;
    "package")
        build_app
        create_package
        ;;
    "deploy")
        build_app
        deploy_local
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "full")
        build_app
        create_package
        deploy_local
        show_status
        ;;
    "help"|*)
        echo "Usage: $0 {build|package|deploy|status|cleanup|full|help}"
        echo ""
        echo "Commands:"
        echo "  build    - Build the React application"
        echo "  package  - Build and create deployment package"
        echo "  deploy   - Deploy locally using Docker"
        echo "  status   - Show container status and logs"
        echo "  cleanup  - Stop containers and clean up"
        echo "  full     - Complete build, package, and deploy process"
        echo "  help     - Show this help message"
        ;;
esac
