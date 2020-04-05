#!/bin/bash
ERROR_FUNCTION=$(aws cloudformation describe-stack-resource --stack-name error-processor --logical-resource-id randomerror --query 'StackResourceDetail.PhysicalResourceId' --output text)

while true; do
  aws lambda invoke --function-name $ERROR_FUNCTION --payload file://event.json out.json
  cat out.json
  echo ""
  sleep 2
done