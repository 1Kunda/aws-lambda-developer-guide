const AWSXRay = require('aws-xray-sdk-core')
const captureMySQL = require('aws-xray-sdk-mysql')
const mysql = captureMySQL(require('mysql'))
const AWS = require('aws-sdk')
const username = process.env.databaseUser
const password = process.env.databasePassword
const host = process.env.databaseHost
//const host = 'PROXY_HOST.REGION.rds.amazonaws.com'

exports.handler = async (event) => {
    let token = signer.getAuthToken({ username: username })
    var connection = mysql.createConnection({
      host     : host,
      user     : username,
      password : token,
      database : 'lambdadb'
    })
    console.log("## PASSWORD: " + token)
    var query = event.query
    var result
    connection.connect()

    connection.query(query, function (error, results, fields) {
      if (error) throw error
      console.log("Ran query: " + query)
      for (result in results)
        console.log(results[result])
    })

    return new Promise( ( resolve, reject ) => {
        connection.end( err => {
            if ( err )
                return reject( err )
            const response = {
                statusCode: 200,
                body: JSON.stringify(result),
            }
            resolve(response)
        })
    })
}
var signer = new AWS.RDS.Signer({
    region: process.env.AWS_REGION,
    hostname: host,
    port: 3306,
    username: username
  });


