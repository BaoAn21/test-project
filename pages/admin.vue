<template>
  <div class="function-button">
    <!-- BUTTON FUNCTION -->
    <button @click="saveClick">Save</button>
    <button @click="undoClick">Undo</button>
    <button @click="redoClick">Redo</button>

    <!-- EXPORT -->
    <a :href="downLink" download="data.txt">
      <button @click="exportToTxt(element)">Export</button>
    </a>
    <!-- ------ -->

    <!-- IMPORT FUNCTION -->
    <label for="file-upload" class="custom-file-upload">
     Import
    </label>
    <input id="file-upload" type="file" ref="input"/>
    <!-- --------------- -->

    <!-- VIEW -->
    <a href="/customer" target="_blank">
      <button>View</button>
    </a>
    <!-- --- -->
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
          <!-- Config , check for id different than -1 -->
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
      const undo = [];
      const redo = [];
      //CHOSEN COMPONENT TO SETTING
      const elSetting = ref({
        type: '',
        id: -1,
      });
      function resetElSetting(){
        elSetting.value = {
          type: '',
          id: -1,
        }
      }
      //RETURN NUMBER OF INSTANCES
      const elNum = computed(()=>{
        return element.value.length;
      })

      //ON MOUSEMOVE FUNCTION
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

      //ADDING NEW BUTTON TO THE VIEW
      function addButton(){
        element.value.push({
          type: 'button',
          prop: {
            text: '',
            alert: '',
          }
        })
        undo.push({
          type: 'button',
          prop: {
            text: '',
            alert: '',
          }
        })
        redo.length = 0;
      }

      //ADDING NEW PARAGRAPH TO THE VIEW
      function addPara(){
        element.value.push({
          type: 'para',
          prop:{
            text: '',
          }
        })
        undo.push({
          type: 'para',
          prop:{
            text: '',
          }
        })
        redo.length = 0;
      }

      //DETECT WHEN BUTTON DRAG RELEASE
      function bmouseRelease(){
        eButton.value.style.transform = null
        if(mouseX.value > content.value.offsetLeft && mouseY.value > content.value.offsetTop){
          addButton();
        }
      }

      //DETECT WHEN PARA DRAG RELEASE
      function pmouseRelease(){
        ePara.value.style.transform = null;
        if(mouseX.value > content.value.offsetLeft && mouseY.value > content.value.offsetTop){
          addPara();
        }
      }
      
      //WHEN BUTTON ELEMENT IS CLICKED
      function eButtonClick(e){
        let id = e.target.id
        elSetting.value = {
          type: 'button',
          id: id,
        }
      }

      //WHEN PARA IN VIEW IS CLICKED
      function eParaClick(e){
        let id = e.target.id
        elSetting.value = {
          type: 'para',
          id: id,
        }
      }
      
      //SAVE BUTTON CLICKED, SAVE DATA TO LOCAL STORAGE
      function saveClick(){
        localStorage.setItem('element', JSON.stringify(element))
      }

      //EXPORT/ DOWNLOAD FUNCTION
      const downLink = ref();
      function exportToTxt(data) {
        const text = JSON.stringify(data);
        const blob = new Blob([text], { type: 'text/plain' });
        downLink.value = window.URL.createObjectURL(blob)
      }

      //UNDO POP ONE ELEMENT
      function undoClick(){
        if(undo.length != 0){
          //reset avoid bug
          resetElSetting();
          let popEl = element.value.pop();
          console.log(popEl);
          undo.pop();
          redo.push(popEl);
        }else{
          
        }
      }

      function redoClick(){
        if(redo.length != 0){
          //reset avoid bug
          resetElSetting();
          let popEl= redo.pop();
          element.value.push(popEl);
          undo.push(popEl);
        }else{
          
        }
      }
      onMounted(()=>{
        //MOVE MOUSE
        document.addEventListener('mousemove',(event)=>{
          onMousemove(event);
        })

        //BUTTON DRAG
        eButton.value.addEventListener('mousedown',(e)=>{
          bdragging = true;
          draggEl.value = e.srcElement.id
        })
        //PARA DRAG
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
        //TODO LOAD PAST DATA IN LOCAL STORAGE
        if(localStorage.getItem('element')){
          const myData = JSON.parse(localStorage.getItem('element'));
          element.value = myData._value
          console.log('mouted');
        }
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
        saveClick,
        exportToTxt,
        downLink,
        input,
        undoClick,
        redoClick,
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



