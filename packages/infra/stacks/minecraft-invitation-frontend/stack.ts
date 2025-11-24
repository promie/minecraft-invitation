import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { FrontendHostingConstruct } from './constructs/hosting.construct'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'

export type MinecraftInvitationFrontendStackProps = StackProps & {
    appName: string
    stage: string
    domainName?: string
    subdomain?: string
    certificate?: acm.ICertificate
}

export class MinecraftInvitationFrontendStack extends Stack {
    constructor(scope: Construct, id: string, props: MinecraftInvitationFrontendStackProps) {
        super(scope, id, props)

        const { appName, stage, domainName, subdomain, certificate } = props

        const frontend = new FrontendHostingConstruct(this, 'Frontend', {
            appName,
            stage,
            domainName,
            subdomain,
            certificate,
        })

        const frontendUrl = frontend.customDomain
            ? `https://${frontend.customDomain}`
            : `https://${frontend.distribution.distributionDomainName}`

        new CfnOutput(this, 'FrontendUrl', {
            value: frontendUrl,
            description: 'Frontend URL',
        })

        new CfnOutput(this, 'FrontendBucket', {
            value: frontend.bucket.bucketName,
            description: 'Frontend S3 Bucket',
        })

        if (frontend.customDomain) {
            new CfnOutput(this, 'CustomDomain', {
                value: frontend.customDomain,
                description: 'Custom Domain',
            })
        }

        new CfnOutput(this, 'CloudFrontUrl', {
            value: `https://${frontend.distribution.distributionDomainName}`,
            description: 'CloudFront Distribution URL',
        })
    }
}