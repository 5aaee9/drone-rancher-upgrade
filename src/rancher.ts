import axios from 'axios'

export type RancherConfig = {
    accessToken: string,
    screctToken: string,
    serviceId: string,
    envName: string,

    endPoint: string
}


export enum State {
    ACTIVE = "active",
    UPGRADTING = "upgrading",
    UPGRADED = "upgraded"
}

export class Rancher {
    private config: RancherConfig = null
    constructor(config: RancherConfig) {
        this.config = config
    }

    private getClient() {
        const instance = axios.create({
            auth: {
                username: this.config.accessToken,
                password: this.config.screctToken
            },
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            baseURL: `https://${this.config.endPoint}/v2-beta/projects/${this.config.envName}/services/${this.config.serviceId}`
        })

        return instance
    }

    async sendUpgrade() {
        const client = this.getClient()
        const updateInfo = await client.post('?action=update', '{}')

        const serviceInfo = updateInfo.data.upgrade
        client.post('?action=upgrade', JSON.stringify(serviceInfo))
    }

    async getServiceState(): Promise<State> {
        const client = this.getClient()
        const info = await client.get('')
        return info.data.state
    }

    async finishUpgrade() {
        const client = this.getClient()

        await client.post('?action=finishupgrade', '')
    }
}
