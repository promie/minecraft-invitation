import { Duration } from 'aws-cdk-lib'
import * as apigateway from 'aws-cdk-lib/aws-apigateway'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { Construct } from 'constructs'
import { StandardLambda } from '../../../../common/StandardLambda'
import * as path from 'path'

export type RsvpApiConstructProps = {
  appName: string
  stage: string
  rsvpTable: dynamodb.Table
  domainName?: string
  apiSubdomain?: string
  certificate?: acm.ICertificate
}

export class RsvpApiConstruct extends Construct {
  public readonly api: apigateway.RestApi
  public readonly getRsvpHandler: lambda.Function
  public readonly postRsvpHandler: lambda.Function
  public readonly apiUrl: string

  constructor(scope: Construct, id: string, props: RsvpApiConstructProps) {
    super(scope, id)

    const { appName, stage, rsvpTable, domainName, apiSubdomain, certificate } =
      props

    this.getRsvpHandler = new StandardLambda(this, 'GetRsvpHandler', {
      appName,
      entry: path.join(
        __dirname,
        '../../../../app/src/minecraft-invitation/handlers/getRSVP/getRSVP.handler.ts',
      ),
      handler: 'handler',
      memorySize: 256,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: rsvpTable.tableName,
      },
    })

    rsvpTable.grantReadData(this.getRsvpHandler)

    this.postRsvpHandler = new StandardLambda(this, 'PostRsvpHandler', {
      appName,
      entry: path.join(
        __dirname,
        '../../../../app/src/minecraft-invitation/handlers/postRSVP/postRSVP.handler.ts',
      ),
      handler: 'handler',
      memorySize: 256,
      timeout: Duration.seconds(30),
      environment: {
        TABLE_NAME: rsvpTable.tableName,
      },
    })

    rsvpTable.grantReadWriteData(this.postRsvpHandler)

    // Determine allowed origins for CORS
    const allowedOrigins =
      certificate && domainName && apiSubdomain
        ? [`https://${apiSubdomain}.${domainName}`]
        : apigateway.Cors.ALL_ORIGINS

    // Create API Gateway REST API
    this.api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: `${appName}-api-${stage}`,
      description: `API for ${appName}`,
      defaultCorsPreflightOptions: {
        allowOrigins: allowedOrigins,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'x-device-id',
        ],
        allowCredentials: true,
      },
      deployOptions: {
        stageName: stage,
      },
    })

    // Set API URL - use custom domain if available, otherwise use default
    if (certificate && domainName && apiSubdomain) {
      this.apiUrl = `https://${apiSubdomain}.${domainName}`
    } else {
      this.apiUrl = this.api.url
    }

    const rsvp = this.api.root.addResource('rsvp')

    // /rsvp endpoint
    rsvp.addMethod('GET', new apigateway.LambdaIntegration(this.getRsvpHandler))

    rsvp.addMethod(
      'POST',
      new apigateway.LambdaIntegration(this.postRsvpHandler),
    )
  }
}
