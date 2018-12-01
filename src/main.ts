import { getLogger } from "./logger";
import { RancherConfig, Rancher, State } from "./rancher";
import { sleep } from "./time";

const {
    PLUGIN_URL,
    PLUGIN_SERVICE,
    PLUGIN_ACCESS_TOKEN,
    PLUGIN_SCRECT_TOKEN,
    PLUGIN_ENV,
    DRONE_COMMIT_MESSAGE
} = process.env

const logger = getLogger()

async function main() {
    if (DRONE_COMMIT_MESSAGE.indexOf('ci deploy') !== -1) {
        logger.info('detect commit name with ci deploy, start deploy')

        const config: RancherConfig = {
            accessToken: PLUGIN_ACCESS_TOKEN,
            endPoint: PLUGIN_URL,
            screctToken: PLUGIN_SCRECT_TOKEN,
            envName: PLUGIN_ENV,
            serviceId: PLUGIN_SERVICE
        }

        const client = new Rancher(config)
        logger.info('wait service goto active state')
        while (await client.getServiceState() !== State.ACTIVE) {
            await sleep(2000)
        }

        await client.sendUpgrade()
        logger.info('sent upgrade request')

        logger.info('wait service goto active state')
        while (await client.getServiceState() !== State.UPGRADED) {
            await sleep(2000)
        }

        await client.finishUpgrade()

        logger.info('upgrade finish')
    } else {
        logger.info('commit without building message, skip')
    }
}

main()
