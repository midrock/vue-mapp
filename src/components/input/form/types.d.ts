import VueMappForm from './component';

export interface VueMappSubmitData<T> {
    data: T;
    event: Event | null;
    form: VueMappForm;
}