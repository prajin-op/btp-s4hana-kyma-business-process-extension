#!/bin/bash
kubectl get secret kyma-srv-uaa -o json > appenv.json 
domain=`kubectl get configmap -n kube-system shoot-info -ojsonpath={.data.domain}`
echo "$(jq --arg domainarg "$domain" '. += {"domain": $domainarg}' appenv.json)" > appenv.json

