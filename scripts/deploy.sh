#!/bin/bash

# Srow Deployment Script
# This script handles the build and deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate environment
validate_environment() {
    print_status "Validating environment..."
    
    # Check if Node.js is installed
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required"
        exit 1
    fi
    
    print_success "Environment validation passed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Run linting
    print_status "Running ESLint..."
    npm run lint
    
    # Run type checking
    print_status "Running TypeScript type check..."
    npm run type-check
    
    # Run unit tests
    print_status "Running unit tests..."
    npm run test:coverage
    
    # Run E2E tests (optional, can be skipped for faster deployment)
    if [ "$SKIP_E2E" != "true" ]; then
        print_status "Running E2E tests..."
        npm run test:e2e
    else
        print_warning "Skipping E2E tests"
    fi
    
    print_success "All tests passed"
}

# Function to build application
build_application() {
    print_status "Building application..."
    
    # Clean previous build
    if [ -d ".next" ]; then
        rm -rf .next
    fi
    
    # Build the application
    npm run build
    
    print_success "Application built successfully"
}

# Function to deploy to Firebase
deploy_firebase() {
    print_status "Deploying to Firebase..."
    
    if ! command_exists firebase; then
        print_error "Firebase CLI is not installed. Please install it with: npm install -g firebase-tools"
        exit 1
    fi
    
    # Check if user is logged in
    if ! firebase projects:list >/dev/null 2>&1; then
        print_error "Not logged in to Firebase. Please run: firebase login"
        exit 1
    fi
    
    # Deploy to Firebase
    firebase deploy
    
    print_success "Deployed to Firebase successfully"
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI is not installed. Please install it with: npm install -g vercel"
        exit 1
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    print_success "Deployed to Vercel successfully"
}

# Function to analyze bundle
analyze_bundle() {
    print_status "Analyzing bundle..."
    
    npm run analyze
    
    print_success "Bundle analysis completed"
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -e, --environment ENV   Set deployment environment (staging|production)"
    echo "  -p, --platform PLATFORM Set deployment platform (firebase|vercel)"
    echo "  --skip-e2e              Skip E2E tests for faster deployment"
    echo "  --analyze               Run bundle analysis after build"
    echo "  --dry-run               Run all checks without deploying"
    echo ""
    echo "Examples:"
    echo "  $0 --environment staging --platform firebase"
    echo "  $0 --environment production --platform vercel --analyze"
    echo "  $0 --dry-run"
}

# Main script
main() {
    # Default values
    ENVIRONMENT="staging"
    PLATFORM="firebase"
    SKIP_E2E="false"
    ANALYZE="false"
    DRY_RUN="false"
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -p|--platform)
                PLATFORM="$2"
                shift 2
                ;;
            --skip-e2e)
                SKIP_E2E="true"
                shift
                ;;
            --analyze)
                ANALYZE="true"
                shift
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    print_status "Starting deployment process..."
    print_status "Environment: $ENVIRONMENT"
    print_status "Platform: $PLATFORM"
    
    # Validate environment
    validate_environment
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build application
    build_application
    
    # Analyze bundle if requested
    if [ "$ANALYZE" = "true" ]; then
        analyze_bundle
    fi
    
    # Deploy if not dry run
    if [ "$DRY_RUN" = "false" ]; then
        case $PLATFORM in
            firebase)
                deploy_firebase
                ;;
            vercel)
                deploy_vercel
                ;;
            *)
                print_error "Unsupported platform: $PLATFORM"
                exit 1
                ;;
        esac
    else
        print_warning "Dry run completed - no deployment performed"
    fi
    
    print_success "Deployment process completed successfully!"
}

# Run main function with all arguments
main "$@" 