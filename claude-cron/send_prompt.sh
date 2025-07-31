#!/bin/bash
# Auto-generated Claude Code CLI cron script
# Created: Wed Jul 30 11:22:02 PM -03 2025
# Scheduled for: 2025-07-31 at 1:30

PROMPT="actualiza el documento claude.md con un analisis exaustivo del proyecto actual, guarda todo en un archivo que puedas leer mas adelante, algo como claude+[la fecha y hora actual].md, si ya hay archivos claude de este estilo tenlos en cuenta en tu plan, no modifiques ninguna parte del codigo, solo haz el plan en vase a lo que sabes y crea el archivo"
LOG_FILE="/data/Development/Projects/portfolio//claude-cron/claude_cron.log"
SCRIPT_PATH="/data/Development/Projects/portfolio//claude-cron/send_prompt.sh"
PROMPT_FILE="/data/Development/Projects/portfolio//claude-cron/prompt.txt"

execute_claude_code() {
    echo "🚀 $(date): Starting Claude Code CLI session..." >> "$LOG_FILE"
    echo "📁 Working directory: $(pwd)" >> "$LOG_FILE"
    echo "💬 Prompt: $PROMPT" >> "$LOG_FILE"
    echo "🔧 Plan Mode: ENABLED" >> "$LOG_FILE"
    echo "🛠️  Tools Available: Bash, Read, Write, Edit, Grep, etc." >> "$LOG_FILE"
    echo "================================================" >> "$LOG_FILE"
    
    # Crear archivo temporal con el prompt
    echo "$PROMPT" > "$PROMPT_FILE"
    
    # Ejecutar Claude Code CLI con el prompt
    # Usar timeout para evitar sesiones infinitas (30 minutos max)
    timeout 1800 claude --no-confirm < "$PROMPT_FILE" >> "$LOG_FILE" 2>&1
    local exit_code=$?
    
    if [[ $exit_code -eq 0 ]]; then
        echo "✅ $(date): Claude Code CLI session completed successfully" >> "$LOG_FILE"
    elif [[ $exit_code -eq 124 ]]; then
        echo "⏰ $(date): Claude Code CLI session timed out after 30 minutes" >> "$LOG_FILE"
    else
        echo "❌ $(date): Claude Code CLI session failed with exit code: $exit_code" >> "$LOG_FILE"
    fi
    
    # Limpiar archivo temporal
    rm -f "$PROMPT_FILE"
    
    echo "================================================" >> "$LOG_FILE"
    echo "🗑️  $(date): Auto-removing cron job..." >> "$LOG_FILE"
    
    # Auto-eliminar cron después de ejecutarse
    crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH" | crontab -
    echo "✅ $(date): Cron job auto-removed successfully" >> "$LOG_FILE"
    echo "================================================" >> "$LOG_FILE"
}

# Cambiar al directorio especificado
cd "/data/Development/Projects/portfolio/" || {
    echo "❌ $(date): Failed to change to directory /data/Development/Projects/portfolio/" >> "$LOG_FILE"
    exit 1
}

# Ejecutar función principal
execute_claude_code
