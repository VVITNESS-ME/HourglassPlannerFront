import {create} from 'zustand';

type PW = {
    roomPassword: string;
    setPw: (pw:string) => void;
}

const useRoomStore = create<PW>((set)=>({
    roomPassword: '',
    setPw: (pw:string) => set({roomPassword: pw}),
}))
export default useRoomStore;
