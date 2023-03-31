<template>
  <div v-for="(item, index) in element" :key="index">
    <button v-if="item.type === 'button'" @click="eButtonClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Button'}` }}</button>
    <p v-else-if="item.type === 'para'" @click="eParaClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Paragraph'}` }}</p>
  </div>
</template>

<script>
import { useDataElement } from '~~/composables/useDataElement';
import { storeToRefs } from 'pinia';
export default ({
  setup(prop){
    // const element = reactive(useDataElement())
    const element = ref();

    function eButtonClick(e){
      let id = e.target.id
      alert(element.value[id].prop.alert)
    }
    onMounted(()=>{
      // console.log(element.getEl.value);
      // const data = saveData();
      // console.log(data.data);
      const myData = JSON.parse(localStorage.getItem('element'));
      element.value = myData._value
      console.log(element.value); 
    })
    return{
      element,
      eButtonClick,
    }
  }
})

</script>