#!/usr/bin/env bash
#
# Flood/Rate-Limit Test — simula ataque de spam aos formulários públicos.
#
# Uso:
#   ./scripts/flood-test.sh [--count N] [--type contact|prayer] [--delay MS]
#
# Exemplos:
#   ./scripts/flood-test.sh --count 500 --type contact
#   ./scripts/flood-test.sh --count 1000 --type prayer --delay 0
#
# ⚠️  APENAS PARA TESTE. Valida se rate limiting está ativo.
#

set -euo pipefail

SUPABASE_URL="https://rzlacnuwrzxvlprwfohm.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bGFjbnV3cnp4dmxwcndmb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODc4MTksImV4cCI6MjA4ODU2MzgxOX0.Bp_j6X77ed8ey8QcaSGT7TYvz4KyiPOICQ2lp_N7EZQ"

COUNT=100
TYPE="contact"
DELAY_MS=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --count) COUNT="$2"; shift 2 ;;
    --type) TYPE="$2"; shift 2 ;;
    --delay) DELAY_MS="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ "$TYPE" == "prayer" ]]; then
  TABLE="pedidos_oracao"
  PAYLOAD_TEMPLATE='{"nome":"Flood Test %s","pedido":"Test flood of %d requests for scalability validation."}'
else
  TABLE="contatos"
  PAYLOAD_TEMPLATE='{"nome":"Flood Test %s","email":"flood_%s@test.com","interesse":"Outro","mensagem":"Test flood of %d requests for scalability validation."}'
fi

ENDPOINT="${SUPABASE_URL}/rest/v1/${TABLE}"

echo "============================================"
echo "  Flood Test — ${TABLE}"
echo "  Requests: ${COUNT}"
echo "  Delay:    ${DELAY_MS}ms"
echo "============================================"
echo

SUCCESS=0
FAILED=0
START=$(date +%s%N)

for i in $(seq 1 "$COUNT"); do
  SUFFIX=$(date +%s)_${i}
  
  if [[ "$TYPE" == "prayer" ]]; then
    DATA=$(printf "$PAYLOAD_TEMPLATE" "$SUFFIX" "$COUNT")
  else
    DATA=$(printf "$PAYLOAD_TEMPLATE" "$SUFFIX" "$SUFFIX" "$COUNT")
  fi

  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$ENDPOINT" \
    -H "Content-Type: application/json" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -d "$DATA" \
    --connect-timeout 5 \
    --max-time 10)

  if [[ "$HTTP_CODE" == "201" ]] || [[ "$HTTP_CODE" == "200" ]]; then
    ((SUCCESS++))
  else
    ((FAILED++))
    echo "  [${i}/${COUNT}] HTTP ${HTTP_CODE} — REJECTED"
  fi

  if [[ "$DELAY_MS" -gt 0 ]]; then
    sleep "$(echo "scale=3; ${DELAY_MS}/1000" | bc)"
  fi

  if [[ $((i % 10)) -eq 0 ]]; then
    echo "  [${i}/${COUNT}] OK: ${SUCCESS}  REJECTED: ${FAILED}"
  fi
done

END=$(date +%s%N)
DURATION_MS=$(( (END - START) / 1000000 ))

echo
echo "============================================"
echo "  Results"
echo "============================================"
echo "  Duration:  ${DURATION_MS}ms ($(( DURATION_MS / 1000 ))s)"
echo "  Success:   ${SUCCESS}"
echo "  Rejected:  ${FAILED}"
echo "  Rate:      $(( COUNT * 1000 / (DURATION_MS + 1) )) req/s"

if [[ "$FAILED" -eq 0 ]]; then
  echo
  echo "  ❌ CRITICAL: No rate limiting detected!"
  echo "     All ${COUNT} requests were accepted."
  echo "     An attacker can trivially flood this endpoint."
elif [[ "$FAILED" -lt "$(( COUNT / 2 ))" ]]; then
  echo
  echo "  ⚠️  Partial rate limiting detected."
  echo "     ${FAILED}/${COUNT} were rejected."
else
  echo
  echo "  ✅ Rate limiting appears active."
  echo "     ${FAILED}/${COUNT} were rejected."
fi
echo