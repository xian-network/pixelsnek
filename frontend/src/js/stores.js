import { writable, get, derived } from 'svelte/store';
import { config } from './config.js'
import { newPixelFrame } from './defaults'
import {toBigNumber, isValidPixel} from "./utils";

export const released = writable(false);
export const timeToRelease = writable(Date.UTC(2021, 3, 19, 22) - new Date());

export const totalPixels = writable(256)
export const currentColor = writable(['A','B'])
// export const frames = writable([Array.from(Array(config.totalPixels)).map((v)=> v = "B")])
export const currentFrame = writable(0)
//export const frameSpeed = writable(1000)

export const walletInstalled = writable('init'); // init | installed | not_installed
export const walletInfo = writable({});
export const userAccount = writable("");
export const autoTx = writable(false);
export const stampRatio = writable(50);
export const auctions = writable([]);
export const txnInProgress = writable(false);

export const snackbars = writable([]);
export const currency = writable(0);

export const approvalAmount = writable({
    [config.masterContract]: toBigNumber(0),
    [config.auctionContract]: toBigNumber(0)
});

export const showModal = writable({data: {}, show: false});
export const tabHidden = writable();

export const tauPrice = (() => {
    let store = writable([])
    let lastCheck

    if (typeof window !== 'undefined') {
        let lsValue = localStorage.getItem('tau_price')
        if (!lsValue) store.set(0)
        else store.set(parseFloat(lsValue))

        store.subscribe(current => localStorage.setItem('tau_price', JSON.stringify(current)))

        refreshPrice()
    }

    async function refreshPrice(){
        lastCheck = new Date()
        // let priceData = await fetch('./tauPrice.json').then(res => res.json())
        store.set(0.018)
    }

    const setStore = (value) => store.set(value)


    return {
        subscribe: store.subscribe,
        get: () => get(store),
        refreshPrice,
        lastCheck
    }
})()

// Undo/Redo-enabled frame store with activeFrame
export const frameStore = (() => {
    const initialFrames = (() => {
        if (typeof window !== 'undefined') {
            let lsFrames = localStorage.getItem('saved_frames');
            if (!lsFrames) return [newPixelFrame()];
            try {
                return JSON.parse(lsFrames);
            } catch (e) {
                return [newPixelFrame()];
            }
        }
        return [newPixelFrame()];
    })();
    const initialActive = (() => {
        if (typeof window !== 'undefined') {
            let af = localStorage.getItem('active_frame');
            try {
                af = JSON.parse(af);
                if (typeof af !== 'number') af = 0;
                return af;
            } catch (e) {
                return 0;
            }
        }
        return 0;
    })();
    
    // The state is { frames: [...], active: number, undoCount: number, redoCount: number }
    let undoStack = [];
    let redoStack = [];
    // The Svelte store holds only the current state (top of undoStack)
    const { subscribe, set: _set } = writable({
        frames: initialFrames,
        active: initialActive,
        undoCount: 0,
        redoCount: 0
    });

    // Helper to emit the current state (top of undoStack)
    function emit() {
        const state = undoStack.length > 0 ? undoStack[undoStack.length - 1] : {
            frames: initialFrames,
            active: initialActive
        };
        _set({ ...state, undoCount: undoStack.length - 1, redoCount: redoStack.length });
        persist(state);
    }

    function persist(state) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('saved_frames', JSON.stringify(state.frames));
            localStorage.setItem('active_frame', JSON.stringify(state.active));
        }
    }

    function getCurrentState() {
        // Always return the top of the undo stack
        if (undoStack.length > 0) {
            return JSON.parse(JSON.stringify(undoStack[undoStack.length - 1]));
        }
        return JSON.parse(JSON.stringify({ frames: initialFrames, active: initialActive }));
    }

    function isFrameData(framedata) {
        const { frames, speed, created } = framedata;
        if (!frames || !speed || !created) return false;
        if (!Array.isArray(frames)) return false;
        for (let frame of frames) {
            if (frame.length !== 625) {
                return false;
            }
            for (let pixel of frame) {
                if (!isValidPixel(pixel)) {
                    return false;
                }
            }
        }
        return true;
    }

    // On load, push the initial state to the undo stack
    (function init() {
        const initialState = { frames: initialFrames, active: initialActive };
        undoStack = [JSON.parse(JSON.stringify(initialState))];
        redoStack = [];
        emit();
    })();

    return {
        subscribe,
        set: (newFrames, newActive) => {
            // Just update the current state, do not push to undo stack
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = { frames: newFrames, active: newActive ?? 0 };
            } else {
                undoStack = [{ frames: newFrames, active: newActive ?? 0 }];
            }
            redoStack = [];
            emit();
        },
        update: (fn) => {
            // Just update the current state, do not push to undo stack
            const curr = getCurrentState();
            const next = fn(curr);
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = next;
            } else {
                undoStack = [next];
            }
            redoStack = [];
            emit();
        },
        add: (framedata) => {
            if (!isFrameData(framedata)) return;
            const curr = getCurrentState();
            const frames = [...curr.frames, framedata];
            const active = frames.length - 1;
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = { frames, active };
            } else {
                undoStack = [{ frames, active }];
            }
            redoStack = [];
            emit();
        },
        delete: (index) => {
            const curr = getCurrentState();
            if (curr.frames.length <= 1) return; // Always keep at least one
            const frames = curr.frames.slice();
            frames.splice(index, 1);
            let active = curr.active;
            if (active >= frames.length) active = frames.length - 1;
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = { frames, active };
            } else {
                undoStack = [{ frames, active }];
            }
            redoStack = [];
            emit();
        },
        load: (index) => {
            const curr = getCurrentState();
            let active = index;
            if (active < 0) active = 0;
            if (active >= curr.frames.length) active = curr.frames.length - 1;
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = { frames: curr.frames, active };
            } else {
                undoStack = [{ frames: curr.frames, active }];
            }
            redoStack = [];
            emit();
        },
        setActive: (index) => {
            const curr = getCurrentState();
            let active = index;
            if (active < 0) active = 0;
            if (active >= curr.frames.length) active = curr.frames.length - 1;
            if (undoStack.length > 0) {
                undoStack[undoStack.length - 1] = { frames: curr.frames, active };
            } else {
                undoStack = [{ frames: curr.frames, active }];
            }
            redoStack = [];
            emit();
        },
        get: () => getCurrentState(),
        snapshot: () => {
            // Only push to the undo stack if the new state is different from the last
            const curr = getCurrentState();
            const last = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;
            if (!last || JSON.stringify(curr) !== JSON.stringify(last)) {
                undoStack.push(JSON.parse(JSON.stringify(curr)));
                redoStack = [];
                emit();
            }
        },
        undo: () => {
            if (undoStack.length > 1) {
                const popped = undoStack.pop();
                redoStack.push(popped);
                emit();
            }
        },
        redo: () => {
            if (redoStack.length > 0) {
                const redone = redoStack.pop();
                undoStack.push(redone);
                emit();
            }
        },
        canUndo: () => undoStack.length > 1,
        canRedo: () => redoStack.length > 0,
    };
})();

