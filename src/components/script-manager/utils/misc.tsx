export async function convertBinaryToText(script: any) {
    return await new Blob([new Uint8Array(script) ?? null])?.text() ?? ''
}

export async function convertTextToBinary(script: string) {
    const blob = new Blob([script]);
    return blob;
}