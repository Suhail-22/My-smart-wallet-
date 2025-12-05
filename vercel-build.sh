#!/bin/bash
# vercel-build.sh
npm ci --only=production
npm run build