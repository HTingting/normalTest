Vue.component('portal-panel',{
    props:['item'],
    mounted(){
        console.log('rightBoard---',this.item);
        this.config = this.item.config;
    },
    data(){
        return {
            config:{}
        }
    },
    template: `
            <div class="portal-panel">
                <div class="portal-title">{{config.title}}</div>
                <ul>
                    <li v-for="panelItem in config.dataSource">
                        <p>{{panelItem.text}}</p>
                        <p class="count">{{panelItem.num}}</p>
                    </li>
                </ul>
            </div>
        `
})
