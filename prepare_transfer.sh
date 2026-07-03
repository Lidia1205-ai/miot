#!/bin/bash

# Configuration
ARCHIVE_NAME="MIOT_Project_Transfer_$(date +%Y%m%d_%H%M%S).zip"
CONTEXT_FILE="PROJECT_CONTEXT.md"
EXCLUDE_LIST=(".git" ".DS_Store" "node_modules" "$ARCHIVE_NAME" "prepare_transfer.sh")

echo "🚀 Starting Project Transfer Preparation..."

# 1. Update Context File with latest Git Info
echo "📝 Updating project context with latest git history..."
if [ -d .git ]; then
    echo -e "\n## LATEST GIT HISTORY (Automatic)" >> $CONTEXT_FILE
    git log -n 5 --oneline >> $CONTEXT_FILE
fi

# 2. Add current modifications summary
echo "🔍 Scanning for uncommitted changes..."
if [ -d .git ]; then
    echo -e "\n## CURRENT MODIFICATIONS" >> $CONTEXT_FILE
    git status -s >> $CONTEXT_FILE
fi

# 3. Create Archive
echo "📦 Creating archive: $ARCHIVE_NAME..."
# Using zip with -x to exclude files
# We include media by default unless user adds flags, but for now we include everything except internal stuff
zip -r "$ARCHIVE_NAME" . -x "${EXCLUDE_LIST[@]}" "*/.DS_Store"

if [ $? -eq 0 ]; then
    echo "✅ Success! Project packaged into $ARCHIVE_NAME"
    echo "📄 Content includes $CONTEXT_FILE for AI handoff."
    echo ""
    echo "👉 TO RESTORE ON NEW DEVICE:"
    echo "1. Unzip the file."
    echo "2. Open the project in your IDE."
    echo "3. Feed 'PROJECT_CONTEXT.md' to your AI assistant to resume immediately."
else
    echo "❌ Error: Failed to create archive."
    exit 1
fi
