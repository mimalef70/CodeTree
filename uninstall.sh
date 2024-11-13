#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Error handling
set -e

echo "Uninstalling CodeTree..."

# Remove installation directory
if [ -d "$HOME/.codetree" ]; then
    rm -rf "$HOME/.codetree"
fi

# Remove executable
if [ -f "/usr/local/bin/codetree" ]; then
    if [ ! -w "/usr/local/bin" ]; then
        echo -e "${RED}❌ Error: Need sudo permission to remove executable${NC}"
        echo "Please run: sudo $0"
        exit 1
    fi
    rm -f "/usr/local/bin/codetree"
fi

echo -e "${GREEN}✔ CodeTree has been successfully uninstalled!${NC}"