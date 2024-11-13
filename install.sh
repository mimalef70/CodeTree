#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Installing CodeTree...${NC}"

# Create the installation directory
INSTALL_DIR="$HOME/.codetree"
mkdir -p "$INSTALL_DIR"

# Copy the main script
cp codetree.js "$INSTALL_DIR/"

# Create the executable script
cat > /usr/local/bin/codetree << 'EOF'
#!/usr/bin/env node

const path = require('path');
const scriptPath = path.join(process.env.HOME, '.codetree/codetree.js');
require(scriptPath);
EOF

# Make it executable
chmod +x /usr/local/bin/codetree

# Install dependencies
npm install --prefix "$INSTALL_DIR"

# Add to PATH if not already there
if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
    echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
    echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
fi

echo -e "${GREEN}✔ CodeTree has been successfully installed!${NC}"
echo -e "${BLUE}You can now use 'codetree' command in any directory.${NC}"
echo -e "${BLUE}Example: codetree .${NC}"
