<template>
  <div class="function-button">
    <button @click="saveClick">Save</button>
    <button>Undo</button>
    <button>Redo</button>
    <a :href="downLink" download="data.txt">
      <button @click="exportToTxt(element)">Export</button>
    </a>
    
    
    <label for="file-upload" class="custom-file-upload">
     Import
    </label>
    <input id="file-upload" type="file" ref="input"/>
  

    <!-- <button>Import</button> -->
    <a href="/customer" target="_blank">
      <button>View</button>
    </a>
    
  </div>

  <div class="main">
    
    <div class="menu">
      <button class="drag-component" id="ElementParagraph" ref="ePara">
        <div class="image">

        </div>
        <p>Paragraph</p>
      </button>
        
      <button class="drag-component" id="ElementButton" ref="eButton">
        <div class="image">

        </div>
        <p>Button</p>
      </button>
        
    </div>
    <div class="content" ref="content">
      <div class="main-component">
        <div class="info">
          <p>Mouse: {{ `(${mouseX},${mouseY})` }}</p>
          <p>Dragging {{ `${draggEl ? draggEl: ''}` }}</p>
          <p>Instances {{ `${elNum? elNum: ''}` }}</p>
          <p>Config {{ elSetting.id == -1 ? null: JSON.stringify({
              id:elSetting.id,
              ...element[elSetting.id]
            }) }}</p>
        </div>
        <div class="component">
          <div v-for="(item, index) in element" :key="index">
            <button v-if="item.type === 'button'" @click="eButtonClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Button'}` }}</button>
            <p v-else-if="item.type === 'para'" @click="eParaClick" :id="index">{{ `${item.prop.text ? item.prop.text : 'Paragraph'}` }}</p>
          </div>
        </div>
      </div>
      

      <div class="setting">
        <div v-if="elSetting.type === 'button'">
          <p>Button Text</p>
          <input type="text" v-model="element[elSetting.id].prop.text">
          <p>Alert Message</p>
          <input type="text" v-model="element[elSetting.id].prop.alert">
        </div>
        <div v-if="elSetting.type === 'para'">
          <p>Paragraph Text</p>
          <input type="text" v-model="element[elSetting.id].prop.text">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  export default ({

    setup(){
      const input = ref();
      const ePara = ref();
      const eButton = ref();
      const mouseX = ref();
      const mouseY = ref();
      const content = ref();
      let bdragging = false;
      let pdragging = false;
      const draggEl = ref();
      const element = ref([]);
      const buttonElement = ref<[]>([]);
      const paraElement = ref<[]>([]);
      const elSetting = ref({
        type: '',
        id: -1,
      });
      // function onDragStart(e){
      //   if(dragging){
      //     console.log(e.srcElement.style.top);
      //     console.log(e);
      //     e.srcElement.style.transform = `translate(${mouseX.value - e.srcElement.offsetLeft}px, ${mouseY.value - e.srcElement.offsetTop}px)`;
      //     console.log(mouseX.value - e.srcElement.offsetLeft);
      //   }
      // }
      
      const elNum = computed(()=>{
        return element.value.length;
      })
      function onMousemove(e){
        mouseX.value = e.clientX;
        mouseY.value = e.clientY;
        if(bdragging){
          eButton.value.style.transform = `translate(${mouseX.value - eButton.value.offsetLeft}px, ${mouseY.value - eButton.value.offsetTop}px)`;
        }
        if(pdragging){
          ePara.value.style.transform = `translate(${mouseX.value - ePara.value.offsetLeft}px, ${mouseY.value - ePara.value.offsetTop}px)`;
        }
      }
      function addButton(){
        element.value.push({
          type: 'button',
          prop: {
            text: '',
            alert: '',
          }
        })
      }
      function addPara(){
        element.value.push({
          type: 'para',
          prop:{
            text: '',
          }
        })
      }
      function bmouseRelease(){
        eButton.value.style.transform = null
        if(mouseX.value > content.value.offsetLeft && mouseY.value > content.value.offsetTop){
          console.log('add button');
          addButton();
        }
      }
      function pmouseRelease(){
        ePara.value.style.transform = null;
        if(mouseX.value > content.value.offsetLeft && mouseY.value > content.value.offsetTop){
          console.log('add para');
          addPara();
        }
      }
      
      function eButtonClick(e){
        console.log('button', e.target.id);
        let id = e.target.id
        // element.value[id].prop.text = "haha"
        elSetting.value = {
          type: 'button',
          // prop: {
          //   text: element.value[id].prop.text,
          //   alert: element.value[id].prop.alert,
          // },
          id: id,
        }
      }
      function eParaClick(e){
        let id = e.target.id
        console.log('para',e.target.id);
        // element.value[id].prop.text = "haha";
        elSetting.value = {
          type: 'para',
          // prop: {
          //   text: element.value[id].prop.text
          // },
          id: id,
        }
      }
      function viewClick(){
        // const state = useDataElement();
        // // elData.value = element.value;
        // state.setEl(element.value)
        // console.log(state.getEl.value);
        // const data = saveData();
        // data.data = element;
        localStorage.setItem('element', JSON.stringify(element))
      }

      function saveClick(){
        localStorage.setItem('element', JSON.stringify(element))
      }

      const downLink = ref();
      function exportToTxt(data) {
        const text = JSON.stringify(data);
        const blob = new Blob([text], { type: 'text/plain' });
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        downLink.value = window.URL.createObjectURL(blob)
        // link.download = 'data.txt';
        // link.click();
      }

      onMounted(()=>{
        console.dir(content.value);
        document.addEventListener('mousemove',(event)=>{
          onMousemove(event);
        })

        eButton.value.addEventListener('mousedown',(e)=>{
          bdragging = true;
          draggEl.value = e.srcElement.id
        })
        ePara.value.addEventListener('mousedown',(e)=>{
          pdragging = true;
          draggEl.value = e.srcElement.id
        })

        eButton.value.addEventListener('mouseup',(e)=>{
          console.log('nha');
          bdragging = false;
          draggEl.value = null;
          bmouseRelease();
        })
        ePara.value.addEventListener('mouseup',(e)=>{
          console.log('nha');
          pdragging = false;
          draggEl.value = null;
          pmouseRelease();
        })
        
        //import
        input.value.addEventListener('change', () => {
          let fr = new FileReader();
          fr.readAsText(input.value.files[0])
          fr.onload = () =>{
            console.log(fr.result);
            element.value = JSON.parse(fr.result);
          }

        })
      })
      return{
        mouseX,
        mouseY,
        eButton,
        ePara,
        content,
        draggEl,
        buttonElement,
        paraElement,
        element,
        eButtonClick,
        eParaClick,
        elNum,
        elSetting,
        viewClick,
        saveClick,
        exportToTxt,
        downLink,
        input,
      }
    }
  })

</script>

<style>
.function-button {
  display: flex;
  justify-content: center;
  /* position: absolute; */
  /* top: 0; */
  width: 100%;
  margin-bottom: 10px;
}
.main{
  padding: 3px;
  border-top: 1px solid black;
  display: flex;
  width: 100%;
  height: 100vh;
  border-bottom: 1px solid black;
}
.menu{
  /* padding: 3px; */
  width: 15%;
  border-right: 1px solid black;
}
.content{
  padding: 3px;
  width: 85%;
  display: flex;
  flex-direction: column;
}
.info{
  width: 50%;
}
.main-component{
  display: flex;
  width: 100%;
  height: 70%;
}
.component{
  width: 50%;
}
.setting{
  border-top: 1px solid black;
}
.drag-component{
  width: 100%;
  height: 100px;
  border: none;
  background-color: inherit;
  cursor: pointer;
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.menu button:hover {
  background-color: #ddd;
}
.image{
  width: 30px;
  height: 30px;
  pointer-events: none;
  border: 1px solid black;
}
.drag-component p{
  pointer-events: none;
}

input[type="file"] {
    display: none;
}
.custom-file-upload {
    border: 1px solid #ccc;
    display: inline-block;
    cursor: pointer;
}
</style>