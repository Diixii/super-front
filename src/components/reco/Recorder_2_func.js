import { register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

export const Recorder_2_func = async () => {
    await register(await connect());
}