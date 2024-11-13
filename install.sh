#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Error handling
set -e

# Check for required commands
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ Error: $1 is not installed${NC}"
        exit 1
    fi
}

check_command "node"
check_command "npm"

# Version checks
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [[ "${NODE_VERSION%%.*}" -lt 12 ]]; then
    echo -e "${RED}❌ Error: Node.js version 12 or higher is required${NC}"
    exit 1
fi

echo -e "${BLUE}Installing CodeTree...${NC}"

# Create the installation directory
INSTALL_DIR="$HOME/.codetree"
mkdir -p "$INSTALL_DIR"

# Copy files
echo -e "${BLUE}Copying files...${NC}"
cp codetree.js "$INSTALL_DIR/"
cp package.json "$INSTALL_DIR/"

# Create the executable script
echo -e "${BLUE}Creating executable...${NC}"
EXECUTABLE="/usr/local/bin/codetree"

# Check if we have write permission
if [ ! -w "$(dirname "$EXECUTABLE")" ]; then
    echo -e "${RED}❌ Error: Need sudo permission to create executable${NC}"
    echo "Please run: sudo $0"
    exit 1
fi

cat > "$EXECUTABLE" << 'EOF'
#!/usr/bin/env node

const path = require('path');
const scriptPath = path.join(process.env.HOME, '.codetree/codetree.js');
require(scriptPath);
EOF

chmod +x "$EXECUTABLE"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
cd "$INSTALL_DIR"
npm install --production --quiet

# Add to PATH if needed
for SHELL_RC in ".bashrc" ".zshrc"; do
    if [ -f "$HOME/$SHELL_RC" ]; then
        if ! grep -q "/usr/local/bin" "$HOME/$SHELL_RC"; then
            echo 'export PATH="/usr/local/bin:$PATH"' >> "$HOME/$SHELL_RC"
        fi
    fi
done

# Final message
echo -e "${GREEN}✔ CodeTree has been successfully installed!${NC}"
echo -e "${BLUE}You can now use 'codetree' command in any directory.${NC}"
echo -e "${BLUE}Example: codetree .${NC}"

# Suggest shell restart
echo -e "${BLUE}Note: You may need to restart your terminal or run:${NC}"
echo -e "${BLUE}source ~/.bashrc${NC} or ${BLUE}source ~/.zshrc${NC}"