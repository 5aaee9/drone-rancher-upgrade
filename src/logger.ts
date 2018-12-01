import * as log4js from 'log4js'

export function getLogger(): log4js.Logger {
    const logger = log4js.getLogger('drone-rancher-upgrade')
    logger.level = 'debug'

    return logger
}
