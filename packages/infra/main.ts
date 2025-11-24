#!/user/bin/env node
import 'source-map-support/register'
import 'dotenv/config'
import { App, StackProps } from 'aws-cdk-lib'
import { MinecraftInvitationBackendStack } from './stacks/minecraft-invitation-backend/stack'

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

new MinecraftInvitationBackendStack(app, `${APP_NAME}-backend`, {
    ...baseProps,
    appName: APP_NAME,
    stage: STAGE,
})

