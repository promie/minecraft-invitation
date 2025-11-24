#!/user/bin/env node
import 'source-map-support/register'
import 'dotenv/config'
import { App, StackProps } from 'aws-cdk-lib'
import { MinecraftInvitationBackendStack } from './stacks/minecraft-invitation-backend/stack'
import { CertificateStack } from './stacks/certificate/stack'
import { MinecraftInvitationFrontendStack } from './stacks/minecraft-invitation-frontend/stack'

const {
    CDK_DEPLOY_ACCOUNT = process.env.CDK_DEFAULT_ACCOUNT,
    CDK_DEPLOY_REGION = process.env.CDK_DEFAULT_REGION,
    APP_NAME = 'MinecraftInvitation',
    STAGE = process.env.NODE_ENV || 'staging',
} = process.env

const DOMAIN_NAME = process.env.DOMAIN_NAME || 'pyutasane.com'
const FRONTEND_SUBDOMAIN = process.env.FRONTEND_SUBDOMAIN || 'patrick-minecraft-invitation'

const baseProps: StackProps = {
    env: {
        account: CDK_DEPLOY_ACCOUNT,
        region: CDK_DEPLOY_REGION,
    },
}

const app = new App()

const certificateStack = new CertificateStack(app, `${APP_NAME}-certificate`, {
    ...baseProps,
    env: {
        account: CDK_DEPLOY_ACCOUNT,
        region: 'us-east-1',
    },
    domainName: DOMAIN_NAME,
    subdomains: [FRONTEND_SUBDOMAIN],
})

new MinecraftInvitationBackendStack(app, `${APP_NAME}-backend`, {
    ...baseProps,
    appName: APP_NAME,
    stage: STAGE,
})

new MinecraftInvitationFrontendStack(app, `${APP_NAME}-frontend`, {
    ...baseProps,
    appName: APP_NAME,
    stage: STAGE,
    domainName: DOMAIN_NAME,
    subdomain: FRONTEND_SUBDOMAIN,
    certificate: certificateStack.certificate,
})

