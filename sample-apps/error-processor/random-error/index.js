var AWSXRay = require('aws-xray-sdk-core')
var aws = AWSXRay.captureAWS(require('aws-sdk'))

var Chance = require('chance')
var lambda = new aws.Lambda()

var myFunction = async function(event, context) {
  var chance = new Chance()
  var name = chance.first()
  var roll1 = chance.integer({ min: 1, max: 1/event["error-rate"] })
  var roll2 = chance.integer({ min: 1, max: 1/event["error-rate"] })

  var guid = chance.guid()
  console.log("## EVENT: " + JSON.stringify(event, null, 2))
  console.log("GUID: " + guid)
  console.log("Name: " + name)
  console.log("Roll 1: " + roll1)
  console.log("Roll 2: " + roll2)

  AWSXRay.captureFunc('annotations', function(subsegment){
    subsegment.addAnnotation('name', name)
    //subsegment.addAnnotation('roll1', roll1)
    //subsegment.addAnnotation('roll2', roll2)
    subsegment.addAnnotation('request_id', context.awsRequestId)
  })

  if (roll1 == roll2) {
    var error = new Error("Bad roll")
    console.log("ERROR")
    throw error
  }

  return await lambda.invoke({ FunctionName: context.functionName, Payload: JSON.stringify(event)}).promise()
}

exports.handler = myFunction