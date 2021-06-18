Vue.component('second-group',{
    proos:['list'],
    data(){
        return {

        }
    },
    template:`
          <div class="second-group">
            <div v-for="listItem in list">
              <draggable
                  tag="div"
                  class="draggable-box"
                  v-bind="{
                    group: 'people',
                    ghostClass: 'moving',
                    animation: 180,
                    handle: '.drag-move'
                  }"
                  :force-fallback="true"
                  v-model="colItem.list"
                  @add="$emit('handleColAdd', $event, colItem.list)"
                >
                    <second-group></second-group>
                </draggable>
            </div>
          </div>
    `
})

const vm = new Vue({
    el:'#container',
    name: "clone",
    display: "Clone",
    order: 2,
    data() {
        return {
            list1: [
                { name: "John", id: 1 },
                { name: "Joao", id: 2 },
                { name: "Jean", id: 3 },
                { name: "Gerard", id: 4 }
            ],
            list2: [
                { name: "Juan", id: 5 },
                { name: "Edgard", id: 6 },
                { name: "Johnson", id: 7 }
            ],
            list3: [
                { name: "Juan", id: 5 },
                { name: "Edgard", id: 6 },
                { name: "Johnson", id: 7 }
            ],

        };
    },
    methods: {
        log: function(evt) {
            window.console.log(evt);
        }
    }
})