export const currentTool = (() => {
    let store = writable('fill')
    if (typeof window !== 'undefined') {
        let lsToolValue = localStorage.getItem('current_tool')
        if (lsToolValue) store.set(lsToolValue)

        store.subscribe(current => {
            let currentLsValue = localStorage.getItem('current_tool')
            if (!currentLsValue) currentLsValue = null

            if (current !== currentLsValue) {
                localStorage.setItem('current_tool', current)
            }
        })
    }

    const setStore = (value) => store.set(value)

    return {
        subscribe: store.subscribe,
        get: () => get(store),
        set: setStore,
    }
})()

export const brushSize = (() => {
    let store = writable('fill')
    if (typeof window !== 'undefined') {
        let lsValue = localStorage.getItem('brush_size')
        if (!lsValue) lsValue = 1
        if (lsValue) store.set(parseInt(lsValue))

        store.subscribe(current => {
            let currentLsValue = localStorage.getItem('brush_size')
            if (!currentLsValue) currentLsValue = null

            if (current !== currentLsValue) {
                localStorage.setItem('brush_size', current)
            }
        })
    }

    const setStore = (value) => store.set(value)

    return {
        subscribe: store.subscribe,
        get: () => get(store),
        set: setStore,
    }
})()

export const frames = derived(
    frameStore, $frameStore => {
        if (!$frameStore || !$frameStore.frames || typeof $frameStore.active !== 'number') return newPixelFrame().frames;
        let framesValue = $frameStore.frames[$frameStore.active];
        if (!framesValue) return newPixelFrame().frames;
        return framesValue.frames;
    }
);
export const frameSpeed = derived(
    frameStore, $frameStore => {
        if (!$frameStore || !$frameStore.frames || typeof $frameStore.active !== 'number') return newPixelFrame().speed;
        let framesValue = $frameStore.frames[$frameStore.active];
        if (!framesValue) return newPixelFrame().speed;
        return framesValue.speed;
    }
);