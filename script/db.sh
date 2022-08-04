#!/bin/bash
set -e
cd "$(dirname "$(dirname "$0")")"

NAME="caphana"
SECRET_HEADER="$(cat <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: $NAME
type: Opaque
stringData:
  type: db
  label: hana
  plan: hdi-shared
  tags: "[ db ]"
EOF
)"
cf service $NAME || cf create-service hana hdi-shared $NAME
while true; do
    STATUS="$(cf service $NAME | grep status:)"
    echo $STATUS
    if [[ "$STATUS" = *succeeded* ]]; then
        break
    fi
    sleep 1
done
cf create-service-key $NAME $NAME-key
node "$(dirname "$0")/format-kyma-secret.js" -- "$(echo "$SECRET_HEADER")" "$(cf service-key $NAME $NAME-key)" | kubectl apply -f -
exit 0

