<template>
  <div v-for="(item, index) in element" :key="index">
    <button v-if="item.type === 'button'" @click="eButtonClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Button'}` }}</button>
    <p v-else-if="item.type === 'para'" @click="eParaClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Paragraph'}` }}</p>
  </div>
</template>

<script>
export default ({
  setup(prop){
    const element = ref();

    function eButtonClick(e){
      let id = e.target.id
      alert(element.value[id].prop.alert)
    }
    onMounted(()=>{
      // LOADING DATA FROM LOCAL STORAGE
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