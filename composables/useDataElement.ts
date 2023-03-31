import { defineStore } from "pinia";

export const useDataElement = defineStore('element',()=>{
  const el = ref();
  const getEl = computed(()=>el);
  const setEl = (e) => {
    el.value = e;
  }
  return {
    el,getEl,setEl,
  }
})

export const saveData = () => {
  const data = ref();
  return {data}
}