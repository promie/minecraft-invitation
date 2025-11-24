import { RemovalPolicy } from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

export type DynamoConstructProps = {
  appName: string
  stage: string
}

export class DynamoConstruct extends Construct {
  public readonly rsvpTable: dynamodb.Table

  constructor(scope: Construct, id: string, props: DynamoConstructProps) {
    super(scope, id)

    const { appName, stage } = props

    this.rsvpTable = new dynamodb.Table(this, 'RsvpTable', {
      tableName: `${appName}-rsvp-${stage}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      pointInTimeRecovery: false,
    })
  }
}
