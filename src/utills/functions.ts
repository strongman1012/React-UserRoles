// Generate UUID
export const generateUUID = (length: number, ids: (string | number)[]): string => {
    let uuid = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    do {
        // Generate the UUID
        uuid = '';
        for (let i = 0; i < length; i++) {
            uuid += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        // Check if the UUID already exists in scriptList
    } while (ids.includes(uuid));

    return uuid;
}

export const UniqueId = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    const loopLength = length < 5 ? 0 : length - 5;

    for (let i = 0; i < loopLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const timestamp = Date.now().toString();
    const lastFive = timestamp.substring(timestamp.length - 5);
    return result + '-' + lastFive;
}