import { AntennaDetails, ModDemodDetails, PlatformDetails, RfFrontEndDetails, ServiceDetails } from "./types/networkLibrary";

export type NetworkObject = PlatformDetails | AntennaDetails | RfFrontEndDetails | ModDemodDetails | null;

export function getObjectType(o: NetworkObject): "PLATFORM" | "ANTENNA" | "RFFRONTEND" | "MODDEMOD" | null {
    if (o == null)
        return null;
    if ('altitude' in o)
        return "PLATFORM";
    if ('antennaSize' in o)
        return 'ANTENNA';
    if ('centerFrequency' in o)
        return 'RFFRONTEND';
    if ('modulationType' in o)
        return 'MODDEMOD';
    else
        return null;
}

export class Transceiver {
    antenna: AntennaDetails;
    rffrontend: RfFrontEndDetails | null;
    moddemod: ModDemodDetails | null;
    constructor({ antenna, rffrontend, moddemod }: { antenna: AntennaDetails, rffrontend: RfFrontEndDetails | null, moddemod: ModDemodDetails | null }) {
        this.antenna = antenna;
        this.rffrontend = rffrontend;
        this.moddemod = moddemod;
    }
}

export class Service {
    link: ServiceDetails;
    transceivers: Transceiver[];
    id: number;

    constructor(link: ServiceDetails) {
        this.id = link.id;
        this.link = link;
        const isTx = link.forward;
        const antennas = new Map<number, AntennaDetails>();
        const rfs = new Map<number, RfFrontEndDetails>();
        const mods = new Map<number, ModDemodDetails>();
        const segs = [...this.link.segments];
        const transceiverFrames = (isTx ? segs.reverse() : segs).reduce<{ antennaId: number, rfId: number | null, modId: number | null }[]>((frameArr, cv) => {
            const antId = cv.parentAntennaId;
            const fIdx = frameArr.findIndex(t => t.antennaId === antId)
            const frame = frameArr[fIdx] ?? { antennaId: antId, rfId: null, modId: null };
            const type = getObjectType(cv.object);
            const id = cv.object?.id;
            let newFrame = frame;
            switch (type) {
                case 'PLATFORM':
                    console.warn(`Found a platform (${id}) in link ${link.id}`);
                    break;
                case 'ANTENNA':
                    if (id != null && cv.object != null) antennas.set(id, (cv.object as AntennaDetails));
                    newFrame = { ...frame, antennaId: id ?? antId };
                    break;
                case 'RFFRONTEND':
                    if (id != null && cv.object != null) rfs.set(id, (cv.object as RfFrontEndDetails));
                    newFrame = { ...frame, rfId: id ?? null };
                    break;
                case 'MODDEMOD':
                    if (id != null && cv.object != null) mods.set(id, (cv.object as ModDemodDetails));
                    newFrame = { ...frame, modId: id ?? null };
                    break;
            }


            if (fIdx === -1)
                return [...frameArr, newFrame];
            else
                return [...frameArr.slice(0, fIdx), newFrame].concat(frameArr.slice(fIdx + 1));
        }, ([] as { antennaId: number, rfId: number | null, modId: number | null }[]));
        const tranceivers = transceiverFrames.map(tf => {
            const antenna = antennas.get(tf.antennaId);
            const rffrontend = tf.rfId ? rfs.get(tf.rfId) ?? null : null;
            const moddemod = tf.modId ? mods.get(tf.modId) ?? null : null;

            if (antenna == null) {
                console.warn(`Missing antenna!`)
                return null;
            }

            return new Transceiver({
                antenna,
                rffrontend,
                moddemod
            });
        });
        const noNullTs = (tranceivers.filter(t => t != null) as Transceiver[]);
        this.transceivers = isTx ? noNullTs.reverse() : noNullTs;
    }

    getNthTransceiver(n: number) {
        return this.transceivers[n] ?? null;
    }

    getLength() {
        return this.transceivers.length;
    }

    getId() {
        return this.id;
    }

    getInfo(): ServiceDetails {
        return this.link;
    }

}