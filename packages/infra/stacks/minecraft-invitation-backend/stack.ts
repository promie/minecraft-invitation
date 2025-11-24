import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import { DynamoConstruct } from './constructs/storage/dynamo.construct'
import { RsvpApiConstruct } from './constructs/handlers/rsvpApi.construct'

export type MinecraftInvitationBackendStackProps = StackProps & {
  appName: string
  stage: string
  domainName?: string
  apiSubdomain?: string
  certificate?: acm.ICertificate
}

export class MinecraftInvitationBackendStack extends Stack {
  public readonly apiUrl: string

  constructor(
    scope: Construct,
    id: string,
    props: MinecraftInvitationBackendStackProps,
  ) {
    super(scope, id, props)

    const { appName, stage, domainName, apiSubdomain, certificate } = props

    // Create DynamoDB table
    const storage = new DynamoConstruct(this, 'Storage', {
      appName,
      stage,
    })

    // Create RSVP API (StandardRestApi already handles domain creation)
    const api = new RsvpApiConstruct(this, 'Api', {
      appName,
      stage,
      rsvpTable: storage.rsvpTable,
      domainName,
      apiSubdomain,
      certificate,
    })

    this.apiUrl = api.apiUrl

    // Outputs
    new CfnOutput(this, 'ApiUrl', {
      value: this.apiUrl,
      description: 'API Gateway URL',
    })

    new CfnOutput(this, 'ApiId', {
      value: api.api.restApiId,
      description: 'API Gateway ID',
    })

    new CfnOutput(this, 'TableName', {
      value: storage.rsvpTable.tableName,
      description: 'DynamoDB Table Name',
    })

    if (domainName && apiSubdomain) {
      new CfnOutput(this, 'CustomDomain', {
        value: `${apiSubdomain}.${domainName}`,
        description: 'API Custom Domain',
      })
    }
  }
}
