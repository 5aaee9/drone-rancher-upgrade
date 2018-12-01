export function sleep(time: number): Promise<void> {
    return new Promise((res, _) => {
        setTimeout(res, time)
    })
}
