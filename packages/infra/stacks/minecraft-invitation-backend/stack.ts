import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export type MinecraftInvitationBackendStackProps = StackProps & {
    appName: string
    stage: string
}

export class MinecraftInvitationBackendStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        props: MinecraftInvitationBackendStackProps,
    ) {
        super(scope, id, props)

        const { appName, stage } = props
    }
}