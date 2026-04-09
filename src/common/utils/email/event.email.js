import { EventEmitter } from 'node:events';

export const emailEvent = new EventEmitter({});

emailEvent.on('sendEmailOtp', async (fn) =>{
    try {
        await fn();
    } catch (error) {
        console.log(`Fail in email event ${error}`);
    }
})